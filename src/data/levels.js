/* Les kilomètres investis (démo) : les kilomètres courus AVEC quelqu'un font
   monter un palier, et chaque palier ajoute quelque chose — des rencontres
   proposées en plus, une présentation prioritaire, ta place dans une vague
   plus tôt. On court ensemble → ça s'ajoute.

   Règle de lisibilité : un palier ne ferme jamais une partie de l'app. Tout
   ce qui sert à comprendre et à se servir de l'app (chercher, filtrer, lire
   une fiche) est ouvert dès le premier jour ; les paliers ne font qu'ajouter. */

export const SEASON = { label: 'Kilomètres investis', endsIn: '5 jours' }

export const TIERS = [
  { km: 25, title: 'Première foulée', reward: '+2 rencontres proposées chaque semaine', icon: 'activity', unlock: { matches: 2 } },
  { km: 50, title: 'Compagnon de route', reward: '+1 rencontre proposée chaque semaine', icon: 'users', unlock: { matches: 1 } },
  { km: 100, title: 'Relais', reward: 'Présentation prioritaire : ton nom passe en premier', icon: 'trophy', unlock: { boost: true } },
  { km: 150, title: 'Tête de peloton', reward: 'Ta place dans une vague plus tôt, à la prochaine édition', icon: 'crown', unlock: { priorityIntro: true } },
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

/* Rencontres proposées en plus chaque semaine, ouvertes par les kilomètres. */
export function bonusMatches(km) {
  return TIERS.filter((t) => km >= t.km).reduce((n, t) => n + (t.unlock.matches || 0), 0)
}


