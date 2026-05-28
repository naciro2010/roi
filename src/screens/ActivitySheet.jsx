import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { activityById } from '../data/activities'
import { useSheetDrag } from '../lib/useSheetDrag'

function fmtPace(p) {
  const m = Math.floor(p)
  const s = Math.round((p - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function SplitChart({ splits }) {
  const [sel, setSel] = useState(null)
  const min = Math.min(...splits)
  const max = Math.max(...splits)
  const span = max - min || 1
  const avg = splits.reduce((t, s) => t + s, 0) / splits.length
  const heightFor = (s) => 30 + ((max - s) / span) * 58 // allure rapide (basse) → barre haute
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className="text-fg-muted">Barre haute = plus rapide</span>
        <span className="font-bold text-fg tabular-nums">
          {sel != null ? `Km ${sel + 1} · ${fmtPace(splits[sel])}/km` : `moy. ${fmtPace(avg)}/km`}
        </span>
      </div>
      <div className="relative flex items-end gap-1" style={{ height: 88 }}>
        <div
          className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-line-strong"
          style={{ bottom: `${heightFor(avg)}%` }}
        />
        {splits.map((s, i) => {
          const fastest = s === min
          const active = sel === i
          return (
            <button
              key={i}
              onClick={() => setSel(active ? null : i)}
              aria-label={`Km ${i + 1} : ${fmtPace(s)} par km`}
              className={`flex-1 rounded-t-md transition-colors ${active ? 'bg-brand-700' : fastest ? 'bg-brand-500' : 'bg-brand-200'}`}
              style={{ height: `${heightFor(s)}%` }}
            />
          )
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {splits.map((s, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-fg-faint tabular-nums">
            {i === 0 || (i + 1) % 5 === 0 ? i + 1 : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatBlock({ value, label }) {
  return (
    <div className="rounded-2xl bg-surface-soft p-3 text-center">
      <div className="text-lg font-extrabold text-fg tabular-nums">{value}</div>
      <div className="text-[11px] text-fg-muted">{label}</div>
    </div>
  )
}

export default function ActivitySheet({ id, onClose }) {
  const { actKudos, toggleActKudos, openMember, contacted, contactMember } = useApp()
  const drag = useSheetDrag(onClose)
  const a = activityById(id)
  if (!a) return null
  const k = actKudos[a.id]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-float">
        {/* Carte interactive */}
        <div className="relative h-56 shrink-0 bg-surface-2">
          <RouteMap route={a.route} interactive className="h-full w-full" />
          <div {...drag.handleProps} className="absolute left-1/2 top-0 z-[500] flex h-9 w-24 -translate-x-1/2 items-center justify-center" aria-hidden="true">
            <div className="mt-2.5 h-1.5 w-12 rounded-full bg-white/70 shadow-soft" />
          </div>
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 z-[500] grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <span className="pointer-events-none absolute left-4 top-3 z-[500] rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-fg-soft shadow-soft backdrop-blur">
            {a.type}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar name={a.athlete} size="md" onClick={() => openMember(a.athlete)} />
            <div className="min-w-0 flex-1">
              <button onClick={() => openMember(a.athlete)} className="truncate font-bold text-fg">{a.athlete}</button>
              <div className="truncate text-[12px] text-fg-muted">{a.date}</div>
            </div>
            <button
              onClick={() => toggleActKudos(a.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                k?.liked ? 'bg-like-light text-like' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              <Icon name="heart" className="h-4 w-4" filled={k?.liked} />
              {k?.count ?? a.kudos}
            </button>
          </div>

          <h2 className="mt-3 text-lg font-extrabold text-fg">{a.title}</h2>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <StatBlock value={`${a.distance.toFixed(1)}`} label="km" />
            <StatBlock value={a.duration} label="temps" />
            <StatBlock value={a.pace} label="/km" />
            <StatBlock value={`${a.elevation}`} label="D+ (m)" />
          </div>

          {a.note && <p className="mt-4 text-[14px] leading-relaxed text-fg-soft">{a.note}</p>}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-fg-muted">
              <Icon name="activity" className="h-3.5 w-3.5" /> Allure par km
            </div>
            <SplitChart splits={a.splits} />
          </div>

          {a.metContacts.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
                <Icon name="users" className="h-3.5 w-3.5" /> Rencontré sur cette sortie
              </div>
              <div className="space-y-2">
                {a.metContacts.map((name) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-bold text-fg">{name}</button>
                    <button
                      onClick={() => contactMember(name)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold tap ${
                        contacted[name] ? 'bg-success-light text-success-dark' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand'
                      }`}
                    >
                      {contacted[name] ? 'Demandé ✓' : 'Connecter'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
