/* ==========================================================================
   L'ABONNEMENT — ce qui garde l'accès ouvert.

   Deux conditions pour être ici, et elles ne se remplacent pas :
   1. avoir couru au moins un R.O.I (voir `editions` dans data/user.js) ;
   2. un abonnement à jour.

   L'abonnement a remplacé les anciennes « formules » de course : ce n'est
   plus un supplément qu'on achète avec son dossard, c'est l'adhésion au
   réseau, à l'année. Le dossard, lui, se prend sur le site, par édition.

   Trois paliers : Membre · Premium · Cercle. Aucun n'achète une meilleure
   course — ils changent combien de portes s'ouvrent entre deux éditions.
   Démo : aucun paiement dans l'app, le règlement se fait sur le site.
   ========================================================================== */

export const PLANS = [
  {
    id: 'membre',
    n: '01',
    name: 'Membre',
    tagline: 'Le réseau entre deux éditions',
    pour: 'Le réseau entre deux éditions',
    prix: '9 € / mois',
    prixAnnuel: '90 € / an',
    priceMonthly: 9,
    priceAnnual: 90,
    etat: 'Offert la première année après ta première course',
    accent: 'ink',
    cta: 'Revenir au palier Membre',
    features: [
      'Les nouvelles de R.O.I et ton dossard',
      'Trois rencontres proposées chaque semaine',
      'Un binôme de sortie par semaine',
      'Le suivi : ce que chaque rencontre produit',
      'Le fil et les messages',
    ],
  },
  {
    id: 'premium',
    n: '02',
    name: 'Premium',
    tagline: 'Sans limite, et l’Arena en mieux',
    pour: 'Sans limite, et l’Arena en mieux',
    prix: '29 € / mois',
    prixAnnuel: '290 € / an',
    priceMonthly: 29,
    priceAnnual: 290,
    etat: 'Deux mois offerts sur l’année',
    accent: 'brand',
    highlight: true,
    badge: 'Le plus choisi',
    herite: 'Tout le palier Membre, et',
    cta: 'Passer en Premium',
    features: [
      'Rencontres proposées sans limite',
      'L’annuaire complet et ses filtres',
      'Qui veut te rencontrer, avant de répondre',
      'Six rencontres réservées à l’avance, le jour J',
      'Le Salon de l’Arena, vestiaire et douches sans attente, sas de départ dédié',
      'Le dîner des fondateurs, le soir',
    ],
  },
  {
    id: 'cercle',
    n: '03',
    name: 'Cercle',
    tagline: 'Quarante places, sur cooptation',
    pour: 'Quarante places',
    prix: '190 € / mois',
    prixAnnuel: '1 900 € / an',
    priceMonthly: 190,
    priceAnnual: 1900,
    etat: 'Sur cooptation de deux membres',
    accent: 'gold',
    perSeat: true,
    herite: 'Tout le Premium, et',
    cta: 'Demander une place',
    features: [
      'La table des investisseurs au déjeuner, un rendez-vous garanti avec les fonds présents',
      'Trois dossards invités pour ton équipe ou tes associés',
      'Ta place reconduite les éditions suivantes',
    ],
  },
]

/* Ce que chaque palier ouvre → liste des paliers qui l'ouvrent. */
export const FEATURES = {
  unlimitedMatches: ['premium', 'cercle'],
  whoWantsToMeet: ['premium', 'cercle'],
  advancedFilters: ['premium', 'cercle'],
  profileBoost: ['premium', 'cercle'],
  agenda: ['premium', 'cercle'],
  analytics: ['premium', 'cercle'],
  team: ['cercle'],
}

/* Rencontres proposées chaque semaine au palier Membre (démo). */
export const FREE_MATCH_LIMIT = 3

/* Le palier de départ, celui qu'on a juste après sa première course. */
export const PALIER_BASE = 'membre'

export function planById(id) {
  return PLANS.find((p) => p.id === id) || PLANS[0]
}

export function hasFeature(planId, key) {
  return (FEATURES[key] || []).includes(planId)
}

/* Quel palier minimal ouvre cette porte ? (pour les libellés) */
export function unlockingPlan(key) {
  const id = (FEATURES[key] || [])[0]
  return planById(id)
}

/* ------------------------------------------------------------- l'état
   `actif` tant que l'échéance n'est pas passée, `expire` ensuite. Expiré,
   l'app ne se ferme pas : elle passe en lecture seule (App.jsx). */
export function etatAbonnement(abonnement, now = new Date()) {
  if (!abonnement) return { statut: 'expire', jours: 0, bientot: false }
  const fin = new Date(`${abonnement.echeance}T00:00:00`)
  const aujourdhui = new Date(now)
  aujourdhui.setHours(0, 0, 0, 0)
  const jours = Math.round((fin - aujourdhui) / 86400000)
  const force = abonnement.statut === 'expire'
  return {
    statut: force || jours <= 0 ? 'expire' : 'actif',
    jours: Math.max(0, jours),
    // On prévient trois mois avant : c'est le temps d'y penser sans se sentir pressé.
    bientot: !force && jours > 0 && jours <= 90,
    palier: abonnement.palier || PALIER_BASE,
  }
}

/* « 2 décembre 2026 » — la date d'échéance, en toutes lettres. */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
export function dateLongue(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
}
