/* Comptes & appareils connectables (mock — aucune vraie OAuth).
   `category` : 'compte' (réseaux) · 'montre' (montres & capteurs). */

export const SERVICES = [
  { id: 'strava', name: 'Strava', category: 'compte', color: '#FC4C02', blurb: 'Tes sorties, ton allure et tes tracés, importés d’eux-mêmes' },
  { id: 'linkedin', name: 'LinkedIn', category: 'compte', color: '#070707', blurb: 'Ta fonction et ton entreprise, à jour sur le verso du dossard' },
  { id: 'apple', name: 'Apple Santé', category: 'montre', color: '#FF2D55', blurb: 'Apple Watch · tes sorties et ton cardio' },
  { id: 'garmin', name: 'Garmin Connect', category: 'montre', color: '#3A3731', blurb: 'Montres Garmin · tracés, allure, dénivelé' },
  { id: 'coros', name: 'COROS', category: 'montre', color: '#101010', blurb: 'Montres COROS · tes sorties, importées' },
  { id: 'polar', name: 'Polar', category: 'montre', color: '#E2001A', blurb: 'Montres Polar · cardio et récupération' },
]

export const CATEGORIES = [
  { id: 'compte', label: 'Comptes' },
  { id: 'montre', label: 'Montres & capteurs' },
]

export function serviceById(id) {
  return SERVICES.find((s) => s.id === id)
}
