/* Rendez-vous business (démo). Chaque RDV relie un contact à un créneau —
   café, sortie running ou visio — avec un statut (confirmé / à confirmer).
   `date` au format ISO pour réutiliser formatEventDate(). */

export const MEETING_TYPES = {
  cafe: { label: 'Café', icon: 'coffee', tone: 'amber' },
  run: { label: 'Run', icon: 'activity', tone: 'emerald' },
  visio: { label: 'Visio', icon: 'video', tone: 'indigo' },
  deal: { label: 'Deal', icon: 'briefcase', tone: 'brand' },
}

export const MEETINGS = [
  {
    id: 'rdv1', with: 'Karim Haddad', type: 'cafe',
    date: '2026-05-28', time: '09:30', place: 'Café Oberkampf · Paris 11e',
    note: 'Présentation du deck seed', status: 'confirmed',
  },
  {
    id: 'rdv2', with: 'Sarah Khalil', type: 'run',
    date: '2026-05-31', time: '08:00', place: 'Pont de l’Alma',
    note: 'Sortie longue · on compare nos pitchs', status: 'confirmed',
  },
  {
    id: 'rdv3', with: 'Claire Moreau', type: 'visio',
    date: '2026-06-03', time: '14:00', place: 'Google Meet',
    note: 'Point mentorat scaling & ops', status: 'pending',
  },
  {
    id: 'rdv4', with: 'Inès Roy', type: 'deal',
    date: '2026-06-05', time: '10:00', place: 'Afterwork Run & Pitch',
    note: 'Suite : intro fonds early-stage', status: 'pending',
  },
]
