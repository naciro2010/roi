import Icon from '../components/Icon'
import { ProgressRing, ProgressBar, PILL_TONES, Sparkline } from '../components/primitives'
import { CURRENT_USER } from '../data/user'

const FACTORS = [
  { icon: 'users', tone: 'indigo', label: 'Connexions actives', detail: 'Relations avec qui tu échanges vraiment', value: 78 },
  { icon: 'calendar', tone: 'emerald', label: 'RDV & sorties', detail: 'Rencontres en vrai, en courant ou autour d’un café', value: 64 },
  { icon: 'briefcase', tone: 'brand', label: 'Opportunités créées', detail: 'Intros, deals, missions nés de ton réseau', value: 52 },
  { icon: 'activity', tone: 'amber', label: 'Régularité running', detail: 'Plus tu cours, plus tu croises du monde', value: 71 },
]

export default function RoiInfoSheet({ onClose }) {
  const u = CURRENT_USER
  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-float">
        <div className="relative shrink-0 overflow-hidden surface-hero px-5 pb-5 pt-6 text-white">
          <div className="absolute inset-0 bg-hero-glow" />
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <ProgressRing value={u.roi.score} size={76} stroke={8} color="#FFFFFF" track="rgba(255,255,255,0.14)">
              <div className="text-xl font-semibold leading-none">{u.roi.score}</div>
            </ProgressRing>
            <div>
              <h2 className="text-lg font-semibold">Ton score ROI réseau</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-white/65">
                Une mesure de la valeur que ton réseau te rapporte — pas un compteur d’abonnés.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          {/* Évolution du score — graphe sur les dernières semaines */}
          <div className="mb-4 rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Évolution · 8 sem.</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold tabular-nums text-fg">{u.roi.score}</span>
                  <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-success-dark">
                    <Icon name="trendingUp" className="h-3.5 w-3.5" /> +{u.roi.trend[u.roi.trend.length - 1] - u.roi.trend[0]}
                  </span>
                </div>
              </div>
              <Sparkline data={u.roi.trend} width={140} height={48} stroke="#6366F1" strokeWidth={2.5} />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Ce qui fait monter ton score</p>
          <div className="mt-3 space-y-3">
            {FACTORS.map((f) => (
              <div key={f.label} className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[f.tone]}`}>
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-fg">{f.label}</div>
                    <div className="text-[12px] leading-snug text-fg-faint">{f.detail}</div>
                  </div>
                  <span className="text-sm font-semibold text-fg-soft">{f.value}</span>
                </div>
                <div className="mt-2.5">
                  <ProgressBar value={f.value} total={100} className="bg-surface-2" barClassName="bg-brand-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-light/50 p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-brand-600 shadow-soft">
              <Icon name="trendingUp" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-fg">+{u.roi.weekDelta} cette semaine</p>
              <p className="text-[12px] leading-snug text-fg-soft">
                2 actions pour passer 80 : accepte une demande en attente et inscris-toi à une sortie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
