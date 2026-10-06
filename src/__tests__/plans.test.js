import { describe, it, expect } from 'vitest'
import { etatAbonnement, hasFeature, planById, dateLongue, PALIER_BASE } from '../data/plans'
import { CURRENT_USER } from '../data/user'

describe('l’abonnement', () => {
  const now = new Date('2026-10-06T09:00:00')

  it('est actif avant l’échéance et prévient trois mois avant', () => {
    const e = etatAbonnement({ statut: 'actif', echeance: '2026-12-02' }, now)
    expect(e.statut).toBe('actif')
    expect(e.jours).toBe(57)
    expect(e.bientot).toBe(true)
  })

  it('passe en lecture seule une fois l’échéance passée, ou si forcé', () => {
    expect(etatAbonnement({ statut: 'actif', echeance: '2026-10-01' }, now).statut).toBe('expire')
    expect(etatAbonnement({ statut: 'expire', echeance: '2030-01-01' }, now).statut).toBe('expire')
    expect(etatAbonnement(null, now).statut).toBe('expire')
  })

  it('ouvre un an d’abonnement à la première installation', () => {
    expect(etatAbonnement(CURRENT_USER.abonnement).statut).toBe('actif')
    expect(etatAbonnement(CURRENT_USER.abonnement).jours).toBeGreaterThan(360)
  })

  it('retombe sur le palier de base pour un identifiant inconnu', () => {
    expect(planById('inconnu').id).toBe(PALIER_BASE)
    expect(hasFeature('membre', 'n’existe-pas')).toBe(false)
  })

  it('écrit les dates en toutes lettres', () => {
    expect(dateLongue('2026-12-02')).toBe('2 décembre 2026')
  })
})
