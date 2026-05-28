import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Badge, MatchRing } from '../components/primitives'
import { personFor } from '../data/network'
import { ARCHETYPES } from '../data/profiling'
import { suggestRun } from '../lib/runmatch'
import { formatEventDate } from '../lib/dates'
import { useSheetDrag } from '../lib/useSheetDrag'

/* Bloc « créneau proposé » réutilisé (binôme principal + autres binômes). */
function RunPlan({ plan, compact = false }) {
  const d = formatEventDate(plan.date)
  const items = [
    { icon: 'calendar', text: `${d.full} · ${plan.time}` },
    { icon: 'mapPin', text: plan.place },
    { icon: 'route', text: plan.distance },
    { icon: 'activity', text: plan.pace },
  ]
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1.5 ${compact ? 'text-[12px]' : 'text-[12.5px]'}`}>
      {items.map((it) => (
        <span key={it.text} className="inline-flex items-center gap-1.5 font-semibold text-fg-soft">
          <Icon name={it.icon} className="h-4 w-4 text-brand-500" /> {it.text}
        </span>
      ))}
    </div>
  )
}

export default function RunMatchSheet({ onClose }) {
  const { runMatches, proposeRun, openMember, proposedRuns, hasFeature, openPlans } = useApp()
  const drag = useSheetDrag(onClose)

  const unlimited = hasFeature('unlimitedMatches')
  const [top, ...others] = runMatches
  const rest = unlimited ? others.slice(0, 3) : []
  const lockedCount = unlimited ? 0 : others.length

  function ProposeButton({ name, className = '' }) {
    const done = proposedRuns[name]
    return (
      <button
        onClick={() => proposeRun(name)}
        disabled={done}
        className={`flex items-center justify-center gap-1.5 rounded-full text-sm font-bold tap ${
          done ? 'bg-success text-white' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand hover:to-brand-700'
        } ${className}`}
      >
        <Icon name={done ? 'check' : 'activity'} className="h-4 w-4" />
        {done ? 'Run proposé ✓' : 'Proposer ce run'}
      </button>
    )
  }

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
              <Icon name="activity" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">RunMatch</h2>
              <p className="text-[12.5px] text-white/65">Ton binôme de course de la semaine · la sortie devient le RDV.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {top && (() => {
            const plan = suggestRun(top.name)
            const arche = ARCHETYPES[top.archetype]
            return (
              <article className="overflow-hidden rounded-3xl border border-brand-200 bg-surface shadow-card">
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar name={top.name} size="lg" onClick={() => openMember(top.name)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-bold text-fg">{top.name}</span>
                      {arche && <Badge tone={arche.tone} dot={false}>{arche.short}</Badge>}
                    </div>
                    <div className="truncate text-sm text-fg-muted">{personFor(top.name).title}</div>
                  </div>
                  <div className="text-center">
                    <MatchRing value={top.score} size={48} />
                    <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-fg-faint">Compat.</div>
                  </div>
                </div>

                <div className="mx-4 rounded-2xl bg-brand-light/50 p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                    <Icon name="sparkles" className="h-3.5 w-3.5" filled /> Sortie proposée
                  </div>
                  <RunPlan plan={plan} />
                </div>

                <div className="mx-4 mt-3 space-y-1.5">
                  {top.reasons.map((r) => (
                    <div key={r.text} className="flex items-center gap-2 text-[13px] text-fg-soft">
                      <Icon name={r.icon} className="h-3.5 w-3.5 shrink-0 text-brand-600" /> {r.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 p-4">
                  <ProposeButton name={top.name} className="flex-1 py-3" />
                  <button
                    onClick={() => openMember(top.name)}
                    className="rounded-full border border-line-strong px-4 py-3 text-sm font-semibold text-fg-soft tap"
                  >
                    Profil
                  </button>
                </div>
              </article>
            )
          })()}

          {rest.length > 0 && (
            <div>
              <div className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-fg-muted">Autres binômes possibles</div>
              <div className="space-y-2.5">
                {rest.map((m) => {
                  const plan = suggestRun(m.name)
                  const d = formatEventDate(plan.date)
                  return (
                    <article key={m.name} className="rounded-3xl border border-line bg-surface p-3.5 shadow-soft">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size="md" onClick={() => openMember(m.name)} />
                        <button onClick={() => openMember(m.name)} className="min-w-0 flex-1 text-left">
                          <div className="truncate font-bold text-fg">{m.name}</div>
                          <div className="truncate text-[12px] text-fg-muted">
                            {d.full} · {plan.distance} · {plan.pace}
                          </div>
                        </button>
                      </div>
                      <ProposeButton name={m.name} className="mt-3 w-full py-2.5" />
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          {lockedCount > 0 && (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-300">
                  <Icon name="lock" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold">{lockedCount} autre{lockedCount > 1 ? 's' : ''} binôme{lockedCount > 1 ? 's' : ''} pour toi</div>
                  <p className="text-[12px] text-white/60">RunMatch illimité avec Pro · 1 binôme / semaine en gratuit.</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-fg">Pro</span>
              </div>
            </button>
          )}

          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-fg-faint">
            <Icon name="sparkles" className="h-3.5 w-3.5" filled /> Proposer un run l’ajoute à ton agenda et à ton pipeline.
          </p>
        </div>
      </div>
    </div>
  )
}
