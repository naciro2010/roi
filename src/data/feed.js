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
    text: "Rencontre de ce matin : 12 km avec Thomas (fondateur d’un SaaS B2B), le long de la Seine.\n\nOn a parlé pendant, on n’a rien pitché. Ce que je garde :\n• À allure de conversation, on pose les vraies questions. La sienne : son premier développeur. La mienne : mon associée produit.\n• On lève tous les deux. On s’est promis une présentation chacun — lui vers un business angel, moi vers un fonds.\n• Le café d’arrivée a duré plus longtemps que la sortie.\n\nDouze kilomètres investis. On remet ça dimanche.",
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
    text: "Conseil pour celles et ceux qui recrutent leur premier responsable\n\nAvant d’ouvrir le poste, écris la fiche comme si la personne commençait demain : ce qu’elle doit avoir réglé à 90 jours, les décisions qu’elle prend sans toi, les chiffres qu’elle regarde. Si tu peines à l’écrire, tu n’es pas prêt à déléguer — et ça se paie six mois plus tard.\n\nJ’en parle volontiers en courant, jeudi, au canal.",
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
    text: "Sortie de samedi au Bois de Vincennes : 15 km avec Nadia et Yanis.\n\nDans la montée du fort, Nadia m’a raconté comment elle a recruté ses trois premiers profils tech sans cabinet. Yanis m’a présenté quelqu’un dans la foulée. Quinze kilomètres, deux relations qui avancent.",
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
    text: "Trois ans en indépendant. Ce qu’on ne te dit pas : les missions qui comptent ne viennent pas des plateformes. Elles viennent des gens que tu as vraiment rencontrés.\n\nDepuis que je cours avec des fondateurs, mon carnet est plein deux mois à l’avance. Le réseau qui rapporte, au sens propre.",
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
    text: "Étape : la marketplace vient de passer les 200 k€ de volume mensuel.\n\nMerci à celles et ceux qui courent : trois de mes meilleures recrues viennent d’une sortie du dimanche. Prochaine étape, ma Head of Growth. Si tu connais la bonne personne, présente-la-moi — sur les quais à huit heures, ou en huit minutes à l’Arena.",
    likes: 88,
    liked: false,
    comments: [
      { author: 'Sarah Khalil', text: 'Mérité. Bien couru.' },
      { author: 'Inès Roy', text: 'Bravo. On se cale un café ?' },
    ],
  },
]
