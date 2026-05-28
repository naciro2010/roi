import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { PILL_TONES } from '../components/primitives'
import { PIPELINE_STAGES, pipelineStats, stageIndex } from '../data/pipeline'
import { kmWith, runsWith } from '../data/activities'
import { formatEventDate } from '../lib/dates'
import { CURRENT_USER } from '../data/user'
import { useSheetDrag } from '../lib/useSheetDrag'

export default function PipelineSheet({ onClose }) {
  const { pipeline, advanceDeal, openMember, hasFeature, openPlans } = useApp()
  const drag = useSheetDrag(onClose)

  const showAnalytics = hasFeature('analytics')
  const stats = pipelineStats(pipeline)
  const me = CURRENT_USER.name
  // Kilomètres « investis » : somme des sorties courues avec les contacts du pipeline.
  const kmInvested = Math.round(pipeline.reduce((s, d) => s + kmWith(me, d.name), 0))

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface-soft shadow-float"
      >
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden surface-hero px-5 pb-4 pt-3 text-white">
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
              <Icon name="briefcase" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">Pipeline ROI</h2>
              <p className="text-[12.5px] text-white/65">
                {stats.active} relation{stats.active > 1 ? 's' : ''} active{stats.active > 1 ? 's' : ''} · {stats.won} conclu{stats.won > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {showAnalytics ? (
          <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/12 pt-3">
            {[
              { value: `${stats.value} k€`, label: 'En jeu' },
              { value: `${kmInvested} km`, label: 'Investis en courant' },
              { value: stats.total, label: 'Relations' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-lg font-extrabold tabular-nums leading-none">{s.value}</div>
                <div className="mt-1 text-[11px] text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
          ) : (
            <button
              onClick={openPlans}
              className="relative mt-4 flex w-full items-center gap-3 border-t border-white/12 pt-3 text-left tap"
            >
              <div className="grid flex-1 grid-cols-3 gap-2 blur-[5px]" aria-hidden="true">
                {[`${stats.value} k€`, `${kmInvested} km`, stats.total].map((v, i) => (
                  <div key={i}>
                    <div className="text-lg font-extrabold tabular-nums leading-none">{v}</div>
                    <div className="mt-1 h-2.5 w-12 rounded-full bg-white/20" />
                  </div>
                ))}
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-fg">
                <Icon name="lock" className="h-3.5 w-3.5" /> Analytics Pro
              </span>
            </button>
          )}
        </div>

        {/* Colonnes (kanban horizontal) */}
        <div className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {PIPELINE_STAGES.map((stage) => {
            const deals = stats.byStage[stage.id]
            const colValue = deals.reduce((s, d) => s + (d.value || 0), 0)
            return (
              <section key={stage.id} className="flex w-[80%] shrink-0 snap-start flex-col">
                <div className="mb-2.5 flex items-center gap-2 px-1">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${PILL_TONES[stage.tone]}`}>
                    <Icon name={stage.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-bold text-fg">{stage.label}</span>
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-surface-2 px-1.5 text-[11px] font-bold text-fg-muted">{deals.length}</span>
                  {showAnalytics && colValue > 0 && <span className="ml-auto text-[11px] font-bold tabular-nums text-fg-faint">{colValue} k€</span>}
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar pb-2">
                  {deals.length === 0 && (
                    <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong py-8 text-center">
                      <span className="text-[12px] text-fg-faint">Aucune relation ici</span>
                    </div>
                  )}
                  {deals.map((d) => {
                    const km = Math.round(kmWith(me, d.name))
                    const runs = runsWith(me, d.name).length
                    const idx = stageIndex(d.stage)
                    return (
                      <article key={d.id} className="rounded-3xl border border-line bg-surface p-3.5 shadow-soft">
                        <button onClick={() => openMember(d.name)} className="flex w-full items-center gap-2.5 text-left tap">
                          <Avatar name={d.name} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-fg">{d.name}</div>
                            <div className="truncate text-[12px] text-fg-muted">{d.kind}</div>
                          </div>
                          {showAnalytics && d.value > 0 && (
                            <span className="shrink-0 rounded-full bg-gold-light px-2 py-0.5 text-[11px] font-extrabold text-gold-dark">{d.value} k€</span>
                          )}
                        </button>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-muted">
                          {runs > 0 && (
                            <span className="inline-flex items-center gap-1 font-semibold text-success-dark">
                              <Icon name="activity" className="h-3.5 w-3.5" /> {km} km ensemble
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Icon name="link" className="h-3.5 w-3.5 text-fg-faint" /> {d.via}
                          </span>
                        </div>

                        {d.next && (
                          <div className="mt-2 flex items-start gap-1.5 rounded-2xl bg-surface-soft px-2.5 py-2 text-[12px] text-fg-soft">
                            <Icon name="arrowRight" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                            <span className="min-w-0 flex-1">
                              {d.next}
                              {d.nextDate && <span className="text-fg-faint"> · {formatEventDate(d.nextDate).relative}</span>}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => advanceDeal(d.id, -1)}
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line-strong text-fg-faint tap"
                              aria-label="Reculer l'étape"
                            >
                              <Icon name="arrowLeft" className="h-4 w-4" />
                            </button>
                          )}
                          {d.stage === 'won' ? (
                            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success-light py-2 text-[13px] font-bold text-success-dark">
                              <Icon name="checkCircle" className="h-4 w-4" /> Conclu 🎉
                            </span>
                          ) : (
                            <button
                              onClick={() => advanceDeal(d.id, 1)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 py-2 text-[13px] font-bold text-white shadow-brand tap"
                            >
                              {d.stage === 'deal' ? 'Marquer conclu' : 'Faire avancer'}
                              <Icon name="arrowRight" className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <p className="flex shrink-0 items-center justify-center gap-1.5 border-t border-line bg-surface px-4 py-3 text-center text-[11px] text-fg-faint">
          <Icon name="activity" className="h-3.5 w-3.5 text-success" /> Chaque sortie courue fait avancer une relation.
        </p>
      </div>
    </div>
  )
}
