import { useMemo, useState } from 'react'
import { useApp } from '../AppContext'
import { Logo } from '../components/primitives'
import Dossard from '../components/Dossard'
import { EDITION, daysToRace } from '../data/race'

/* Quatre écrans, et on peut s'en servir. Chacun répond à une question
   qu'on se pose vraiment en ouvrant l'app pour la première fois : c'est
   quoi ? à quoi ça sert le reste de l'année ? comment on s'en sert ? et
   moi, je commence par quoi ? */
const STEPS = [
  {
    label: '1 sur 4',
    titre: ['Une course', 'par an.'],
    texte: `Le ${EDITION.mois.toLowerCase()}, à Paris La Défense : 5, 10 ou 21,1 km entre les tours. Puis tout un après-midi à l’Arena, avec celles et ceux qui viennent de courir à côté de toi.`,
  },
  {
    label: '2 sur 4',
    titre: ['Un réseau', 'toute l’année.'],
    texte: 'Le reste de l’année, l’app te propose des personnes à rencontrer : des gens qui recrutent, lèvent, vendent ou cherchent un associé — comme toi.',
  },
  {
    label: '3 sur 4',
    titre: ['Comment', 'ça marche.'],
    texte: 'Tu proposes une rencontre. Si la personne dit oui, la conversation s’ouvre. Vous vous voyez huit minutes : en courant, autour d’un café ou en visio. C’est tout.',
    etapes: [
      'On te propose des personnes, et on t’explique pourquoi',
      'Tu proposes une rencontre aux personnes qui t’intéressent',
      'Si vous dites oui tous les deux, vous vous parlez',
    ],
  },
  {
    label: '4 sur 4', dossard: true,
    titre: ['Dis ce que', 'tu cherches.'],
    texte: 'C’est la seule chose qu’on te demande pour commencer : ce que tu cherches et ce que tu apportes. C’est là-dessus qu’on te propose des rencontres.',
  },
]

export default function Onboarding({ onClose, onEditProfile }) {
  const { dossier } = useApp()
  const inviter = useMemo(() => {
    try { return new URLSearchParams(window.location.search).get('invite') } catch { return null }
  }, [])
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const s = STEPS[step]
  const jours = daysToRace()

  return (
    <div className="surface-hero absolute inset-0 z-50 flex flex-col overflow-hidden">
      <div className="relative flex items-center justify-between border-b border-craie/15 px-6 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Logo light />
        <button onClick={onClose} className="font-mono text-[11px] font-bold uppercase tracking-mono text-craie/60 tap">Passer</button>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6">
        <span className="font-mono text-[11px] uppercase tracking-mono text-craie/55">Étape {s.label}</span>
        {step === 0 && (dossier || inviter) && (
          <p className="mt-3 border-l-[3px] border-brand-500 pl-3 text-[13px] text-craie/75">
            {dossier
              ? <><b className="text-craie">Bonjour {dossier.prenom}</b> — ton dossard t’attend, dossier {dossier.reference}.</>
              : <><b className="text-craie">{inviter} t’a invité·e.</b> Quatre écrans pour comprendre, et c’est parti.</>}
          </p>
        )}
        <h1 className="mt-4 text-[40px] text-craie">{s.titre[0]}<br /><span className="creuse">{s.titre[1]}</span></h1>
        <div className="bar mt-5" />
        <p className="mt-5 max-w-[36ch] text-[16px] leading-relaxed text-craie/75">{s.texte}</p>

        {s.etapes && (
          <ol className="mt-5 max-w-[36ch] space-y-2.5">
            {s.etapes.map((e, i) => (
              <li key={e} className="flex items-start gap-3 text-[14.5px] leading-snug text-craie/70">
                <span className="mt-[2px] grid h-5 w-5 shrink-0 place-items-center bg-brand-500 font-mono text-[11px] font-bold text-craie">{i + 1}</span>
                {e}
              </li>
            ))}
          </ol>
        )}

        {s.dossard && (
          <div className="mt-6 w-[220px]">
            <Dossard dossier={dossier} verso={false} />
            <p className="mt-2 text-[12.5px] text-craie/55">Ton dossard : recto la course, verso ton profil. Touche-le pour le retourner.</p>
          </div>
        )}
        {step === 0 && (
          <div className="mt-6 flex items-end gap-4 border-t border-craie/15 pt-4">
            <div className="display text-[44px] leading-[.85] text-craie tabular-nums">{jours}</div>
            <div className="pb-1 text-[13px] leading-snug text-craie/60">jours avant<br />la prochaine course</div>
          </div>
        )}
      </div>

      <div className="relative px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mb-4 flex gap-1">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-[3px] flex-1 transition-all ${i <= step ? 'bg-brand-500' : 'bg-craie/20'}`} />
          ))}
        </div>
        <button
          onClick={() => (last ? onEditProfile() : setStep((x) => x + 1))}
          className="btn btn-impact w-full justify-between"
        >
          <span>{last ? 'Remplir mon profil' : 'Continuer'}</span><span className="arr">→</span>
        </button>
        {last && (
          <button onClick={onClose} className="mt-3 w-full py-2 font-mono text-[11px] font-bold uppercase tracking-mono text-craie/60 tap">
            Plus tard — je regarde d’abord
          </button>
        )}
      </div>
    </div>
  )
}
