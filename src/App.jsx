import { useState } from 'react'

/* ============================================================================
   DONNÉES FICTIVES — tout est regroupé ici pour être ajusté facilement.
   Aucune logique back-end, aucun appel réseau, aucun stockage navigateur.
   ========================================================================== */

const CURRENT_USER = {
  name: 'Thomas Lefèvre',
  title: 'Fondateur · SaaS B2B',
  community: 'Entrepreneurs Runners Paris',
  needs: ['Un dev React pour mon MVP', 'Des conseils pour scaler'],
  interests: ['Levée de fonds', 'Product', 'Trail', 'Café & co-working'],
  stats: { km: 42, sorties: 6, defis: 2 },
}

const SUGGESTIONS = [
  {
    id: 1,
    name: 'Sarah Khalil',
    title: 'Fondatrice · foodtech',
    needBadge: 'Lève des fonds',
    runBadge: 'Court le dimanche',
    reason:
      "Comme toi, elle prépare une levée. Vous courez tous les deux le long de la Seine le dimanche — l'occasion d'échanger sur vos pitchs.",
    primaryAction: 'Proposer une sortie',
  },
  {
    id: 2,
    name: 'Yanis Benali',
    title: 'Lead dev freelance · React',
    needBadge: 'Cherche des missions',
    runBadge: 'Même défi 10 km',
    reason:
      "Tu cherches un dev React pour ton MVP ; lui prend justement des missions. Vous êtes inscrits au même défi 10 km — parfait pour faire connaissance en courant.",
    primaryAction: 'Proposer une sortie',
  },
  {
    id: 3,
    name: 'Claire Moreau',
    title: 'Ex-directrice retail · mentor',
    needBadge: 'Propose du mentorat',
    runBadge: "Sera à l'event jeudi",
    reason:
      "Elle a scalé une marque retail de 0 à 200 boutiques et propose du mentorat. Elle sera à la sortie + afterwork de jeudi : le moment idéal pour parler scaling.",
    primaryAction: 'La voir jeudi',
  },
]

const CHALLENGE = { title: 'Défi du mois : 50 km', current: 42, total: 50 }

const ACTIVITIES = [
  {
    id: 'a1',
    title: 'Sortie longue · Bords de Seine',
    date: 'Dim. 8h00',
    distance: '12 km',
    participants: 14,
    kudos: 23,
    attendees: ['Sarah Khalil', 'Claire Moreau', 'Marc Dubois'],
  },
  {
    id: 'a2',
    title: 'Run & Pitch · Canal Saint-Martin',
    date: 'Jeu. 18h30',
    distance: '6 km',
    participants: 21,
    kudos: 31,
    tag: '+ afterwork',
    attendees: ['Claire Moreau', 'Inès Roy', 'Léa Fontaine'],
  },
  {
    id: 'a3',
    title: 'Fractionné · Parc de Bercy',
    date: 'Mar. 19h00',
    distance: '8 km',
    participants: 9,
    kudos: 15,
    attendees: ['Yanis Benali', 'Hugo Bernard', 'Karim Haddad'],
  },
  {
    id: 'a4',
    title: 'Trail découverte · Bois de Vincennes',
    date: 'Sam. 9h30',
    distance: '15 km',
    participants: 7,
    kudos: 12,
    attendees: ['Marc Dubois', 'Nadia Cherif', 'Yanis Benali'],
  },
  {
    id: 'a5',
    title: 'Récup easy · Buttes-Chaumont',
    date: 'Lun. 7h00',
    distance: '5 km',
    participants: 5,
    kudos: 8,
    attendees: ['Sarah Khalil', 'Léa Fontaine', 'Nadia Cherif'],
  },
]

const FILTERS = ['Tous', 'Cherche un associé', 'Recrute', 'Investit', 'Mentor']

const MEMBERS = [
  {
    id: 'm1',
    name: 'Sarah Khalil',
    title: 'Fondatrice · foodtech',
    need: 'Lève une seed · ouverte à un associé produit',
    category: 'Cherche un associé',
    proximity: 'Court le dimanche · Seine',
  },
  {
    id: 'm2',
    name: 'Claire Moreau',
    title: 'Ex-directrice retail',
    need: 'Propose du mentorat scaling',
    category: 'Mentor',
    proximity: "Sera à l'event de jeudi",
  },
  {
    id: 'm3',
    name: 'Karim Haddad',
    title: 'Business angel · ex-CFO',
    need: 'Investit · tickets 20–50k',
    category: 'Investit',
    proximity: 'À 2 km · Issy-les-Moulineaux',
  },
  {
    id: 'm4',
    name: 'Léa Fontaine',
    title: 'CEO · marketplace mode',
    need: 'Recrute un Head of Growth',
    category: 'Recrute',
    proximity: 'Croisée à la sortie de mardi',
  },
  {
    id: 'm5',
    name: 'Marc Dubois',
    title: 'Co-fondateur · fintech',
    need: 'Cherche un associé tech',
    category: 'Cherche un associé',
    proximity: 'À 3 km · Boulogne',
  },
  {
    id: 'm6',
    name: 'Inès Roy',
    title: 'Investisseuse · fonds early-stage',
    need: 'Investit · pré-seed & seed',
    category: 'Investit',
    proximity: 'Sera au Run & Pitch jeudi',
  },
  {
    id: 'm7',
    name: 'Hugo Bernard',
    title: 'DG · scale-up logistique',
    need: 'Recrute des profils tech & ops',
    category: 'Recrute',
    proximity: 'À 1,5 km · Paris 11e',
  },
  {
    id: 'm8',
    name: 'Nadia Cherif',
    title: 'Serial entrepreneuse',
    need: 'Propose du mentorat go-to-market',
    category: 'Mentor',
    proximity: 'Croisée au défi 10 km',
  },
]

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

/* ============================================================================
   UTILITAIRES & PETITS COMPOSANTS
   ========================================================================== */

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
]

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function colorFor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const AVATAR_SIZES = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-2xl',
}

function Avatar({ name, size = 'md', ring = false }) {
  return (
    <div
      className={`${AVATAR_SIZES[size]} ${colorFor(name)} ${
        ring ? 'ring-2 ring-white' : ''
      } shrink-0 rounded-full grid place-items-center font-bold text-white select-none`}
    >
      {initials(name)}
    </div>
  )
}

function AvatarStack({ names, total }) {
  const extra = total - names.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {names.map((n) => (
          <Avatar key={n} name={n} size="sm" ring />
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-xs font-medium text-gray-500">+{extra}</span>
      )}
    </div>
  )
}

function Badge({ tone = 'need', children }) {
  const tones = {
    need: 'bg-accent-light text-accent-dark',
    run: 'bg-emerald-50 text-emerald-700',
  }
  return (
    <span className={`${tones[tone]} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone === 'need' ? 'bg-accent' : 'bg-emerald-500'}`} />
      {children}
    </span>
  )
}

const ICON_PATHS = {
  sparkles: 'M11 3l1.6 5.4L18 10l-5.4 1.6L11 17l-1.6-5.4L4 10l5.4-1.6z',
  activity: 'M3 12h4l3 8 4-16 3 8h4',
  compass: 'M16 8l-2 6-6 2 2-6z',
  chat: 'M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z',
  arrowLeft: 'M15 18l-6-6 6-6',
  pencil: 'M4 20h4L18 10l-4-4L4 16zM14 6l4 4',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  x: 'M6 6l12 12M18 6 6 18',
  route: 'M9 18h6a3 3 0 0 0 3-3V9',
  flame: 'M12 3c1 3-1.5 4-1.5 6.5A3.5 3.5 0 0 0 14 13c0-1 .5-2 .5-2 1 1.5 1.5 3 1.5 4a4 4 0 1 1-8 0c0-3 2.5-4 4-12z',
}

function Icon({ name, className = 'w-5 h-5', filled = false }) {
  const isHeart = name === 'heart'
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={isHeart && filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isHeart ? (
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18z" />
      ) : name === 'compass' || name === 'user' ? (
        <>
          {name === 'compass' && <circle cx="12" cy="12" r="9" />}
          {name === 'user' && (
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </>
          )}
          {name === 'compass' && <path d={ICON_PATHS.compass} />}
        </>
      ) : (
        <path d={ICON_PATHS[name]} />
      )}
    </svg>
  )
}

function ProgressBar({ value, total }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className="h-2 w-full rounded-full bg-white/40 overflow-hidden">
      <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold tracking-tight text-gray-900">
        R<span className="text-accent">O</span>I
      </span>
      <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:inline">
        Le réseau qui rapporte
      </span>
    </div>
  )
}

/* ============================================================================
   NAVIGATION
   ========================================================================== */

const TABS = [
  { id: 'suggestions', label: 'Suggestions', icon: 'sparkles' },
  { id: 'activite', label: 'Activité', icon: 'activity' },
  { id: 'decouverte', label: 'Découverte', icon: 'compass' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'profil', label: 'Profil', icon: 'user' },
]

function BottomNav({ active, onChange, unread }) {
  return (
    <nav className="shrink-0 border-t border-gray-100 bg-white/95 px-2 pb-2 pt-1.5 backdrop-blur">
      <div className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition active:scale-90"
            >
              <span className={isActive ? 'text-accent' : 'text-gray-400'}>
                <Icon name={tab.icon} className="w-6 h-6" />
              </span>
              {tab.id === 'messages' && unread > 0 && (
                <span className="absolute right-3 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
              <span className={`text-[10px] font-semibold ${isActive ? 'text-accent' : 'text-gray-400'}`}>
                {tab.label}
              </span>
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
  const [tab, setTab] = useState('suggestions')
  const [toast, setToast] = useState(null)

  // Suggestions
  const [sentSuggestions, setSentSuggestions] = useState({})

  // Activité
  const [kudos, setKudos] = useState(
    Object.fromEntries(ACTIVITIES.map((a) => [a.id, { count: a.kudos, liked: false }])),
  )
  const [joined, setJoined] = useState({})

  // Découverte
  const [filter, setFilter] = useState('Tous')
  const [contacted, setContacted] = useState({})

  // Messages
  const [openConv, setOpenConv] = useState(null)
  const [threads, setThreads] = useState(THREADS)
  const [draft, setDraft] = useState('')

  // Profil
  const [needs, setNeeds] = useState(CURRENT_USER.needs)
  const [editingNeeds, setEditingNeeds] = useState(false)
  const [needsDraft, setNeedsDraft] = useState(CURRENT_USER.needs)

  const unreadCount = CONVERSATIONS.filter((c) => c.unread).length

  function showToast(msg) {
    setToast({ msg, key: Date.now() })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 1900)
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

  function sendMessage() {
    const text = draft.trim()
    if (!text || !openConv) return
    setThreads((prev) => ({ ...prev, [openConv]: [...prev[openConv], { from: 'me', text }] }))
    setDraft('')
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

  /* ---------------------------------------------------------------- ÉCRANS */

  function renderSuggestions() {
    return (
      <div className="screen-in space-y-4 overflow-y-auto no-scrollbar px-5 py-5">
        <div>
          <div className="flex items-center gap-1.5 text-accent">
            <Icon name="sparkles" className="w-4 h-4" filled />
            <span className="text-xs font-bold uppercase tracking-wide">Assistant ROI</span>
          </div>
          <h1 className="mt-1.5 text-[22px] font-extrabold leading-tight text-gray-900">
            3 personnes à rencontrer cette semaine
          </h1>
          <p className="mt-1 text-sm text-gray-500">Suggéré pour toi · basé sur ton besoin et tes sorties</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {needs.map((n) => (
              <span
                key={n}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
              >
                🎯 {n}
              </span>
            ))}
          </div>
        </div>

        {SUGGESTIONS.map((p) => {
          const sent = sentSuggestions[p.id]
          return (
            <article key={p.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} size="lg" />
                <div className="min-w-0">
                  <div className="truncate font-bold text-gray-900">{p.name}</div>
                  <div className="truncate text-sm text-gray-500">{p.title}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="need">{p.needBadge}</Badge>
                <Badge tone="run">{p.runBadge}</Badge>
              </div>

              <div className="mt-3 flex gap-3 rounded-2xl bg-accent-light/70 p-3">
                <div className="w-1 shrink-0 rounded-full bg-accent" />
                <p className="text-sm leading-relaxed text-gray-700">{p.reason}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSentSuggestions((s) => ({ ...s, [p.id]: true }))
                    showToast('Demande envoyée ✓')
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition active:scale-95 ${
                    sent ? 'bg-emerald-500' : 'bg-accent hover:bg-accent-dark'
                  }`}
                >
                  {sent ? 'Demande envoyée ✓' : p.primaryAction}
                </button>
                <button
                  onClick={() => showToast('Profil ouvert')}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition active:scale-95"
                >
                  Voir le profil
                </button>
              </div>
            </article>
          )
        })}

        <p className="pb-2 text-center text-xs text-gray-400">
          De nouvelles suggestions chaque lundi matin ☕
        </p>
      </div>
    )
  }

  function renderActivite() {
    return (
      <div className="screen-in space-y-4 overflow-y-auto no-scrollbar px-5 py-5">
        <h1 className="text-[22px] font-extrabold leading-tight text-gray-900">Activité</h1>

        <div className="rounded-3xl bg-gradient-to-br from-accent to-accent-dark p-4 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="flame" className="w-5 h-5" filled />
            <span className="font-bold">{CHALLENGE.title}</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={CHALLENGE.current} total={CHALLENGE.total} />
          </div>
          <div className="mt-2 flex justify-between text-sm font-medium text-white/90">
            <span>{CHALLENGE.current} km parcourus</span>
            <span>plus que {CHALLENGE.total - CHALLENGE.current} km</span>
          </div>
        </div>

        {ACTIVITIES.map((a) => {
          const k = kudos[a.id]
          const isJoined = joined[a.id]
          return (
            <article key={a.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{a.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {a.date} · {a.distance}
                    {a.tag && <span className="ml-1 font-semibold text-accent">{a.tag}</span>}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <AvatarStack names={a.attendees} total={a.participants} />
                <button
                  onClick={() => toggleKudos(a.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-90 ${
                    k.liked ? 'bg-accent-light text-accent-dark' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon name="heart" className="w-4 h-4" filled={k.liked} />
                  {k.count}
                </button>
              </div>

              <button
                onClick={() => toggleJoin(a.id)}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition active:scale-95 ${
                  isJoined
                    ? 'bg-emerald-500 text-white'
                    : 'bg-accent text-white hover:bg-accent-dark'
                }`}
              >
                {isJoined ? 'Inscrit ✓' : 'Je participe'}
              </button>
            </article>
          )
        })}
      </div>
    )
  }

  function renderDecouverte() {
    const list = MEMBERS.filter((m) => filter === 'Tous' || m.category === filter)
    return (
      <div className="screen-in flex h-full flex-col">
        <div className="px-5 pt-5">
          <h1 className="text-[22px] font-extrabold leading-tight text-gray-900">Découverte</h1>
          <p className="mt-1 text-sm text-gray-500">Les bonnes personnes que tu vas croiser</p>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
                filter === f ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-5">
          {list.map((m) => (
            <article key={m.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-gray-900">{m.name}</div>
                  <div className="truncate text-sm text-gray-500">{m.title}</div>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-accent-dark">{m.need}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Icon name="route" className="w-3.5 h-3.5" />
                {m.proximity}
              </div>
              <button
                onClick={() => {
                  setContacted((c) => ({ ...c, [m.id]: true }))
                  showToast('Demande envoyée ✓')
                }}
                className={`mt-3 w-full rounded-xl py-2 text-sm font-semibold transition active:scale-95 ${
                  contacted[m.id]
                    ? 'bg-emerald-500 text-white'
                    : 'border border-accent text-accent hover:bg-accent-light'
                }`}
              >
                {contacted[m.id] ? 'Demande envoyée ✓' : 'Entrer en contact'}
              </button>
            </article>
          ))}
          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-400">Aucun membre pour ce filtre.</p>
          )}
        </div>
      </div>
    )
  }

  function renderMessages() {
    if (openConv) {
      const conv = CONVERSATIONS.find((c) => c.id === openConv)
      const msgs = threads[openConv]
      return (
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-3 py-3">
            <button
              onClick={() => {
                setOpenConv(null)
                setDraft('')
              }}
              className="rounded-full p-1.5 text-gray-500 transition active:scale-90"
            >
              <Icon name="arrowLeft" className="w-6 h-6" />
            </button>
            <Avatar name={conv.name} size="sm" />
            <div className="font-bold text-gray-900">{conv.name}</div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar bg-gray-50 px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.from === 'me'
                      ? 'rounded-br-sm bg-accent text-white'
                      : 'rounded-bl-sm border border-gray-100 bg-white text-gray-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 bg-white px-3 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris un message…"
              className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              onClick={sendMessage}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white transition active:scale-90"
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="screen-in flex h-full flex-col">
        <div className="px-5 pt-5">
          <h1 className="text-[22px] font-extrabold leading-tight text-gray-900">Messages</h1>
        </div>
        <div className="mt-3 flex-1 overflow-y-auto no-scrollbar">
          {CONVERSATIONS.map((c) => {
            const last = threads[c.id][threads[c.id].length - 1]
            return (
              <button
                key={c.id}
                onClick={() => setOpenConv(c.id)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition active:bg-gray-50"
              >
                <Avatar name={c.name} size="md" />
                <div className="min-w-0 flex-1 border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-semibold text-gray-900">{c.name}</span>
                    <span className="ml-2 shrink-0 text-xs text-gray-400">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${c.unread ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                      {last.from === 'me' ? 'Toi : ' : ''}
                      {last.text}
                    </span>
                    {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function renderProfil() {
    return (
      <div className="screen-in space-y-4 overflow-y-auto no-scrollbar px-5 py-5">
        <div className="flex flex-col items-center pt-2 text-center">
          <Avatar name={CURRENT_USER.name} size="xl" />
          <h1 className="mt-3 text-xl font-extrabold text-gray-900">{CURRENT_USER.name}</h1>
          <p className="text-sm text-gray-500">{CURRENT_USER.title}</p>
        </div>

        {/* Bloc central : ce que je cherche */}
        <div className="rounded-3xl border-2 border-accent/30 bg-accent-light/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-bold text-gray-900">
              <span className="text-accent">🎯</span> Ce que je cherche en ce moment
            </h2>
            {!editingNeeds && (
              <button
                onClick={startEditNeeds}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent shadow-sm transition active:scale-95"
              >
                <Icon name="pencil" className="w-3.5 h-3.5" />
                Modifier
              </button>
            )}
          </div>

          {!editingNeeds ? (
            <ul className="mt-3 space-y-2">
              {needs.map((n) => (
                <li key={n} className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
                    onChange={(e) =>
                      setNeedsDraft((d) => d.map((v, j) => (j === i ? e.target.value : v)))
                    }
                    placeholder="Ton besoin…"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <button
                    onClick={() => setNeedsDraft((d) => d.filter((_, j) => j !== i))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-gray-400 shadow-sm transition active:scale-90"
                  >
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setNeedsDraft((d) => [...d, ''])}
                className="flex items-center gap-1 text-sm font-semibold text-accent"
              >
                <Icon name="plus" className="w-4 h-4" /> Ajouter un besoin
              </button>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveNeeds}
                  className="flex-1 rounded-xl bg-accent py-2 text-sm font-semibold text-white transition active:scale-95"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingNeeds(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition active:scale-95"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats running */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'km ce mois', value: CURRENT_USER.stats.km },
            { label: 'sorties', value: CURRENT_USER.stats.sorties },
            { label: 'défis', value: CURRENT_USER.stats.defis },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm">
              <div className="text-xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Centres d'intérêt */}
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-gray-900">Centres d’intérêt</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CURRENT_USER.interests.map((i) => (
              <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Communauté */}
        <div className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-light text-accent">
            <Icon name="activity" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Membre de</div>
            <div className="font-semibold text-gray-900">{CURRENT_USER.community}</div>
          </div>
        </div>
      </div>
    )
  }

  function renderScreen() {
    switch (tab) {
      case 'suggestions':
        return renderSuggestions()
      case 'activite':
        return renderActivite()
      case 'decouverte':
        return renderDecouverte()
      case 'messages':
        return renderMessages()
      case 'profil':
        return renderProfil()
      default:
        return null
    }
  }

  const showHeader = !(tab === 'messages' && openConv)

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center sm:py-6">
      <div className="relative flex h-[100dvh] w-full max-w-[400px] flex-col overflow-hidden bg-gray-50 shadow-2xl sm:h-[820px] sm:max-h-[92vh] sm:rounded-[2.5rem] sm:ring-8 sm:ring-black">
        {/* Encoche décorative (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black sm:block" />

        {showHeader && (
          <header className="z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/90 px-5 pb-3 pt-4 backdrop-blur sm:pt-6">
            <Logo />
            <button
              onClick={() => showToast('Aucune nouvelle notification')}
              className="relative rounded-full p-1.5 text-gray-500 transition active:scale-90"
            >
              <Icon name="bell" className="w-6 h-6" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>
          </header>
        )}

        <main className="relative flex flex-1 flex-col overflow-hidden">{renderScreen()}</main>

        {toast && (
          <div
            key={toast.key}
            className="toast pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gray-900/95 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
          >
            {toast.msg}
          </div>
        )}

        <BottomNav
          active={tab}
          onChange={(t) => {
            setTab(t)
            setOpenConv(null)
          }}
          unread={unreadCount}
        />
      </div>
    </div>
  )
}
