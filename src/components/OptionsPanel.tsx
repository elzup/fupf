import {
  AMIDA_RAIL_MODES,
  ASTER_FILL_COLORS,
  ASTER_FILL_MODES,
  BOX_EDGE_COLORS,
  POLYGON_VARIANT_LABELS,
  POLYGON_VARIANTS,
  SYMBOL_SET_LABELS,
} from '../lib/constants'
import type { AppState, Mode } from '../lib/types'

interface OptionsPanelProps {
  currentMode: Mode
  currentSymbolSet: number
  highlightDuplicates: boolean
  polygonVariant: AppState['polygonVariant']
  asterFillMode: AppState['asterFillMode']
  asterFillColor: AppState['asterFillColor']
  asterCross: boolean
  boxEdgeColor: AppState['boxEdgeColor']
  amidaRailMode: AppState['amidaRailMode']
  pos16ShowLine: boolean
  pos16ShowNeighborhood: boolean
  pos16ShowBoundary: boolean
  onSymbolSetChange: (value: number) => void
  onHighlightDuplicatesChange: (value: boolean) => void
  onPolygonVariantChange: (value: AppState['polygonVariant']) => void
  onAsterFillModeChange: (value: AppState['asterFillMode']) => void
  onAsterFillColorChange: (value: AppState['asterFillColor']) => void
  onAsterCrossChange: (value: boolean) => void
  onBoxEdgeColorChange: (value: AppState['boxEdgeColor']) => void
  onAmidaRailModeChange: (value: AppState['amidaRailMode']) => void
  onPos16ShowLineChange: (value: boolean) => void
  onPos16ShowNeighborhoodChange: (value: boolean) => void
  onPos16ShowBoundaryChange: (value: boolean) => void
}

export function OptionsPanel(props: OptionsPanelProps) {
  return (
    <div className="options-area">
      <div
        className={`path-options ${props.currentMode === 'path' ? 'visible' : ''}`}
      >
        <label className="toggle">
          <input
            type="checkbox"
            checked={props.highlightDuplicates}
            onChange={(e) =>
              props.onHighlightDuplicatesChange(e.target.checked)
            }
          />
          <span>同じ位置を強調（線を太く）</span>
        </label>
      </div>

      <div
        className={`path-options ${props.currentMode === 'symbols' ? 'visible' : ''}`}
      >
        <span className="select-label">記号セット</span>
        <div className="radio-group">
          {SYMBOL_SET_LABELS.map((label, idx) => (
            <span key={idx}>
              <input
                type="radio"
                name="symbolSet"
                id={`symbolSet-${idx}`}
                value={idx}
                checked={props.currentSymbolSet === idx}
                onChange={() => props.onSymbolSetChange(idx)}
              />
              <label htmlFor={`symbolSet-${idx}`}>{label}</label>
            </span>
          ))}
        </div>
      </div>

      <div
        className={`path-options ${props.currentMode === 'triSplit' ? 'visible' : ''}`}
      >
        <span className="select-label">分割パターン</span>
        <div className="radio-group">
          {POLYGON_VARIANTS.map((variant) => (
            <span key={variant}>
              <input
                type="radio"
                name="polygonVariant"
                id={`polygonVariant-${variant}`}
                value={variant}
                checked={props.polygonVariant === variant}
                onChange={() => props.onPolygonVariantChange(variant)}
              />
              <label htmlFor={`polygonVariant-${variant}`}>
                {POLYGON_VARIANT_LABELS[variant]}
              </label>
            </span>
          ))}
        </div>
      </div>

      <div
        className={`path-options ${props.currentMode === 'aster' ? 'visible' : ''}`}
      >
        <span className="select-label">連続する方向の塗りつぶし</span>
        <div className="radio-group">
          {ASTER_FILL_MODES.map(({ value, label }) => (
            <span key={value}>
              <input
                type="radio"
                name="asterFill"
                id={`asterFill-${value}`}
                value={value}
                checked={props.asterFillMode === value}
                onChange={() => props.onAsterFillModeChange(value)}
              />
              <label htmlFor={`asterFill-${value}`}>{label}</label>
            </span>
          ))}
        </div>
        <span className="select-label">塗りの配色</span>
        <div className="radio-group">
          {ASTER_FILL_COLORS.map(({ value, label }) => (
            <span key={value}>
              <input
                type="radio"
                name="asterFillColor"
                id={`asterFillColor-${value}`}
                value={value}
                checked={props.asterFillColor === value}
                onChange={() => props.onAsterFillColorChange(value)}
              />
              <label htmlFor={`asterFillColor-${value}`}>{label}</label>
            </span>
          ))}
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={props.asterCross}
            onChange={(e) => props.onAsterCrossChange(e.target.checked)}
          />
          <span>十字の罫線を表示</span>
        </label>
      </div>

      <div
        className={`path-options ${props.currentMode === 'box' ? 'visible' : ''}`}
      >
        <span className="select-label">辺の配色</span>
        <div className="radio-group">
          {BOX_EDGE_COLORS.map(({ value, label }) => (
            <span key={value}>
              <input
                type="radio"
                name="boxEdgeColor"
                id={`boxEdgeColor-${value}`}
                value={value}
                checked={props.boxEdgeColor === value}
                onChange={() => props.onBoxEdgeColorChange(value)}
              />
              <label htmlFor={`boxEdgeColor-${value}`}>{label}</label>
            </span>
          ))}
        </div>
      </div>

      <div
        className={`path-options ${props.currentMode === 'pos16' ? 'visible' : ''}`}
      >
        <label className="toggle">
          <input
            type="checkbox"
            checked={props.pos16ShowLine}
            onChange={(event) =>
              props.onPos16ShowLineChange(event.target.checked)
            }
          />
          <span>接続線を表示</span>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={props.pos16ShowNeighborhood}
            onChange={(event) =>
              props.onPos16ShowNeighborhoodChange(event.target.checked)
            }
          />
          <span>9近傍を塗る</span>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={props.pos16ShowBoundary}
            onChange={(event) =>
              props.onPos16ShowBoundaryChange(event.target.checked)
            }
          />
          <span>塗り領域の境界線を表示</span>
        </label>
      </div>

      <div
        className={`path-options ${props.currentMode === 'amida' ? 'visible' : ''}`}
      >
        <span className="select-label">独立した縦棒</span>
        <div className="radio-group">
          {AMIDA_RAIL_MODES.map(({ value, label }) => (
            <span key={value}>
              <input
                type="radio"
                name="amidaRailMode"
                id={`amidaRailMode-${value}`}
                value={value}
                checked={props.amidaRailMode === value}
                onChange={() => props.onAmidaRailModeChange(value)}
              />
              <label htmlFor={`amidaRailMode-${value}`}>{label}</label>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
