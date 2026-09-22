import Icon from './Icon'
import { EDITION, numeroDossard, distanceById } from '../data/race'

/* ==========================================================================
   LE BLOC ÉDITION — ce qu'on voit en ouvrant l'app.
   Ton dossard, le compte à rebours, et où tu en es de ta route vers la
   course. C'est le seul aplat encre de l'écran : tout part de là.
   ========================================================================== */
export default function BlocEdition({ dossard, avancement, onOpen }) {
  const dist = dossard?.distance ? distanceById(dossard.distance) : null
  const { etapes, faits, total, courante, jours } = avancement

  return (
    // `shrink-0` : ce bloc est un enfant direct d'une colonne flex qui défile,
    // il ne doit pas se faire écraser par la pression du contenu en dessous.
    <section className="surface-hero shrink-0 rounded-2xl">
      <button onClick={onOpen} className="block w-full p-[22px] text-left tap">
        <div className="flex items-baseline justify-between gap-3 text-[13.5px] text-craie/60">
          <span>{EDITION.label} · {EDITION.lieu}</span>
          <span>{EDITION.jour.replace('Samedi ', 'sam. ')}</span>
        </div>

        <div className="mt-2.5 flex items-end gap-2">
          <span className="text-[60px] font-medium leading-[.9] tracking-[-.02em] tabular-nums">{jours}</span>
          <span className="pb-[9px] text-[17px] text-craie/70">jours avant la course</span>
        </div>

        {/* ---- Ton dossard ---- */}
        <div className="mt-[18px] flex items-end gap-4 rounded-2xl border border-craie/15 px-4 py-3.5">
          <div className="min-w-0">
            <div className="text-[12.5px] text-craie/60">Dossard</div>
            <div className="mt-0.5 text-[26px] font-medium leading-none tabular-nums">
              {dossard?.numero ? numeroDossard(dossard.numero) : '—'}
            </div>
          </div>
          <div className="ml-auto flex shrink-0 gap-5 text-right">
            <div>
              <div className="text-[12.5px] text-craie/60">Distance</div>
              <div className="mt-1 text-[15px] font-semibold">{dist ? dist.label : '—'}</div>
            </div>
            <div>
              <div className="text-[12.5px] text-craie/60">Sas</div>
              <div className="mt-1 text-[15px] font-semibold">{dossard?.sas || '—'}</div>
            </div>
          </div>
        </div>

        {/* ---- Ta route vers l'édition ---- */}
        <div className="mt-[18px]">
          <div className="flex items-baseline justify-between gap-3 text-[12.5px] text-craie/60">
            <span>Ta route vers l’{EDITION.label}</span>
            <span className="tabular-nums">{faits} étape{faits > 1 ? 's' : ''} sur {total}</span>
          </div>
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {etapes.map((e) => (
              <span
                key={e.id}
                className={`h-[3px] flex-1 rounded-[2px] ${
                  e.statut === 'fait' ? 'bg-brand-500' : e.statut === 'encours' ? 'bg-craie/45' : 'bg-craie/15'
                }`}
              />
            ))}
          </div>
          {courante && (
            <p className="mt-3 flex items-start gap-2.5 text-[13.5px] leading-snug text-craie/80">
              <Icon name={courante.icon} className="mt-px h-4 w-4 shrink-0 text-brand-500" />
              <span>
                <b className="font-semibold text-craie">{courante.titre}</b> · {courante.texte}
                {courante.ouvreDans > 0 && (
                  <span className="text-craie/55"> S’ouvre dans {courante.ouvreDans} jours.</span>
                )}
              </span>
            </p>
          )}
        </div>
      </button>
    </section>
  )
}
