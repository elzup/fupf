import { describe, expect, it } from 'vitest'
import { asterNotation, asterSvg } from './aster'

describe('asterSvg', () => {
  it('returns svg and directions', () => {
    const result = asterSvg(0b10000000, 40)
    expect(result.svg).toContain('<svg')
    expect(result.directions).toEqual(['上'])
  })

  it('returns empty directions for index 0', () => {
    const result = asterSvg(0, 40)
    expect(result.directions).toEqual([])
  })

  it('detects multiple directions', () => {
    const result = asterSvg(0b11110000, 40)
    expect(result.directions).toEqual(['上', '右上', '右', '右下'])
  })

  it('renders cross guides when enabled', () => {
    const withCross = asterSvg(0, 40, { cross: true })
    const withoutCross = asterSvg(0, 40, { cross: false })
    expect(withCross.svg.match(/<line/g)?.length).toBe(2)
    expect(withoutCross.svg.match(/<line/g)).toBeNull()
  })

  it('uses monochrome color when enabled', () => {
    const result = asterSvg(0b10000000, 40, { monochrome: true })
    expect(result.svg).toContain('#e4e4e7')
    expect(result.svg).not.toContain('#f87171')
  })
})

describe('asterNotation', () => {
  it('formats 8-bit index as hyphenated 2-bit groups', () => {
    expect(asterNotation(0b00000000)).toBe('00-00-00-00')
    expect(asterNotation(0b11111111)).toBe('11-11-11-11')
    expect(asterNotation(0b10010011)).toBe('10-01-00-11')
  })
})
