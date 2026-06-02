import Icon from './Icon'
import { Logo } from './primitives'
import { TABS } from './BottomNav'
import { Avatar } from './Avatar'
import { CURRENT_USER } from '../data/user'

/* Navigation latérale — affichée uniquement sur grand écran (lg+). Sur mobile
   c'est la BottomNav qui prend le relais. Donne à l'app un vrai layout web
   (sidebar + contenu) côté bureau, plutôt qu'une maquette « téléphone ». */
export default function Sidebar({ active, onChange, unread = 0, onSearch, onNotif, unreadNotif = 0 }) {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-surface/50 px-3 py-5 lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-7 flex flex-1 flex-col gap-1">
        {TABS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold tap ${
                isActive ? 'bg-brand-light text-brand-700' : 'text-fg-muted hover:bg-black/[0.04]'
              }`}
            >
              <span className="relative grid h-6 w-6 shrink-0 place-items-center">
                <Icon name={t.icon} className="h-[22px] w-[22px]" filled={isActive && t.icon === 'sparkles'} />
                {t.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {t.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-2 flex flex-col gap-1 border-t border-line pt-3">
        <button
          onClick={onSearch}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-fg-muted tap hover:bg-black/[0.04]"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center"><Icon name="search" className="h-[21px] w-[21px]" /></span>
          Rechercher
        </button>
        <button
          onClick={onNotif}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-fg-muted tap hover:bg-black/[0.04]"
        >
          <span className="relative grid h-6 w-6 shrink-0 place-items-center">
            <Icon name="bell" className="h-[22px] w-[22px]" />
            {unreadNotif > 0 && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand-500" />}
          </span>
          Notifications
        </button>
        <button
          onClick={() => onChange('profil')}
          className="mt-1 flex items-center gap-3 rounded-2xl px-2 py-2 text-left tap hover:bg-black/[0.04]"
        >
          <Avatar name={CURRENT_USER.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-fg">{CURRENT_USER.name}</div>
            <div className="truncate text-[11px] text-fg-muted">Voir le profil</div>
          </div>
        </button>
      </div>
    </aside>
  )
}
