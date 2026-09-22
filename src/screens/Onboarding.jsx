import { useState } from 'react'
import { Logo } from '../components/primitives'
import { EDITION } from '../data/race'

/* Trois écrans, et on peut s'en servir. Chacun répond à une question qu'on
   se pose vraiment en ouvrant l'app pour la première fois : c'est quoi ? à
   quoi ça sert le reste de l'année ? comment on s'en sert ? */
const STEPS = [
  {
    titre: 'Une course par an.',
    texte: `${EDITION.jour}, à ${EDITION.lieu} : 5, 10 ou 21,1 km entre les tours. Puis tout un après-midi à l’Arena, avec celles et ceux qui viennent de courir à côté de toi. Et ainsi chaque année, fin novembre.`,
  },
  {
    titre: 'Un réseau toute l’année.',
    texte: 'Entre deux éditions, l’app te donne les nouvelles de la course et te propose des personnes à rencontrer : des gens qui recrutent, lèvent, vendent ou cherchent un associé — comme toi. Elle est réservée à celles et ceux qui en ont déjà couru une, et tenue par un abonnement.',
  },
  {
    titre: 'Comment ça marche.',
    texte: 'Tu proposes une rencontre. Si la personne dit oui, la conversation s’ouvre. Vous vous voyez huit minutes : en courant, autour d’un café ou en visio. C’est tout.',
  },
]

export default function Onboarding({ onClose }) {
  const [step, setStep] = useState(0)
  const dernier = step === STEPS.length - 1
  const s = STEPS[step]

  return (
    <div className="surface-hero animate-fadeIn absolute inset-0 z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Logo light />
        <button onClick={onClose} className="text-[14px] text-craie/60 tap">Passer</button>
      </div>

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6">
        <span className="text-[13.5px] text-craie/55">{step + 1} sur {STEPS.length}</span>
        <h1 className="mt-3 text-[40px] leading-[1.05] tracking-[-.02em] text-craie">{s.titre}</h1>
        <p className="mt-[18px] max-w-[40ch] text-[16.5px] leading-[1.6] text-craie/75">{s.texte}</p>
      </div>

      <div
        className="mx-auto w-full max-w-[560px] px-6"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <div className="mb-[18px] flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-[2px] ${i <= step ? 'bg-brand-500' : 'bg-craie/20'}`}
            />
          ))}
        </div>
        <button
          onClick={() => (dernier ? onClose() : setStep((x) => x + 1))}
          className="w-full rounded-full bg-brand-500 px-5 py-[15px] text-[15px] font-semibold text-craie tap"
        >
          {dernier ? 'Commencer' : 'Continuer'}
        </button>
      </div>
    </div>
  )
}
