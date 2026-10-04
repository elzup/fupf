import { GLYPH_THEMES, type GlyphOptions } from 'fupf-glyph'

export const PACKAGE_NAME = 'fupf-glyph'

export function formatIndexLiteral(index: number): string {
  return `0x${index.toString(16).toUpperCase().padStart(2, '0')}`
}

// テーマの palette はオブジェクトを展開せず、公開しているプリセット名で書く
function themeName(value: unknown): string | undefined {
  return Object.entries(GLYPH_THEMES).find(([, theme]) => theme === value)?.[0]
}

function formatValue(value: unknown): string {
  const theme = themeName(value)
  if (theme !== undefined) return `GLYPH_THEMES.${theme}`
  return typeof value === 'string' ? `'${value}'` : String(value)
}

// size は表示先ごとに決める値なのでサンプルからは外す (省略時は 40)
export function glyphCodeSample(
  index: number,
  options: GlyphOptions,
  notation: string
): string {
  const entries = Object.entries(options)
    .filter(([key]) => key !== 'size')
    .map(([key, value]) => `  ${key}: ${formatValue(value)},`)
  const imports = Object.values(options).some((v) => themeName(v) !== undefined)
    ? 'GLYPH_THEMES, renderGlyph'
    : 'renderGlyph'
  return [
    `import { ${imports} } from '${PACKAGE_NAME}'`,
    '',
    `const { svg, notation } = renderGlyph(${formatIndexLiteral(index)}, {`,
    ...entries,
    '})',
    `// notation === '${notation}'`,
  ].join('\n')
}
