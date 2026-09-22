import Icon from '../components/Icon'
import { CURRENT_USER } from '../data/user'

/* Ce que l'app compte, et pourquoi. Quatre choses concrètes — pas un score
   dont personne ne connaît la recette. Chacune est une phrase que tu peux
   vérifier toi-même dans l'app. */
const MESURES = [
  {
    cle: 'rencontres',
    titre: 'Les rencontres qui ont eu lieu',
    detail: 'Pas les demandes envoyées : celles où vous vous êtes vraiment parlé, à l’Arena, en courant, au café ou en visio.',
  },
  {
    cle: 'presentations',
    titre: 'Les présentations faites et reçues',
    detail: 'Quand tu mets deux personnes en relation, ou qu’on te présente à quelqu’un.',
  },
  {
    cle: 'resultats',
    titre: 'Ce que ça a produit',
    detail: 'Une recrue, un investisseur, un contrat, un associé. C’est la seule chose qui compte vraiment.',
  },
  {
    cle: 'km',
    titre: 'Les kilomètres courus avec quelqu’un',
    detail: 'Un kilomètre à deux vaut plus qu’un kilomètre seul : c’est là que les conversations se passent.',
  },
]

export default function RoiInfoSheet({ onClose }) {
  const u = CURRENT_USER
  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-canvas">
        <div className="relative shrink-0 border-b border-line-soft px-5 pb-5 pt-6">
          <button onClick={onClose} className="absolute right-3 top-3 rond tap" aria-label="Fermer">
            <Icon name="x" className="h-4 w-4" />
          </button>
          <span className="titre-section">Comment on compte</span>
          <h2 className="mt-3 text-[22px]">Ce que ton réseau te rapporte.</h2>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed t-muted">
            R.O.I veut dire « retour sur investissement ». Ici, ce que tu investis, ce sont des kilomètres et du
            temps — et ce que ça rapporte, ce sont des relations qui servent à quelque chose.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
          <h3 className="titre-section">Tes chiffres aujourd’hui</h3>
          <div className="cadre mt-3 grid-cols-3">
            {[
              { v: u.roi.connections, l: 'personnes rencontrées' },
              { v: u.roi.meetings, l: 'présentations faites' },
              { v: u.stats.km, l: 'km à plusieurs' },
            ].map((c) => (
              <div key={c.l} className="p-3.5">
                <div className="display text-[26px] leading-none tabular-nums">{c.v}</div>
                <div className="mt-1.5 text-[12.5px] leading-snug text-fg-muted">{c.l}</div>
              </div>
            ))}
          </div>

          <h3 className="titre-section mt-7">Ce qu’on regarde</h3>
          <div className="mt-2 border-t border-fg">
            {MESURES.map((m, i) => (
              <div key={m.cle} className="flex items-start gap-3 border-b border-line py-3.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-brand-500 font-mono text-[11px] font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[14.5px] font-medium leading-snug text-fg">{m.titre}</div>
                  <div className="mt-1 text-[13px] leading-snug text-fg-muted">{m.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-l-[3px] border-brand-500 bg-surface-2 px-4 py-3.5">
            <p className="titre-section">Pour que ça monte</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-fg-soft">
              Deux gestes suffisent cette semaine : réponds à une demande de rencontre en attente,
              et inscris-toi à une sortie du réseau.
            </p>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-fg-faint">
            Ce n’est pas un compteur d’abonnés. Personne d’autre que toi ne voit ces chiffres.
          </p>
        </div>
      </div>
    </div>
  )
}
