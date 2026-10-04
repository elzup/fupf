import { traceAmida } from 'fupf-glyph'

// Aster の bit7 から時計回り (上 → 左上)。色は fupf-glyph の ASTER_COLORS と同じ並び
export const ASTER_DIRECTIONS = [
  '上',
  '右上',
  '右',
  '右下',
  '下',
  '左下',
  '左',
  '左上',
]

const RUNG_LABELS = ['なし', '1–2', '2–3', '3–4'] as const

export function asterDirections(index: number): string[] {
  return ASTER_DIRECTIONS.filter((_, i) => (index >> (7 - i)) & 1)
}

export function amidaDetail(index: number): string {
  const { rungs, start, end } = traceAmida(index)
  return `横線 上:${RUNG_LABELS[rungs[0]]} 中:${RUNG_LABELS[rungs[1]]} 下:${RUNG_LABELS[rungs[2]]} / 開始:${start + 1} → 終了:${end + 1}`
}

export function pos16Detail(index: number): string {
  const start = (index >> 4) & 0x0f
  const end = index & 0x0f
  return `${start}→${end}`
}
