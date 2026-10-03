import { fmt2bit, stateFromIndex, type PatternState } from '../bits.js'
import {
  DEFAULT_GLYPH_SIZE,
  type GlyphResult,
  type SizeOption,
} from '../types.js'

export interface PathOptions extends SizeOption {
  /** 同じ座標・区間を複数回通るとき線や点を太くする */
  highlight: boolean
  monochrome: boolean
}

interface PathSvgResult {
  svg: string
  separators: string[]
}

function cornerPoint(code: number, size: number): [number, number] {
  const pad = size * 0.2
  const far = size - pad
  switch (code) {
    case 0:
      return [pad, pad]
    case 1:
      return [far, pad]
    case 2:
      return [pad, far]
    case 3:
      return [far, far]
    default:
      return [pad, pad]
  }
}

export function pathSvg(
  { a, b, c, d }: PatternState,
  size = 40,
  highlight = false,
  monochrome = false
): PathSvgResult {
  const sequence = [a, b, c, d]
  const points = sequence.map((code) => cornerPoint(code, size))
  const colors = monochrome
    ? ['#e4e4e7', '#e4e4e7', '#e4e4e7']
    : ['#22d3ee', '#f472b6', '#facc15']
  const baseStrokeWidth = Math.max(1.5, size * 0.06)
  const arrowLen = size * 0.1
  const baseDotRadius = Math.max(2, size * 0.04)
  const fontSize = size * 0.15
  const segments: string[] = []
  const separators: string[] = []

  const visitCounts = [0, 0, 0, 0]
  sequence.forEach((code) => visitCounts[code]++)

  const segmentCounts: Record<string, number> = {}
  for (let i = 0; i < 3; i++) {
    const key = [sequence[i], sequence[i + 1]].toSorted().join('-')
    segmentCounts[key] = (segmentCounts[key] || 0) + 1
  }

  for (let i = 0; i < 3; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const color = colors[i]

    if (x1 === x2 && y1 === y2) {
      separators.push('=')
      if (highlight) {
        const loopRadius = baseDotRadius * 2
        const thickness = baseStrokeWidth * visitCounts[sequence[i]]
        segments.push(
          `<circle cx="${x1}" cy="${y1}" r="${loopRadius}" fill="none" stroke="${color}" stroke-width="${thickness}"/>`
        )
      }
      continue
    }

    const isAxisAligned = x1 === x2 || y1 === y2
    separators.push(isAxisAligned ? '-' : '~')

    const key = [sequence[i], sequence[i + 1]].toSorted().join('-')
    const segCount = segmentCounts[key] || 1
    const strokeWidth = highlight
      ? baseStrokeWidth * (1 + (segCount - 1) * 0.8)
      : baseStrokeWidth

    const dashes = [
      '',
      `${size * 0.1} ${size * 0.075}`,
      `${size * 0.03} ${size * 0.05}`,
    ]
    const dash = dashes[i]
    const lineAttrs = `stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}`
    segments.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" fill="none" ${lineAttrs}/>`
    )

    const angle = Math.atan2(y2 - y1, x2 - x1)
    const arrowAngle = Math.PI / 6
    const ax1 = x2 - arrowLen * Math.cos(angle - arrowAngle)
    const ay1 = y2 - arrowLen * Math.sin(angle - arrowAngle)
    const ax2 = x2 - arrowLen * Math.cos(angle + arrowAngle)
    const ay2 = y2 - arrowLen * Math.sin(angle + arrowAngle)
    segments.push(
      `<polygon points="${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}" fill="${color}"/>`
    )
  }

  const pointMarkers = points
    .map(([x, y], idx) => {
      const code = sequence[idx]
      const count = visitCounts[code]
      const radius = highlight
        ? baseDotRadius * (1 + (count - 1) * 0.6)
        : baseDotRadius
      const strokeWidth = highlight
        ? baseStrokeWidth * (1 + (count - 1) * 0.5)
        : baseStrokeWidth * 0.4
      return `
        <circle cx="${x}" cy="${y}" r="${radius}" fill="#18181b" stroke="#e4e4e7" stroke-width="${strokeWidth}"/>
        <text x="${x}" y="${y + fontSize * 0.05}" text-anchor="middle" dominant-baseline="middle" fill="#e4e4e7" font-size="${fontSize}" font-family="ui-monospace, monospace">${idx + 1}</text>
      `
    })
    .join('')

  return {
    svg: `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${segments.join('')}${pointMarkers}</svg>`,
    separators,
  }
}

export function pathNotation(
  { a, b, c, d }: PatternState,
  separators: string[]
): string {
  return `${fmt2bit(a)}${separators[0]}${fmt2bit(b)}${separators[1]}${fmt2bit(c)}${separators[2]}${fmt2bit(d)}`
}

export function renderPath(
  index: number,
  options: Partial<PathOptions> = {}
): GlyphResult {
  const state = stateFromIndex(index)
  const { svg, separators } = pathSvg(
    state,
    options.size ?? DEFAULT_GLYPH_SIZE,
    options.highlight ?? false,
    options.monochrome ?? false
  )
  return { svg, notation: pathNotation(state, separators) }
}
