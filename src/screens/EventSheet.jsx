import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { EVENTS } from '../data/events'
import { formatEventDate } from '../lib/dates'
import { useSheetDrag } from '../lib/useSheetDrag'

export default function EventSheet({ id, onClose }) {
  const { joined, toggleJoin, eventKudos, toggleEventKudos, openMember, contacted, contactMember, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const e = EVENTS.find((x) => x.id === id)
  if (!e) return null
  const k = eventKudos[e.id]
  const isJoined = joined[e.id]
  const others = e.attendees.filter((n) => n !== e.organizer)
  const d = formatEventDate(e.date)

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-float">
        {/* Carte du parcours */}
        <div className="relative h-48 shrink-0 bg-surface-2">
          {e.route ? <RouteMap route={e.route} className="h-full w-full" /> : <div className="absolute inset-0 bg-hero-glow surface-hero" />}
          <div {...drag.handleProps} className="absolute left-1/2 top-0 z-[500] flex h-9 w-24 -translate-x-1/2 items-center justify-center" aria-hidden="true">
            <div className="mt-2.5 h-1.5 w-12 rounded-full bg-white/70 shadow-soft" />
          </div>
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 z-[500] grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <span className="pointer-events-none absolute left-4 top-3 z-[500] rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-fg-soft shadow-soft backdrop-blur">
            {d.relative} · {e.time}
            {e.tag && <span className="ml-1 text-brand-600">{e.tag}</span>}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar name={e.organizer} size="md" onClick={() => openMember(e.organizer)} />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-fg-faint">Organisé par</div>
              <button onClick={() => openMember(e.organizer)} className="truncate font-semibold text-fg">{e.organizer}</button>
            </div>
            <button
              onClick={() => toggleEventKudos(e.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tap ${
                k.liked ? 'bg-like-light text-like' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              <Icon name="heart" className="h-4 w-4" filled={k.liked} />
              {k.count}
            </button>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-fg">{e.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
              <Icon name="calendar" className="h-4 w-4 text-brand-600" /> {d.full} · {e.time}
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">{d.relative}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-fg-soft">
            <span className="inline-flex items-center gap-1"><Icon name="route" className="h-4 w-4 text-fg-faint" /> {e.distance}</span>
            <span className="text-fg-faint">·</span>
            <span>{e.pace}</span>
            <span className="text-fg-faint">·</span>
            <span>{e.level}</span>
          </div>

          <button
            onClick={() => showToast('Itinéraire bientôt disponible')}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-surface-soft px-3.5 py-3 text-left tap"
          >
            <Icon name="mapPin" className="h-5 w-5 shrink-0 text-brand-600" />
            <span className="flex-1 text-sm font-semibold text-fg">{e.place}</span>
            <span className="text-xs font-semibold text-brand-600">Itinéraire</span>
          </button>

          {e.description && <p className="mt-4 text-[14px] leading-relaxed text-fg-soft">{e.description}</p>}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <Icon name="users" className="h-3.5 w-3.5" /> Participants · {e.participants}
            </div>
            <div className="space-y-2">
              {others.map((name) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft">
                  <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                  <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-fg">{name}</button>
                  <button
                    onClick={() => contactMember(name)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tap ${
                      contacted[name] ? 'bg-success-light text-success-dark' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand'
                    }`}
                  >
                    {contacted[name] ? 'Demandé' : 'Connecter'}
                  </button>
                </div>
              ))}
              {e.participants > others.length && (
                <p className="pt-1 text-center text-xs text-fg-muted">+ {e.participants - others.length} autres inscrits</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass flex shrink-0 items-center gap-2 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => toggleJoin(e.id)}
            className={`flex-1 rounded-full py-3 text-sm font-semibold text-white tap ${isJoined ? 'bg-success' : 'bg-gradient-to-b from-brand-500 to-brand-600 shadow-brand'}`}
          >
            {isJoined ? 'Inscrit' : 'Je participe'}
          </button>
          <button
            onClick={() => showToast(`Ajouté à ton agenda · ${d.full}`)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-fg-soft tap"
            aria-label="Ajouter au calendrier"
          >
            <Icon name="calendar" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
