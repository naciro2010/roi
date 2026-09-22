import { Logo } from '../components/primitives'
import { EDITION, EDITION_PILOTE, daysToRace, siteUrl, INSCRITS } from '../data/race'

/* ==========================================================================
   L'ACCÈS — on ne rentre pas dans R.O.I en s'abonnant, on y rentre en ayant
   couru. Cet écran est ce que voit quelqu'un qui n'a encore franchi aucune
   ligne R.O.I : la prochaine édition, et comment prendre sa place.
   ========================================================================== */
export default function AccesReserve({ onRelier, onFinisher }) {
  const jours = daysToRace()

  return (
    <div className="no-scrollbar absolute inset-0 z-50 flex flex-col overflow-y-auto bg-canvas">
      <div className="flex items-center justify-between px-6 py-5">
        <Logo />
        <span className="text-[13.5px] text-fg-faint">Accès réservé</span>
      </div>

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 pb-10">
        <h1 className="text-[34px] leading-[1.08]">R.O.I, c’est d’abord une course.</h1>
        <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.6] text-fg-muted">
          L’app est réservée à celles et ceux qui ont déjà franchi une ligne R.O.I. C’est ce qui fait que
          tout le monde ici a quelque chose en commun — et que personne n’a besoin de se présenter.
        </p>

        <section className="surface-hero mt-7 rounded-2xl p-[22px]">
          <div className="text-[13.5px] text-craie/60">{EDITION.label} · {EDITION.lieu}</div>
          <div className="mt-2.5 flex items-end gap-2">
            <span className="text-[52px] font-medium leading-[.9] tracking-[-.02em] tabular-nums">{jours}</span>
            <span className="pb-2 text-[14px] text-craie/70">jours avant la prochaine</span>
          </div>
          <p className="mt-3.5 text-[14.5px] leading-[1.55] text-craie/80">
            {EDITION.jour}. 5, 10 ou 21,1 km le matin, puis tout un après-midi dans l’Arena.
            {' '}{INSCRITS.toLocaleString('fr-FR')} places déjà prises.
          </p>
        </section>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <a
            href={siteUrl('inscription/', { distance: '10' })}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-brand-500 px-[22px] py-3 text-[14px] font-semibold text-craie tap"
          >
            Prendre un dossard
          </a>
          <button
            onClick={onRelier}
            className="rounded-full border border-line-strong px-[22px] py-3 text-[14px] font-semibold text-fg tap"
          >
            J’ai déjà couru — relier mon dossier
          </button>
        </div>

        <p className="mt-5 border-t border-line-soft pt-4 text-[13.5px] leading-[1.5] text-fg-faint">
          Tu as couru {EDITION_PILOTE.label} — {EDITION_PILOTE.nom}, en {EDITION_PILOTE.mois.toLowerCase()} ?
          Relie ton dossier : l’accès s’ouvre tout de suite.
        </p>

        {/* Démo : l'app n'a pas de compte, ce bouton simule un finisher. */}
        <button onClick={onFinisher} className="mt-6 self-start text-[13px] text-fg-faint underline underline-offset-4 tap">
          Démo · entrer comme finisher de {EDITION_PILOTE.nom}
        </button>
      </div>
    </div>
  )
}
