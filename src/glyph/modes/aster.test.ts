import { describe, expect, it } from 'vitest'
import { resolvePalette } from '../palette'
import { asterNotation, asterSvg } from './aster'

describe('asterSvg', () => {
  it('returns svg', () => {
    expect(asterSvg(0b10000000, 40).svg).toContain('<svg')
  })

  it('renders cross guides when enabled', () => {
    const withCross = asterSvg(0, 40, { cross: true })
    const withoutCross = asterSvg(0, 40, { cross: false })
    expect(withCross.svg.match(/<line/g)?.length).toBe(2)
    expect(withoutCross.svg.match(/<line/g)).toBeNull()
  })

  it('uses monochrome color when enabled', () => {
    const result = asterSvg(
      0b10000000,
      40,
      {},
      resolvePalette({ monochrome: true })
    )
    expect(result.svg).toContain('currentColor')
    expect(result.svg).not.toContain('#ef4444')
  })
})

describe('asterNotation', () => {
  it('formats 8-bit index as hyphenated 2-bit groups', () => {
    expect(asterNotation(0b00000000)).toBe('00-00-00-00')
    expect(asterNotation(0b11111111)).toBe('11-11-11-11')
    expect(asterNotation(0b10010011)).toBe('10-01-00-11')
  })
})
