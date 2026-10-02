import type { NotationStyle } from './types'

export function styleNotation(
  index: number,
  modeNote: string,
  notationStyle: NotationStyle
): string {
  const bits = index.toString(2).padStart(8, '0')
  if (notationStyle === 'bin') return bits.match(/.{2}/g)?.join('-') ?? bits
  if (notationStyle === 'hex')
    return index.toString(16).toUpperCase().padStart(2, '0')
  if (notationStyle === 'bar') return bits.replace(/0/g, '_').replace(/1/g, '|')
  if (notationStyle === 'dot') return bits.replace(/0/g, '·').replace(/1/g, '●')
  return modeNote
}

export function notationIsGlyph(notationStyle: NotationStyle): boolean {
  return notationStyle === 'bar' || notationStyle === 'dot'
}
