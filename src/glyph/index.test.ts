import { describe, expect, it } from 'vitest'
import { renderGlyph, renderPos16, type GlyphMode } from '.'

const MODES: GlyphMode[] = [
  'edges',
  'symbols',
  'triSplit',
  'path',
  'dotLine',
  'aster',
  'box',
  'pos16',
  'amida',
]

describe('renderGlyph', () => {
  it.each(MODES)('returns svg and notation for %s', (mode) => {
    const { svg, notation } = renderGlyph(0xa5, { mode })
    expect(svg.startsWith('<svg')).toBe(true)
    expect(notation).not.toBe('')
  })

  it('uses 40 as the default size', () => {
    expect(renderGlyph(0, { mode: 'dotLine' }).svg).toContain(
      'viewBox="0 0 40 40"'
    )
  })

  it.each(MODES)('draws %s with currentColor when color is given', (mode) => {
    const { svg } = renderGlyph(0xff, { mode, color: 'currentColor' })
    expect(svg).toContain('currentColor')
    expect(svg).not.toMatch(/<svg[^>]*style="color:/)
    expect(svg).not.toContain('#e4e4e7')
    expect(svg).not.toContain('#06b6d4')
  })

  it('expresses the light tone with opacity under color', () => {
    const { svg } = renderGlyph(0xff, {
      mode: 'triSplit',
      color: 'currentColor',
    })
    expect(svg).toContain('fill="currentColor" fill-opacity="0.45"')
    expect(svg).toContain('stroke="currentColor" stroke-opacity="0.2"')
  })

  it('pulls every tone toward an explicit color', () => {
    const { svg } = renderGlyph(0xff, { mode: 'triSplit', color: '#ff0000' })
    expect(svg).not.toContain('currentColor')
    expect(svg).toContain('stroke="#ff0000" stroke-opacity="0.2"')
  })

  it('inherits the text color by default and keeps accent colors', () => {
    expect(renderGlyph(0xff, { mode: 'edges' }).svg).toContain(
      'stroke="currentColor"'
    )
    expect(renderGlyph(0x1b, { mode: 'path' }).svg).toContain('#06b6d4')
  })

  it('layers mode defaults under the user palette', () => {
    const { svg } = renderGlyph(0xff, { mode: 'triSplit' })
    expect(svg).toContain('fill="#06b6d4"')
    expect(svg).toContain('fill="#ec4899"')
    const overridden = renderGlyph(0xff, {
      mode: 'triSplit',
      palette: { muted: { color: '#000000' } },
    }).svg
    expect(overridden).toContain('fill="#06b6d4"')
    expect(overridden).toContain('fill="#000000"')
    expect(
      renderGlyph(0xff, { mode: 'triSplit', color: 'currentColor' }).svg
    ).not.toContain('#06b6d4')
  })

  it('cycles a short aster spectrum over eight directions', () => {
    const { svg } = renderGlyph(0xaa, {
      mode: 'aster',
      palette: { spectrum: [{ color: '#111111' }, { color: '#222222' }] },
    })
    expect(svg).toContain('#111111')
    expect(svg).not.toContain('undefined')
  })

  it('accepts a partial palette override', () => {
    const { svg } = renderGlyph(0xff, {
      mode: 'triSplit',
      palette: { fg: { color: '#123456' } },
    })
    expect(svg).toContain('fill="#123456"')
  })

  it('matches the per-mode render function', () => {
    const options = { size: 64, showBoundary: true }
    expect(renderGlyph(0xa5, { mode: 'pos16', ...options })).toEqual(
      renderPos16(0xa5, options)
    )
  })
})
