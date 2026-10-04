import { useMessages } from '../i18n'
import { NotationSwitch } from './NotationSwitch'
import type { ColorScheme, NotationStyle } from '../lib/types'

interface HeaderProps {
  notationStyle: NotationStyle
  colorScheme: ColorScheme
  emphasizeSingleBit: boolean
  onNotationChange: (value: NotationStyle) => void
  onColorSchemeChange: (value: ColorScheme) => void
  onEmphasizeSingleBitChange: (value: boolean) => void
}

export function Header(props: HeaderProps) {
  const m = useMessages()
  return (
    <header>
      <div>
        <h1>fupf glyph</h1>
        <div className="desc">{m.description}</div>
      </div>
      <div className="header-right">
        <NotationSwitch
          notationStyle={props.notationStyle}
          colorScheme={props.colorScheme}
          emphasizeSingleBit={props.emphasizeSingleBit}
          onNotationChange={props.onNotationChange}
          onColorSchemeChange={props.onColorSchemeChange}
          onEmphasizeSingleBitChange={props.onEmphasizeSingleBitChange}
        />
      </div>
    </header>
  )
}
