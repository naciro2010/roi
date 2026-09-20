import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { MatchRing, Badge, CompatBars } from '../components/primitives'
import { personFor, MEMBERS } from '../data/network'
import { ARCHETYPES } from '../data/profiling'
import { stageMeta } from '../data/pipeline'
import { ACTIVITIES } from '../data/activities'
import { CURRENT_USER } from '../data/user'
import { MEETING_TYPES } from '../data/meetings'
import { icebreaker } from '../lib/matching'
import { useSheetDrag } from '../lib/useSheetDrag'

/* Où se rencontrer : en courant, autour d'un café, en visio (libellés dans data/meetings). */
const LIEUX = ['cafe', 'run', 'visio']

export default function MemberSheet({ name, onClose }) {
  const { contacted, contactMember, messageMember, openActivity, proposeMeeting, matchDetail, startIcebreaker, pipeline, addToPipeline, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const [proposing, setProposing] = useState(false)
  const p = personFor(name)
  const isContacted = contacted[name]
  const deal = pipeline?.find((d) => d.name === name)
  const match = matchDetail ? matchDetail(name) : null
  const arche = match ? ARCHETYPES[match.archetype] : null
  const category = MEMBERS.find((m) => m.name === name)?.category
  const sharedRuns = ACTIVITIES.filter(
    (a) =>
      (a.athlete === CURRENT_USER.name && a.metContacts.includes(name)) ||
      (a.athlete === name && a.metContacts.includes(CURRENT_USER.name)),
  )
  const ice = icebreaker(name, sharedRuns.length)
  const first = name.split(' ')[0]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden bg-surface shadow-float">
        <div className="relative h-24 shrink-0 overflow-hidden surface-hero">
          <div className="absolute inset-0 bg-hero-glow" />
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div {...drag.handleProps} className="absolute left-1/2 top-0 z-10 flex h-9 w-24 -translate-x-1/2 items-center justify-center" aria-hidden="true">
            <div className="mt-3 h-1 w-10 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          <div className="-mt-10 flex items-end gap-3">
            <div className="rounded-full p-1 ring-4 ring-canvas">
              <Avatar name={name} size="xl" />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate text-lg font-semibold text-fg">{name}</h2>
              <p className="truncate text-sm text-fg-muted">{p.title}</p>
            </div>
            {match && (
              <div className="pb-1">
                <MatchRing value={match.score} size={50} />
              </div>
            )}
          </div>

          <span className="tmark mt-3"><b>T+</b> / SON DOSSARD</span>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {category && <Badge tone="brand" dot={false}>{category}</Badge>}
            <span className="flex items-center gap-1 text-xs text-fg-muted">
              <Icon name="mapPin" className="h-3.5 w-3.5" /> {p.location}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-fg-soft">{p.bio}</p>

          {match && match.reasons.length > 0 && (
            <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-light/50 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  <Icon name="target" className="h-3.5 w-3.5" /> Pourquoi vous
                </div>
                {arche && <Badge tone={arche.tone} dot={false}>{arche.short}</Badge>}
              </div>
              <div className="space-y-1.5">
                {match.reasons.map((r) => (
                  <div key={r.text} className="flex items-center gap-2 text-[13px] font-medium text-fg-soft">
                    <Icon name={r.icon} className="h-3.5 w-3.5 shrink-0 text-brand-600" /> {r.text}
                  </div>
                ))}
              </div>
              <CompatBars parts={match.parts} className="mt-3" />
            </div>
          )}

          {/* Une première phrase — toute prête, à partir de ce que vous avez en commun */}
          <div className="mt-3 rounded-2xl border border-line bg-surface-soft p-3.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <Icon name="pencil" className="h-3.5 w-3.5 text-brand-600" /> Une première phrase
            </div>
            <p className="text-[13px] italic leading-relaxed text-fg-soft">« {ice} »</p>
            <button
              onClick={() => startIcebreaker(name)}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-300 py-2 text-[13px] font-semibold text-brand-700 tap hover:bg-brand-light"
            >
              <Icon name="send" className="h-3.5 w-3.5" /> Envoyer cette phrase
            </button>
          </div>

          {/* Le pipeline — où en est la relation, ou la suivre */}
          {deal ? (
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-gold/30 bg-gold-light/40 p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-dark">
                <Icon name="briefcase" className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-fg">Dans ton pipeline</div>
                <div className="truncate text-[12px] text-fg-muted">Étape : {stageMeta(deal.stage).label}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { addToPipeline(name); showToast(`${first} dans ton pipeline`) }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-line-strong py-2.5 text-[13px] font-bold text-fg-soft tap hover:bg-black/[0.04]"
            >
              <Icon name="briefcase" className="h-4 w-4 text-gold-dark" /> Suivre dans le pipeline
            </button>
          )}

          {p.looking?.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                <Icon name="target" className="h-3.5 w-3.5" /> Ce que {first} cherche
              </div>
              <div className="flex flex-wrap gap-2">
                {p.looking.map((x) => (
                  <span key={x} className="rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-700">{x}</span>
                ))}
              </div>
            </div>
          )}

          {p.offering?.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success-dark">
                <Icon name="link" className="h-3.5 w-3.5" /> Ce que {first} apporte
              </div>
              <div className="flex flex-wrap gap-2">
                {p.offering.map((x) => (
                  <span key={x} className="rounded-full bg-success-light px-3 py-1.5 text-sm font-semibold text-success-dark">{x}</span>
                ))}
              </div>
            </div>
          )}

          {sharedRuns.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                <Icon name="activity" className="h-3.5 w-3.5" /> Sorties ensemble
              </div>
              <div className="space-y-2">
                {sharedRuns.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openActivity(a.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 text-left shadow-soft tap hover:bg-black/[0.04]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="activity" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-fg">{a.title}</div>
                      <div className="text-[12px] text-fg-muted tabular-nums">{a.date} · {a.distance.toFixed(1)} km</div>
                    </div>
                    <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.mutuals?.length > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-soft p-3">
              <AvatarStack names={p.mutuals.slice(0, 3)} total={p.mutuals.length} onMore={() => {}} />
              <span className="text-[13px] text-fg-soft">
                <span className="font-semibold text-fg">{p.mutuals.length} contacts</span> en commun
              </span>
            </div>
          )}

          {p.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-soft">#{t}</span>
              ))}
            </div>
          )}
        </div>

        {proposing && (
          <div className="shrink-0 border-t border-line bg-surface px-5 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Huit minutes — en courant, autour d'un café ou en visio ?</p>
            <div className="mt-2.5 flex gap-2">
              {LIEUX.map((t) => {
                const meta = MEETING_TYPES[t]
                return (
                  <button
                    key={t}
                    onClick={() => { proposeMeeting({ with: name, type: t }); setProposing(false) }}
                    className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface-soft py-3 text-fg-soft tap"
                  >
                    <Icon name={meta.icon} className="h-5 w-5 text-brand-600" />
                    <span className="text-[12px] font-semibold">{meta.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="glass flex shrink-0 items-center gap-2 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => contactMember(name)}
            className={`flex-1 rounded-full py-3 text-sm font-semibold text-white tap ${isContacted ? 'bg-success' : 'btn btn-impact shadow-brand'}`}
          >
            {isContacted ? 'Rencontre proposée' : 'Proposer une rencontre'}
          </button>
          <button
            onClick={() => setProposing((v) => !v)}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border tap ${proposing ? 'border-brand-500 text-brand-600' : 'border-line-strong text-fg-soft'}`}
            aria-label="Proposer une sortie"
            title="Proposer une sortie"
          >
            <Icon name="activity" className="h-5 w-5" />
          </button>
          <button
            onClick={() => messageMember(name)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-fg-soft tap"
            aria-label="Écrire"
            title="Écrire"
          >
            <Icon name="chat" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
