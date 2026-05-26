import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { EVENTS } from '../data/events'

export default function EventSheet({ id, onClose }) {
  const { joined, toggleJoin, eventKudos, toggleEventKudos, openMember, contacted, contactMember, showToast } = useApp()
  const e = EVENTS.find((x) => x.id === id)
  if (!e) return null
  const k = eventKudos[e.id]
  const isJoined = joined[e.id]
  const others = e.attendees.filter((n) => n !== e.organizer)

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
        {/* Carte du parcours */}
        <div className="relative h-48 shrink-0 bg-ink-100">
          {e.route ? <RouteMap route={e.route} className="h-full w-full" /> : <div className="absolute inset-0 bg-hero-glow bg-ink-950" />}
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 z-[500] grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <span className="pointer-events-none absolute left-4 top-3 z-[500] rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-ink-700 shadow-soft backdrop-blur">
            {e.day} · {e.time}
            {e.tag && <span className="ml-1 text-brand-600">{e.tag}</span>}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar name={e.organizer} size="md" onClick={() => openMember(e.organizer)} />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-ink-400">Organisé par</div>
              <button onClick={() => openMember(e.organizer)} className="truncate font-bold text-ink-900">{e.organizer}</button>
            </div>
            <button
              onClick={() => toggleEventKudos(e.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                k.liked ? 'bg-[#EFE5E6] text-[#8C5560]' : 'bg-ink-100 text-ink-500'
              }`}
            >
              <Icon name="heart" className="h-4 w-4" filled={k.liked} />
              {k.count}
            </button>
          </div>

          <h2 className="mt-3 text-lg font-extrabold text-ink-900">{e.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-ink-600">
            <span className="inline-flex items-center gap-1"><Icon name="route" className="h-4 w-4 text-ink-400" /> {e.distance}</span>
            <span className="text-ink-300">·</span>
            <span>{e.pace}</span>
            <span className="text-ink-300">·</span>
            <span>{e.level}</span>
          </div>

          <button
            onClick={() => showToast('Itinéraire bientôt disponible')}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-ink-50 px-3.5 py-3 text-left tap"
          >
            <Icon name="mapPin" className="h-5 w-5 shrink-0 text-brand-600" />
            <span className="flex-1 text-sm font-semibold text-ink-800">{e.place}</span>
            <span className="text-xs font-bold text-brand-600">Itinéraire</span>
          </button>

          {e.description && <p className="mt-4 text-[14px] leading-relaxed text-ink-700">{e.description}</p>}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
              <Icon name="users" className="h-3.5 w-3.5" /> Participants · {e.participants}
            </div>
            <div className="space-y-2">
              {others.map((name) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-2.5 shadow-soft">
                  <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                  <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-bold text-ink-900">{name}</button>
                  <button
                    onClick={() => contactMember(name)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold tap ${
                      contacted[name] ? 'bg-[#EAEEEB] text-[#48584E]' : 'bg-brand-500 text-white shadow-brand'
                    }`}
                  >
                    {contacted[name] ? 'Demandé ✓' : 'Connecter'}
                  </button>
                </div>
              ))}
              {e.participants > others.length && (
                <p className="pt-1 text-center text-xs text-ink-400">+ {e.participants - others.length} autres inscrits</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass flex shrink-0 items-center gap-2 border-t border-ink-100 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => toggleJoin(e.id)}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white tap ${isJoined ? 'bg-[#4E6B59]' : 'bg-ink-900 shadow-brand'}`}
          >
            {isJoined ? 'Inscrit ✓' : 'Je participe'}
          </button>
          <button
            onClick={() => showToast('Ajouté à ton agenda ✓')}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-ink-200 text-ink-700 tap"
            aria-label="Ajouter au calendrier"
          >
            <Icon name="calendar" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
