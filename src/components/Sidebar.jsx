import Icon from './Icon'
import { Logo } from './primitives'
import { TABS } from './BottomNav'
import { EDITION, daysToRace } from '../data/race'

/* Navigation latérale — grand écran seulement. Claire et compacte : 240 px
   sur le même papier craie, un filet à droite, le logotype en haut, les
   quatre onglets, et les jours avant la course en pied. Plus de sidebar
   encre, plus de sous-titres d'aide, plus de blocs Rechercher /
   Notifications / carte utilisateur. */
export default function Sidebar({ active, onChange, unread = 0 }) {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-line-soft bg-canvas px-[18px] py-[26px] lg:flex">
      <div className="pl-2.5">
        <Logo />
      </div>

      <nav className="mt-[26px] flex flex-col gap-0.5">
        {TABS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-[11px] text-left text-[15px] tap ${
                isActive ? 'bg-craie-2 font-semibold text-brand-500' : 'font-medium text-fg-faint hover:bg-craie-2/60'
              }`}
            >
              <Icon name={t.icon} className="h-[19px] w-[19px] shrink-0" />
              {t.label}
              {t.id === 'messages' && unread > 0 && (
                <span className="ml-auto h-[7px] w-[7px] rounded-full bg-brand-500" aria-hidden />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-line-soft px-3 pt-3.5 text-[13px] leading-snug text-fg-faint">
        <b className="font-semibold text-fg">{daysToRace()} jours</b> avant la course<br />
        {EDITION.label} · {EDITION.moisCourt}
      </div>
    </aside>
  )
}
