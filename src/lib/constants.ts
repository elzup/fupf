import type {
  AmidaRailMode,
  AppState,
  Mode,
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

export const MODE_LABELS: Record<Mode, string> = {
  edges: 'ボーダー',
  symbols: 'タイル',
  triSplit: 'ポリゴン',
  path: '4隅パス',
  dotLine: '丸点+線',
  aster: 'Aster',
  box: 'ダイス',
  pos16: '16² pos',
  amida: 'あみだ',
}

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
}

// 座標: 00=左上, 01=右上, 10=左下, 11=右下
export const CORNERS: Record<number, [number, number]> = {
  0: [8, 8],
  1: [32, 8],
  2: [8, 32],
  3: [32, 32],
}

export const CORNER_NAMES: Record<number, string> = {
  0: '左上',
  1: '右上',
  2: '左下',
  3: '右下',
}

export const POLYGON_VARIANTS: PolygonVariant[] = [
  'normal',
  'rhombus',
  'inverse',
]

export const POLYGON_VARIANT_LABELS: Record<PolygonVariant, string> = {
  normal: '通常',
  rhombus: 'ひし形',
  inverse: '逆ひし形',
}

export const BOX_EDGE_COLORS: Array<{
  value: AppState['boxEdgeColor']
  label: string
}> = [
  { value: 'single', label: '単色' },
  { value: 'angle', label: '45°' },
  { value: 'xy', label: '位置(xy)' },
  { value: 'grad', label: 'グラデ' },
]

export const AMIDA_RAIL_MODES: Array<{
  value: AmidaRailMode
  label: string
}> = [
  { value: 'normal', label: '通常色' },
  { value: 'colored', label: '別色' },
  { value: 'hidden', label: '非表示' },
]

export const ASTER_FILL_MODES: Array<{
  value: AppState['asterFillMode']
  label: string
}> = [
  { value: 'none', label: 'なし' },
  { value: 'alpha', label: '半透明' },
  { value: 'solid', label: '不透明' },
]

export const ASTER_FILL_COLORS: Array<{
  value: AppState['asterFillColor']
  label: string
}> = [
  { value: 'segment', label: '区間ごと' },
  { value: 'run', label: '連続の始点色' },
]

export const NOTATION_STYLES: Array<{
  value: AppState['notationStyle']
  label: string
}> = [
  { value: 'default', label: 'モード既定' },
  { value: 'bin', label: '2進' },
  { value: 'hex', label: 'HEX' },
  { value: 'bar', label: '_ |' },
  { value: 'dot', label: '· ●' },
]

export const SYMBOL_SET_LABELS = [
  'なし / \\ X',
  '点の大きさ',
  '— | +',
  'マルバツ',
] as const
