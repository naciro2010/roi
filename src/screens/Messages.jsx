import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { CONVERSATIONS, GROUP_SUGGESTIONS } from '../data/messages'
import { personFor } from '../data/network'

function ChatComposer({ placeholder, draft, setDraft, onSend }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-fg bg-canvas px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder={placeholder}
        className="input-ligne flex-1 text-sm"
      />
      <button onClick={onSend} className="ico impact h-11 w-11 tap disabled:opacity-40" disabled={!draft.trim()} aria-label="Envoyer">
        <Icon name="send" className="h-5 w-5" />
      </button>
    </div>
  )
}

/* Une bulle : les tiennes en encre, les leurs sur un filet. Pas d'arrondi. */
function Bulle({ mine, children }) {
  return (
    <div className={`max-w-[78%] px-3.5 py-2 text-sm leading-relaxed ${mine ? 'bg-encre text-craie' : 'border border-line bg-canvas text-fg'}`}>
      {children}
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
      <div className="flex h-full flex-col bg-canvas">
        <div className="z-10 flex shrink-0 items-center gap-3 border-b border-fg px-3 py-3">
          <button onClick={closeChat} className="p-1.5 text-fg-muted tap" aria-label="Retour">
            <Icon name="arrowLeft" className="h-6 w-6" />
          </button>
          <Avatar name={conv.name} size="sm" onClick={() => openMember(conv.name)} />
          <button onClick={() => openMember(conv.name)} className="min-w-0 text-left">
            <div className="truncate text-sm font-medium text-fg">{conv.name}</div>
            <div className="truncate font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{personFor(conv.name).title}</div>
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <Bulle mine={m.from === 'me'}>{m.text}</Bulle>
            </div>
          ))}
        </div>

        <ChatComposer placeholder="Écris ton message…" draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    )
  }

  /* --- Chat de cercle --- */
  if (openGroup) {
    const grp = groups.find((g) => g.id === openGroup)
    const msgs = groupThreads[openGroup] || []
    return (
      <div className="flex h-full flex-col bg-canvas">
        <div className="z-10 flex shrink-0 items-center gap-3 border-b border-fg px-3 py-3">
          <button onClick={closeChat} className="p-1.5 text-fg-muted tap" aria-label="Retour">
            <Icon name="arrowLeft" className="h-6 w-6" />
          </button>
          <span className="ico plein"><Icon name="users" className="h-4 w-4" /></span>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-fg">{grp.name}</div>
            <div className="truncate font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{grp.members} membres</div>
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar px-4 py-4">
          {msgs.length === 0 && <p className="py-10 text-center font-mono text-[10px] uppercase tracking-mono text-fg-faint">Ouvre la conversation du cercle</p>}
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
                  {showName && <div className="mb-1 ml-1 text-[12.5px] font-medium text-fg-muted">{m.from.split(' ')[0]}</div>}
                  <Bulle mine={mine}>{m.text}</Bulle>
                </div>
              </div>
            )
          })}
        </div>

        <ChatComposer placeholder="Écris ton message…" draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    )
  }

  /* --- Liste : Rencontres / Cercles --- */
  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-[28px]">Messages</h1>
        <p className="aide mt-1">Tes conversations en tête à tête, et les groupes que tu as rejoints.</p>
        <div className="mt-4 flex divide-x divide-line border border-line">
          {[
            { id: 'discussions', label: 'Conversations', n: unreadConv },
            { id: 'groupes', label: 'Groupes', n: unreadGroups },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setMsgView(s.id)}
              aria-current={msgView === s.id ? 'page' : undefined}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 font-mono text-[11px] font-bold uppercase tracking-mono transition tap ${msgView === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
            >
              {s.label}
              {s.n > 0 && (
                <span className="grid h-4 min-w-4 place-items-center bg-brand-500 px-1 font-mono text-[9px] font-bold text-craie">{s.n}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {msgView === 'discussions' ? (
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-2">
          <div className="border-b border-line">
            {CONVERSATIONS.map((c) => {
              const last = threads[c.id][threads[c.id].length - 1]
              const unread = c.unread && !convRead[c.id]
              return (
                <button key={c.id} onClick={() => openChat(c.id)} className="rangee tap hover:bg-surface-2">
                  <Avatar name={c.name} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-medium text-fg">{c.name}</span>
                      <span className={`shrink-0 text-[12.5px] ${unread ? 'font-medium text-brand-500' : 'text-fg-faint'}`}>{c.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-[13.5px] ${unread ? 'font-medium text-fg-soft' : 'text-fg-faint'}`}>
                        {last.from === 'me' ? 'Toi : ' : ''}
                        {last.text}
                      </span>
                      {unread && <span className="h-2 w-2 shrink-0 bg-brand-500" />}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-3">
          {creatingGroup ? (
            <div className="mb-4 border border-fg p-3.5">
              <div className="champ">
                <label htmlFor="cercle-nom">Le nom du groupe</label>
                <input
                  id="cercle-nom"
                  autoFocus
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                  placeholder="Par entreprise, par secteur, par sortie"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={createGroup} className="btn btn-impact btn-sm flex-1 justify-between"><span>Ouvrir</span><span className="arr">→</span></button>
                <button onClick={() => { setCreatingGroup(false); setNewGroupName('') }} className="btn btn-ghost btn-sm"><span>Annuler</span></button>
              </div>
            </div>
          ) : (
            <button onClick={() => setCreatingGroup(true)} className="mb-4 flex w-full items-center gap-3 border border-dashed border-line-strong px-3 py-3 text-left tap hover:bg-surface-2">
              <span className="ico"><Icon name="plus" className="h-4 w-4" /></span>
              <div>
                <div className="text-[14.5px] font-medium text-fg">Créer un groupe</div>
                <div className="mt-0.5 text-[13px] text-fg-muted">Par entreprise, par secteur, ou autour d’une sortie.</div>
              </div>
            </button>
          )}

          <h2 className="titre-section">Tes groupes · {groups.length}</h2>
          <div className="mt-1 border-b border-line">
            {groups.map((g) => {
              const thread = groupThreads[g.id] || []
              const last = thread[thread.length - 1]
              const unread = g.unread > 0 && !groupRead[g.id]
              return (
                <button key={g.id} onClick={() => openGroupChat(g.id)} className="rangee tap hover:bg-surface-2">
                  <span className="ico plein"><Icon name="users" className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-medium text-fg">{g.name}</span>
                      <span className={`shrink-0 text-[12.5px] ${unread ? 'font-medium text-brand-500' : 'text-fg-faint'}`}>{g.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-[13.5px] ${unread ? 'font-medium text-fg-soft' : 'text-fg-faint'}`}>
                        {last ? `${last.from === 'me' ? 'Toi' : last.from.split(' ')[0]} : ${last.text}` : g.topic}
                      </span>
                      {unread ? (
                        <span className="grid h-4 min-w-4 shrink-0 place-items-center bg-brand-500 px-1 font-mono text-[9px] font-bold text-craie">{g.unread}</span>
                      ) : (
                        <span className="shrink-0 text-[12.5px] text-fg-faint">{g.members} membres</span>
                      )}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <h2 className="titre-section mt-6">Des groupes à rejoindre</h2>
          <div className="mt-1 border-b border-line">
            {GROUP_SUGGESTIONS.map((g) => (
              <div key={g.id} className="rangee">
                <span className="ico"><Icon name="users" className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-medium text-fg">{g.name}</div>
                  <div className="mt-0.5 truncate text-[13px] text-fg-muted">{g.topic} · {g.members} membres</div>
                </div>
                <button onClick={() => joinGroup(g)} disabled={!!joinedGroups[g.id]} className={`btn btn-sm shrink-0 ${joinedGroups[g.id] ? 'btn-encre' : 'btn-ghost'}`}>
                  <span>{joinedGroups[g.id] ? 'Rejoint' : 'Rejoindre'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
