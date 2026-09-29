import { popcount } from '../lib/state'
import { notationIsGlyph, styleNotation } from '../lib/notation'
import { renderPattern } from '../lib/renderPattern'
import type { AppState, Mode } from '../lib/types'

interface GridCellProps {
  index: number
  currentMode: Mode
  currentSymbolSet: number
  highlightDuplicates: boolean
  polygonVariant: AppState['polygonVariant']
  asterFillMode: AppState['asterFillMode']
  asterFillColor: AppState['asterFillColor']
  asterCross: boolean
  boxEdgeColor: AppState['boxEdgeColor']
  amidaRailMode: AppState['amidaRailMode']
  notationStyle: AppState['notationStyle']
  monochrome: boolean
  emphasizeSingleBit: boolean
  pos16ShowLine: boolean
  pos16ShowNeighborhood: boolean
  pos16ShowBoundary: boolean
  selectedIndex: number
  onSelect: (index: number) => void
  useMatrixLayout?: boolean
}

export function GridCell(props: GridCellProps) {
  const { graphic, note } = renderPattern(props.index, 40, props)

  const noteText = styleNotation(props.index, note, props.notationStyle)
  const isGlyph = notationIsGlyph(props.notationStyle)
  const isActive = props.selectedIndex === props.index
  const isBit1 = props.emphasizeSingleBit && popcount(props.index) === 1
  const className = ['cell', isActive ? 'active' : '', isBit1 ? 'bit1' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      id={`cell-${props.index}`}
      style={
        !props.useMatrixLayout
          ? undefined
          : {
              gridColumn: (props.index % 16) + 3,
              gridRow: Math.floor(props.index / 16) + 3,
            }
      }
      onClick={() => props.onSelect(props.index)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          <div class="idx">${props.index}</div>
          ${graphic}
          <div class="notation${isGlyph ? ' glyph' : ''}">${noteText}</div>
        `,
      }}
    />
  )
}
