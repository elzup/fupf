import {
  GLYPH_THEMES,
  renderGlyph,
  type ColorOptions,
  type GlyphOptions,
} from 'fupf-glyph'
import type { AppState, ColorScheme } from './types'

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
  | 'colorScheme'
  | 'pos16ShowLine'
  | 'pos16ShowNeighborhood'
  | 'pos16ShowBoundary'
>

interface RenderedPattern {
  graphic: string
  note: string
}

// mono は文字色 1 色、テーマは palette ごと差し替えて全 mode の色相をそろえる
export function colorOptionsFor(scheme: ColorScheme): Partial<ColorOptions> {
  if (scheme === 'basic') return {}
  if (scheme === 'mono') return { color: 'currentColor' }
  return { palette: GLYPH_THEMES[scheme] }
}

export function toGlyphOptions(
  size: number,
  options: PatternRenderOptions
): GlyphOptions {
  return {
    ...modeOptions(size, options),
    ...colorOptionsFor(options.colorScheme),
  } as GlyphOptions
}

function modeOptions(
  size: number,
  options: PatternRenderOptions
): GlyphOptions {
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
      }
    case 'dotLine':
      return { mode: 'dotLine', size }
    case 'aster':
      return {
        mode: 'aster',
        size,
        fillMode: options.asterFillMode,
        fillColor: options.asterFillColor,
        cross: options.asterCross,
      }
    case 'box':
      return { mode: 'box', size, edgeColor: options.boxEdgeColor }
    case 'pos16':
      return {
        mode: 'pos16',
        size,
        showLine: options.pos16ShowLine,
        showNeighborhood: options.pos16ShowNeighborhood,
        showBoundary: options.pos16ShowBoundary,
      }
    case 'amida':
      return {
        mode: 'amida',
        size,
        railMode: options.amidaRailMode,
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
