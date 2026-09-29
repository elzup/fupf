export interface PatternState {
  a: number
  b: number
  c: number
  d: number
}

export function stateFromIndex(index: number): PatternState {
  return {
    a: (index >> 6) & 3,
    b: (index >> 4) & 3,
    c: (index >> 2) & 3,
    d: index & 3,
  }
}

export function fmt2bit(v: number): string {
  return v.toString(2).padStart(2, '0')
}
