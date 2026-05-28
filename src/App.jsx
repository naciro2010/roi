import { useMemo, useState } from 'react'
import { AppContext } from './AppContext'
import { usePersistentState, clearPersistedState } from './lib/usePersistentState'
import {
  recordSignal, rankMatches, behaviorInsights, scoreMatch, icebreaker, EMPTY_SIGNALS,
} from './lib/matching'
import { PROFILES } from './data/profiling'
import { PEOPLE } from './data/network'

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
import { Logo, PILL_TONES } from './components/primitives'
import BottomNav from './components/BottomNav'
import PostComposer from './components/PostComposer'

import Accueil from './screens/Accueil'
import Reseau from './screens/Reseau'
import Courir from './screens/Courir'
import Messages from './screens/Messages'
import Profil from './screens/Profil'
import MemberSheet from './screens/MemberSheet'
import ActivitySheet from './screens/ActivitySheet'
import EventSheet from './screens/EventSheet'
import Onboarding from './screens/Onboarding'
import EditProfileSheet from './screens/EditProfileSheet'
import RoiInfoSheet from './screens/RoiInfoSheet'
import GlobalSearch from './screens/GlobalSearch'
import IntegrationsSheet from './screens/IntegrationsSheet'
import AgendaSheet from './screens/AgendaSheet'
import PlansSheet from './screens/PlansSheet'
import InviteSheet from './screens/InviteSheet'
import { SERVICES } from './data/integrations'
import { planById, hasFeature } from './data/plans'
import { INITIAL_INVITES, INITIAL_TEAMMATES } from './data/invites'

/* ── Contexte de matching (constant) : sorties & connexions en commun ───── */
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

export default function App() {
  const [tab, setTab] = useState('accueil')
  const [toast, setToast] = useState(null)

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
    try { return !localStorage.getItem('roi_onboarded') } catch { return true }
  })
  const [roiInfoOpen, setRoiInfoOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [integrationsOpen, setIntegrationsOpen] = useState(false)
  const [integrations, setIntegrations] = usePersistentState('integrations', {})

  // Abonnement · invitations
  const [plan, setPlan] = usePersistentState('plan', 'free')
  const [plansOpen, setPlansOpen] = useState(false)
  const [invites, setInvites] = usePersistentState('invites', INITIAL_INVITES)
  const [teammates, setTeammates] = usePersistentState('teammates', INITIAL_TEAMMATES)
  const [inviteOpen, setInviteOpen] = useState(false)

  // Agenda & RDV business
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [meetingStatus, setMeetingStatus] = usePersistentState('meetingStatus', {})
  const [customMeetings, setCustomMeetings] = usePersistentState('customMeetings', [])
  const meetings = [...customMeetings, ...MEETINGS].map((m) => ({ ...m, status: meetingStatus[m.id] || m.status }))

  const planMeta = planById(plan)
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

  function goTo(t) {
    setTab(t)
    setOpenConv(null)
    setOpenGroup(null)
  }

  function openMember(name) {
    if (name && name !== CURRENT_USER.name) track({ type: 'view', name })
    setMember(name)
  }

  function contactMember(name) {
    setContacted((c) => ({ ...c, [name]: true }))
    track({ type: 'contact', name })
    showToast('Demande envoyée ✓')
  }

  function sendSuggestion(id, name) {
    setSentSuggestions((s) => ({ ...s, [id]: true }))
    if (name) { setContacted((c) => ({ ...c, [name]: true })); track({ type: 'contact', name }) }
    showToast('Demande envoyée ✓')
  }

  function acceptRequest(name) {
    setRequests((rs) => rs.filter((r) => r.name !== name))
    setConnections((cs) => (cs.some((c) => c.name === name) ? cs : [{ name, context: 'Connexion acceptée' }, ...cs]))
    showToast(`${name.split(' ')[0]} ajouté·e à ton réseau ✓`)
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
      showToast(next ? 'Inscription confirmée ✓' : 'Inscription annulée')
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
    showToast('Post publié ✓')
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

  // Brise-glace IA : pré-remplit un message pertinent et ouvre la conversation.
  function startIcebreaker(name) {
    const text = icebreaker(name, SHARED_RUNS[name] || 0)
    setMember(null)
    const conv = CONVERSATIONS.find((c) => c.name === name)
    if (conv) {
      goTo('messages')
      openChat(conv.id)
      setDraft(text)
      showToast('Brise-glace prêt — plus qu’à envoyer')
    } else {
      navigator?.clipboard?.writeText?.(text)
      showToast('Brise-glace copié ✓')
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
    showToast('Groupe créé ✓')
    openGroupChat(id)
  }

  function joinGroup(g) {
    if (joinedGroups[g.id]) return
    setJoinedGroups((j) => ({ ...j, [g.id]: true }))
    setGroups((gs) => [...gs, { ...g, members: g.members + 1, time: 'maintenant', unread: 0 }])
    setGroupThreads((t) => ({ ...t, [g.id]: t[g.id] || [] }))
    showToast('Groupe rejoint ✓')
  }

  function messageMember(name) {
    const conv = CONVERSATIONS.find((c) => c.name === name)
    setMember(null)
    if (conv) {
      goTo('messages')
      openChat(conv.id)
    } else {
      showToast('Conversation bientôt disponible')
    }
  }

  function updateProfile(patch) {
    setProfile((p) => ({ ...p, ...patch }))
  }

  function finishOnboarding() {
    try { localStorage.setItem('roi_onboarded', '1') } catch { /* stockage indisponible */ }
    setOnboarding(false)
  }

  function resetDemo() {
    clearPersistedState()
    window.location.reload()
  }

  function toggleIntegration(id) {
    setIntegrations((prev) => {
      const next = !prev[id]
      const name = SERVICES.find((s) => s.id === id)?.name || ''
      showToast(next ? `${name} connecté ✓` : `${name} déconnecté`)
      return { ...prev, [id]: next }
    })
  }

  function upgradePlan(id) {
    if (id === plan) return
    setPlan(id)
    setPlansOpen(false)
    const meta = planById(id)
    showToast(id === 'free' ? 'Plan Découverte activé' : `Bienvenue dans ${meta.name} ✨`)
  }

  function nameFromEmail(email) {
    const handle = email.split('@')[0].replace(/[._-]+/g, ' ')
    return handle.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function sendInvite(email) {
    if (invites.some((i) => i.email === email)) {
      showToast('Déjà invité·e')
      return
    }
    setInvites((prev) => [
      { id: `inv-${Date.now()}`, name: nameFromEmail(email), email, status: 'pending', context: 'Invitation envoyée', date: 'à l’instant' },
      ...prev,
    ])
    showToast('Invitation envoyée ✓')
  }

  function inviteTeammate(email) {
    if (teammates.some((t) => t.email === email)) {
      showToast('Déjà dans l’équipe')
      return
    }
    setTeammates((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, name: nameFromEmail(email), email, role: 'Invité·e', status: 'pending' },
    ])
    showToast('Coéquipier invité ✓')
  }

  function confirmMeeting(id) {
    setMeetingStatus((s) => ({ ...s, [id]: 'confirmed' }))
    showToast('RDV confirmé ✓')
  }

  function proposeMeeting({ with: who, type = 'cafe' }) {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    const date = d.toISOString().slice(0, 10)
    setCustomMeetings((prev) => [
      { id: `rdv-${Date.now()}`, with: who, type, date, time: '09:00', place: 'À définir ensemble', note: 'Proposé depuis sa fiche', status: 'pending' },
      ...prev,
    ])
    showToast('Proposition de RDV envoyée ✓')
  }

  const ctx = {
    tab, goTo, showToast,
    openMember,
    openActivity: setActivityId,
    // Matching comportemental « Pour toi »
    rankedMatches, insights, matchDetail, track, startIcebreaker,
    sharedRunsFor: (name) => SHARED_RUNS[name] || 0,
    openEvent: setEventId,
    openComposer: () => setComposerOpen(true),
    openEditProfile: () => setEditProfileOpen(true),
    openRoiInfo: () => setRoiInfoOpen(true),
    openSearch: () => setSearchOpen(true),
    openIntegrations: () => setIntegrationsOpen(true),
    integrations, toggleIntegration,
    // Abonnement
    plan, planMeta, upgradePlan,
    hasFeature: (key) => hasFeature(plan, key),
    openPlans: () => setPlansOpen(true),
    // Invitations
    invites, sendInvite, referralJoined,
    teammates, inviteTeammate,
    openInvite: () => setInviteOpen(true),
    // Agenda & RDV
    meetings, confirmMeeting, proposeMeeting,
    openAgenda: () => setAgendaOpen(true),
    contacted, contactMember,
    sentSuggestions, sendSuggestion,
    connections, requests, acceptRequest, declineRequest,
    eventKudos, toggleEventKudos, joined, toggleJoin,
    actKudos, toggleActKudos,
    posts, togglePostLike, addComment,
    msgView, setMsgView, openConv, openGroup, openChat, openGroupChat, closeChat,
    threads, draft, setDraft, sendMessage, convRead,
    groups, groupThreads, groupRead, creatingGroup, setCreatingGroup,
    newGroupName, setNewGroupName, createGroup, joinedGroups, joinGroup,
    messageMember,
    profile, updateProfile,
    replayOnboarding: () => setOnboarding(true),
    resetDemo,
  }

  const inChat = tab === 'messages' && (openConv || openGroup)
  const showHeader = !inChat && tab !== 'profil'
  const anyOverlay =
    member || activityId || eventId || composerOpen || notifOpen || editProfileOpen ||
    roiInfoOpen || integrationsOpen || searchOpen || plansOpen || inviteOpen || agendaOpen || onboarding

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
        <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={() => setNotifOpen(false)} />
        <div className="animate-drawerIn absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-surface shadow-float">
          <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-4">
            <h2 className="text-lg font-extrabold text-fg">Notifications</h2>
            <button onClick={() => setNotifOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-muted tap" aria-label="Fermer">
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
          {unreadNotif > 0 && (
            <button
              onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
              className="shrink-0 border-b border-line px-4 py-2.5 text-left text-xs font-bold text-brand-600 tap"
            >
              Tout marquer comme lu
            </button>
          )}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {notifs.map((n) => (
              <div key={n.id} className={`flex gap-3 border-b border-line px-4 py-3.5 ${n.unread ? 'bg-brand-light/30' : ''}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[n.tone]}`}>
                  <Icon name={n.icon} className="h-4 w-4" filled={n.icon === 'heart' || n.icon === 'sparkles'} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-fg">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-fg-faint">{n.time}</p>
                </div>
                {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-canvas bg-mesh sm:py-8">
        <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-canvas shadow-ring sm:h-[860px] sm:max-h-[94vh] sm:rounded-[2.75rem] sm:ring-[10px] sm:ring-ink-950/90">
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-ink-950 sm:block" />

          {showHeader && (
            <header className="glass z-20 flex shrink-0 items-center justify-between border-b border-line px-5 pb-3 pt-4 sm:pt-7">
              <Logo />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full text-fg-soft tap hover:bg-black/[0.05]"
                  aria-label="Rechercher"
                >
                  <Icon name="search" className="h-[21px] w-[21px]" />
                </button>
                <button
                  onClick={() => setNotifOpen(true)}
                  className="relative grid h-10 w-10 place-items-center rounded-full text-fg-soft tap hover:bg-black/[0.05]"
                  aria-label="Notifications"
                >
                  <Icon name="bell" className="h-[22px] w-[22px]" />
                  {unreadNotif > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-canvas" />}
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

          {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
          {plansOpen && <PlansSheet onClose={() => setPlansOpen(false)} />}
          {inviteOpen && <InviteSheet onClose={() => setInviteOpen(false)} />}
          {agendaOpen && <AgendaSheet onClose={() => setAgendaOpen(false)} />}
          {member && <MemberSheet name={member} onClose={() => setMember(null)} />}
          {activityId && <ActivitySheet id={activityId} onClose={() => setActivityId(null)} />}
          {eventId && <EventSheet id={eventId} onClose={() => setEventId(null)} />}
          {editProfileOpen && <EditProfileSheet onClose={() => setEditProfileOpen(false)} />}
          {roiInfoOpen && <RoiInfoSheet onClose={() => setRoiInfoOpen(false)} />}
          {integrationsOpen && <IntegrationsSheet onClose={() => setIntegrationsOpen(false)} />}
          <PostComposer open={composerOpen} onClose={() => setComposerOpen(false)} onPublish={publishPost} />
          <NotifDrawer />
          {onboarding && (
            <Onboarding
              onClose={finishOnboarding}
              onEditProfile={() => { finishOnboarding(); goTo('profil'); setEditProfileOpen(true) }}
            />
          )}

          <BottomNav active={tab} onChange={goTo} unread={navUnread} />
        </div>
      </div>
    </AppContext.Provider>
  )
}
