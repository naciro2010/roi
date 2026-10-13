import { SITE_URL, CONTACTS } from '../data/race'

/* Suppression du compte et signalements — les deux exigés par les stores.
   Le site (runoninvest.fr) porte les données : l'app lui envoie la demande,
   puis efface tout ce qu'elle garde sur l'appareil.

   Contrat attendu côté site (voir STORES.md) :
     POST /api/compte/suppression  { reference, email }  → 200 { ok: true }
     POST /api/signalement         { name, motif, detail, date, dossier? } → 200 { ok: true } */

async function poster(chemin, corps) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = ctrl && setTimeout(() => ctrl.abort(), 8000)
  try {
    const r = await fetch(`${SITE_URL}${chemin}`, {
      method: 'POST',
      signal: ctrl?.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corps),
    })
    const j = await r.json().catch(() => ({}))
    return { ok: r.ok && j.ok !== false, status: r.status, erreur: j.erreur }
  } catch {
    return { ok: false, status: 0 }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

/* Sans dossier relié, l'app n'a que des données locales : on les efface. Avec
   un dossier, on demande d'abord la suppression au site — et on n'efface
   l'appareil que si elle est acceptée, pour ne jamais laisser croire qu'un
   compte est supprimé alors qu'il ne l'est pas. */
export async function supprimerCompte(dossier) {
  if (!dossier || dossier.local) return { ok: true }
  const r = await poster('/api/compte/suppression', { reference: dossier.reference, email: dossier.email })
  if (r.ok) return { ok: true }
  return {
    ok: false,
    erreur: `La suppression n’a pas pu être confirmée. Réessaie, ou écris à ${CONTACTS.contact} en indiquant ${dossier.reference}.`,
  }
}

export function envoyerSignalement(s) {
  return poster('/api/signalement', {
    name: s.name, motif: s.motif, detail: s.detail, date: s.date, reference: s.dossier?.reference,
  })
}
