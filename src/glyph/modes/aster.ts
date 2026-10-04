import {
  DEFAULT_GLYPH_SIZE,
  type AsterFillColor,
  type AsterFillMode,
  type GlyphResult,
  type BaseGlyphOptions,
} from '../types.js'
import {
  DEFAULT_PALETTE,
  fillAttr,
  resolvePalette,
  strokeAttr,
} from '../palette.js'

export interface AsterOptions extends BaseGlyphOptions {
  fillMode: AsterFillMode
  fillColor: AsterFillColor
  cross: boolean
  monochrome: boolean
}

interface AsterSvgResult {
  svg: string
}

// Aster 8方向の配色（上から時計回りの色相環）
export const ASTER_COLORS = DEFAULT_PALETTE.spectrum.map(({ color }) => color)

export function asterSvg(
  index: number,
  size = 40,
  options: {
    fillMode?: AsterFillMode
    fillColor?: AsterFillColor
    cross?: boolean
  } = {},
  palette = resolvePalette({}, 'aster')
): AsterSvgResult {
  const fillMode = options.fillMode ?? 'solid'
  const fillColor = options.fillColor ?? 'run'
  const cross = options.cross ?? true
  // 8 色より短い spectrum (例: 2 色交互) は繰り返して 8 方向に割り当てる
  const spectrumAt = (i: number) =>
    palette.spectrum[i % palette.spectrum.length]

  // 8方向の放射線。bit7=上、bit6=右上、...、bit0=左上（時計回り）
  const cx = size / 2
  const cy = size / 2
  const pad = size * 0.12
  const r = size / 2 - pad
  const lineWidth = Math.max(1.5, size * 0.05)

  const on = (i: number) => (index >> (7 - i)) & 1
  const pointAt = (i: number) => {
    const angle = -Math.PI / 2 + i * (Math.PI / 4)
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const
  }
  const runStart = (i: number) => {
    let s = i
    let guard = 0
    while (on((s - 1 + 8) % 8) && guard < 8) {
      s = (s - 1 + 8) % 8
      guard++
    }
    return s
  }

  const parts: string[] = []

  if (cross) {
    const guideWidth = Math.max(0.5, size * 0.012)
    parts.push(
      `<line x1="${cx}" y1="${pad}" x2="${cx}" y2="${size - pad}" ${strokeAttr(palette.guide)} stroke-width="${guideWidth}"/>`
    )
    parts.push(
      `<line x1="${pad}" y1="${cy}" x2="${size - pad}" y2="${cy}" ${strokeAttr(palette.guide)} stroke-width="${guideWidth}"/>`
    )
  }

  if (fillMode !== 'none') {
    const fillOpacity = fillMode === 'solid' ? 1 : 0.32
    for (let i = 0; i < 8; i++) {
      const next = (i + 1) % 8
      if (on(i) && on(next)) {
        const colorIdx = fillColor === 'run' ? runStart(i) : i
        const fill = spectrumAt(colorIdx)
        const [x1, y1] = pointAt(i)
        const [x2, y2] = pointAt(next)
        parts.push(
          `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" ${fillAttr(fill, fillOpacity)} stroke="none"/>`
        )
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    if (!on(i)) continue
    const coveredByFill =
      fillMode !== 'none' && (on((i + 7) % 8) || on((i + 1) % 8))
    if (coveredByFill) continue
    const spokeColor = spectrumAt(i)
    const [x2, y2] = pointAt(i)
    parts.push(
      `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" ${strokeAttr(spokeColor)} stroke-width="${lineWidth}" stroke-linecap="round"/>`
    )
  }

  return {
    svg: `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${parts.join('')}</svg>`,
  }
}

export function asterNotation(index: number): string {
  const bits = index.toString(2).padStart(8, '0')
  return bits.match(/.{2}/g)?.join('-') ?? bits
}

export function renderAster(
  index: number,
  options: Partial<AsterOptions> = {}
): GlyphResult {
  const { svg } = asterSvg(
    index,
    options.size ?? DEFAULT_GLYPH_SIZE,
    options,
    resolvePalette(options, 'aster')
  )
  return { svg, notation: asterNotation(index) }
}
