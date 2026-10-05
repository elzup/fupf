// glyph mode の登録漏れを検出する。node .claude/skills/add-mode/check.ts [mode...]
// mode 名と「mode 名 prefix の AppState キー」を手がかりに、登録箇所を文字列で照合するだけの静的チェック
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '../../..')

interface Check {
  label: string
  ok: boolean
}

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8')
}

function countOf(text: string, needle: string): number {
  return text.split(needle).length - 1
}

function listModes(): string[] {
  const block = read('src/glyph/index.ts').match(
    /interface GlyphOptionsMap \{([\s\S]*?)\}/
  )
  if (block === null) throw new Error('GlyphOptionsMap not found')
  return [...block[1].matchAll(/^\s*(\w+):/gm)].map((match) => match[1])
}

function modeLabel(i18nSource: string, mode: string): string | undefined {
  const block = i18nSource.match(/modes: \{([\s\S]*?)\}/)
  return block?.[1].match(new RegExp(`\\b${mode}: '([^']+)'`))?.[1]
}

function pascal(mode: string): string {
  return mode[0].toUpperCase() + mode.slice(1)
}

// 新しい表示オプションは mode 名 prefix で AppState に足す規約 (amidaRailMode, pos16ShowLine)
function prefixedStateKeys(mode: string): string[] {
  const block = read('src/lib/types.ts').match(
    /interface AppState \{([\s\S]*?)\}/
  )
  if (block === null) throw new Error('AppState not found')
  return [...block[1].matchAll(/^\s*(\w+):/gm)]
    .map((match) => match[1])
    .filter((key) => key.startsWith(mode) && key !== mode)
    .filter((key) => !key.endsWith('OptionsVersion'))
}

function glyphChecks(mode: string): Check[] {
  const index = read('src/glyph/index.ts')
  return [
    {
      label: `src/glyph/modes/${mode}.ts`,
      ok: existsSync(join(ROOT, `src/glyph/modes/${mode}.ts`)),
    },
    {
      label: `src/glyph/modes/${mode}.test.ts`,
      ok: existsSync(join(ROOT, `src/glyph/modes/${mode}.test.ts`)),
    },
    {
      label: 'glyph/index.ts renderGlyph case',
      ok: index.includes(`case '${mode}':`),
    },
    {
      label: `glyph/index.ts export render${pascal(mode)} / ${pascal(mode)}Options`,
      ok:
        countOf(index, `render${pascal(mode)}`) >= 3 &&
        countOf(index, `${pascal(mode)}Options`) >= 3,
    },
    {
      label: 'glyph/index.test.ts MODES',
      ok: read('src/glyph/index.test.ts').includes(`'${mode}',`),
    },
  ]
}

function appChecks(mode: string): Check[] {
  const samples = read('src/lib/modeSamples.ts')
  return [
    {
      label: 'lib/constants.ts MODES',
      ok: read('src/lib/constants.ts').includes(`'${mode}',`),
    },
    {
      label: 'lib/state.ts isValidMode',
      ok: read('src/lib/state.ts').includes(`'${mode}',`),
    },
    {
      label: 'lib/renderPattern.ts modeOptions case',
      ok: read('src/lib/renderPattern.ts').includes(`case '${mode}':`),
    },
    {
      label: 'lib/glyphDetails.ts glyphDetail case',
      ok: read('src/lib/glyphDetails.ts').includes(`case '${mode}':`),
    },
    {
      label: 'lib/modeSamples.ts INDICES + PRESETS',
      ok: countOf(samples, `  ${mode}:`) >= 2,
    },
    {
      label: 'components/Legend.tsx',
      // triSplit は分岐の末尾 (fallback) で描くので currentMode 比較ではなく見出しで見る
      ok: read('src/components/Legend.tsx').includes(`l.${mode}.title`),
    },
    {
      label: 'components/Legend.test.tsx',
      ok: read('src/components/Legend.test.tsx').includes(`"${mode}"`),
    },
  ]
}

// modes / modeSamples / preview.labels / legend の 4 箇所 + description に名前が入っているか
function i18nChecks(mode: string): Check[] {
  return (['ja', 'en'] as const).flatMap((lang) => {
    const source = read(`src/i18n/${lang}.ts`)
    const label = modeLabel(source, mode)
    const description = source.match(/description:\s*'([^']*)'/)?.[1] ?? ''
    const readme = read(lang === 'en' ? 'README.md' : 'README.ja.md')
    return [
      {
        label: `i18n/${lang}.ts modes / modeSamples / preview.labels / legend`,
        ok:
          countOf(source, `    ${mode}:`) + countOf(source, `  ${mode}:`) >= 4,
      },
      {
        label: `i18n/${lang}.ts description mentions "${label ?? '?'}"`,
        ok: label !== undefined && description.includes(label),
      },
      {
        label: `${lang === 'en' ? 'README.md' : 'README.ja.md'} **${label ?? '?'}**`,
        ok: label !== undefined && readme.includes(`**${label}**`),
      },
    ]
  })
}

const OPTION_FILES = [
  ['lib/constants.ts DEFAULT_STATE', 'src/lib/constants.ts'],
  ['lib/state.ts loadState', 'src/lib/state.ts'],
  ['lib/queryState.ts PARAMS', 'src/lib/queryState.ts'],
  ['lib/renderPattern.ts', 'src/lib/renderPattern.ts'],
  ['components/OptionsPanel.tsx', 'src/components/OptionsPanel.tsx'],
  ['components/Sidebar.tsx', 'src/components/Sidebar.tsx'],
  ['i18n/ja.ts options', 'src/i18n/ja.ts'],
  ['i18n/en.ts options', 'src/i18n/en.ts'],
] as const

function optionChecks(mode: string): Check[] {
  return prefixedStateKeys(mode).flatMap((key) =>
    OPTION_FILES.map(([label, file]) => ({
      label: `${key} → ${label}`,
      ok: read(file).includes(key),
    }))
  )
}

function report(mode: string): boolean {
  const checks = [
    ...glyphChecks(mode),
    ...appChecks(mode),
    ...i18nChecks(mode),
    ...optionChecks(mode),
  ]
  const missing = checks.filter((check) => !check.ok)
  console.log(`\n[${mode}] ${checks.length - missing.length}/${checks.length}`)
  for (const check of checks) {
    console.log(`  ${check.ok ? 'ok  ' : 'MISS'} ${check.label}`)
  }
  return missing.length === 0
}

const known = listModes()
const targets = process.argv.slice(2)
const unknown = targets.filter((mode) => !known.includes(mode))
if (unknown.length > 0) {
  console.error(
    `not in GlyphOptionsMap: ${unknown.join(', ')} (src/glyph/index.ts に先に追加する)`
  )
  process.exit(1)
}
const results = (targets.length > 0 ? targets : known).map(report)
process.exit(results.every(Boolean) ? 0 : 1)
