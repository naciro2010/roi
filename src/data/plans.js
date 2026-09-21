/* Les formules (démo — aucun paiement dans l'app, on change de formule depuis
   l'espace du site). Mêmes ids techniques que le site : `free` → Dossard,
   `pro` → Premium, `business` → Cercle. Aucune formule n'achète une meilleure
   course : elle change quand le réseau commence, et combien de portes
   s'ouvrent après la ligne. Aucun prix ici : le tarif est celui de la vague,
   Premium est sur demande, le Cercle sur cooptation. */

export const PLANS = [
  {
    id: 'free',
    n: '01',
    name: 'Dossard',
    tagline: 'La journée entière, et le réseau le jour J',
    prix: 'Tarif de la vague',
    etat: 'Inclus',
    pour: 'La journée entière',
    priceMonthly: 0,
    priceAnnual: 0,
    accent: 'ink',
    cta: 'Revenir au Dossard',
    features: [
      'L’annuaire de qui court, le jour J',
      'Trois rencontres proposées chaque semaine',
      'Un binôme par semaine',
      'Le pipeline : ce que chaque rencontre produit',
      'Les sorties à allure de conversation',
      'Le fil et les messages',
    ],
  },
  {
    id: 'pro',
    n: '02',
    name: 'Premium',
    tagline: 'Le réseau commence avant la ligne',
    prix: 'Sur demande',
    etat: 'Sur demande',
    pour: 'Le réseau commence avant la ligne',
    priceMonthly: 0,
    priceAnnual: 0,
    accent: 'brand',
    highlight: true,
    badge: 'Le plus choisi',
    herite: 'Tout le Dossard, et',
    cta: 'Passer en Premium',
    features: [
      'L’annuaire dès la validation de ton dossier',
      'Six rencontres réservées à l’avance',
      'Rencontres proposées sans limite',
      'Qui veut te rencontrer',
      'Les filtres de l’annuaire',
      'Le Salon de l’Arena, vestiaire et douches sans attente, sas de départ dédié',
      'Le dîner des fondateurs, le soir',
    ],
  },
  {
    id: 'business',
    n: '03',
    name: 'Cercle',
    tagline: 'Quarante places, sur cooptation',
    prix: 'Sur cooptation',
    etat: 'Sur cooptation',
    pour: 'Quarante places',
    priceMonthly: 0,
    priceAnnual: 0,
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

/* Ce que chaque formule ouvre → liste des formules qui l'ouvrent. */
export const FEATURES = {
  unlimitedMatches: ['pro', 'business'],
  whoWantsToMeet: ['pro', 'business'],
  advancedFilters: ['pro', 'business'],
  profileBoost: ['pro', 'business'],
  agenda: ['pro', 'business'],
  analytics: ['pro', 'business'],
  team: ['business'],
}

/* Rencontres proposées chaque semaine avec la formule Dossard (démo). */
export const FREE_MATCH_LIMIT = 3

export function planById(id) {
  return PLANS.find((p) => p.id === id) || PLANS[0]
}

export function hasFeature(planId, key) {
  return (FEATURES[key] || []).includes(planId)
}

/* Quelle formule minimale ouvre cette porte ? (pour les libellés) */
export function unlockingPlan(key) {
  const id = (FEATURES[key] || [])[0]
  return planById(id)
}
