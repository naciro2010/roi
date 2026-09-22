import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AppContext } from './AppContext'
import { usePersistentState, clearPersistedState } from './lib/usePersistentState'
import {
  recordSignal, rankMatches, rankRunMatches, behaviorInsights, scoreMatch, icebreaker, EMPTY_SIGNALS,
} from './lib/matching'
import { PROFILES } from './data/profiling'
import { PEOPLE, MEMBERS } from './data/network'

import { CURRENT_USER } from './data/user'
import { CONVERSATIONS, THREADS, GROUPS, GROUP_THREADS } from './data/messages'
import { NOTIFICATIONS } from './data/notifications'
import { POSTS } from './data/feed'
import { EVENTS } from './data/events'
import { MEETINGS } from './data/meetings'
import { ACTIVITIES } from './data/activities'
import { CONNECTIONS, REQUESTS } from './data/connections'

import Icon from './components/Icon'
import { Avatar } from './components/Avatar'
import { Logo } from './components/primitives'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import PostComposer from './components/PostComposer'

import Accueil from './screens/Accueil'

/* Éco-conception : seul l'écran d'accueil est dans le bundle initial. Les autres
   écrans et tous les overlays (fiches, réglages, sheets) sont chargés à la
   demande — moins de JS à télécharger, parser et exécuter au démarrage. */
const Reseau = lazy(() => import('./screens/Reseau'))
const Courir = lazy(() => import('./screens/Courir'))
const Messages = lazy(() => import('./screens/Messages'))
const Profil = lazy(() => import('./screens/Profil'))
const MemberSheet = lazy(() => import('./screens/MemberSheet'))
const ActivitySheet = lazy(() => import('./screens/ActivitySheet'))
const EventSheet = lazy(() => import('./screens/EventSheet'))
const Onboarding = lazy(() => import('./screens/Onboarding'))
const EditProfileSheet = lazy(() => import('./screens/EditProfileSheet'))
const RoiInfoSheet = lazy(() => import('./screens/RoiInfoSheet'))
const GlobalSearch = lazy(() => import('./screens/GlobalSearch'))
const IntegrationsSheet = lazy(() => import('./screens/IntegrationsSheet'))
const AgendaSheet = lazy(() => import('./screens/AgendaSheet'))
const PlansSheet = lazy(() => import('./screens/PlansSheet'))
const InviteSheet = lazy(() => import('./screens/InviteSheet'))
const PipelineSheet = lazy(() => import('./screens/PipelineSheet'))
const RunMatchSheet = lazy(() => import('./screens/RunMatchSheet'))
const RaceSheet = lazy(() => import('./screens/RaceSheet'))
const NewsSheet = lazy(() => import('./screens/NewsSheet'))
const AccesReserve = lazy(() => import('./screens/AccesReserve'))
import { INITIAL_PIPELINE, shiftStage, stageMeta } from './data/pipeline'
import { suggestRun } from './lib/runmatch'
import { SERVICES } from './data/integrations'
import { planById, hasFeature, etatAbonnement, PALIER_BASE } from './data/plans'
import { avancementEdition, EDITION } from './data/race'
import { INITIAL_INVITES, INITIAL_TEAMMATES } from './data/invites'
import { dossierDepuisUrl, lierDossier } from './lib/dossier'

/* Contexte de matching (constant) : sorties & connexions en commun */
const MATCH_NAMES = Object.keys(PROFILES)
const SHARED_RUNS = (() => {
  const m = {}
  ACTIVITIES.forEach((a) => {
    if (a.athlete === CURRENT_USER.name) a.metContacts.forEach((n) => { m[n] = (m[n] || 0) + 1 })
    else if (a.metContacts.includes(CURRENT_USER.name)) m[a.athlete] = (m[a.athlete] || 0) + 1
  })
  return m
})()
const MUTUALS = Object.fromEntries(MATCH_NAMES.map((n) => [n, (PEOPLE[n]?.mutuals || []).length]))
const MATCH_CTX = { sharedRuns: SHARED_RUNS, mutuals: MUTUALS }
/* Comportement initial : Thomas a déjà liké le post de Yanis (dev) et croisé
   Sarah en sortie — le « Pour toi » démarre donc déjà légèrement orienté. */
const INITIAL_SIGNALS = ['Yanis Benali', 'Sarah Khalil'].reduce(
  (s, name) => recordSignal(s, { type: 'view', name }),
  recordSignal(EMPTY_SIGNALS, { type: 'like', name: 'Yanis Benali' }),
)

/* Détecte une préférence de sobriété côté système : « économiseur de données »
   ou « prefers-reduced-data ». Si l'utilisateur l'a demandée, on démarre en
   Mode sobriété par défaut (il reste débrayable dans le profil). */
function detectEcoDefault() {
  try {
    if (navigator.connection?.saveData) return true
    if (window.matchMedia?.('(prefers-reduced-data: reduce)')?.matches) return true
  } catch { /* API indisponible */ }
  return false
}

/* Placeholder discret le temps qu'un écran chargé à la demande arrive. */
function ScreenFallback() {
  return (
    <div className="flex flex-1 items-center justify-center" aria-busy="true">
      <span className="h-1 w-24 overflow-hidden rounded-full bg-craie-2"><span className="block h-full w-1/3 animate-pulse rounded-full bg-brand-500" /></span>
      <span className="sr-only">Chargement…</span>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('accueil')
  const [toast, setToast] = useState(null)
  // Onglet courant de l'écran Rencontres : partagé, pour qu'une action de
  // l'accueil (« 2 personnes veulent te rencontrer ») ouvre directement la
  // bonne liste au lieu de laisser chercher.
  const [reseauView, setReseauView] = useState('suggestions')

  // Mode sobriété (numérique responsable) : allège les cartes (pas de tuiles
  // réseau, le tracé GPS reste), coupe les effets gourmands en GPU/énergie.
  const [eco, setEco] = usePersistentState('eco', detectEcoDefault())

  // Overlays
  const [member, setMember] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [eventId, setEventId] = useState(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = usePersistentState('notifs', NOTIFICATIONS)

  // Réseau
  const [sentSuggestions, setSentSuggestions] = usePersistentState('sentSuggestions', {})
  const [contacted, setContacted] = usePersistentState('contacted', {})
  const [connections, setConnections] = usePersistentState('connections', CONNECTIONS)
  const [requests, setRequests] = usePersistentState('requests', REQUESTS)

  // Matching comportemental « Pour toi » — signaux + classement dérivé
  const [signals, setSignals] = usePersistentState('signals', INITIAL_SIGNALS)
  const rankedMatches = useMemo(() => rankMatches(MATCH_NAMES, signals, MATCH_CTX), [signals])
  const insights = useMemo(() => behaviorInsights(signals), [signals])
  function track(ev) { setSignals((s) => recordSignal(s, ev)) }
  function matchDetail(name) {
    return scoreMatch(name, signals, { sharedRuns: SHARED_RUNS[name] || 0, mutuals: MUTUALS[name] || 0 })
  }
  // RunMatch — binômes de course classés par compatibilité running.
  const runMatches = useMemo(() => rankRunMatches(MATCH_NAMES, signals, MATCH_CTX), [signals])

  // Courir — événements & activités
  const [eventKudos, setEventKudos] = usePersistentState('eventKudos', Object.fromEntries(EVENTS.map((a) => [a.id, { count: a.kudos, liked: false }])))
  const [joined, setJoined] = usePersistentState('joined', {})
  const [actKudos, setActKudos] = usePersistentState('actKudos', Object.fromEntries(ACTIVITIES.map((a) => [a.id, { count: a.kudos, liked: false }])))

  // Feed
  const [posts, setPosts] = usePersistentState('posts', POSTS)

  // Messages & groupes
  const [msgView, setMsgView] = useState('discussions')
  const [openConv, setOpenConv] = useState(null)
  const [openGroup, setOpenGroup] = useState(null)
  const [threads, setThreads] = usePersistentState('threads', THREADS)
  const [draft, setDraft] = useState('')
  const [convRead, setConvRead] = usePersistentState('convRead', {})
  const [groups, setGroups] = usePersistentState('groups', GROUPS)
  const [groupThreads, setGroupThreads] = usePersistentState('groupThreads', GROUP_THREADS)
  const [groupRead, setGroupRead] = usePersistentState('groupRead', {})
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [joinedGroups, setJoinedGroups] = usePersistentState('joinedGroups', {})

  // Profil éditable
  const [profile, setProfile] = usePersistentState('profile', {
    title: CURRENT_USER.title,
    bio: CURRENT_USER.bio,
    offering: CURRENT_USER.offering,
    interests: CURRENT_USER.interests,
    needs: CURRENT_USER.needs,
  })
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  // Onboarding · explication ROI · recherche globale
  const [onboarding, setOnboarding] = useState(() => {
    try { return !localStorage.getItem('roi2_onboarded') } catch { return true }
  })
  const [roiInfoOpen, setRoiInfoOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [integrationsOpen, setIntegrationsOpen] = useState(false)
  const [integrations, setIntegrations] = usePersistentState('integrations', {})

  // Formule · cooptation
  /* L'abonnement : c'est lui qui garde l'accès ouvert. Expiré, l'app ne se
     ferme pas — elle passe en lecture seule. Le palier (Membre · Premium ·
     Cercle) en fait partie : `plan` en est dérivé, pour que tout ce qui
     interroge `hasFeature` continue de marcher tel quel. */
  const [abonnement, setAbonnement] = usePersistentState('abonnement', CURRENT_USER.abonnement)
  const etatAbo = etatAbonnement(abonnement)
  const plan = abonnement.palier || PALIER_BASE
  const lectureSeule = etatAbo.statut === 'expire'
  const [plansOpen, setPlansOpen] = useState(false)

  /* L'accès : on ne rentre pas dans R.O.I en s'abonnant, on y rentre en
     ayant couru. Sans édition au compteur, l'app ne s'ouvre pas. */
  const [finisher, setFinisher] = usePersistentState('finisher', CURRENT_USER.editions.length > 0)
  const [invites, setInvites] = usePersistentState('invites', INITIAL_INVITES)
  const [teammates, setTeammates] = usePersistentState('teammates', INITIAL_TEAMMATES)
  const [inviteOpen, setInviteOpen] = useState(false)

  // Agenda & RDV business
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [meetingStatus, setMeetingStatus] = usePersistentState('meetingStatus', {})
  const [customMeetings, setCustomMeetings] = usePersistentState('customMeetings', [])
  const meetings = [...customMeetings, ...MEETINGS].map((m) => ({ ...m, status: meetingStatus[m.id] || m.status }))

  // Pipeline ROI (CRM léger) & RunMatch (binôme de course)
  const [pipeline, setPipeline] = usePersistentState('pipeline', INITIAL_PIPELINE)
  const [pipelineOpen, setPipelineOpen] = useState(false)
  const [runMatchOpen, setRunMatchOpen] = useState(false)
  const [proposedRuns, setProposedRuns] = usePersistentState('proposedRuns', {})

  // L'édition — la course annuelle. Le dossier vit sur le site (runoninvest.fr),
  // l'app le relie : par lien profond depuis l'espace (?dossier=&email=) ou à
  // la main (référence + e-mail). `dossier` = ce que le site a répondu.
  const [raceOpen, setRaceOpen] = useState(false)
  // Les nouvelles de R.O.I : la liste, ou une nouvelle en entier.
  const [news, setNews] = useState({ open: false, id: null })
  const [dossier, setDossier] = usePersistentState('dossier', null)
  useEffect(() => {
    const q = dossierDepuisUrl()
    if (!q) return
    let vivant = true
    lierDossier(q).then((r) => {
      if (!vivant) return
      if (r.dossier) {
        setDossier(r.dossier)
        showToast(`C’est bon : ton inscription ${r.dossier.reference} est reliée`)
      } else {
        showToast(r.erreur || 'On n’a pas trouvé cette inscription')
      }
      setRaceOpen(true)
    })
    try { window.history.replaceState(null, '', window.location.pathname) } catch { /* sans historique */ }
    return () => { vivant = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const planMeta = planById(plan)

  /* Ta route vers l'édition : ce qui est fait, ce qui s'ouvre quand. Les
     rendez-vous comptés sont ceux du jour J, à l'Arena. */
  const avancement = avancementEdition({
    dossard: CURRENT_USER.dossard,
    rdv: meetings.filter((m) => m.type === 'deal' && m.date === EDITION.date).length,
  })
  const referralJoined = invites.filter((i) => i.status === 'joined').length

  const unreadConv = CONVERSATIONS.filter((c) => c.unread && !convRead[c.id]).length
  const unreadGroups = groups.filter((g) => g.unread > 0 && !groupRead[g.id]).length
  const unreadNotif = notifs.filter((n) => n.unread).length
  const navUnread = unreadConv + unreadGroups

  /* ------------------------------------------------------------- handlers */

  function showToast(msg) {
    setToast({ msg, key: Date.now() })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 1900)
  }

  /* Lecture seule : abonnement expiré, on lit tout, on n'écrit rien. Le
     verrou ne cache pas l'action — il l'explique et ouvre le renouvellement,
     pour qu'on sache toujours pourquoi ça ne part pas. */
  function verrou(action, quoi = 'écrire') {
    return (...args) => {
      if (lectureSeule) {
        showToast(`Ton abonnement a expiré — reprends-le pour ${quoi}`)
        setPlansOpen(true)
        return
      }
      return action(...args)
    }
  }

  function goTo(t) {
    setTab(t)
    setOpenConv(null)
    setOpenGroup(null)
  }

  /* Ouvre l'écran Rencontres sur une liste précise. */
  function openReseau(view = 'suggestions') {
    setReseauView(view)
    goTo('reseau')
  }

  function openMember(name) {
    if (name && name !== CURRENT_USER.name) track({ type: 'view', name })
    setMember(name)
  }

  // Ajoute une relation au Pipeline ROI si elle n'y est pas déjà (sans rétrograder
  // une relation existante). `kind`/`via` sont dérivés du membre par défaut.
  function addToPipeline(name, patch = {}) {
    setPipeline((prev) => {
      if (prev.some((d) => d.name === name)) return prev
      const m = MEMBERS.find((x) => x.name === name)
      return [
        {
          id: `d-${Date.now()}`, name, stage: 'talking', value: 0,
          kind: m?.need || 'Nouvelle relation', next: 'Définir la prochaine étape',
          nextDate: null, via: 'Ajouté au pipeline', ...patch,
        },
        ...prev,
      ]
    })
  }

  function advanceDeal(id, dir = 1) {
    let label = ''
    setPipeline((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d
        const stage = shiftStage(d.stage, dir)
        label = stageMeta(stage).label
        return { ...d, stage }
      }),
    )
    if (dir > 0) showToast(`Où vous en êtes : ${label.toLowerCase()}`)
  }

  function contactMember(name) {
    setContacted((c) => ({ ...c, [name]: true }))
    track({ type: 'contact', name })
    addToPipeline(name, { via: 'Rencontre proposée depuis l’annuaire' })
    showToast(`Demande envoyée à ${name.split(' ')[0]}`)
  }

  function sendSuggestion(id, name) {
    setSentSuggestions((s) => ({ ...s, [id]: true }))
    if (name) {
      setContacted((c) => ({ ...c, [name]: true }))
      track({ type: 'contact', name })
      addToPipeline(name, { via: 'Rencontre proposée depuis « Pour toi »' })
    }
    showToast(name ? `Demande envoyée à ${name.split(' ')[0]}` : 'Demande envoyée')
  }

  function acceptRequest(name) {
    setRequests((rs) => rs.filter((r) => r.name !== name))
    setConnections((cs) => (cs.some((c) => c.name === name) ? cs : [{ name, context: 'Connexion acceptée' }, ...cs]))
    showToast(`C’est oui — tu peux écrire à ${name.split(' ')[0]}`)
  }

  function declineRequest(name) {
    setRequests((rs) => rs.filter((r) => r.name !== name))
    showToast('Demande déclinée')
  }

  function toggleEventKudos(id) {
    setEventKudos((prev) => {
      const cur = prev[id]
      return { ...prev, [id]: { count: cur.count + (cur.liked ? -1 : 1), liked: !cur.liked } }
    })
  }

  function toggleActKudos(id) {
    setActKudos((prev) => {
      const cur = prev[id]
      return { ...prev, [id]: { count: cur.count + (cur.liked ? -1 : 1), liked: !cur.liked } }
    })
  }

  function toggleJoin(id) {
    setJoined((prev) => {
      const next = !prev[id]
      showToast(next ? 'Tu es inscrit·e à cette sortie' : 'Tu n’es plus inscrit·e')
      return { ...prev, [id]: next }
    })
  }

  function togglePostLike(id) {
    const post = posts.find((p) => p.id === id)
    if (post && !post.liked && post.author !== CURRENT_USER.name) track({ type: 'like', name: post.author })
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)),
    )
  }

  function addComment(id, text) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { author: CURRENT_USER.name, text }] } : p)),
    )
  }

  function publishPost({ type, text }) {
    const id = `p-${Date.now()}`
    setPosts((prev) => [
      { id, author: CURRENT_USER.name, time: 'À l’instant', type, text, likes: 0, liked: false, comments: [] },
      ...prev,
    ])
    setComposerOpen(false)
    showToast('Publié dans le fil')
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

  function closeChat() {
    setOpenConv(null)
    setOpenGroup(null)
    setDraft('')
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text) return
    if (openGroup) {
      setGroupThreads((prev) => ({ ...prev, [openGroup]: [...prev[openGroup], { from: 'me', text }] }))
    } else if (openConv) {
      setThreads((prev) => ({ ...prev, [openConv]: [...prev[openConv], { from: 'me', text }] }))
      const c = CONVERSATIONS.find((x) => x.id === openConv)
      if (c?.name) track({ type: 'msg', name: c.name })
    } else return
    setDraft('')
  }

  // Une première phrase, toute prête : pré-remplit le message et ouvre la conversation.
  function startIcebreaker(name) {
    const text = icebreaker(name, SHARED_RUNS[name] || 0)
    setMember(null)
    const conv = CONVERSATIONS.find((c) => c.name === name)
    if (conv) {
      goTo('messages')
      openChat(conv.id)
      setDraft(text)
      showToast('La phrase est prête — il ne reste qu’à envoyer')
    } else {
      navigator?.clipboard?.writeText?.(text)
      showToast('Phrase copiée — tu peux la coller où tu veux')
    }
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
    showToast('Groupe créé')
    openGroupChat(id)
  }

  function joinGroup(g) {
    if (joinedGroups[g.id]) return
    setJoinedGroups((j) => ({ ...j, [g.id]: true }))
    setGroups((gs) => [...gs, { ...g, members: g.members + 1, time: 'maintenant', unread: 0 }])
    setGroupThreads((t) => ({ ...t, [g.id]: t[g.id] || [] }))
    showToast('Tu as rejoint le groupe')
  }

  function messageMember(name) {
    const conv = CONVERSATIONS.find((c) => c.name === name)
    setMember(null)
    if (conv) {
      goTo('messages')
      openChat(conv.id)
    } else {
      showToast('Vous devez d’abord dire oui tous les deux')
    }
  }

  function updateProfile(patch) {
    setProfile((p) => ({ ...p, ...patch }))
  }

  function finishOnboarding() {
    try { localStorage.setItem('roi2_onboarded', '1') } catch { /* stockage indisponible */ }
    setOnboarding(false)
  }

  function lierDossierApp(d) {
    setDossier(d)
  }
  function delierDossier() {
    setDossier(null)
    showToast('Inscription détachée de l’app — le site la garde')
  }

  function resetDemo() {
    clearPersistedState()
    window.location.reload()
  }

  function toggleEco() {
    setEco((on) => {
      const next = !on
      showToast(next ? 'Mode sobriété activé' : 'Mode sobriété désactivé')
      return next
    })
  }

  function toggleIntegration(id) {
    setIntegrations((prev) => {
      const next = !prev[id]
      const name = SERVICES.find((s) => s.id === id)?.name || ''
      showToast(next ? `${name} connecté` : `${name} déconnecté`)
      return { ...prev, [id]: next }
    })
  }

  /* Dans un an, jour pour jour — l'abonnement suit l'année, comme la course. */
  function dansUnAn() {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  }

  function upgradePlan(id) {
    const meta = planById(id)
    setAbonnement((a) => ({ ...a, palier: id, statut: 'actif', echeance: a.statut === 'expire' ? dansUnAn() : a.echeance }))
    setPlansOpen(false)
    showToast(id === PALIER_BASE ? 'Tu es revenu au palier Membre' : `Palier ${meta.name} demandé`)
  }

  /* Reprendre l'abonnement : l'échéance repart pour un an, tout se rouvre. */
  function renouveler() {
    setAbonnement((a) => ({ ...a, statut: 'actif', echeance: dansUnAn() }))
    setPlansOpen(false)
    showToast('Abonnement repris — tout est rouvert')
  }

  /* Démo : basculer les deux états d'accès pour les voir tels qu'ils sont. */
  function simulerExpiration() {
    setAbonnement((a) => {
      const expire = a.statut !== 'expire'
      showToast(expire ? 'Démo · abonnement expiré' : 'Démo · abonnement repris')
      return { ...a, statut: expire ? 'expire' : 'actif', echeance: expire ? a.echeance : dansUnAn() }
    })
  }
  function simulerFinisher() {
    setFinisher((f) => {
      showToast(f ? 'Démo · compte sans édition courue' : 'Démo · finisher')
      return !f
    })
  }

  function nameFromEmail(email) {
    const handle = email.split('@')[0].replace(/[._-]+/g, ' ')
    return handle.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function sendInvite(email) {
    if (invites.some((i) => i.email === email)) {
      showToast('Tu as déjà invité cette personne')
      return
    }
    setInvites((prev) => [
      { id: `inv-${Date.now()}`, name: nameFromEmail(email), email, status: 'pending', context: 'Invitation envoyée', date: 'à l’instant' },
      ...prev,
    ])
    showToast(`Invitation envoyée à ${nameFromEmail(email)}`)
  }

  function inviteTeammate(email) {
    if (teammates.some((t) => t.email === email)) {
      showToast('Cette personne est déjà dans ton équipe')
      return
    }
    setTeammates((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, name: nameFromEmail(email), email, role: 'Invité·e', status: 'pending' },
    ])
    showToast(`Invitation envoyée à ${nameFromEmail(email)}`)
  }

  function confirmMeeting(id) {
    setMeetingStatus((s) => ({ ...s, [id]: 'confirmed' }))
    showToast('Rendez-vous confirmé')
  }

  function proposeMeeting({ with: who, type = 'cafe', date, time, place, note }) {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    const fallbackDate = d.toISOString().slice(0, 10)
    setCustomMeetings((prev) => [
      {
        id: `rdv-${Date.now()}`, with: who, type,
        date: date || fallbackDate, time: time || '09:00',
        place: place || 'À définir ensemble', note: note || 'Proposé depuis sa fiche',
        status: 'pending',
      },
      ...prev,
    ])
    addToPipeline(who)
    if (type !== 'run') showToast(`Demande envoyée à ${who.split(' ')[0]}`)
  }

  // RunMatch : proposer une sortie matchée → crée un RDV « run » daté, alimente
  // le pipeline, et marque le binôme comme proposé.
  function proposeRun(name) {
    if (proposedRuns[name]) return
    const plan = suggestRun(name)
    proposeMeeting({ with: name, type: 'run', date: plan.date, time: plan.time, place: plan.place, note: plan.note })
    track({ type: 'contact', name })
    setProposedRuns((p) => ({ ...p, [name]: true }))
    showToast(`Sortie proposée à ${name.split(' ')[0]}`)
  }

  const ctx = {
    tab, goTo, showToast,
    reseauView, setReseauView, openReseau,
    openMember,
    openActivity: setActivityId,
    // Matching comportemental « Pour toi »
    rankedMatches, insights, matchDetail, track, startIcebreaker: verrou(startIcebreaker, 'écrire'),
    sharedRunsFor: (name) => SHARED_RUNS[name] || 0,
    openEvent: setEventId,
    openComposer: () => setComposerOpen(true),
    openEditProfile: () => setEditProfileOpen(true),
    openRoiInfo: () => setRoiInfoOpen(true),
    openSearch: () => setSearchOpen(true),
    openIntegrations: () => setIntegrationsOpen(true),
    integrations, toggleIntegration,
    // L'abonnement — ce qui garde l'accès ouvert
    plan, planMeta, upgradePlan, abonnement, etatAbo, lectureSeule, renouveler,
    hasFeature: (key) => hasFeature(plan, key),
    openPlans: () => setPlansOpen(true),
    // L'accès — réservé à celles et ceux qui ont déjà couru
    finisher, simulerExpiration, simulerFinisher,
    // Cooptation
    invites, sendInvite: verrou(sendInvite, 'inviter'), referralJoined,
    teammates, inviteTeammate: verrou(inviteTeammate, 'inviter'),
    openInvite: () => setInviteOpen(true),
    // Agenda & RDV
    meetings, confirmMeeting, proposeMeeting: verrou(proposeMeeting, 'proposer un rendez-vous'),
    openAgenda: () => setAgendaOpen(true),
    // Pipeline ROI & RunMatch
    pipeline, addToPipeline, advanceDeal,
    openPipeline: () => setPipelineOpen(true),
    runMatches, proposeRun: verrou(proposeRun, 'proposer une sortie'), proposedRuns,
    openRunMatch: () => setRunMatchOpen(true),
    // L'édition — la course annuelle, ton avancement, et le dossier lu sur le site
    openRace: () => setRaceOpen(true),
    avancement,
    dossier, lierDossierApp, delierDossier,
    // Les nouvelles de R.O.I
    openNews: (id = null) => setNews({ open: true, id }),
    contacted, contactMember: verrou(contactMember, 'proposer une rencontre'),
    sentSuggestions, sendSuggestion: verrou(sendSuggestion, 'proposer une rencontre'),
    connections, requests, acceptRequest: verrou(acceptRequest, 'dire oui'), declineRequest,
    eventKudos, toggleEventKudos, joined, toggleJoin,
    actKudos, toggleActKudos,
    posts, togglePostLike, addComment: verrou(addComment, 'répondre'),
    msgView, setMsgView, openConv, openGroup, openChat, openGroupChat, closeChat,
    threads, draft, setDraft, sendMessage: verrou(sendMessage, 'écrire'), convRead,
    groups, groupThreads, groupRead, creatingGroup, setCreatingGroup,
    newGroupName, setNewGroupName, createGroup: verrou(createGroup, 'créer un groupe'),
    joinedGroups, joinGroup: verrou(joinGroup, 'rejoindre un groupe'),
    messageMember,
    profile, updateProfile,
    // Numérique responsable — mode sobriété
    eco, toggleEco,
    replayOnboarding: () => setOnboarding(true),
    resetDemo,
  }

  const inChat = tab === 'messages' && (openConv || openGroup)
  // L'en-tête craie est sur tous les écrans ; seule une conversation ouverte
  // la remplace par son propre bandeau (retour, avatar, nom).
  const showHeader = !inChat
  const anyOverlay =
    member || activityId || eventId || composerOpen || notifOpen || editProfileOpen ||
    roiInfoOpen || integrationsOpen || searchOpen || plansOpen || inviteOpen || agendaOpen ||
    pipelineOpen || runMatchOpen || raceOpen || onboarding

  function renderScreen() {
    switch (tab) {
      case 'accueil': return <Accueil />
      case 'reseau': return <Reseau />
      case 'courir': return <Courir />
      case 'messages': return <Messages />
      case 'profil': return <Profil />
      default: return null
    }
  }

  function NotifDrawer() {
    if (!notifOpen) return null
    return (
      <div className="absolute inset-0 z-40">
        <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={() => setNotifOpen(false)} />
        <div className="animate-drawerIn absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col border-l border-line-soft bg-canvas">
          <div className="flex shrink-0 items-center justify-between border-b border-line-soft px-4 py-4">
            <h2 className="text-[20px] font-medium tracking-[-.01em]">Notifications</h2>
            <button onClick={() => setNotifOpen(false)} className="rond tap" aria-label="Fermer">
              <Icon name="x" className="h-[17px] w-[17px]" />
            </button>
          </div>
          {unreadNotif > 0 && (
            <button
              onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
              className="shrink-0 border-b border-line-soft px-4 py-3 text-left text-[13.5px] font-semibold text-brand-500 tap"
            >
              Tout marquer comme lu
            </button>
          )}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {notifs.map((n) => (
              <div key={n.id} className={`flex gap-3 border-b border-line-soft px-4 py-3.5 ${n.unread ? 'bg-surface' : ''}`}>
                <span className="ico">
                  <Icon name={n.icon} className="h-[18px] w-[18px]" filled={n.icon === 'heart' || n.icon === 'sparkles'} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-snug text-fg">{n.text}</p>
                  <p className="mt-1 text-[12.5px] text-fg-faint">{n.time}</p>
                </div>
                {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* L'app ne s'ouvre pas sans une édition courue : on montre la prochaine
     course et comment y prendre sa place, pas un mur. */
  if (!finisher) {
    return (
      <Suspense fallback={null}>
        <AccesReserve onRelier={() => { setFinisher(true); setRaceOpen(true) }} onFinisher={() => setFinisher(true)} />
      </Suspense>
    )
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className={`relative flex h-[100dvh] w-full justify-center overflow-hidden bg-canvas ${eco ? 'eco' : ''}`}>
        {/* Navigation latérale (desktop) — remplace la BottomNav sur grand écran. */}
        <Sidebar active={tab} onChange={goTo} unread={navUnread} />

        {/* Colonne de contenu : pleine largeur sur mobile, colonne centrée et
            confortable sur bureau (vrai layout web, sans maquette « téléphone »). */}
        {/* Colonne de contenu : pleine largeur sur mobile, 620 px centrés
            sur bureau — la mesure confortable d'une colonne de lecture. */}
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-canvas lg:max-w-[620px]">

          {/* L'en-tête : craie, le logotype à gauche (le bureau l'a déjà dans
              la sidebar), et à droite de quoi chercher, voir ses
              notifications et ouvrir son profil. */}
          {showHeader && (
            <header className="z-20 flex shrink-0 items-center justify-between px-5 pb-2.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
              <span className="lg:invisible"><Logo /></span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="grid h-[34px] w-[34px] place-items-center rounded-full text-fg-faint tap hover:bg-craie-2"
                  aria-label="Rechercher"
                >
                  <Icon name="search" className="h-[19px] w-[19px]" />
                </button>
                <button
                  onClick={() => setNotifOpen(true)}
                  className="relative grid h-[34px] w-[34px] place-items-center rounded-full text-fg-faint tap hover:bg-craie-2"
                  aria-label="Notifications"
                >
                  <Icon name="bell" className="h-[19px] w-[19px]" />
                  {unreadNotif > 0 && <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-brand-500" />}
                </button>
                <Avatar name={CURRENT_USER.name} size="sm" onClick={() => goTo('profil')} />
              </div>
            </header>
          )}

          {/* Lecture seule : on le dit une fois, en haut, sans bloquer la page. */}
          {lectureSeule && (
            <button
              onClick={() => setPlansOpen(true)}
              className="z-10 flex shrink-0 items-center gap-2.5 border-b border-line-soft bg-craie-2 px-5 py-2.5 text-left tap"
            >
              <Icon name="lock" className="h-4 w-4 shrink-0 text-fg-muted" />
              <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-fg-muted">
                <b className="font-semibold text-fg">Abonnement expiré</b> · tu peux tout lire, mais plus écrire.
              </span>
              <span className="shrink-0 text-[13.5px] font-semibold text-brand-500">Reprendre</span>
            </button>
          )}

          <main className="relative flex flex-1 flex-col overflow-hidden">
            <Suspense fallback={<ScreenFallback />}>{renderScreen()}</Suspense>
          </main>

          {toast && (
            <div
              key={toast.key}
              className="animate-toastIn pointer-events-none absolute bottom-[104px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-encre px-5 py-[11px] text-[13.5px] font-medium text-craie"
            >
              {toast.msg}
            </div>
          )}

          <Suspense fallback={null}>
            {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
            {plansOpen && <PlansSheet onClose={() => setPlansOpen(false)} />}
            {inviteOpen && <InviteSheet onClose={() => setInviteOpen(false)} />}
            {agendaOpen && <AgendaSheet onClose={() => setAgendaOpen(false)} />}
            {pipelineOpen && <PipelineSheet onClose={() => setPipelineOpen(false)} />}
            {runMatchOpen && <RunMatchSheet onClose={() => setRunMatchOpen(false)} />}
            {raceOpen && <RaceSheet onClose={() => setRaceOpen(false)} />}
            {news.open && (
              <NewsSheet
                id={news.id}
                onSelect={(id) => setNews({ open: true, id })}
                onClose={() => setNews({ open: false, id: null })}
              />
            )}
            {member && <MemberSheet name={member} onClose={() => setMember(null)} />}
            {activityId && <ActivitySheet id={activityId} onClose={() => setActivityId(null)} />}
            {eventId && <EventSheet id={eventId} onClose={() => setEventId(null)} />}
            {editProfileOpen && <EditProfileSheet onClose={() => setEditProfileOpen(false)} />}
            {roiInfoOpen && <RoiInfoSheet onClose={() => setRoiInfoOpen(false)} />}
            {integrationsOpen && <IntegrationsSheet onClose={() => setIntegrationsOpen(false)} />}
          </Suspense>
          <PostComposer open={composerOpen} onClose={() => setComposerOpen(false)} onPublish={verrou(publishPost, 'publier')} />
          <NotifDrawer />

          <BottomNav active={tab} onChange={goTo} unread={navUnread} />
        </div>

        {/* Onboarding plein écran (couvre toute la fenêtre, sidebar incluse). */}
        {onboarding && (
          <Suspense fallback={null}>
            <Onboarding
              onClose={finishOnboarding}
              onEditProfile={() => { finishOnboarding(); goTo('profil'); setEditProfileOpen(true) }}
            />
          </Suspense>
        )}
      </div>
    </AppContext.Provider>
  )
}
