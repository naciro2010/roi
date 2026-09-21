/* Messages : une conversation s'ouvre quand les deux ont dit oui. Les cercles
   (groupes) rassemblent une sortie, un secteur, une entreprise. */

export const CONVERSATIONS = [
  { id: 'c1', name: 'Sarah Khalil', last: 'On cale ça dimanche, alors. Café d’arrivée compris', time: '09:12', unread: true },
  { id: 'c2', name: 'Yanis Benali', last: 'Je regarde ton code ce soir et je te dis', time: 'Hier', unread: true },
  { id: 'c3', name: 'Claire Moreau', last: 'Avec plaisir. Jeudi, après la sortie, au café ?', time: 'Hier', unread: false },
  { id: 'c4', name: 'Léa Fontaine', last: 'Ton profil m’intéresse pour la Head of Growth', time: 'Lun.', unread: false },
  { id: 'c5', name: 'Karim Haddad', last: 'Envoie-moi ton dossier, je le lis avant', time: '23 mai', unread: false },
]

export const THREADS = {
  c1: [
    { from: 'them', text: 'Salut Thomas, on court tous les deux le dimanche sur les quais, non ?' },
    { from: 'me', text: 'Oui, tôt, le long de la Seine. Tu lèves aussi, je crois ?' },
    { from: 'them', text: 'Une seed. On en parle en courant ? Pas de pitch, juste les vraies questions.' },
    { from: 'me', text: 'Parfait. Dimanche, 8 h, pont de l’Alma ? Douze kilomètres à allure de conversation.' },
    { from: 'them', text: 'On cale ça dimanche, alors. Café d’arrivée compris' },
  ],
  c2: [
    { from: 'me', text: 'Salut Yanis, je recrute un développeur React pour mon tableau de bord. Tu prends encore des missions ?' },
    { from: 'them', text: 'Oui. Raconte-moi le projet.' },
    { from: 'me', text: 'SaaS B2B : tableau de bord et onboarding. Deux à trois semaines pour une première version ?' },
    { from: 'them', text: 'Je regarde ton code ce soir et je te dis' },
  ],
  c3: [
    { from: 'me', text: 'Bonjour Claire, j’aimerais ton regard sur la façon dont tu as structuré ta première équipe.' },
    { from: 'them', text: 'Avec plaisir. Jeudi, après la sortie, au café ?' },
  ],
  c4: [
    { from: 'them', text: 'Ton profil m’intéresse pour la Head of Growth' },
    { from: 'me', text: 'Merci ! Je reste côté fondateur, mais je connais deux personnes. Je te les présente ?' },
  ],
  c5: [
    { from: 'me', text: 'Bonjour Karim, je lève une amorçage pour mon SaaS B2B. Huit minutes autour d’un café ?' },
    { from: 'them', text: 'Envoie-moi ton dossier, je le lis avant' },
  ],
}

export const GROUPS = [
  {
    id: 'g1',
    name: 'Sorties longues du dimanche',
    topic: 'Cercle de sortie · la Seine, 8 h',
    members: 128,
    avatars: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois'],
    time: '09:40',
    unread: 3,
  },
  {
    id: 'g2',
    name: 'Fondateurs qui lèvent',
    topic: 'Cercle par intention · amorçage et seed',
    members: 56,
    avatars: ['Karim Haddad', 'Inès Roy', 'Sarah Khalil'],
    time: 'Hier',
    unread: 0,
  },
  {
    id: 'g3',
    name: 'Tech & produit',
    topic: 'Cercle par secteur · développeurs indépendants et fondateurs',
    members: 41,
    avatars: ['Yanis Benali', 'Hugo Bernard'],
    time: 'Mar.',
    unread: 0,
  },
]

export const GROUP_THREADS = {
  g1: [
    { from: 'Claire Moreau', text: 'Qui court dimanche ? Sortie longue, allure de conversation.' },
    { from: 'Marc Dubois', text: '12 km le long de la Seine, ça me va' },
    { from: 'me', text: 'Présent. On part d’où ?' },
    { from: 'Sarah Khalil', text: 'Pont de l’Alma, 8 h. On parle pendant, café après.' },
  ],
  g2: [
    { from: 'Inès Roy', text: 'Je partage une trame de dossier qui se lit en huit minutes' },
    { from: 'Karim Haddad', text: 'Bien. Ajoutez une page de chiffres, une seule.' },
    { from: 'me', text: 'Merci. Je vous envoie le mien pour un retour.' },
  ],
  g3: [
    { from: 'Yanis Benali', text: 'Qui est partant pour une sortie jeudi soir, 6 km tranquilles ?' },
    { from: 'Hugo Bernard', text: 'Moi, si on part de République' },
    { from: 'me', text: 'J’apporte le café d’arrivée' },
  ],
}

export const GROUP_SUGGESTIONS = [
  { id: 'gs1', name: 'Sorties du samedi · Vincennes', topic: 'Cercle de sortie · les chemins du bois', members: 92, avatars: ['Marc Dubois', 'Nadia Cherif'] },
  { id: 'gs2', name: 'Growth & marketplaces', topic: 'Cercle par secteur · acquisition, marketplaces', members: 64, avatars: ['Léa Fontaine', 'Nadia Cherif'] },
]
