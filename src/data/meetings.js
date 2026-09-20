/* Les rencontres (démo) : huit minutes, un sujet (un des quatre verbes), un
   lieu — autour d'un café, en courant (le binôme), en visio, ou à l'Arena le
   jour J. Chaque rencontre a un statut (confirmée / à confirmer).
   `date` au format ISO pour réutiliser formatEventDate(). */

export const MEETING_TYPES = {
  cafe: { label: 'Café', icon: 'coffee', tone: 'amber' },
  run: { label: 'En courant', icon: 'activity', tone: 'emerald' },
  visio: { label: 'Visio', icon: 'video', tone: 'indigo' },
  deal: { label: 'À l’Arena', icon: 'briefcase', tone: 'brand' },
}

export const MEETINGS = [
  {
    id: 'rdv1', with: 'Karim Haddad', type: 'cafe',
    date: '2026-05-28', time: '09:30', place: 'Café Oberkampf · Paris 11e',
    note: 'Lever · huit minutes sur ton dossier d’amorçage', status: 'confirmed',
  },
  {
    id: 'rdv2', with: 'Sarah Khalil', type: 'run',
    date: '2026-05-31', time: '08:00', place: 'Pont de l’Alma',
    note: 'Binôme · sortie longue, on parle levée pendant', status: 'confirmed',
  },
  {
    id: 'rdv3', with: 'Claire Moreau', type: 'visio',
    date: '2026-06-03', time: '14:00', place: 'En visio',
    note: 'Conseil · structurer ta première équipe', status: 'pending',
  },
  {
    id: 'rdv4', with: 'Inès Roy', type: 'deal',
    date: '2026-06-05', time: '10:00', place: 'Paris La Défense Arena · table B2B',
    note: 'Lever · présentation vers deux fonds B2B', status: 'pending',
  },
]
