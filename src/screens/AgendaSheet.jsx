import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { PILL_TONES } from '../components/primitives'
import { MEETING_TYPES } from '../data/meetings'
import { formatEventDate } from '../lib/dates'
import { useSheetDrag } from '../lib/useSheetDrag'

export default function AgendaSheet({ onClose }) {
  const { meetings, confirmMeeting, openMember, showToast } = useApp()
  const drag = useSheetDrag(onClose)

  const sorted = [...meetings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const confirmedCount = meetings.filter((m) => m.status === 'confirmed').length

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface-soft shadow-float"
      >
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden surface-hero px-5 pb-5 pt-3 text-white">
          <div className="absolute inset-0 bg-hero-glow" />
          <div {...drag.handleProps} className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-white/30" aria-hidden="true" />
          <button
            onClick={onClose}
            className="glass-dark absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-white tap"
            aria-label="Fermer"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/15 text-white">
              <Icon name="calendar" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">Agenda & RDV</h2>
              <p className="text-[12.5px] text-white/65">
                {meetings.length} à venir · {confirmedCount} confirmé{confirmedCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {sorted.map((m) => {
            const meta = MEETING_TYPES[m.type]
            const d = formatEventDate(m.date)
            const confirmed = m.status === 'confirmed'
            return (
              <article key={m.id} className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <Avatar name={m.with} size="md" onClick={() => openMember(m.with)} />
                  <button onClick={() => openMember(m.with)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-bold text-fg">{meta.label} avec {m.with.split(' ')[0]}</span>
                    </div>
                    <div className="truncate text-[12px] text-fg-muted">{m.with}</div>
                  </button>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[meta.tone]}`}>
                    <Icon name={meta.icon} className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-fg-soft">
                    <Icon name="calendar" className="h-4 w-4 text-brand-400" /> {d.full} · {m.time}
                  </span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">{d.relative}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-fg-muted">
                  <Icon name="mapPin" className="h-4 w-4 shrink-0 text-fg-faint" /> {m.place}
                </div>
                {m.note && <p className="mt-2 text-[13px] leading-snug text-fg-soft">{m.note}</p>}

                <div className="mt-3 flex items-center gap-2">
                  {confirmed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1.5 text-[12px] font-bold text-success-dark">
                      <Icon name="checkCircle" className="h-4 w-4" /> Confirmé
                    </span>
                  ) : (
                    <button
                      onClick={() => confirmMeeting(m.id)}
                      className="flex-1 rounded-2xl bg-brand-500 py-2.5 text-sm font-bold text-white shadow-brand tap"
                    >
                      Confirmer le RDV
                    </button>
                  )}
                  <button
                    onClick={() => showToast('Ajouté à ton calendrier ✓')}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line-strong text-fg-soft tap"
                    aria-label="Ajouter au calendrier"
                  >
                    <Icon name="calendar" className="h-5 w-5" />
                  </button>
                </div>
              </article>
            )
          })}

          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-fg-faint">
            <Icon name="sparkles" className="h-3.5 w-3.5" filled /> Tes sorties et tes matchs créent tes RDV automatiquement.
          </p>
        </div>
      </div>
    </div>
  )
}
