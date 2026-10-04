import { describe, expect, it } from 'vitest'
import { en } from '../i18n/en'
import { ja } from '../i18n/ja'
import {
  amidaDetail,
  asterDirections,
  glyphDetail,
  pos16Detail,
} from './glyphDetails'

describe('asterDirections', () => {
  it('lists directions of set bits clockwise from the top', () => {
    expect(asterDirections(0b10000000, ja)).toEqual(['上'])
    expect(asterDirections(0, ja)).toEqual([])
    expect(asterDirections(0b11110000, ja)).toEqual([
      '上',
      '右上',
      '右',
      '右下',
    ])
  })
})

describe('amidaDetail', () => {
  it('describes the rung positions and route result', () => {
    expect(amidaDetail(0b01101100, ja)).toBe(
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
describe('glyphDetail', () => {
  it('describes each mode in the given language', () => {
    expect(glyphDetail('edges', 0b01101100, ja)).toBe('上1 右2 下3 左0')
    expect(glyphDetail('edges', 0b01101100, en)).toBe('T1 R2 B3 L0')
    expect(glyphDetail('aster', 0, en)).toBe('none')
    expect(glyphDetail('amida', 0b01101100, en)).toBe(
      'rungs top:1–2 mid:2–3 bottom:3–4 / start:1 → end:4'
    )
  })
})
