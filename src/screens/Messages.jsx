import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { CONVERSATIONS, GROUP_SUGGESTIONS } from '../data/messages'

function ChatComposer({ placeholder, draft, setDraft, onSend }) {
  return (
    <div className="glass flex shrink-0 items-center gap-2 border-t border-line px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder={placeholder}
        className="flex-1 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
      />
      <button
        onClick={onSend}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand tap disabled:opacity-40"
        disabled={!draft.trim()}
        aria-label="Envoyer"
      >
        <Icon name="send" className="h-5 w-5" />
      </button>
    </div>
  )
}

export default function Messages() {
  const {
    msgView, setMsgView, openConv, openGroup, openChat, openGroupChat, closeChat,
    threads, draft, setDraft, sendMessage, convRead,
    groups, groupThreads, groupRead, creatingGroup, setCreatingGroup,
    newGroupName, setNewGroupName, createGroup, joinedGroups, joinGroup, openMember,
  } = useApp()

  const unreadConv = CONVERSATIONS.filter((c) => c.unread && !convRead[c.id]).length
  const unreadGroups = groups.filter((g) => g.unread > 0 && !groupRead[g.id]).length

  /* --- Chat 1:1 --- */
  if (openConv) {
    const conv = CONVERSATIONS.find((c) => c.id === openConv)
    const msgs = threads[openConv]
    return (
      <div className="flex h-full flex-col bg-surface-soft">
        <div className="glass z-10 flex shrink-0 items-center gap-3 border-b border-line px-3 py-3">
          <button onClick={closeChat} className="rounded-full p-1.5 text-fg-muted tap" aria-label="Retour">
            <Icon name="arrowLeft" className="h-6 w-6" />
          </button>
          <Avatar name={conv.name} size="sm" onClick={() => openMember(conv.name)} />
          <button onClick={() => openMember(conv.name)} className="min-w-0 text-left">
            <div className="truncate font-bold text-fg">{conv.name}</div>
            <div className="truncate text-[11px] text-success">● En ligne</div>
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                  m.from === 'me' ? 'rounded-br-md bg-gradient-to-b from-brand-500 to-brand-600 text-white' : 'rounded-bl-md border border-line bg-surface text-fg'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <ChatComposer placeholder="Écris un message…" draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    )
  }

  /* --- Chat de groupe --- */
  if (openGroup) {
    const grp = groups.find((g) => g.id === openGroup)
    const msgs = groupThreads[openGroup] || []
    return (
      <div className="flex h-full flex-col bg-surface-soft">
        <div className="glass z-10 flex shrink-0 items-center gap-3 border-b border-line px-3 py-3">
          <button onClick={closeChat} className="rounded-full p-1.5 text-fg-muted tap" aria-label="Retour">
            <Icon name="arrowLeft" className="h-6 w-6" />
          </button>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-canvas">
            <Icon name="users" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-bold text-fg">{grp.name}</div>
            <div className="truncate text-[11px] text-fg-faint">{grp.members} membres</div>
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar px-4 py-4">
          {msgs.length === 0 && <p className="py-10 text-center text-sm text-fg-faint">Lance la discussion du groupe 👋</p>}
          {msgs.map((m, i) => {
            const mine = m.from === 'me'
            const showName = !mine && msgs[i - 1]?.from !== m.from
            return (
              <div key={i} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                {!mine && (
                  <div className="w-7 shrink-0">
                    {msgs[i + 1]?.from !== m.from && <Avatar name={m.from} size="xs" onClick={() => openMember(m.from)} />}
                  </div>
                )}
                <div className="max-w-[76%]">
                  {showName && <div className="mb-0.5 ml-1 text-[11px] font-bold text-fg-muted">{m.from.split(' ')[0]}</div>}
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                      mine ? 'rounded-br-md bg-gradient-to-b from-brand-500 to-brand-600 text-white' : 'rounded-bl-md border border-line bg-surface text-fg'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <ChatComposer placeholder={`Message à ${grp.name}…`} draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    )
  }

  /* --- Liste : Discussions / Groupes --- */
  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-2xl font-extrabold text-fg">Messages</h1>
        <div className="mt-4 flex gap-1 rounded-2xl bg-surface-2 p-1">
          {[
            { id: 'discussions', label: 'Discussions', n: unreadConv },
            { id: 'groupes', label: 'Groupes', n: unreadGroups },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setMsgView(s.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition tap ${
                msgView === s.id ? 'bg-surface-3 text-fg shadow-card' : 'text-fg-muted'
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
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left tap hover:bg-black/[0.04]"
              >
                <Avatar name={c.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-bold text-fg">{c.name}</span>
                    <span className={`shrink-0 text-xs ${unread ? 'font-bold text-brand-600' : 'text-fg-faint'}`}>{c.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${unread ? 'font-semibold text-fg-soft' : 'text-fg-faint'}`}>
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
          {creatingGroup ? (
            <div className="mb-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-3">
              <input
                autoFocus
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                placeholder="Nom du groupe…"
                className="w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={createGroup} className="flex-1 rounded-xl bg-brand-500 py-2 text-sm font-bold text-white tap">Créer</button>
                <button onClick={() => { setCreatingGroup(false); setNewGroupName('') }} className="rounded-xl border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-fg-soft tap">Annuler</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setCreatingGroup(true)} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-line-strong px-3 py-3 text-left tap hover:bg-black/[0.04]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="plus" className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-fg">Créer un groupe</div>
                <div className="text-xs text-fg-faint">Rassemble ta team ou ton club</div>
              </div>
            </button>
          )}

          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-fg-faint">Mes groupes</p>
          <div className="space-y-1">
            {groups.map((g) => {
              const thread = groupThreads[g.id] || []
              const last = thread[thread.length - 1]
              const unread = g.unread > 0 && !groupRead[g.id]
              return (
                <button
                  key={g.id}
                  onClick={() => openGroupChat(g.id)}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left tap hover:bg-black/[0.04]"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-fg text-canvas">
                    <Icon name="users" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold text-fg">{g.name}</span>
                      <span className={`shrink-0 text-xs ${unread ? 'font-bold text-brand-600' : 'text-fg-faint'}`}>{g.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${unread ? 'font-semibold text-fg-soft' : 'text-fg-faint'}`}>
                        {last ? `${last.from === 'me' ? 'Toi' : last.from.split(' ')[0]} : ${last.text}` : g.topic}
                      </span>
                      {unread ? (
                        <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{g.unread}</span>
                      ) : (
                        <span className="shrink-0 text-[11px] text-fg-faint">{g.members} membres</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-fg-faint">À découvrir</p>
          <div className="space-y-2">
            {GROUP_SUGGESTIONS.map((g) => (
              <div key={g.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-soft">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-fg-muted">
                  <Icon name="users" className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-fg">{g.name}</div>
                  <div className="truncate text-xs text-fg-faint">{g.topic} · {g.members} membres</div>
                </div>
                <button
                  onClick={() => joinGroup(g)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tap ${
                    joinedGroups[g.id] ? 'bg-success-light text-success-dark' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand'
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
