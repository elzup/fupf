import { describe, expect, it } from 'vitest'
import { clockSamplesAt, sampleClockPattern } from './clock'

describe('sampleClockPattern', () => {
  it('uses the first and 256th patterns as the endpoints', () => {
    expect(sampleClockPattern(0, 23)).toBe(0)
    expect(sampleClockPattern(23, 23)).toBe(255)
    expect(sampleClockPattern(0, 59)).toBe(0)
    expect(sampleClockPattern(59, 59)).toBe(255)
  })

  it('samples the 256 patterns at nearly equal intervals', () => {
    const indices = Array.from({ length: 60 }, (_, value) =>
      sampleClockPattern(value, 59)
    )
    const intervals = indices.slice(1).map((index, position) => {
      return index - indices[position]
    })

    expect(Math.max(...intervals) - Math.min(...intervals)).toBeLessThanOrEqual(
      1
    )
  })
})

describe('clockSamplesAt', () => {
  it('creates one sampled pattern for HH, MM, and SS', () => {
    const now = new Date(2026, 0, 2, 3, 4, 5)

    expect(clockSamplesAt(now)).toEqual([
      { label: 'HH', value: 3, patternIndex: 33 },
      { label: 'MM', value: 4, patternIndex: 17 },
      { label: 'SS', value: 5, patternIndex: 22 },
    ])
  })
})
