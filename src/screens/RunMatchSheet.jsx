import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/primitives'
import { personFor } from '../data/network'
import { ARCHETYPES } from '../data/profiling'
import { suggestRun } from '../lib/runmatch'
import { formatEventDate } from '../lib/dates'
import { useSheetDrag } from '../lib/useSheetDrag'

/* Bloc « sortie proposée » réutilisé (binôme principal + autres binômes). */
function RunPlan({ plan, compact = false }) {
  const d = formatEventDate(plan.date)
  const items = [
    { icon: 'calendar', text: `${d.full} · ${plan.time}` },
    { icon: 'mapPin', text: plan.place },
    { icon: 'route', text: plan.distance },
    { icon: 'activity', text: `Allure cible ${plan.pace}` },
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
  const { runMatches, proposeRun, openMember, proposedRuns, hasFeature, openPlans, planMeta } = useApp()
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
        className={`btn ${done ? 'btn-encre' : 'btn-impact'} ${className}`}
      >
        <Icon name={done ? 'check' : 'activity'} className="h-4 w-4" />
        <span>{done ? 'Proposée · dans ton agenda et ton pipeline' : 'Proposer cette sortie'}</span>
      </button>
    )
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-canvas"
      >
        {/* En-tête */}
        <div className="relative shrink-0 overflow-hidden border-b border-line-soft px-5 pb-5 pt-3">
          <div {...drag.handleProps} className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rond tap"
            aria-label="Fermer"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative">
            <span className="titre-section">Courir à deux</span>
            <h2 className="titre mt-2 text-[22px] leading-tight">Ton binôme de sortie</h2>
            <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-fg-muted">
              On te propose quelqu’un qui court à peu près à ton allure, avec un jour, une heure et un lieu.
              Vous courez ensemble : la sortie tient lieu de rendez-vous.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {top && (() => {
            const plan = suggestRun(top.name)
            const arche = ARCHETYPES[top.archetype]
            return (
              <article className="overflow-hidden border border-line-strong bg-surface">
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar name={top.name} size="lg" onClick={() => openMember(top.name)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-bold text-fg">{top.name}</span>
                      {arche && <Badge tone={arche.tone} dot={false}>{arche.short}</Badge>}
                    </div>
                    <div className="truncate text-sm text-fg-muted">{personFor(top.name).title}</div>
                  </div>
                </div>

                <div className="mx-4 bg-surface-2 p-3">
                  <div className="titre-section mb-2 flex items-center gap-1.5">
                    <Icon name="route" className="h-3.5 w-3.5 text-brand-500" /> La sortie proposée
                  </div>
                  <RunPlan plan={plan} />
                </div>

                <div className="mx-4 mt-3">
                  <div className="titre-section mb-1.5">Pourquoi vous deux</div>
                  <div className="space-y-2">
                    {top.reasons.map((r) => (
                      <div key={r.text} className="flex items-center gap-2 text-[14px] leading-snug text-fg-soft">
                        <Icon name={r.icon} className="h-3.5 w-3.5 shrink-0 text-brand-500" /> {r.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <ProposeButton name={top.name} className="w-full" />
                  <button
                    onClick={() => openMember(top.name)}
                    className="btn btn-ghost btn-sm w-full"
                  >
                    <span>Voir son profil</span><span className="arr">→</span>
                  </button>
                </div>
              </article>
            )
          })()}

          {rest.length > 0 && (
            <div>
              <div className="titre-section mb-2 px-1">D’autres personnes qui courent à ton allure</div>
              <div className="space-y-2.5">
                {rest.map((m) => {
                  const plan = suggestRun(m.name)
                  const d = formatEventDate(plan.date)
                  return (
                    <article key={m.name} className="border border-line bg-surface p-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size="md" onClick={() => openMember(m.name)} />
                        <button onClick={() => openMember(m.name)} className="min-w-0 flex-1 text-left">
                          <div className="truncate font-bold text-fg">{m.name}</div>
                          <div className="truncate text-[12px] text-fg-muted">
                            {d.full} · {plan.distance} · allure cible {plan.pace}
                          </div>
                        </button>
                      </div>
                      <ProposeButton name={m.name} className="btn-sm mt-3 w-full" />
                    </article>
                  )
                })}
              </div>
            </div>
          )}

          {lockedCount > 0 && (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-2xl surface-hero p-4 text-left text-craie tap"
            >
              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-craie/15">
                  <Icon name="lock" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold">{lockedCount} autre{lockedCount > 1 ? 's' : ''} binôme{lockedCount > 1 ? 's' : ''} pour toi</div>
                  <p className="text-[12px] text-craie/60">Un binôme par semaine avec ton palier {planMeta?.name ?? 'Membre'} · tous tes binômes en Premium.</p>
                </div>
                <span className="shrink-0 bg-craie px-3 py-1.5 text-xs font-bold text-fg">Premium</span>
              </div>
            </button>
          )}

          <p className="pt-1 text-center text-[11px] text-fg-faint">
            Classé par allure compatible, puis par ce que vous avez à vous dire.
          </p>
        </div>
      </div>
    </div>
  )
}
