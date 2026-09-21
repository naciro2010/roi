import Icon from './Icon'

/* Tons des étiquettes : dans « La Ligne » il n'y a qu'un accent. Les tons
   historiques restent comme clés (les données les utilisent) mais tous
   rendent une étiquette craie/encre, à l'exception de `brand` (orange). */
export const PILL_TONES = {
  brand: 'bg-brand-500 text-craie',
  emerald: 'bg-surface-2 text-fg',
  indigo: 'bg-surface-2 text-fg',
  amber: 'bg-surface-2 text-fg',
  rose: 'bg-surface-2 text-fg',
  ink: 'bg-encre text-craie',
}

export const DOT_TONES = {
  brand: 'bg-brand-500',
  emerald: 'bg-fg',
  indigo: 'bg-fg',
  amber: 'bg-brand-500',
  rose: 'bg-brand-500',
  ink: 'bg-fg-faint',
}

/* Étiquette mono bordée, la puce carrée ■ orange devant : le `.tag` du site
   (les notes des cellules, la data des formats). */
export function Badge({ tone = 'brand', dot = true, on = false, className = '', children }) {
  return (
    <span className={`tag ${on ? 'on' : ''} ${className}`}>
      {dot && <b>■</b>}
      {children}
    </span>
  )
}

/* Jauge : un filet qui se remplit d'orange — la ligne de progression du site. */
export function ProgressBar({ value, total, className = 'bg-craie/15', barClassName = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className={`h-1 w-full overflow-hidden ${className}`}>
      <div className={`h-full ${barClassName} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ProgressRing({ value, size = 76, stroke = 8, track = 'rgba(239,235,226,0.18)', color = '#EFEBE2', children }) {
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
          strokeLinecap="butt"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

// Décomposition de la proposition (Intention · Course · Affinité) — 3 mini-jauges.
const COMPAT_BARS = [
  { key: 'need', label: 'Intention', bar: 'bg-brand-500' },
  { key: 'run', label: 'Course', bar: 'bg-fg' },
  { key: 'behavior', label: 'Affinité', bar: 'bg-fg-faint' },
]
export function CompatBars({ parts, className = '' }) {
  return (
    <div className={`flex gap-2.5 ${className}`}>
      {COMPAT_BARS.map(({ key, label, bar }) => (
        <div key={key} className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-mono text-fg-faint">{label}</span>
            <span className="font-mono text-[10px] font-bold tabular-nums text-fg-muted">{Math.round((parts[key] || 0) * 100)}</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden bg-surface-2">
            <div className={`h-full ${bar} transition-all duration-700`} style={{ width: `${Math.round((parts[key] || 0) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MatchRing({ value, size = 44 }) {
  return (
    <ProgressRing value={value} size={size} stroke={3} track="rgba(14,13,12,0.14)" color="#FF4400">
      <div className="font-mono text-[11px] font-bold text-fg">{value}</div>
    </ProgressRing>
  )
}

// Mini-courbe de tendance : un trait, pas d'aire — la ligne, encore.
export function Sparkline({ data, width = 92, height = 34, stroke = '#EFEBE2', strokeWidth = 1.5, className = '' }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const y = (v) => height - 3 - ((v - min) / range) * (height - 6)
  const pts = data.map((v, i) => [i * step, y(v)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} fill="none" aria-hidden>
      <path d={line} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" />
      <rect x={last[0] - 3} y={last[1] - 3} width="6" height="6" fill="#FF4400" />
    </svg>
  )
}

/* Le logotype R■O■I : deux points carrés orange, le même que sur le site. */
export function Logo({ light = false, size = 22 }) {
  return (
    <span
      className={`inline-flex items-center gap-[3px] leading-none ${light ? 'text-craie' : 'text-fg'}`}
      style={{ fontStretch: '118%', fontWeight: 300, fontSize: size, letterSpacing: '.04em' }}
      aria-label="R.O.I — Run On Investment"
    >
      R<i className="mb-[3px] inline-block self-end bg-brand-500" style={{ width: size * 0.27, height: size * 0.27, margin: `0 ${size * 0.23}px ${size * 0.14}px` }} />
      O<i className="mb-[3px] inline-block self-end bg-brand-500" style={{ width: size * 0.27, height: size * 0.27, margin: `0 ${size * 0.23}px ${size * 0.14}px` }} />
      I
    </span>
  )
}

/* La formule, près du nom (rien pour le Dossard) : la pastille du verso du
   dossard, « ■ Premium » / « ■ Cercle ». */
export function PlanBadge({ plan, className = '' }) {
  if (!plan || plan === 'free') return null
  return (
    <span className={`inline-flex items-center gap-1 bg-brand-500 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-mono text-encre ${className}`}>
      ■ {plan === 'business' ? 'Cercle' : 'Premium'}
    </span>
  )
}

// Puce « fermé » : ce qui s'ouvre avec une autre formule.
export function LockChip({ label = 'Premium', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-encre px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-mono text-craie ${className}`}>
      <Icon name="lock" className="h-2.5 w-2.5" />
      {label}
    </span>
  )
}

/* Titre de section : l'étiquette chrono du site (« T+03 / LE RÉSEAU »). */
export function SectionTitle({ children, action, onAction, t }) {
  return (
    <div className="mb-2.5 flex items-end justify-between gap-3">
      <h2 className="tmark">
        {t && <b>{t}</b>}
        {t ? ' / ' : ''}{children}
      </h2>
      {action && (
        <button onClick={onAction} className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-mono text-brand-500 tap">
          {action} <span aria-hidden>→</span>
        </button>
      )}
    </div>
  )
}

/* Fiche clé / valeur — la <dl class="fiche"> du site. rows = [[clé, valeur, note?]] */
export function Fiche({ rows, className = '' }) {
  return (
    <dl className={`fiche ${className}`}>
      {rows.map(([k, v, note]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}{note && <small>{note}</small>}</dd>
        </div>
      ))}
    </dl>
  )
}
