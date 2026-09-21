/* Les kilomètres investis ce mois : ceux courus avec quelqu'un. */
export const CHALLENGE = { title: 'Kilomètres investis ce mois', subtitle: '50 km avec les autres, en mai', current: 42, total: 50, daysLeft: 5 }

/* Qui court le plus avec les autres, ce mois. */

export const LEADERBOARD = [
  { name: 'Marc Dubois', km: 64 },
  { name: 'Nadia Cherif', km: 58 },
  { name: 'Léa Fontaine', km: 51 },
  { name: 'Thomas Lefèvre', km: 42, me: true },
  { name: 'Sarah Khalil', km: 39 },
  { name: 'Yanis Benali', km: 34 },
]

export const EVENTS = [
  {
    id: 'a1',
    title: 'Sortie longue · Bords de Seine',
    day: 'Dimanche',
    date: '2026-05-31',
    time: '08:00',
    distance: '12 km',
    pace: '5:30 /km',
    level: 'Toutes les allures',
    place: 'Pont de l’Alma',
    organizer: 'Sarah Khalil',
    participants: 14,
    kudos: 23,
    attendees: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois', 'Nadia Cherif', 'Léa Fontaine'],
    description:
      "La sortie longue du dimanche, en groupe, le long de la Seine. Sarah en est l’hôte : on part du pont de l’Alma vers l’est, à allure de conversation. On parle pendant, on prolonge après. Toutes les allures. Café d’arrivée offert.",
    route: [
      [48.8638, 2.3009], [48.8625, 2.3072], [48.8609, 2.3135], [48.8597, 2.3198],
      [48.8588, 2.3262], [48.8575, 2.3325], [48.8566, 2.3389], [48.8552, 2.3451],
    ],
  },
  {
    id: 'a2',
    title: 'Sortie du jeudi · Canal Saint-Martin',
    day: 'Jeudi',
    date: '2026-05-28',
    time: '18:30',
    distance: '6 km',
    pace: '6:00 /km',
    level: 'Toutes les allures',
    place: 'Quai de Valmy',
    organizer: 'Claire Moreau',
    participants: 21,
    kudos: 31,
    tag: '+ café d’arrivée',
    attendees: ['Claire Moreau', 'Inès Roy', 'Léa Fontaine', 'Karim Haddad', 'Sarah Khalil'],
    description:
      "La sortie de la semaine, Claire en hôte : 6 km faciles le long du canal, puis on prolonge au bord de l’eau. Zéro pitch en course — on parle pendant, on conclut après. Deux investisseuses et un business angel courent avec nous jeudi.",
    route: [
      [48.8709, 2.3658], [48.8722, 2.3651], [48.8738, 2.3645], [48.8754, 2.3639],
      [48.8770, 2.3633], [48.8786, 2.3628], [48.8802, 2.3622], [48.8818, 2.3617],
    ],
  },
  {
    id: 'a3',
    title: 'Sortie rapide · Parc de Bercy',
    day: 'Mardi',
    date: '2026-06-02',
    time: '19:00',
    distance: '8 km',
    pace: '4:45 /km',
    level: 'Allure soutenue',
    place: 'Parc de Bercy',
    organizer: 'Hugo Bernard',
    participants: 9,
    kudos: 15,
    attendees: ['Yanis Benali', 'Hugo Bernard', 'Karim Haddad'],
    description:
      "Hugo est l’hôte de la sortie rapide du mardi : huit fois 400 m autour du lac de Bercy, récupération en trottinant. On parle dans les récupérations, pas dans les efforts. Pour celles et ceux qui tiennent l’allure ; le café d’arrivée est pour tout le monde.",
    route: [
      [48.8352, 2.3792], [48.8341, 2.3818], [48.8338, 2.3851], [48.8349, 2.3879],
      [48.8369, 2.3888], [48.8388, 2.3871], [48.8393, 2.3838], [48.8381, 2.3808],
      [48.8362, 2.3796], [48.8345, 2.3814],
    ],
  },
  {
    id: 'a4',
    title: 'Sortie chemins · Bois de Vincennes',
    day: 'Samedi',
    date: '2026-05-30',
    time: '09:30',
    distance: '15 km',
    pace: '6:15 /km',
    level: 'Allure tranquille',
    place: 'Château de Vincennes',
    organizer: 'Marc Dubois',
    participants: 7,
    kudos: 12,
    attendees: ['Marc Dubois', 'Nadia Cherif', 'Yanis Benali'],
    description:
      "Marc est l’hôte : boucle du lac Daumesnil et montée du fort, sur les chemins. Du dénivelé, de l’air, une allure où l’on parle encore. C’est dans la montée qu’on se dit les choses ; on prolonge au café du château.",
    route: [
      [48.8422, 2.4352], [48.8398, 2.4388], [48.8375, 2.4421], [48.8351, 2.4456],
      [48.8334, 2.4498], [48.8345, 2.4582], [48.8412, 2.4576], [48.8451, 2.4492],
      [48.8435, 2.4398], [48.8422, 2.4356],
    ],
  },
  {
    id: 'a5',
    title: 'Sortie douce · Buttes-Chaumont',
    day: 'Lundi',
    date: '2026-06-01',
    time: '07:00',
    distance: '5 km',
    pace: '6:30 /km',
    level: 'Toutes les allures',
    place: 'Entrée Botzaris',
    organizer: 'Léa Fontaine',
    participants: 5,
    kudos: 8,
    attendees: ['Sarah Khalil', 'Léa Fontaine', 'Nadia Cherif'],
    description:
      "Léa est l’hôte de la sortie du lundi : 5 km tranquilles dans les Buttes pour lancer la semaine, à l’allure de celle ou celui qui parle. Toutes les allures, aucun niveau requis. Café d’arrivée porte Botzaris.",
    route: [
      [48.8799, 2.3812], [48.8806, 2.3835], [48.8815, 2.3856], [48.8808, 2.3878],
      [48.8794, 2.3885], [48.8782, 2.3869], [48.8779, 2.3845], [48.8788, 2.3823],
    ],
  },
]
