import { describe, it, expect, vi, afterEach } from 'vitest'
import { lierDossier, dossierDepuisUrl, normaliseReference } from '../lib/dossier'

const reponse = (status, body, type = 'application/json') => ({
  status,
  ok: status >= 200 && status < 300,
  headers: { get: () => type },
  json: async () => body,
})

describe('le pont avec le site', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('lit le lien profond venu de l’espace', () => {
    expect(dossierDepuisUrl('?dossier=E01-000123&email=a%40b.fr')).toEqual({ reference: 'E01-000123', email: 'a@b.fr' })
    expect(dossierDepuisUrl('?autre=1')).toBeNull()
  })

  it('normalise la référence', () => {
    expect(normaliseReference(' e01- 000123 ')).toBe('E01-000123')
  })

  it('refuse une référence ou un e-mail mal formés sans appeler le site', async () => {
    const f = vi.fn()
    vi.stubGlobal('fetch', f)
    expect((await lierDossier({ reference: 'XYZ', email: 'a@b.fr' })).erreur).toMatch(/E01-000123/)
    expect((await lierDossier({ reference: 'E01-000123', email: 'pas-un-mail' })).erreur).toBeTruthy()
    expect(f).not.toHaveBeenCalled()
  })

  it('renvoie le dossier lu sur le site, e-mail en minuscules', async () => {
    const f = vi.fn(async () => reponse(200, { dossier: { reference: 'E01-000123', distance: '21' } }))
    vi.stubGlobal('fetch', f)
    const r = await lierDossier({ reference: 'e01-000123', email: 'A@B.FR' })
    expect(f.mock.calls[0][0]).toBe('https://runoninvest.fr/api/dossier?reference=E01-000123&email=a%40b.fr')
    expect(r.dossier).toMatchObject({ reference: 'E01-000123', distance: '21', email: 'a@b.fr', local: false })
  })

  it('dit « aucun dossier » sur un 404, « trop d’essais » sur un 429', async () => {
    vi.stubGlobal('fetch', async () => reponse(404, { erreur: 'x' }))
    expect((await lierDossier({ reference: 'E01-000123', email: 'a@b.fr' })).erreur).toMatch(/Aucun dossier/)
    vi.stubGlobal('fetch', async () => reponse(429, { erreur: 'x' }))
    expect((await lierDossier({ reference: 'E01-000123', email: 'a@b.fr' })).erreur).toMatch(/Trop d’essais/)
  })

  it('bascule en mode local quand le site ne répond pas', async () => {
    vi.stubGlobal('fetch', async () => { throw new Error('hors ligne') })
    const r = await lierDossier({ reference: 'E01-000123', email: 'a@b.fr' })
    expect(r.dossier).toMatchObject({ reference: 'E01-000123', local: true })
  })
})
