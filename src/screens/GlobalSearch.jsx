import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { MEMBERS, PEOPLE, personFor } from '../data/network'
import { ACTIVITIES } from '../data/activities'
import { EVENTS } from '../data/events'
import { POSTS, POST_TYPES } from '../data/feed'
import { GROUPS } from '../data/messages'

const PEOPLE_NAMES = Array.from(new Set([...MEMBERS.map((m) => m.name), ...Object.keys(PEOPLE)]))

function ResultRow({ icon, tone = 'ico', avatar, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-2 py-2.5 text-left tap hover:bg-black/[0.04]">
      {avatar ? (
        <Avatar name={avatar} size="sm" />
      ) : (
        <span className={tone}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-fg">{title}</div>
        <div className="mt-0.5 truncate text-[13px] text-fg-muted">{subtitle}</div>
      </div>
      <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-fg-faint" />
    </button>
  )
}

function Group({ label, children }) {
  return (
    <section>
      <p className="titre-section mb-1.5 px-2">{label}</p>
      <div>{children}</div>
    </section>
  )
}

export default function GlobalSearch({ onClose }) {
  const { openMember, openActivity, openEvent, goTo, setMsgView } = useApp()
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const has = (s) => s.toLowerCase().includes(query)

  const people = query ? PEOPLE_NAMES.filter((n) => has(n) || has(personFor(n).title)).slice(0, 5) : []
  const activities = query ? ACTIVITIES.filter((a) => has(a.title) || has(a.athlete) || has(a.type)).slice(0, 4) : []
  const events = query ? EVENTS.filter((e) => has(e.title) || has(e.place)).slice(0, 4) : []
  const posts = query ? POSTS.filter((p) => has(p.text) || has(p.author)).slice(0, 4) : []
  const groups = query ? GROUPS.filter((g) => has(g.name) || has(g.topic)).slice(0, 4) : []
  const total = people.length + activities.length + events.length + posts.length + groups.length

  function go(fn) { onClose(); fn() }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-surface-soft">
      <div className="glass z-10 flex shrink-0 items-center gap-2 border-b border-line px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button onClick={onClose} className="p-1.5 text-fg-muted tap" aria-label="Retour">
          <Icon name="arrowLeft" className="h-6 w-6" />
        </button>
        <div className="champ flex flex-1 items-center gap-2">
          <Icon name="search" className="h-4 w-4 text-fg-faint" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cherche un nom, une entreprise, une sortie…"
            className="input-ligne text-[14.5px]"
          />
          {q && (
            <button onClick={() => setQ('')} className="text-fg-faint tap" aria-label="Effacer">
              <Icon name="x" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-3 py-4">
        {!query && (
          <div className="grid place-items-center py-16 text-center">
            <span className="grid h-14 w-14 place-items-center bg-surface-2 text-fg-faint">
              <Icon name="search" className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-semibold text-fg-soft">Cherche dans tout R.O.I</p>
            <p className="text-xs text-fg-faint">Les dossards, les sorties, les cercles et le fil.</p>
          </div>
        )}

        {query && total === 0 && (
          <div className="grid place-items-center py-16 text-center">
            <p className="text-sm font-semibold text-fg-soft">Rien pour « {q} »</p>
            <p className="text-xs text-fg-faint">Essaie un nom, une entreprise ou l'un des quatre verbes.</p>
          </div>
        )}

        {people.length > 0 && (
          <Group label="Dossards">
            {people.map((n) => (
              <ResultRow key={n} avatar={n} title={n} subtitle={personFor(n).title} onClick={() => go(() => openMember(n))} />
            ))}
          </Group>
        )}

        {activities.length > 0 && (
          <Group label="Kilomètres courus">
            {activities.map((a) => (
              <ResultRow key={a.id} icon="activity" tone="ico plein" title={a.title} subtitle={`${a.athlete} · ${a.distance.toFixed(1)} km`} onClick={() => go(() => openActivity(a.id))} />
            ))}
          </Group>
        )}

        {events.length > 0 && (
          <Group label="Sorties">
            {events.map((e) => (
              <ResultRow key={e.id} icon="calendar" tone="ico" title={e.title} subtitle={`${e.day} ${e.time} · ${e.place}`} onClick={() => go(() => openEvent(e.id))} />
            ))}
          </Group>
        )}

        {posts.length > 0 && (
          <Group label="Le fil">
            {posts.map((p) => (
              <ResultRow key={p.id} icon={POST_TYPES[p.type].icon} tone="ico" title={p.author} subtitle={`${POST_TYPES[p.type].label} · ${p.text.replace(/\n/g, ' ').slice(0, 48)}…`} onClick={() => go(() => goTo('accueil'))} />
            ))}
          </Group>
        )}

        {groups.length > 0 && (
          <Group label="Cercles">
            {groups.map((g) => (
              <ResultRow key={g.id} icon="users" title={g.name} subtitle={`${g.topic} · ${g.members} membres`} onClick={() => go(() => { goTo('messages'); setMsgView('groupes') })} />
            ))}
          </Group>
        )}
      </div>
    </div>
  )
}
