import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// アプリは公開 API (fupf-glyph) だけを使い、解決先はローカルの src/glyph にする (公開版とのバージョンずれを避ける)
const GLYPH_ENTRY = decodeURIComponent(
  new URL('./src/glyph/index.ts', import.meta.url).pathname
)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^fupf-glyph$/, replacement: GLYPH_ENTRY }],
  },
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
