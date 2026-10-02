export interface ClockSample {
  label: 'HH' | 'MM' | 'SS'
  value: number
  patternIndex: number
}

const LAST_PATTERN_INDEX = 255
const LAST_HOUR = 23
const LAST_MINUTE_OR_SECOND = 59

export function sampleClockPattern(value: number, lastValue: number): number {
  if (lastValue <= 0) return 0
  return Math.round((value * LAST_PATTERN_INDEX) / lastValue)
}

export function clockSamplesAt(now: Date): ClockSample[] {
  return [
    {
      label: 'HH',
      value: now.getHours(),
      patternIndex: sampleClockPattern(now.getHours(), LAST_HOUR),
    },
    {
      label: 'MM',
      value: now.getMinutes(),
      patternIndex: sampleClockPattern(now.getMinutes(), LAST_MINUTE_OR_SECOND),
    },
    {
      label: 'SS',
      value: now.getSeconds(),
      patternIndex: sampleClockPattern(now.getSeconds(), LAST_MINUTE_OR_SECOND),
    },
  ]
}
