/* Abonnements ROI (démo — aucun paiement réel).
   Le plan gratuit débloque l'essentiel ; Pro et Business débloquent les matchs
   illimités, l'agenda & RDV, les analytics ROI, les sièges d'équipe, etc. */

export const PLANS = [
  {
    id: 'free',
    name: 'Découverte',
    tagline: 'Pour commencer à networker',
    priceMonthly: 0,
    priceAnnual: 0,
    accent: 'ink',
    cta: 'Ton plan actuel',
    features: [
      '3 matchs / semaine',
      'RunMatch : 1 binôme / semaine',
      'Pipeline ROI · suivi des relations',
      'Fil, sorties & messages',
      'Suivi des kilomètres & défis',
      'Profil & connexions',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Pour networker sérieusement',
    priceMonthly: 12,
    priceAnnual: 9,
    accent: 'brand',
    highlight: true,
    badge: 'Le plus choisi',
    cta: 'Passer à Pro',
    features: [
      'Matchs illimités',
      'RunMatch illimité · tous tes binômes',
      'Pipeline ROI + analytics (valeur & km investis)',
      'Vois qui veut te rencontrer',
      'Agenda & RDV illimités',
      'Filtres & recherche avancés',
      'Boost de profil chaque mois',
      'Badge Pro sur ton profil',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Pour les équipes & communautés',
    priceMonthly: 29,
    priceAnnual: 24,
    accent: 'gold',
    perSeat: true,
    cta: 'Passer à Business',
    features: [
      'Tout le plan Pro, pour chaque membre',
      'Invitations & sièges d’équipe',
      'Espace équipe partagé',
      'Analytics ROI avancés',
      'Intros prioritaires',
      'Account manager dédié',
    ],
  },
]

/* Fonctionnalités gated → liste des plans qui les débloquent. */
export const FEATURES = {
  unlimitedMatches: ['pro', 'business'],
  whoWantsToMeet: ['pro', 'business'],
  advancedFilters: ['pro', 'business'],
  profileBoost: ['pro', 'business'],
  agenda: ['pro', 'business'],
  analytics: ['pro', 'business'],
  team: ['business'],
}

/* Limites du plan gratuit (démo). */
export const FREE_MATCH_LIMIT = 3

export function planById(id) {
  return PLANS.find((p) => p.id === id) || PLANS[0]
}

export function hasFeature(planId, key) {
  return (FEATURES[key] || []).includes(planId)
}

/* Quel plan minimal débloque cette fonctionnalité ? (pour les libellés) */
export function unlockingPlan(key) {
  const id = (FEATURES[key] || [])[0]
  return planById(id)
}
