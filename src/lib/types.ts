import type {
  AmidaRailMode,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  PolygonVariant,
} from '../glyph/types'
import type { GlyphMode } from '../glyph'

export type {
  AmidaRailMode,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  PolygonVariant,
}
export type { PatternState } from '../glyph/bits'

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
  monochrome: boolean
  emphasizeSingleBit: boolean
  pos16OptionsVersion: number
  pos16ShowLine: boolean
  pos16ShowNeighborhood: boolean
  pos16ShowBoundary: boolean
}

