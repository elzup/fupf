import { DEFAULT_GLYPH_SIZE, type GlyphResult, type SizeOption } from '../types'

export interface DotLineOptions extends SizeOption {
  monochrome: boolean
}

export function dotLineSvg(
  index: number,
  size = 40,
  monochrome = false
): string {
  // 上位4bit: 4隅の丸点有無（bit7=左上, bit6=右上, bit5=左下, bit4=右下）
  // 下位4bit: 線分（bit3-2=始点, bit1-0=終点）
  const dotBits = (index >> 4) & 0x0f
  const lineStart = (index >> 2) & 3
  const lineEnd = index & 3
  const pad = size * 0.2
  const far = size - pad
  const cornerCoords: [number, number][] = [
    [pad, pad],
    [far, pad],
    [pad, far],
    [far, far],
  ]

  const dotRadius = Math.max(2.5, size * 0.055)
  const lineWidth = Math.max(1.5, size * 0.05)

  const dots = cornerCoords
    .map(([x, y], idx) => {
      const hasDot = (dotBits >> (3 - idx)) & 1
      if (!hasDot) return ''
      return `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="#e4e4e7"/>`
    })
    .join('')

  const [sx, sy] = cornerCoords[lineStart]
  const [ex, ey] = cornerCoords[lineEnd]
  const lineColor = monochrome ? '#e4e4e7' : '#22d3ee'
  const startMarker = (x: number, y: number) => `
    <circle cx="${x}" cy="${y}" r="${dotRadius * 0.7}" fill="none" stroke="${lineColor}" stroke-width="${lineWidth}" opacity="0.6"/>
    <circle cx="${x}" cy="${y}" r="${dotRadius * 1.3}" fill="none" stroke="${lineColor}" stroke-width="${lineWidth}"/>
  `
  let line = ''
  if (lineStart === lineEnd) {
    line = startMarker(sx, sy)
  } else {
    line = `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${lineColor}" stroke-width="${lineWidth}" stroke-linecap="round"/>${startMarker(sx, sy)}`
  }

  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" style="color:#e4e4e7">${dots}${line}</svg>`
}

export function dotLineNotation(index: number): string {
  const dotBits = (index >> 4) & 0x0f
  const lineStart = (index >> 2) & 3
  const lineEnd = index & 3
  const dots = dotBits.toString(2).padStart(4, '0')
  return `${dots} ${lineStart.toString(2).padStart(2, '0')}-${lineEnd.toString(2).padStart(2, '0')}`
}

export function renderDotLine(
  index: number,
  options: Partial<DotLineOptions> = {}
): GlyphResult {
  return {
    svg: dotLineSvg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      options.monochrome ?? false
    ),
    notation: dotLineNotation(index),
  }
}
