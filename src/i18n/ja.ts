import type {
  AmidaRailMode,
  AsterFillColor,
  AsterFillMode,
  BoxEdgeColor,
  Mode,
  NotationStyle,
  PolygonVariant,
} from '../lib/types'

export const ja = {
  description:
    '4要素 × 2bit = 8bit = 256通りのパターン図形を、ボーダー、タイル、ポリゴン、4隅パス、丸点+線、Aster、ダイス、16² pos、あみだで表現します。',
  languageLabel: '言語',
  modeNav: 'モード選択',
  modes: {
    edges: 'ボーダー',
    symbols: 'タイル',
    triSplit: 'ポリゴン',
    path: '4隅パス',
    dotLine: '丸点+線',
    aster: 'Aster',
    box: 'ダイス',
    pos16: '16² pos',
    amida: 'あみだ',
  } as Record<Mode, string>,
  modeSamples: {
    edges: ['標準'],
    symbols: ['なし・斜線', '点の大きさ', '横線・縦線', 'マルバツ'],
    triSplit: ['通常', 'ひし形'],
    path: ['標準'],
    dotLine: ['標準'],
    aster: ['塗りなし・連続', '不透明・連続', '不透明・区間ごと'],
    box: ['グラデ', '45°'],
    pos16: ['境界表示', '9近傍＋接続線'],
    amida: ['別色'],
  } as Record<Mode, string[]>,

  notation: {
    label: '記法',
    styles: {
      default: 'モード既定',
      bin: '2進',
      hex: 'HEX',
      bar: '_ |',
      dot: '· ●',
    } as Record<NotationStyle, string>,
    monochrome: 'モノクロ',
    emphasizeSingleBit: '1bit 枠強調',
  },

  grid: { prevPage: '前ページ', nextPage: '次ページ' },
  code: { copy: 'コピー', copied: 'コピーしました' },

  preview: {
    heading: '選択中のパターン',
    decimal: '10進数',
    binary: '2進数',
    hex: '16進数',
    notation: '記法',
    labels: {
      edges: '辺の状態',
      symbols: 'セル配置',
      path: '通過座標',
      dotLine: '構成',
      aster: '放射方向',
      box: '各マスの選択隅',
      triSplit: '象限の塗り状態',
      pos16: '4x4 位置→位置',
      amida: '横線と経路',
    } as Record<Mode, string>,
    none: 'なし',
    edgesDetail: (a: number, b: number, c: number, d: number) =>
      `上${a} 右${b} 下${c} 左${d}`,
    symbolsDetail: (a: number, b: number, c: number, d: number) =>
      `左上${a} 右上${b} 左下${c} 右下${d}`,
    dotLineDetail: (dots: string, from: string, to: string) =>
      `点:${dots} / 線:${from}→${to}`,
    amidaDetail: (
      rungs: [string, string, string],
      start: number,
      end: number
    ) =>
      `横線 上:${rungs[0]} 中:${rungs[1]} 下:${rungs[2]} / 開始:${start} → 終了:${end}`,
  },

  // 0=左上, 1=右上, 2=左下, 3=右下 (2bit のコーナー符号順)
  corners: ['左上', '右上', '左下', '右下'],
  arms: ['上', '右', '下', '左'],
  // bit7 から時計回り
  asterDirections: ['上', '右上', '右', '右下', '下', '左下', '左', '左上'],
  rungLabels: ['なし', '1–2', '2–3', '3–4'],

  options: {
    highlightDuplicates: '同じ位置を強調（線を太く）',
    symbolSet: '記号セット',
    symbolSets: ['なし / \\ X', '点の大きさ', '— | +', 'マルバツ'],
    polygonVariant: '分割パターン',
    polygonVariants: {
      normal: '通常',
      rhombus: 'ひし形',
      inverse: '逆ひし形',
    } as Record<PolygonVariant, string>,
    asterFillMode: '連続する方向の塗りつぶし',
    asterFillModes: {
      none: 'なし',
      alpha: '半透明',
      solid: '不透明',
    } as Record<AsterFillMode, string>,
    asterFillColor: '塗りの配色',
    asterFillColors: {
      segment: '区間ごと',
      run: '連続の始点色',
    } as Record<AsterFillColor, string>,
    asterCross: '十字の罫線を表示',
    boxEdgeColor: '辺の配色',
    boxEdgeColors: {
      single: '単色',
      angle: '45°',
      xy: '位置(xy)',
      grad: 'グラデ',
    } as Record<BoxEdgeColor, string>,
    pos16ShowLine: '接続線を表示',
    pos16ShowNeighborhood: '9近傍を塗る',
    pos16ShowBoundary: '塗り領域の境界線を表示',
    amidaRailMode: '独立した縦棒',
    amidaRailModes: {
      normal: '通常色',
      colored: '別色',
      hidden: '非表示',
    } as Record<AmidaRailMode, string>,
  },

  legend: {
    edges: {
      title: '線スタイル凡例',
      none: '00 — 無し（非表示）',
      solid: '01 — 実線',
      dashed: '10 — 破線',
      wave: '11 — 波線',
      note: '各辺の値はハイフン区切りで表示されます。',
    },
    symbols: { title: 'タイル凡例' },
    path: {
      title: 'パス凡例',
      first: '1本目の線分',
      second: '2本目の線分（破線）',
      third: '3本目の線分（点線）',
      straight: '水平／垂直',
      diagonal: '斜め',
      same: '同一点（線なし）',
      order: '番号付き丸が通過順。矢印が進行方向です。',
      highlight:
        '「同じ位置を強調」ON で、繰り返し通過した角や線が太くなります。',
    },
    dotLine: {
      title: '丸点+線 凡例',
      dots: '上位4bitで四隅の丸点ON/OFF',
      line: '下位4bitで2bit→2bitの線',
      start: '始点には二重円がつき、方向が分かります',
    },
    aster: {
      title: 'Aster 凡例',
      bit: (bit: number, direction: string) => `bit${bit}＝${direction}`,
      order: 'bit7=上から時計回り。8bit = 256通り',
      fill: '「塗りつぶし」で連続する方向の間を扇形で塗ります（配色は区間ごと／連続の始点色）。塗りに覆われる棒は非表示。',
      monochrome: '色は共通オプションの「モノクロ」で白黒に切替可。',
    },
    box: {
      title: 'ダイス 凡例',
      shape: 'サイコロ展開図から1枚欠けた十字（中央＋上右下左）',
      corner: '各マスで四隅から1つ選択（2bit×4）',
      loop: '上→右→下→左→上 の順で閉路に結ぶ',
      note: '4^4 = 256通り。辺の配色: 単色 / 45°（斜め=ピンク）/ 位置(xy) / グラデ（閉路一周）。モノクロ切替対応。',
    },
    pos16: {
      title: '16² pos 凡例',
      positions: '4×4 の 16 位置',
      selected: '選択された開始・終了位置',
      line: '開始位置 → 終了位置の有向線',
      note: '上位4bit=開始位置、下位4bit=終了位置。16×16=256通り。',
    },
    amida: {
      title: 'あみだ 凡例',
      unused: '経路が通らなかった横線',
      route: '選んだ開始位置から辿る経路',
      count: '横線4択³ × 開始位置4択 = 4³ × 4 = 256通り。',
      rails:
        '横線にも経路にも触れない縦棒は、通常色／別色／非表示を選択できます。',
    },
    triSplit: {
      title: 'ポリゴン 凡例',
      high: '上位bit側の三角形',
      low: '下位bit側の三角形',
      note: '4象限 × 2三角形 = 8bit = 256通り',
    },
  },
}

export type Messages = typeof ja
