import { useEffect, useState } from 'react'
import { clockSamplesAt, type ClockSample } from '../lib/clock'
import { renderPattern } from '../lib/renderPattern'
import type { AppState } from '../lib/types'

interface ClockDemoProps {
  state: AppState
  now?: Date
}

const CLOCK_GLYPH_SIZE = 160
const CLOCK_TICK_MILLISECONDS = 1000

function millisecondsUntilNextSecond(now: Date): number {
  return CLOCK_TICK_MILLISECONDS - now.getMilliseconds()
}

function useClockNow(fixedNow?: Date): Date {
  const [currentNow, setCurrentNow] = useState(() => fixedNow ?? new Date())

  useEffect(() => {
    if (fixedNow) return undefined

    let timeoutId = 0
    const scheduleNextTick = () => {
      timeoutId = window.setTimeout(() => {
        const nextNow = new Date()
        setCurrentNow(nextNow)
        scheduleNextTick()
      }, millisecondsUntilNextSecond(new Date()))
    }
    scheduleNextTick()

    return () => window.clearTimeout(timeoutId)
  }, [fixedNow])

  return fixedNow ?? currentNow
}

function ClockGlyph({
  sample,
  state,
}: {
  sample: ClockSample
  state: AppState
}) {
  const { graphic } = renderPattern(
    sample.patternIndex,
    CLOCK_GLYPH_SIZE,
    state
  )
  const paddedValue = sample.value.toString().padStart(2, '0')

  return (
    <figure
      className="clock-item"
      aria-label={`${sample.label} ${paddedValue}`}
    >
      <div
        className="clock-glyph"
        data-pattern-index={sample.patternIndex}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: graphic }}
      />
      <figcaption className="clock-value">{paddedValue}</figcaption>
    </figure>
  )
}

export function ClockDemo({ state, now }: ClockDemoProps) {
  const currentNow = useClockNow(now)
  const samples = clockSamplesAt(currentNow)

  return (
    <section className="clock-demo" aria-label="Clock demo">
      <div className="clock-face">
        {samples.map((sample) => (
          <ClockGlyph key={sample.label} sample={sample} state={state} />
        ))}
      </div>
    </section>
  )
}
