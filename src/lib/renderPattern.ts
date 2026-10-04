import { renderGlyph, type GlyphOptions } from 'fupf-glyph'
import type { AppState } from './types'

export type PatternRenderOptions = Pick<
  AppState,
  | 'currentMode'
  | 'currentSymbolSet'
  | 'highlightDuplicates'
  | 'polygonVariant'
  | 'asterFillMode'
  | 'asterFillColor'
  | 'asterCross'
  | 'boxEdgeColor'
  | 'amidaRailMode'
  | 'monochrome'
  | 'pos16ShowLine'
  | 'pos16ShowNeighborhood'
  | 'pos16ShowBoundary'
>

interface RenderedPattern {
  graphic: string
  note: string
}

function toGlyphOptions(
  size: number,
  options: PatternRenderOptions
): GlyphOptions {
  const { monochrome } = options
  switch (options.currentMode) {
    case 'edges':
      return { mode: 'edges', size }
    case 'symbols':
      return { mode: 'symbols', size, symbolSet: options.currentSymbolSet }
    case 'triSplit':
      return { mode: 'triSplit', size, variant: options.polygonVariant }
    case 'path':
      return {
        mode: 'path',
        size,
        highlight: options.highlightDuplicates,
        monochrome,
      }
    case 'dotLine':
      return { mode: 'dotLine', size, monochrome }
    case 'aster':
      return {
        mode: 'aster',
        size,
        fillMode: options.asterFillMode,
        fillColor: options.asterFillColor,
        cross: options.asterCross,
        monochrome,
      }
    case 'box':
      return { mode: 'box', size, edgeColor: options.boxEdgeColor, monochrome }
    case 'pos16':
      return {
        mode: 'pos16',
        size,
        monochrome,
        showLine: options.pos16ShowLine,
        showNeighborhood: options.pos16ShowNeighborhood,
        showBoundary: options.pos16ShowBoundary,
      }
    case 'amida':
      return {
        mode: 'amida',
        size,
        railMode: options.amidaRailMode,
        monochrome,
      }
  }
}

export function renderPattern(
  index: number,
  size: number,
  options: PatternRenderOptions
): RenderedPattern {
  const { svg, notation } = renderGlyph(index, toGlyphOptions(size, options))
  return { graphic: svg, note: notation }
}
