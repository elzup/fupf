// README の docs/fupf-modes.png を撮り直す: モードカード〜テキストデモの範囲を 2x で切り出す
// 実行 (nr dev 起動中): PW_CORE=<playwright-core/index.mjs の絶対パス> node .claude/skills/add-mode/shot-modes.mjs
// playwright-core はプロジェクト依存に入れず、作業用ディレクトリに npm i したものを PW_CORE で渡す (ESM は npx の一時 node_modules を解決できない)
const { chromium } = await import(process.env.PW_CORE ?? 'playwright-core')

const url = process.argv[2] ?? 'http://fupf.localhost:1355/?mode=pos16'
const out = process.argv[3] ?? 'docs/fupf-modes.png'
// 10 モードが 5 列 × 2 段に収まる幅
const VIEWPORT_WIDTH = 1100

const browser = await chromium.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const page = await browser.newPage({
  viewport: { width: VIEWPORT_WIDTH, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
  locale: 'ja-JP',
})
await page.goto(url)
await page.waitForSelector('.mode-switch .mode-sample svg')
const top = await page.locator('.mode-switch').boundingBox()
const bottom = await page.locator('.text-demo').boundingBox()
const margin = 8
await page.screenshot({
  path: out,
  clip: {
    x: top.x - margin,
    y: top.y - margin,
    width: Math.max(top.width, bottom.width) + margin * 2,
    height: bottom.y + bottom.height - top.y + margin * 2,
  },
})
await browser.close()
console.log(`saved ${out}`)
