import Icon from './Icon'
import { Avatar } from './Avatar'
import RouteMap from './RouteMap'

/* Bloc statistique « Strava » : libellé fin en capitales au-dessus, valeur
   en gros et gras au-dessous. Pas d'icône — la donnée parle d'elle-même. */
function Stat({ value, label }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-faint">{label}</div>
      <div className="mt-0.5 text-[19px] font-bold leading-none tracking-tight text-fg tabular-nums">{value}</div>
    </div>
  )
}

/* Aperçu compact (carte + stats) — réutilisé dans le feed et la fiche. */
export function ActivityPreview({ activity, onOpen, mapClass = 'h-44' }) {
  return (
    <button onClick={onOpen} className="block w-full overflow-hidden rounded-2xl border border-line bg-surface text-left tap">
      <div className={`relative ${mapClass} bg-surface-2`}>
        <RouteMap route={activity.route} className="h-full w-full" />
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-fg-soft shadow-soft backdrop-blur">
            <Icon name="activity" className="h-3 w-3 text-brand-500" /> {activity.type}
          </span>
          {activity.achievements?.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-[11px] font-bold text-white shadow-soft">
              <Icon name="trophy" className="h-3 w-3" /> {activity.achievements.length}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-stretch gap-3 px-3.5 py-3.5">
        <Stat value={`${activity.distance.toFixed(1)}`} label="Distance km" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={activity.pace} label="Allure /km" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={activity.duration} label="Temps" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={`${activity.elevation}`} label="D+ m" />
      </div>
    </button>
  )
}

/* Carte autonome pour l'onglet Courir › Activités. */
export function ActivityCard({ activity, kudo, onKudo, onOpen, onOpenAthlete }) {
  const liked = kudo?.liked
  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
      <div className="flex items-center gap-3 p-3.5 pb-2.5">
        <Avatar name={activity.athlete} size="md" onClick={onOpenAthlete} />
        <div className="min-w-0 flex-1">
          <button onClick={onOpenAthlete} className="block max-w-full truncate text-left font-bold text-fg tap">{activity.athlete}</button>
          <div className="flex items-center gap-1 truncate text-[12px] text-fg-muted">
            <Icon name="calendar" className="h-3 w-3 text-fg-faint" /> {activity.date}
          </div>
        </div>
      </div>

      <h3 className="px-3.5 pb-2.5 text-[17px] font-bold leading-tight tracking-tight text-fg">{activity.title}</h3>

      <div className="px-3.5">
        <ActivityPreview activity={activity} onOpen={onOpen} />
      </div>

      {activity.metContacts.length > 0 && (
        <div className="mx-3.5 mt-3 flex items-center gap-2 rounded-2xl bg-brand-light px-3 py-2 text-[12px] text-brand-800">
          <Icon name="users" className="h-4 w-4 shrink-0 text-brand-600" />
          <span>
            Rencontré <span className="font-semibold">{activity.metContacts.join(', ')}</span> sur cette sortie
          </span>
        </div>
      )}

      {/* Barre sociale « kudos » — pouce levé orange, signature Strava. */}
      <div className="mt-1 flex items-center gap-1 border-t border-line px-2 py-1.5">
        <button
          onClick={onKudo}
          aria-pressed={liked}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold tap ${
            liked ? 'text-brand-500' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${liked ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-2 text-fg-muted'}`}>
            <Icon name="thumbsUp" className="h-[18px] w-[18px]" filled={liked} />
          </span>
          <span className="tabular-nums">{kudo?.count ?? activity.kudos}</span>
        </button>
        <span className="ml-1 text-[12px] font-semibold text-fg-faint">
          {liked ? 'Tu as donné un kudo' : 'Donner un kudo'}
        </span>
        <button onClick={onOpen} className="ml-auto flex items-center gap-0.5 rounded-xl px-3 py-2 text-sm font-bold text-brand-600 tap">
          Détails <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
