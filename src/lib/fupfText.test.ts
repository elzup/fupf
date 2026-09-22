import { describe, expect, it } from 'vitest'
import { splitFupfChars } from './fupfText'

describe('splitFupfChars', () => {
  it('maps ASCII to one byte per char', () => {
    expect(splitFupfChars('Hi')).toEqual([
      { char: 'H', bytes: [0x48], isWhitespace: false },
      { char: 'i', bytes: [0x69], isWhitespace: false },
    ])
  })

  it('keeps UTF-8 bytes of a multibyte char together', () => {
    expect(splitFupfChars('世')[0].bytes).toEqual([0xe4, 0xb8, 0x96])
  })

  it('splits by code point, not UTF-16 unit', () => {
    const chars = splitFupfChars('😀')
    expect(chars).toHaveLength(1)
    expect(chars[0].bytes).toHaveLength(4)
  })

  it('marks spaces and newlines as whitespace', () => {
    expect(splitFupfChars('a b\n').map((c) => c.isWhitespace)).toEqual([
      false,
      true,
      false,
      true,
    ])
  })
})
