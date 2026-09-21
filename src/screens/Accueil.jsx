import { useEffect, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { SectionTitle, Action, Chiffre } from '../components/primitives'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById } from '../data/activities'
import { pipelineStats } from '../data/pipeline'
import { EDITION, daysToRace, vagueCourante, distanceById, INSCRITS } from '../data/race'

function PostSkeleton() {
  return (
    <div className="border border-line">
      <div className="flex items-center gap-3 p-4">
        <div className="shimmer h-11 w-11 bg-surface-2" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3 w-1/3 bg-surface-2" />
          <div className="shimmer h-2.5 w-1/2 bg-surface-2" />
        </div>
      </div>
      <div className="space-y-2 px-4 pb-4">
        <div className="shimmer h-2.5 w-full bg-surface-2" />
        <div className="shimmer h-2.5 w-5/6 bg-surface-2" />
        <div className="shimmer mt-2 h-32 w-full bg-surface-2" />
      </div>
    </div>
  )
}

/* Ce qu'il y a à faire maintenant, dans l'ordre : on n'affiche que les deux
   premières. L'accueil répond à une seule question — « et maintenant ? » —
   au lieu d'empiler six blocs qui se disputent l'attention. */
function prochainesEtapes(ctx) {
  const { dossier, requests, meetings, rankedMatches, contacted, openRace, openReseau, openAgenda, openMember } = ctx
  const etapes = []

  if (requests.length > 0) {
    const r = requests[0]
    etapes.push({
      icon: 'users',
      label: requests.length === 1
        ? `${r.name} veut te rencontrer`
        : `${requests.length} personnes veulent te rencontrer`,
      detail: 'Dis oui ou décline. Une rencontre ne s’ouvre que si vous êtes deux à dire oui.',
      onClick: () => openReseau('contacts'),
    })
  }

  const aConfirmer = meetings.find((m) => m.status === 'pending')
  if (aConfirmer) {
    etapes.push({
      icon: 'calendar',
      label: `Confirme ton rendez-vous avec ${aConfirmer.with.split(' ')[0]}`,
      detail: `${aConfirmer.place}. Il ne manque que ta confirmation.`,
      onClick: openAgenda,
    })
  }

  const suggestion = rankedMatches?.find((m) => !contacted[m.name])
  if (suggestion) {
    etapes.push({
      icon: 'sparkles',
      label: `Propose une rencontre à ${suggestion.name.split(' ')[0]}`,
      detail: suggestion.reasons?.[0]?.text || 'Vous cherchez des choses qui se répondent.',
      onClick: () => openMember(suggestion.name),
    })
  }

  if (!dossier) {
    etapes.push({
      icon: 'flag',
      label: 'Prends ta place sur la ligne',
      detail: `La vague ${vagueCourante().nom} est ouverte. L’inscription se fait sur le site, en cinq minutes.`,
      onClick: openRace,
    })
  }

  return etapes.slice(0, 2)
}

export default function Accueil() {
  const ctx = useApp()
  const {
    goTo, openRoiInfo, openComposer, openMember, openActivity, openAgenda,
    openPipeline, openRace, dossier, pipeline, meetings, posts,
    togglePostLike, addComment, showToast,
  } = ctx
  const u = CURRENT_USER
  const pstats = pipelineStats(pipeline)
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const jours = daysToRace()
  const vague = vagueCourante()
  const etapes = prochainesEtapes(ctx)

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
      {/* ---- La course : un seul chiffre, une seule phrase, une seule action. ---- */}
      <button onClick={openRace} className="surface-hero block w-full px-5 pb-5 pt-4 text-left tap">
        <span className="font-mono text-[10.5px] uppercase tracking-mono text-craie/60">
          {EDITION.label} · {EDITION.lieu} · {EDITION.moisCourt}
        </span>
        <div className="mt-3 flex items-end gap-4">
          <div className="display shrink-0 whitespace-nowrap text-[56px] leading-[.82] text-craie">
            <span className="tabular-nums">{jours}</span>
          </div>
          <div className="pb-2 font-mono text-[11px] uppercase leading-snug tracking-mono text-craie/60">
            jours avant<br />la course
          </div>
        </div>
        <p className="mt-3 max-w-[38ch] text-[14px] leading-snug text-craie/80">
          {dossier
            ? <>Ta place est gardée : <b className="text-craie">{distanceById(dossier.distance).label}</b>, dossier {dossier.reference}.</>
            : <>{INSCRITS.toLocaleString('fr-FR')} personnes courent déjà. La vague <b className="text-craie">{vague.nom}</b> est ouverte à {vague.prix} €.</>}
        </p>
        <span className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-mono text-brand-500">
          {dossier ? 'Voir mon dossier' : 'Voir la course'} <span aria-hidden>→</span>
        </span>
      </button>

      <div className="space-y-7 px-5 pt-5">
        {/* ---- Et maintenant ? ---- */}
        <section>
          <h1 className="text-[26px]">{greet}, {u.name.split(' ')[0]}.</h1>
          {etapes.length > 0 ? (
            <>
              <p className="aide mt-1">Voilà ce qui t’attend. Le reste peut attendre.</p>
              <div className="mt-3 space-y-2">
                {etapes.map((e) => (
                  <Action key={e.label} icon={e.icon} plein label={e.label} detail={e.detail} onClick={e.onClick} />
                ))}
              </div>
            </>
          ) : (
            <p className="aide mt-1">Rien n’attend de réponse. Tu peux lire le fil, ou proposer une rencontre.</p>
          )}
        </section>

        {/* ---- Où aller ---- */}
        <section>
          <SectionTitle help="Les quatre endroits de l’app. Rien d’autre à retenir.">Où aller</SectionTitle>
          <div className="cadre grid-cols-2">
            {[
              { icon: 'users', label: 'Rencontres', detail: 'Qui rencontrer cette semaine', onClick: () => goTo('reseau') },
              { icon: 'activity', label: 'Courir', detail: 'Tes sorties, celles du réseau', onClick: () => goTo('courir') },
              { icon: 'calendar', label: 'Rendez-vous', detail: `${meetings.length} à venir`, onClick: openAgenda },
              { icon: 'briefcase', label: 'Suivi', detail: `${pstats.active} relation${pstats.active > 1 ? 's' : ''} en cours`, onClick: openPipeline },
            ].map((a) => (
              <button key={a.label} onClick={a.onClick} className="p-4 text-left text-fg tap hover:bg-surface-2">
                <Icon name={a.icon} className="h-5 w-5" />
                <div className="mt-2.5 text-[14.5px] font-medium leading-snug">{a.label}</div>
                <div className="mt-0.5 text-[12.5px] leading-snug text-fg-muted">{a.detail}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ---- Ce que ça t'a rapporté ---- */}
        <section>
          <SectionTitle action="Comment ça marche ?" onAction={openRoiInfo} help="Ce que tes rencontres ont produit depuis le début de l’année.">
            Ton réseau, en trois chiffres
          </SectionTitle>
          <div className="cadre grid-cols-3">
            <div className="p-3.5"><Chiffre value={u.roi.connections} label="personnes rencontrées" /></div>
            <div className="p-3.5"><Chiffre value={u.roi.meetings} label="présentations faites" /></div>
            <div className="p-3.5"><Chiffre value={pstats.active} label="relations en cours" /></div>
          </div>
        </section>

        {/* ---- Le fil ---- */}
        <section>
          <SectionTitle action="Écrire" onAction={openComposer} help="Ce que les autres racontent : une rencontre, une sortie, une présentation faite.">
            Le fil
          </SectionTitle>
          <div className="flex items-center gap-3 border border-line p-3">
            <Avatar name={u.name} size="md" onClick={() => goTo('profil')} />
            <button onClick={openComposer} className="input-ligne flex-1 text-left text-[13.5px] text-fg-faint tap" style={{ padding: '6px 0' }}>
              Raconte une rencontre, une sortie…
            </button>
            <button onClick={openComposer} className="grid h-9 w-9 shrink-0 place-items-center bg-brand-500 text-encre tap" aria-label="Écrire un message dans le fil">
              <Icon name="pencil" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {loading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : (
              <>
                {posts.map((p, i) => (
                  <div key={p.id} className="animate-cardIn" style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}>
                    <PostCard
                      post={p}
                      activity={activityById(p.activityId)}
                      onLike={() => togglePostLike(p.id)}
                      onAddComment={(text) => addComment(p.id, text)}
                      onShare={() => showToast('Partage bientôt disponible')}
                      onOpenActivity={() => openActivity(p.activityId)}
                      onOpenAuthor={(name) => openMember(name || p.author)}
                    />
                  </div>
                ))}
                <p className="pt-1 text-center text-[12.5px] text-fg-faint">Tu as tout lu.</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
