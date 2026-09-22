import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { useSheetDrag } from '../lib/useSheetDrag'
import { PLANS } from '../data/plans'
import { siteUrl } from '../data/race'

/* Ta formule — Dossard · Premium · Cercle : les trois colonnes du site
   (T+04.1 / LES FORMULES), posées l'une sous l'autre. Aucun prix dans
   l'app : on la demande ici, elle se confirme depuis l'espace du site. */
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
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-canvas">
        {/* En-tête encre */}
        <div className="relative shrink-0 border-b border-line-soft px-5 pb-5 pt-3">
          <div {...drag.handleProps} className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <button onClick={onClose} className="absolute right-4 top-4 rond tap" aria-label="Fermer">
            <Icon name="x" className="h-4 w-4" />
          </button>
          <span className="titre-section">Ta formule</span>
          <h2 className="mt-3 text-[24px]">La course est la même.<br /><span className="creuse">Le réseau, non.</span></h2>
          <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed t-muted">
            Aucune formule n’achète une meilleure course. Ce qui change, c’est le moment où ton réseau démarre,
            et le nombre de rencontres qu’on te propose ensuite.
          </p>
        </div>

        {/* Les trois formules, comme sur le site */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="border-t border-fg">
            {PLANS.map((p) => {
              const current = plan === p.id
              const mise = !!p.highlight
              return (
                <article key={p.id} className={`relative border-b border-line px-5 pb-5 pt-4 ${mise ? 'surface-hero' : ''}`}>
                  {mise && (
                    <span className="absolute right-0 top-0 bg-brand-500 px-2.5 py-1.5 font-mono text-[8.5px] font-bold tracking-[.18em] text-encre">
                      {p.badge.toUpperCase()}
                    </span>
                  )}
                  <div className="flex items-baseline gap-3 pr-24 font-mono text-[10px] font-bold tracking-label t-beton">
                    <span>FORMULE {p.n}</span>
                    <b className="text-brand-500">■ {p.etat.toUpperCase()}</b>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <h3 className="display text-[28px]">{p.name}</h3>
                    {current && <span className="tag on">Ta formule</span>}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-snug t-muted">{p.pour}</div>
                  <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-mono t-texte">■ {p.prix}</div>

                  <ul className="mt-3 border-t b-ligne">
                    {p.herite && (
                      <li className="flex gap-2.5 border-b b-ligne py-2 font-mono text-[10px] uppercase tracking-mono t-beton">
                        <span className="w-1.5 shrink-0 text-center font-bold text-brand-500">+</span>{p.herite}
                      </li>
                    )}
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 border-b b-ligne py-2 text-[12.5px] leading-snug t-muted">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{f}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={current}
                    onClick={() => demander(p)}
                    className={`btn mt-4 w-full justify-between ${current ? 'btn-courante' : mise ? 'btn-impact' : 'btn-ghost'}`}
                  >
                    <span>{current ? 'Ta formule' : p.cta}</span>{!current && <span className="arr">→</span>}
                  </button>
                  {!current && (
                    <a href={espaceUrl} target="_blank" rel="noopener noreferrer" className="mt-2.5 block text-center font-mono text-[10px] font-bold uppercase tracking-mono text-brand-500 tap">
                      Changer depuis mon espace <span aria-hidden>→</span>
                    </a>
                  )}
                </article>
              )
            })}
          </div>
          <p className="px-5 py-4 font-mono text-[9.5px] uppercase leading-relaxed tracking-mono text-fg-faint">
            Même parcours, même chrono, même ligne. Le tarif affiché est toujours celui de la vague · rien ne se paie dans l’app.
          </p>
        </div>
      </div>
    </div>
  )
}
