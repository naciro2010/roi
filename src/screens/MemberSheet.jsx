import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { personFor } from '../data/network'

export default function MemberSheet({ name, onClose }) {
  const { contacted, contactMember, messageMember } = useApp()
  const p = personFor(name)
  const isContacted = contacted[name]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
        <div className="relative h-24 shrink-0 overflow-hidden bg-ink-950">
          <div className="absolute inset-0 bg-hero-glow" />
          <button onClick={onClose} className="glass-dark absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
          <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          <div className="-mt-10 flex items-end gap-3">
            <div className="rounded-full p-1 ring-4 ring-white">
              <Avatar name={name} size="xl" />
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-extrabold text-ink-900">{name}</h2>
              <p className="text-sm text-ink-500">{p.title}</p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-ink-400">
            <Icon name="mapPin" className="h-3.5 w-3.5" /> {p.location}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-700">{p.bio}</p>

          {p.looking?.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
                <Icon name="target" className="h-3.5 w-3.5" /> Recherche
              </div>
              <div className="flex flex-wrap gap-2">
                {p.looking.map((x) => (
                  <span key={x} className="rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-700">{x}</span>
                ))}
              </div>
            </div>
          )}

          {p.offering?.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#48584E]">
                <Icon name="link" className="h-3.5 w-3.5" /> Propose
              </div>
              <div className="flex flex-wrap gap-2">
                {p.offering.map((x) => (
                  <span key={x} className="rounded-full bg-[#EAEEEB] px-3 py-1.5 text-sm font-semibold text-[#48584E]">{x}</span>
                ))}
              </div>
            </div>
          )}

          {p.mutuals?.length > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
              <AvatarStack names={p.mutuals.slice(0, 3)} total={p.mutuals.length} onMore={() => {}} />
              <span className="text-[13px] text-ink-600">
                <span className="font-bold text-ink-900">{p.mutuals.length} connexions</span> en commun
              </span>
            </div>
          )}

          {p.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">#{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="glass flex shrink-0 items-center gap-2 border-t border-ink-100 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => contactMember(name)}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white tap ${isContacted ? 'bg-[#4E6B59]' : 'bg-brand-500 shadow-brand'}`}
          >
            {isContacted ? 'Demande envoyée ✓' : 'Entrer en contact'}
          </button>
          <button
            onClick={() => messageMember(name)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-ink-200 text-ink-700 tap"
            aria-label="Message"
          >
            <Icon name="chat" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
