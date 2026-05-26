import { useState } from 'react'
import Icon from '../components/Icon'
import { Logo } from '../components/primitives'

const STEPS = [
  {
    icon: 'home', tone: 'text-brand-300',
    title: 'Partage, inspire',
    text: "Poste tes sorties, tes réflexions et tes REX de rencontre. Le fil où les entrepreneurs-runners s'entraident.",
  },
  {
    icon: 'sparkles', tone: 'text-[#AEC6B5]',
    title: 'Rencontre les bonnes personnes',
    text: 'Des matchs intelligents selon tes besoins, tes sorties et tes connexions. Le bon contact, au bon moment.',
  },
  {
    icon: 'activity', tone: 'text-brand-300',
    title: 'Cours, et fais grandir ton réseau',
    text: 'Chaque sortie devient une opportunité : tu cours, tu rencontres, ton ROI réseau progresse.',
  },
]

export default function Onboarding({ onClose, onEditProfile }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const s = STEPS[step]

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo light />
        <button onClick={onClose} className="text-sm font-semibold text-white/60 tap">Passer</button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className={`grid h-20 w-20 place-items-center rounded-3xl bg-white/[0.08] ring-1 ring-white/10 ${s.tone}`}>
          <Icon name={s.icon} className="h-9 w-9" filled={s.icon === 'sparkles'} />
        </span>
        <h1 className="mt-7 text-[26px] font-extrabold leading-tight">{s.title}</h1>
        <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-white/65">{s.text}</p>

        <div className="mt-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
          ))}
        </div>
      </div>

      <div className="relative space-y-2 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => (last ? onEditProfile() : setStep((x) => x + 1))}
          className="w-full rounded-2xl bg-white py-3.5 text-sm font-bold text-ink-900 tap"
        >
          {last ? 'Compléter mon profil' : 'Continuer'}
        </button>
        {last && (
          <button onClick={onClose} className="w-full py-2 text-sm font-semibold text-white/60 tap">
            Plus tard, explorer d'abord
          </button>
        )}
      </div>
    </div>
  )
}
