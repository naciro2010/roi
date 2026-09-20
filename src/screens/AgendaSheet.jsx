import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { PILL_TONES } from '../components/primitives'
import { MEETING_TYPES } from '../data/meetings'
import { MEMBERS } from '../data/network'
import { formatEventDate } from '../lib/dates'
import { useSheetDrag } from '../lib/useSheetDrag'

const CHAMP = 'w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-brand-200'
const ETIQUETTE = 'mb-1.5 block font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg-muted'

/* Lieu par défaut selon le « où » choisi. */
const LIEU_PAR_TYPE = {
  cafe: 'Un café, à choisir ensemble',
  run: 'Départ à choisir ensemble',
  visio: 'En visio',
  deal: 'Paris La Défense Arena · le jour J',
}

function dansTroisJours() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* Formulaire : proposer une rencontre de huit minutes. */
function ProposeForm({ onSubmit, onCancel }) {
  const [who, setWho] = useState(MEMBERS[0]?.name || '')
  const [type, setType] = useState('cafe')
  const [date, setDate] = useState(dansTroisJours())
  const [time, setTime] = useState('09:00')
  const [sujet, setSujet] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!who) return
    onSubmit({ with: who, type, date, time, place: LIEU_PAR_TYPE[type], note: sujet.trim() || 'Huit minutes, un sujet' })
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-3xl border border-brand-200 bg-surface p-4 shadow-card">
      <div>
        <label htmlFor="rdv-who" className={ETIQUETTE}>Avec qui</label>
        <select id="rdv-who" value={who} onChange={(e) => setWho(e.target.value)} className={CHAMP}>
          {MEMBERS.map((m) => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>

      <div>
        <span className={ETIQUETTE}>Où</span>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(MEETING_TYPES).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              aria-pressed={type === key}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[13px] font-semibold tap ${
                type === key ? 'border-fg bg-fg text-canvas' : 'border-line text-fg-soft'
              }`}
            >
              <Icon name={meta.icon} className="h-4 w-4 shrink-0" /> {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={ETIQUETTE}>Quand</span>
        <div className="grid grid-cols-[1fr_auto] gap-1.5">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={CHAMP} aria-label="Le jour" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${CHAMP} w-28`} aria-label="L'heure" />
        </div>
      </div>

      <div>
        <label htmlFor="rdv-sujet" className={ETIQUETTE}>Le sujet</label>
        <input
          id="rdv-sujet"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          placeholder="Recruter, lever, vendre, s'associer…"
          className={CHAMP}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button type="submit" className="btn btn-impact btn-sm flex-1">
          <span>Proposer la rencontre</span><span className="arr">→</span>
        </button>
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
          <span>Annuler</span>
        </button>
      </div>
    </form>
  )
}

export default function AgendaSheet({ onClose }) {
  const { meetings, confirmMeeting, proposeMeeting, openMember, showToast, hasFeature, openPlans } = useApp()
  const drag = useSheetDrag(onClose)
  const [proposing, setProposing] = useState(false)

  const sorted = [...meetings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const confirmedCount = meetings.filter((m) => m.status === 'confirmed').length
  const unlimited = hasFeature('agenda')

  function submitProposal(payload) {
    proposeMeeting(payload)
    setProposing(false)
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-surface-soft shadow-float"
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
          <div className="relative pr-10">
            <span className="tmark text-craie/70"><b>T+</b> / L'AGENDA</span>
            <h2 className="titre mt-2 text-[22px] leading-tight text-craie">Tes rencontres</h2>
            <p className="mt-2 text-[12.5px] leading-snug text-white/65">
              Huit minutes, un sujet : recruter, lever, vendre, s'associer. À l'Arena le jour J, en courant, autour d'un café ou en visio.
            </p>
            <p className="mt-2 font-mono text-[9.5px] uppercase tracking-mono text-white/55">
              {meetings.length} à venir · {confirmedCount} confirmée{confirmedCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {proposing ? (
            <ProposeForm onSubmit={submitProposal} onCancel={() => setProposing(false)} />
          ) : (
            <button onClick={() => setProposing(true)} className="btn btn-encre w-full">
              <span>Proposer une rencontre</span><span className="arr">→</span>
            </button>
          )}

          {!unlimited && (
            <button
              onClick={openPlans}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left shadow-soft tap"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-fg">
                <Icon name="lock" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-fg-soft">
                Six rencontres réservées à l'avance en Premium, depuis ton espace.
              </span>
              <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-mono text-brand-600">Premium →</span>
            </button>
          )}

          {sorted.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center text-[12px] text-fg-faint">
              Aucune rencontre à venir. Propose-en une, ou laisse une sortie s'en charger.
            </p>
          )}

          {sorted.map((m) => {
            const meta = MEETING_TYPES[m.type] || MEETING_TYPES.cafe
            const d = formatEventDate(m.date)
            const confirmed = m.status === 'confirmed'
            const prenom = m.with.split(' ')[0]
            return (
              <article key={m.id} className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <Avatar name={m.with} size="md" onClick={() => openMember(m.with)} />
                  <button onClick={() => openMember(m.with)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-fg">{meta.label} avec {prenom}</span>
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
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">{d.relative}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      confirmed ? 'bg-success-light text-success-dark' : 'bg-surface-2 text-fg-muted'
                    }`}
                  >
                    {confirmed ? 'Confirmée' : 'À confirmer'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-fg-muted">
                  <Icon name="mapPin" className="h-4 w-4 shrink-0 text-fg-faint" /> {m.place}
                </div>
                {m.note && (
                  <p className="mt-2 text-[13px] leading-snug text-fg-soft">
                    <span className="font-semibold text-fg">Le sujet</span> · {m.note}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2">
                  {confirmed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1.5 text-[12px] font-semibold text-success-dark">
                      <Icon name="checkCircle" className="h-4 w-4" /> Confirmée
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => confirmMeeting(m.id)}
                        className="btn btn-impact btn-sm flex-1"
                      >
                        <span>Confirmer</span><span className="arr">→</span>
                      </button>
                      <button
                        onClick={() => showToast(`Autre créneau proposé à ${prenom}`)}
                        className="btn btn-ghost btn-sm"
                      >
                        <span>Proposer un autre créneau</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => showToast('Dans ton calendrier')}
                    className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line-strong text-fg-soft tap"
                    aria-label="Ajouter à ton calendrier"
                  >
                    <Icon name="calendar" className="h-5 w-5" />
                  </button>
                </div>
              </article>
            )
          })}

          <p className="pt-1 text-center text-[11px] text-fg-faint">
            Tes sorties et ton binôme créent tes rencontres, sans rien saisir.
          </p>
        </div>
      </div>
    </div>
  )
}
