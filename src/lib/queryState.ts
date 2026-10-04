import { DEFAULT_STATE, POS16_OPTIONS_VERSION } from './constants'
import { loadState } from './state'
import type { AppState } from './types'

type Codec = {
  encode: (value: never) => string
  decode: (raw: string) => unknown
}

const text: Codec = {
  encode: (value: string) => value,
  decode: (raw) => raw,
}
const bool: Codec = {
  encode: (value: boolean) => (value ? '1' : '0'),
  decode: (raw) => (raw === '1' ? true : raw === '0' ? false : undefined),
}
const int: Codec = {
  encode: (value: number) => String(value),
  decode: (raw) => (/^\d+$/.test(raw) ? Number(raw) : undefined),
}
// パターン番号は UI やコードサンプルと同じ 16 進 2 桁で書く (?i=a5)
const hexIndex: Codec = {
  encode: (value: number) => value.toString(16).padStart(2, '0'),
  decode: (raw) =>
    /^[0-9a-f]{1,2}$/i.test(raw) ? Number.parseInt(raw, 16) : undefined,
}
const bitList: Codec = {
  encode: (value: number[]) => value.join(','),
  decode: (raw) => (raw === '' ? [] : raw.split(',').map(Number)),
}

// URL に載せる設定と query のキー名。表示中の状態 (ページ送り以外の一時状態) は載せない
const PARAMS: Partial<Record<keyof AppState, [string, Codec]>> = {
  currentMode: ['mode', text],
  selectedIndex: ['i', hexIndex],
  lang: ['lang', text],
  notationStyle: ['notation', text],
  monochrome: ['mono', bool],
  emphasizeSingleBit: ['bit1', bool],
  currentSymbolSet: ['symbols', int],
  highlightDuplicates: ['highlight', bool],
  polygonVariant: ['polygon', text],
  asterFillMode: ['fill', text],
  asterFillColor: ['fillColor', text],
  asterCross: ['cross', bool],
  boxEdgeColor: ['edgeColor', text],
  amidaRailMode: ['rail', text],
  pos16ShowLine: ['line', bool],
  pos16ShowNeighborhood: ['neighborhood', bool],
  pos16ShowBoundary: ['boundary', bool],
  samplingPageBits: ['bits', bitList],
  samplingPage: ['page', int],
}

const PARAM_ENTRIES = Object.entries(PARAMS) as Array<
  [keyof AppState, [string, Codec]]
>

function isSameValue(a: unknown, b: unknown): boolean {
  return Array.isArray(a) && Array.isArray(b)
    ? a.length === b.length && a.every((v, i) => v === b[i])
    : a === b
}

// 既定値と同じ設定は書かない (共有 URL を短く保つ)
export function stateToQuery(state: AppState): string {
  const params = new URLSearchParams()
  for (const [key, [name, codec]] of PARAM_ENTRIES) {
    if (isSameValue(state[key], DEFAULT_STATE[key])) continue
    params.set(name, codec.encode(state[key] as never))
  }
  return params.toString()
}

export function queryToState(search: string): Partial<AppState> {
  const params = new URLSearchParams(search)
  const raw: Record<string, unknown> = {}
  for (const [key, [name, codec]] of PARAM_ENTRIES) {
    const value = params.get(name)
    if (value === null) continue
    const decoded = codec.decode(value)
    if (decoded !== undefined) raw[key] = decoded
  }
  // loadState は pos16 の表示オプションを版番号付きでのみ受け付ける
  if (['line', 'neighborhood', 'boundary'].some((name) => params.has(name))) {
    raw.pos16OptionsVersion = POS16_OPTIONS_VERSION
  }
  return loadState(raw)
}
