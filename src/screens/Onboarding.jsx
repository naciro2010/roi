import { useMemo, useState } from 'react'
import { useApp } from '../AppContext'
import { Logo } from '../components/primitives'
import Dossard from '../components/Dossard'
import { EDITION, daysToRace } from '../data/race'

/* Quatre temps, comme les stances du manifeste du site : une course par an,
   un réseau toute l'année, le dossard à deux faces, ce qu'on garde. */
const STEPS = [
  {
    t: 'T–', label: 'Une course par an',
    titre: ['Une course', 'par an.'],
    texte: `Édition 01, Paris La Défense, ${EDITION.mois.toLowerCase()}. 5, 10 ou 21,1 km entre les tours, puis un après-midi entier dans l’Arena pour rencontrer celles et ceux qui viennent de courir à côté de toi.`,
  },
  {
    t: 'T+', label: 'Un réseau toute l’année',
    titre: ['Un réseau', 'toute l’année.'],
    texte: 'L’app est ce qui se passe entre deux lignes : l’annuaire de celles et ceux qui courent, trois rencontres proposées chaque semaine — recruter, lever, vendre, s’associer —, des sorties à allure de conversation.',
  },
  {
    t: '■', label: 'Un dossard, deux faces', dossard: true,
    titre: ['Un seul dossard.', 'Deux faces.'],
    texte: 'Recto, il te fait passer la ligne. Verso, il devient ton profil : ton nom, ta fonction, ton entreprise. Le même papier des deux côtés — c’est justement l’argument.',
  },
  {
    t: '04', label: 'Ce qu’on garde',
    titre: ['Zéro pitch', 'en course.'],
    texte: 'On court d’abord, on parle pendant, on conclut après. Toutes les allures, aucun niveau requis, pas de badge, pas de slide. L’essentiel du retour se fait une fois la ligne franchie.',
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
        <button onClick={onClose} className="font-mono text-[10px] font-bold uppercase tracking-mono text-craie/60 tap">Passer</button>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6">
        <span className="tmark"><b>{s.t}</b> / {s.label}</span>
        {step === 0 && (dossier || inviter) && (
          <p className="mt-3 border-l-[3px] border-brand-500 pl-3 text-[13px] text-craie/75">
            {dossier
              ? <><b className="text-craie">Ton dossard est déjà là</b> — dossier {dossier.reference}, bonjour {dossier.prenom}.</>
              : <><b className="text-craie">{inviter} t’a invité·e.</b> Quelques écrans pour voir comment ça marche.</>}
          </p>
        )}
        <h1 className="mt-4 text-[40px] text-craie">{s.titre[0]}<br /><span className="creuse">{s.titre[1]}</span></h1>
        <div className="bar mt-5" />
        <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-craie/70">{s.texte}</p>

        {s.dossard && (
          <div className="mt-6 w-[220px]">
            <Dossard dossier={dossier} verso={false} />
            <p className="mt-2 font-mono text-[9px] uppercase tracking-mono text-craie/50">↻ Touche-le pour le retourner</p>
          </div>
        )}
        {step === 0 && (
          <div className="mt-6 flex items-end gap-4 border-t border-craie/15 pt-4">
            <div className="display text-[44px] leading-[.85] text-craie">T–{jours}</div>
            <div className="pb-1 font-mono text-[9.5px] uppercase leading-relaxed tracking-mono text-craie/55">jours avant<br />la ligne</div>
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
          <span>{last ? 'Remplir le verso de mon dossard' : 'Continuer'}</span><span className="arr">→</span>
        </button>
        {last && (
          <button onClick={onClose} className="mt-3 w-full py-2 font-mono text-[10px] font-bold uppercase tracking-mono text-craie/60 tap">
            Plus tard, explorer d’abord
          </button>
        )}
      </div>
    </div>
  )
}
