import Icon from './Icon'

export const TABS = [
  { id: 'accueil', label: 'Fil', icon: 'home' },
  { id: 'reseau', label: 'Réseau', icon: 'sparkles' },
  { id: 'courir', label: 'Courir', icon: 'activity' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'profil', label: 'Profil', icon: 'user' },
]

export default function BottomNav({ active, onChange, unread }) {
  return (
    <nav className="glass z-20 shrink-0 border-t border-line px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
      <div className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 tap"
            >
              <span className={`relative grid h-8 w-9 place-items-center rounded-2xl transition-all duration-200 ${isActive ? 'bg-brand-light text-brand-600' : 'text-fg-faint'}`}>
                <Icon name={tab.icon} className="h-[22px] w-[22px]" filled={isActive && tab.icon === 'sparkles'} />
                {tab.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
                    {unread}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-brand-700' : 'text-fg-faint'}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
