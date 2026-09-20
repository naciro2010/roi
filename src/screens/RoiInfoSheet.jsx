import Icon from '../components/Icon'
import { ProgressRing, ProgressBar, PILL_TONES, Sparkline } from '../components/primitives'
import { CURRENT_USER } from '../data/user'

/* Ce que ton réseau te rapporte, en quatre lignes — les chiffres ne bougent pas. */
const FACTORS = [
  { icon: 'users', tone: 'indigo', label: 'Rencontres qui ont eu lieu', detail: 'À l’Arena, en courant, autour d’un café ou en visio', value: 78 },
  { icon: 'link', tone: 'emerald', label: 'Présentations faites et reçues', detail: 'Les mises en relation, dans les deux sens', value: 64 },
  { icon: 'briefcase', tone: 'brand', label: 'Ce que ça a produit', detail: 'Recrue, levée, contrat, association', value: 52 },
  { icon: 'activity', tone: 'amber', label: 'Kilomètres courus avec quelqu’un', detail: 'Un kilomètre à deux vaut plus qu’un kilomètre seul', value: 71 },
]

export default function RoiInfoSheet({ onClose }) {
  const u = CURRENT_USER
  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col overflow-hidden bg-surface shadow-float">
        <div className="relative shrink-0 overflow-hidden surface-hero px-5 pb-5 pt-6 text-white">
          <div className="absolute inset-0 bg-hero-glow" />
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <ProgressRing value={u.roi.score} size={76} stroke={8} color="#FF4400" track="rgba(239,235,226,0.16)">
              <div className="text-xl font-semibold leading-none">{u.roi.score}</div>
            </ProgressRing>
            <div>
              <h2 className="text-lg font-semibold">Ton retour sur kilomètres investis</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-white/65">
                Ce que ton réseau te rapporte — pas un compteur d’abonnés.
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
              <Sparkline data={u.roi.trend} width={140} height={48} stroke="#070707" strokeWidth={2.5} />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Ce qui le fait monter</p>
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
                Deux gestes pour passer 80 : dis oui à une rencontre en attente et inscris-toi à une sortie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
