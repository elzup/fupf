import { describe, expect, it } from 'vitest'
import { DEFAULT_STATE } from './constants'
import { queryToState, stateToQuery } from './queryState'

describe('stateToQuery', () => {
  it('writes nothing for the default state', () => {
    expect(stateToQuery(DEFAULT_STATE)).toBe('')
  })

  it('writes only values that differ from the defaults', () => {
    const query = stateToQuery({
      ...DEFAULT_STATE,
      currentMode: 'aster',
      selectedIndex: 0xa5,
      colorScheme: 'ocean',
      samplingPageBits: [7, 3],
    })
    expect(query).toBe('mode=aster&i=a5&color=ocean&bits=7%2C3')
  })
})

describe('queryToState', () => {
  it('round-trips through stateToQuery', () => {
    const state = {
      ...DEFAULT_STATE,
      currentMode: 'pos16' as const,
      selectedIndex: 0x0f,
      lang: 'en' as const,
      pos16ShowLine: true,
      pos16ShowBoundary: false,
      boxEdgeColor: 'grad' as const,
      samplingPageBits: [7, 3],
      samplingPage: 2,
    }
    expect({ ...DEFAULT_STATE, ...queryToState(stateToQuery(state)) }).toEqual(
      state
    )
  })

  it('reads the legacy mono=1 as the mono color scheme', () => {
    expect(queryToState('mono=1')).toEqual({ colorScheme: 'mono' })
    expect(queryToState('mono=1&color=sunset')).toEqual({
      colorScheme: 'sunset',
    })
  })

  it('keeps the nested style in the query', () => {
    expect(queryToState('mode=nested&style=border')).toEqual({
      currentMode: 'nested',
      nestedStyle: 'border',
    })
    expect(queryToState('style=dashed')).toEqual({})
  })

  it('ignores unknown keys and invalid values', () => {
    expect(
      queryToState(
        'mode=nope&i=zz&mono=yes&color=neon&rail=hidden&lang=fr&foo=1'
      )
    ).toEqual({ amidaRailMode: 'hidden' })
  })
})
