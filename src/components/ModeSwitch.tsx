import { MODE_LABELS } from '../lib/constants'
import {
  MODE_SAMPLE_INDICES,
  MODE_SAMPLE_LABELS,
  MODE_SAMPLE_PRESETS,
  renderModeSamples,
  type ModeSamplePreset,
} from '../lib/modeSamples'
import type { Mode } from '../lib/types'

interface ModeSwitchProps {
  currentMode: Mode
  onChange: (mode: Mode) => void
  onPresetSelect: (mode: Mode, preset: ModeSamplePreset) => void
}

interface ModeButtonProps extends ModeSwitchProps {
  mode: Mode
}

function ModeButton({
  mode,
  currentMode,
  onChange,
  onPresetSelect,
}: ModeButtonProps) {
  const samples = renderModeSamples(mode)

  return (
    <div className="mode-choice">
      <button
        type="button"
        className={`mode-select-button ${currentMode === mode ? 'active' : ''}`}
        onClick={() => onChange(mode)}
      >
        {MODE_LABELS[mode]}
      </button>
      <span className="mode-samples" data-sample-count={samples.length}>
        {samples.map((graphic, index) => (
          <button
            key={index}
            type="button"
            className="mode-sample"
            data-mode={mode}
            data-pattern-index={MODE_SAMPLE_INDICES[mode]}
            aria-label={`${MODE_LABELS[mode]}: ${MODE_SAMPLE_LABELS[mode][index]}`}
            title={MODE_SAMPLE_LABELS[mode][index]}
            onClick={() =>
              onPresetSelect(mode, MODE_SAMPLE_PRESETS[mode][index])
            }
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: graphic }}
          />
        ))}
      </span>
    </div>
  )
}

export function ModeSwitch(props: ModeSwitchProps) {
  return (
    <div className="mode-switch">
      <ModeButton mode="edges" {...props} />
      <span className="mode-separator" />
      <div className="mode-group">
        {(['symbols', 'triSplit', 'path'] as const).map((mode) => (
          <ModeButton key={mode} mode={mode} {...props} />
        ))}
      </div>
      <span className="mode-separator" />
      <ModeButton mode="dotLine" {...props} />
      <span className="mode-separator" />
      <ModeButton mode="aster" {...props} />
      <span className="mode-separator" />
      <ModeButton mode="box" {...props} />
      <span className="mode-separator" />
      <ModeButton mode="pos16" {...props} />
      <span className="mode-separator" />
      <ModeButton mode="amida" {...props} />
    </div>
  )
}
