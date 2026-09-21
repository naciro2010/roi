import Icon from '../components/Icon'
import { ProgressRing, ProgressBar, Sparkline } from '../components/primitives'
import { CURRENT_USER } from '../data/user'

/* Ce que ton réseau te rapporte, en quatre lignes — les chiffres ne bougent pas. */
const FACTORS = [
  { n: '01', label: 'Rencontres qui ont eu lieu', detail: 'À l’Arena, en courant, autour d’un café ou en visio', value: 78 },
  { n: '02', label: 'Présentations faites et reçues', detail: 'Les mises en relation, dans les deux sens', value: 64 },
  { n: '03', label: 'Ce que ça a produit', detail: 'Recrue, levée, contrat, association', value: 52 },
  { n: '04', label: 'Kilomètres courus avec quelqu’un', detail: 'Un kilomètre à deux vaut plus qu’un kilomètre seul', value: 71 },
]

export default function RoiInfoSheet({ onClose }) {
  const u = CURRENT_USER
  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col overflow-hidden bg-canvas">
        <div className="surface-hero relative shrink-0 px-5 pb-5 pt-6">
          <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center border border-craie/30 text-craie tap" aria-label="Fermer">
            <Icon name="x" className="h-4 w-4" />
          </button>
          <span className="tmark"><b>T+</b> / CE QUE ÇA RAPPORTE</span>
          <div className="mt-3 flex items-center gap-4">
            <ProgressRing value={u.roi.score} size={76} stroke={8} color="#FF4400" track="rgba(239,235,226,0.16)">
              <div className="display text-[24px] leading-none text-craie">{u.roi.score}</div>
            </ProgressRing>
            <div className="min-w-0">
              <h2 className="text-[18px] text-craie">Ton retour sur<br /><span className="creuse">kilomètres investis.</span></h2>
              <p className="mt-1 text-[12.5px] leading-snug t-muted">Ce que ton réseau te rapporte — pas un compteur d’abonnés.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          {/* Évolution du score — un trait sur les dernières semaines */}
          <div className="flex items-end justify-between border-b border-fg pb-3">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-label text-fg-faint">Évolution · 8 semaines</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="display text-[30px] leading-none tabular-nums text-fg">{u.roi.score}</span>
                <span className="font-mono text-[10px] font-bold text-brand-500">+{u.roi.trend[u.roi.trend.length - 1] - u.roi.trend[0]}</span>
              </div>
            </div>
            <Sparkline data={u.roi.trend} width={140} height={48} stroke="#070707" strokeWidth={2} />
          </div>

          <h3 className="tmark mt-5">Ce qui le fait monter</h3>
          <div className="mt-2 border-t border-fg">
            {FACTORS.map((f) => (
              <div key={f.label} className="border-b border-line py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold tracking-label text-brand-500">{f.n}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium text-fg">{f.label}</div>
                    <div className="text-[12px] leading-snug text-fg-muted">{f.detail}</div>
                  </div>
                  <span className="font-mono text-[11px] font-bold tabular-nums text-fg">{f.value}</span>
                </div>
                <div className="mt-2.5 pl-8">
                  <ProgressBar value={f.value} total={100} className="bg-surface-2" barClassName="bg-brand-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-l-[3px] border-brand-500 bg-surface-2 px-3.5 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg">+{u.roi.weekDelta} cette semaine</p>
            <p className="mt-1 text-[12.5px] leading-snug text-fg-soft">
              Deux gestes pour passer 80 : dis oui à une rencontre en attente et inscris-toi à une sortie.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
