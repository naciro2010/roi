import Icon from './Icon'

/* Les cinq onglets. L'ordre raconte l'année : le fil, le réseau, la course,
   les messages, le dossard (profil). */
export const TABS = [
  { id: 'accueil', label: 'Fil', icon: 'home' },
  { id: 'reseau', label: 'Annuaire', icon: 'sparkles' },
  { id: 'courir', label: 'Courir', icon: 'activity' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'profil', label: 'Dossard', icon: 'user' },
]

/* La nav du site, posée en bas : encre à 88 % et flou léger, labels mono,
   l'onglet courant en orange, des filets craie entre les liens — pas de
   pastille, pas d'arrondi. */
export default function BottomNav({ active, onChange, unread }) {
  return (
    <nav className="glass-dark z-20 shrink-0 border-t border-line-craie pb-[max(0.25rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex items-stretch divide-x divide-line-craie">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center gap-1 pb-1.5 pt-2.5 tap ${isActive ? 'text-brand-500' : 'text-craie/75 hover:bg-craie hover:text-encre'}`}
            >
              {isActive && <span className="absolute inset-x-0 top-0 h-[2px] bg-brand-500" aria-hidden />}
              <span className="relative grid h-6 w-6 place-items-center">
                <Icon name={tab.icon} className="h-[21px] w-[21px]" filled={isActive && tab.icon === 'sparkles'} />
                {tab.id === 'messages' && unread > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center bg-brand-500 px-1 font-mono text-[9px] font-bold text-craie">
                    {unread}
                  </span>
                )}
              </span>
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
