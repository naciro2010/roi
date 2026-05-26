import { useState } from 'react'

/* ============================================================================
   ROI · Le réseau qui rapporte
   Front mobile-first — données fictives, aucune logique back-end.
   Toutes les données de démonstration sont regroupées ici.
   ========================================================================== */

const CURRENT_USER = {
  name: 'Thomas Lefèvre',
  title: 'Fondateur · SaaS B2B',
  role: 'Fondateur',
  company: 'Stealth · SaaS B2B',
  location: 'Paris 11e',
  community: 'Entrepreneurs Runners Paris',
  joined: 'Membre depuis mars 2025',
  bio: "Je construis un SaaS B2B (dashboard + onboarding). Je prépare une seed et je cours pour décompresser — souvent le long de la Seine.",
  needs: ['Un dev React pour mon MVP', 'Des conseils pour scaler'],
  offering: ['Retours produit', 'Mise en relation SaaS B2B'],
  interests: ['Levée de fonds', 'Product', 'Trail', 'Café & co-working', 'Design'],
  stats: { km: 42, sorties: 6, defis: 2 },
  roi: { score: 78, connections: 34, meetings: 12, opportunities: 5, weekDelta: 6 },
}

const SUGGESTIONS = [
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
]

const CHALLENGE = { title: 'Défi du mois', subtitle: '50 km en mai', current: 42, total: 50, daysLeft: 5 }

const LEADERBOARD = [
  { name: 'Marc Dubois', km: 64 },
  { name: 'Nadia Cherif', km: 58 },
  { name: 'Léa Fontaine', km: 51 },
  { name: 'Thomas Lefèvre', km: 42, me: true },
  { name: 'Sarah Khalil', km: 39 },
  { name: 'Yanis Benali', km: 34 },
]

const ACTIVITIES = [
  {
    id: 'a1',
    title: 'Sortie longue · Bords de Seine',
    day: 'Dimanche',
    time: '08:00',
    distance: '12 km',
    pace: '5:30 /km',
    level: 'Tous niveaux',
    place: 'Pont de l’Alma',
    organizer: 'Sarah Khalil',
    participants: 14,
    kudos: 23,
    attendees: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois'],
  },
  {
    id: 'a2',
    title: 'Run & Pitch · Canal Saint-Martin',
    day: 'Jeudi',
    time: '18:30',
    distance: '6 km',
    pace: '6:00 /km',
    level: 'Tous niveaux',
    place: 'Quai de Valmy',
    organizer: 'Claire Moreau',
    participants: 21,
    kudos: 31,
    tag: '+ afterwork',
    attendees: ['Claire Moreau', 'Inès Roy', 'Léa Fontaine'],
  },
  {
    id: 'a3',
    title: 'Fractionné · Parc de Bercy',
    day: 'Mardi',
    time: '19:00',
    distance: '8 km',
    pace: '4:45 /km',
    level: 'Confirmés',
    place: 'Parc de Bercy',
    organizer: 'Hugo Bernard',
    participants: 9,
    kudos: 15,
    attendees: ['Yanis Benali', 'Hugo Bernard', 'Karim Haddad'],
  },
  {
    id: 'a4',
    title: 'Trail découverte · Bois de Vincennes',
    day: 'Samedi',
    time: '09:30',
    distance: '15 km',
    pace: '6:15 /km',
    level: 'Intermédiaire',
    place: 'Château de Vincennes',
    organizer: 'Marc Dubois',
    participants: 7,
    kudos: 12,
    attendees: ['Marc Dubois', 'Nadia Cherif', 'Yanis Benali'],
  },
  {
    id: 'a5',
    title: 'Récup easy · Buttes-Chaumont',
    day: 'Lundi',
    time: '07:00',
    distance: '5 km',
    pace: '6:30 /km',
    level: 'Tous niveaux',
    place: 'Entrée Botzaris',
    organizer: 'Léa Fontaine',
    participants: 5,
    kudos: 8,
    attendees: ['Sarah Khalil', 'Léa Fontaine', 'Nadia Cherif'],
  },
]

const FILTERS = ['Tous', 'Cherche un associé', 'Recrute', 'Investit', 'Mentor']

const MEMBERS = [
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
const PEOPLE = {
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

const CONVERSATIONS = [
  { id: 'c1', name: 'Sarah Khalil', last: 'Top, on cale ça dimanche alors 🏃‍♀️', time: '09:12', unread: true },
  { id: 'c2', name: 'Yanis Benali', last: 'Je regarde ton repo ce soir et je te dis', time: 'Hier', unread: true },
  { id: 'c3', name: 'Claire Moreau', last: 'Avec plaisir, on en parle jeudi après la sortie', time: 'Hier', unread: false },
  { id: 'c4', name: 'Léa Fontaine', last: 'Ton profil m’intéresse pour le poste Growth', time: 'Lun.', unread: false },
  { id: 'c5', name: 'Karim Haddad', last: 'Envoie-moi ton deck, je regarde 👀', time: '23 mai', unread: false },
]

const THREADS = {
  c1: [
    { from: 'them', text: 'Salut Thomas ! J’ai vu qu’on courait tous les deux le dimanche 🙂' },
    { from: 'me', text: 'Salut Sarah ! Oui, sur les quais. Tu prépares une levée aussi non ?' },
    { from: 'them', text: 'Exactement, une seed. On échange nos pitchs en courant ?' },
    { from: 'me', text: 'Parfait. Dimanche 8h au pont de l’Alma ?' },
    { from: 'them', text: 'Top, on cale ça dimanche alors 🏃‍♀️' },
  ],
  c2: [
    { from: 'me', text: 'Hello Yanis, je cherche un dev React pour mon MVP, tu prends des missions ?' },
    { from: 'them', text: 'Yes carrément, parle-moi du projet' },
    { from: 'me', text: 'SaaS B2B : dashboard + onboarding. Dispo sur 2-3 semaines ?' },
    { from: 'them', text: 'Je regarde ton repo ce soir et je te dis' },
  ],
  c3: [
    { from: 'me', text: 'Bonjour Claire, j’aimerais beaucoup avoir vos conseils sur le scaling.' },
    { from: 'them', text: 'Avec plaisir, on en parle jeudi après la sortie' },
  ],
  c4: [
    { from: 'them', text: 'Ton profil m’intéresse pour le poste Growth' },
    { from: 'me', text: 'Merci ! Je suis plutôt côté fondateur, mais je connais des gens 🙂' },
  ],
  c5: [
    { from: 'me', text: 'Bonjour Karim, je lève une seed pour mon SaaS B2B.' },
    { from: 'them', text: 'Envoie-moi ton deck, je regarde 👀' },
  ],
}

const GROUPS = [
  {
    id: 'g1',
    name: 'Seine Sunday Runners',
    topic: 'Sorties longues du dimanche · Paris',
    members: 128,
    avatars: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois'],
    time: '09:40',
    unread: 3,
  },
  {
    id: 'g2',
    name: 'Founders & Seed',
    topic: 'Levée de fonds, pitch & deals',
    members: 56,
    avatars: ['Karim Haddad', 'Inès Roy', 'Sarah Khalil'],
    time: 'Hier',
    unread: 0,
  },
  {
    id: 'g3',
    name: 'React & MVP Builders',
    topic: 'Tech, freelances & side-projects',
    members: 41,
    avatars: ['Yanis Benali', 'Hugo Bernard'],
    time: 'Mar.',
    unread: 0,
  },
]

const GROUP_THREADS = {
  g1: [
    { from: 'Claire Moreau', text: 'Hello la team ! Qui est chaud pour la sortie longue dimanche ?' },
    { from: 'Marc Dubois', text: '12 km le long de la Seine, ça me va 🙌' },
    { from: 'me', text: 'Présent. On part d’où exactement ?' },
    { from: 'Sarah Khalil', text: 'RDV 8h pont de l’Alma 🏃‍♀️ on pitchera en courant' },
  ],
  g2: [
    { from: 'Inès Roy', text: 'Je partage un template de deck qui convertit bien 📊' },
    { from: 'Karim Haddad', text: 'Top. Pensez aussi à un one-pager metrics.' },
    { from: 'me', text: 'Merci ! Je vous envoie le mien pour feedback.' },
  ],
  g3: [
    { from: 'Yanis Benali', text: 'Qui est chaud pour un coworking jeudi aprem ?' },
    { from: 'Hugo Bernard', text: 'Moi si c’est près de République 👍' },
    { from: 'me', text: 'Je peux ramener le café ☕' },
  ],
}

const GROUP_SUGGESTIONS = [
  { id: 'gs1', name: 'Trail Runners IDF', topic: 'Sorties trail le week-end', members: 92, avatars: ['Marc Dubois', 'Nadia Cherif'] },
  { id: 'gs2', name: 'Growth & Marketplace', topic: 'Acquisition, SEO, marketplaces', members: 64, avatars: ['Léa Fontaine', 'Nadia Cherif'] },
]

const NOTIFICATIONS = [
  { id: 'n1', icon: 'check', tone: 'emerald', text: 'Sarah Khalil a accepté ta demande de contact.', time: 'Il y a 2 h', unread: true },
  { id: 'n2', icon: 'sparkles', tone: 'brand', text: '3 nouveaux matchs t’attendent cette semaine.', time: 'Ce matin', unread: true },
  { id: 'n3', icon: 'calendar', tone: 'indigo', text: 'Rappel : Run & Pitch jeudi 18h30 au Canal.', time: 'Hier', unread: false },
  { id: 'n4', icon: 'heart', tone: 'rose', text: 'Yanis Benali a aimé ta sortie longue.', time: 'Hier', unread: false },
  { id: 'n5', icon: 'trophy', tone: 'amber', text: 'Tu es 4e du défi du mois 🔥 plus que 8 km.', time: '2 j', unread: false },
]

const OPPORTUNITIES = [
  { id: 'o1', icon: 'link', tone: 'indigo', who: 'Claire Moreau', detail: 't’a présenté à un mentor scaling.', time: 'Il y a 2 j' },
  { id: 'o2', icon: 'briefcase', tone: 'emerald', who: 'Yanis Benali', detail: 'discute de ton MVP React.', time: 'Il y a 3 j' },
  { id: 'o3', icon: 'trendingUp', tone: 'brand', who: 'Karim Haddad', detail: 'a demandé ton deck (seed).', time: 'Il y a 5 j' },
]

/* ============================================================================
   UTILITAIRES & PETITS COMPOSANTS
   ========================================================================== */

// Teintes d'avatar sobres et désaturées (aucune couleur flashy).
const AVATAR_TINTS = [
  'bg-slate-200 text-slate-700',
  'bg-stone-200 text-stone-700',
  'bg-zinc-200 text-zinc-700',
  'bg-[#DDE3F1] text-[#3C455B]',
  'bg-[#DCE6DD] text-[#3F5A45]',
  'bg-[#E7DDD4] text-[#6B5544]',
  'bg-[#E2DBE6] text-[#574A60]',
  'bg-[#D9E2E6] text-[#3F5560]',
]

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function hashOf(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h
}

function tintFor(name) {
  return AVATAR_TINTS[hashOf(name) % AVATAR_TINTS.length]
}

function personFor(name) {
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

const AVATAR_SIZES = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-24 h-24 text-3xl',
}

function Avatar({ name, size = 'md', ring = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`${AVATAR_SIZES[size]} ${tintFor(name)} ${
        ring ? 'ring-2 ring-white' : ''
      } ${onClick ? 'tap' : ''} relative shrink-0 rounded-full grid place-items-center font-bold select-none`}
    >
      {initials(name)}
    </Tag>
  )
}

function AvatarStack({ names, total, onMore }) {
  const extra = total - names.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {names.map((n) => (
          <Avatar key={n} name={n} size="sm" ring />
        ))}
      </div>
      {extra > 0 && (
        <button
          onClick={onMore}
          className="ml-2 grid h-9 min-w-9 place-items-center rounded-full border-2 border-white bg-ink-100 px-1 text-xs font-bold text-ink-500"
        >
          +{extra}
        </button>
      )}
    </div>
  )
}

const PILL_TONES = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-[#E4EDE7] text-[#3C5A48]',
  indigo: 'bg-[#E3E1F0] text-[#46406E]',
  amber: 'bg-[#EFE7D8] text-[#6B5734]',
  rose: 'bg-[#F0E1E3] text-[#7A4650]',
  ink: 'bg-ink-100 text-ink-600',
}

const DOT_TONES = {
  brand: 'bg-brand-500',
  emerald: 'bg-[#3F7559]',
  indigo: 'bg-[#5B5191]',
  amber: 'bg-[#9A7B3A]',
  rose: 'bg-[#9A5560]',
  ink: 'bg-ink-400',
}

function Badge({ tone = 'brand', dot = true, children }) {
  return (
    <span className={`${PILL_TONES[tone]} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]}`} />}
      {children}
    </span>
  )
}

const ICON_PATHS = {
  sparkles: 'M11 3l1.6 5.4L18 10l-5.4 1.6L11 17l-1.6-5.4L4 10l5.4-1.6z',
  activity: 'M3 12h4l3 8 4-16 3 8h4',
  chat: 'M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z',
  arrowLeft: 'M15 18l-6-6 6-6',
  pencil: 'M4 20h4L18 10l-4-4L4 16zM14 6l4 4',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  x: 'M6 6l12 12M18 6 6 18',
  route: 'M9 18h6a3 3 0 0 0 3-3V9',
  flame: 'M12 3c1 3-1.5 4-1.5 6.5A3.5 3.5 0 0 0 14 13c0-1 .5-2 .5-2 1 1.5 1.5 3 1.5 4a4 4 0 1 1-8 0c0-3 2.5-4 4-12z',
  home: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  briefcase: 'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3',
  trendingUp: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  check: 'M20 6 9 17l-5-5',
  chevronRight: 'M9 18l6-6-6-6',
  star: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9z',
  zap: 'M13 2 3 14h7l-1 8 10-12h-7l1-8z',
  link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
}

function Icon({ name, className = 'w-5 h-5', filled = false }) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke} fill={filled ? 'currentColor' : 'none'}>
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18z" />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    )
  }
  if (name === 'compass') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M16 8l-2 6-6 2 2-6z" />
      </svg>
    )
  }
  if (name === 'mapPin') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <path d="M12 22s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }
  if (name === 'target') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} fill={filled ? 'currentColor' : 'none'}>
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

function ProgressBar({ value, total, className = 'bg-white/30', barClassName = 'bg-white' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${className}`}>
      <div className={`h-full rounded-full ${barClassName} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function ProgressRing({ value, size = 76, stroke = 8, track = 'rgba(255,255,255,0.18)', color = '#fff', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, value))
  const offset = c - (pct / 100) * c
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
        <Icon name="zap" className="h-4 w-4" filled />
      </span>
      <span className={`text-[22px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
        R<span className="text-brand-500">O</span>I
      </span>
    </div>
  )
}

function SectionTitle({ children, action, onAction }) {
  return (
    <div className="mb-2.5 flex items-end justify-between">
      <h2 className="text-base font-bold text-ink-900">{children}</h2>
      {action && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 tap">
          {action}
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function MatchRing({ value, size = 44 }) {
  return (
    <ProgressRing value={value} size={size} stroke={4} track="rgba(79,96,160,0.14)" color="#4F60A0">
      <div className="text-[11px] font-extrabold text-brand-700">{value}</div>
    </ProgressRing>
  )
}

/* ============================================================================
   NAVIGATION
   ========================================================================== */

const TABS = [
  { id: 'accueil', label: 'Accueil', icon: 'home' },
  { id: 'reseau', label: 'Réseau', icon: 'sparkles' },
  { id: 'events', label: 'Agenda', icon: 'calendar' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'profil', label: 'Profil', icon: 'user' },
]

function BottomNav({ active, onChange, unread }) {
  return (
    <nav className="glass z-20 shrink-0 border-t border-ink-100 px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
      <div className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 tap"
            >
              <span className={`relative grid h-8 w-8 place-items-center rounded-xl transition-colors ${isActive ? 'bg-brand-light text-brand-600' : 'text-ink-400'}`}>
                <Icon name={tab.icon} className="h-[22px] w-[22px]" filled={isActive && tab.icon === 'sparkles'} />
                {tab.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unread}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-brand-700' : 'text-ink-400'}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ============================================================================
   APPLICATION
   ========================================================================== */

export default function App() {
  const [tab, setTab] = useState('accueil')
  const [toast, setToast] = useState(null)

  // Réseau (segments)
  const [netView, setNetView] = useState('suggestions')
  const [sentSuggestions, setSentSuggestions] = useState({})
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [contacted, setContacted] = useState({})

  // Agenda
  const [kudos, setKudos] = useState(Object.fromEntries(ACTIVITIES.map((a) => [a.id, { count: a.kudos, liked: false }])))
  const [joined, setJoined] = useState({})

  // Messages
  const [msgView, setMsgView] = useState('discussions')
  const [openConv, setOpenConv] = useState(null)
  const [threads, setThreads] = useState(THREADS)
  const [draft, setDraft] = useState('')
  const [convRead, setConvRead] = useState({})

  // Groupes
  const [groups, setGroups] = useState(GROUPS)
  const [groupThreads, setGroupThreads] = useState(GROUP_THREADS)
  const [openGroup, setOpenGroup] = useState(null)
  const [groupRead, setGroupRead] = useState({})
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [joinedGroups, setJoinedGroups] = useState({})

  // Profil
  const [needs, setNeeds] = useState(CURRENT_USER.needs)
  const [editingNeeds, setEditingNeeds] = useState(false)
  const [needsDraft, setNeedsDraft] = useState(CURRENT_USER.needs)

  // Overlays
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [member, setMember] = useState(null) // nom du membre ouvert en fiche

  const unreadConv = CONVERSATIONS.filter((c) => c.unread && !convRead[c.id]).length
  const unreadGroups = groups.filter((g) => g.unread > 0 && !groupRead[g.id]).length
  const unreadNotif = notifs.filter((n) => n.unread).length
  const navUnread = unreadConv + unreadGroups

  /* ----------------------------------------------------------------- helpers */

  function showToast(msg) {
    setToast({ msg, key: Date.now() })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 1900)
  }

  function goTo(t) {
    setTab(t)
    setOpenConv(null)
    setOpenGroup(null)
  }

  function toggleKudos(id) {
    setKudos((prev) => {
      const cur = prev[id]
      return { ...prev, [id]: { count: cur.count + (cur.liked ? -1 : 1), liked: !cur.liked } }
    })
  }

  function toggleJoin(id) {
    setJoined((prev) => {
      const next = !prev[id]
      showToast(next ? 'Inscription confirmée ✓' : 'Inscription annulée')
      return { ...prev, [id]: next }
    })
  }

  function openChat(id) {
    setOpenConv(id)
    setOpenGroup(null)
    setConvRead((r) => ({ ...r, [id]: true }))
  }

  function openGroupChat(id) {
    setOpenGroup(id)
    setOpenConv(null)
    setGroupRead((r) => ({ ...r, [id]: true }))
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text) return
    if (openGroup) {
      setGroupThreads((prev) => ({ ...prev, [openGroup]: [...prev[openGroup], { from: 'me', text }] }))
    } else if (openConv) {
      setThreads((prev) => ({ ...prev, [openConv]: [...prev[openConv], { from: 'me', text }] }))
    } else {
      return
    }
    setDraft('')
  }

  function createGroup() {
    const name = newGroupName.trim()
    if (!name) return
    const id = `g-${Date.now()}`
    setGroups((gs) => [
      { id, name, topic: 'Nouveau groupe · privé', members: 1, avatars: [CURRENT_USER.name], time: 'maintenant', unread: 0 },
      ...gs,
    ])
    setGroupThreads((t) => ({ ...t, [id]: [] }))
    setJoinedGroups((j) => ({ ...j, [id]: true }))
    setNewGroupName('')
    setCreatingGroup(false)
    showToast('Groupe créé ✓')
    openGroupChat(id)
  }

  function startEditNeeds() {
    setNeedsDraft(needs)
    setEditingNeeds(true)
  }

  function saveNeeds() {
    const cleaned = needsDraft.map((n) => n.trim()).filter(Boolean)
    setNeeds(cleaned.length ? cleaned : ['—'])
    setEditingNeeds(false)
    showToast('Besoin mis à jour ✓')
  }

  function contactMember(name) {
    setContacted((c) => ({ ...c, [name]: true }))
    showToast('Demande envoyée ✓')
  }

  /* ------------------------------------------------------------------- ÉCRANS */

  function renderAccueil() {
    const u = CURRENT_USER
    const top = SUGGESTIONS[0]
    const nextEvent = ACTIVITIES[0]
    const hour = new Date().getHours()
    const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

    const miniStats = [
      { label: 'Connexions', value: u.roi.connections, icon: 'users' },
      { label: 'RDV pris', value: u.roi.meetings, icon: 'calendar' },
      { label: 'Opportunités', value: u.roi.opportunities, icon: 'briefcase' },
    ]

    return (
      <div className="animate-screenIn space-y-5 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
        {/* HERO — score réseau */}
        <section className="relative overflow-hidden rounded-[28px] bg-ink-950 p-5 text-white shadow-float">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium capitalize text-white/60">{today}</p>
                <h1 className="mt-0.5 text-2xl font-extrabold leading-tight">
                  {greet}, {u.name.split(' ')[0]} 👋
                </h1>
              </div>
              <Avatar name={u.name} size="md" ring onClick={() => goTo('profil')} />
            </div>

            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={u.roi.score} size={92} stroke={9} color="#AEB8D6" track="rgba(255,255,255,0.14)">
                <div>
                  <div className="text-2xl font-extrabold leading-none">{u.roi.score}</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wide text-white/55">Score</div>
                </div>
              </ProgressRing>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  Score réseau
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] font-bold text-[#AEC6B5]">
                    <Icon name="trendingUp" className="h-3 w-3" /> +{u.roi.weekDelta}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                  Ton réseau progresse fort cette semaine. Continue : 2 actions et tu passes 80.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {miniStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/[0.07] p-3 ring-1 ring-white/10">
                  <Icon name={s.icon} className="h-4 w-4 text-white/55" />
                  <div className="mt-1.5 text-xl font-extrabold leading-none">{s.value}</div>
                  <div className="mt-1 text-[11px] font-medium text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* À ne pas manquer */}
        <section>
          <SectionTitle action="Tout voir" onAction={() => goTo('reseau')}>
            À ne pas manquer
          </SectionTitle>

          {/* Top match */}
          <button
            onClick={() => setMember(top.name)}
            className="mb-2.5 flex w-full items-center gap-3 rounded-3xl border border-ink-100 bg-white p-3.5 text-left shadow-soft tap"
          >
            <Avatar name={top.name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-600">
                <Icon name="sparkles" className="h-3 w-3" filled /> Match du jour
              </div>
              <div className="mt-0.5 truncate font-bold text-ink-900">{top.name}</div>
              <div className="truncate text-[13px] text-ink-500">{personFor(top.name).title}</div>
            </div>
            <MatchRing value={top.match} />
          </button>

          {/* Next event */}
          <button
            onClick={() => goTo('events')}
            className="flex w-full items-center gap-3 rounded-3xl border border-ink-100 bg-white p-3.5 text-left shadow-soft tap"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon name="calendar" className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                <Icon name="clock" className="h-3 w-3" /> Prochaine sortie
              </div>
              <div className="mt-0.5 truncate font-bold text-ink-900">{nextEvent.title}</div>
              <div className="truncate text-[13px] text-ink-500">
                {nextEvent.day} {nextEvent.time} · {nextEvent.distance}
              </div>
            </div>
            <Icon name="chevronRight" className="h-5 w-5 text-ink-300" />
          </button>
        </section>

        {/* Opportunités récentes */}
        <section>
          <SectionTitle>Tes opportunités récentes</SectionTitle>
          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
            {OPPORTUNITIES.map((o, i) => (
              <button
                key={o.id}
                onClick={() => setMember(o.who)}
                className={`flex w-full items-center gap-3 px-3.5 py-3 text-left tap ${i > 0 ? 'border-t border-ink-100' : ''}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[o.tone]}`}>
                  <Icon name={o.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-ink-800">
                    <span className="font-bold text-ink-900">{o.who}</span> {o.detail}
                  </p>
                  <p className="text-[11px] text-ink-400">{o.time}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Défi du mois mini */}
        <button
          onClick={() => goTo('events')}
          className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-ink-950 p-4 text-left text-white shadow-float tap"
        >
          <ProgressRing value={(CHALLENGE.current / CHALLENGE.total) * 100} size={56} stroke={6} color="#AEB8D6" track="rgba(255,255,255,0.18)">
            <Icon name="flame" className="h-5 w-5" filled />
          </ProgressRing>
          <div className="flex-1">
            <div className="font-bold">{CHALLENGE.title} · {CHALLENGE.subtitle}</div>
            <div className="text-[13px] text-white/80">
              {CHALLENGE.current}/{CHALLENGE.total} km · plus que {CHALLENGE.daysLeft} jours
            </div>
          </div>
          <Icon name="chevronRight" className="h-5 w-5 text-white/70" />
        </button>
      </div>
    )
  }

  function renderReseau() {
    const list = MEMBERS.filter((m) => {
      const okFilter = filter === 'Tous' || m.category === filter
      const q = query.trim().toLowerCase()
      const okQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.need.toLowerCase().includes(q) ||
        personFor(m.name).title.toLowerCase().includes(q)
      return okFilter && okQuery
    })

    return (
      <div className="animate-screenIn flex h-full flex-col">
        <div className="px-5 pb-1 pt-4">
          <h1 className="text-2xl font-extrabold text-ink-900">Réseau</h1>
          <p className="mt-0.5 text-sm text-ink-500">Les bonnes personnes, au bon moment.</p>

          {/* Segmented control */}
          <div className="mt-4 flex gap-1 rounded-2xl bg-ink-100 p-1">
            {[
              { id: 'suggestions', label: 'Matchs' },
              { id: 'annuaire', label: 'Annuaire' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setNetView(s.id)}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition tap ${
                  netView === s.id ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {netView === 'suggestions' ? (
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
            <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-light/60 p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                <Icon name="sparkles" className="h-4 w-4" filled />
              </span>
              <div>
                <p className="text-[13px] font-bold text-ink-900">3 personnes à rencontrer cette semaine</p>
                <p className="text-[12px] text-ink-500">Basé sur tes besoins, tes sorties et tes connexions.</p>
              </div>
            </div>

            {SUGGESTIONS.map((p) => {
              const sent = sentSuggestions[p.id]
              return (
                <article key={p.id} className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
                  <div className="flex items-center gap-3 p-4 pb-3">
                    <Avatar name={p.name} size="lg" onClick={() => setMember(p.name)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-ink-900">{p.name}</div>
                      <div className="truncate text-sm text-ink-500">{personFor(p.name).title}</div>
                    </div>
                    <MatchRing value={p.match} size={48} />
                  </div>

                  <div className="flex flex-wrap gap-2 px-4">
                    <Badge tone="brand">{p.needBadge}</Badge>
                    <Badge tone="emerald">{p.runBadge}</Badge>
                  </div>

                  <div className="mx-4 mt-3 space-y-1.5 rounded-2xl bg-ink-50 p-3">
                    {p.context.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-[13px] text-ink-700">
                        <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-[#3F7559]" />
                        {c}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 p-4">
                    <button
                      onClick={() => {
                        setSentSuggestions((s) => ({ ...s, [p.id]: true }))
                        showToast('Demande envoyée ✓')
                      }}
                      className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white tap ${
                        sent ? 'bg-[#3F7559]' : 'bg-brand-500 shadow-brand hover:bg-brand-600'
                      }`}
                    >
                      {sent ? 'Demande envoyée ✓' : p.primaryAction}
                    </button>
                    <button
                      onClick={() => setMember(p.name)}
                      className="rounded-2xl border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-600 tap"
                    >
                      Profil
                    </button>
                  </div>
                </article>
              )
            })}

            <p className="pt-1 text-center text-xs text-ink-400">De nouveaux matchs chaque lundi matin ☕</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search */}
            <div className="px-5 pt-3">
              <div className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-200">
                <Icon name="search" className="h-4 w-4 text-ink-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un membre, un besoin…"
                  className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-ink-400 tap">
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition tap ${
                    filter === f ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-2">
              <p className="text-xs font-medium text-ink-400">{list.length} membre{list.length > 1 ? 's' : ''}</p>
              {list.map((m) => (
                <article
                  key={m.id}
                  className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft"
                >
                  <button onClick={() => setMember(m.name)} className="flex w-full items-center gap-3 text-left tap">
                    <Avatar name={m.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-ink-900">{m.name}</div>
                      <div className="truncate text-sm text-ink-500">{personFor(m.name).title}</div>
                    </div>
                    <Icon name="chevronRight" className="h-5 w-5 text-ink-300" />
                  </button>
                  <p className="mt-3 text-sm font-semibold text-brand-700">{m.need}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                    <Icon name="mapPin" className="h-3.5 w-3.5" />
                    {m.proximity}
                  </div>
                  <button
                    onClick={() => contactMember(m.name)}
                    className={`mt-3 w-full rounded-2xl py-2.5 text-sm font-bold tap ${
                      contacted[m.name] ? 'bg-[#3F7559] text-white' : 'border border-brand-300 text-brand-700 hover:bg-brand-light'
                    }`}
                  >
                    {contacted[m.name] ? 'Demande envoyée ✓' : 'Entrer en contact'}
                  </button>
                </article>
              ))}
              {list.length === 0 && (
                <div className="grid place-items-center py-16 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-400">
                    <Icon name="search" className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink-600">Aucun résultat</p>
                  <p className="text-xs text-ink-400">Essaie un autre filtre ou mot-clé.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderEvents() {
    const pct = Math.round((CHALLENGE.current / CHALLENGE.total) * 100)
    return (
      <div className="animate-screenIn space-y-5 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Agenda</h1>
          <p className="mt-0.5 text-sm text-ink-500">Cours, rencontre, avance.</p>
        </div>

        {/* Défi + leaderboard */}
        <section className="overflow-hidden rounded-[28px] bg-ink-950 text-white shadow-float">
          <div className="relative overflow-hidden p-5">
            <div className="absolute inset-0 bg-hero-glow" />
            <div className="relative flex items-center gap-4">
              <ProgressRing value={pct} size={84} stroke={9} color="#AEB8D6" track="rgba(255,255,255,0.14)">
                <div>
                  <div className="text-xl font-extrabold leading-none">{pct}%</div>
                </div>
              </ProgressRing>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <Icon name="flame" className="h-4 w-4 text-brand-400" filled /> {CHALLENGE.title}
                </div>
                <div className="text-2xl font-extrabold">{CHALLENGE.subtitle}</div>
                <div className="mt-1 text-[13px] text-white/65">
                  {CHALLENGE.current} km · plus que {CHALLENGE.total - CHALLENGE.current} km en {CHALLENGE.daysLeft} jours
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="border-t border-white/10 px-5 py-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/55">
              <Icon name="trophy" className="h-3.5 w-3.5" /> Classement
            </div>
            <div className="space-y-1">
              {LEADERBOARD.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${p.me ? 'bg-brand-500/20 ring-1 ring-brand-400/40' : ''}`}
                >
                  <span className={`w-5 text-center text-sm font-bold ${i < 3 ? 'text-brand-400' : 'text-white/40'}`}>{i + 1}</span>
                  <Avatar name={p.name} size="xs" />
                  <span className={`flex-1 truncate text-sm ${p.me ? 'font-bold text-white' : 'text-white/80'}`}>
                    {p.name} {p.me && <span className="text-brand-300">· toi</span>}
                  </span>
                  <span className="text-sm font-bold text-white/90">{p.km} km</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionTitle>Sorties à venir</SectionTitle>

        <div className="space-y-3">
          {ACTIVITIES.map((a) => {
            const k = kudos[a.id]
            const isJoined = joined[a.id]
            return (
              <article key={a.id} className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
                <div className="flex items-stretch">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-ink-50 py-3 text-center">
                    <span className="text-[11px] font-bold uppercase text-brand-600">{a.day.slice(0, 3)}</span>
                    <span className="text-lg font-extrabold leading-none text-ink-900">{a.time.slice(0, 2)}</span>
                    <span className="text-[11px] text-ink-400">{a.time.slice(2)}</span>
                  </div>
                  <div className="min-w-0 flex-1 p-4">
                    <h3 className="font-bold leading-tight text-ink-900">{a.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-ink-500">
                      <span className="inline-flex items-center gap-1"><Icon name="route" className="h-3.5 w-3.5" /> {a.distance}</span>
                      <span className="text-ink-300">·</span>
                      <span>{a.pace}</span>
                      <span className="text-ink-300">·</span>
                      <span>{a.level}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-400">
                      <Icon name="mapPin" className="h-3.5 w-3.5" /> {a.place}
                      {a.tag && <span className="ml-1 font-bold text-brand-600">{a.tag}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 pb-3">
                  <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrits`)} />
                  <button
                    onClick={() => toggleKudos(a.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                      k.liked ? 'bg-[#F0E1E3] text-[#9A5560]' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    <Icon name="heart" className="h-4 w-4" filled={k.liked} />
                    {k.count}
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleJoin(a.id)}
                    className={`w-full rounded-2xl py-2.5 text-sm font-bold tap ${
                      isJoined ? 'bg-[#3F7559] text-white' : 'bg-ink-900 text-white hover:bg-ink-800'
                    }`}
                  >
                    {isJoined ? 'Inscrit ✓' : 'Je participe'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  function ChatComposer({ placeholder }) {
    return (
      <div className="glass flex shrink-0 items-center gap-2 border-t border-ink-100 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          onClick={sendMessage}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-brand tap disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <Icon name="send" className="h-5 w-5" />
        </button>
      </div>
    )
  }

  function renderMessages() {
    /* --- Chat 1:1 --- */
    if (openConv) {
      const conv = CONVERSATIONS.find((c) => c.id === openConv)
      const msgs = threads[openConv]
      return (
        <div className="flex h-full flex-col bg-ink-50">
          <div className="glass z-10 flex shrink-0 items-center gap-3 border-b border-ink-100 px-3 py-3">
            <button onClick={() => { setOpenConv(null); setDraft('') }} className="rounded-full p-1.5 text-ink-500 tap">
              <Icon name="arrowLeft" className="h-6 w-6" />
            </button>
            <Avatar name={conv.name} size="sm" onClick={() => setMember(conv.name)} />
            <button onClick={() => setMember(conv.name)} className="min-w-0 text-left">
              <div className="truncate font-bold text-ink-900">{conv.name}</div>
              <div className="truncate text-[11px] text-[#3F7559]">● En ligne</div>
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                    m.from === 'me' ? 'rounded-br-md bg-brand-500 text-white' : 'rounded-bl-md border border-ink-100 bg-white text-ink-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {ChatComposer({ placeholder: 'Écris un message…' })}
        </div>
      )
    }

    /* --- Chat de groupe --- */
    if (openGroup) {
      const grp = groups.find((g) => g.id === openGroup)
      const msgs = groupThreads[openGroup] || []
      return (
        <div className="flex h-full flex-col bg-ink-50">
          <div className="glass z-10 flex shrink-0 items-center gap-3 border-b border-ink-100 px-3 py-3">
            <button onClick={() => { setOpenGroup(null); setDraft('') }} className="rounded-full p-1.5 text-ink-500 tap">
              <Icon name="arrowLeft" className="h-6 w-6" />
            </button>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-900 text-white">
              <Icon name="users" className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-ink-900">{grp.name}</div>
              <div className="truncate text-[11px] text-ink-400">{grp.members} membres</div>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar px-4 py-4">
            {msgs.length === 0 && (
              <p className="py-10 text-center text-sm text-ink-400">Lance la discussion du groupe 👋</p>
            )}
            {msgs.map((m, i) => {
              const mine = m.from === 'me'
              const showName = !mine && msgs[i - 1]?.from !== m.from
              return (
                <div key={i} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && (
                    <div className="w-7 shrink-0">
                      {msgs[i + 1]?.from !== m.from && <Avatar name={m.from} size="xs" onClick={() => setMember(m.from)} />}
                    </div>
                  )}
                  <div className="max-w-[76%]">
                    {showName && <div className="mb-0.5 ml-1 text-[11px] font-bold text-ink-500">{m.from.split(' ')[0]}</div>}
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                        mine ? 'rounded-br-md bg-brand-500 text-white' : 'rounded-bl-md border border-ink-100 bg-white text-ink-800'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {ChatComposer({ placeholder: `Message à ${grp.name}…` })}
        </div>
      )
    }

    /* --- Liste : Discussions / Groupes --- */
    return (
      <div className="animate-screenIn flex h-full flex-col">
        <div className="px-5 pb-1 pt-4">
          <h1 className="text-2xl font-extrabold text-ink-900">Messages</h1>
          <div className="mt-4 flex gap-1 rounded-2xl bg-ink-100 p-1">
            {[
              { id: 'discussions', label: 'Discussions', n: unreadConv },
              { id: 'groupes', label: 'Groupes', n: unreadGroups },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setMsgView(s.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition tap ${
                  msgView === s.id ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'
                }`}
              >
                {s.label}
                {s.n > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{s.n}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {msgView === 'discussions' ? (
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 pt-2">
            {CONVERSATIONS.map((c) => {
              const last = threads[c.id][threads[c.id].length - 1]
              const unread = c.unread && !convRead[c.id]
              return (
                <button
                  key={c.id}
                  onClick={() => openChat(c.id)}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left tap hover:bg-ink-50"
                >
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold text-ink-900">{c.name}</span>
                      <span className={`shrink-0 text-xs ${unread ? 'font-bold text-brand-600' : 'text-ink-400'}`}>{c.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${unread ? 'font-semibold text-ink-700' : 'text-ink-400'}`}>
                        {last.from === 'me' ? 'Toi : ' : ''}
                        {last.text}
                      </span>
                      {unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-3">
            {/* Créer un groupe */}
            {creatingGroup ? (
              <div className="mb-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-3">
                <input
                  autoFocus
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                  placeholder="Nom du groupe…"
                  className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={createGroup} className="flex-1 rounded-xl bg-brand-500 py-2 text-sm font-bold text-white tap">Créer</button>
                  <button onClick={() => { setCreatingGroup(false); setNewGroupName('') }} className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-600 tap">Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setCreatingGroup(true)} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-ink-300 px-3 py-3 text-left tap hover:bg-ink-50">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name="plus" className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-ink-900">Créer un groupe</div>
                  <div className="text-xs text-ink-400">Rassemble ta team ou ton club</div>
                </div>
              </button>
            )}

            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-400">Mes groupes</p>
            <div className="space-y-1">
              {groups.map((g) => {
                const thread = groupThreads[g.id] || []
                const last = thread[thread.length - 1]
                const unread = g.unread > 0 && !groupRead[g.id]
                return (
                  <button
                    key={g.id}
                    onClick={() => openGroupChat(g.id)}
                    className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left tap hover:bg-ink-50"
                  >
                    <div className="relative">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-900 text-white">
                        <Icon name="users" className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold text-ink-900">{g.name}</span>
                        <span className={`shrink-0 text-xs ${unread ? 'font-bold text-brand-600' : 'text-ink-400'}`}>{g.time}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${unread ? 'font-semibold text-ink-700' : 'text-ink-400'}`}>
                          {last ? `${last.from === 'me' ? 'Toi' : last.from.split(' ')[0]} : ${last.text}` : g.topic}
                        </span>
                        {unread ? (
                          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{g.unread}</span>
                        ) : (
                          <span className="shrink-0 text-[11px] text-ink-300">{g.members} membres</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-ink-400">À découvrir</p>
            <div className="space-y-2">
              {GROUP_SUGGESTIONS.map((g) => (
                <div key={g.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-100 text-ink-500">
                    <Icon name="users" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-ink-900">{g.name}</div>
                    <div className="truncate text-xs text-ink-400">{g.topic} · {g.members} membres</div>
                  </div>
                  <button
                    onClick={() => {
                      if (joinedGroups[g.id]) return
                      setJoinedGroups((j) => ({ ...j, [g.id]: true }))
                      setGroups((gs) => [...gs, { ...g, members: g.members + 1, time: 'maintenant', unread: 0 }])
                      setGroupThreads((t) => ({ ...t, [g.id]: t[g.id] || [] }))
                      showToast('Groupe rejoint ✓')
                    }}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tap ${
                      joinedGroups[g.id] ? 'bg-[#E4EDE7] text-[#3C5A48]' : 'bg-ink-900 text-white'
                    }`}
                  >
                    {joinedGroups[g.id] ? 'Rejoint ✓' : 'Rejoindre'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderProfil() {
    const u = CURRENT_USER
    const stats = [
      { label: 'km ce mois', value: u.stats.km },
      { label: 'sorties', value: u.stats.sorties },
      { label: 'défis', value: u.stats.defis },
    ]
    const roiCards = [
      { label: 'Connexions', value: u.roi.connections, icon: 'users', tone: 'indigo' },
      { label: 'RDV pris', value: u.roi.meetings, icon: 'calendar', tone: 'emerald' },
      { label: 'Opportunités', value: u.roi.opportunities, icon: 'briefcase', tone: 'brand' },
    ]
    const settings = [
      { icon: 'bookmark', label: 'Mes favoris' },
      { icon: 'shield', label: 'Confidentialité' },
      { icon: 'sliders', label: 'Préférences' },
    ]

    return (
      <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
        {/* Cover */}
        <div className="relative h-28 overflow-hidden bg-ink-950">
          <div className="absolute inset-0 bg-hero-glow" />
        </div>

        <div className="px-5">
          <div className="-mt-12 flex flex-col items-center text-center">
            <div className="rounded-full p-1 ring-4 ring-white">
              <Avatar name={u.name} size="2xl" />
            </div>
            <h1 className="mt-3 text-xl font-extrabold text-ink-900">{u.name}</h1>
            <p className="text-sm text-ink-500">{u.title}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
              <Icon name="mapPin" className="h-3.5 w-3.5" /> {u.location}
              <span className="text-ink-300">·</span>
              {u.joined}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* ROI */}
            <section>
              <SectionTitle>Mon ROI réseau</SectionTitle>
              <div className="grid grid-cols-3 gap-2.5">
                {roiCards.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
                    <span className={`grid h-8 w-8 place-items-center rounded-xl ${PILL_TONES[s.tone]}`}>
                      <Icon name={s.icon} className="h-4 w-4" />
                    </span>
                    <div className="mt-2 text-xl font-extrabold text-ink-900">{s.value}</div>
                    <div className="text-[11px] text-ink-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ce que je cherche */}
            <section className="rounded-3xl border-2 border-brand-200 bg-brand-light/50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                  <Icon name="target" className="h-5 w-5 text-brand-600" /> Ce que je cherche
                </h2>
                {!editingNeeds && (
                  <button
                    onClick={startEditNeeds}
                    className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow-soft tap"
                  >
                    <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
                  </button>
                )}
              </div>

              {!editingNeeds ? (
                <ul className="mt-3 space-y-2">
                  {needs.map((n) => (
                    <li key={n} className="flex items-start gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-800 shadow-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {n}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-3 space-y-2">
                  {needsDraft.map((n, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={n}
                        onChange={(e) => setNeedsDraft((d) => d.map((v, j) => (j === i ? e.target.value : v)))}
                        placeholder="Ton besoin…"
                        className="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                      />
                      <button
                        onClick={() => setNeedsDraft((d) => d.filter((_, j) => j !== i))}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink-400 shadow-soft tap"
                      >
                        <Icon name="x" className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setNeedsDraft((d) => [...d, ''])} className="flex items-center gap-1 text-sm font-bold text-brand-700">
                    <Icon name="plus" className="h-4 w-4" /> Ajouter un besoin
                  </button>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveNeeds} className="flex-1 rounded-2xl bg-brand-500 py-2.5 text-sm font-bold text-white shadow-brand tap">
                      Enregistrer
                    </button>
                    <button onClick={() => setEditingNeeds(false)} className="rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-600 tap">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Ce que je propose */}
            <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <Icon name="link" className="h-5 w-5 text-[#3F7559]" /> Ce que je propose
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {u.offering.map((o) => (
                  <span key={o} className="rounded-full bg-[#E4EDE7] px-3 py-1.5 text-sm font-semibold text-[#3C5A48]">
                    {o}
                  </span>
                ))}
              </div>
            </section>

            {/* Stats running */}
            <section className="grid grid-cols-3 gap-2.5">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-3 text-center shadow-soft">
                  <div className="text-xl font-extrabold text-ink-900">{s.value}</div>
                  <div className="text-[11px] text-ink-400">{s.label}</div>
                </div>
              ))}
            </section>

            {/* Centres d'intérêt */}
            <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
              <h2 className="text-base font-bold text-ink-900">Centres d’intérêt</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {u.interests.map((i) => (
                  <span key={i} className="rounded-full bg-ink-100 px-3 py-1.5 text-sm font-semibold text-ink-600">
                    {i}
                  </span>
                ))}
              </div>
            </section>

            {/* Communauté */}
            <section className="flex items-center gap-3 rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-light text-brand-600">
                <Icon name="users" className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-ink-400">Membre de</div>
                <div className="font-bold text-ink-900">{u.community}</div>
              </div>
            </section>

            {/* Réglages */}
            <section className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
              {settings.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => showToast('Bientôt disponible')}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left tap hover:bg-ink-50 ${i > 0 ? 'border-t border-ink-100' : ''}`}
                >
                  <Icon name={s.icon} className="h-5 w-5 text-ink-400" />
                  <span className="flex-1 text-sm font-semibold text-ink-800">{s.label}</span>
                  <Icon name="chevronRight" className="h-4 w-4 text-ink-300" />
                </button>
              ))}
            </section>

            <button onClick={() => showToast('À bientôt 👋')} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-ink-400 tap">
              <Icon name="logout" className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderScreen() {
    switch (tab) {
      case 'accueil':
        return renderAccueil()
      case 'reseau':
        return renderReseau()
      case 'events':
        return renderEvents()
      case 'messages':
        return renderMessages()
      case 'profil':
        return renderProfil()
      default:
        return null
    }
  }

  const showHeader = !(tab === 'messages' && (openConv || openGroup)) && tab !== 'profil'

  /* ----------------------------------------------------------------- OVERLAYS */

  function MemberSheet() {
    if (!member) return null
    const p = personFor(member)
    const isContacted = contacted[member]
    return (
      <div className="absolute inset-0 z-40">
        <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={() => setMember(null)} />
        <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
          {/* Cover */}
          <div className="relative h-24 shrink-0 overflow-hidden bg-ink-950">
            <div className="absolute inset-0 bg-hero-glow" />
            <button
              onClick={() => setMember(null)}
              className="glass-dark absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white tap"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
            <div className="-mt-10 flex items-end gap-3">
              <div className="rounded-full p-1 ring-4 ring-white">
                <Avatar name={member} size="xl" />
              </div>
              <div className="pb-1">
                <h2 className="text-lg font-extrabold text-ink-900">{member}</h2>
                <p className="text-sm text-ink-500">{p.title}</p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-ink-400">
              <Icon name="mapPin" className="h-3.5 w-3.5" /> {p.location}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-ink-700">{p.bio}</p>

            {p.looking?.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
                  <Icon name="target" className="h-3.5 w-3.5" /> Recherche
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.looking.map((x) => (
                    <span key={x} className="rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-700">{x}</span>
                  ))}
                </div>
              </div>
            )}

            {p.offering?.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#3C5A48]">
                  <Icon name="link" className="h-3.5 w-3.5" /> Propose
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.offering.map((x) => (
                    <span key={x} className="rounded-full bg-[#E4EDE7] px-3 py-1.5 text-sm font-semibold text-[#3C5A48]">{x}</span>
                  ))}
                </div>
              </div>
            )}

            {p.mutuals?.length > 0 && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
                <AvatarStack names={p.mutuals.slice(0, 3)} total={p.mutuals.length} onMore={() => {}} />
                <span className="text-[13px] text-ink-600">
                  <span className="font-bold text-ink-900">{p.mutuals.length} connexions</span> en commun
                </span>
              </div>
            )}

            {p.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">#{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="glass flex shrink-0 items-center gap-2 border-t border-ink-100 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              onClick={() => {
                contactMember(member)
              }}
              className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white tap ${isContacted ? 'bg-[#3F7559]' : 'bg-brand-500 shadow-brand'}`}
            >
              {isContacted ? 'Demande envoyée ✓' : 'Entrer en contact'}
            </button>
            <button
              onClick={() => {
                const conv = CONVERSATIONS.find((c) => c.name === member)
                setMember(null)
                if (conv) {
                  goTo('messages')
                  openChat(conv.id)
                } else {
                  showToast('Conversation bientôt disponible')
                }
              }}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-ink-200 text-ink-700 tap"
            >
              <Icon name="chat" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  function NotifDrawer() {
    if (!notifOpen) return null
    return (
      <div className="absolute inset-0 z-40">
        <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={() => setNotifOpen(false)} />
        <div className="animate-drawerIn absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-float">
          <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-4 py-4">
            <h2 className="text-lg font-extrabold text-ink-900">Notifications</h2>
            <button onClick={() => setNotifOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-500 tap">
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
          {unreadNotif > 0 && (
            <button
              onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
              className="shrink-0 border-b border-ink-100 px-4 py-2.5 text-left text-xs font-bold text-brand-600 tap"
            >
              Tout marquer comme lu
            </button>
          )}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {notifs.map((n) => (
              <div key={n.id} className={`flex gap-3 border-b border-ink-50 px-4 py-3.5 ${n.unread ? 'bg-brand-light/30' : ''}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[n.tone]}`}>
                  <Icon name={n.icon} className="h-4 w-4" filled={n.icon === 'heart' || n.icon === 'sparkles'} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-ink-800">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-ink-400">{n.time}</p>
                </div>
                {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------- RENDER */

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-ink-100 bg-mesh sm:py-8">
      <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-ink-50 shadow-ring sm:h-[860px] sm:max-h-[94vh] sm:rounded-[2.75rem] sm:ring-[10px] sm:ring-ink-950">
        {/* Dynamic island (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-ink-950 sm:block" />

        {showHeader && (
          <header className="glass z-20 flex shrink-0 items-center justify-between border-b border-ink-100 px-5 pb-3 pt-4 sm:pt-7">
            <Logo />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNotifOpen(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 tap hover:bg-ink-100"
              >
                <Icon name="bell" className="h-[22px] w-[22px]" />
                {unreadNotif > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" />}
              </button>
              <Avatar name={CURRENT_USER.name} size="sm" onClick={() => goTo('profil')} />
            </div>
          </header>
        )}

        <main className="relative flex flex-1 flex-col overflow-hidden">{renderScreen()}</main>

        {toast && (
          <div
            key={toast.key}
            className="animate-toastIn glass-dark pointer-events-none absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-float"
          >
            {toast.msg}
          </div>
        )}

        {MemberSheet()}
        {NotifDrawer()}

        <BottomNav active={tab} onChange={goTo} unread={navUnread} />
      </div>
    </div>
  )
}
