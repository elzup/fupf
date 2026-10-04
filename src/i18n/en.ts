import type { Messages } from './ja'

export const en: Messages = {
  description:
    '4 elements × 2 bits = 8 bits = 256 pattern glyphs, drawn as Border, Tile, Polygon, Corner path, Dot + line, Aster, Dice, 16² pos and Amida.',
  languageLabel: 'Language',
  modeNav: 'Mode',
  modes: {
    edges: 'Border',
    symbols: 'Tile',
    triSplit: 'Polygon',
    path: 'Corner path',
    dotLine: 'Dot + line',
    aster: 'Aster',
    box: 'Dice',
    pos16: '16² pos',
    amida: 'Amida',
  },
  modeSamples: {
    edges: ['Default'],
    symbols: ['None / slashes', 'Dot size', 'Horizontal / vertical', 'O / X'],
    triSplit: ['Normal', 'Rhombus'],
    path: ['Default'],
    dotLine: ['Default'],
    aster: ['No fill, run', 'Solid, run', 'Solid, per segment'],
    box: ['Gradient', '45°'],
    pos16: ['Boundary', 'Neighborhood + line'],
    amida: ['Colored rails'],
  },

  notation: {
    label: 'Notation',
    styles: {
      default: 'Mode default',
      bin: 'Binary',
      hex: 'HEX',
      bar: '_ |',
      dot: '· ●',
    },
    monochrome: 'Monochrome',
    emphasizeSingleBit: 'Outline 1-bit',
  },

  grid: { prevPage: 'Previous page', nextPage: 'Next page' },
  code: { copy: 'Copy', copied: 'Copied' },

  preview: {
    heading: 'Selected pattern',
    decimal: 'Decimal',
    binary: 'Binary',
    hex: 'Hex',
    notation: 'Notation',
    labels: {
      edges: 'Sides',
      symbols: 'Cells',
      path: 'Corners visited',
      dotLine: 'Parts',
      aster: 'Directions',
      box: 'Corner per cell',
      triSplit: 'Quadrant fill',
      pos16: '4x4 position → position',
      amida: 'Rungs and route',
    },
    none: 'none',
    edgesDetail: (a, b, c, d) => `T${a} R${b} B${c} L${d}`,
    symbolsDetail: (a, b, c, d) => `TL${a} TR${b} BL${c} BR${d}`,
    dotLineDetail: (dots, from, to) => `dots: ${dots} / line: ${from}→${to}`,
    amidaDetail: (rungs, start, end) =>
      `rungs top:${rungs[0]} mid:${rungs[1]} bottom:${rungs[2]} / start:${start} → end:${end}`,
  },

  corners: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  arms: ['top', 'right', 'bottom', 'left'],
  asterDirections: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  rungLabels: ['none', '1–2', '2–3', '3–4'],

  options: {
    highlightDuplicates: 'Emphasize revisits (thicker lines)',
    symbolSet: 'Symbol set',
    symbolSets: ['none / \\ X', 'Dot size', '— | +', 'O / X'],
    polygonVariant: 'Split pattern',
    polygonVariants: {
      normal: 'Normal',
      rhombus: 'Rhombus',
      inverse: 'Inverse rhombus',
    },
    asterFillMode: 'Fill between adjacent directions',
    asterFillModes: { none: 'None', alpha: 'Translucent', solid: 'Solid' },
    asterFillColor: 'Fill color',
    asterFillColors: { segment: 'Per segment', run: 'Run start color' },
    asterCross: 'Show cross guides',
    boxEdgeColor: 'Edge color',
    boxEdgeColors: {
      single: 'Single',
      angle: '45°',
      xy: 'Position (xy)',
      grad: 'Gradient',
    },
    pos16ShowLine: 'Show connecting line',
    pos16ShowNeighborhood: 'Fill 3×3 neighborhood',
    pos16ShowBoundary: 'Show neighborhood boundary',
    amidaRailMode: 'Unused rails',
    amidaRailModes: { normal: 'Normal', colored: 'Colored', hidden: 'Hidden' },
  },

  legend: {
    edges: {
      title: 'Line style legend',
      none: '00 — none (hidden)',
      solid: '01 — solid',
      dashed: '10 — dashed',
      wave: '11 — wavy',
      note: 'Side values are shown separated by hyphens.',
    },
    symbols: { title: 'Tile legend' },
    path: {
      title: 'Path legend',
      first: '1st segment',
      second: '2nd segment (dashed)',
      third: '3rd segment (dotted)',
      straight: 'horizontal / vertical',
      diagonal: 'diagonal',
      same: 'same point (no line)',
      order: 'Numbered circles show the visiting order; arrows show direction.',
      highlight:
        'With "Emphasize revisits" on, corners and lines visited more than once get thicker.',
    },
    dotLine: {
      title: 'Dot + line legend',
      dots: 'Upper 4 bits toggle the corner dots',
      line: 'Lower 4 bits draw a 2-bit → 2-bit line',
      start: 'A double circle marks the start, so the direction is visible',
    },
    aster: {
      title: 'Aster legend',
      bit: (bit, direction) => `bit${bit} = ${direction}`,
      order: 'bit7 = N, then clockwise. 8 bits = 256 patterns',
      fill: '"Fill" paints a wedge between adjacent directions (colored per segment or by the run start). Spokes covered by a fill are hidden.',
      monochrome:
        'Use the shared "Monochrome" option to switch to black and white.',
    },
    box: {
      title: 'Dice legend',
      shape:
        'A cross: a die net with one face missing (center + top, right, bottom, left)',
      corner: 'Each cell picks one of its four corners (2 bits × 4)',
      loop: 'Connected in a loop: top → right → bottom → left → top',
      note: '4^4 = 256 patterns. Edge color: single / 45° (diagonal = pink) / position (xy) / gradient (around the loop). Monochrome supported.',
    },
    pos16: {
      title: '16² pos legend',
      positions: '16 positions on a 4×4 grid',
      selected: 'Selected start and end positions',
      line: 'Directed line from start to end',
      note: 'Upper 4 bits = start, lower 4 bits = end. 16 × 16 = 256 patterns.',
    },
    amida: {
      title: 'Amida legend',
      unused: 'Rungs the route does not take',
      route: 'Route traced from the chosen start',
      count: '4 rung choices³ × 4 starts = 4³ × 4 = 256 patterns.',
      rails:
        'Rails touched by neither a rung nor the route can be normal, colored or hidden.',
    },
    triSplit: {
      title: 'Polygon legend',
      high: 'Upper-bit triangle',
      low: 'Lower-bit triangle',
      note: '4 quadrants × 2 triangles = 8 bits = 256 patterns',
    },
  },
}
