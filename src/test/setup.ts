import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom の既定は en-US。既存テストは日本語 UI 前提なのでブラウザ言語を ja に固定する
Object.defineProperty(window.navigator, 'language', {
  value: 'ja-JP',
  configurable: true,
})

// アプリは設定を URL に書き戻す。jsdom の URL はテスト間で共有されるので毎回戻す
afterEach(() => {
  window.history.replaceState(null, '', '/')
})
