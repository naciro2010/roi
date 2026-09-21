/* Ce que chaque dossard dit de son porteur — la matière des rencontres
   proposées (« Pour toi »). Chaque membre est décrit par ce qu'il cherche, ce
   qu'il apporte, ses sujets, sa façon de courir, son archétype. Le moteur
   (lib/matching.js) croise ces attributs avec les tiens ET avec ce que tu fais
   dans l'app (qui tu regardes, à qui tu écris) pour reclasser les fiches et
   expliquer chaque proposition : pourquoi vous, pourquoi maintenant.

   Taxonomie

   seeks / provides  → besoins & offres (complémentarité)
     capital · talent · cofounder · mentor · expertise · clients · intros
   topics            → centres de gravité (saas, fintech, growth, climat…)
   run               → { pace (min/km), window: 'am'|'pm'|'we', zone, distance }
   events            → sorties communes (clés internes, jamais affichées)
   archetype         → catégorie de la fiche (clé du « Pour toi »)
*/

export const ARCHETYPES = {
  investor: { label: 'Investisseurs', short: 'Investit', icon: 'trendingUp', tone: 'brand' },
  developer: { label: 'Profils tech', short: 'Tech', icon: 'cpu', tone: 'indigo' },
  mentor: { label: 'Dirigeants qui conseillent', short: 'Conseille', icon: 'compass', tone: 'amber' },
  founder: { label: 'Fondateurs comme toi', short: 'Fondateur', icon: 'rocket', tone: 'emerald' },
  operator: { label: 'Dirigeants qui recrutent', short: 'Recrute', icon: 'briefcase', tone: 'rose' },
}

/* Ton profil (dérivé de data/user.js, enrichi pour le score) : ce que tu
   cherches, ce que tu apportes, comment tu cours. */
export const ME = {
  seeks: ['capital', 'talent', 'expertise'],
  provides: ['expertise', 'intros'],
  topics: ['saas', 'b2b', 'product', 'fundraising', 'design'],
  run: { pace: 5.5, window: 'am', zone: 'seine', distance: 'long' },
  events: ['Sortie du jeudi'],
}

/* Attributs par membre (clé = nom, aligné sur data/network.js). */
export const PROFILES = {
  'Sarah Khalil': {
    archetype: 'founder',
    seeks: ['cofounder', 'expertise', 'capital'],
    provides: ['expertise', 'intros'],
    topics: ['foodtech', 'seed', 'brand', 'product', 'fundraising'],
    run: { pace: 5.3, window: 'am', zone: 'seine', distance: 'long' },
    events: ['Sortie du jeudi', 'Sortie du dimanche'],
  },
  'Yanis Benali': {
    archetype: 'developer',
    seeks: ['clients'],
    provides: ['talent', 'expertise'],
    topics: ['react', 'mvp', 'b2b', 'product'],
    run: { pace: 5.0, window: 'am', zone: 'canal', distance: 'tempo' },
    events: ['Sortie du dimanche'],
  },
  'Claire Moreau': {
    archetype: 'mentor',
    seeks: ['intros'],
    provides: ['mentor', 'expertise', 'intros'],
    topics: ['scaling', 'retail', 'ops', 'product'],
    run: { pace: 6.0, window: 'we', zone: 'ouest', distance: 'long' },
    events: ['Sortie du jeudi'],
  },
  'Karim Haddad': {
    archetype: 'investor',
    seeks: ['intros'],
    provides: ['capital', 'intros', 'expertise'],
    topics: ['finance', 'seed', 'saas', 'b2b'],
    run: { pace: 4.7, window: 'am', zone: 'ouest', distance: 'tempo' },
    events: ['Sortie du jeudi'],
  },
  'Léa Fontaine': {
    archetype: 'operator',
    seeks: ['talent'],
    provides: ['expertise', 'intros'],
    topics: ['marketplace', 'growth', 'mode', 'retail'],
    run: { pace: 5.4, window: 'am', zone: 'seine', distance: 'tempo' },
    events: [],
  },
  'Marc Dubois': {
    archetype: 'founder',
    seeks: ['cofounder', 'talent'],
    provides: ['expertise', 'intros'],
    topics: ['fintech', 'product', 'b2b'],
    run: { pace: 6.2, window: 'we', zone: 'vincennes', distance: 'long' },
    events: ['Sortie du dimanche'],
  },
  'Inès Roy': {
    archetype: 'investor',
    seeks: ['intros'],
    provides: ['capital', 'intros'],
    topics: ['b2b', 'climat', 'saas', 'seed'],
    run: { pace: 5.6, window: 'am', zone: 'seine', distance: 'tempo' },
    events: ['Sortie du jeudi'],
  },
  'Hugo Bernard': {
    archetype: 'operator',
    seeks: ['talent', 'intros'],
    provides: ['expertise', 'intros'],
    topics: ['logistique', 'scaling', 'ops'],
    run: { pace: 4.9, window: 'pm', zone: 'paris11', distance: 'tempo' },
    events: ['Sortie du dimanche'],
  },
  'Nadia Cherif': {
    archetype: 'mentor',
    seeks: ['intros'],
    provides: ['mentor', 'expertise', 'intros'],
    topics: ['gtm', 'growth', 'product', 'serial'],
    run: { pace: 6.1, window: 'we', zone: 'vincennes', distance: 'long' },
    events: ['Sortie du dimanche'],
  },
}

export function profileFor(name) {
  return (
    PROFILES[name] || {
      archetype: 'founder',
      seeks: [],
      provides: ['intros'],
      topics: [],
      run: { pace: 6, window: 'am', zone: 'paris', distance: 'tempo' },
      events: [],
    }
  )
}

/* Libellés des créneaux de course (pour expliquer une proposition). */
export const RUN_WINDOWS = { am: 'le matin', pm: 'en soirée', we: 'le week-end' }
export const RUN_ZONES = {
  seine: 'le long de la Seine',
  canal: 'le long du canal',
  vincennes: 'au Bois de Vincennes',
  ouest: 'à l’ouest parisien',
  paris11: 'dans Paris est',
  ouest_paris: 'à l’ouest',
  paris: 'dans Paris',
}
