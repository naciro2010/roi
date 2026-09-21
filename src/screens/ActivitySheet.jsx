import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { couruAvec } from '../components/ActivityCard'
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
        <span className="text-fg-muted">Barre haute = kilomètre plus vif</span>
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
              className={`flex-1 transition-colors ${active ? 'bg-encre' : fastest ? 'bg-brand-500' : 'bg-craie-3'}`}
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

/* Chiffre : libellé fin en capitales, grosse valeur en gras + unité discrète. */
function Chiffre({ value, label, unit }) {
  return (
    <div className="px-3.5 py-3">
      <div className="font-mono text-[9px] uppercase tracking-label text-fg-faint">{label}</div>
      <div className="mt-0.5 text-[20px] font-bold leading-none tracking-tight text-fg tabular-nums">
        {value}
        {unit && <span className="ml-0.5 text-[12px] font-semibold text-fg-muted">{unit}</span>}
      </div>
    </div>
  )
}

export default function ActivitySheet({ id, onClose }) {
  const { actKudos, toggleActKudos, openMember, contacted, contactMember, messageMember, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const a = activityById(id)
  if (!a) return null
  const k = actKudos[a.id]
  const count = k?.count ?? a.kudos
  const avec = a.metContacts.length > 0

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-surface">
        {/* Carte interactive */}
        <div className="relative h-56 shrink-0 bg-surface-2">
          <RouteMap route={a.route} interactive className="h-full w-full" />
          <div {...drag.handleProps} className="absolute left-1/2 top-0 z-[500] flex h-9 w-24 -translate-x-1/2 items-center justify-center" aria-hidden="true">
            <div className="mt-2.5 h-1.5 w-12 bg-craie/70" />
          </div>
          <button onClick={onClose} className="absolute right-3 top-3 z-[500] grid h-9 w-9 place-items-center border border-craie/40 bg-encre/80 text-craie tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="pointer-events-none absolute left-4 top-3 z-[500] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-craie/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-fg-soft backdrop-blur">
              <Icon name="activity" className="h-3 w-3 text-brand-500" /> {a.type}
            </span>
            {avec && (
              <span className="inline-flex items-center gap-1 bg-brand-500 px-2.5 py-1 text-[11px] font-bold text-craie">
                <Icon name="users" className="h-3 w-3" /> {a.metContacts.length}
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold tap ${
                k?.liked ? 'bg-brand-500 text-craie' : 'bg-surface-2 text-fg-muted'
              }`}
            >
              <Icon name="thumbsUp" className="h-4 w-4" filled={k?.liked} />
              Bien couru <span className="tabular-nums">{count}</span>
            </button>
          </div>

          <h2 className="mt-3 text-[19px] font-bold leading-tight tracking-tight text-fg">{a.title}</h2>

          {/* D'abord : avec qui. */}
          <div className={`mt-1.5 flex items-center gap-1.5 text-[14px] ${avec ? 'font-semibold text-brand-500' : 'text-fg-muted'}`}>
            <Icon name="users" className={`h-4 w-4 shrink-0 ${avec ? 'text-brand-500' : 'text-fg-faint'}`} />
            <span>{couruAvec(a.metContacts)}</span>
          </div>

          {/* Les trois chiffres, puis le reste en discret. */}
          <div className="mt-3 overflow-hidden border border-line bg-surface">
            <div className="grid grid-cols-3 divide-x divide-line">
              <Chiffre label="Distance" value={a.distance.toFixed(1)} unit="km" />
              <Chiffre label="Temps" value={a.duration} />
              <Chiffre label="Allure" value={a.pace} unit="/km" />
            </div>
            <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
              <Chiffre label="Dénivelé+" value={a.elevation} unit="m" />
              <Chiffre label="FC moy" value={a.hr} unit="bpm" />
              <Chiffre label="Calories" value={a.calories} unit="kcal" />
            </div>
          </div>

          {a.note && <p className="mt-4 text-[14px] leading-relaxed text-fg-soft">{a.note}</p>}

          {/* Ce que la sortie a ouvert : les personnes rencontrées → une rencontre à proposer. */}
          {avec && (
            <div className="mt-5">
              <span className="titre-section">Ce que cette sortie a ouvert</span>
              <div className="mt-2.5 space-y-2">
                {a.metContacts.map((name) => (
                  <div key={name} className="border border-line bg-surface p-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                      <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-fg">{name}</button>
                      <span className="shrink-0 text-[11px] font-semibold tabular-nums text-fg-muted">{a.distance.toFixed(1)} km ensemble</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => contactMember(name)}
                        disabled={!!contacted[name]}
                        className={`flex-1 btn btn-sm ${contacted[name] ? 'btn-encre' : 'btn-impact'}`}
                      >
                        <span>{contacted[name] ? 'Rencontre proposée' : 'Proposer une rencontre'}</span>
                      </button>
                      <button
                        onClick={() => (messageMember ? messageMember(name) : openMember(name))}
                        className="btn btn-sm btn-ghost"
                      >
                        <span>Écrire</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sur cette sortie — ce que la sortie a marqué. */}
          {a.achievements?.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5 tmark sans">
                <Icon name="flag" className="h-3.5 w-3.5 text-brand-500" /> Sur cette sortie
              </div>
              <div className="space-y-2">
                {a.achievements.map((ach) => (
                  <div key={ach.label} className="flex items-center gap-3 border border-line bg-surface-soft px-3 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-surface-2 text-fg">
                      <Icon name={ach.icon} className="h-[18px] w-[18px]" filled={ach.icon === 'medal'} />
                    </span>
                    <span className="text-[13px] font-semibold text-fg">{ach.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 tmark sans">
              <Icon name="route" className="h-3.5 w-3.5" /> Les kilomètres
            </div>
            <SplitChart splits={a.splits} />
          </div>

          {/* Bien couru — qui l'a dit. */}
          {a.kudosBy?.length > 0 && (
            <div className="mt-5 flex items-center gap-3 border border-line bg-surface p-3">
              <button
                onClick={() => toggleActKudos(a.id)}
                aria-label="Bien couru"
                aria-pressed={k?.liked}
                className={`grid h-10 w-10 shrink-0 place-items-center tap ${
                  k?.liked ? 'bg-brand-500 text-craie' : 'bg-surface-2 text-fg-muted'
                }`}
              >
                <Icon name="thumbsUp" className="h-5 w-5" filled={k?.liked} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-fg tabular-nums">
                  {count} « bien couru »
                </div>
                <AvatarStack names={a.kudosBy.slice(0, 5)} total={count} onMore={() => showToast(`${count} « bien couru »`)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
