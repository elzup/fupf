import { describe, expect, it } from 'vitest'
import { amidaDetail, asterDirections, pos16Detail } from './glyphDetails'

describe('asterDirections', () => {
  it('lists directions of set bits clockwise from the top', () => {
    expect(asterDirections(0b10000000)).toEqual(['上'])
    expect(asterDirections(0)).toEqual([])
    expect(asterDirections(0b11110000)).toEqual(['上', '右上', '右', '右下'])
  })
})

describe('amidaDetail', () => {
  it('describes the rung positions and route result', () => {
    expect(amidaDetail(0b01101100)).toBe(
      '横線 上:1–2 中:2–3 下:3–4 / 開始:1 → 終了:4'
    )
  })
})

describe('pos16Detail', () => {
  it('returns start→end detail', () => {
    expect(pos16Detail(0b00010010)).toBe('1→2')
    expect(pos16Detail(0b11111111)).toBe('15→15')
  })
})
