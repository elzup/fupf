import { describe, expect, it } from 'vitest'
import { triSplitNotation, triSplitSvg } from './triSplit'

describe('triSplitSvg', () => {
  it('returns svg string', () => {
    const svg = triSplitSvg(0, 40, 'normal')
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('renders quadrants', () => {
    const svg = triSplitSvg(0b11111111, 40, 'normal')
    expect(svg.match(/<polygon/g)?.length).toBe(8)
  })

  it('changes diagonal direction for rhombus variant', () => {
    const normal = triSplitSvg(0b10000000, 40, 'normal')
    const rhombus = triSplitSvg(0b10000000, 40, 'rhombus')
    expect(normal).not.toBe(rhombus)
  })
})

describe('triSplitNotation', () => {
  it('formats quadrants as hyphen-separated bits', () => {
    expect(triSplitNotation(0b11111111)).toBe('11-11-11-11')
    expect(triSplitNotation(0b10010000)).toBe('10-01-00-00')
  })
})
