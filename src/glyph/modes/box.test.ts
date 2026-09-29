import { describe, expect, it } from 'vitest'
import { boxNotation, boxSvg } from './box'

describe('boxSvg', () => {
  it('returns svg string', () => {
    const svg = boxSvg(0, 40, 'single', false)
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('renders frame rects', () => {
    const svg = boxSvg(0, 40, 'single', false)
    expect(svg.match(/<rect/g)?.length).toBe(5)
  })

  it('uses single color by default', () => {
    const svg = boxSvg(0, 40, 'single', false)
    expect(svg).toContain('#22d3ee')
  })

  it('uses monochrome when enabled', () => {
    const svg = boxSvg(0, 40, 'single', true)
    expect(svg).toContain('#e4e4e7')
    expect(svg).not.toContain('#22d3ee')
  })

  it('renders gradient definitions for grad mode', () => {
    const svg = boxSvg(0, 40, 'grad', false)
    expect(svg).toContain('<defs>')
    expect(svg).toContain('<linearGradient')
  })
})

describe('boxNotation', () => {
  it('formats index as hyphen-separated 2-bit arm codes', () => {
    expect(boxNotation(0b00000000)).toBe('00-00-00-00')
    expect(boxNotation(0b11111111)).toBe('11-11-11-11')
  })
})
