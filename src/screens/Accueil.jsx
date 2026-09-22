import { useApp } from '../AppContext'
import { SectionTitle, Action, Tuile } from '../components/primitives'
import BlocEdition from '../components/BlocEdition'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById, resumeSemaine, nombre } from '../data/activities'
import { pipelineStats } from '../data/pipeline'
import { MEETING_TYPES } from '../data/meetings'
import { NOUVELLES, CATEGORIES, dateNouvelle } from '../data/news'
import { dateLongue } from '../data/plans'
import { formatEventDate } from '../lib/dates'

/* Ce qu'il y a à faire maintenant, dans l'ordre — trois lignes au plus.
   L'accueil répond à deux questions : où j'en suis de la course, et
   qu'est-ce qu'on attend de moi. */
function aFaire(ctx) {
  const { requests, meetings, confirmMeeting, openReseau, abonnement, etatAbo, openPlans } = ctx
  const lignes = []

  // L'abonnement d'abord quand il touche à sa fin : c'est ce qui ferme tout.
  if (etatAbo.statut === 'expire') {
    lignes.push({
      icon: 'crown',
      label: 'Ton abonnement a expiré',
      detail: 'Tu peux tout lire, mais plus écrire ni proposer de rencontre. Ça se reprend en une minute.',
      onClick: openPlans,
    })
  } else if (etatAbo.bientot) {
    lignes.push({
      icon: 'crown',
      label: `Ton abonnement se termine dans ${etatAbo.jours} jours`,
      detail: `Échéance le ${dateLongue(abonnement.echeance)}. Sans renouvellement, l’app passe en lecture seule.`,
      onClick: openPlans,
    })
  }

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

  return lignes.slice(0, 3)
}

/* Une nouvelle de R.O.I : d'où elle vient, quand, et ce qu'elle dit. */
function Nouvelle({ n, onOpen }) {
  const cat = CATEGORIES[n.categorie]
  return (
    <button onClick={onOpen} className="w-full rounded-xl border border-line bg-surface p-[18px] text-left tap">
      <div className="flex items-baseline gap-2 text-[12.5px]">
        <span className="font-semibold text-brand-500">{cat.label}</span>
        <span className="text-fg-faint">· {dateNouvelle(n.date)}</span>
      </div>
      <div className="mt-1.5 text-[15.5px] font-semibold leading-snug">{n.titre}</div>
      <p className="mt-1.5 text-[14px] leading-[1.5] text-fg-muted">{n.chapo}</p>
    </button>
  )
}

export default function Accueil() {
  const ctx = useApp()
  const {
    openMember, openActivity, openComposer, openRace, openNews,
    pipeline, posts, togglePostLike, addComment, avancement,
  } = ctx
  const u = CURRENT_USER
  const semaine = resumeSemaine()
  const pstats = pipelineStats(pipeline)

  return (
    <div className="animate-screenIn no-scrollbar flex flex-col gap-[26px] overflow-y-auto px-5 pb-7 pt-2">

      {/* ---- Ton dossard et ta route vers la course ---- */}
      <BlocEdition dossard={u.dossard} avancement={avancement} onOpen={openRace} />

      {/* ---- Ta semaine de course, en trois chiffres ---- */}
      <section className="grid shrink-0 grid-cols-3 gap-3 rounded-lg border border-line bg-surface px-[18px] py-4">
        {[
          { v: nombre(semaine.km), l: 'km cette semaine' },
          { v: semaine.sorties, l: 'sorties' },
          { v: nombre(semaine.kmAvec), l: 'km à plusieurs' },
        ].map((c) => (
          <div key={c.l}>
            <div className="text-[22px] font-medium leading-none tabular-nums">{c.v}</div>
            <div className="mt-1.5 text-[12.5px] leading-[1.3] text-fg-muted">{c.l}</div>
          </div>
        ))}
      </section>

      {/* ---- À faire ---- */}
      <section>
        <SectionTitle>À faire</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {aFaire(ctx).map((e) => (
            <Action key={e.label} icon={e.icon} label={e.label} detail={e.detail} onClick={e.onClick} />
          ))}
        </div>
      </section>

      {/* ---- Les nouvelles de R.O.I ---- */}
      <section>
        <SectionTitle action="Tout voir" onAction={() => openNews()}>Les nouvelles de R.O.I</SectionTitle>
        <div className="flex flex-col gap-3">
          {NOUVELLES.slice(0, 2).map((n) => (
            <Nouvelle key={n.id} n={n} onOpen={() => openNews(n.id)} />
          ))}
        </div>
      </section>

      {/* ---- Ton réseau ---- */}
      <section>
        <SectionTitle>Ton réseau</SectionTitle>
        <div className="grid grid-cols-3 gap-2.5">
          <Tuile value={u.roi.connections} label="personnes rencontrées" />
          <Tuile value={u.roi.meetings} label="présentations faites" />
          <Tuile value={pstats.active} label="relations en cours" />
        </div>
      </section>

      {/* ---- Le fil ---- */}
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
