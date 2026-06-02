import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
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
        <span className="font-semibold text-fg tabular-nums">
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

/* Stat « Strava » : libellé fin en capitales, grosse valeur en gras +
   unité discrète. Colonnes séparées par des filets. */
function StravaStat({ value, label, unit }) {
  return (
    <div className="px-3.5 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-faint">{label}</div>
      <div className="mt-0.5 text-[20px] font-bold leading-none tracking-tight text-fg tabular-nums">
        {value}
        {unit && <span className="ml-0.5 text-[12px] font-semibold text-fg-muted">{unit}</span>}
      </div>
    </div>
  )
}

export default function ActivitySheet({ id, onClose }) {
  const { actKudos, toggleActKudos, openMember, contacted, contactMember, showToast } = useApp()
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
          <div className="pointer-events-none absolute left-4 top-3 z-[500] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-fg-soft shadow-soft backdrop-blur">
              <Icon name="activity" className="h-3 w-3 text-brand-500" /> {a.type}
            </span>
            {a.achievements?.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
                <Icon name="trophy" className="h-3 w-3" /> {a.achievements.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar name={a.athlete} size="md" onClick={() => openMember(a.athlete)} />
            <div className="min-w-0 flex-1">
              <button onClick={() => openMember(a.athlete)} className="truncate font-semibold text-fg">{a.athlete}</button>
              <div className="truncate text-[12px] text-fg-muted">{a.date}</div>
            </div>
            <button
              onClick={() => toggleActKudos(a.id)}
              aria-pressed={k?.liked}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                k?.liked ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              <Icon name="thumbsUp" className="h-4 w-4" filled={k?.liked} />
              <span className="tabular-nums">{k?.count ?? a.kudos}</span>
            </button>
          </div>

          <h2 className="mt-3 text-[19px] font-bold leading-tight tracking-tight text-fg">{a.title}</h2>

          {/* Stats façon Strava : grosses valeurs, libellés en capitales, filets. */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            <div className="grid grid-cols-3 divide-x divide-line">
              <StravaStat label="Distance" value={a.distance.toFixed(1)} unit="km" />
              <StravaStat label="Allure" value={a.pace} unit="/km" />
              <StravaStat label="Temps" value={a.duration} />
            </div>
            <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
              <StravaStat label="Dénivelé+" value={a.elevation} unit="m" />
              <StravaStat label="FC moy" value={a.hr} unit="bpm" />
              <StravaStat label="Calories" value={a.calories} unit="kcal" />
            </div>
          </div>

          {a.note && <p className="mt-4 text-[14px] leading-relaxed text-fg-soft">{a.note}</p>}

          {/* Réalisations — trophées & records, signature Strava. */}
          {a.achievements?.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                <Icon name="trophy" className="h-3.5 w-3.5 text-gold-dark" /> Réalisations
              </div>
              <div className="space-y-2">
                {a.achievements.map((ach) => (
                  <div key={ach.label} className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-light px-3 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-dark">
                      <Icon name={ach.icon} className="h-[18px] w-[18px]" filled={ach.icon === 'medal'} />
                    </span>
                    <span className="text-[13px] font-semibold text-fg">{ach.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <Icon name="activity" className="h-3.5 w-3.5" /> Allure par km
            </div>
            <SplitChart splits={a.splits} />
          </div>

          {/* Kudos — qui a applaudi cette sortie (façon Strava). */}
          {a.kudosBy?.length > 0 && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-soft">
              <button
                onClick={() => toggleActKudos(a.id)}
                aria-label="Donner un kudo"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full tap ${
                  k?.liked ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-2 text-fg-muted'
                }`}
              >
                <Icon name="thumbsUp" className="h-5 w-5" filled={k?.liked} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-fg tabular-nums">
                  {k?.count ?? a.kudos} kudos
                </div>
                <AvatarStack names={a.kudosBy.slice(0, 5)} total={k?.count ?? a.kudos} onMore={() => showToast(`${k?.count ?? a.kudos} kudos`)} />
              </div>
            </div>
          )}

          {a.metContacts.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                <Icon name="users" className="h-3.5 w-3.5" /> Rencontré sur cette sortie
              </div>
              <div className="space-y-2">
                {a.metContacts.map((name) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-fg">{name}</button>
                    <button
                      onClick={() => contactMember(name)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tap ${
                        contacted[name] ? 'bg-success-light text-success-dark' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand'
                      }`}
                    >
                      {contacted[name] ? 'Demandé' : 'Connecter'}
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
