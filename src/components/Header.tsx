import { useMessages } from '../i18n'
import { NotationSwitch } from './NotationSwitch'
import type { NotationStyle } from '../lib/types'

interface HeaderProps {
  notationStyle: NotationStyle
  monochrome: boolean
  emphasizeSingleBit: boolean
  onNotationChange: (value: NotationStyle) => void
  onMonochromeChange: (value: boolean) => void
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
