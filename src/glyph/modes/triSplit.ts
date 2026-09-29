import {
  DEFAULT_GLYPH_SIZE,
  type GlyphResult,
  type PolygonVariant,
  type SizeOption,
} from '../types'

export interface TriSplitOptions extends SizeOption {
  variant: PolygonVariant
}

export function triSplitSvg(
  index: number,
  size = 40,
  variant: PolygonVariant = 'normal',
): string {
  // 4象限 × 2三角形 = 8bit
  const pad = size * 0.08
  const mid = size / 2
  const far = size - pad

  const quadrants: [number, number, number, number][] = [
    [pad, pad, mid, mid],
    [mid, pad, far, mid],
    [pad, mid, mid, far],
    [mid, mid, far, far],
  ]

  const flipped =
    variant === 'rhombus' ? [0, 3] : variant === 'inverse' ? [1, 2] : []

  const triangles: string[] = []
  quadrants.forEach(([qx1, qy1, qx2, qy2], qIdx) => {
    const highBit = 7 - qIdx * 2
    const lowBit = 6 - qIdx * 2
    const highFilled = (index >> highBit) & 1
    const lowFilled = (index >> lowBit) & 1
    const isFlipped = flipped.includes(qIdx)

    if (!isFlipped) {
      if (highFilled) {
        triangles.push(
          `<polygon points="${qx1},${qy1} ${qx1},${qy2} ${qx2},${qy2}" fill="#e4e4e7"/>`,
        )
      }
      if (lowFilled) {
        triangles.push(
          `<polygon points="${qx1},${qy1} ${qx2},${qy2} ${qx2},${qy1}" fill="#a1a1aa"/>`,
        )
      }
      triangles.push(
        `<line x1="${qx1}" y1="${qy1}" x2="${qx2}" y2="${qy2}" stroke="#3f3f46" stroke-width="0.5"/>`,
      )
    } else {
      if (highFilled) {
        triangles.push(
          `<polygon points="${qx2},${qy1} ${qx1},${qy2} ${qx2},${qy2}" fill="#e4e4e7"/>`,
        )
      }
      if (lowFilled) {
        triangles.push(
          `<polygon points="${qx1},${qy1} ${qx2},${qy1} ${qx1},${qy2}" fill="#a1a1aa"/>`,
        )
      }
      triangles.push(
        `<line x1="${qx2}" y1="${qy1}" x2="${qx1}" y2="${qy2}" stroke="#3f3f46" stroke-width="0.5"/>`,
      )
    }

    triangles.push(
      `<rect x="${qx1}" y="${qy1}" width="${qx2 - qx1}" height="${qy2 - qy1}" fill="none" stroke="#3f3f46" stroke-width="0.5"/>`,
    )
  })

  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${triangles.join('')}</svg>`
}

export function triSplitNotation(index: number): string {
  const qs: string[] = []
  for (let q = 0; q < 4; q++) {
    const highBit = 7 - q * 2
    const lowBit = 6 - q * 2
    qs.push(`${(index >> highBit) & 1}${(index >> lowBit) & 1}`)
  }
  return qs.join('-')
}

export function renderTriSplit(
  index: number,
  options: Partial<TriSplitOptions> = {},
): GlyphResult {
  return {
    svg: triSplitSvg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      options.variant ?? 'normal',
    ),
    notation: triSplitNotation(index),
  }
}
