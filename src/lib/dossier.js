/* ==========================================================================
   Le pont vers le site : lier son dossier R.O.I à l'app.
   Le site (runoninvest.fr) porte l'inscription : compte, distance, formule,
   vague, état du dossier. L'app le LIT, via GET /api/dossier?reference&email
   (lecture publique, CORS ouvert, jamais d'écriture). Si le site ne répond
   pas (aperçu hors ligne, démo), on bascule en mode local : la référence est
   acceptée telle quelle et le dossier est reconstruit à partir du profil.
   ========================================================================== */
import { SITE_URL, vagueCourante } from '../data/race'
import { CURRENT_USER } from '../data/user'

export const REF_RE = /^E01-[A-Z0-9]{5,8}$/i

export function normaliseReference(ref) {
  return String(ref || '').trim().toUpperCase().replace(/\s+/g, '')
}

function dossierLocal(reference, email) {
  const [prenom, ...reste] = CURRENT_USER.name.split(' ')
  const [fonction, entreprise] = [CURRENT_USER.role, CURRENT_USER.company]
  return {
    reference,
    email,
    prenom,
    nom: reste.join(' '),
    fonction,
    entreprise,
    profil: 'entrepreneur',
    distance: '10',
    formule: 'dossard',
    vague: vagueCourante(),
    etat: 'demande',
    edition: '01',
    local: true,
  }
}

/* Résout un dossier. Renvoie { dossier } ou { erreur }. */
export async function lierDossier({ reference, email }) {
  const ref = normaliseReference(reference)
  const mail = String(email || '').trim().toLowerCase()
  if (!REF_RE.test(ref)) return { erreur: 'La référence ressemble à E01-000123 — elle est en haut de ton espace.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return { erreur: 'L’e-mail de ton compte R.O.I.' }

  const url = `${SITE_URL}/api/dossier?reference=${encodeURIComponent(ref)}&email=${encodeURIComponent(mail)}`
  try {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = ctrl && setTimeout(() => ctrl.abort(), 6000)
    const r = await fetch(url, { signal: ctrl?.signal, headers: { Accept: 'application/json' } })
    if (timer) clearTimeout(timer)
    const ct = r.headers.get('content-type') || ''
    if (!ct.includes('application/json')) throw new Error('statique')
    const j = await r.json()
    if (r.status === 404) return { erreur: 'Aucun dossier avec cette référence et cet e-mail.' }
    if (r.status === 429) return { erreur: 'Trop d’essais. Reprends dans une minute.' }
    if (!r.ok || !j.dossier) return { erreur: j.erreur || 'Le site ne répond pas. Réessaie dans un instant.' }
    return { dossier: { ...j.dossier, email: mail, local: false, lie: new Date().toISOString() } }
  } catch {
    // Pas de site joignable : mode local, comme le site le fait sans serveur.
    return { dossier: { ...dossierLocal(ref, mail), lie: new Date().toISOString() } }
  }
}

/* Le dossier tel qu'il arrive par lien profond depuis l'espace du site :
   /?dossier=E01-000123&email=x@y.z */
export function dossierDepuisUrl(search = window.location.search) {
  try {
    const q = new URLSearchParams(search)
    const reference = q.get('dossier')
    const email = q.get('email')
    if (!reference) return null
    return { reference, email: email || '' }
  } catch {
    return null
  }
}
