import { describe, expect, it } from 'vitest'
import { notationIsGlyph, styleNotation } from './notation'

describe('styleNotation', () => {
  it('returns mode note for default style', () => {
    expect(styleNotation(0b10101010, 'mode-note', 'default')).toBe('mode-note')
  })

  it('formats binary with hyphenation', () => {
    expect(styleNotation(0b10101010, '', 'bin')).toBe('10-10-10-10')
    expect(styleNotation(0b00000000, '', 'bin')).toBe('00-00-00-00')
  })

  it('formats hexadecimal as two uppercase digits', () => {
    expect(styleNotation(0, '', 'hex')).toBe('00')
    expect(styleNotation(10, '', 'hex')).toBe('0A')
    expect(styleNotation(255, '', 'hex')).toBe('FF')
  })

  it('formats bar notation', () => {
    expect(styleNotation(0b10101010, '', 'bar')).toBe('|_|_|_|_')
    expect(styleNotation(0b01010101, '', 'bar')).toBe('_|_|_|_|')
    expect(styleNotation(0b00000000, '', 'bar')).toBe('________')
  })

  it('formats dot notation', () => {
    expect(styleNotation(0b10101010, '', 'dot')).toBe('●·●·●·●·')
    expect(styleNotation(0b00000000, '', 'dot')).toBe('········')
  })
})

describe('notationIsGlyph', () => {
  it('returns true for bar and dot styles', () => {
    expect(notationIsGlyph('bar')).toBe(true)
    expect(notationIsGlyph('dot')).toBe(true)
    expect(notationIsGlyph('bin')).toBe(false)
    expect(notationIsGlyph('hex')).toBe(false)
    expect(notationIsGlyph('default')).toBe(false)
  })
})
