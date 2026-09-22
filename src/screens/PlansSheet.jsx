import { useApp } from '../AppContext'
import Sheet, { SheetBloc } from '../components/Sheet'
import { PLANS, dateLongue } from '../data/plans'
import { siteUrl } from '../data/race'

/* ==========================================================================
   MON ABONNEMENT — ce qui garde l'accès ouvert.
   Trois paliers, Membre · Premium · Cercle. Aucun n'achète une meilleure
   course : ils changent combien de portes s'ouvrent entre deux éditions.
   Rien ne se paie dans l'app — le règlement se fait sur l'espace du site.
   ========================================================================== */
export default function PlansSheet({ onClose }) {
  const { plan, upgradePlan, abonnement, etatAbo, renouveler } = useApp()
  const espaceUrl = siteUrl('espace/#abonnement')
  const expire = etatAbo.statut === 'expire'

  return (
    <Sheet title="Mon abonnement" onClose={onClose}>
      {/* ---- Où tu en es ---- */}
      <SheetBloc>
        <div className="flex items-baseline justify-between gap-3 text-[13.5px] text-craie/60">
          <span>Palier {PLANS.find((p) => p.id === plan)?.name}</span>
          <span>{abonnement.periodicite === 'annuel' ? 'Annuel' : 'Mensuel'}</span>
        </div>
        <div className="mt-2.5 text-[28px] font-medium leading-tight">
          {expire ? 'Expiré' : `Encore ${etatAbo.jours} jours`}
        </div>
        <p className="mt-2 text-[14.5px] leading-[1.55] text-craie/80">
          {expire
            ? 'L’app reste ouverte en lecture : tu vois les nouvelles, ton dossard et le fil. Pour écrire et proposer des rencontres, il faut la reprendre.'
            : `Échéance le ${dateLongue(abonnement.echeance)}. Sans renouvellement, l’app passe en lecture seule.`}
        </p>
        <button
          onClick={renouveler}
          className="mt-4 rounded-full bg-brand-500 px-5 py-3 text-[14px] font-semibold text-craie tap"
        >
          {expire ? 'Reprendre mon abonnement' : 'Renouveler pour un an'}
        </button>
      </SheetBloc>

      <p className="mt-5 text-[14.5px] leading-[1.6] text-fg-soft">
        Le dossard se prend sur le site, par édition. L’abonnement, lui, est ce qui tient le réseau ouvert
        entre deux courses — et il est réservé à celles et ceux qui en ont déjà couru une.
      </p>

      {/* ---- Les trois paliers ---- */}
      <div className="mt-5 flex flex-col gap-3">
        {PLANS.map((p) => {
          const courant = plan === p.id
          const mise = !!p.highlight
          return (
            <article
              key={p.id}
              className={`rounded-xl border bg-surface p-[18px] ${mise ? 'border-brand-500' : 'border-line'}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[19px] font-medium">{p.name}</h3>
                {courant ? (
                  <span className="rounded-full bg-brand-500 px-3 py-1 text-[12px] font-semibold text-craie">Ton palier</span>
                ) : mise ? (
                  <span className="text-[12.5px] font-semibold text-brand-500">{p.badge}</span>
                ) : null}
              </div>
              <p className="mt-1 text-[13.5px] leading-snug text-fg-muted">{p.pour}</p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[22px] font-medium tabular-nums">{p.prixAnnuel}</span>
                <span className="text-[13px] text-fg-faint">ou {p.prix}</span>
              </div>
              <p className="mt-1 text-[13px] text-fg-faint">{p.etat}</p>

              <ul className="mt-3.5 flex flex-col gap-2 border-t border-line-soft pt-3.5">
                {p.herite && <li className="text-[13px] font-semibold text-fg-faint">{p.herite}</li>}
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-fg-soft">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{f}
                  </li>
                ))}
              </ul>

              {!courant && (
                <button
                  onClick={() => upgradePlan(p.id)}
                  className={`mt-4 w-full rounded-full px-5 py-3 text-[14px] font-semibold tap ${
                    mise ? 'bg-brand-500 text-craie' : 'bg-encre text-craie'
                  }`}
                >
                  {p.cta}
                </button>
              )}
            </article>
          )
        })}
      </div>

      <a
        href={espaceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-[13.5px] font-semibold text-brand-500 tap"
      >
        Gérer le règlement depuis mon espace
      </a>
      <p className="mt-3 text-[13px] leading-snug text-fg-faint">
        Rien ne se paie dans l’app : le règlement et la résiliation se font sur runoninvest.fr. Résilier
        ne retire pas ton dossard — il ferme le réseau, pas la course.
      </p>
    </Sheet>
  )
}
