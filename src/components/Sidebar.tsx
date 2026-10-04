import { OptionsPanel } from './OptionsPanel'
import { Preview } from './Preview'
import { Legend } from './Legend'
import type { AppState } from '../lib/types'
import { useMessages } from '../i18n'

interface SidebarProps {
  state: AppState
  onUpdate: (update: Partial<AppState>) => void
}

export function Sidebar({ state, onUpdate }: SidebarProps) {
  const m = useMessages()
  return (
    <aside>
      <h2>{m.preview.heading}</h2>
      <Preview
        selectedIndex={state.selectedIndex}
        currentMode={state.currentMode}
        currentSymbolSet={state.currentSymbolSet}
        highlightDuplicates={state.highlightDuplicates}
        polygonVariant={state.polygonVariant}
        asterFillMode={state.asterFillMode}
        asterFillColor={state.asterFillColor}
        asterCross={state.asterCross}
        boxEdgeColor={state.boxEdgeColor}
        amidaRailMode={state.amidaRailMode}
        notationStyle={state.notationStyle}
        monochrome={state.monochrome}
        pos16ShowLine={state.pos16ShowLine}
        pos16ShowNeighborhood={state.pos16ShowNeighborhood}
        pos16ShowBoundary={state.pos16ShowBoundary}
      />
      <OptionsPanel
        currentMode={state.currentMode}
        currentSymbolSet={state.currentSymbolSet}
        highlightDuplicates={state.highlightDuplicates}
        polygonVariant={state.polygonVariant}
        asterFillMode={state.asterFillMode}
        asterFillColor={state.asterFillColor}
        asterCross={state.asterCross}
        boxEdgeColor={state.boxEdgeColor}
        amidaRailMode={state.amidaRailMode}
        pos16ShowLine={state.pos16ShowLine}
        pos16ShowNeighborhood={state.pos16ShowNeighborhood}
        pos16ShowBoundary={state.pos16ShowBoundary}
        onSymbolSetChange={(value) => onUpdate({ currentSymbolSet: value })}
        onHighlightDuplicatesChange={(value) =>
          onUpdate({ highlightDuplicates: value })
        }
        onPolygonVariantChange={(value) => onUpdate({ polygonVariant: value })}
        onAsterFillModeChange={(value) => onUpdate({ asterFillMode: value })}
        onAsterFillColorChange={(value) => onUpdate({ asterFillColor: value })}
        onAsterCrossChange={(value) => onUpdate({ asterCross: value })}
        onBoxEdgeColorChange={(value) => onUpdate({ boxEdgeColor: value })}
        onAmidaRailModeChange={(value) => onUpdate({ amidaRailMode: value })}
        onPos16ShowLineChange={(value) => onUpdate({ pos16ShowLine: value })}
        onPos16ShowNeighborhoodChange={(value) =>
          onUpdate({ pos16ShowNeighborhood: value })
        }
        onPos16ShowBoundaryChange={(value) =>
          onUpdate({ pos16ShowBoundary: value })
        }
      />
      <Legend
        currentMode={state.currentMode}
        currentSymbolSet={state.currentSymbolSet}
      />
    </aside>
  )
}
