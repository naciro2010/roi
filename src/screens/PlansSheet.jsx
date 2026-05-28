import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { useSheetDrag } from '../lib/useSheetDrag'
import { PLANS, planById } from '../data/plans'

function PriceBlock({ plan, annual }) {
  if (plan.priceMonthly === 0) {
    return <div className="text-3xl font-semibold tabular-nums">Gratuit</div>
  }
  const price = annual ? plan.priceAnnual : plan.priceMonthly
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-semibold tabular-nums">{price}€</span>
      <span className="text-sm font-semibold opacity-60">/ mois{plan.perSeat ? ' / siège' : ''}</span>
    </div>
  )
}

export default function PlansSheet({ onClose }) {
  const { plan, upgradePlan } = useApp()
  const drag = useSheetDrag(onClose)
  const [annual, setAnnual] = useState(true)

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface-soft shadow-float"
      >
        {/* En-tête premium sombre */}
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300">
              <Icon name="crown" className="h-3.5 w-3.5" filled /> Abonnement ROI
            </span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">Débloque tout ton réseau</h2>
            <p className="mt-1 max-w-[300px] text-[13px] leading-relaxed text-white/65">
              Matchs illimités, agenda & RDV, intros prioritaires et analytics ROI. Annule quand tu veux.
            </p>

            {/* Bascule mensuel / annuel */}
            <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/10 p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold tap ${!annual ? 'bg-white text-fg' : 'text-white/70'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold tap ${annual ? 'bg-white text-fg' : 'text-white/70'}`}
              >
                Annuel
                <span className="rounded-full bg-gold/90 px-1.5 py-0.5 text-[10px] font-semibold text-fg">−25%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de plans */}
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {PLANS.map((p) => {
            const current = plan === p.id
            const highlight = p.highlight
            const business = p.id === 'business'
            return (
              <article
                key={p.id}
                className={`relative overflow-hidden rounded-3xl p-4 ${
                  highlight
                    ? 'surface-hero text-white shadow-float'
                    : business
                      ? 'border-2 border-gold/40 bg-surface text-fg shadow-card'
                      : 'border border-line bg-surface text-fg shadow-soft'
                }`}
              >
                {highlight && <div className="absolute inset-0 bg-aurora" />}
                {business && <div className="absolute inset-0 bg-gold-sheen" />}
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
                        {business && <Icon name="crown" className="h-4 w-4 text-gold" filled />}
                      </div>
                      <p className={`mt-0.5 text-[13px] ${highlight ? 'text-white/60' : 'text-fg-muted'}`}>{p.tagline}</p>
                    </div>
                    {current && (
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${highlight ? 'bg-white/15 text-white' : 'bg-surface-2 text-fg-soft'}`}>
                        Actuel
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <PriceBlock plan={p} annual={annual} />
                    {annual && p.priceMonthly > 0 && (
                      <p className={`mt-0.5 text-[11px] ${highlight ? 'text-white/45' : 'text-fg-faint'}`}>
                        Facturé {p.priceAnnual * 12}€ / an{p.perSeat ? ' / siège' : ''}
                      </p>
                    )}
                  </div>

                  <ul className="mt-3.5 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px]">
                        <Icon
                          name="check"
                          className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? 'text-gold-300' : business ? 'text-gold-dark' : 'text-success'}`}
                        />
                        <span className={highlight ? 'text-white/85' : 'text-fg-soft'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={current}
                    onClick={() => upgradePlan(p.id)}
                    className={`mt-4 w-full rounded-full py-3.5 text-sm font-semibold tap disabled:opacity-60 ${
                      current
                        ? highlight
                          ? 'bg-white/15 text-white'
                          : 'bg-surface-2 text-fg-muted'
                        : highlight
                          ? 'bg-white text-fg'
                          : business
                            ? 'bg-gradient-to-r from-gold-dark to-gold text-white shadow-brand'
                            : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand'
                    }`}
                  >
                    {current ? 'Ton plan actuel' : p.cta}
                  </button>
                </div>
              </article>
            )
          })}

          <p className="flex items-center justify-center gap-1.5 px-4 pt-1 text-center text-[11px] text-fg-faint">
            <Icon name="shield" className="h-3.5 w-3.5" /> Paiement sécurisé · sans engagement · annulable à tout moment
          </p>
        </div>
      </div>
    </div>
  )
}
