import { useApp } from '../AppContext'
import { SectionTitle, Action, Tuile } from '../components/primitives'
import Icon from '../components/Icon'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById, resumeSemaine, nombre } from '../data/activities'
import { pipelineStats } from '../data/pipeline'
import { MEETING_TYPES } from '../data/meetings'
import { EDITION, daysToRace, vagueCourante } from '../data/race'
import { formatEventDate } from '../lib/dates'

/* Ce qu'il y a à faire maintenant, dans l'ordre — deux lignes au plus.
   L'accueil répond à une seule question, « et maintenant ? », au lieu
   d'empiler six blocs qui se disputent l'attention. */
function aFaire(ctx) {
  const { requests, meetings, confirmMeeting, openReseau } = ctx
  const lignes = []

  lignes.push({
    icon: 'users',
    label:
      requests.length > 1
        ? `${requests.length} personnes veulent te rencontrer`
        : requests.length === 1
          ? `${requests[0].name} veut te rencontrer`
          : 'Aucune demande en attente',
    detail: 'Dis oui ou décline. Une rencontre ne s’ouvre que si vous êtes deux à dire oui.',
    onClick: () => openReseau('contacts'),
  })

  const aConfirmer = meetings.find((m) => m.status === 'pending')
  if (aConfirmer) {
    const quand = formatEventDate(aConfirmer.date)
    const quoi = MEETING_TYPES[aConfirmer.type].label.toLowerCase()
    lignes.push({
      icon: 'calendar',
      label: `Confirme ta ${quoi} avec ${aConfirmer.with.split(' ')[0]}`,
      detail: `${quand.full} ${aConfirmer.time.replace(':', ' h ')} · ${aConfirmer.note.split('·').pop().trim()}. Il ne manque que ta confirmation.`,
      onClick: () => confirmMeeting(aConfirmer.id),
    })
  }

  return lignes.slice(0, 2)
}

export default function Accueil() {
  const ctx = useApp()
  const { openMember, openActivity, openComposer, openRace, pipeline, posts, togglePostLike, addComment } = ctx
  const u = CURRENT_USER
  const semaine = resumeSemaine()
  const pstats = pipelineStats(pipeline)
  const jours = daysToRace()
  const vague = vagueCourante()

  return (
    <div className="animate-screenIn no-scrollbar flex flex-col gap-[26px] overflow-y-auto px-5 pb-7 pt-2">

      {/* ---- 1.1 · Cette semaine — le seul bloc encre de l'app ---- */}
      <section className="surface-hero rounded-2xl p-[22px]">
        <div className="flex items-baseline justify-between gap-3 text-[13.5px] text-craie/60">
          <span>Cette semaine</span>
          <span>lun. → dim.</span>
        </div>
        <div className="mt-2.5 flex items-end gap-2">
          <span className="text-[60px] font-medium leading-[.9] tracking-[-.02em] tabular-nums">{nombre(semaine.km)}</span>
          <span className="pb-[9px] text-[17px] text-craie/70">km</span>
        </div>
        <div className="mt-[18px] grid grid-cols-3 gap-3">
          {[
            { v: semaine.sorties, l: 'sorties' },
            { v: semaine.temps, l: 'de course' },
            { v: nombre(semaine.kmAvec), l: 'km à plusieurs' },
          ].map((c) => (
            <div key={c.l}>
              <div className="text-[22px] font-medium tabular-nums">{c.v}</div>
              <div className="mt-0.5 text-[12.5px] text-craie/60">{c.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 1.2 · La course, réduite à une ligne cliquable ---- */}
      <button onClick={openRace} className="lien-bloc tap">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-craie">
          <Icon name="flag" className="h-[18px] w-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15.5px] font-semibold">{jours} jours avant la course</span>
          <span className="mt-0.5 block text-[13.5px] leading-snug text-fg-muted">
            {EDITION.label} · {EDITION.lieu} · la vague {vague.nom} est ouverte à {vague.prix} €.
          </span>
        </span>
        <Icon name="chevronRight" className="h-[18px] w-[18px] shrink-0 text-fg-faint" />
      </button>

      {/* ---- 1.3 · À faire ---- */}
      <section>
        <SectionTitle>À faire</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {aFaire(ctx).map((e) => (
            <Action key={e.label} icon={e.icon} label={e.label} detail={e.detail} onClick={e.onClick} />
          ))}
        </div>
      </section>

      {/* ---- 1.4 · Ton réseau ---- */}
      <section>
        <SectionTitle>Ton réseau</SectionTitle>
        <div className="grid grid-cols-3 gap-2.5">
          <Tuile value={u.roi.connections} label="personnes rencontrées" />
          <Tuile value={u.roi.meetings} label="présentations faites" />
          <Tuile value={pstats.active} label="relations en cours" />
        </div>
      </section>

      {/* ---- 1.5 · Le fil ---- */}
      <section>
        <SectionTitle action="Écrire" onAction={openComposer}>Le fil</SectionTitle>
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              activity={activityById(p.activityId)}
              onLike={() => togglePostLike(p.id)}
              onAddComment={(text) => addComment(p.id, text)}
              onOpenActivity={() => openActivity(p.activityId)}
              onOpenAuthor={(name) => openMember(typeof name === 'string' ? name : p.author)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
