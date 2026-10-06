import { describe, it, expect } from 'vitest'
import {
  siteUrl, daysToRace, vagueCourante, avancementEdition, numeroDossard, distanceById, EDITION,
} from '../data/race'

describe('l’édition', () => {
  it('construit les liens du site avec leurs paramètres', () => {
    expect(siteUrl('/inscription/', { distance: '10', vide: '' })).toBe('https://runoninvest.fr/inscription/?distance=10')
  })

  it('compte les jours avant la course, jamais en négatif', () => {
    expect(daysToRace(new Date(`${EDITION.date}T12:00:00`))).toBe(0)
    expect(daysToRace(new Date('2027-11-26T08:00:00'))).toBe(1)
    expect(daysToRace(new Date('2030-01-01T08:00:00'))).toBe(0)
  })

  it('choisit la vague tarifaire selon la date', () => {
    expect(vagueCourante(Date.parse('2027-01-15')).code).toBe('early')
    expect(vagueCourante(Date.parse('2027-04-01')).code).toBe('regulier')
    expect(vagueCourante(Date.parse('2027-09-01')).code).toBe('last')
  })

  it('imprime le dossard sur quatre chiffres', () => {
    expect(numeroDossard(42)).toBe('0042')
    expect(distanceById('inconnue').id).toBe('10')
  })

  it('ouvre les jalons à leur heure : le sas à J−90, les rendez-vous à J−42', () => {
    const loin = avancementEdition({ dossard: { numero: 1, distance: '10' }, now: new Date('2027-01-01T10:00:00') })
    const sas = loin.etapes.find((e) => e.id === 'sas')
    expect(sas.statut).toBe('avenir')
    expect(sas.ouvreDans).toBe(loin.jours - 90)
    expect(loin.etapes.find((e) => e.id === 'dossard').statut).toBe('fait')

    const proche = avancementEdition({ dossard: { numero: 1, distance: '10', sas: 'D2' }, rdv: 2, now: new Date('2027-11-01T10:00:00') })
    expect(proche.etapes.find((e) => e.id === 'sas').statut).toBe('fait')
    expect(proche.etapes.find((e) => e.id === 'rdv').statut).toBe('fait')
    expect(proche.faits).toBe(4)
  })
})
