import { describe, expect, it } from 'vitest'
import {
  boxCornerCode,
  fmt2bit,
  isValidMode,
  isValidPolygonVariant,
  loadState,
  popcount,
  stateFromIndex,
} from './state'

describe('popcount', () => {
  it('counts set bits', () => {
    expect(popcount(0)).toBe(0)
    expect(popcount(1)).toBe(1)
    expect(popcount(0b10101010)).toBe(4)
    expect(popcount(0b11111111)).toBe(8)
  })
})

describe('stateFromIndex', () => {
  it('extracts 2-bit groups from index', () => {
    expect(stateFromIndex(0b00000000)).toEqual({ a: 0, b: 0, c: 0, d: 0 })
    expect(stateFromIndex(0b11001100)).toEqual({ a: 3, b: 0, c: 3, d: 0 })
    expect(stateFromIndex(0b11111111)).toEqual({ a: 3, b: 3, c: 3, d: 3 })
    expect(stateFromIndex(0b01011010)).toEqual({ a: 1, b: 1, c: 2, d: 2 })
  })
})

describe('fmt2bit', () => {
  it('formats value as 2-digit binary', () => {
    expect(fmt2bit(0)).toBe('00')
    expect(fmt2bit(1)).toBe('01')
    expect(fmt2bit(2)).toBe('10')
    expect(fmt2bit(3)).toBe('11')
    expect(fmt2bit(4)).toBe('100')
  })
})

describe('boxCornerCode', () => {
  it('extracts 2-bit arm codes from index', () => {
    // top=bit7-6, right=bit5-4, bottom=bit3-2, left=bit1-0
    expect(boxCornerCode(0b00000000, 0)).toBe(0)
    expect(boxCornerCode(0b11000000, 0)).toBe(3)
    expect(boxCornerCode(0b00110000, 1)).toBe(3)
    expect(boxCornerCode(0b00001100, 2)).toBe(3)
    expect(boxCornerCode(0b00000011, 3)).toBe(3)
  })
})

describe('isValidMode', () => {
  it('accepts valid modes', () => {
    expect(isValidMode('edges')).toBe(true)
    expect(isValidMode('aster')).toBe(true)
    expect(isValidMode('box')).toBe(true)
    expect(isValidMode('pos16')).toBe(true)
    expect(isValidMode('amida')).toBe(true)
    expect(isValidMode('nested')).toBe(true)
  })
  it('rejects invalid modes', () => {
    expect(isValidMode('invalid')).toBe(false)
    expect(isValidMode(123)).toBe(false)
    expect(isValidMode(null)).toBe(false)
  })
})

describe('isValidPolygonVariant', () => {
  it('accepts valid variants', () => {
    expect(isValidPolygonVariant('normal')).toBe(true)
    expect(isValidPolygonVariant('rhombus')).toBe(true)
    expect(isValidPolygonVariant('inverse')).toBe(true)
  })
  it('rejects invalid variants', () => {
    expect(isValidPolygonVariant('circle')).toBe(false)
    expect(isValidPolygonVariant(0)).toBe(false)
  })
})

describe('loadState', () => {
  it('returns defaults for non-object input', () => {
    expect(loadState(null)).toEqual({})
    expect(loadState('string')).toEqual({})
  })

  it('parses valid fields', () => {
    const input = {
      currentMode: 'aster',
      selectedIndex: 42,
      currentSymbolSet: 2,
      highlightDuplicates: true,
      polygonVariant: 'rhombus',
      asterFillMode: 'alpha',
      asterFillColor: 'segment',
      asterCross: false,
      boxEdgeColor: 'xy',
      amidaRailMode: 'colored',
      notationStyle: 'dot',
      colorScheme: 'sunset',
      emphasizeSingleBit: true,
      pos16OptionsVersion: 1,
      pos16ShowLine: false,
      pos16ShowNeighborhood: false,
      pos16ShowBoundary: true,
    }
    expect(loadState(input)).toEqual(input)
  })

  it('migrates the stored monochrome flag to the mono color scheme', () => {
    expect(loadState({ monochrome: true })).toEqual({ colorScheme: 'mono' })
    expect(loadState({ monochrome: false })).toEqual({})
  })

  it('ignores invalid fields', () => {
    const input = {
      currentMode: 'invalid',
      selectedIndex: 'not-a-number',
      monochrome: 'yes',
      colorScheme: 'neon',
      asterFillMode: 123,
    }
    expect(loadState(input)).toEqual({})
  })
})
