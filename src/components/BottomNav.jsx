import Icon from './Icon'

/* Quatre onglets. « Courir » a disparu : son contenu (volume hebdomadaire,
   sorties) est remonté dans le bloc « Cette semaine » de l'Accueil et dans
   les stats des posts du fil. Chaque libellé dit ce qu'on y trouve, en
   français courant. */
export const TABS = [
  { id: 'accueil', label: 'Accueil', icon: 'home' },
  { id: 'reseau', label: 'Rencontres', icon: 'users' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'profil', label: 'Profil', icon: 'user' },
]

/* La nav basse : craie, un filet en haut, icône et label orange sur l'onglet
   actif. Plus de fond noir, plus de flou, plus de barre au-dessus de
   l'onglet — une pastille suffit à signaler le non-lu. */
export default function BottomNav({ active, onChange, unread }) {
  return (
    <nav
      className="z-20 flex shrink-0 border-t border-line-soft bg-canvas px-2 pt-1.5 lg:hidden"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2 tap ${isActive ? 'text-brand-500' : 'text-fg-faint'}`}
          >
            <span className="relative grid h-[26px] w-[26px] place-items-center">
              <Icon name={tab.icon} className="h-[22px] w-[22px]" strokeWidth={1.9} />
              {tab.id === 'messages' && unread > 0 && (
                <span className="absolute -right-0.5 -top-px h-[7px] w-[7px] rounded-full bg-brand-500" aria-hidden />
              )}
            </span>
            <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
