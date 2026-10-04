import { stateFromIndex, traceAmida } from 'fupf-glyph'
import type { Messages } from '../i18n'
import type { Mode } from './types'

export function asterDirections(index: number, m: Messages): string[] {
  return m.asterDirections.filter((_, i) => (index >> (7 - i)) & 1)
}

export function amidaDetail(index: number, m: Messages): string {
  const { rungs, start, end } = traceAmida(index)
  const labels = rungs.map((rung) => m.rungLabels[rung])
  return m.preview.amidaDetail(
    [labels[0], labels[1], labels[2]],
    start + 1,
    end + 1
  )
}

export function pos16Detail(index: number): string {
  const start = (index >> 4) & 0x0f
  const end = index & 0x0f
  return `${start}→${end}`
}

function dotLineDetail(index: number, m: Messages): string {
  const dotBits = (index >> 4) & 0x0f
  const dots =
    m.corners.filter((_, i) => (dotBits >> (3 - i)) & 1).join(' ') ||
    m.preview.none
  return m.preview.dotLineDetail(
    dots,
    m.corners[(index >> 2) & 3],
    m.corners[index & 3]
  )
}

function triSplitDetail(index: number, m: Messages): string {
  return m.corners
    .map(
      (name, q) =>
        `${name}:${(index >> (7 - q * 2)) & 1}${(index >> (6 - q * 2)) & 1}`
    )
    .join(' ')
}

// 選択中パターンの「何がどうなっているか」を 1 行で説明する
export function glyphDetail(mode: Mode, index: number, m: Messages): string {
  const { a, b, c, d } = stateFromIndex(index)
  switch (mode) {
    case 'edges':
      return m.preview.edgesDetail(a, b, c, d)
    case 'symbols':
      return m.preview.symbolsDetail(a, b, c, d)
    case 'path':
      return [a, b, c, d].map((v) => m.corners[v]).join(' → ')
    case 'dotLine':
      return dotLineDetail(index, m)
    case 'aster': {
      const directions = asterDirections(index, m)
      return directions.length ? directions.join(' ') : m.preview.none
    }
    case 'box':
      return m.arms
        .map((arm, k) => `${arm}:${m.corners[(index >> (6 - k * 2)) & 3]}`)
        .join(' ')
    case 'triSplit':
      return triSplitDetail(index, m)
    case 'pos16':
      return pos16Detail(index)
    case 'amida':
      return amidaDetail(index, m)
  }
}
