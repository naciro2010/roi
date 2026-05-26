import { useState } from 'react'
import { AppContext } from './AppContext'

import { CURRENT_USER } from './data/user'
import { CONVERSATIONS, THREADS, GROUPS, GROUP_THREADS } from './data/messages'
import { NOTIFICATIONS } from './data/notifications'
import { POSTS } from './data/feed'
import { EVENTS } from './data/events'
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

export default function App() {
  const [tab, setTab] = useState('accueil')
  const [toast, setToast] = useState(null)

  // Overlays
  const [member, setMember] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [eventId, setEventId] = useState(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  // Réseau
  const [sentSuggestions, setSentSuggestions] = useState({})
  const [contacted, setContacted] = useState({})
  const [connections, setConnections] = useState(CONNECTIONS)
  const [requests, setRequests] = useState(REQUESTS)

  // Courir — événements & activités
  const [eventKudos, setEventKudos] = useState(Object.fromEntries(EVENTS.map((a) => [a.id, { count: a.kudos, liked: false }])))
  const [joined, setJoined] = useState({})
  const [actKudos, setActKudos] = useState(Object.fromEntries(ACTIVITIES.map((a) => [a.id, { count: a.kudos, liked: false }])))

  // Feed
  const [posts, setPosts] = useState(POSTS)

  // Messages & groupes
  const [msgView, setMsgView] = useState('discussions')
  const [openConv, setOpenConv] = useState(null)
  const [openGroup, setOpenGroup] = useState(null)
  const [threads, setThreads] = useState(THREADS)
  const [draft, setDraft] = useState('')
  const [convRead, setConvRead] = useState({})
  const [groups, setGroups] = useState(GROUPS)
  const [groupThreads, setGroupThreads] = useState(GROUP_THREADS)
  const [groupRead, setGroupRead] = useState({})
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [joinedGroups, setJoinedGroups] = useState({})

  // Profil
  const [needs, setNeeds] = useState(CURRENT_USER.needs)
  const [editingNeeds, setEditingNeeds] = useState(false)
  const [needsDraft, setNeedsDraft] = useState(CURRENT_USER.needs)

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

  function contactMember(name) {
    setContacted((c) => ({ ...c, [name]: true }))
    showToast('Demande envoyée ✓')
  }

  function sendSuggestion(id, name) {
    setSentSuggestions((s) => ({ ...s, [id]: true }))
    if (name) setContacted((c) => ({ ...c, [name]: true }))
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
    } else return
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

  const ctx = {
    tab, goTo, showToast,
    openMember: setMember,
    openActivity: setActivityId,
    openEvent: setEventId,
    openComposer: () => setComposerOpen(true),
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
    needs, editingNeeds, needsDraft, setNeedsDraft, startEditNeeds, saveNeeds,
    setEditingNeeds,
  }

  const inChat = tab === 'messages' && (openConv || openGroup)
  const showHeader = !inChat && tab !== 'profil'

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
        <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={() => setNotifOpen(false)} />
        <div className="animate-drawerIn absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-float">
          <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-4 py-4">
            <h2 className="text-lg font-extrabold text-ink-900">Notifications</h2>
            <button onClick={() => setNotifOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-500 tap" aria-label="Fermer">
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

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-ink-100 bg-mesh sm:py-8">
        <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-ink-50 shadow-ring sm:h-[860px] sm:max-h-[94vh] sm:rounded-[2.75rem] sm:ring-[10px] sm:ring-ink-950">
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-ink-950 sm:block" />

          {showHeader && (
            <header className="glass z-20 flex shrink-0 items-center justify-between border-b border-ink-100 px-5 pb-3 pt-4 sm:pt-7">
              <Logo />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNotifOpen(true)}
                  className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 tap hover:bg-ink-100"
                  aria-label="Notifications"
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

          {member && <MemberSheet name={member} onClose={() => setMember(null)} />}
          {activityId && <ActivitySheet id={activityId} onClose={() => setActivityId(null)} />}
          {eventId && <EventSheet id={eventId} onClose={() => setEventId(null)} />}
          <PostComposer open={composerOpen} onClose={() => setComposerOpen(false)} onPublish={publishPost} />
          <NotifDrawer />

          <BottomNav active={tab} onChange={goTo} unread={navUnread} />
        </div>
      </div>
    </AppContext.Provider>
  )
}
