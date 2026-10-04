import { fmt2bit, stateFromIndex, type PatternState } from '../bits.js'
import {
  DEFAULT_GLYPH_SIZE,
  type GlyphResult,
  type BaseGlyphOptions,
} from '../types.js'
import { fillAttr, resolvePalette, strokeAttr, type Paint } from '../palette.js'

export type EdgesOptions = BaseGlyphOptions

export const EDGE_STYLES: Record<
  number,
  { width: number; dash: string; wave: boolean }
> = {
  0: { width: 0, dash: '', wave: false },
  1: { width: 2, dash: '', wave: false },
  2: { width: 2, dash: '4 3', wave: false },
  3: { width: 2, dash: '', wave: true },
}

function edgePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: number,
  stroke: Paint
): string {
  if (style === 0) return ''
  const attrs = `fill="none" ${strokeAttr(stroke)} stroke-width="${EDGE_STYLES[style].width}"`
  if (EDGE_STYLES[style].dash) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs} stroke-dasharray="${EDGE_STYLES[style].dash}"/>`
  }
  if (EDGE_STYLES[style].wave) {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy)
    if (len === 0) return ''
    const nx = -dy / len
    const ny = dx / len
    const amp = Math.max(1.2, len * 0.07)
    const waves = 2
    const samples = 20
    let d = `M${x1},${y1}`
    for (let i = 1; i <= samples; i++) {
      const t = i / samples
      const bx = x1 + dx * t
      const by = y1 + dy * t
      const offset = amp * Math.sin(t * Math.PI * waves * 2)
      d += ` L${bx + nx * offset},${by + ny * offset}`
    }
    return `<path d="${d}" ${attrs} stroke-linecap="round" stroke-linejoin="round"/>`
  }
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`
}

export function glyphSvg(
  top: number,
  right: number,
  bottom: number,
  left: number,
  size = 40,
  palette = resolvePalette({}, 'edges')
): string {
  const pad = Math.max(8, size * 0.08)
  const inner = size - pad * 2
  const p1: [number, number] = [pad, pad]
  const p2: [number, number] = [pad + inner, pad]
  const p3: [number, number] = [pad + inner, pad + inner]
  const p4: [number, number] = [pad, pad + inner]
  const edges = [
    edgePath(...p1, ...p2, top, palette.fg),
    edgePath(...p2, ...p3, right, palette.fg),
    edgePath(...p3, ...p4, bottom, palette.fg),
    edgePath(...p4, ...p1, left, palette.fg),
  ]
    .filter(Boolean)
    .join('')
  const dots = [p1, p2, p3, p4]
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="1.5" ${fillAttr(palette.dim)}/>`
    )
    .join('')

  return `<svg viewBox="0 0 ${size} ${size}">${edges}${dots}</svg>`
}

export function edgeNotation({ a, b, c, d }: PatternState): string {
  return `${fmt2bit(a)}-${fmt2bit(b)}-${fmt2bit(c)}-${fmt2bit(d)}`
}

export function renderEdges(
  index: number,
  options: Partial<EdgesOptions> = {}
): GlyphResult {
  const state = stateFromIndex(index)
  const { a, b, c, d } = state
  return {
    svg: glyphSvg(
      a,
      b,
      c,
      d,
      options.size ?? DEFAULT_GLYPH_SIZE,
      resolvePalette(options, 'edges')
    ),
    notation: edgeNotation(state),
  }
}
