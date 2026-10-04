import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { MODES, STORAGE_KEY } from './lib/constants'

afterEach(() => {
  localStorage.clear()
})

describe('App', () => {
  it('switches mode when clicking the empty area of a mode card', () => {
    render(<App />)
    const card = screen
      .getByRole('button', { name: 'あみだ' })
      .closest('.mode-choice') as HTMLElement
    fireEvent.click(card)
    expect(card).toHaveClass('active')
    expect(screen.getByRole('button', { name: 'あみだ' })).toHaveClass('active')
  })

  it('switches the UI language and keeps it', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText('English'))
    expect(screen.getByText('Selected pattern')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Amida' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').lang).toBe(
      'en'
    )
  })

  it('shows each mode id on the mode cards', () => {
    render(<App />)
    const ids = [...document.querySelectorAll('.mode-switch .mode-id')].map(
      (el) => el.textContent
    )
    expect(ids).toEqual(MODES)
  })

  it('renders header and grid', () => {
    render(<App />)
    expect(screen.getByText('fupf glyph')).toBeInTheDocument()
    expect(screen.getByText('選択中のパターン')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '16² pos' })).toHaveClass(
      'active'
    )
    expect(document.querySelectorAll('.cell').length).toBe(256)
    expect(screen.getByLabelText('bit7')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '前ページ' })).toBeNull()
    expect(screen.queryByRole('button', { name: '次ページ' })).toBeNull()
    expect(document.querySelectorAll('.mode-sample')).toHaveLength(17)
    expect(
      document.querySelectorAll('.mode-sample[data-mode="symbols"]')
    ).toHaveLength(4)
    expect(
      document.querySelectorAll('.mode-sample[data-mode="triSplit"]')
    ).toHaveLength(2)
    expect(
      document.querySelectorAll('.mode-sample[data-mode="aster"]')
    ).toHaveLength(3)
    expect(
      document.querySelectorAll('.mode-sample[data-mode="box"]')
    ).toHaveLength(2)
    expect(
      document.querySelectorAll('.mode-sample[data-mode="pos16"]')
    ).toHaveLength(2)
    expect(
      document.querySelector('.mode-sample[data-mode="aster"]')
    ).toHaveAttribute('data-pattern-index', '122')
    expect(document.querySelector('.mode-sample')).toHaveAttribute(
      'data-pattern-index',
      '99'
    )
  })

  it('selects a cell on click', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'ボーダー' }))
    const cell = document.getElementById('cell-42')
    expect(cell).not.toBeNull()
    fireEvent.click(cell!)
    expect(document.querySelector('.cell.active')).toBe(cell)
    const infoDetail = document.getElementById('infoDetail')
    expect(infoDetail?.textContent).toContain('上0 右2 下2 左2')
  })

  it('switches mode', () => {
    render(<App />)
    const asterButton = screen.getByRole('button', { name: 'Aster' })
    fireEvent.click(asterButton)
    expect(asterButton).toHaveClass('active')
  })

  it('applies a mode sample option preset', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'ポリゴン: ひし形' }))

    expect(screen.getByRole('button', { name: 'ポリゴン' })).toHaveClass(
      'active'
    )
    expect(screen.getByLabelText('ひし形')).toBeChecked()
  })

  it('switches to amida mode', () => {
    render(<App />)
    const amidaButton = screen.getByRole('button', { name: 'あみだ' })

    fireEvent.click(amidaButton)

    expect(amidaButton).toHaveClass('active')
    expect(screen.getByText('あみだ 凡例')).toBeInTheDocument()
  })

  it('changes and persists the amida vertical rail display', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'あみだ' }))

    const colored = screen.getByLabelText('別色')
    fireEvent.click(colored)

    expect(colored).toBeChecked()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toMatchObject(
      {
        amidaRailMode: 'colored',
      }
    )
  })

  it('labels the empty and diagonal symbol set clearly', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'タイル' }))
    expect(screen.getByLabelText('なし / \\ X')).toBeInTheDocument()
  })

  it('uses boundary-only pos16 as the default', () => {
    render(<App />)
    const pos16Button = screen.getByRole('button', { name: '16² pos' })
    expect(pos16Button).toHaveClass('active')
    expect(screen.getByLabelText('接続線を表示')).not.toBeChecked()
    expect(screen.getByLabelText('9近傍を塗る')).not.toBeChecked()
    expect(screen.getByLabelText('塗り領域の境界線を表示')).toBeChecked()
  })

  it('updates pos16 display options', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '16² pos' }))

    const line = screen.getByLabelText('接続線を表示')
    const neighborhood = screen.getByLabelText('9近傍を塗る')
    const boundary = screen.getByLabelText('塗り領域の境界線を表示')
    fireEvent.click(line)
    fireEvent.click(neighborhood)
    fireEvent.click(boundary)

    expect(line).toBeChecked()
    expect(neighborhood).toBeChecked()
    expect(boundary).not.toBeChecked()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(stored).toMatchObject({
      pos16ShowLine: true,
      pos16ShowNeighborhood: true,
      pos16ShowBoundary: false,
    })
  })

  it('toggles monochrome', () => {
    render(<App />)
    const checkbox = screen.getByLabelText('モノクロ')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('changes notation style', () => {
    render(<App />)
    const radio = screen.getByLabelText('2進')
    fireEvent.click(radio)
    expect(radio).toBeChecked()
  })

  it('shows uppercase hexadecimal notation', () => {
    render(<App />)
    const radio = screen.getByLabelText('HEX')
    fireEvent.click(radio)

    expect(radio).toBeChecked()
    expect(document.querySelector('#cell-10 .notation')?.textContent).toBe('0A')
    expect(document.querySelector('#cell-255 .notation')?.textContent).toBe(
      'FF'
    )
  })

  it('persists selected index to localStorage', () => {
    render(<App />)
    const cell = document.getElementById('cell-77')
    fireEvent.click(cell!)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(stored.selectedIndex).toBe(77)
  })

  it('filters grid by selected paging bits', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText('bit7'))
    fireEvent.click(screen.getByLabelText('bit6'))

    expect(document.querySelectorAll('.cell').length).toBe(64)
    expect(screen.getByText('1 / 4')).toBeInTheDocument()
    expect(
      document.querySelector('.grid-controls .bit-section-switch')
    ).toBeInTheDocument()
    expect(document.querySelectorAll('.bit-section')).toHaveLength(8)
    expect(
      document.querySelector('.grid-controls .grid-pager')
    ).toBeInTheDocument()
    expect(document.getElementById('cell-0')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '次ページ' }))

    expect(screen.getByText('2 / 4')).toBeInTheDocument()
    expect(document.getElementById('cell-0')).toBeNull()
    expect(document.getElementById('cell-64')).not.toBeNull()
  })
})
