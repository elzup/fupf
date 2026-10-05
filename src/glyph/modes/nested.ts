import {
  DEFAULT_GLYPH_SIZE,
  type GlyphResult,
  type NestedStyle,
  type BaseGlyphOptions,
} from '../types.js'
import {
  fillAttr,
  resolvePalette,
  strokeAttr,
  type GlyphPalette,
} from '../palette.js'

export interface NestedOptions extends BaseGlyphOptions {
  style: NestedStyle
}

type Point = [number, number]

interface NestedFrame {
  outer: [Point, Point, Point, Point]
  inner: [Point, Point, Point, Point]
  center: Point
}

// 上・右・下・左の順に、外枠と内枠の角 (時計回り) を返す
function nestedFrame(size: number): NestedFrame {
  const pad = size * 0.08
  const far = size - pad
  const mid = size / 2
  // 内枠は外枠の半分の辺。外の台形と内の三角形の高さがそろう
  const half = (far - pad) / 4
  const near = mid - half
  const away = mid + half
  return {
    outer: [
      [pad, pad],
      [far, pad],
      [far, far],
      [pad, far],
    ],
    inner: [
      [near, near],
      [away, near],
      [away, away],
      [near, away],
    ],
    center: [mid, mid],
  }
}

// 方向 k (0=上, 1=右, 2=下, 3=左) の区画。外と内が両方 1 なら 1 つの大きな三角形になる
function regionShape(
  frame: NestedFrame,
  k: number,
  outerOn: boolean,
  innerOn: boolean
): Point[] {
  const next = (k + 1) % 4
  const { outer, inner, center } = frame
  if (outerOn && innerOn) return [outer[k], outer[next], center]
  if (outerOn) return [outer[k], outer[next], inner[next], inner[k]]
  return [inner[k], inner[next], center]
}

function regionShapes(index: number, frame: NestedFrame): Point[][] {
  return [0, 1, 2, 3].flatMap((k) => {
    const outerOn = ((index >> (7 - k)) & 1) === 1
    const innerOn = ((index >> (3 - k)) & 1) === 1
    if (!outerOn && !innerOn) return []
    return [regionShape(frame, k, outerOn, innerOn)]
  })
}

function guideLines(frame: NestedFrame, guide: string): string[] {
  const { outer, inner } = frame
  const squares = [outer, inner].map(
    (corners) =>
      `<polygon points="${pointsAttr(corners)}" fill="none" ${guide}/>`
  )
  const diagonals = [
    [outer[0], outer[2]],
    [outer[1], outer[3]],
  ].map(
    ([[x1, y1], [x2, y2]]) =>
      `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" ${guide}/>`
  )
  return [...squares, ...diagonals]
}

// 0.08 倍などの計算で出る 11.600000000000001 のような誤差を SVG に出さない
const round = (value: number) => Math.round(value * 100) / 100

function pointsAttr(points: Point[]): string {
  return points.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')
}

export function nestedSvg(
  index: number,
  size = DEFAULT_GLYPH_SIZE,
  style: NestedStyle = 'fill',
  palette: GlyphPalette = resolvePalette({}, 'nested')
): string {
  const frame = nestedFrame(size)
  const guide = `${strokeAttr(palette.guide)} stroke-width="0.5"`
  // ボーダーは補助線と区別できる太さにし、角で途切れないよう round で結ぶ
  const paint =
    style === 'fill'
      ? fillAttr(palette.fg)
      : `fill="none" ${strokeAttr(palette.fg)} stroke-width="${round(size * 0.04)}" stroke-linejoin="round"`
  const regions = regionShapes(index, frame).map(
    (points) => `<polygon points="${pointsAttr(points)}" ${paint}/>`
  )
  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${[...guideLines(frame, guide), ...regions].join('')}</svg>`
}

export function nestedNotation(index: number): string {
  const bits = index.toString(2).padStart(8, '0')
  return `${bits.slice(0, 4)}-${bits.slice(4)}`
}

export function renderNested(
  index: number,
  options: Partial<NestedOptions> = {}
): GlyphResult {
  return {
    svg: nestedSvg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      options.style ?? 'fill',
      resolvePalette(options, 'nested')
    ),
    notation: nestedNotation(index),
  }
}
