/* Gamification « Saison » (démo) : les kilomètres parcourus font monter un
   niveau et débloquent des récompenses réseau (matchs, catégories, boosts).
   On court → on débloque. */

export const SEASON = { label: 'Saison de printemps', endsIn: '5 jours' }

export const TIERS = [
  { km: 25, title: 'Régulier', reward: '+2 matchs chaque semaine', icon: 'activity', unlock: { matches: 2 } },
  { km: 50, title: 'Connecteur', reward: 'Catégorie « Investit » débloquée', icon: 'users', unlock: { category: 'Investit' } },
  { km: 100, title: 'Marathonien réseau', reward: 'Boost de profil + badge de saison', icon: 'trophy', unlock: { boost: true } },
  { km: 150, title: 'Élite ROI', reward: 'Une intro prioritaire offerte', icon: 'crown', unlock: { priorityIntro: true } },
]

/* Renvoie l'état de progression pour un total de km donné. */
export function seasonProgress(km) {
  const unlocked = TIERS.filter((t) => km >= t.km)
  const next = TIERS.find((t) => km < t.km) || null
  const level = unlocked.length
  const prevKm = unlocked.length ? unlocked[unlocked.length - 1].km : 0
  const span = next ? next.km - prevKm : 1
  const pct = next ? Math.min(100, Math.round(((km - prevKm) / span) * 100)) : 100
  const remaining = next ? next.km - km : 0
  return { unlocked, next, level, pct, remaining }
}

/* Bonus de matchs hebdo débloqué par les kilomètres. */
export function bonusMatches(km) {
  return TIERS.filter((t) => km >= t.km).reduce((n, t) => n + (t.unlock.matches || 0), 0)
}

/* Le palier qui débloque une catégorie d'annuaire (ou null si libre). */
export function categoryTier(category) {
  return TIERS.find((t) => t.unlock.category === category) || null
}

/* Une catégorie est-elle encore verrouillée pour ce total de km ? */
export function isCategoryLocked(km, category) {
  const tier = categoryTier(category)
  return !!tier && km < tier.km
}

