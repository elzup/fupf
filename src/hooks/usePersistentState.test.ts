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
})
