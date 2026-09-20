import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { useSheetDrag } from '../lib/useSheetDrag'
import { PLANS } from '../data/plans'
import { siteUrl } from '../data/race'

/* Ta formule — Dossard · Premium · Cercle. Aucun prix dans l'app : la formule
   se choisit et se confirme depuis l'espace du site ; ici, on la demande. */
export default function PlansSheet({ onClose }) {
  const { plan, upgradePlan, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const espaceUrl = siteUrl('espace/#formule')

  function demander(p) {
    upgradePlan(p.id)
    showToast(`Formule ${p.name} demandée — elle se confirme depuis ton espace sur le site`)
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-surface-soft shadow-float"
      >
        {/* En-tête sombre */}
        <div className="relative shrink-0 overflow-hidden surface-hero px-5 pb-5 pt-3 text-white">
          <div className="absolute inset-0 bg-aurora" />
          <div {...drag.handleProps} className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-white/30" aria-hidden="true" />
          <button
            onClick={onClose}
            className="glass-dark absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-white tap"
            aria-label="Fermer"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative">
            <span className="tmark text-craie/70"><b>T–</b> / TA FORMULE</span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">La course est la même. Le réseau, non.</h2>
            <p className="mt-1 max-w-[320px] text-[13px] leading-relaxed text-white/65">
              Aucune formule n’achète une meilleure course : elle change quand le réseau commence, et combien de portes s’ouvrent après.
            </p>
          </div>
        </div>

        {/* Les trois formules */}
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {PLANS.map((p) => {
            const current = plan === p.id
            const highlight = p.highlight
            const cercle = p.id === 'business'
            return (
              <article
                key={p.id}
                className={`relative overflow-hidden rounded-3xl p-4 ${
                  highlight
                    ? 'surface-hero text-white shadow-float'
                    : cercle
                      ? 'border-2 border-gold/40 bg-surface text-fg shadow-card'
                      : 'border border-line bg-surface text-fg shadow-soft'
                }`}
              >
                {highlight && <div className="absolute inset-0 bg-aurora" />}
                {cercle && <div className="absolute inset-0 bg-gold-sheen" />}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        {p.badge && (
                          <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            {p.badge}
                          </span>
                        )}
                        {cercle && <Icon name="crown" className="h-4 w-4 text-gold" filled />}
                      </div>
                      {p.pour && <p className={`mt-0.5 text-[13px] ${highlight ? 'text-white/60' : 'text-fg-muted'}`}>{p.pour}</p>}
                    </div>
                    {current && (
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${highlight ? 'bg-white/15 text-white' : 'bg-surface-2 text-fg-soft'}`}>
                        Ta formule
                      </span>
                    )}
                  </div>

                  {p.prix && (
                    <div className={`mt-3 font-mono text-[10px] font-bold uppercase tracking-mono ${highlight ? 'text-white/70' : cercle ? 'text-gold-dark' : 'text-fg-muted'}`}>
                      ■ {p.prix}
                    </div>
                  )}

                  <ul className="mt-3.5 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px]">
                        <Icon
                          name="check"
                          className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? 'text-gold-300' : cercle ? 'text-gold-dark' : 'text-success'}`}
                        />
                        <span className={highlight ? 'text-white/85' : 'text-fg-soft'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {cercle && (
                    <p className="mt-3 text-[12px] text-fg-muted">Quarante places, sur cooptation de deux membres.</p>
                  )}

                  <button
                    disabled={current}
                    onClick={() => demander(p)}
                    className={`mt-4 w-full rounded-full py-3.5 text-sm font-semibold tap disabled:opacity-60 ${
                      current
                        ? highlight
                          ? 'bg-white/15 text-white'
                          : 'bg-surface-2 text-fg-muted'
                        : highlight
                          ? 'bg-white text-fg'
                          : cercle
                            ? 'bg-gradient-to-r from-gold-dark to-gold text-white shadow-brand'
                            : 'btn btn-impact'
                    }`}
                  >
                    {current ? 'Ta formule' : cercle ? 'Demander une place' : p.cta}
                  </button>

                  {!current && (
                    <a
                      href={espaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2.5 flex items-center justify-center gap-1 font-mono text-[10px] font-bold uppercase tracking-mono tap ${highlight ? 'text-white/70' : 'text-brand-600'}`}
                    >
                      Changer depuis mon espace <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </article>
            )
          })}

          <p className="flex items-center justify-center gap-1.5 px-4 pt-1 text-center text-[11px] text-fg-faint">
            <Icon name="shield" className="h-3.5 w-3.5" /> La formule se règle sur le site, depuis ton espace · rien ne se paie dans l’app
          </p>
        </div>
      </div>
    </div>
  )
}
