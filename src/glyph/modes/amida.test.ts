import { describe, expect, it } from 'vitest'
import { amidaDetail, amidaNotation, amidaSvg, traceAmida } from './amida'

describe('traceAmida', () => {
  it('keeps the selected column when all three rows have no rung', () => {
    expect(traceAmida(0b00000010)).toEqual({
      start: 2,
      end: 2,
      rungs: [0, 0, 0],
      columns: [2, 2, 2, 2],
    })
  })

  it('follows rungs from top to bottom', () => {
    // 上=1–2、中央=2–3、下=1–2、開始位置=2
    expect(traceAmida(0b01100101)).toEqual({
      start: 1,
      end: 1,
      rungs: [1, 2, 1],
      columns: [1, 0, 0, 1],
    })
  })
})

describe('amidaSvg', () => {
  it('renders four vertical rails and three optional rung rows', () => {
    const svg = amidaSvg(0b01101100, 40)

    expect(svg).toContain('data-amida-rails="true"')
    expect(svg.match(/data-amida-rail=/g)).toHaveLength(4)
    expect(svg.match(/data-amida-rung=/g)).toHaveLength(3)
  })

  it('highlights the route and selected start', () => {
    const svg = amidaSvg(0b00000010, 40)

    expect(svg).toContain('data-amida-route="true"')
    expect(svg).toContain('data-amida-start="2"')
    expect(svg).toContain('data-amida-end="2"')
  })

  it('keeps vertical rails subdued', () => {
    const svg = amidaSvg(0, 40)

    expect(svg.match(/stroke="#52525b"/g)).toHaveLength(4)
  })

  it('makes horizontal rungs outside the selected route more visible', () => {
    const unusedRungSvg = amidaSvg(0b11000000, 40)
    const usedRungSvg = amidaSvg(0b01000000, 40)

    expect(unusedRungSvg).toContain(
      'data-amida-rung-used="false" stroke="#f472b6"',
    )
    expect(usedRungSvg).toContain(
      'data-amida-rung-used="true" stroke="#a1a1aa"',
    )
  })

  it('can color only rails with neither a rung nor the selected route', () => {
    const svg = amidaSvg(0, 40, false, 'colored')

    expect(svg.match(/stroke="#818cf8"/g)).toHaveLength(3)
    expect(svg).toContain(
      'data-amida-rail="0" data-amida-rail-isolated="false"',
    )
  })

  it('can hide only isolated rails without hiding the selected route', () => {
    const svg = amidaSvg(0, 40, false, 'hidden')

    expect(svg.match(/data-amida-rail=/g)).toHaveLength(1)
    expect(svg).toContain('data-amida-rail="0"')
    expect(svg).toContain('data-amida-route="true"')
  })

  it('does not treat a rail touched by an unused rung as isolated', () => {
    const svg = amidaSvg(0b11000000, 40, false, 'hidden')

    expect(svg).toContain('data-amida-rail="2"')
    expect(svg).toContain('data-amida-rail="3"')
  })

  it('supports monochrome rendering', () => {
    expect(amidaSvg(0, 40, true)).toContain('#e4e4e7')
  })
})

describe('amida notation', () => {
  it('separates three rung codes from the selected start code', () => {
    expect(amidaNotation(0b01101100)).toBe('01-10-11|00')
  })

  it('describes the rung positions and route result', () => {
    expect(amidaDetail(0b01101100)).toBe(
      '横線 上:1–2 中:2–3 下:3–4 / 開始:1 → 終了:4',
    )
  })
})
