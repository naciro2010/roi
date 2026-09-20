import Icon from './Icon'
import { Logo } from './primitives'
import { TABS } from './BottomNav'
import { Avatar } from './Avatar'
import { CURRENT_USER } from '../data/user'
import { EDITION, daysToRace } from '../data/race'

/* Navigation latérale — grand écran seulement. C'est la nav du site à la
   verticale : logotype, liens mono séparés par des filets, la ligne. */
export default function Sidebar({ active, onChange, unread = 0, onSearch, onNotif, unreadNotif = 0 }) {
  const item = 'flex items-center gap-3 border-b border-line px-4 py-3.5 font-mono text-[11.5px] font-medium uppercase tracking-mono tap'
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-canvas lg:flex">
      <div className="border-b border-line px-4 py-5">
        <Logo size={24} />
        <div className="mt-2 font-mono text-[10px] uppercase tracking-label text-fg-faint">Run On Investment</div>
      </div>

      <nav className="flex flex-1 flex-col">
        {TABS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`${item} ${isActive ? 'text-brand-600' : 'text-fg hover:bg-fg hover:text-craie'}`}
            >
              <span className="relative grid h-5 w-5 shrink-0 place-items-center">
                <Icon name={t.icon} className="h-[19px] w-[19px]" filled={isActive && t.icon === 'sparkles'} />
                {t.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center bg-brand-500 px-1 font-mono text-[9px] font-bold text-encre">
                    {unread}
                  </span>
                )}
              </span>
              {t.label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 bg-brand-500" aria-hidden />}
            </button>
          )
        })}
      </nav>

      <div className="flex flex-col border-t border-fg">
        <button onClick={onSearch} className={`${item} text-fg-muted hover:bg-fg hover:text-craie`}>
          <span className="grid h-5 w-5 shrink-0 place-items-center"><Icon name="search" className="h-[19px] w-[19px]" /></span>
          Rechercher
        </button>
        <button onClick={onNotif} className={`${item} text-fg-muted hover:bg-fg hover:text-craie`}>
          <span className="relative grid h-5 w-5 shrink-0 place-items-center">
            <Icon name="bell" className="h-[19px] w-[19px]" />
            {unreadNotif > 0 && <span className="absolute right-0 top-0 h-2 w-2 bg-brand-500" />}
          </span>
          Notifications
        </button>
        <button onClick={() => onChange('profil')} className="flex items-center gap-3 px-4 py-4 text-left tap hover:bg-surface-2">
          <Avatar name={CURRENT_USER.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-fg">{CURRENT_USER.name}</div>
            <div className="truncate font-mono text-[10px] uppercase tracking-mono text-fg-faint">Mon dossard</div>
          </div>
        </button>
        <div className="border-t border-line px-4 py-3 font-mono text-[9.5px] uppercase tracking-label text-fg-faint">
          <b className="text-brand-600">T–{daysToRace()}</b> · {EDITION.label} · {EDITION.moisCourt}
        </div>
      </div>
    </aside>
  )
}
