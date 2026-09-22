import { useState } from 'react'
import { splitFupfChars, type FupfChar } from '../lib/fupfText'
import { renderPattern, type PatternRenderOptions } from '../lib/renderPattern'

interface TextDemoProps {
  state: PatternRenderOptions
}

const DEFAULT_TEXT = 'Hello fupf\nこんにちは'
const GLYPH_RENDER_SIZE = 40

function FupfCharView({
  item,
  state,
}: {
  item: FupfChar
  state: PatternRenderOptions
}) {
  if (item.isWhitespace) return <>{item.char}</>

  return (
    <span className="fupf-char" data-bytes={item.bytes.length}>
      {item.bytes.map((byte, i) => (
        <span
          key={i}
          className="fupf-glyph"
          aria-hidden="true"
          data-byte={byte}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: renderPattern(byte, GLYPH_RENDER_SIZE, state).graphic,
          }}
        />
      ))}
      {/* Visually hidden source char so selecting and copying yields the original text. */}
      <span className="fupf-source">{item.char}</span>
    </span>
  )
}

export function FupfText({
  text,
  state,
}: {
  text: string
  state: PatternRenderOptions
}) {
  return (
    <p className="fupf-text" aria-label={text}>
      {splitFupfChars(text).map((item, i) => (
        <FupfCharView key={i} item={item} state={state} />
      ))}
    </p>
  )
}

export function TextDemo({ state }: TextDemoProps) {
  const [text, setText] = useState(DEFAULT_TEXT)

  return (
    <section className="text-demo" aria-label="Text demo">
      <textarea
        className="text-demo-input"
        value={text}
        rows={2}
        onChange={(event) => setText(event.target.value)}
        aria-label="Text to render"
      />
      <FupfText text={text} state={state} />
    </section>
  )
}
