import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Preview } from './Preview'
import { DEFAULT_STATE } from '../lib/constants'

const baseProps = {
  ...DEFAULT_STATE,
  selectedIndex: 42,
  currentSymbolSet: 0,
  highlightDuplicates: false,
}

describe('Preview', () => {
  it('renders edges preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="edges" />)
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders symbols preview', () => {
    const { container } = render(
      <Preview {...baseProps} currentMode="symbols" />
    )
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders path preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="path" />)
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders dotLine preview', () => {
    const { container } = render(
      <Preview {...baseProps} currentMode="dotLine" />
    )
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders aster preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="aster" />)
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders box preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="box" />)
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders triSplit preview', () => {
    const { container } = render(
      <Preview {...baseProps} currentMode="triSplit" />
    )
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders pos16 preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="pos16" />)
    expect(container.querySelector('.preview-box')).toBeInTheDocument()
  })

  it('renders amida preview', () => {
    const { container } = render(<Preview {...baseProps} currentMode="amida" />)
    expect(
      container.querySelector('[data-amida-route="true"]')
    ).toBeInTheDocument()
  })

  it('shows the mode id and a renderGlyph code sample for the current options', () => {
    const { container } = render(
      <Preview
        {...baseProps}
        currentMode="pos16"
        selectedIndex={0xa5}
        pos16ShowBoundary={true}
      />
    )
    expect(container.querySelector('.info-row .mode-id')).toHaveTextContent(
      'pos16'
    )
    const code = container.querySelector('.code-sample code')?.textContent
    expect(code).toContain('renderGlyph(0xA5, {')
    expect(code).toContain("  mode: 'pos16',")
    expect(code).toContain('  showBoundary: true,')
    expect(code).not.toContain('size:')
  })
})
