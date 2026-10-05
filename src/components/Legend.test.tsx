import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Legend } from './Legend'

describe('Legend', () => {
  it('renders edges legend', () => {
    render(<Legend currentMode="edges" currentSymbolSet={0} />)
    expect(screen.getByText('線スタイル凡例')).toBeInTheDocument()
  })

  it('renders symbols legend', () => {
    render(<Legend currentMode="symbols" currentSymbolSet={1} />)
    expect(screen.getByText('タイル凡例')).toBeInTheDocument()
  })

  it('renders path legend', () => {
    render(<Legend currentMode="path" currentSymbolSet={0} />)
    expect(screen.getByText('パス凡例')).toBeInTheDocument()
  })

  it('renders dotLine legend', () => {
    render(<Legend currentMode="dotLine" currentSymbolSet={0} />)
    expect(screen.getByText('丸点+線 凡例')).toBeInTheDocument()
  })

  it('renders aster legend', () => {
    render(<Legend currentMode="aster" currentSymbolSet={0} />)
    expect(screen.getByText('Aster 凡例')).toBeInTheDocument()
  })

  it('renders box legend', () => {
    render(<Legend currentMode="box" currentSymbolSet={0} />)
    expect(screen.getByText('ダイス 凡例')).toBeInTheDocument()
  })

  it('renders triSplit legend', () => {
    render(<Legend currentMode="triSplit" currentSymbolSet={0} />)
    expect(screen.getByText('ポリゴン 凡例')).toBeInTheDocument()
  })

  it('renders pos16 legend', () => {
    render(<Legend currentMode="pos16" currentSymbolSet={0} />)
    expect(screen.getByText('16² pos 凡例')).toBeInTheDocument()
  })

  it('renders amida legend', () => {
    render(<Legend currentMode="amida" currentSymbolSet={0} />)
    expect(screen.getByText('あみだ 凡例')).toBeInTheDocument()
  })

  it('renders nested legend', () => {
    render(<Legend currentMode="nested" currentSymbolSet={0} />)
    expect(screen.getByText('二重四角 凡例')).toBeInTheDocument()
  })
})
