/* Activités réalisées (façon Strava).
   `route` = liste de points [lat, lng] tracés sur une vraie carte (Leaflet/OSM).
   Les tracés suivent grossièrement des parcours emblématiques de Paris. */

export const ACTIVITIES = [
  {
    id: 'r1',
    athlete: 'Thomas Lefèvre',
    title: 'Sortie longue · Bords de Seine',
    type: 'Sortie longue',
    date: "Aujourd'hui · 08:12",
    distance: 12.4,
    duration: '1:08:24',
    pace: '5:31',
    elevation: 48,
    kudos: 18,
    metContacts: ['Sarah Khalil', 'Marc Dubois'],
    note: "Sortie matinale avec Sarah, on a pitché nos boîtes en courant. 12 km pile, jambes légères.",
    splits: [5.4, 5.2, 5.3, 5.5, 5.6, 5.4, 5.3, 5.5, 5.7, 5.6, 5.4, 5.2],
    route: [
      [48.8638, 2.3009], [48.8625, 2.3072], [48.8609, 2.3135], [48.8597, 2.3198],
      [48.8588, 2.3262], [48.8575, 2.3325], [48.8566, 2.3389], [48.8552, 2.3451],
      [48.8559, 2.3392], [48.8571, 2.3329], [48.8584, 2.3266], [48.8595, 2.3202],
      [48.8606, 2.3139], [48.8622, 2.3076], [48.8638, 2.3013],
    ],
  },
  {
    id: 'r2',
    athlete: 'Sarah Khalil',
    title: 'Fractionné · Canal Saint-Martin',
    type: 'Fractionné',
    date: 'Hier · 18:40',
    distance: 8.1,
    duration: '0:41:05',
    pace: '5:04',
    elevation: 22,
    kudos: 24,
    metContacts: ['Claire Moreau'],
    note: "8 x 400m le long du canal. Objectif 10 km sous 50 min, ça avance 💪",
    splits: [5.3, 4.6, 5.2, 4.5, 5.1, 4.4, 5.2, 4.6],
    route: [
      [48.8709, 2.3658], [48.8722, 2.3651], [48.8738, 2.3645], [48.8754, 2.3639],
      [48.8770, 2.3633], [48.8786, 2.3628], [48.8772, 2.3635], [48.8756, 2.3641],
      [48.8740, 2.3647], [48.8724, 2.3653], [48.8710, 2.3660], [48.8726, 2.3654],
      [48.8742, 2.3648], [48.8758, 2.3642],
    ],
  },
  {
    id: 'r3',
    athlete: 'Marc Dubois',
    title: 'Trail · Bois de Vincennes',
    type: 'Trail',
    date: 'Sam. · 09:35',
    distance: 15.2,
    duration: '1:35:18',
    pace: '6:16',
    elevation: 96,
    kudos: 31,
    metContacts: ['Nadia Cherif', 'Yanis Benali'],
    note: "Boucle du lac Daumesnil + montée du fort. 15 km, du dénivelé, le pied après une semaine de board.",
    splits: [6.1, 6.3, 6.0, 6.4, 6.5, 6.2, 6.1, 6.3, 6.6, 6.2, 6.0, 6.4, 6.3, 6.1, 6.2],
    route: [
      [48.8422, 2.4352], [48.8398, 2.4388], [48.8375, 2.4421], [48.8351, 2.4456],
      [48.8334, 2.4498], [48.8328, 2.4548], [48.8345, 2.4582], [48.8378, 2.4595],
      [48.8412, 2.4576], [48.8436, 2.4538], [48.8451, 2.4492], [48.8448, 2.4441],
      [48.8435, 2.4398], [48.8422, 2.4356],
    ],
  },
  {
    id: 'r4',
    athlete: 'Yanis Benali',
    title: 'Récup easy · Buttes-Chaumont',
    type: 'Récup',
    date: 'Ven. · 07:05',
    distance: 5.3,
    duration: '0:33:50',
    pace: '6:23',
    elevation: 71,
    kudos: 9,
    metContacts: [],
    note: "Footing tranquille avant une journée de code. Les côtes des Buttes réveillent 😅",
    splits: [6.5, 6.2, 6.4, 6.3, 6.5],
    route: [
      [48.8799, 2.3812], [48.8806, 2.3835], [48.8815, 2.3856], [48.8808, 2.3878],
      [48.8794, 2.3885], [48.8782, 2.3869], [48.8779, 2.3845], [48.8788, 2.3823],
      [48.8800, 2.3814], [48.8810, 2.3838],
    ],
  },
]

export function activityById(id) {
  return ACTIVITIES.find((a) => a.id === id)
}

/* Sorties courues avec une personne (rencontrée pendant l'activité de l'user,
   ou activité de la personne où l'user figure parmi les contacts rencontrés). */
export function runsWith(me, name) {
  return ACTIVITIES.filter(
    (a) =>
      (a.athlete === me && a.metContacts.includes(name)) ||
      (a.athlete === name && a.metContacts.includes(me)),
  )
}

/* Total des kilomètres « investis » avec une personne (pour le Pipeline ROI). */
export function kmWith(me, name) {
  return runsWith(me, name).reduce((s, a) => s + a.distance, 0)
}
