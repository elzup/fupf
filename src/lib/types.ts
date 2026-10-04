import type {
  AmidaRailMode,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  PolygonVariant,
  GlyphMode,
  GlyphThemeName,
} from 'fupf-glyph'

export type {
  AmidaRailMode,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  PolygonVariant,
}
import type { Lang } from '../i18n'

export type { PatternState } from 'fupf-glyph'

export type Mode = GlyphMode
export type NotationStyle = 'default' | 'bin' | 'hex' | 'bar' | 'dot'

export interface AppState {
  currentMode: Mode
  selectedIndex: number
  samplingPageBits: number[]
  samplingPage: number
  currentSymbolSet: number
  highlightDuplicates: boolean
  polygonVariant: PolygonVariant
  asterFillMode: AsterFillMode
  asterFillColor: AsterFillColor
  asterCross: boolean
  boxEdgeColor: BoxEdgeColor
  amidaRailMode: AmidaRailMode
  notationStyle: NotationStyle
  colorScheme: ColorScheme
  emphasizeSingleBit: boolean
  pos16OptionsVersion: number
  pos16ShowLine: boolean
  pos16ShowNeighborhood: boolean
  pos16ShowBoundary: boolean
  lang: Lang
}

/** 全 mode 共通の配色。basic は mode ごとの既定色 */
export type ColorScheme = 'basic' | 'mono' | GlyphThemeName
