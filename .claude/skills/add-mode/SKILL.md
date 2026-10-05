---
name: add-mode
description: 'fupf に glyph mode (edges / pos16 / amida 等) を追加する手順と登録漏れチェック。トリガー: 「mode 追加」「新しいモード」「add mode」「モードの登録漏れ」。check.ts で全登録箇所を照合する。'
---

# fupf: glyph mode の追加

mode は `src/glyph/` (npm パッケージ `fupf-glyph`、framework-free) と、それを import するデモアプリ (`src/lib` / `src/components` / `src/i18n`) の両方に登録が要る。登録箇所は 20 前後に散っており、型で守られていない箇所 (README、i18n の description、`isValidMode` の文字列リスト、テストの MODES) が漏れやすい。

**最後に必ず `node .claude/skills/add-mode/check.ts <mode>` を通す。** MISS が 0 になるまで完了扱いにしない。

## 0. 決めること (実装前にユーザーと合意)

- mode id (camelCase、`renderGlyph` の `mode` 値で公開 API になる。後から変えると破壊的変更)
- 表示名 ja / en (例: `あみだ` / `Amida`)
- 256 パターンへのビット割り当て (README の `4^4 box type` のような型表記を含む)
- 表示オプションの有無と値の列挙

## 1. glyph 層 (npm パッケージ側)

| ファイル                         | やること                                                                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/glyph/modes/<mode>.ts`      | `render<Mode>(index, options): GlyphResult` と `<Mode>Options extends BaseGlyphOptions`。拡張子付き import (`'../types.js'`)。色は `resolvePalette` / `fillAttr` / `strokeAttr` 経由で、生の色を書かない (`color` / `palette` / テーマに追従させるため) |
| `src/glyph/modes/<mode>.test.ts` | 代表パターンの描画、notation、境界値 (0x00 / 0xff)                                                                                                                                                                                                      |
| `src/glyph/types.ts`             | オプションの union 型 (`AmidaRailMode` 等) があればここに                                                                                                                                                                                               |
| `src/glyph/index.ts`             | `GlyphOptionsMap` に追加 → `renderGlyph` の switch、`render<Mode>` と `<Mode>Options` の export。補助関数 (`traceAmida` 等) を app から使うならそれも export                                                                                            |
| `src/glyph/index.test.ts`        | `MODES` 配列に追加 (`it.each` で全 mode 共通テストと currentColor テストが走る)                                                                                                                                                                         |
| `src/glyph/palette.ts`           | mode 固有の既定色が要るときだけ `MODE_PALETTES` に追加                                                                                                                                                                                                  |

**配色 (basic / mono / ocean / sunset) で見た目が変わること。** 色は palette の枠 (fg / muted / accents …) からだけ取る。テーマと同じ色を mode 既定にすると区別がつかなくなる。`index.test.ts` の「changes the look of %s with each theme」が全 mode を検査する。

## 2. アプリ層

| ファイル                    | やること                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/lib/constants.ts`      | `MODES` (モードカードの並び順)。オプションがあれば `DEFAULT_STATE` と値リスト定数 (`AMIDA_RAIL_MODES` 等)              |
| `src/lib/state.ts`          | `isValidMode` の文字列リスト (`MODES` を使っていない)。オプションがあれば `loadState` に検証付きで読み込み             |
| `src/lib/renderPattern.ts`  | `modeOptions` の case。オプションがあれば `PatternRenderOptions` の Pick に追加                                        |
| `src/lib/glyphDetails.ts`   | `glyphDetail` の case (プレビューの 1 行説明)                                                                          |
| `src/lib/modeSamples.ts`    | `MODE_SAMPLE_INDICES` と `MODE_SAMPLE_PRESETS` (モードカードのサンプル。プリセット数 = i18n の `modeSamples` の要素数) |
| `src/components/Legend.tsx` | 凡例ブロック (`l.<mode>.title` を使う)                                                                                 |

### 表示オプションがある場合

AppState のキーは **mode 名 prefix** にする (`amidaRailMode`, `pos16ShowLine`)。check.ts はこの prefix でオプションの配線漏れを見る。

- `src/lib/types.ts` `AppState` (union 型は `fupf-glyph` から re-export)
- `src/lib/constants.ts` `DEFAULT_STATE`
- `src/lib/state.ts` `loadState` (不正値を弾く `isValid...` を用意)
- `src/lib/queryState.ts` `PARAMS` (URL query のキー名は短く、既存と衝突させない)
- `src/lib/renderPattern.ts` Pick と case
- `src/components/OptionsPanel.tsx` (props + `currentMode === '<mode>'` で visible) → `Sidebar.tsx` で配線 (`App.tsx` / `Grid.tsx` / `GridCell.tsx` / `Preview.tsx` に props が通っているかも確認)

## 3. i18n (ja が型の正本、en は `Messages` に従う)

`src/i18n/ja.ts` と `src/i18n/en.ts` の両方:

- `description` の mode 列挙に表示名を足す (型では検出できない)
- `modes` / `modeSamples` / `preview.labels` / `legend.<mode>`
- `preview.<mode>Detail` (glyphDetails で関数を使う場合)、`options.<option>` / `options.<option>s`

## 4. ドキュメント

- `README.md` / `README.ja.md` の Modes 節に `**<表示名>** (...)`: 型表記とビットの意味
- 「全モードで約 N kB」の記述が変わるならバンドルサイズを測り直す (`pkg-bundle-size` skill)
- `docs/fupf-modes.png` (モードカードのスクショ) を撮り直す。ブラウザ操作になるので撮る前にユーザーに確認する。`shot-modes.mjs` が headless Chrome でカード〜テキストデモを 2x で切り出す (使い方は冒頭コメント)。幅 1100 で 5 列なので、mode 数が 5 の倍数でなくなったら幅を見直す

## 5. テスト (既存の mode に倣って追加)

`Legend.test.tsx` / `Preview.test.tsx` / `modeSamples.test.ts` / `glyphDetails.test.ts` / `state.test.ts` (`isValidMode`)。オプションがあれば `queryState.test.ts` と `App.test.tsx` にも。

`App.test.tsx` の「renders header and grid」はモードカードのサンプル総数 (`.mode-sample` の件数 = 全 mode のプリセット数の合計) をハードコードしている。プリセット数ぶん増やす。

## 6. 検証

```bash
node .claude/skills/add-mode/check.ts <mode>   # MISS 0
nr lint && nr fmt:check && nr typecheck && nr test:run   # pre-commit hook と同じ
nr build:lib   # npm パッケージとしてビルドできるか
```

`nr dev` (http://fupf.localhost:1355) でモードカード・凡例・オプション・URL query (`?mode=<mode>`) の往復を目視する。

新しい mode は公開 API への追加なので、リリースするなら `package.json` は minor bump。

## check.ts の限界

文字列照合なので「書いてある」ことしか見ない。描画の正しさ、プリセット数と `modeSamples` ラベル数の一致、Props の中継漏れはテストと目視で確かめる。登録箇所が増えたら (新しい switch や Record<Mode, ...> を足したら) check.ts にも 1 行足す。
