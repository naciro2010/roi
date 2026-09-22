import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { CONVERSATIONS } from '../data/messages'
import { personFor } from '../data/network'

/* La barre de saisie : une pilule, et un bouton d'envoi rond orange.
   Entrée vaut envoi. */
function Composer({ draft, setDraft, onSend, verrouille, onReprendre }) {
  if (verrouille) {
    return (
      <button
        onClick={onReprendre}
        className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface py-3 pl-4 pr-5 text-left tap"
      >
        <Icon name="lock" className="h-[17px] w-[17px] shrink-0 text-fg-faint" />
        <span className="min-w-0 flex-1 text-[14px] text-fg-muted">Abonnement expiré — tu peux lire, pas répondre.</span>
        <span className="shrink-0 text-[13.5px] font-semibold text-brand-500">Reprendre</span>
      </button>
    )
  }
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-4 pr-2">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder="Écrire un message…"
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14.5px] outline-none"
      />
      <button
        onClick={onSend}
        disabled={!draft.trim()}
        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-brand-500 text-craie tap disabled:opacity-40"
        aria-label="Envoyer"
      >
        <Icon name="send" className="h-[17px] w-[17px]" />
      </button>
    </div>
  )
}

/* Une bulle : les tiennes en encre, les leurs sur le fond surface. Le coin
   bas du côté de l'expéditeur est resserré à 6 px. */
function Bulle({ mine, children }) {
  return (
    <span
      className={`max-w-[78%] px-[15px] py-[11px] text-[14.5px] leading-[1.45] ${
        mine ? 'bg-encre text-craie' : 'bg-surface text-fg-soft'
      }`}
      style={{
        borderRadius: 18,
        borderBottomRightRadius: mine ? 6 : 18,
        borderBottomLeftRadius: mine ? 18 : 6,
      }}
    >
      {children}
    </span>
  )
}

/* L'en-tête d'une conversation ouverte : retour, avatar, nom, titre. */
function EnTete({ onBack, avatar, titre, sous, onOpen }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-line-soft pb-3.5">
      <button onClick={onBack} className="rond tap" aria-label="Retour">
        <Icon name="arrowLeft" className="h-[17px] w-[17px]" />
      </button>
      {avatar}
      <button onClick={onOpen} className="min-w-0 text-left" disabled={!onOpen}>
        <span className="block truncate text-[16px] font-semibold text-fg">{titre}</span>
        <span className="block truncate text-[13px] text-fg-faint">{sous}</span>
      </button>
    </div>
  )
}

export default function Messages() {
  const {
    openConv, openGroup, openChat, openGroupChat, closeChat,
    threads, draft, setDraft, sendMessage, convRead,
    groups, groupThreads, groupRead, openMember, lectureSeule, openPlans,
  } = useApp()

  /* --- Une conversation en tête à tête --- */
  if (openConv) {
    const conv = CONVERSATIONS.find((c) => c.id === openConv)
    const msgs = threads[openConv] || []
    return (
      <div className="flex h-full flex-col px-5 pb-5 pt-2">
        <EnTete
          onBack={closeChat}
          avatar={<Avatar name={conv.name} size="md" onClick={() => openMember(conv.name)} />}
          titre={conv.name}
          sous={personFor(conv.name).title}
          onOpen={() => openMember(conv.name)}
        />
        <div className="no-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <Bulle mine={m.from === 'me'}>{m.text}</Bulle>
            </div>
          ))}
        </div>
        <Composer draft={draft} setDraft={setDraft} onSend={sendMessage} verrouille={lectureSeule} onReprendre={openPlans} />
      </div>
    )
  }

  /* --- Un groupe de sortie --- */
  if (openGroup) {
    const grp = groups.find((g) => g.id === openGroup)
    const msgs = groupThreads[openGroup] || []
    return (
      <div className="flex h-full flex-col px-5 pb-5 pt-2">
        <EnTete
          onBack={closeChat}
          avatar={<span className="ico"><Icon name="users" className="h-[18px] w-[18px]" /></span>}
          titre={grp.name}
          sous={`${grp.members} membres`}
        />
        <div className="no-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto py-4">
          {msgs.length === 0 && (
            <p className="py-10 text-center text-[14px] text-fg-faint">Ouvre la conversation du groupe.</p>
          )}
          {msgs.map((m, i) => {
            const mine = m.from === 'me'
            const montreNom = !mine && msgs[i - 1]?.from !== m.from
            return (
              <div key={i} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                {montreNom && <span className="mb-1 ml-1 text-[12.5px] text-fg-faint">{m.from.split(' ')[0]}</span>}
                <Bulle mine={mine}>{m.text}</Bulle>
              </div>
            )
          })}
        </div>
        <Composer draft={draft} setDraft={setDraft} onSend={sendMessage} verrouille={lectureSeule} onReprendre={openPlans} />
      </div>
    )
  }

  /* --- La liste : les conversations, puis les groupes, au même gabarit --- */
  const lignes = [
    ...CONVERSATIONS.map((c) => {
      const thread = threads[c.id] || []
      const last = thread[thread.length - 1]
      return {
        key: c.id,
        name: c.name,
        avatar: <Avatar name={c.name} size="lg" />,
        extrait: last ? `${last.from === 'me' ? 'Toi : ' : ''}${last.text}` : c.last,
        time: c.time,
        unread: c.unread && !convRead[c.id],
        open: () => openChat(c.id),
      }
    }),
    ...groups.map((g) => {
      const thread = groupThreads[g.id] || []
      const last = thread[thread.length - 1]
      return {
        key: g.id,
        name: g.name,
        avatar: <span className="ico h-[46px] w-[46px]"><Icon name="users" className="h-[19px] w-[19px]" /></span>,
        extrait: last ? `${last.from === 'me' ? 'Toi' : last.from.split(' ')[0]} : ${last.text}` : g.topic,
        time: g.time,
        unread: g.unread > 0 && !groupRead[g.id],
        open: () => openGroupChat(g.id),
      }
    }),
  ]

  return (
    <div className="animate-screenIn no-scrollbar h-full overflow-y-auto px-5 pb-7 pt-2">
      <h1 className="text-[27px]">Messages</h1>
      <p className="mt-1.5 text-[14px] leading-[1.5] text-fg-muted">Tes conversations, et les groupes de sortie.</p>

      <div className="mt-[18px] flex flex-col">
        {lignes.map((l) => (
          <button
            key={l.key}
            onClick={l.open}
            className="flex items-center gap-3.5 border-b border-line-soft px-1 py-3.5 text-left tap"
          >
            {l.avatar}
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className={`min-w-0 flex-1 truncate text-[15.5px] ${l.unread ? 'font-semibold' : 'font-medium'}`}>
                  {l.name}
                </span>
                <span className="shrink-0 text-[12.5px] text-fg-faint">{l.time}</span>
              </span>
              <span className={`mt-0.5 block truncate text-[13.5px] ${l.unread ? 'text-fg-soft' : 'text-fg-faint'}`}>
                {l.extrait}
              </span>
            </span>
            {l.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />}
          </button>
        ))}
      </div>
    </div>
  )
}
