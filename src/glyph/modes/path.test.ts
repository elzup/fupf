import { describe, expect, it } from 'vitest'
import { pathNotation, pathSvg } from './path'

describe('pathSvg', () => {
  it('returns svg and separators', () => {
    const result = pathSvg({ a: 0, b: 1, c: 2, d: 3 }, 40)
    expect(result.svg).toContain('<svg')
    expect(result.separators).toHaveLength(3)
  })

  it('marks axis-aligned segments with -', () => {
    const { separators } = pathSvg({ a: 0, b: 2, c: 0, d: 2 }, 40)
    expect(separators).toEqual(['-', '-', '-'])
  })

  it('marks diagonal segments with ~', () => {
    const { separators } = pathSvg({ a: 0, b: 3, c: 0, d: 3 }, 40)
    expect(separators.some((s) => s === '~')).toBe(true)
  })

  it('marks repeated points with =', () => {
    const { separators } = pathSvg({ a: 0, b: 0, c: 1, d: 2 }, 40)
    expect(separators[0]).toBe('=')
  })
})

describe('pathNotation', () => {
  it('formats state with separators', () => {
    const notation = pathNotation(
      { a: 0, b: 1, c: 2, d: 3 },
      ['-', '~', '-'],
    )
    expect(notation).toBe('00-01~10-11')
  })
})
