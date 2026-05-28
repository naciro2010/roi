import Icon from './Icon'
import { Avatar } from './Avatar'
import RouteMap from './RouteMap'

function Stat({ icon, value, label }) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-1 text-fg-faint">
        <Icon name={icon} className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-0.5 text-[15px] font-extrabold text-fg">{value}</div>
    </div>
  )
}

/* Aperçu compact (carte + stats) — réutilisé dans le feed et la fiche. */
export function ActivityPreview({ activity, onOpen, mapClass = 'h-40' }) {
  return (
    <button onClick={onOpen} className="block w-full overflow-hidden rounded-2xl border border-line bg-surface text-left tap">
      <div className={`relative ${mapClass} bg-surface-2`}>
        <RouteMap route={activity.route} className="h-full w-full" />
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-fg-soft shadow-soft backdrop-blur">
          {activity.type}
        </span>
      </div>
      <div className="flex items-stretch gap-2 px-3.5 py-3">
        <Stat icon="route" value={`${activity.distance.toFixed(1)} km`} label="Distance" />
        <span className="w-px self-stretch bg-surface-2" />
        <Stat icon="clock" value={activity.duration} label="Temps" />
        <span className="w-px self-stretch bg-surface-2" />
        <Stat icon="activity" value={`${activity.pace} /km`} label="Allure" />
        <span className="w-px self-stretch bg-surface-2" />
        <Stat icon="mountain" value={`${activity.elevation} m`} label="D+" />
      </div>
    </button>
  )
}

/* Carte autonome pour l'onglet Courir › Activités. */
export function ActivityCard({ activity, kudo, onKudo, onOpen, onOpenAthlete }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
      <div className="flex items-center gap-3 p-3.5 pb-2.5">
        <Avatar name={activity.athlete} size="md" onClick={onOpenAthlete} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-fg">{activity.athlete}</div>
          <div className="truncate text-[12px] text-fg-faint">{activity.date}</div>
        </div>
      </div>

      <h3 className="px-3.5 pb-2 font-bold leading-tight text-fg">{activity.title}</h3>

      <div className="px-3.5">
        <ActivityPreview activity={activity} onOpen={onOpen} />
      </div>

      {activity.metContacts.length > 0 && (
        <div className="mx-3.5 mt-3 flex items-center gap-2 rounded-2xl bg-brand-light/50 px-3 py-2 text-[12px] text-brand-800">
          <Icon name="users" className="h-4 w-4 shrink-0 text-brand-600" />
          <span>
            Rencontré <span className="font-bold">{activity.metContacts.join(', ')}</span> sur cette sortie
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-3.5 py-3">
        <button
          onClick={onKudo}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
            kudo?.liked ? 'bg-like-light text-like' : 'bg-surface-2 text-fg-muted'
          }`}
        >
          <Icon name="heart" className="h-4 w-4" filled={kudo?.liked} />
          {kudo?.count ?? activity.kudos}
        </button>
        <button onClick={onOpen} className="flex items-center gap-1 text-sm font-semibold text-brand-600 tap">
          Détails <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
