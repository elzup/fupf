import { fmt2bit, stateFromIndex } from '../bits.js'
import {
  DEFAULT_GLYPH_SIZE,
  type AmidaRailMode,
  type GlyphResult,
  type BaseGlyphOptions,
} from '../types.js'
import { fillAttr, resolvePalette, strokeAttr } from '../palette.js'

export interface AmidaOptions extends BaseGlyphOptions {
  /** 横線にも経路にも触れない縦線の描き方 */
  railMode: AmidaRailMode
  monochrome: boolean
}

export interface AmidaTrace {
  start: number
  end: number
  rungs: number[]
  columns: number[]
}

function nextColumn(column: number, rung: number): number {
  if (rung === 0) return column
  const leftColumn = rung - 1
  if (column === leftColumn) return column + 1
  if (column === leftColumn + 1) return column - 1
  return column
}

function isIsolatedRail(trace: AmidaTrace, column: number): boolean {
  const hasRung = trace.rungs.some(
    (rung) => rung > 0 && (rung - 1 === column || rung === column)
  )
  return !hasRung && !trace.columns.includes(column)
}

export function traceAmida(index: number): AmidaTrace {
  const { a, b, c, d } = stateFromIndex(index)
  const rungs = [a, b, c]
  const columns = rungs.reduce<number[]>(
    (route, rung) => {
      const currentColumn = route[route.length - 1]
      return [...route, nextColumn(currentColumn, rung)]
    },
    [d]
  )

  return {
    start: d,
    end: columns[columns.length - 1],
    rungs,
    columns,
  }
}

export function amidaSvg(
  index: number,
  size = 40,
  palette = resolvePalette({}, 'amida'),
  railMode: AmidaRailMode = 'normal'
): string {
  const trace = traceAmida(index)
  const horizontalPad = size * 0.14
  const top = size * 0.08
  const bottom = size * 0.92
  const railGap = (size - horizontalPad * 2) / 3
  const railXs = Array.from(
    { length: 4 },
    (_, column) => horizontalPad + railGap * column
  )
  const rungYs = [size * 0.28, size * 0.5, size * 0.72]
  const baseWidth = Math.max(0.8, size * 0.025)
  const routeWidth = Math.max(1.8, size * 0.065)
  const markerRadius = Math.max(1.5, size * 0.045)
  const accentColor = palette.accents[0]
  const rails = railXs
    .map((x, column) => {
      const isIsolated = isIsolatedRail(trace, column)
      if (isIsolated && railMode === 'hidden') return ''
      const railColor =
        isIsolated && railMode === 'colored' ? palette.alt : palette.rail
      return `<line data-amida-rail="${column}" data-amida-rail-isolated="${isIsolated}" x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" ${strokeAttr(railColor)} stroke-width="${baseWidth}"/>`
    })
    .join('')
  const rungs = trace.rungs
    .map((rung, row) => {
      if (rung === 0) return ''
      const leftColumn = rung - 1
      const isUsed = trace.columns[row] !== trace.columns[row + 1]
      const stroke = isUsed ? palette.muted : palette.accents[1]
      return `<line data-amida-rung="${row}" x1="${railXs[leftColumn]}" y1="${rungYs[row]}" x2="${railXs[leftColumn + 1]}" y2="${rungYs[row]}" data-amida-rung-used="${isUsed}" ${strokeAttr(stroke)} stroke-width="${baseWidth}"/>`
    })
    .join('')

  const routePoints = trace.rungs.reduce<Array<[number, number]>>(
    (points, _rung, row) => {
      const beforeColumn = trace.columns[row]
      const afterColumn = trace.columns[row + 1]
      const rowPoints: Array<[number, number]> = [
        [railXs[beforeColumn], rungYs[row]],
      ]
      return beforeColumn === afterColumn
        ? [...points, ...rowPoints]
        : [...points, ...rowPoints, [railXs[afterColumn], rungYs[row]]]
    },
    [[railXs[trace.start], top]]
  )
  const points = [...routePoints, [railXs[trace.end], bottom]]
    .map(([x, y]) => `${x},${y}`)
    .join(' ')

  const route = `<polyline data-amida-route="true" points="${points}" fill="none" ${strokeAttr(accentColor)} stroke-width="${routeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
  const startMarker = `<circle data-amida-start="${trace.start}" cx="${railXs[trace.start]}" cy="${top}" r="${markerRadius}" ${fillAttr(palette.bg)} ${strokeAttr(accentColor)} stroke-width="${baseWidth}"/>`
  const endMarker = `<circle data-amida-end="${trace.end}" cx="${railXs[trace.end]}" cy="${bottom}" r="${markerRadius}" ${fillAttr(accentColor)}/>`

  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet"><g data-amida-rails="true">${rails}${rungs}</g>${route}${startMarker}${endMarker}</svg>`
}

export function amidaNotation(index: number): string {
  const { rungs, start } = traceAmida(index)
  return `${rungs.map(fmt2bit).join('-')}|${fmt2bit(start)}`
}

export function renderAmida(
  index: number,
  options: Partial<AmidaOptions> = {}
): GlyphResult {
  return {
    svg: amidaSvg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      resolvePalette(options, 'amida'),
      options.railMode ?? 'normal'
    ),
    notation: amidaNotation(index),
  }
}
