import Icon from './Icon'
import { Avatar } from './Avatar'
import RouteMap from './RouteMap'

/* « Couru avec Sarah et Marc » — prénoms reliés par « et ». */
export function couruAvec(names = []) {
  const prenoms = names.map((n) => n.split(' ')[0])
  if (prenoms.length === 0) return 'En solo'
  if (prenoms.length === 1) return `Couru avec ${prenoms[0]}`
  return `Couru avec ${prenoms.slice(0, -1).join(', ')} et ${prenoms[prenoms.length - 1]}`
}

/* Bloc statistique, comme la fiche méta du hero du site : libellé mono en
   capitales au-dessus, valeur en Archivo fin au-dessous. */
function Stat({ value, label }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="text-[12px] text-fg-muted">{label}</div>
      <div className="display mt-1 text-[20px] leading-none text-fg tabular-nums">{value}</div>
    </div>
  )
}

/* Aperçu compact (carte + chiffres) — réutilisé dans le fil et la fiche. */
export function ActivityPreview({ activity, onOpen, mapClass = 'h-44' }) {
  return (
    <button onClick={onOpen} className="block w-full overflow-hidden border border-line text-left tap">
      <div className={`relative ${mapClass} bg-surface-2`}>
        <RouteMap route={activity.route} className="h-full w-full" />
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 bg-craie/90 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {activity.type}
          </span>
          {activity.metContacts?.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-brand-500 px-2 py-1 font-mono text-[9.5px] font-bold text-craie">
              <Icon name="users" className="h-3 w-3" /> {activity.metContacts.length}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-stretch gap-3 px-3.5 py-3">
        <Stat value={`${activity.distance.toFixed(1)}`} label="Km" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={activity.duration} label="Temps" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={activity.pace} label="Allure" />
        <span className="w-px self-stretch bg-line" />
        <Stat value={`${activity.elevation}`} label="D+ m" />
      </div>
    </button>
  )
}

/* Carte autonome pour l'onglet Courir › Mes sorties. */
export function ActivityCard({ activity, kudo, onKudo, onOpen, onOpenAthlete }) {
  const liked = kudo?.liked
  const avec = activity.metContacts?.length > 0
  return (
    <article className="border border-line">
      <div className="flex items-center gap-3 p-3.5 pb-2.5">
        <Avatar name={activity.athlete} size="md" onClick={onOpenAthlete} />
        <div className="min-w-0 flex-1">
          <button onClick={onOpenAthlete} className="block max-w-full truncate text-left text-[15px] font-medium text-fg tap">{activity.athlete}</button>
          <div className="truncate text-[12.5px] text-fg-muted">{activity.date}</div>
        </div>
      </div>

      <h3 className="titre px-3.5 text-[15px] text-fg">{activity.title}</h3>

      {/* La première chose sous le titre : avec qui. La valeur d'une sortie,
          c'est qui on a rencontré, pas le chrono. */}
      <div className="mt-1 flex items-center gap-1.5 px-3.5 pb-2.5 font-mono text-[11px] font-bold uppercase tracking-mono">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${avec ? 'bg-brand-500' : 'bg-fg-faint'}`} />
        <span className={`truncate ${avec ? 'text-fg' : 'text-fg-faint'}`}>{couruAvec(activity.metContacts)}</span>
      </div>

      <div className="px-3.5">
        <ActivityPreview activity={activity} onOpen={onOpen} />
      </div>

      {/* Barre sociale « bien couru » */}
      <div className="mt-2.5 flex items-center border-t border-line">
        <button
          onClick={onKudo}
          aria-pressed={liked}
          className={`flex items-center gap-2 px-3.5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-mono tap ${liked ? 'text-brand-500' : 'text-fg-muted hover:text-fg'}`}
        >
          <Icon name="thumbsUp" className="h-4 w-4" filled={liked} />
          <span>Bien couru</span>
          <span className="tabular-nums">{kudo?.count ?? activity.kudos}</span>
        </button>
        <button onClick={onOpen} className="ml-auto flex items-center gap-1.5 px-3.5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-mono text-fg tap">
          La sortie <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  )
}
