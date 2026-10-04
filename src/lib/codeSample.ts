import type { GlyphOptions } from 'fupf-glyph'

export const PACKAGE_NAME = 'fupf-glyph'

export function formatIndexLiteral(index: number): string {
  return `0x${index.toString(16).toUpperCase().padStart(2, '0')}`
}

function formatValue(value: unknown): string {
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
  return [
    `import { renderGlyph } from '${PACKAGE_NAME}'`,
    '',
    `const { svg, notation } = renderGlyph(${formatIndexLiteral(index)}, {`,
    ...entries,
    '})',
    `// notation === '${notation}'`,
  ].join('\n')
}
