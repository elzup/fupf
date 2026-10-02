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

  it('matches the per-mode render function', () => {
    const options = { size: 64, showBoundary: true }
    expect(renderGlyph(0xa5, { mode: 'pos16', ...options })).toEqual(
      renderPos16(0xa5, options)
    )
  })
})
