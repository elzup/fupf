import { renderAmida, type AmidaOptions } from './modes/amida.js'
import { renderAster, type AsterOptions } from './modes/aster.js'
import { renderBox, type BoxOptions } from './modes/box.js'
import { renderDotLine, type DotLineOptions } from './modes/dotLine.js'
import { renderEdges, type EdgesOptions } from './modes/edges.js'
import { renderPath, type PathOptions } from './modes/path.js'
import { renderPos16, type Pos16Options } from './modes/pos16.js'
import { renderSymbols, type SymbolsOptions } from './modes/symbols.js'
import { renderTriSplit, type TriSplitOptions } from './modes/triSplit.js'
import type { GlyphResult } from './types.js'

interface GlyphOptionsMap {
  edges: EdgesOptions
  symbols: SymbolsOptions
  triSplit: TriSplitOptions
  path: PathOptions
  dotLine: DotLineOptions
  aster: AsterOptions
  box: BoxOptions
  pos16: Pos16Options
  amida: AmidaOptions
}

export type GlyphMode = keyof GlyphOptionsMap

export type GlyphOptions = {
  [M in GlyphMode]: { mode: M } & Partial<GlyphOptionsMap[M]>
}[GlyphMode]

export function renderGlyph(index: number, options: GlyphOptions): GlyphResult {
  switch (options.mode) {
    case 'edges':
      return renderEdges(index, options)
    case 'symbols':
      return renderSymbols(index, options)
    case 'triSplit':
      return renderTriSplit(index, options)
    case 'path':
      return renderPath(index, options)
    case 'dotLine':
      return renderDotLine(index, options)
    case 'aster':
      return renderAster(index, options)
    case 'box':
      return renderBox(index, options)
    case 'pos16':
      return renderPos16(index, options)
    case 'amida':
      return renderAmida(index, options)
  }
}

export { renderAmida, renderAster, renderBox, renderDotLine, renderEdges }
export { renderPath, renderPos16, renderSymbols, renderTriSplit }
export type {
  AmidaOptions,
  AsterOptions,
  BoxOptions,
  DotLineOptions,
  EdgesOptions,
  PathOptions,
  Pos16Options,
  SymbolsOptions,
  TriSplitOptions,
}
export { stateFromIndex, type PatternState } from './bits.js'
export { traceAmida, type AmidaTrace } from './modes/amida.js'
export { ASTER_COLORS } from './modes/aster.js'
export { renderSymbolPreview } from './modes/symbols.js'
export * from './types.js'
