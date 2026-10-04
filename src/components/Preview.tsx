import type { AppState, Mode } from '../lib/types'
import { useMessages } from '../i18n'
import { glyphDetail } from '../lib/glyphDetails'
import { notationIsGlyph, styleNotation } from '../lib/notation'
import { glyphCodeSample } from '../lib/codeSample'
import { renderPattern, toGlyphOptions } from '../lib/renderPattern'
import { CodeSample } from './CodeSample'

interface PreviewProps {
  selectedIndex: number
  currentMode: Mode
  currentSymbolSet: number
  highlightDuplicates: boolean
  polygonVariant: AppState['polygonVariant']
  asterFillMode: AppState['asterFillMode']
  asterFillColor: AppState['asterFillColor']
  asterCross: boolean
  boxEdgeColor: AppState['boxEdgeColor']
  amidaRailMode: AppState['amidaRailMode']
  notationStyle: AppState['notationStyle']
  monochrome: boolean
  pos16ShowLine: boolean
  pos16ShowNeighborhood: boolean
  pos16ShowBoundary: boolean
}

const PREVIEW_SIZE = 160

export function Preview(props: PreviewProps) {
  const m = useMessages()
  const { graphic, note } = renderPattern(
    props.selectedIndex,
    PREVIEW_SIZE,
    props
  )
  const label = m.preview.labels[props.currentMode]
  const detail = glyphDetail(props.currentMode, props.selectedIndex, m)
  const styledNote = styleNotation(
    props.selectedIndex,
    note,
    props.notationStyle
  )
  const isGlyph = notationIsGlyph(props.notationStyle)
  const code = glyphCodeSample(
    props.selectedIndex,
    toGlyphOptions(PREVIEW_SIZE, props),
    note
  )

  return (
    <>
      <div
        className="preview-box"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: graphic }}
      />
      <div className="info-row">
        <span className="label">mode</span>
        <code className="mode-id">{props.currentMode}</code>
      </div>
      <div className="info-row">
        <span className="label">{m.preview.decimal}</span>
        <span>{props.selectedIndex}</span>
      </div>
      <div className="info-row">
        <span className="label">{m.preview.binary}</span>
        <span>{props.selectedIndex.toString(2).padStart(8, '0')}</span>
      </div>
      <div className="info-row">
        <span className="label">{m.preview.hex}</span>
        <span>
          {props.selectedIndex.toString(16).toUpperCase().padStart(2, '0')}
        </span>
      </div>
      <div className="info-row">
        <span className="label">{m.preview.notation}</span>
        <span id="infoNote" className={isGlyph ? 'glyph' : ''}>
          {styledNote}
        </span>
      </div>
      <div className="info-row">
        <span className="label" id="infoLabel">
          {label}
        </span>
        <span id="infoDetail">{detail}</span>
      </div>
      <CodeSample code={code} />
    </>
  )
}
