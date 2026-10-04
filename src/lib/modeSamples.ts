import { DEFAULT_STATE } from './constants'
import { renderPattern, type PatternRenderOptions } from './renderPattern'
import type { Mode } from './types'

export type ModeSamplePreset = Partial<
  Omit<PatternRenderOptions, 'currentMode'>
>

export const MODE_SAMPLE_INDEX = 0b01100011

export const MODE_SAMPLE_INDICES: Record<Mode, number> = {
  edges: MODE_SAMPLE_INDEX,
  symbols: MODE_SAMPLE_INDEX,
  triSplit: MODE_SAMPLE_INDEX,
  path: MODE_SAMPLE_INDEX,
  dotLine: MODE_SAMPLE_INDEX,
  aster: 0b01111010,
  box: MODE_SAMPLE_INDEX,
  pos16: MODE_SAMPLE_INDEX,
  amida: MODE_SAMPLE_INDEX,
}

export const MODE_SAMPLE_PRESETS: Record<Mode, ModeSamplePreset[]> = {
  edges: [{}],
  symbols: [0, 1, 2, 3].map((currentSymbolSet) => ({ currentSymbolSet })),
  triSplit: [{ polygonVariant: 'normal' }, { polygonVariant: 'rhombus' }],
  path: [{ highlightDuplicates: false }],
  dotLine: [{}],
  aster: [
    { asterFillMode: 'none', asterFillColor: 'run', asterCross: true },
    { asterFillMode: 'solid', asterFillColor: 'run', asterCross: true },
    { asterFillMode: 'solid', asterFillColor: 'segment', asterCross: true },
  ],
  box: [{ boxEdgeColor: 'grad' }, { boxEdgeColor: 'angle' }],
  pos16: [
    {
      pos16ShowLine: false,
      pos16ShowNeighborhood: false,
      pos16ShowBoundary: true,
    },
    {
      pos16ShowLine: true,
      pos16ShowNeighborhood: true,
      pos16ShowBoundary: false,
    },
  ],
  amida: [{ amidaRailMode: 'colored' }],
}

export function renderModeSamples(mode: Mode): string[] {
  return MODE_SAMPLE_PRESETS[mode].map(
    (preset) =>
      renderPattern(MODE_SAMPLE_INDICES[mode], 32, {
        ...DEFAULT_STATE,
        ...preset,
        currentMode: mode,
      }).graphic
  )
}
