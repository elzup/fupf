import { describe, expect, it } from 'vitest'
import { GLYPH_THEMES } from 'fupf-glyph'
import { formatIndexLiteral, glyphCodeSample } from './codeSample'

describe('formatIndexLiteral', () => {
  it('formats as two-digit uppercase hex', () => {
    expect(formatIndexLiteral(0)).toBe('0x00')
    expect(formatIndexLiteral(0xa5)).toBe('0xA5')
  })
})

describe('glyphCodeSample', () => {
  it('renders a renderGlyph call with mode options, omitting size', () => {
    const code = glyphCodeSample(
      0xa5,
      { mode: 'pos16', size: 160, showBoundary: true, color: 'currentColor' },
      '1010-0101'
    )
    expect(code).toBe(
      [
        "import { renderGlyph } from 'fupf-glyph'",
        '',
        'const { svg, notation } = renderGlyph(0xA5, {',
        "  mode: 'pos16',",
        '  showBoundary: true,',
        "  color: 'currentColor',",
        '})',
        "// notation === '1010-0101'",
      ].join('\n')
    )
  })

  it('writes a theme palette by its preset name', () => {
    const code = glyphCodeSample(
      0x5a,
      { mode: 'aster', palette: GLYPH_THEMES.sunset },
      '01-01-10-10'
    )
    expect(code).toContain(
      "import { GLYPH_THEMES, renderGlyph } from 'fupf-glyph'"
    )
    expect(code).toContain('  palette: GLYPH_THEMES.sunset,')
  })
})
