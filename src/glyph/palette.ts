export interface Paint {
  color: string
  opacity?: number
}

export interface GlyphPalette {
  /** 主要な塗り・線 */
  fg: Paint
  /** 濃淡の淡い側 (triSplit の下三角、使われた横線など) */
  muted: Paint
  /** 控えめな点 (edges の頂点など) */
  dim: Paint
  /** 縦線・近傍セルなど構造の地 */
  rail: Paint
  /** 補助線・枠線 */
  guide: Paint
  /** 中抜きマーカーの塗り (背景色想定) */
  bg: Paint
  /** 順序や種類を表す 3 色 (path の 1→2→3 など) */
  accents: [Paint, Paint, Paint]
  /** 孤立した縦線など 4 色目 */
  alt: Paint
  /** aster の 8 方向 */
  spectrum: Paint[]
  /** 色分けを止めて fg 一色で描く (box の xy / grad のような色相演出も止まる) */
  monochrome?: boolean
}

export interface ColorOptions {
  /**
   * 全モード共通の単色指定 (`'currentColor'` なら親要素の color を継承)。
   * 色分けを止めて全体をこの色に寄せる。濃淡は fill-opacity / stroke-opacity で表す。
   */
  color: string
  /** 既定の配色を部分的に差し替える */
  palette: Partial<GlyphPalette>
}

const p = (color: string, opacity?: number): Paint =>
  opacity === undefined ? { color } : { color, opacity }

// ddaabb の vendored 版が triSplit の濃淡に使っていた値。淡い側の基準にする
const MUTED_OPACITY = 0.45
// 黒地・白地どちらでも「線より一段弱い構造」に見える濃さ (palette-preview で比較して決めた)
const RAIL_OPACITY = 0.35
const GUIDE_OPACITY = 0.2

/**
 * 既定は文字と同じ扱い: 線と塗りは親の color を継承し、濃淡・補助線は opacity で表す。
 * 色分けは黒地・白地の両方で読める Tailwind 500 段。
 */
export const DEFAULT_PALETTE: GlyphPalette = {
  fg: p('currentColor'),
  muted: p('currentColor', MUTED_OPACITY),
  dim: p('currentColor', MUTED_OPACITY),
  rail: p('currentColor', RAIL_OPACITY),
  guide: p('currentColor', GUIDE_OPACITY),
  bg: p('none'),
  accents: [p('#06b6d4'), p('#ec4899'), p('#eab308')],
  alt: p('#6366f1'),
  spectrum: [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#10b981',
    '#06b6d4',
    '#6366f1',
    '#d946ef',
  ].map((color) => p(color)),
}

/**
 * mode ごとの既定の差分。DEFAULT_PALETTE の上、利用者の palette の下に重なる。
 * 色は .metarc/mode-palette-preview で黒地・白地を見比べて選んだ (Tailwind 500 段)
 */
export const MODE_PALETTES: Readonly<Record<string, Partial<GlyphPalette>>> = {
  symbols: { fg: p('#06b6d4') },
  triSplit: { fg: p('#06b6d4'), muted: p('#ec4899') },
  box: { accents: [p('#6366f1'), p('#f59e0b'), p('#f59e0b')] },
}

/**
 * 全 mode を同じ色相でそろえるプリセット。`palette` に渡すと mode 別の既定より優先される。
 * fg / muted も含めて上書きするので、triSplit や symbols の mode 既定色も消える
 */
export const GLYPH_THEMES = {
  /** 寒色 (cyan → indigo) */
  ocean: {
    fg: p('currentColor'),
    muted: p('#0ea5e9'),
    accents: [p('#06b6d4'), p('#3b82f6'), p('#8b5cf6')],
    alt: p('#14b8a6'),
    spectrum: [
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#14b8a6',
      '#10b981',
    ].map((color) => p(color)),
  },
  /** 暖色 (rose → amber) */
  sunset: {
    fg: p('currentColor'),
    muted: p('#f97316'),
    accents: [p('#f43f5e'), p('#f59e0b'), p('#d946ef')],
    alt: p('#ec4899'),
    spectrum: [
      '#f43f5e',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#ef4444',
      '#ec4899',
      '#d946ef',
      '#fb7185',
    ].map((color) => p(color)),
  },
} satisfies Record<string, Partial<GlyphPalette>>

export type GlyphThemeName = keyof typeof GLYPH_THEMES

function monochromed(palette: GlyphPalette): GlyphPalette {
  const { fg } = palette
  return {
    ...palette,
    accents: [fg, fg, fg],
    alt: fg,
    spectrum: palette.spectrum.map(() => fg),
    monochrome: true,
  }
}

// currentColor 由来の濃淡 (rail / guide など) も指定色に寄せる
function recolor(paint: Paint, color: string): Paint {
  return paint.color === 'currentColor' ? { ...paint, color } : paint
}

export function resolvePalette(
  options: Partial<ColorOptions> & { monochrome?: boolean } = {},
  mode?: string
): GlyphPalette {
  const modeDefaults = mode === undefined ? {} : MODE_PALETTES[mode]
  const base = { ...DEFAULT_PALETTE, ...modeDefaults, ...options.palette }
  if (options.color !== undefined) {
    const { color } = options
    return monochromed({
      ...base,
      fg: p(color),
      muted: p(color, MUTED_OPACITY),
      dim: p(color, MUTED_OPACITY),
      rail: recolor(base.rail, color),
      guide: recolor(base.guide, color),
    })
  }
  return options.monochrome || base.monochrome ? monochromed(base) : base
}

function opacityOf(paint: Paint, extra: number): number | undefined {
  const opacity = (paint.opacity ?? 1) * extra
  return opacity === 1 ? undefined : opacity
}

/** `fill="…"` (+ fill-opacity)。extra は形状側の透明度と掛け合わせる */
export function fillAttr(paint: Paint, extra = 1): string {
  const opacity = opacityOf(paint, extra)
  return `fill="${paint.color}"${opacity === undefined ? '' : ` fill-opacity="${opacity}"`}`
}

/**
 * currentColor で描く単色グリフのルートに付ける style。
 * fg 自体が currentColor なら親の color を継承させたいので何も付けない
 */
export function inkStyle(paint: Paint): string {
  if (paint.color === 'currentColor') return ''
  const opacity = paint.opacity === undefined ? '' : `;opacity:${paint.opacity}`
  return ` style="color:${paint.color}${opacity}"`
}

export function strokeAttr(paint: Paint, extra = 1): string {
  const opacity = opacityOf(paint, extra)
  return `stroke="${paint.color}"${opacity === undefined ? '' : ` stroke-opacity="${opacity}"`}`
}
