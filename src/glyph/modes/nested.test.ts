import { describe, expect, it } from 'vitest'
import { nestedNotation, nestedSvg } from './nested'

const regionCount = (svg: string) =>
  (svg.match(/<polygon[^>]*(fill="currentColor"|stroke-width="1.6")/g) ?? [])
    .length

describe('nestedSvg', () => {
  it('draws only guides for 0', () => {
    const svg = nestedSvg(0)
    expect(svg.startsWith('<svg')).toBe(true)
    expect(regionCount(svg)).toBe(0)
  })

  it('draws an outer trapezoid for the top outer bit', () => {
    expect(nestedSvg(0b10000000)).toContain(
      'points="3.2,3.2 36.8,3.2 28.4,11.6 11.6,11.6" fill="currentColor"'
    )
  })

  it('draws an inner right isosceles triangle for the top inner bit', () => {
    expect(nestedSvg(0b00001000)).toContain(
      'points="11.6,11.6 28.4,11.6 20,20" fill="currentColor"'
    )
  })

  it('merges outer and inner of the same side into one big triangle', () => {
    const svg = nestedSvg(0b10001000)
    expect(svg).toContain('points="3.2,3.2 36.8,3.2 20,20" fill="currentColor"')
    expect(regionCount(svg)).toBe(1)
  })

  it('draws 4 merged triangles for 0xff', () => {
    expect(regionCount(nestedSvg(0xff))).toBe(4)
  })

  it('draws outlines without fill in border style', () => {
    const svg = nestedSvg(0b10000000, 40, 'border')
    expect(svg).toContain(
      'points="3.2,3.2 36.8,3.2 28.4,11.6 11.6,11.6" fill="none"'
    )
    expect(svg).not.toContain('fill="currentColor"')
  })
})

describe('nestedNotation', () => {
  it('splits outer and inner nibbles', () => {
    expect(nestedNotation(0b10100110)).toBe('1010-0110')
    expect(nestedNotation(0)).toBe('0000-0000')
  })
})
