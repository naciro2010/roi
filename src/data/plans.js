/* Abonnements ROI (démo — aucun paiement réel).
   Le plan gratuit débloque l'essentiel ; Pro et Business débloquent l'IA
   illimitée, les matchs avancés, les invitations d'équipe, etc. */

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
      '3 matchs intelligents / semaine',
      '3 questions au Copilot IA / semaine',
      'Fil, sorties & messages',
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
      'Matchs intelligents illimités',
      'Copilot IA illimité',
      'Rédaction de messages par l’IA',
      'Vois qui veut te rencontrer',
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
  copilotUnlimited: ['pro', 'business'],
  aiCompose: ['pro', 'business'],
  whoWantsToMeet: ['pro', 'business'],
  advancedFilters: ['pro', 'business'],
  profileBoost: ['pro', 'business'],
  team: ['business'],
  analytics: ['business'],
}

/* Limites du plan gratuit (démo). */
export const FREE_AI_LIMIT = 3
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
