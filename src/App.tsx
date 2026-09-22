import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Grid } from './components/Grid'
import { ClockDemo } from './components/ClockDemo'
import { TextDemo } from './components/TextDemo'
import { usePersistentState } from './hooks/usePersistentState'
import type { AppState } from './lib/types'

export default function App() {
  const [state, updateState] = usePersistentState()

  const handleUpdate = (update: Partial<AppState>) => {
    updateState(update)
  }

  return (
    <>
      <Header
        currentMode={state.currentMode}
        notationStyle={state.notationStyle}
        monochrome={state.monochrome}
        emphasizeSingleBit={state.emphasizeSingleBit}
        onModeChange={(mode) => handleUpdate({ currentMode: mode })}
        onModePresetChange={(mode, preset) =>
          handleUpdate({ currentMode: mode, ...preset })
        }
        onNotationChange={(value) => handleUpdate({ notationStyle: value })}
        onMonochromeChange={(value) => handleUpdate({ monochrome: value })}
        onEmphasizeSingleBitChange={(value) =>
          handleUpdate({ emphasizeSingleBit: value })
        }
      />
      <ClockDemo state={state} />
      <TextDemo state={state} />
      <main>
        <Sidebar state={state} onUpdate={handleUpdate} />
        <Grid
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
          emphasizeSingleBit={state.emphasizeSingleBit}
          pos16ShowLine={state.pos16ShowLine}
          pos16ShowNeighborhood={state.pos16ShowNeighborhood}
          pos16ShowBoundary={state.pos16ShowBoundary}
          samplingPageBits={state.samplingPageBits}
          samplingPage={state.samplingPage}
          selectedIndex={state.selectedIndex}
          onSelect={(index) => handleUpdate({ selectedIndex: index })}
          onSamplingPageBitsChange={(bits) =>
            handleUpdate({ samplingPageBits: bits, samplingPage: 0 })
          }
          onSamplingPageChange={(page) => handleUpdate({ samplingPage: page })}
        />
      </main>
    </>
  )
}
