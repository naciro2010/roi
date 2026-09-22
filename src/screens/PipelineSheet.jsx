import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'

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
  // Kilomètres investis : la somme des sorties courues avec les personnes du pipeline.
  const kmInvested = Math.round(pipeline.reduce((s, d) => s + kmWith(me, d.name), 0))

  const headline = [
    { value: stats.value, label: 'en jeu (k€)' },
    { value: stats.active, label: 'relations actives' },
    { value: stats.won, label: 'conclus' },
  ]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-canvas"
      >
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden border-b border-line-soft px-5 pb-4 pt-3">
          <div {...drag.handleProps} className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rond tap"
            aria-label="Fermer"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative pr-10">
            <span className="titre-section">Le suivi de tes relations</span>
            <h2 className="mt-2 text-[22px] leading-tight">Où en est chaque relation</h2>
            <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-fg-muted">
              Chaque personne que tu rencontres avance par étapes, de la première conversation
              jusqu’à ce que ça donne quelque chose. Fais-la avancer d’un cran quand ça bouge.
            </p>
          </div>

          {showAnalytics ? (
            <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3">
              {headline.map((s) => (
                <div key={s.label}>
                  <div className="display text-[26px] leading-none tabular-nums">{s.value}</div>
                  <div className="mt-1.5 text-[12.5px] leading-snug text-fg-muted">{s.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={openPlans}
              className="relative mt-4 flex w-full items-center gap-3 border-t border-line-soft pt-3 text-left tap"
            >
              <div className="grid flex-1 grid-cols-3 gap-2" aria-hidden="true">
                {headline.map((s, i) => (
                  <div key={s.label} className={i === 0 ? 'blur-[5px]' : ''}>
                    <div className="display text-[26px] leading-none tabular-nums">{s.value}</div>
                    <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{s.label}</div>
                  </div>
                ))}
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-encre px-3 py-1.5 text-[11px] font-semibold text-craie">
                <Icon name="lock" className="h-3.5 w-3.5" /> Premium
              </span>
            </button>
          )}
          {!showAnalytics && (
            <p className="relative mt-2 text-[13px] text-fg-faint">Le montant en jeu s’affiche avec la formule Premium.</p>
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
                  <span className="ico h-7 w-7">
                    <Icon name={stage.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-bold text-fg">{stage.label}</span>
                  <span className="grid h-5 min-w-5 place-items-center bg-surface-2 px-1.5 text-[11px] font-bold text-fg-muted">{deals.length}</span>
                  {showAnalytics && colValue > 0 && <span className="ml-auto text-[11px] font-bold tabular-nums text-fg-faint">{colValue} k€</span>}
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar pb-2">
                  {deals.length === 0 && (
                    <div className="grid place-items-center border border-dashed border-line-strong px-4 py-8 text-center">
                      <span className="text-[12px] leading-snug text-fg-faint">Rien ici pour l'instant. Une sortie ou une rencontre y mettra quelqu'un.</span>
                    </div>
                  )}
                  {deals.map((d) => {
                    const km = Math.round(kmWith(me, d.name))
                    const runs = runsWith(me, d.name).length
                    const idx = stageIndex(d.stage)
                    return (
                      <article key={d.id} className="border border-line bg-surface p-3.5">
                        <button onClick={() => openMember(d.name)} className="flex w-full items-center gap-2.5 text-left tap">
                          <Avatar name={d.name} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-fg">{d.name}</div>
                            <div className="truncate text-[12px] text-fg-muted">{d.kind}</div>
                          </div>
                          {showAnalytics && d.value > 0 && (
                            <span className="shrink-0 bg-surface-2 px-2 py-0.5 text-[11px] font-extrabold text-fg">{d.value} k€</span>
                          )}
                        </button>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-muted">
                          {runs > 0 && (
                            <span className="inline-flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg">
                              <Icon name="activity" className="h-3.5 w-3.5" /> {km} km investis
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Icon name="link" className="h-3.5 w-3.5 text-fg-faint" /> Origine · {d.via}
                          </span>
                        </div>

                        {d.next && (
                          <div className="mt-2 flex items-start gap-1.5 bg-surface-soft px-2.5 py-2 text-[12px] text-fg-soft">
                            <Icon name="arrowRight" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                            <span className="min-w-0 flex-1">
                              <span className="font-semibold text-fg">Prochaine étape</span> · {d.next}
                              {d.nextDate && <span className="text-fg-faint"> · {formatEventDate(d.nextDate).relative}</span>}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => advanceDeal(d.id, -1)}
                              className="grid h-9 w-9 shrink-0 place-items-center border border-line-strong text-fg-faint tap"
                              aria-label="Reculer"
                              title="Reculer"
                            >
                              <Icon name="arrowLeft" className="h-4 w-4" />
                            </button>
                          )}
                          {d.stage === 'won' ? (
                            <span className="tag on flex-1 justify-center py-2.5">
                              <Icon name="checkCircle" className="h-4 w-4" /> Conclu
                            </span>
                          ) : (
                            <button
                              onClick={() => advanceDeal(d.id, 1)}
                              className="btn btn-impact btn-sm flex-1"
                            >
                              <span>{d.stage === 'deal' ? 'Conclure' : "Avancer d'une étape"}</span>
                              <span className="arr">→</span>
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
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {kmInvested > 0 ? `${kmInvested} km investis dans ces relations · chaque sortie en fait avancer une.` : 'Chaque sortie courue fait avancer une relation.'}
        </p>
      </div>
    </div>
  )
}
