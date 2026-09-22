export interface FupfChar {
  char: string
  bytes: number[]
  isWhitespace: boolean
}

const WHITESPACE = /^\s$/u
const encoder = new TextEncoder()

// Whitespace stays as real text so the browser handles wrapping and newlines like a font would.
export function splitFupfChars(text: string): FupfChar[] {
  return Array.from(text, (char) => ({
    char,
    bytes: [...encoder.encode(char)],
    isWhitespace: WHITESPACE.test(char),
  }))
}
