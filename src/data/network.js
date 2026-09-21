/* L'annuaire : qui court cette année. NB : les rencontres proposées (« Pour
   toi ») ne sont plus codées en dur ici. Elles sont calculées par le moteur
   (src/lib/matching.js) à partir des profils (src/data/profiling.js) et de ce
   que tu fais dans l'app. */

/* Filtres par intention. « Conseille » = le mentorat. */
export const FILTERS = ['Tous', 'Recrute', 'Lève', 'Vend', 'S’associe', 'Conseille']

export const MEMBERS = [
  { id: 'm1', name: 'Sarah Khalil', need: 'Lève une seed, cherche une associée produit', category: 'Lève', proximity: 'Court le dimanche · Seine' },
  { id: 'm2', name: 'Claire Moreau', need: 'Conseille sur la structuration d’équipe et les opérations', category: 'Conseille', proximity: 'Sera à la sortie de jeudi' },
  { id: 'm3', name: 'Karim Haddad', need: 'Investit · tickets 20–50 k€, pré-seed et seed', category: 'Lève', proximity: 'À 2 km · Issy-les-Moulineaux' },
  { id: 'm4', name: 'Léa Fontaine', need: 'Recrute sa Head of Growth', category: 'Recrute', proximity: 'Croisée à la sortie de mardi' },
  { id: 'm5', name: 'Marc Dubois', need: 'S’associe · cherche un associé tech', category: 'S’associe', proximity: 'À 3 km · Boulogne' },
  { id: 'm6', name: 'Inès Roy', need: 'Investit · pré-seed et seed, B2B et climat', category: 'Lève', proximity: 'Sera à la sortie de jeudi, au canal' },
  { id: 'm7', name: 'Hugo Bernard', need: 'Recrute des profils tech et opérations', category: 'Recrute', proximity: 'À 1,5 km · Paris 11e' },
  { id: 'm8', name: 'Nadia Cherif', need: 'Conseille sur le go-to-market', category: 'Conseille', proximity: 'Court le samedi · Vincennes' },
]

/* Fiches détaillées (ouvertes depuis l'annuaire). Chacun a un dossard pour
   l'édition 01 : la distance est sur la fiche. */
export const PEOPLE = {
  'Sarah Khalil': {
    title: 'Fondatrice · foodtech', location: 'Paris 10e',
    bio: "Je construis une marque foodtech bien-être. Je lève une seed et je cherche à m’entourer côté produit. Je cours pour trier les idées, le dimanche, le long de la Seine.",
    looking: ['Une associée produit', 'Des retours sur sa levée'], offering: ['Des retours go-to-market', 'Des présentations dans la foodtech'],
    tags: ['Dossard 10 km', 'Foodtech', 'Seed', 'Sorties longues'], mutuals: ['Claire Moreau', 'Léa Fontaine', 'Marc Dubois'],
  },
  'Yanis Benali': {
    title: 'Développeur indépendant · React', location: 'Montreuil',
    bio: "Développeur indépendant, j’aide les fondateurs à sortir une première version vite et propre. React, Node, un peu de design. Je vends des missions, je les choisis en courant.",
    looking: ['Des missions produit', 'Des projets B2B'], offering: ['Développement React et Node', 'Architecture front'],
    tags: ['Dossard 10 km', 'React', 'Indépendant', 'Sorties du jeudi'], mutuals: ['Hugo Bernard', 'Marc Dubois'],
  },
  'Claire Moreau': {
    title: 'Ex-directrice retail · conseille', location: 'Neuilly',
    bio: "J’ai fait passer une marque retail de zéro à deux cents boutiques. Aujourd’hui je conseille des fondateurs sur la structuration d’équipe et les opérations. Je suis l’hôte de la sortie du jeudi.",
    looking: ['Des fondateurs à conseiller'], offering: ['Structurer une équipe', 'Stratégie retail et opérations'],
    tags: ['Dossard 5 km', 'Conseille', 'Retail', 'Opérations'], mutuals: ['Sarah Khalil', 'Inès Roy', 'Léa Fontaine', 'Nadia Cherif'],
  },
  'Karim Haddad': {
    title: 'Business angel · ex-directeur financier', location: 'Issy-les-Moulineaux',
    bio: "Ancien directeur financier devenu business angel. J’investis en pré-seed et en seed sur des fondateurs obsédés par leur problème. Tickets 20–50 k€. Huit minutes me suffisent pour savoir si je veux la suite.",
    looking: ['Des dossiers pré-seed et seed'], offering: ['Un ticket d’amorçage', 'Des présentations en finance'],
    tags: ['Dossard 21,1 km', 'Business angel', 'Seed', 'Allure soutenue'], mutuals: ['Hugo Bernard', 'Inès Roy'],
  },
  'Léa Fontaine': {
    title: 'CEO · marketplace mode', location: 'Paris 9e',
    bio: "Je dirige une marketplace mode qui grandit vite. Je recrute ma Head of Growth et je parle volontiers acquisition, le lundi matin, dans les Buttes.",
    looking: ['Sa Head of Growth', 'Des profils acquisition'], offering: ['Des retours marketplace', 'Des présentations dans la mode et le retail'],
    tags: ['Dossard 10 km', 'Marketplace', 'Recrute', 'Mode'], mutuals: ['Claire Moreau', 'Sarah Khalil', 'Nadia Cherif'],
  },
  'Marc Dubois': {
    title: 'Co-fondateur · fintech', location: 'Boulogne',
    bio: "Co-fondateur d’une fintech, je cherche un associé tech pour aller plus loin. Je tiens l’allure sur les sorties longues, et la conversation avec.",
    looking: ['Un associé tech'], offering: ['Une vision produit', 'Des présentations dans la fintech'],
    tags: ['Dossard 21,1 km', 'Fintech', 'S’associe', 'Sorties longues'], mutuals: ['Yanis Benali', 'Nadia Cherif', 'Sarah Khalil'],
  },
  'Inès Roy': {
    title: 'Investisseuse · fonds early-stage', location: 'Paris 8e',
    bio: "J’investis en pré-seed et en seed, sur le B2B et le climat. Toujours partante pour un café, ou huit minutes en courant.",
    looking: ['Des fondateurs B2B et climat'], offering: ['Un investissement', 'Des présentations vers d’autres fonds'],
    tags: ['Dossard 10 km', 'Fonds', 'Early-stage', 'B2B'], mutuals: ['Karim Haddad', 'Claire Moreau'],
  },
  'Hugo Bernard': {
    title: 'Directeur général · logistique', location: 'Paris 11e',
    bio: "Je dirige une entreprise de logistique qui grandit. On recrute beaucoup, côté tech et opérations. La sortie rapide du mardi, c’est mon rendez-vous de la semaine.",
    looking: ['Des profils tech et opérations', 'Des partenaires logistique'], offering: ['Des retours sur la croissance', 'Des postes à pourvoir'],
    tags: ['Dossard 21,1 km', 'Logistique', 'Recrute', 'Allure soutenue'], mutuals: ['Yanis Benali', 'Karim Haddad'],
  },
  'Nadia Cherif': {
    title: 'Fondatrice, trois fois · conseille', location: 'Vincennes',
    bio: "Trois entreprises lancées, une revendue. Je conseille sur le go-to-market et j’aime présenter les bonnes personnes entre elles, de préférence dans la montée du fort.",
    looking: ['Des projets à conseiller'], offering: ['Conseil go-to-market', 'Des présentations'],
    tags: ['Dossard 10 km', 'Go-to-market', 'Conseille', 'Chemins'], mutuals: ['Marc Dubois', 'Léa Fontaine', 'Claire Moreau'],
  },
}

/* Ce que le réseau a produit ces derniers jours. */
export const OPPORTUNITIES = [
  { id: 'o1', icon: 'link', tone: 'indigo', who: 'Claire Moreau', detail: 't’a présenté à une dirigeante qui a structuré son équipe.', time: 'Il y a 2 j' },
  { id: 'o2', icon: 'briefcase', tone: 'emerald', who: 'Yanis Benali', detail: 'a dit oui : huit minutes sur ton renfort React.', time: 'Il y a 3 j' },
  { id: 'o3', icon: 'trendingUp', tone: 'brand', who: 'Karim Haddad', detail: 'a demandé ton dossier d’amorçage après votre café.', time: 'Il y a 5 j' },
]

export function personFor(name) {
  return (
    PEOPLE[name] || {
      title: 'Dossard · Édition 01',
      location: 'Paris',
      bio: 'A pris son dossard pour l’édition 01.',
      looking: [],
      offering: [],
      tags: [],
      mutuals: [],
    }
  )
}
