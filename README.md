[![ooparts](https://raw.githubusercontent.com/elzup/ooparts-spec/main/badge.svg)](https://github.com/elzup/ooparts-spec)

# fupf glyph

English | [日本語](README.ja.md)

A preview that visualizes all `4↑4 = 4^4 = 256` pattern glyphs.

![fupf glyph in 16² pos mode](docs/fupf-ss.png)

The Clock demo on the site samples the current HH, MM, and SS at roughly even intervals from the 256 patterns and displays them.

## Files

- `src/` — React + TypeScript source
  - `lib/renderers/` — SVG generation logic for each mode
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

## Development

```bash
ni        # install dependencies
nr dev    # start dev server
nr test   # run tests
nr build  # production build (outputs to dist/)
```

## Deployment

Published on GitHub Pages: https://elzup.github.io/fupf/
