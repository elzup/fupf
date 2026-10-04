import { ASTER_COLORS, renderSymbolPreview } from 'fupf-glyph'
import { useMessages } from '../i18n'
import type { Mode } from '../lib/types'

interface LegendProps {
  currentMode: Mode
  currentSymbolSet: number
}

export function Legend({ currentMode, currentSymbolSet }: LegendProps) {
  const m = useMessages()
  const l = m.legend
  if (currentMode === 'edges') {
    return (
      <div className="legend">
        <h2>{l.edges.title}</h2>
        <div className="legend-item">
          <svg viewBox="0 0 40 16">
            <line
              x1="2"
              y1="8"
              x2="38"
              y2="8"
              stroke="#71717a"
              strokeWidth="2"
            />
          </svg>
          <span>{l.edges.none}</span>
        </div>
        <div className="legend-item">
          <svg viewBox="0 0 40 16">
            <line
              x1="2"
              y1="8"
              x2="38"
              y2="8"
              stroke="#e4e4e7"
              strokeWidth="2"
            />
          </svg>
          <span>{l.edges.solid}</span>
        </div>
        <div className="legend-item">
          <svg viewBox="0 0 40 16">
            <line
              x1="2"
              y1="8"
              x2="38"
              y2="8"
              stroke="#e4e4e7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
          <span>{l.edges.dashed}</span>
        </div>
        <div className="legend-item">
          <svg viewBox="0 0 40 16">
            <path
              d="M2,8 Q6.5,4 11,8 Q15.5,12 20,8 Q24.5,4 29,8 Q33.5,12 38,8"
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{l.edges.wave}</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.edges.note}
        </div>
      </div>
    )
  }

  if (currentMode === 'symbols') {
    return (
      <div className="legend">
        <h2>{l.symbols.title}</h2>
        {[0, 1, 2, 3].map((v) => (
          <div key={v} className="legend-item">
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: renderSymbolPreview(v, currentSymbolSet),
              }}
            />
            <span>{v.toString(2).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    )
  }

  if (currentMode === 'path') {
    return (
      <div className="legend">
        <h2>{l.path.title}</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#22d3ee',
              borderRadius: 2,
            }}
          />
          <span>{l.path.first}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#f472b6',
              borderRadius: 2,
            }}
          />
          <span>{l.path.second}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#facc15',
              borderRadius: 2,
            }}
          />
          <span>{l.path.third}</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">-</span>
          <span>{l.path.straight}</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">~</span>
          <span>{l.path.diagonal}</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">=</span>
          <span>{l.path.same}</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 12, color: 'var(--muted)' }}
        >
          {l.path.order}
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.path.highlight}
        </div>
      </div>
    )
  }

  if (currentMode === 'dotLine') {
    return (
      <div className="legend">
        <h2>{l.dotLine.title}</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              background: '#e4e4e7',
              borderRadius: '50%',
            }}
          />
          <span>{l.dotLine.dots}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#22d3ee',
              borderRadius: 2,
            }}
          />
          <span>{l.dotLine.line}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              border: '2px solid #22d3ee',
              borderRadius: '50%',
            }}
          />
          <span>{l.dotLine.start}</span>
        </div>
      </div>
    )
  }

  if (currentMode === 'aster') {
    return (
      <div className="legend">
        <h2>{l.aster.title}</h2>
        {m.asterDirections.map((d, i) => (
          <div key={d} className="legend-item">
            <span
              style={{
                display: 'inline-block',
                width: 24,
                height: 3,
                background: ASTER_COLORS[i],
                borderRadius: 2,
              }}
            />
            <span>{l.aster.bit(7 - i, d)}</span>
          </div>
        ))}
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.aster.order}
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.aster.fill}
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.aster.monochrome}
        </div>
      </div>
    )
  }

  if (currentMode === 'box') {
    return (
      <div className="legend">
        <h2>{l.box.title}</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              border: '1px solid #3f3f46',
            }}
          />
          <span>{l.box.shape}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              background: '#e4e4e7',
              borderRadius: '50%',
            }}
          />
          <span>{l.box.corner}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#22d3ee',
              borderRadius: 2,
            }}
          />
          <span>{l.box.loop}</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.box.note}
        </div>
      </div>
    )
  }

  if (currentMode === 'pos16') {
    return (
      <div className="legend">
        <h2>{l.pos16.title}</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              background: '#3f3f46',
              borderRadius: '50%',
            }}
          />
          <span>{l.pos16.positions}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              background: '#22d3ee',
              borderRadius: '50%',
            }}
          />
          <span>{l.pos16.selected}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#22d3ee',
              borderRadius: 2,
            }}
          />
          <span>{l.pos16.line}</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.pos16.note}
        </div>
      </div>
    )
  }

  if (currentMode === 'amida') {
    return (
      <div className="legend">
        <h2>{l.amida.title}</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 2,
              background: '#f472b6',
            }}
          />
          <span>{l.amida.unused}</span>
        </div>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              background: '#22d3ee',
              borderRadius: 2,
            }}
          />
          <span>{l.amida.route}</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.amida.count}
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          {l.amida.rails}
        </div>
      </div>
    )
  }

  return (
    <div className="legend">
      <h2>{l.triSplit.title}</h2>
      <div className="legend-item">
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            background: '#e4e4e7',
            clipPath: 'polygon(0 0,0 100%,100% 100%)',
          }}
        />
        <span>{l.triSplit.high}</span>
      </div>
      <div className="legend-item">
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            background: '#a1a1aa',
            clipPath: 'polygon(0 0,100% 0,100% 100%)',
          }}
        />
        <span>{l.triSplit.low}</span>
      </div>
      <div
        className="legend-item"
        style={{ marginTop: 8, color: 'var(--muted)' }}
      >
        {l.triSplit.note}
      </div>
    </div>
  )
}
