import type { AmidaRailMode, AppState, Mode, PolygonVariant } from './types'
import { POS16_OPTIONS_VERSION } from './constants'
import { isLang } from '../i18n'

export function popcount(n: number): number {
  let c = 0
  let v = n
  while (v) {
    c += v & 1
    v >>= 1
  }
  return c
}

export { stateFromIndex } from 'fupf-glyph'

export function fmt2bit(v: number): string {
  return v.toString(2).padStart(2, '0')
}

export function boxCornerCode(index: number, k: number): number {
  // 上=bit7-6, 右=bit5-4, 下=bit3-2, 左=bit1-0
  return (index >> (6 - k * 2)) & 3
}

export function normalizeSamplingPageBits(bits: number[]): number[] {
  return [...new Set(bits)]
    .filter((bit) => Number.isInteger(bit) && bit >= 0 && bit <= 7)
    .toSorted((a, b) => b - a)
}

export function isValidMode(value: unknown): value is Mode {
  return (
    typeof value === 'string' &&
    [
      'edges',
      'symbols',
      'triSplit',
      'path',
      'dotLine',
      'aster',
      'box',
      'pos16',
      'amida',
    ].includes(value)
  )
}

export function isValidPolygonVariant(value: unknown): value is PolygonVariant {
  return (
    typeof value === 'string' &&
    ['normal', 'rhombus', 'inverse'].includes(value)
  )
}

function isValidAmidaRailMode(value: unknown): value is AmidaRailMode {
  return (
    typeof value === 'string' && ['normal', 'colored', 'hidden'].includes(value)
  )
}

export function loadState(partial: unknown): Partial<AppState> {
  if (!partial || typeof partial !== 'object') return {}
  const s = partial as Record<string, unknown>
  const result: Partial<AppState> = {}

  if (isValidMode(s.currentMode)) result.currentMode = s.currentMode
  if (typeof s.currentSymbolSet === 'number')
    result.currentSymbolSet = s.currentSymbolSet
  if (typeof s.highlightDuplicates === 'boolean')
    result.highlightDuplicates = s.highlightDuplicates
  if (isValidPolygonVariant(s.polygonVariant))
    result.polygonVariant = s.polygonVariant
  if (typeof s.asterFillMode === 'string')
    result.asterFillMode = s.asterFillMode as AppState['asterFillMode']
  if (typeof s.asterFillColor === 'string')
    result.asterFillColor = s.asterFillColor as AppState['asterFillColor']
  if (typeof s.asterCross === 'boolean') result.asterCross = s.asterCross
  if (typeof s.boxEdgeColor === 'string')
    result.boxEdgeColor = s.boxEdgeColor as AppState['boxEdgeColor']
  if (isValidAmidaRailMode(s.amidaRailMode))
    result.amidaRailMode = s.amidaRailMode
  if (typeof s.notationStyle === 'string')
    result.notationStyle = s.notationStyle as AppState['notationStyle']
  if (typeof s.monochrome === 'boolean') result.monochrome = s.monochrome
  if (typeof s.emphasizeSingleBit === 'boolean')
    result.emphasizeSingleBit = s.emphasizeSingleBit
  if (s.pos16OptionsVersion === POS16_OPTIONS_VERSION) {
    result.pos16OptionsVersion = POS16_OPTIONS_VERSION
    if (typeof s.pos16ShowLine === 'boolean')
      result.pos16ShowLine = s.pos16ShowLine
    if (typeof s.pos16ShowNeighborhood === 'boolean')
      result.pos16ShowNeighborhood = s.pos16ShowNeighborhood
    if (typeof s.pos16ShowBoundary === 'boolean')
      result.pos16ShowBoundary = s.pos16ShowBoundary
  }
  if (isLang(s.lang)) result.lang = s.lang
  if (Number.isInteger(s.selectedIndex))
    result.selectedIndex = s.selectedIndex as number
  if (
    Array.isArray(s.samplingPageBits) &&
    s.samplingPageBits.every(
      (bit): bit is number => Number.isInteger(bit) && bit >= 0 && bit <= 7
    )
  ) {
    result.samplingPageBits = normalizeSamplingPageBits(s.samplingPageBits)
  }
  if (Number.isInteger(s.samplingPage) && (s.samplingPage as number) >= 0) {
    result.samplingPage = s.samplingPage as number
  }

  return result
}
