import { describe, it, expect } from 'vitest'
import { shiftStage, PIPELINE_STAGES, pipelineStats } from '../data/pipeline'
import { recordSignal, rankMatches, EMPTY_SIGNALS } from '../lib/matching'
import { PROFILES } from '../data/profiling'

describe('le suivi des relations', () => {
  it('avance et recule d’une étape, sans sortir des bornes', () => {
    const premier = PIPELINE_STAGES[0].id
    const dernier = PIPELINE_STAGES.at(-1).id
    expect(shiftStage(premier, -1)).toBe(premier)
    expect(shiftStage(dernier, 1)).toBe(dernier)
    expect(shiftStage(premier, 1)).toBe(PIPELINE_STAGES[1].id)
  })

  it('compte ce qui est conclu', () => {
    const s = pipelineStats([{ stage: 'won', value: 10 }, { stage: 'talking', value: 5 }])
    expect(s).toMatchObject({ total: 2, won: 1, wonValue: 10, active: 1, value: 15 })
  })
})

describe('« Pour toi »', () => {
  it('classe toutes les personnes, et réagit aux signaux', () => {
    const noms = Object.keys(PROFILES)
    const neutre = rankMatches(noms, EMPTY_SIGNALS, {})
    expect(neutre).toHaveLength(noms.length)
    let s = EMPTY_SIGNALS
    for (let i = 0; i < 5; i++) s = recordSignal(s, { type: 'contact', name: noms[0] })
    expect(s).not.toBe(EMPTY_SIGNALS)
    expect(EMPTY_SIGNALS.contacts).toEqual({})
  })
})
