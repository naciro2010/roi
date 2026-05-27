export const SUGGESTIONS = [
  {
    id: 1,
    name: 'Sarah Khalil',
    match: 94,
    needBadge: 'Lève des fonds',
    runBadge: 'Court le dimanche',
    context: ['Même objectif : seed', 'Vous courez la Seine le dimanche', '5 connexions en commun'],
    reason:
      "Comme toi, elle prépare une levée. Vous courez tous les deux le long de la Seine le dimanche — l'occasion d'échanger sur vos pitchs.",
    primaryAction: 'Proposer une sortie',
  },
  {
    id: 2,
    name: 'Yanis Benali',
    match: 89,
    needBadge: 'Cherche des missions',
    runBadge: 'Même défi 10 km',
    context: ['Répond à ton besoin : dev React', 'Inscrit au même défi 10 km', 'Dispo sous 2 semaines'],
    reason:
      "Tu cherches un dev React pour ton MVP ; lui prend justement des missions. Vous êtes inscrits au même défi 10 km — parfait pour faire connaissance en courant.",
    primaryAction: 'Proposer une sortie',
  },
  {
    id: 3,
    name: 'Claire Moreau',
    match: 86,
    needBadge: 'Propose du mentorat',
    runBadge: "Sera à l'event jeudi",
    context: ['A scalé une marque retail 0→200 boutiques', 'Présente au Run & Pitch jeudi', 'Mentor scaling'],
    reason:
      "Elle a scalé une marque retail de 0 à 200 boutiques et propose du mentorat. Elle sera à la sortie + afterwork de jeudi : le moment idéal pour parler scaling.",
    primaryAction: 'La voir jeudi',
  },
  {
    id: 4,
    name: 'Karim Haddad',
    match: 83,
    needBadge: 'Investit',
    runBadge: 'Court le fractionné',
    context: ['Investit en pré-seed / seed', 'Tickets 20–50k', 'Croisé au Run & Pitch'],
    reason:
      "Business angel ex-CFO, il investit en pré-seed/seed sur des fondateurs obsédés par leur problème — exactement ton profil de levée.",
    primaryAction: 'Demander une intro',
  },
  {
    id: 5,
    name: 'Inès Roy',
    match: 80,
    needBadge: 'Investit',
    runBadge: 'Sera au Run & Pitch',
    context: ['VC early-stage · B2B & climat', 'Présente jeudi', 'Partante pour un run'],
    reason:
      "VC early-stage sur le B2B : elle regarde des dossiers comme le tien et adore échanger en courant.",
    primaryAction: 'La voir jeudi',
  },
  {
    id: 6,
    name: 'Nadia Cherif',
    match: 76,
    needBadge: 'Mentor go-to-market',
    runBadge: 'Trail le week-end',
    context: ['Serial entrepreneuse · 1 revente', 'Mentor go-to-market', 'Croisée au défi 10 km'],
    reason:
      "3 boîtes lancées, 1 revente : elle accompagne sur le go-to-market et adore connecter les bonnes personnes.",
    primaryAction: 'Proposer une sortie',
  },
]

export const FILTERS = ['Tous', 'Cherche un associé', 'Recrute', 'Investit', 'Mentor']

export const MEMBERS = [
  { id: 'm1', name: 'Sarah Khalil', need: 'Lève une seed · ouverte à un associé produit', category: 'Cherche un associé', proximity: 'Court le dimanche · Seine' },
  { id: 'm2', name: 'Claire Moreau', need: 'Propose du mentorat scaling', category: 'Mentor', proximity: "Sera à l'event de jeudi" },
  { id: 'm3', name: 'Karim Haddad', need: 'Investit · tickets 20–50k', category: 'Investit', proximity: 'À 2 km · Issy-les-Moulineaux' },
  { id: 'm4', name: 'Léa Fontaine', need: 'Recrute un Head of Growth', category: 'Recrute', proximity: 'Croisée à la sortie de mardi' },
  { id: 'm5', name: 'Marc Dubois', need: 'Cherche un associé tech', category: 'Cherche un associé', proximity: 'À 3 km · Boulogne' },
  { id: 'm6', name: 'Inès Roy', need: 'Investit · pré-seed & seed', category: 'Investit', proximity: 'Sera au Run & Pitch jeudi' },
  { id: 'm7', name: 'Hugo Bernard', need: 'Recrute des profils tech & ops', category: 'Recrute', proximity: 'À 1,5 km · Paris 11e' },
  { id: 'm8', name: 'Nadia Cherif', need: 'Propose du mentorat go-to-market', category: 'Mentor', proximity: 'Croisée au défi 10 km' },
]

/* Profils détaillés (fiche ouverte en bottom-sheet) */
export const PEOPLE = {
  'Sarah Khalil': {
    title: 'Fondatrice · foodtech', location: 'Paris 10e',
    bio: "Je construis une marque foodtech bien-être. En pleine levée seed, je cherche à m'entourer côté produit. Je cours pour les idées.",
    looking: ['Associé produit', 'Conseils levée seed'], offering: ['Retours go-to-market', 'Réseau foodtech'],
    tags: ['Foodtech', 'Seed', 'Brand', 'Trail'], mutuals: ['Claire Moreau', 'Léa Fontaine', 'Marc Dubois'],
  },
  'Yanis Benali': {
    title: 'Lead dev freelance · React', location: 'Montreuil',
    bio: "Lead dev freelance, j'aide les fondateurs à sortir leur MVP vite et propre. React / Node / un peu de design.",
    looking: ['Missions MVP', 'Projets B2B'], offering: ['Dev React/Node', 'Architecture front'],
    tags: ['React', 'MVP', 'Freelance', '10 km'], mutuals: ['Hugo Bernard', 'Marc Dubois'],
  },
  'Claire Moreau': {
    title: 'Ex-directrice retail · mentor', location: 'Neuilly',
    bio: "J'ai scalé une marque retail de 0 à 200 boutiques. J'accompagne maintenant des fondateurs sur le scaling et l'ops.",
    looking: ['Fondateurs à mentorer'], offering: ['Mentorat scaling', 'Stratégie retail & ops'],
    tags: ['Scaling', 'Retail', 'Mentor', 'Ops'], mutuals: ['Sarah Khalil', 'Inès Roy', 'Léa Fontaine', 'Nadia Cherif'],
  },
  'Karim Haddad': {
    title: 'Business angel · ex-CFO', location: 'Issy-les-Moulineaux',
    bio: "Ex-CFO devenu business angel. J'investis en pré-seed/seed sur des fondateurs obsédés par leur problème. Tickets 20–50k.",
    looking: ['Deals pré-seed & seed'], offering: ['Investissement', 'Réseau finance & M&A'],
    tags: ['Angel', 'Finance', 'Seed', 'Fractionné'], mutuals: ['Hugo Bernard', 'Inès Roy'],
  },
  'Léa Fontaine': {
    title: 'CEO · marketplace mode', location: 'Paris 9e',
    bio: "CEO d'une marketplace mode en hypercroissance. Je recrute mon Head of Growth et j'adore parler acquisition.",
    looking: ['Head of Growth', 'Talents acquisition'], offering: ['Conseils marketplace', 'Réseau retail & mode'],
    tags: ['Marketplace', 'Growth', 'Mode', 'Recrute'], mutuals: ['Claire Moreau', 'Sarah Khalil', 'Nadia Cherif'],
  },
  'Marc Dubois': {
    title: 'Co-fondateur · fintech', location: 'Boulogne',
    bio: "Co-fondateur fintech, je cherche un associé tech pour accélérer. Je tiens le rythme sur les sorties longues.",
    looking: ['Associé tech / CTO'], offering: ['Vision produit', 'Réseau fintech'],
    tags: ['Fintech', 'Co-fondateur', 'Trail', 'Sortie longue'], mutuals: ['Yanis Benali', 'Nadia Cherif', 'Sarah Khalil'],
  },
  'Inès Roy': {
    title: 'Investisseuse · fonds early-stage', location: 'Paris 8e',
    bio: "VC early-stage. Je regarde le pré-seed et la seed sur le B2B et le climat. Toujours partante pour un café (ou un run).",
    looking: ['Fondateurs B2B & climat'], offering: ['Investissement', 'Intros LPs & fonds'],
    tags: ['VC', 'Early-stage', 'B2B', 'Run & Pitch'], mutuals: ['Karim Haddad', 'Claire Moreau'],
  },
  'Hugo Bernard': {
    title: 'DG · scale-up logistique', location: 'Paris 11e',
    bio: "Je dirige une scale-up logistique. On recrute fort côté tech & ops. Le fractionné, c'est ma thérapie du mardi.",
    looking: ['Profils tech & ops', 'Partenaires logistique'], offering: ['Conseils scale-up', 'Opportunités emploi'],
    tags: ['Logistique', 'Scale-up', 'Recrute', 'Fractionné'], mutuals: ['Yanis Benali', 'Karim Haddad'],
  },
  'Nadia Cherif': {
    title: 'Serial entrepreneuse', location: 'Vincennes',
    bio: "3 boîtes lancées, 1 revente. J'accompagne sur le go-to-market et j'adore connecter les bonnes personnes.",
    looking: ['Projets à conseiller'], offering: ['Mentorat go-to-market', 'Mises en relation'],
    tags: ['GTM', 'Mentor', 'Serial', 'Trail'], mutuals: ['Marc Dubois', 'Léa Fontaine', 'Claire Moreau'],
  },
}

export const OPPORTUNITIES = [
  { id: 'o1', icon: 'link', tone: 'indigo', who: 'Claire Moreau', detail: 't’a présenté à un mentor scaling.', time: 'Il y a 2 j' },
  { id: 'o2', icon: 'briefcase', tone: 'emerald', who: 'Yanis Benali', detail: 'discute de ton MVP React.', time: 'Il y a 3 j' },
  { id: 'o3', icon: 'trendingUp', tone: 'brand', who: 'Karim Haddad', detail: 'a demandé ton deck (seed).', time: 'Il y a 5 j' },
]

export function matchFor(name) {
  return SUGGESTIONS.find((s) => s.name === name) || null
}

export function personFor(name) {
  return (
    PEOPLE[name] || {
      title: 'Membre · Entrepreneurs Runners',
      location: 'Paris',
      bio: 'Membre de la communauté ROI.',
      looking: [],
      offering: [],
      tags: [],
      mutuals: [],
    }
  )
}
