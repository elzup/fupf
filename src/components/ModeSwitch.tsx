import type { MouseEvent } from 'react'
import { useMessages } from '../i18n'
import { MODES } from '../lib/constants'
import {
  MODE_SAMPLE_INDICES,
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

interface ModeCardProps extends ModeSwitchProps {
  mode: Mode
}

function ModeCard({
  mode,
  currentMode,
  onChange,
  onPresetSelect,
}: ModeCardProps) {
  const m = useMessages()
  const label = m.modes[mode]
  const samples = renderModeSamples(mode)
  const isActive = currentMode === mode
  // カードの余白クリックでも切り替える。内側のボタンは自前で処理するので二重に発火させない
  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    onChange(mode)
  }

  return (
    <div
      className={`mode-choice ${isActive ? 'active' : ''}`}
      onClick={handleCardClick}
    >
      <button
        type="button"
        className={`mode-select-button ${isActive ? 'active' : ''}`}
        aria-label={label}
        onClick={() => onChange(mode)}
      >
        <span className="mode-label">{label}</span>
        <code className="mode-id">{mode}</code>
      </button>
      <span className="mode-samples">
        {samples.map((graphic, index) => (
          <button
            key={index}
            type="button"
            className="mode-sample"
            data-mode={mode}
            data-pattern-index={MODE_SAMPLE_INDICES[mode]}
            aria-label={`${label}: ${m.modeSamples[mode][index]}`}
            title={m.modeSamples[mode][index]}
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
  const m = useMessages()
  return (
    <nav className="mode-switch" aria-label={m.modeNav}>
      {MODES.map((mode) => (
        <ModeCard key={mode} mode={mode} {...props} />
      ))}
    </nav>
  )
}
