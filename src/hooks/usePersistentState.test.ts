import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePersistentState } from './usePersistentState'
import { STORAGE_KEY } from '../lib/constants'

afterEach(() => {
  localStorage.clear()
})

describe('usePersistentState', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].currentMode).toBe('pos16')
    expect(result.current[0].selectedIndex).toBe(0)
  })

  it('loads persisted state from localStorage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentMode: 'aster', selectedIndex: 42 })
    )
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].currentMode).toBe('aster')
    expect(result.current[0].selectedIndex).toBe(42)
  })

  it('migrates legacy pos16 options to the new defaults', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pos16ShowLine: true,
        pos16ShowNeighborhood: true,
        pos16ShowBoundary: false,
      })
    )
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].pos16ShowLine).toBe(false)
    expect(result.current[0].pos16ShowNeighborhood).toBe(false)
    expect(result.current[0].pos16ShowBoundary).toBe(true)
  })

  it('keeps pos16 options saved with the current version', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pos16OptionsVersion: 1,
        pos16ShowLine: true,
        pos16ShowNeighborhood: true,
        pos16ShowBoundary: false,
      })
    )
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].pos16ShowLine).toBe(true)
    expect(result.current[0].pos16ShowNeighborhood).toBe(true)
    expect(result.current[0].pos16ShowBoundary).toBe(false)
  })

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => usePersistentState())
    act(() => {
      result.current[1]({ selectedIndex: 100 })
    })
    expect(result.current[0].selectedIndex).toBe(100)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(stored.selectedIndex).toBe(100)
  })

  it('ignores corrupted localStorage data', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].currentMode).toBe('pos16')
  })

  it('prefers URL settings and ignores stored ones when the URL has settings', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentMode: 'aster', monochrome: true, lang: 'en' })
    )
    window.history.replaceState(null, '', '/?mode=box&i=a5')
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].currentMode).toBe('box')
    expect(result.current[0].selectedIndex).toBe(0xa5)
    expect(result.current[0].monochrome).toBe(false)
    expect(result.current[0].lang).toBe('en')
  })

  it('keeps stored settings for a lang-only URL', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentMode: 'aster' }))
    window.history.replaceState(null, '', '/?lang=en')
    const { result } = renderHook(() => usePersistentState())
    expect(result.current[0].currentMode).toBe('aster')
    expect(result.current[0].lang).toBe('en')
  })

  it('writes changed settings back to the URL', () => {
    const { result } = renderHook(() => usePersistentState())
    act(() => result.current[1]({ currentMode: 'amida', selectedIndex: 3 }))
    expect(window.location.search).toBe('?mode=amida&i=03')
  })

  it('does not overwrite stored settings when opened from a shared URL', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentMode: 'aster', monochrome: true })
    )
    window.history.replaceState(null, '', '/?mode=box')
    const { result } = renderHook(() => usePersistentState())
    act(() => result.current[1]({ selectedIndex: 9, lang: 'en' }))
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored.currentMode).toBe('aster')
    expect(stored.monochrome).toBe(true)
    expect(stored.selectedIndex).toBeUndefined()
    expect(stored.lang).toBe('en')
  })
})
