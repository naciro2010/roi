/* Le fil : ce que le réseau raconte.
   types : 'rex' (Rencontre — le retour d'une rencontre) · 'tip' (Conseil) ·
   'reflexion' (Réflexion) · 'activity' (Sortie) · 'milestone' (Étape — une
   nouvelle liée au réseau : recrue, levée, contrat, association).
   `activityId` relie un post à une sortie (data/activities.js). */

export const POST_TYPES = {
  rex: { label: 'Rencontre', icon: 'users', tone: 'indigo' },
  tip: { label: 'Conseil', icon: 'zap', tone: 'amber' },
  reflexion: { label: 'Réflexion', icon: 'sparkles', tone: 'brand' },
  activity: { label: 'Sortie', icon: 'activity', tone: 'emerald' },
  milestone: { label: 'Étape', icon: 'trophy', tone: 'rose' },
}

export const POSTS = [
  {
    id: 'p1',
    author: 'Sarah Khalil',
    time: 'Il y a 1 h',
    type: 'rex',
    text: "12 km avec Thomas ce matin, le long de la Seine. On a parlé pendant, on n’a rien pitché : son premier développeur, mon associée produit. On lève tous les deux, on s’est promis une présentation chacun. Le café d’arrivée a duré plus longtemps que la sortie.",
    activityId: 'r1',
    likes: 27,
    liked: false,
    comments: [
      { author: 'Claire Moreau', text: 'La preuve que l’après compte autant.' },
      { author: 'Karim Haddad', text: 'Vos deux dossiers m’intéressent. Huit minutes chacun, autour d’un café ?' },
    ],
  },
  {
    id: 'p2',
    author: 'Claire Moreau',
    time: 'Il y a 3 h',
    type: 'tip',
    text: "Pour celles et ceux qui recrutent leur premier responsable : écris la fiche comme si la personne commençait demain — ce qu’elle doit avoir réglé à 90 jours, les décisions qu’elle prend sans toi. Si tu peines à l’écrire, tu n’es pas prêt à déléguer.",
    likes: 41,
    liked: false,
    comments: [
      { author: 'Léa Fontaine', text: 'Je garde ça pour ma Head of Growth. Merci Claire.' },
    ],
  },
  {
    id: 'p3',
    author: 'Marc Dubois',
    time: 'Hier',
    type: 'activity',
    text: "Sortie de samedi au Bois de Vincennes avec Nadia et Yanis. Dans la montée du fort, Nadia m’a raconté comment elle a recruté ses trois premiers profils tech sans cabinet. Quinze kilomètres, deux relations qui avancent.",
    activityId: 'r3',
    likes: 33,
    liked: false,
    comments: [
      { author: 'Nadia Cherif', text: 'La montée du fort, c’est là qu’on se dit la vérité.' },
    ],
  },
  {
    id: 'p4',
    author: 'Yanis Benali',
    time: 'Hier',
    type: 'reflexion',
    text: "Trois ans en indépendant. Ce qu’on ne te dit pas : les missions qui comptent ne viennent pas des plateformes, elles viennent des gens que tu as vraiment rencontrés. Depuis que je cours avec des fondateurs, mon carnet est plein deux mois à l’avance.",
    likes: 52,
    liked: true,
    comments: [
      { author: 'Hugo Bernard', text: 'On en reparle jeudi, au café d’arrivée.' },
      { author: 'Thomas Lefèvre', text: 'Signé. Hâte de commencer ensemble sur le tableau de bord.' },
    ],
  },
  {
    id: 'p5',
    author: 'Léa Fontaine',
    time: '2 j',
    type: 'milestone',
    text: "La marketplace vient de passer les 200 k€ de volume mensuel. Trois de mes meilleures recrues viennent d’une sortie du dimanche. Prochaine étape, ma Head of Growth : si tu connais la bonne personne, présente-la-moi.",
    likes: 88,
    liked: false,
    comments: [
      { author: 'Sarah Khalil', text: 'Mérité. Bien couru.' },
      { author: 'Inès Roy', text: 'Bravo. On se cale un café ?' },
    ],
  },
]
