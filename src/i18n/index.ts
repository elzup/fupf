import { createContext, useContext } from 'react'
import { en } from './en'
import { ja, type Messages } from './ja'

export type Lang = 'ja' | 'en'

export const LANGS: Lang[] = ['ja', 'en']

export const LANG_LABELS: Record<Lang, string> = {
  ja: '日本語',
  en: 'English',
}

const MESSAGES: Record<Lang, Messages> = { ja, en }

export function isLang(value: unknown): value is Lang {
  return value === 'ja' || value === 'en'
}

export function detectLang(language: string | undefined): Lang {
  return language?.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export function getMessages(lang: Lang): Messages {
  return MESSAGES[lang]
}

// Provider 無しで描画されたコンポーネント (単体テスト等) は ja で表示する
export const MessagesContext = createContext<Messages>(ja)

export function useMessages(): Messages {
  return useContext(MessagesContext)
}

export type { Messages }
