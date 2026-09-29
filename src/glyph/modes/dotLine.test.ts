import { describe, expect, it } from 'vitest'
import { dotLineNotation, dotLineSvg } from './dotLine'

describe('dotLineSvg', () => {
  it('returns svg string', () => {
    const svg = dotLineSvg(0, 40)
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('renders dots for upper 4 bits', () => {
    const svg = dotLineSvg(0b11110000, 40)
    expect(svg.match(/<circle/g)?.length).toBeGreaterThan(0)
  })

  it('renders line for lower 4 bits', () => {
    const svg = dotLineSvg(0b00000001, 40)
    expect(svg).toContain('<line')
  })
})

describe('dotLineNotation', () => {
  it('formats dot bits and line endpoints', () => {
    expect(dotLineNotation(0b11110000)).toBe('1111 00-00')
    expect(dotLineNotation(0b00001001)).toBe('0000 10-01')
  })
})
