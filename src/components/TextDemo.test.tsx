import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_STATE, MODES } from '../lib/constants'
import { FupfText, TextDemo } from './TextDemo'

describe('FupfText', () => {
  it('renders one glyph per UTF-8 byte and keeps the source text', () => {
    const { container } = render(<FupfText text="A あ" state={DEFAULT_STATE} />)

    expect(container.querySelectorAll('.fupf-glyph')).toHaveLength(4)
    expect(container.querySelector('[data-byte="65"]')).toBeInTheDocument()
    expect(container.querySelector('.fupf-text')).toHaveTextContent('A あ')
  })

  it.each(MODES)('renders SVG glyphs in %s mode', (mode) => {
    const { container } = render(
      <FupfText text="ab" state={{ ...DEFAULT_STATE, currentMode: mode }} />,
    )

    expect(container.querySelectorAll('.fupf-glyph svg')).toHaveLength(2)
  })
})

describe('TextDemo', () => {
  it('re-renders glyphs when the input changes', () => {
    const { container } = render(<TextDemo state={DEFAULT_STATE} />)

    fireEvent.change(screen.getByLabelText('Text to render'), {
      target: { value: 'xyz' },
    })

    expect(container.querySelectorAll('.fupf-glyph')).toHaveLength(3)
  })
})
