import type { ColorOptions } from './palette.js'

export interface GlyphResult {
  svg: string
  notation: string
}

export interface SizeOption {
  size: number
}

export interface BaseGlyphOptions extends SizeOption, ColorOptions {}

export const DEFAULT_GLYPH_SIZE = 40

export type PolygonVariant = 'normal' | 'rhombus' | 'inverse'
export type AsterFillMode = 'none' | 'alpha' | 'solid'
export type AsterFillColor = 'segment' | 'run'
export type BoxEdgeColor = 'single' | 'angle' | 'xy' | 'grad'
export type AmidaRailMode = 'normal' | 'colored' | 'hidden'
export type NestedStyle = 'fill' | 'border'
