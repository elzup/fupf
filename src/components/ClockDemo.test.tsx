import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_STATE, MODES } from '../lib/constants'
import { ClockDemo } from './ClockDemo'

describe('ClockDemo', () => {
  it('shows only three compact glyphs and their numeric values', () => {
    const now = new Date(2026, 0, 2, 3, 4, 5)

    const { container } = render(<ClockDemo state={DEFAULT_STATE} now={now} />)

    expect(
      screen.getByRole('region', { name: 'Clock demo' })
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.clock-glyph')).toHaveLength(3)
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.queryByText('HH')).not.toBeInTheDocument()
    expect(screen.queryByText(/pattern/)).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-pattern-index="33"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-pattern-index="17"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-pattern-index="22"]')
    ).toBeInTheDocument()
  })

  it.each(MODES)('renders the current %s mode for all three glyphs', (mode) => {
    const { container } = render(
      <ClockDemo
        state={{ ...DEFAULT_STATE, currentMode: mode }}
        now={new Date(2026, 0, 2, 3, 4, 5)}
      />
    )

    expect(container.querySelectorAll('.clock-glyph svg')).toHaveLength(3)
  })
})
