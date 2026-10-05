import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// portless 経由 (nr dev) では Vite 自身の 127.0.0.1:<ランダムport> は直接開かないので、固定 URL だけ出す
function printPortlessUrl(): Plugin {
  return {
    name: 'print-portless-url',
    apply: 'serve',
    configureServer(server) {
      const url = process.env.PORTLESS_URL
      if (url === undefined) return
      server.printUrls = () => {
        server.config.logger.info(`  ➜  Local:   ${url}/`)
      }
    },
  }
}

// アプリは公開 API (fupf-glyph) だけを使い、解決先はローカルの src/glyph にする (公開版とのバージョンずれを避ける)
const GLYPH_ENTRY = decodeURIComponent(
  new URL('./src/glyph/index.ts', import.meta.url).pathname
)

export default defineConfig({
  plugins: [react(), printPortlessUrl()],
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
