[![ooparts](https://raw.githubusercontent.com/elzup/ooparts-spec/main/badge.svg)](https://github.com/elzup/ooparts-spec)

# fupf glyph

English | [日本語](README.ja.md)

A preview that visualizes all `4↑4 = 4^4 = 256` pattern glyphs.

![fupf glyph in 16² pos mode](docs/fupf-ss.png)

The Clock demo on the site samples the current HH, MM, and SS at roughly even intervals from the 256 patterns and displays them.

## Files

- `src/` — React + TypeScript source
  - `glyph/` — framework-free SVG generation (`renderGlyph`), one file per mode under `glyph/modes/`
  - `lib/` — app state and the mapping from UI state to glyph options
  - `components/` — React components
- `index.html` — Vite entry point

## Modes

Labels in parentheses are the names shown in the UI.

- **Border** (ボーダー): line style per side, 4 sides × 2 bits
- **Tile** (タイル): `4^4 map type`
- **Polygon** (ポリゴン): `4^4 map type`
- **Corner path** (4隅パス): `4^4 graph type`
- **Dot + line** (丸点+線): `2^4 * 4^2 type`
- **Aster**: `2^8 type`
- **Dice** (ダイス): `4^4 box type` — a cross shape (a die net with one face missing). For each of the top/right/bottom/left cells, pick one of its four corners and connect them into a closed loop. Edge coloring can be solid / 45° / position / gradient.
- **16² pos**: `16^2 pos type` — pick a start and an end from the 16 positions of a 4×4 grid and draw a directed line. Upper 4 bits = start, lower 4 bits = end.
- **Amida** (あみだ): `4^3 * 4 amida type` — four vertical bars; in each of the top/middle/bottom rows choose "no rung / 1–2 / 2–3 / 3–4", then trace the path from one of four start positions. Rungs not taken are highlighted, and bars touched by neither a rung nor the path can be drawn normally, in another color, or hidden.

## Library

The SVG renderer is published on npm as `fupf-glyph` (zero dependencies, ESM + CJS, typed).

```bash
npm install fupf-glyph
```

```ts
import { renderGlyph } from 'fupf-glyph'

const { svg, notation } = renderGlyph(0xa5, { mode: 'pos16', size: 64 })
```

Each mode is also exported on its own (`renderPos16`, `renderAmida`, ...). Options depend on `mode` and are type-checked. Importing a single mode bundles to about 0.5–1.4 kB gzip; all modes are about 6 kB.

## Development

```bash
ni        # install dependencies
nr dev    # start dev server
nr test   # run tests
nr build  # production build (outputs to dist/)
nr fmt    # format with oxfmt
nr lint   # lint with oxlint
```

`ni` also enables the git pre-commit hook in `.githooks/` (lint, format check, type check, tests).

## Deployment

Published on GitHub Pages: https://elzup.github.io/fupf/
