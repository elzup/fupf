import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_STATE, STORAGE_KEY } from '../lib/constants'
import type { AppState } from '../lib/types'
import { loadState } from '../lib/state'

export function usePersistentState(): [
  AppState,
  (update: Partial<AppState>) => void,
] {
  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : null
      return { ...DEFAULT_STATE, ...loadState(parsed) }
    } catch {
      return DEFAULT_STATE
    }
  })

  const updateState = useCallback((update: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...update }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // localStorage 不可の環境は無視
      }
      return next
    })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  return [state, updateState]
}
