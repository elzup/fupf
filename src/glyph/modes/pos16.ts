import {
  DEFAULT_GLYPH_SIZE,
  type GlyphResult,
  type BaseGlyphOptions,
} from '../types.js'
import {
  fillAttr,
  resolvePalette,
  strokeAttr,
  type GlyphPalette,
  type Paint,
} from '../palette.js'

export interface Pos16Options extends BaseGlyphOptions {
  monochrome: boolean
  showLine: boolean
  showNeighborhood: boolean
  showBoundary: boolean
}

interface Pos16RenderOptions {
  showLine: boolean
  showNeighborhood: boolean
  showBoundary: boolean
}

interface Pos16Geometry {
  pad: number
  cell: number
  blockSize: number
  halfBlock: number
  lineWidth: number
}

const DEFAULT_OPTIONS: Pos16RenderOptions = {
  showLine: true,
  showNeighborhood: true,
  showBoundary: false,
}

export function pos16Svg(
  index: number,
  size = 40,
  partialOptions: Partial<Pos16RenderOptions> = {},
  palette = resolvePalette({}, 'pos16')
): string {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions }
  const start = (index >> 4) & 0x0f
  const end = index & 0x0f
  const geometry = createGeometry(size)
  const accentColor = palette.accents[0]
  const backgrounds = renderBackgrounds(
    start,
    end,
    geometry,
    options.showNeighborhood,
    palette
  )
  const boundary = options.showBoundary
    ? renderNeighborhoodBoundary(start, end, geometry, accentColor)
    : ''
  const markers = renderMarkers(
    start,
    end,
    geometry,
    accentColor,
    palette.muted
  )
  const line = options.showLine
    ? renderConnectingLine(start, end, geometry, accentColor, size)
    : ''

  return `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">${backgrounds}${boundary}${markers}${line}</svg>`
}

function createGeometry(size: number): Pos16Geometry {
  const pad = size * 0.1
  const cell = (size - pad * 2) / 4
  const blockSize = cell * 0.78
  return {
    pad,
    cell,
    blockSize,
    halfBlock: blockSize / 2,
    lineWidth: Math.max(1, size * 0.03),
  }
}

function positionAt(position: number, geometry: Pos16Geometry) {
  const col = position % 4
  const row = Math.floor(position / 4)
  return [
    geometry.pad + geometry.cell * (col + 0.5),
    geometry.pad + geometry.cell * (row + 0.5),
  ] as const
}

function renderBackgrounds(
  start: number,
  end: number,
  geometry: Pos16Geometry,
  showNeighborhood: boolean,
  palette: GlyphPalette
): string {
  return Array.from({ length: 16 }, (_, index) => {
    const [x, y] = positionAt(index, geometry)
    const isStartNeighbor = isInNeighborhood(index, start)
    const isEndNeighbor = isInNeighborhood(index, end)
    const isNeighborhood = isStartNeighbor || isEndNeighbor
    const isOverlap = isStartNeighbor && isEndNeighbor && start !== end
    const fill = showNeighborhood
      ? isOverlap
        ? palette.muted
        : isNeighborhood
          ? palette.rail
          : palette.bg
      : palette.bg
    const dataAttribute =
      showNeighborhood && isNeighborhood
        ? ' data-pos16-neighborhood="true"'
        : ''
    const offset = geometry.blockSize / 2
    const radius = geometry.blockSize * 0.18

    return `<rect${dataAttribute} x="${x - offset}" y="${y - offset}" width="${
      geometry.blockSize
    }" height="${
      geometry.blockSize
    }" rx="${radius}" ${fillAttr(fill)} ${strokeAttr(palette.guide)} stroke-width="${
      geometry.cell * 0.025
    }"/>`
  }).join('')
}

function renderMarkers(
  start: number,
  end: number,
  geometry: Pos16Geometry,
  accentColor: Paint,
  dotColor: Paint
): string {
  return Array.from({ length: 16 }, (_, index) => {
    const [x, y] = positionAt(index, geometry)
    if (index === start && start === end) {
      return `<circle cx="${x}" cy="${y}" r="${
        geometry.halfBlock * 0.9
      }" fill="none" ${strokeAttr(accentColor)} stroke-width="${
        geometry.lineWidth
      }"/><circle cx="${x}" cy="${y}" r="${
        geometry.halfBlock * 0.5
      }" ${fillAttr(accentColor)}/>`
    }
    if (index === start) {
      return `<circle cx="${x}" cy="${y}" r="${
        geometry.halfBlock * 0.75
      }" fill="none" ${strokeAttr(accentColor)} stroke-width="${
        geometry.lineWidth
      }"/><circle cx="${x}" cy="${y}" r="${
        geometry.halfBlock * 0.3
      }" ${fillAttr(accentColor)}/>`
    }
    if (index === end) {
      return `<circle cx="${x}" cy="${y}" r="${
        geometry.halfBlock * 0.65
      }" ${fillAttr(accentColor)}/>`
    }
    return `<circle cx="${x}" cy="${y}" r="${
      geometry.halfBlock * 0.18
    }" ${fillAttr(dotColor)}/>`
  }).join('')
}

function renderConnectingLine(
  start: number,
  end: number,
  geometry: Pos16Geometry,
  accentColor: Paint,
  size: number
): string {
  const [startX, startY] = positionAt(start, geometry)
  if (start === end) {
    const loop = `<circle cx="${startX}" cy="${startY}" r="${
      geometry.halfBlock * 0.75
    }" fill="none" ${strokeAttr(accentColor)} stroke-width="${
      geometry.lineWidth
    }" stroke-dasharray="${size * 0.03} ${size * 0.025}"/>`
    return `<g data-pos16-line="true">${loop}</g>`
  }

  const [endX, endY] = positionAt(end, geometry)
  const deltaX = endX - startX
  const deltaY = endY - startY
  const distance = Math.hypot(deltaX, deltaY)
  const startOffset = Math.min(geometry.halfBlock * 0.5, distance / 2)
  const stopRatio = Math.max(0, 1 - (geometry.halfBlock * 0.65) / distance)
  const lineStartX = startX + deltaX * (startOffset / distance)
  const lineStartY = startY + deltaY * (startOffset / distance)
  const lineEndX = startX + deltaX * stopRatio
  const lineEndY = startY + deltaY * stopRatio
  const arrow = renderArrow(
    lineEndX,
    lineEndY,
    Math.atan2(deltaY, deltaX),
    Math.min(size * 0.06, geometry.halfBlock * 0.4),
    accentColor
  )
  const line = `<line x1="${lineStartX}" y1="${lineStartY}" x2="${lineEndX}" y2="${lineEndY}" ${strokeAttr(accentColor)} stroke-width="${geometry.lineWidth}" stroke-linecap="round"/>`
  return `<g data-pos16-line="true">${line}${arrow}</g>`
}

function renderArrow(
  endX: number,
  endY: number,
  angle: number,
  length: number,
  color: Paint
): string {
  const spread = Math.PI / 6
  const point1X = endX - length * Math.cos(angle - spread)
  const point1Y = endY - length * Math.sin(angle - spread)
  const point2X = endX - length * Math.cos(angle + spread)
  const point2Y = endY - length * Math.sin(angle + spread)
  return `<polygon points="${endX},${endY} ${point1X},${point1Y} ${point2X},${point2Y}" ${fillAttr(color)}/>`
}

function renderNeighborhoodBoundary(
  start: number,
  end: number,
  geometry: Pos16Geometry,
  color: Paint
): string {
  const sides = [
    { row: -1, col: 0, edge: 'top' },
    { row: 0, col: 1, edge: 'right' },
    { row: 1, col: 0, edge: 'bottom' },
    { row: 0, col: -1, edge: 'left' },
  ] as const
  const segments = Array.from({ length: 16 }, (_, index) => index)
    .filter(
      (index) => isInNeighborhood(index, start) || isInNeighborhood(index, end)
    )
    .flatMap((index) => {
      const row = Math.floor(index / 4)
      const col = index % 4
      return sides
        .filter(({ row: rowOffset, col: colOffset }) =>
          isOutsideNeighborhood(row + rowOffset, col + colOffset, start, end)
        )
        .map(({ edge }) => boundarySegment(row, col, edge, geometry))
    })
  return `<path data-pos16-boundary="true" d="${segments.join(
    ''
  )}" fill="none" ${strokeAttr(color)} stroke-width="${
    geometry.lineWidth
  }" stroke-linecap="round" stroke-linejoin="round"/>`
}

function isOutsideNeighborhood(
  row: number,
  col: number,
  start: number,
  end: number
): boolean {
  if (row < 0 || row >= 4 || col < 0 || col >= 4) return true
  const index = row * 4 + col
  return !isInNeighborhood(index, start) && !isInNeighborhood(index, end)
}

function boundarySegment(
  row: number,
  col: number,
  edge: 'top' | 'right' | 'bottom' | 'left',
  geometry: Pos16Geometry
): string {
  const left = geometry.pad + col * geometry.cell
  const top = geometry.pad + row * geometry.cell
  const right = left + geometry.cell
  const bottom = top + geometry.cell
  const points = {
    top: [left, top, right, top],
    right: [right, top, right, bottom],
    bottom: [right, bottom, left, bottom],
    left: [left, bottom, left, top],
  }[edge]
  return `M${points[0]} ${points[1]}L${points[2]} ${points[3]}`
}

function isInNeighborhood(index: number, center: number): boolean {
  const col = index % 4
  const row = Math.floor(index / 4)
  const centerCol = center % 4
  const centerRow = Math.floor(center / 4)
  return Math.abs(col - centerCol) <= 1 && Math.abs(row - centerRow) <= 1
}

export function pos16Notation(index: number): string {
  const start = (index >> 4) & 0x0f
  const end = index & 0x0f
  return `${start.toString(2).padStart(4, '0')}-${end
    .toString(2)
    .padStart(4, '0')}`
}

export function renderPos16(
  index: number,
  options: Partial<Pos16Options> = {}
): GlyphResult {
  return {
    svg: pos16Svg(
      index,
      options.size ?? DEFAULT_GLYPH_SIZE,
      options,
      resolvePalette(options, 'pos16')
    ),
    notation: pos16Notation(index),
  }
}
