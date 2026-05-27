import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Logo } from '../components/primitives'

const STEPS = [
  {
    icon: 'home', tone: 'text-brand-300',
    title: 'Le réseau qui rapporte',
    text: "Poste tes sorties, tes réflexions et tes REX de rencontre. Le fil où les entrepreneurs-runners s'entraident.",
  },
  {
    icon: 'sparkles', tone: 'text-[#AEC6B5]', ai: true,
    title: 'Des matchs propulsés par l’IA',
    text: 'L’IA croise tes besoins, tes sorties et tes connexions pour te présenter les bonnes personnes, au bon moment.',
  },
  {
    icon: 'wand', tone: 'text-brand-300', ai: true,
    title: 'Ton Copilot IA networking',
    text: 'Demande-lui qui rencontrer, fais-lui rédiger tes intros et résumer ta semaine. Disponible partout, en un tap.',
  },
  {
    icon: 'crown', tone: 'text-gold-300', premium: true,
    title: 'Va plus loin avec Pro',
    text: 'Copilot illimité, matchs illimités, « qui veut me rencontrer » et intros prioritaires. Invite tes contacts et débloque 1 mois offert.',
  },
]

export default function Onboarding({ onClose, onEditProfile }) {
  const inviter = useMemo(() => {
    try { return new URLSearchParams(window.location.search).get('invite') } catch { return null }
  }, [])
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const s = STEPS[step]
  const showInviteWelcome = inviter && step === 0

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-aurora" />
      <div className="relative flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo light />
        <button onClick={onClose} className="text-sm font-semibold text-white/60 tap">Passer</button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        {showInviteWelcome ? (
          <>
            <div className="rounded-full p-1 ring-2 ring-white/15">
              <Avatar name={inviter} size="xl" />
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-brand-200">
              <Icon name="userPlus" className="h-3.5 w-3.5" /> Invitation
            </span>
            <h1 className="mt-3 text-[26px] font-extrabold leading-tight">{inviter} t’a invité·e sur ROI</h1>
            <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-white/65">
              Rejoins la communauté des entrepreneurs qui courent et networkent. Quelques écrans pour découvrir comment ça marche.
            </p>
          </>
        ) : (
          <>
            <span className={`grid h-20 w-20 place-items-center rounded-3xl bg-white/[0.08] ring-1 ring-white/10 ${s.tone}`}>
              <Icon name={s.icon} className="h-9 w-9" filled={s.icon === 'sparkles' || s.icon === 'crown'} />
            </span>
            <div className="mt-7 flex items-center gap-2">
              <h1 className="text-[26px] font-extrabold leading-tight">{s.title}</h1>
            </div>
            {(s.ai || s.premium) && (
              <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${s.premium ? 'bg-gold/15 text-gold-300' : 'bg-white/10 text-brand-200'}`}>
                <Icon name={s.premium ? 'crown' : 'sparkles'} className="h-3 w-3" filled /> {s.premium ? 'Premium' : 'IA'}
              </span>
            )}
            <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-white/65">{s.text}</p>
          </>
        )}

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
