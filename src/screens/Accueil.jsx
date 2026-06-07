import { useEffect, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Sparkline } from '../components/primitives'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById } from '../data/activities'
import { pipelineStats } from '../data/pipeline'

function PostSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      <div className="flex items-center gap-3 p-4">
        <div className="shimmer h-11 w-11 rounded-full bg-surface-2" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3 w-1/3 rounded bg-surface-2" />
          <div className="shimmer h-2.5 w-1/2 rounded bg-surface-2" />
        </div>
      </div>
      <div className="space-y-2 px-4 pb-4">
        <div className="shimmer h-2.5 w-full rounded bg-surface-2" />
        <div className="shimmer h-2.5 w-5/6 rounded bg-surface-2" />
        <div className="shimmer mt-2 h-32 w-full rounded-2xl bg-surface-2" />
      </div>
    </div>
  )
}

export default function Accueil() {
  const { goTo, openRoiInfo, openComposer, openMember, openActivity, openAgenda, openInvite, openPipeline, openRunMatch, openRace, raceRegistration, runMatches, pipeline, hasFeature, meetings, posts, togglePostLike, addComment, showToast } = useApp()
  const u = CURRENT_USER
  const pstats = pipelineStats(pipeline)
  const showPipelineValue = hasFeature('analytics')
  const topRun = runMatches?.[0]
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-screenIn space-y-3 overflow-y-auto no-scrollbar px-4 pb-6 pt-3">
      {/* Hero « balance card » — score ROI mis en avant, façon Revolut */}
      <button
        onClick={openRoiInfo}
        className="relative block w-full overflow-hidden rounded-3xl surface-hero p-5 text-left text-white shadow-float tap"
      >
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-white/70">{greet}, {u.name.split(' ')[0]}</p>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-[44px] font-bold leading-none tracking-tight tabular-nums">{u.roi.score}</span>
                <span className="mb-1 text-sm font-semibold text-white/55">/100</span>
              </div>
              <p className="mt-1.5 text-[12px] font-semibold text-white/65">Score réseau ROI</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/18 px-2 py-1 text-[11px] font-bold text-white ring-1 ring-white/20">
                <Icon name="trendingUp" className="h-3 w-3" /> +{u.roi.weekDelta} cette sem.
              </span>
              <Sparkline data={u.roi.trend} width={96} height={36} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/12 pt-3">
            {[
              { value: u.roi.connections, label: 'Connexions' },
              { value: meetings.length, label: 'RDV' },
              { value: pstats.active, label: 'Pipeline' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-lg font-semibold tabular-nums leading-none">{s.value}</div>
                <div className="mt-1 text-[11px] text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </button>

      {/* Actions rapides — pastilles circulaires façon Revolut */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { icon: 'sparkles', label: 'Réseau', onClick: () => goTo('reseau') },
          { icon: 'activity', label: 'Courir', onClick: () => goTo('courir') },
          { icon: 'calendar', label: 'RDV', onClick: openAgenda },
          { icon: 'gift', label: 'Inviter', onClick: openInvite },
        ].map((a) => (
          <button key={a.label} onClick={a.onClick} className="flex flex-col items-center gap-1.5 py-1 tap">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Icon name={a.icon} className="h-[22px] w-[22px]" />
            </span>
            <span className="text-[11px] font-semibold text-fg-soft">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Course officielle ROI Business Run · La Défense */}
      <button onClick={openRace} className="relative block w-full overflow-hidden rounded-3xl border border-gold/30 bg-surface p-3.5 text-left shadow-card tap">
        <div className="absolute inset-0 bg-gold-sheen" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-light text-gold-dark">
            <Icon name="flag" className="h-[22px] w-[22px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Officiel</span>
              <span className="text-[11px] font-semibold text-fg-muted">17 sept. · La Défense</span>
            </div>
            <div className="mt-0.5 text-[14px] font-extrabold leading-tight text-fg">ROI Business Run</div>
            <div className="truncate text-[11.5px] text-fg-muted">
              {raceRegistration?.confirmed ? `Inscrit·e · dossard ${raceRegistration.dossard}` : '10 000 dirigeants · 5 · 10 · 21 km'}
            </div>
          </div>
          <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-fg-faint" />
        </div>
      </button>

      {/* Pipeline ROI & RunMatch — la boucle business × sport */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={openPipeline} className="rounded-3xl border border-line bg-surface p-3.5 text-left shadow-soft tap">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-light text-gold-dark">
              <Icon name="briefcase" className="h-[18px] w-[18px]" />
            </span>
            <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
          </div>
          <div className="mt-2.5 text-xl font-extrabold tabular-nums leading-none text-fg">
            {showPipelineValue ? `${pstats.value} k€` : pstats.active}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-fg-soft">Pipeline ROI</div>
          <div className="text-[11px] text-fg-faint">
            {showPipelineValue
              ? `${pstats.active} relation${pstats.active > 1 ? 's' : ''} active${pstats.active > 1 ? 's' : ''}`
              : 'Suivi des relations · Analytics Pro'}
          </div>
        </button>

        <button onClick={openRunMatch} className="relative overflow-hidden rounded-3xl surface-hero p-3.5 text-left text-white shadow-float tap">
          <div className="absolute inset-0 bg-aurora" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/15">
                <Icon name="activity" className="h-[18px] w-[18px]" />
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-white/60" />
            </div>
            <div className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">RunMatch</div>
            <div className="text-base font-extrabold leading-tight">{topRun ? `Cours avec ${topRun.name.split(' ')[0]}` : 'Ton binôme de run'}</div>
            <div className="text-[11px] text-white/65">Propose un run cette semaine</div>
          </div>
        </button>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 shadow-soft">
        <Avatar name={u.name} size="md" onClick={() => goTo('profil')} />
        <button
          onClick={openComposer}
          className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-left text-sm text-fg-faint tap"
        >
          Partage une analyse, un retour d’expérience, une opportunité…
        </button>
        <button onClick={openComposer} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand tap" aria-label="Nouveau post">
          <Icon name="pencil" className="h-4 w-4" />
        </button>
      </div>

      {/* Feed */}
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
          <p className="pt-1 text-center text-xs text-fg-faint">Tu es à jour</p>
        </>
      )}
    </div>
  )
}
