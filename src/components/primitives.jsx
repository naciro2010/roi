import Icon from './Icon'

export const PILL_TONES = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-[#E4EDE7] text-[#3C5A48]',
  indigo: 'bg-[#E3E1F0] text-[#46406E]',
  amber: 'bg-[#EFE7D8] text-[#6B5734]',
  rose: 'bg-[#F0E1E3] text-[#7A4650]',
  ink: 'bg-ink-100 text-ink-600',
}

export const DOT_TONES = {
  brand: 'bg-brand-500',
  emerald: 'bg-[#3F7559]',
  indigo: 'bg-[#5B5191]',
  amber: 'bg-[#9A7B3A]',
  rose: 'bg-[#9A5560]',
  ink: 'bg-ink-400',
}

export function Badge({ tone = 'brand', dot = true, children }) {
  return (
    <span className={`${PILL_TONES[tone]} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]}`} />}
      {children}
    </span>
  )
}

export function ProgressBar({ value, total, className = 'bg-white/30', barClassName = 'bg-white' }) {
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

export function MatchRing({ value, size = 44 }) {
  return (
    <ProgressRing value={value} size={size} stroke={4} track="rgba(79,96,160,0.14)" color="#4F60A0">
      <div className="text-[11px] font-extrabold text-brand-700">{value}</div>
    </ProgressRing>
  )
}

export function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
        <Icon name="zap" className="h-4 w-4" filled />
      </span>
      <span className={`text-[22px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
        R<span className="text-brand-500">O</span>I
      </span>
    </div>
  )
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <div className="mb-2.5 flex items-end justify-between">
      <h2 className="text-base font-bold text-ink-900">{children}</h2>
      {action && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 tap">
          {action}
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
