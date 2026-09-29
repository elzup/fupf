import { stateFromIndex, type PatternState } from '../bits'
import { DEFAULT_GLYPH_SIZE, type GlyphResult, type SizeOption } from '../types'

export interface SymbolsOptions extends SizeOption {
  /** 0: なし / \ X, 1: 点の大きさ, 2: — | +, 3: マルバツ */
  symbolSet: number
}

const SYMBOL_SETS = [
  {
    name: 'なし / \\ X',
    render: (v: number, x: number, y: number, s: number, w: number) => {
      const m = s * 0.18
      const attrs = `stroke="#e4e4e7" stroke-width="${w}" fill="none" stroke-linecap="round"`
      if (v === 0) return ''
      if (v === 1)
        return `<line x1="${x + m}" y1="${y + s - m}" x2="${x + s - m}" y2="${y + m}" ${attrs}/>`
      if (v === 2)
        return `<line x1="${x + m}" y1="${y + m}" x2="${x + s - m}" y2="${y + s - m}" ${attrs}/>`
      return `<line x1="${x + m}" y1="${y + s - m}" x2="${x + s - m}" y2="${y + m}" ${attrs}/><line x1="${x + m}" y1="${y + m}" x2="${x + s - m}" y2="${y + s - m}" ${attrs}/>`
    },
  },
  {
    name: '点の大きさ',
    render: (v: number, x: number, y: number, s: number) => {
      const cx = x + s / 2
      const cy = y + s / 2
      const radii = [0, s * 0.08, s * 0.16, s * 0.24]
      const r = radii[v]
      if (r === 0) return ''
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e4e4e7"/>`
    },
  },
  {
    name: '— | +',
    render: (v: number, x: number, y: number, s: number, w: number) => {
      const cx = x + s / 2
      const cy = y + s / 2
      const attrs = `stroke="#e4e4e7" stroke-width="${w}" fill="none" stroke-linecap="butt"`
      if (v === 0) return ''
      if (v === 1)
        return `<line x1="${x}" y1="${cy}" x2="${x + s}" y2="${cy}" ${attrs}/>`
      if (v === 2)
        return `<line x1="${cx}" y1="${y}" x2="${cx}" y2="${y + s}" ${attrs}/>`
      return `<line x1="${x}" y1="${cy}" x2="${
        x + s
      }" y2="${cy}" ${attrs}/><line x1="${cx}" y1="${y}" x2="${cx}" y2="${
        y + s
      }" ${attrs}/>`
    },
  },
]

const MARUBATSU_SYMBOL_SET = 3
const CIRCLE_BITS = [1, 2, 2, 1] as const
const CROSS_BITS = [2, 1, 1, 2] as const

export function symbolGridSvg(
  state: PatternState,
  currentSymbolSet: number,
  size = 40,
): string {
  const strokeWidth = Math.max(1.5, size * 0.045)
  if (currentSymbolSet === MARUBATSU_SYMBOL_SET) {
    const symbols = renderMarubatsu(state, size, strokeWidth)
    return wrapSymbolSvg(symbols, size)
  }

  const { a, b, c, d } = state
  const cellSize = size / 2
  const render = SYMBOL_SETS[currentSymbolSet].render
  const cells = [
    render(a, 0, 0, cellSize, strokeWidth),
    render(b, cellSize, 0, cellSize, strokeWidth),
    render(c, 0, cellSize, cellSize, strokeWidth),
    render(d, cellSize, cellSize, cellSize, strokeWidth),
  ].join('')
  return wrapSymbolSvg(cells, size)
}

function wrapSymbolSvg(content: string, size: number): string {
  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" style="color:#e4e4e7">${content}</svg>`
}

function renderMarubatsu(
  { a, b, c, d }: PatternState,
  size: number,
  strokeWidth: number,
): string {
  const values = [a, b, c, d]
  const idBase = `marubatsu-${values.join('')}-${size}`
  const circleClipId = `${idBase}-circle`
  const crossClipId = `${idBase}-cross`
  const circleRects = renderQuadrantRects(values, size, CIRCLE_BITS)
  const crossRects = renderQuadrantRects(values, size, CROSS_BITS)
  const definitions = `${renderClipPath(
    circleClipId,
    circleRects,
  )}${renderClipPath(crossClipId, crossRects)}`
  const attributes = `stroke="#e4e4e7" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round"`
  const center = size / 2
  const margin = size * 0.12
  const circle = circleRects
    ? `<circle data-marubatsu="circle" cx="${center}" cy="${center}" r="${
        size * 0.38
      }" clip-path="url(#${circleClipId})" ${attributes}/>`
    : ''
  const cross = crossRects
    ? `<g data-marubatsu="cross" clip-path="url(#${crossClipId})"><line x1="${margin}" y1="${margin}" x2="${
        size - margin
      }" y2="${size - margin}" ${attributes}/><line x1="${
        size - margin
      }" y1="${margin}" x2="${margin}" y2="${
        size - margin
      }" ${attributes}/></g>`
    : ''
  return `<defs>${definitions}</defs>${circle}${cross}`
}

function renderQuadrantRects(
  values: number[],
  size: number,
  quadrantBits: readonly [number, number, number, number],
): string {
  const cellSize = size / 2
  return values
    .map((value, index) => {
      if ((value & quadrantBits[index]) === 0) return ''
      const x = (index % 2) * cellSize
      const y = Math.floor(index / 2) * cellSize
      return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/>`
    })
    .join('')
}

function renderClipPath(id: string, rectangles: string): string {
  return rectangles ? `<clipPath id="${id}">${rectangles}</clipPath>` : ''
}

export function symbolNotation({ a, b, c, d }: PatternState): string {
  return [a, b, c, d].map((v) => v.toString(2).padStart(2, '0')).join(' ')
}

export function renderSymbolPreview(
  value: number,
  symbolSetIndex: number,
  size = 18,
  strokeWidth = 2,
): string {
  if (symbolSetIndex === MARUBATSU_SYMBOL_SET) {
    const symbols = renderMarubatsu(
      { a: value, b: value, c: value, d: value },
      size,
      strokeWidth,
    )
    return `<svg viewBox="0 0 ${size} ${size}" width="18" height="18">${symbols}</svg>`
  }
  const render = SYMBOL_SETS[symbolSetIndex].render
  return `<svg viewBox="0 0 ${size} ${size}" width="18" height="18">${render(value, 0, 0, size, strokeWidth)}</svg>`
}

export function renderSymbols(
  index: number,
  options: Partial<SymbolsOptions> = {},
): GlyphResult {
  const state = stateFromIndex(index)
  return {
    svg: symbolGridSvg(
      state,
      options.symbolSet ?? 0,
      options.size ?? DEFAULT_GLYPH_SIZE,
    ),
    notation: symbolNotation(state),
  }
}
