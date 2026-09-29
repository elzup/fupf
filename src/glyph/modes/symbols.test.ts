import { describe, expect, it } from 'vitest'
import { renderSymbolPreview, symbolGridSvg, symbolNotation } from './symbols'

describe('symbolGridSvg', () => {
  it('returns svg string with 4 cells', () => {
    const svg = symbolGridSvg({ a: 0, b: 1, c: 2, d: 3 }, 0, 40)
    expect(svg).toContain('<svg')
    expect(svg.match(/<svg/g)?.length).toBe(1)
  })

  it('renders different symbol sets', () => {
    const set0 = symbolGridSvg({ a: 3, b: 0, c: 0, d: 0 }, 0, 40)
    const set1 = symbolGridSvg({ a: 3, b: 0, c: 0, d: 0 }, 1, 40)
    const set2 = symbolGridSvg({ a: 3, b: 0, c: 0, d: 0 }, 2, 40)
    const set3 = symbolGridSvg({ a: 3, b: 0, c: 0, d: 0 }, 3, 40)
    expect(set0).not.toBe(set1)
    expect(set1).not.toBe(set2)
    expect(set2).not.toBe(set3)
  })

  it('renders all symbol values for each set', () => {
    for (let set = 0; set < 4; set++) {
      for (let v = 0; v < 4; v++) {
        const svg = symbolGridSvg({ a: v, b: v, c: v, d: v }, set, 40)
        expect(svg).toContain('<svg')
      }
    }
  })

  it('renders 11111111 as one large circle over one large cross', () => {
    const svg = symbolGridSvg({ a: 3, b: 3, c: 3, d: 3 }, 3, 40)
    expect(svg.match(/data-marubatsu="circle"/g)).toHaveLength(1)
    expect(svg.match(/data-marubatsu="cross"/g)).toHaveLength(1)
    expect(svg.match(/<circle/g)).toHaveLength(1)
    expect(svg.match(/<line/g)).toHaveLength(2)
  })

  it('maps 01101001 to the large circle and 10010110 to the large cross', () => {
    const circle = symbolGridSvg({ a: 1, b: 2, c: 2, d: 1 }, 3, 40)
    const cross = symbolGridSvg({ a: 2, b: 1, c: 1, d: 2 }, 3, 40)
    expect(circle).toContain('data-marubatsu="circle"')
    expect(circle).not.toContain('data-marubatsu="cross"')
    expect(cross).not.toContain('data-marubatsu="circle"')
    expect(cross).toContain('data-marubatsu="cross"')
  })

  it('clips each large shape to the enabled quadrants', () => {
    const svg = symbolGridSvg({ a: 1, b: 0, c: 0, d: 2 }, 3, 40)
    expect(svg.match(/<rect/g)).toHaveLength(2)
    expect(svg).toContain('data-marubatsu="circle"')
    expect(svg).toContain('data-marubatsu="cross"')
  })

  it('connects plus strokes across neighboring tile boundaries', () => {
    const svg = symbolGridSvg({ a: 3, b: 3, c: 3, d: 3 }, 2, 40)
    expect(svg).toContain('x1="0" y1="10" x2="20" y2="10"')
    expect(svg).toContain('x1="20" y1="10" x2="40" y2="10"')
    expect(svg).toContain('x1="10" y1="0" x2="10" y2="20"')
    expect(svg).toContain('x1="10" y1="20" x2="10" y2="40"')
  })
})

describe('symbolNotation', () => {
  it('formats state as space-separated 2-bit groups', () => {
    expect(symbolNotation({ a: 0, b: 1, c: 2, d: 3 })).toBe('00 01 10 11')
  })
})

describe('renderSymbolPreview', () => {
  it('returns svg for preview', () => {
    const svg = renderSymbolPreview(1, 0)
    expect(svg).toContain('<svg')
    expect(svg).toContain('width="18"')
  })

  it('renders all symbol values for preview', () => {
    for (let set = 0; set < 4; set++) {
      for (let v = 0; v < 4; v++) {
        const svg = renderSymbolPreview(v, set)
        expect(svg).toContain('<svg')
      }
    }
  })

  it('previews marubatsu values as quadrant-dependent fragments', () => {
    const empty = renderSymbolPreview(0, 3)
    const circle = renderSymbolPreview(1, 3)
    const cross = renderSymbolPreview(2, 3)
    const overlay = renderSymbolPreview(3, 3)
    expect(empty).not.toContain('data-marubatsu')
    expect(circle).toContain('data-marubatsu="circle"')
    expect(circle).toContain('data-marubatsu="cross"')
    expect(cross).toContain('data-marubatsu="circle"')
    expect(cross).toContain('data-marubatsu="cross"')
    expect(overlay).toContain('data-marubatsu="circle"')
    expect(overlay).toContain('data-marubatsu="cross"')
  })
})
