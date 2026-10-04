import type {
  AmidaRailMode,
  AppState,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  Mode,
  NotationStyle,
  PolygonVariant,
} from './types'

export const STORAGE_KEY = 'fupf-state'
export const POS16_OPTIONS_VERSION = 1

export const MODES: Mode[] = [
  'edges',
  'symbols',
  'triSplit',
  'path',
  'dotLine',
  'aster',
  'box',
  'pos16',
  'amida',
]

export const DEFAULT_STATE: AppState = {
  currentMode: 'pos16',
  selectedIndex: 0,
  samplingPageBits: [],
  samplingPage: 0,
  currentSymbolSet: 0,
  highlightDuplicates: false,
  polygonVariant: 'normal',
  asterFillMode: 'solid',
  asterFillColor: 'run',
  asterCross: true,
  boxEdgeColor: 'single',
  amidaRailMode: 'normal',
  notationStyle: 'default',
  monochrome: false,
  emphasizeSingleBit: false,
  pos16OptionsVersion: POS16_OPTIONS_VERSION,
  pos16ShowLine: false,
  pos16ShowNeighborhood: false,
  pos16ShowBoundary: true,
  lang: 'ja',
}

// 座標: 00=左上, 01=右上, 10=左下, 11=右下
export const CORNERS: Record<number, [number, number]> = {
  0: [8, 8],
  1: [32, 8],
  2: [8, 32],
  3: [32, 32],
}

export const POLYGON_VARIANTS: PolygonVariant[] = [
  'normal',
  'rhombus',
  'inverse',
]

export const BOX_EDGE_COLORS: BoxEdgeColor[] = ['single', 'angle', 'xy', 'grad']

export const AMIDA_RAIL_MODES: AmidaRailMode[] = ['normal', 'colored', 'hidden']

export const ASTER_FILL_MODES: AsterFillMode[] = ['none', 'alpha', 'solid']

export const ASTER_FILL_COLORS: AsterFillColor[] = ['segment', 'run']

export const NOTATION_STYLES: NotationStyle[] = [
  'default',
  'bin',
  'hex',
  'bar',
  'dot',
]

// タイルの記号セット数 (ラベルは i18n の options.symbolSets)
export const SYMBOL_SET_COUNT = 4
