import Icon from './Icon'
import { Logo } from './primitives'
import { TABS } from './BottomNav'
import { Avatar } from './Avatar'
import { CURRENT_USER } from '../data/user'
import { EDITION, daysToRace } from '../data/race'

/* Navigation latérale — grand écran seulement. C'est la nav du site à la
   verticale : fond encre, logotype, liens mono séparés par des filets craie,
   le lien courant en orange, le survol craie sur encre. */
export default function Sidebar({ active, onChange, unread = 0, onSearch, onNotif, unreadNotif = 0 }) {
  const item = 'flex items-center gap-3 border-b border-line-craie px-4 py-3.5 text-left font-mono text-[11.5px] font-medium uppercase tracking-mono tap'
  return (
    <aside className="surface-hero hidden w-[248px] shrink-0 flex-col border-r border-line-craie lg:flex">
      <div className="border-b border-line-craie px-4 py-5">
        <Logo light size={24} />
        <div className="mt-2 font-mono text-[10px] uppercase tracking-label t-beton">Run On Investment</div>
      </div>

      <nav className="flex flex-1 flex-col">
        {TABS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`${item} items-start ${isActive ? 'text-brand-500' : 'text-craie hover:bg-craie hover:text-encre'}`}
            >
              <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                <Icon name={t.icon} className="h-[19px] w-[19px]" />
                {t.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center bg-brand-500 px-1 font-mono text-[9px] font-bold text-craie">
                    {unread}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block">{t.label}</span>
                <span className="mt-1 block font-sans text-[11.5px] normal-case tracking-normal opacity-55">{t.aide}</span>
              </span>
              {isActive && <span className="h-1.5 w-1.5 shrink-0 bg-brand-500" aria-hidden />}
            </button>
          )
        })}
      </nav>

      <div className="flex flex-col border-t border-craie">
        <button onClick={onSearch} className={`${item} t-muted hover:bg-craie hover:text-encre`}>
          <span className="grid h-5 w-5 shrink-0 place-items-center"><Icon name="search" className="h-[19px] w-[19px]" /></span>
          Rechercher
        </button>
        <button onClick={onNotif} className={`${item} t-muted hover:bg-craie hover:text-encre`}>
          <span className="relative grid h-5 w-5 shrink-0 place-items-center">
            <Icon name="bell" className="h-[19px] w-[19px]" />
            {unreadNotif > 0 && <span className="absolute right-0 top-0 h-2 w-2 bg-brand-500" />}
          </span>
          Notifications
        </button>
        <button onClick={() => onChange('profil')} className="flex items-center gap-3 px-4 py-4 text-left tap hover:bg-craie hover:text-encre">
          <Avatar name={CURRENT_USER.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{CURRENT_USER.name}</div>
            <div className="truncate text-[12px] opacity-60">Voir mon profil</div>
          </div>
        </button>
        <div className="border-t border-line-craie px-4 py-3 text-[12px] t-beton">
          <b className="text-brand-500">{daysToRace()} jours</b> avant la course · {EDITION.label}, {EDITION.moisCourt}
        </div>
      </div>
    </aside>
  )
}
