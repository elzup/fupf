import { ASTER_COLORS, renderSymbolPreview } from 'fupf-glyph'
import { ASTER_DIRECTIONS } from '../lib/glyphDetails'
import type { Mode } from '../lib/types'

interface LegendProps {
  currentMode: Mode
  currentSymbolSet: number
}

export function Legend({ currentMode, currentSymbolSet }: LegendProps) {
  if (currentMode === 'edges') {
    return (
      <div className="legend">
        <h2>線スタイル凡例</h2>
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
          <span>00 — 無し（非表示）</span>
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
          <span>01 — 実線</span>
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
          <span>10 — 破線</span>
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
          <span>11 — 波線</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          各辺の値はハイフン区切りで表示されます。
        </div>
      </div>
    )
  }

  if (currentMode === 'symbols') {
    return (
      <div className="legend">
        <h2>タイル凡例</h2>
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
        <h2>パス凡例</h2>
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
          <span>1本目の線分</span>
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
          <span>2本目の線分（破線）</span>
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
          <span>3本目の線分（点線）</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">-</span>
          <span>水平／垂直</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">~</span>
          <span>斜め</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol">=</span>
          <span>同一点（線なし）</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 12, color: 'var(--muted)' }}
        >
          番号付き丸が通過順。矢印が進行方向です。
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          「同じ位置を強調」ON で、繰り返し通過した角や線が太くなります。
        </div>
      </div>
    )
  }

  if (currentMode === 'dotLine') {
    return (
      <div className="legend">
        <h2>丸点+線 凡例</h2>
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
          <span>上位4bitで四隅の丸点ON/OFF</span>
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
          <span>下位4bitで2bit→2bitの線</span>
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
          <span>始点には二重円がつき、方向が分かります</span>
        </div>
      </div>
    )
  }

  if (currentMode === 'aster') {
    return (
      <div className="legend">
        <h2>Aster 凡例</h2>
        {ASTER_DIRECTIONS.map((d, i) => (
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
            <span>
              bit{7 - i}＝{d}
            </span>
          </div>
        ))}
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          bit7=上から時計回り。8bit = 256通り
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          「塗りつぶし」で連続する方向の間を扇形で塗ります（配色は区間ごと／連続の始点色）。塗りに覆われる棒は非表示。
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          色は共通オプションの「モノクロ」で白黒に切替可。
        </div>
      </div>
    )
  }

  if (currentMode === 'box') {
    return (
      <div className="legend">
        <h2>ダイス 凡例</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              border: '1px solid #3f3f46',
            }}
          />
          <span>サイコロ展開図から1枚欠けた十字（中央＋上右下左）</span>
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
          <span>各マスで四隅から1つ選択（2bit×4）</span>
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
          <span>上→右→下→左→上 の順で閉路に結ぶ</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          4^4 = 256通り。辺の配色: 単色 / 45°（斜め=ピンク）/ 位置(xy) /
          グラデ（閉路一周）。モノクロ切替対応。
        </div>
      </div>
    )
  }

  if (currentMode === 'pos16') {
    return (
      <div className="legend">
        <h2>16² pos 凡例</h2>
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
          <span>4×4 の 16 位置</span>
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
          <span>選択された開始・終了位置</span>
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
          <span>開始位置 → 終了位置の有向線</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          上位4bit=開始位置、下位4bit=終了位置。16×16=256通り。
        </div>
      </div>
    )
  }

  if (currentMode === 'amida') {
    return (
      <div className="legend">
        <h2>あみだ 凡例</h2>
        <div className="legend-item">
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 2,
              background: '#f472b6',
            }}
          />
          <span>経路が通らなかった横線</span>
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
          <span>選んだ開始位置から辿る経路</span>
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          横線4択³ × 開始位置4択 = 4³ × 4 = 256通り。
        </div>
        <div
          className="legend-item"
          style={{ marginTop: 8, color: 'var(--muted)' }}
        >
          横線にも経路にも触れない縦棒は、通常色／別色／非表示を選択できます。
        </div>
      </div>
    )
  }

  return (
    <div className="legend">
      <h2>ポリゴン 凡例</h2>
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
        <span>上位bit側の三角形</span>
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
        <span>下位bit側の三角形</span>
      </div>
      <div
        className="legend-item"
        style={{ marginTop: 8, color: 'var(--muted)' }}
      >
        4象限 × 2三角形 = 8bit = 256通り
      </div>
    </div>
  )
}
