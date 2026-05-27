/* Gamification « Saison » (démo) : les kilomètres parcourus font monter un
   niveau et débloquent des récompenses réseau (matchs, catégories, boosts).
   On court → on débloque. */

export const SEASON = { label: 'Saison de printemps', endsIn: '5 jours' }

export const TIERS = [
  { km: 25, title: 'Régulier', reward: '+2 matchs chaque semaine', icon: 'activity' },
  { km: 50, title: 'Connecteur', reward: 'Catégorie « Investisseurs » débloquée', icon: 'users' },
  { km: 100, title: 'Marathonien réseau', reward: 'Boost de profil + badge de saison', icon: 'trophy' },
  { km: 150, title: 'Élite ROI', reward: 'Une intro prioritaire offerte', icon: 'crown' },
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
