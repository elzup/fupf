import { ModeSwitch } from './ModeSwitch'
import { NotationSwitch } from './NotationSwitch'
import type { ModeSamplePreset } from '../lib/modeSamples'
import type { Mode, NotationStyle } from '../lib/types'

interface HeaderProps {
  currentMode: Mode
  notationStyle: NotationStyle
  monochrome: boolean
  emphasizeSingleBit: boolean
  onModeChange: (mode: Mode) => void
  onModePresetChange: (mode: Mode, preset: ModeSamplePreset) => void
  onNotationChange: (value: NotationStyle) => void
  onMonochromeChange: (value: boolean) => void
  onEmphasizeSingleBitChange: (value: boolean) => void
}

export function Header(props: HeaderProps) {
  return (
    <header>
      <div>
        <h1>fupf glyph</h1>
        <div className="desc">
          4要素 × 2bit = 8bit =
          256通りのパターン図形を、ボーダー、タイル、ポリゴン、4隅パス、丸点+線、Aster、ダイス、16²
          pos、あみだで表現します。
        </div>
      </div>
      <div className="header-right">
        <ModeSwitch
          currentMode={props.currentMode}
          onChange={props.onModeChange}
          onPresetSelect={props.onModePresetChange}
        />
        <NotationSwitch
          notationStyle={props.notationStyle}
          monochrome={props.monochrome}
          emphasizeSingleBit={props.emphasizeSingleBit}
          onNotationChange={props.onNotationChange}
          onMonochromeChange={props.onMonochromeChange}
          onEmphasizeSingleBitChange={props.onEmphasizeSingleBitChange}
        />
      </div>
    </header>
  )
}
