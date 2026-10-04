import { useMessages } from '../i18n'
import { COLOR_SCHEMES, NOTATION_STYLES } from '../lib/constants'
import type { ColorScheme, NotationStyle } from '../lib/types'

interface NotationSwitchProps {
  notationStyle: NotationStyle
  colorScheme: ColorScheme
  emphasizeSingleBit: boolean
  onNotationChange: (value: NotationStyle) => void
  onColorSchemeChange: (value: ColorScheme) => void
  onEmphasizeSingleBitChange: (value: boolean) => void
}

export function NotationSwitch({
  notationStyle,
  colorScheme,
  emphasizeSingleBit,
  onNotationChange,
  onColorSchemeChange,
  onEmphasizeSingleBitChange,
}: NotationSwitchProps) {
  const m = useMessages()
  return (
    <div className="notation-switch">
      <span className="select-label">{m.notation.label}</span>
      <div className="radio-group" id="notationStyleRadio">
        {NOTATION_STYLES.map((value) => (
          <span key={value}>
            <input
              type="radio"
              name="notationStyle"
              id={`notation-${value}`}
              value={value}
              checked={notationStyle === value}
              onChange={() => onNotationChange(value)}
            />
            <label htmlFor={`notation-${value}`}>
              {m.notation.styles[value]}
            </label>
          </span>
        ))}
      </div>
      <span className="select-label">{m.notation.colorScheme}</span>
      <div className="radio-group" id="colorSchemeRadio">
        {COLOR_SCHEMES.map((value) => (
          <span key={value}>
            <input
              type="radio"
              name="colorScheme"
              id={`color-${value}`}
              value={value}
              checked={colorScheme === value}
              onChange={() => onColorSchemeChange(value)}
            />
            <label htmlFor={`color-${value}`}>
              {m.notation.colorSchemes[value]}
            </label>
          </span>
        ))}
      </div>
      <label className="toggle">
        <input
          type="checkbox"
          checked={emphasizeSingleBit}
          onChange={(e) => onEmphasizeSingleBitChange(e.target.checked)}
        />
        <span>{m.notation.emphasizeSingleBit}</span>
      </label>
    </div>
  )
}
