import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_STATE, STORAGE_KEY } from '../lib/constants'
import type { AppState } from '../lib/types'
import { loadState } from '../lib/state'
import { queryToState, stateToQuery } from '../lib/queryState'
import { detectLang } from '../i18n'

function readStoredState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return loadState(raw ? (JSON.parse(raw) as unknown) : null)
  } catch {
    // localStorage 不可・壊れた JSON は保存無しとして扱う
    return {}
  }
}

// 優先順位: URL > localStorage > 既定値。
// URL に設定があるときは共有元の表示を再現するため localStorage の設定を混ぜない。
// 言語だけは見る人の好みなので、URL に無ければ保存値かブラウザ言語を使う
interface InitialLoad {
  state: AppState
  // 共有リンク (URL に表示設定がある) から開いたか
  isShared: boolean
}

function loadInitial(): InitialLoad {
  const stored = readStoredState()
  const lang = stored.lang ?? detectLang(navigator.language)
  const fromQuery = queryToState(window.location.search)
  // ?lang= だけのリンクは表示設定の共有ではないので、保存済みの設定を残す
  const hasQuery = Object.keys(fromQuery).some((key) => key !== 'lang')
  return hasQuery
    ? { state: { ...DEFAULT_STATE, lang, ...fromQuery }, isShared: true }
    : {
        state: { ...DEFAULT_STATE, lang, ...stored, ...fromQuery },
        isShared: false,
      }
}

// 共有リンクで開いた表示は見る人の保存設定を上書きしない。言語だけは見る人の好みなので保存する
function persist(state: AppState, isShared: boolean): void {
  const next = isShared ? { ...readStoredState(), lang: state.lang } : state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

function writeQuery(state: AppState): void {
  const query = stateToQuery(state)
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  // 設定変更のたびに履歴を積むと戻るボタンが使えなくなるので置き換える
  window.history.replaceState(null, '', url)
}

export function usePersistentState(): [
  AppState,
  (update: Partial<AppState>) => void,
] {
  const [{ state: initial, isShared }] = useState(loadInitial)
  const [state, setState] = useState<AppState>(initial)

  const updateState = useCallback((update: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...update }))
  }, [])

  useEffect(() => {
    writeQuery(state)
    try {
      persist(state, isShared)
    } catch {
      // localStorage 不可の環境 (プライベートモード等) では保存しないだけで表示は続ける
    }
  }, [state, isShared])

  return [state, updateState]
}
