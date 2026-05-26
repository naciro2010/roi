/* Comptes & appareils connectables (mock — aucune vraie OAuth).
   `category` : 'compte' (réseaux) · 'montre' (montres & capteurs). */

export const SERVICES = [
  { id: 'strava', name: 'Strava', category: 'compte', color: '#FC4C02', blurb: 'Importe tes courses, allure et tracés automatiquement' },
  { id: 'linkedin', name: 'LinkedIn', category: 'compte', color: '#0A66C2', blurb: 'Synchronise ton parcours et ton réseau pro' },
  { id: 'apple', name: 'Apple Santé', category: 'montre', color: '#FF2D55', blurb: 'Apple Watch · cardio, activité & sommeil' },
  { id: 'garmin', name: 'Garmin Connect', category: 'montre', color: '#0070BB', blurb: 'Montres Garmin · GPS, allure, dénivelé' },
  { id: 'coros', name: 'COROS', category: 'montre', color: '#1A1A1A', blurb: 'Montres COROS · données d’entraînement' },
  { id: 'polar', name: 'Polar', category: 'montre', color: '#E2001A', blurb: 'Montres Polar · cardio & récupération' },
]

export const CATEGORIES = [
  { id: 'compte', label: 'Comptes' },
  { id: 'montre', label: 'Montres & capteurs' },
]

export function serviceById(id) {
  return SERVICES.find((s) => s.id === id)
}
