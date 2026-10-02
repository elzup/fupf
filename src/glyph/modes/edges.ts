import { stateFromIndex, type PatternState } from '../bits'
import { DEFAULT_GLYPH_SIZE, type GlyphResult, type SizeOption } from '../types'

export type EdgesOptions = SizeOption

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
  style: number
): string {
  if (style === 0) return ''
  const attrs = `fill="none" stroke="currentColor" stroke-width="${EDGE_STYLES[style].width}"`
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
  size = 40
): string {
  const pad = Math.max(8, size * 0.08)
  const inner = size - pad * 2
  const p1: [number, number] = [pad, pad]
  const p2: [number, number] = [pad + inner, pad]
  const p3: [number, number] = [pad + inner, pad + inner]
  const p4: [number, number] = [pad, pad + inner]
  const edges = [
    edgePath(...p1, ...p2, top),
    edgePath(...p2, ...p3, right),
    edgePath(...p3, ...p4, bottom),
    edgePath(...p4, ...p1, left),
  ]
    .filter(Boolean)
    .join('')

  return `<svg viewBox="0 0 ${size} ${size}" style="color:#e4e4e7">
    ${edges}
    <circle cx="${p1[0]}" cy="${p1[1]}" r="1.5" fill="#71717a"/>
    <circle cx="${p2[0]}" cy="${p2[1]}" r="1.5" fill="#71717a"/>
    <circle cx="${p3[0]}" cy="${p3[1]}" r="1.5" fill="#71717a"/>
    <circle cx="${p4[0]}" cy="${p4[1]}" r="1.5" fill="#71717a"/>
  </svg>`
}

export function edgeNotation({ a, b, c, d }: PatternState): string {
  const fmt = (v: number) => v.toString(2).padStart(2, '0')
  return `${fmt(a)}-${fmt(b)}-${fmt(c)}-${fmt(d)}`
}

export function renderEdges(
  index: number,
  options: Partial<EdgesOptions> = {}
): GlyphResult {
  const state = stateFromIndex(index)
  const { a, b, c, d } = state
  return {
    svg: glyphSvg(a, b, c, d, options.size ?? DEFAULT_GLYPH_SIZE),
    notation: edgeNotation(state),
  }
}
