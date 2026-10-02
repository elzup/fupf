import { describe, expect, it } from 'vitest'
import { MODES } from './constants'
import {
  MODE_SAMPLE_INDEX,
  MODE_SAMPLE_INDICES,
  MODE_SAMPLE_LABELS,
  MODE_SAMPLE_PRESETS,
  renderModeSamples,
} from './modeSamples'

describe('mode samples', () => {
  it('uses 01-10-00-11 as the representative pattern', () => {
    expect(MODE_SAMPLE_INDEX).toBe(0b01100011)
    expect(MODE_SAMPLE_INDICES.aster).toBe(0b01111010)
  })

  it('registers an option preset for every mode', () => {
    expect(Object.keys(MODE_SAMPLE_PRESETS).sort()).toEqual([...MODES].sort())
    expect(Object.keys(MODE_SAMPLE_LABELS).sort()).toEqual([...MODES].sort())
    expect(
      MODES.every(
        (mode) =>
          MODE_SAMPLE_LABELS[mode].length === MODE_SAMPLE_PRESETS[mode].length
      )
    ).toBe(true)
    expect(
      MODE_SAMPLE_PRESETS.symbols.map((preset) => preset.currentSymbolSet)
    ).toEqual([0, 1, 2, 3])
    expect(
      MODE_SAMPLE_PRESETS.triSplit.map((preset) => preset.polygonVariant)
    ).toEqual(['normal', 'rhombus'])
    expect(MODE_SAMPLE_PRESETS.pos16).toEqual([
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
    ])
    expect(MODE_SAMPLE_PRESETS.amida[0]).toMatchObject({
      amidaRailMode: 'colored',
    })
    expect(MODE_SAMPLE_PRESETS.aster).toEqual([
      { asterFillMode: 'none', asterFillColor: 'run', asterCross: true },
      { asterFillMode: 'solid', asterFillColor: 'run', asterCross: true },
      { asterFillMode: 'solid', asterFillColor: 'segment', asterCross: true },
    ])
    expect(MODE_SAMPLE_PRESETS.box).toEqual([
      { boxEdgeColor: 'grad' },
      { boxEdgeColor: 'angle' },
    ])
  })

  it.each(MODES)('renders the %s mode sample', (mode) => {
    expect(
      renderModeSamples(mode).every((sample) => sample.includes('<svg'))
    ).toBe(true)
  })
})
