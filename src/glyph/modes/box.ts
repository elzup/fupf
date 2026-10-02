import {
  DEFAULT_GLYPH_SIZE,
  type BoxEdgeColor,
  type GlyphResult,
  type SizeOption,
} from '../types'

export interface BoxOptions extends SizeOption {
  edgeColor: BoxEdgeColor
  monochrome: boolean
}

export const BOX_CELLS: Record<string, [number, number]> = {
  top: [0, 1],
  left: [1, 0],
  center: [1, 1],
  right: [1, 2],
  bottom: [2, 1],
}

export const BOX_ARM_ORDER = ['top', 'right', 'bottom', 'left'] as const

function boxCorner(
  r: number,
  c: number,
  corner: number,
  cell: number,
  inset: number
): [number, number] {
  const x0 = c * cell
  const y0 = r * cell
  const left = x0 + inset
  const right = x0 + cell - inset
  const top = y0 + inset
  const bottom = y0 + cell - inset
  switch (corner) {
    case 0:
      return [left, top]
    case 1:
      return [right, top]
    case 2:
      return [left, bottom]
    case 3:
      return [right, bottom]
    default:
      return [left, top]
  }
}

export function boxSvg(
  index: number,
  size = 40,
  boxEdgeColor: BoxEdgeColor = 'single',
  monochrome = false
): string {
  const cell = size / 3
  const inset = cell * 0.2
  const lineWidth = Math.max(1.5, size * 0.05)
  const frameWidth = Math.max(0.5, size * 0.012)
  const dotR = Math.max(1.6, size * 0.05)

  const frame = Object.values(BOX_CELLS)
    .map(
      ([r, c]) =>
        `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="none" stroke="#3f3f46" stroke-width="${frameWidth}"/>`
    )
    .join('')

  const points = BOX_ARM_ORDER.map((arm, k) => {
    const [r, c] = BOX_CELLS[arm]
    return boxCorner(r, c, (index >> (6 - k * 2)) & 3, cell, inset)
  })

  const defs: string[] = []
  const segs = points
    .map(([x1, y1], i) => {
      const [x2, y2] = points[(i + 1) % 4]
      let stroke: string
      if (monochrome) {
        stroke = '#e4e4e7'
      } else if (boxEdgeColor === 'angle') {
        const is45 =
          Math.abs(Math.abs(x2 - x1) - Math.abs(y2 - y1)) < size * 0.01
        stroke = is45 ? '#f472b6' : '#22d3ee'
      } else if (boxEdgeColor === 'xy') {
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const hue = ((mx / size) * 180 + (my / size) * 180) % 360
        stroke = `hsl(${hue.toFixed(0)}, 70%, 60%)`
      } else if (boxEdgeColor === 'grad') {
        const id = `bg-${size}-${index}-${i}`
        const h1 = (i / 4) * 360
        const h2 = ((i + 1) / 4) * 360
        defs.push(
          `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="hsl(${h1}, 70%, 60%)"/><stop offset="1" stop-color="hsl(${h2}, 70%, 60%)"/></linearGradient>`
        )
        stroke = `url(#${id})`
      } else {
        stroke = '#22d3ee'
      }
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${lineWidth}" stroke-linecap="round"/>`
    })
    .join('')
  const defsEl = defs.length ? `<defs>${defs.join('')}</defs>` : ''

  const dots = points
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${dotR}" fill="#e4e4e7"/>`)
    .join('')

  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${defsEl}${frame}${segs}${dots}</svg>`
}

export function boxNotation(index: number): string {
  const arms: string[] = []
  for (let k = 0; k < 4; k++)
    arms.push(((index >> (6 - k * 2)) & 3).toString(2).padStart(2, '0'))
  return arms.join('-')
}

export function renderBox(
  index: number,
  options: Partial<BoxOptions> = {}
): GlyphResult {
  return {
    svg: boxSvg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      options.edgeColor ?? 'single',
      options.monochrome ?? false
    ),
    notation: boxNotation(index),
  }
}
