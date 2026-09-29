import { describe, expect, it } from 'vitest'
import { edgeNotation, glyphSvg } from './edges'

describe('glyphSvg', () => {
  it('returns svg string', () => {
    const svg = glyphSvg(1, 2, 3, 0, 40)
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('renders no edges when all styles are 0', () => {
    const svg = glyphSvg(0, 0, 0, 0, 40)
    expect(svg).toContain('<circle')
    expect(svg).not.toContain('stroke-width="2"')
  })

  it('renders solid edge for style 1', () => {
    const svg = glyphSvg(1, 0, 0, 0, 40)
    expect(svg).toContain('stroke-width="2"')
    expect(svg).not.toContain('stroke-dasharray')
  })

  it('renders dashed edge for style 2', () => {
    const svg = glyphSvg(2, 0, 0, 0, 40)
    expect(svg).toContain('stroke-dasharray="4 3"')
  })

  it('renders wavy edge for style 3', () => {
    const svg = glyphSvg(3, 0, 0, 0, 40)
    expect(svg).toContain('<path')
  })
})

describe('edgeNotation', () => {
  it('formats state as hyphen-separated 2-bit groups', () => {
    expect(edgeNotation({ a: 0, b: 1, c: 2, d: 3 })).toBe('00-01-10-11')
  })
})
