/* Fil d'actualité (façon LinkedIn).
   types : 'rex' (REX rencontre) · 'tip' · 'reflexion' · 'activity' (partage de course) · 'milestone'
   `activityId` relie un post à une activité Strava (data/activities.js). */

export const POST_TYPES = {
  rex: { label: 'REX rencontre', icon: 'users', tone: 'indigo' },
  tip: { label: 'Tip', icon: 'zap', tone: 'amber' },
  reflexion: { label: 'Réflexion', icon: 'sparkles', tone: 'brand' },
  activity: { label: 'Activité', icon: 'activity', tone: 'emerald' },
  milestone: { label: 'Étape', icon: 'trophy', tone: 'rose' },
}

export const POSTS = [
  {
    id: 'p1',
    author: 'Sarah Khalil',
    time: 'Il y a 1 h',
    type: 'rex',
    text: "REX de ma sortie de ce matin avec Thomas (fondateur SaaS B2B) 🏃‍♀️\n\nOn a pitché nos boîtes en courant 12 km. Trois trucs que je retiens :\n• Le « run & pitch » force à aller à l'essentiel — pas de slide où se cacher.\n• On se dit plus de vérités à 5:30/km qu'en réunion.\n• On a déjà calé un échange d'intros investisseurs.\n\nMeilleure réunion réseau de la semaine, et j'ai pris l'air.",
    activityId: 'r1',
    likes: 27,
    liked: false,
    comments: [
      { author: 'Claire Moreau', text: "Tellement vrai, le running casse les barrières 🙌" },
      { author: 'Karim Haddad', text: 'Envoie-moi vos decks à tous les deux 👀' },
    ],
  },
  {
    id: 'p2',
    author: 'Claire Moreau',
    time: 'Il y a 3 h',
    type: 'tip',
    text: "Tip scaling pour les fondateurs early 👇\n\nAvant de recruter votre 1er Head of, écrivez la fiche de poste comme si la personne commençait demain : objectifs à 90 jours, décisions qu'elle prend seule, métriques. Si vous galérez à l'écrire, c'est que vous n'êtes pas prêts à déléguer — et ça vous coûtera 6 mois.",
    likes: 41,
    liked: false,
    comments: [
      { author: 'Léa Fontaine', text: "Je garde ça pour mon recrutement Growth, merci !" },
    ],
  },
  {
    id: 'p3',
    author: 'Marc Dubois',
    time: 'Hier',
    type: 'activity',
    text: "15 km de trail au Bois de Vincennes pour décrocher du board. Croisé Nadia et Yanis sur place — on a parlé hiring tech pendant la montée du fort 😮‍💨",
    activityId: 'r3',
    likes: 33,
    liked: false,
    comments: [
      { author: 'Nadia Cherif', text: 'La montée du fort, ce mur 😂 GG' },
    ],
  },
  {
    id: 'p4',
    author: 'Yanis Benali',
    time: 'Hier',
    type: 'reflexion',
    text: "Freelance depuis 3 ans. Ce que personne ne te dit : tes meilleurs clients ne viennent pas des plateformes, ils viennent des gens que tu croises vraiment.\n\nDepuis que je cours avec des fondateurs, mon carnet de commandes est plein 2 mois à l'avance. Le réseau qui rapporte, littéralement.",
    likes: 52,
    liked: true,
    comments: [
      { author: 'Hugo Bernard', text: 'On en reparle au coworking jeudi 👍' },
      { author: 'Thomas Lefèvre', text: 'Co-signé. Hâte de bosser sur le MVP avec toi.' },
    ],
  },
  {
    id: 'p5',
    author: 'Léa Fontaine',
    time: '2 j',
    type: 'milestone',
    text: "On vient de passer les 200k€ de GMV mensuel sur la marketplace 🎉\n\nMerci à ce réseau de runners-entrepreneurs : 3 de mes meilleures recrues viennent d'une sortie du dimanche. Prochaine étape, le Head of Growth — les profils, vous savez où me trouver (sur les quais, 8h ⏱️).",
    likes: 88,
    liked: false,
    comments: [
      { author: 'Sarah Khalil', text: 'Énorme 👏 tellement mérité' },
      { author: 'Inès Roy', text: 'Bravo ! On se cale un café ?' },
    ],
  },
]
