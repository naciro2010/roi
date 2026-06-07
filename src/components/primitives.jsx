import Icon from './Icon'

// Tons d'accent : tuiles claires + texte profond pour un rendu premium clair.
export const PILL_TONES = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-success-light text-success-dark',
  // Violet saturé : catégorie distincte de la marque (désormais indigo).
  indigo: 'bg-[#EDE9FE] text-[#5B21B6]',
  amber: 'bg-gold-light text-gold-dark',
  rose: 'bg-like-light text-[#8B3C49]',
  ink: 'bg-surface-2 text-fg-soft',
}

export const DOT_TONES = {
  brand: 'bg-brand-500',
  emerald: 'bg-success',
  indigo: 'bg-[#7C3AED]',
  amber: 'bg-gold',
  rose: 'bg-like',
  ink: 'bg-fg-faint',
}

export function Badge({ tone = 'brand', dot = true, children }) {
  return (
    <span className={`${PILL_TONES[tone]} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]}`} />}
      {children}
    </span>
  )
}

export function ProgressBar({ value, total, className = 'bg-white/15', barClassName = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${className}`}>
      <div className={`h-full rounded-full ${barClassName} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ProgressRing({ value, size = 76, stroke = 8, track = 'rgba(255,255,255,0.18)', color = '#fff', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, value))
  const offset = c - (pct / 100) * c
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

// Décomposition de compatibilité (Besoin · Running · Affinité) — 3 mini-jauges.
const COMPAT_BARS = [
  { key: 'need', label: 'Besoin', bar: 'bg-brand-500' },
  { key: 'run', label: 'Running', bar: 'bg-success' },
  { key: 'behavior', label: 'Affinité', bar: 'bg-gold' },
]
export function CompatBars({ parts, className = '' }) {
  return (
    <div className={`flex gap-2.5 ${className}`}>
      {COMPAT_BARS.map(({ key, label, bar }) => (
        <div key={key} className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-fg-faint">{label}</span>
            <span className="text-[10px] font-bold tabular-nums text-fg-muted">{Math.round((parts[key] || 0) * 100)}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${Math.round((parts[key] || 0) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MatchRing({ value, size = 44 }) {
  return (
    <ProgressRing value={value} size={size} stroke={4} track="rgba(99,102,241,0.14)" color="#6366F1">
      <div className="text-[11px] font-bold text-fg">{value}</div>
    </ProgressRing>
  )
}

// Mini-courbe de tendance sobre. Ligne + aire dégradée.
export function Sparkline({ data, width = 92, height = 34, stroke = '#FFFFFF', strokeWidth = 2.25, className = '' }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const y = (v) => height - 3 - ((v - min) / range) * (height - 6)
  const pts = data.map((v, i) => [i * step, y(v)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkfill)" />
      <path d={line} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={stroke} />
    </svg>
  )
}

export function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-brand">
        <Icon name="activity" className="h-[18px] w-[18px]" />
      </span>
      <span className={`font-display text-[22px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-fg'}`}>
        R<span className="text-brand-500">O</span>I
      </span>
    </div>
  )
}

// Badge d'abonnement affiché près du nom (rien pour le plan gratuit).
export function PlanBadge({ plan, className = '' }) {
  if (!plan || plan === 'free') return null
  const isBusiness = plan === 'business'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
        isBusiness
          ? 'bg-gold/15 text-gold-dark ring-gold/30'
          : 'bg-brand-50 text-brand-700 ring-brand-200'
      } ${className}`}
    >
      <Icon name="crown" className="h-2.5 w-2.5" filled />
      {isBusiness ? 'Business' : 'Pro'}
    </span>
  )
}

// Puce « verrouillé » pour signaler une fonctionnalité premium.
export function LockChip({ label = 'Pro', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-surface-3/90 px-2 py-0.5 text-[10px] font-semibold text-white ${className}`}>
      <Icon name="lock" className="h-2.5 w-2.5" />
      {label}
    </span>
  )
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <div className="mb-2.5 flex items-end justify-between">
      <h2 className="text-base font-semibold text-fg">{children}</h2>
      {action && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 tap">
          {action}
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
