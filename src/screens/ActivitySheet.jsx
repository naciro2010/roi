import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { activityById } from '../data/activities'

function SplitChart({ splits }) {
  const min = Math.min(...splits)
  const max = Math.max(...splits)
  const span = max - min || 1
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: 88 }}>
        {splits.map((s, i) => {
          // Allure plus rapide (valeur basse) → barre plus haute.
          const h = 30 + ((max - s) / span) * 58
          const fastest = s === min
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-md ${fastest ? 'bg-brand-500' : 'bg-brand-200'}`}
              style={{ height: `${h}%` }}
              title={`Km ${i + 1} · ${s.toFixed(1)} /km`}
            />
          )
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {splits.map((s, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-ink-400">
            {i === 0 || (i + 1) % 5 === 0 ? i + 1 : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatBlock({ value, label }) {
  return (
    <div className="rounded-2xl bg-ink-50 p-3 text-center">
      <div className="text-lg font-extrabold text-ink-900">{value}</div>
      <div className="text-[11px] text-ink-400">{label}</div>
    </div>
  )
}

export default function ActivitySheet({ id, onClose }) {
  const { actKudos, toggleActKudos, openMember, contacted, contactMember } = useApp()
  const a = activityById(id)
  if (!a) return null
  const k = actKudos[a.id]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
        {/* Carte interactive */}
        <div className="relative h-56 shrink-0 bg-ink-100">
          <RouteMap route={a.route} interactive className="h-full w-full" />
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 z-[500] grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <span className="pointer-events-none absolute left-4 top-3 z-[500] rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-ink-700 shadow-soft backdrop-blur">
            {a.type}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar name={a.athlete} size="md" onClick={() => openMember(a.athlete)} />
            <div className="min-w-0 flex-1">
              <button onClick={() => openMember(a.athlete)} className="truncate font-bold text-ink-900">{a.athlete}</button>
              <div className="truncate text-[12px] text-ink-400">{a.date}</div>
            </div>
            <button
              onClick={() => toggleActKudos(a.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                k?.liked ? 'bg-[#EFE5E6] text-[#8C5560]' : 'bg-ink-100 text-ink-500'
              }`}
            >
              <Icon name="heart" className="h-4 w-4" filled={k?.liked} />
              {k?.count ?? a.kudos}
            </button>
          </div>

          <h2 className="mt-3 text-lg font-extrabold text-ink-900">{a.title}</h2>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <StatBlock value={`${a.distance.toFixed(1)}`} label="km" />
            <StatBlock value={a.duration} label="temps" />
            <StatBlock value={a.pace} label="/km" />
            <StatBlock value={`${a.elevation}`} label="D+ (m)" />
          </div>

          {a.note && <p className="mt-4 text-[14px] leading-relaxed text-ink-700">{a.note}</p>}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
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
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-2.5 shadow-soft">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-bold text-ink-900">{name}</button>
                    <button
                      onClick={() => contactMember(name)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold tap ${
                        contacted[name] ? 'bg-[#EAEEEB] text-[#48584E]' : 'bg-brand-500 text-white shadow-brand'
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
