import { useEffect, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { ProgressRing } from '../components/primitives'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById } from '../data/activities'

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
  const { goTo, openRoiInfo, openComposer, openMember, openActivity, openAgenda, meetings, posts, togglePostLike, addComment, showToast } = useApp()
  const u = CURRENT_USER
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-screenIn space-y-3 overflow-y-auto no-scrollbar px-4 pb-6 pt-3">
      {/* ROI compact */}
      <button
        onClick={openRoiInfo}
        className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
      >
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative">
          <ProgressRing value={u.roi.score} size={62} stroke={6} color="#AEB8D6" track="rgba(255,255,255,0.14)">
            <div className="text-lg font-extrabold leading-none">{u.roi.score}</div>
          </ProgressRing>
        </div>
        <div className="relative flex-1">
          <div className="flex items-center gap-1.5 text-sm font-bold">
            {greet}, {u.name.split(' ')[0]}
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[11px] font-bold text-success-300 ring-1 ring-white/15">
              <Icon name="trendingUp" className="h-3 w-3" /> +{u.roi.weekDelta}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] leading-snug text-white/65">
            Score réseau · {u.roi.connections} connexions · {u.roi.opportunities} opportunités
          </p>
        </div>
        <Icon name="chevronRight" className="relative h-5 w-5 text-white/60" />
      </button>

      {/* Composer */}
      <div className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 shadow-soft">
        <Avatar name={u.name} size="md" onClick={() => goTo('profil')} />
        <button
          onClick={openComposer}
          className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-left text-sm text-fg-faint tap"
        >
          Partage une réflexion, un REX, un tip…
        </button>
        <button onClick={openComposer} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-brand tap" aria-label="Nouveau post">
          <Icon name="pencil" className="h-4 w-4" />
        </button>
      </div>

      {/* Tempo de la semaine — business & running en un coup d'œil */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: 'route', value: `${u.stats.km}`, unit: 'km', label: 'ce mois', tone: 'text-brand-500', onClick: () => goTo('courir') },
          { icon: 'calendar', value: `${meetings.length}`, unit: '', label: 'RDV à venir', tone: 'text-success', onClick: openAgenda },
          { icon: 'briefcase', value: `${u.roi.opportunities}`, unit: '', label: 'opportunités', tone: 'text-gold-dark', onClick: openRoiInfo },
        ].map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className="rounded-2xl border border-line bg-surface p-3 text-left shadow-soft tap"
          >
            <Icon name={s.icon} className={`h-4 w-4 ${s.tone}`} />
            <div className="mt-2 flex items-baseline gap-0.5">
              <span className="text-xl font-extrabold tabular-nums text-fg">{s.value}</span>
              {s.unit && <span className="text-[11px] font-bold text-fg-faint">{s.unit}</span>}
            </div>
            <div className="text-[11px] text-fg-muted">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <>
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              activity={activityById(p.activityId)}
              onLike={() => togglePostLike(p.id)}
              onAddComment={(text) => addComment(p.id, text)}
              onShare={() => showToast('Partage bientôt disponible')}
              onOpenActivity={() => openActivity(p.activityId)}
              onOpenAuthor={(name) => openMember(name || p.author)}
            />
          ))}
          <p className="pt-1 text-center text-xs text-fg-faint">Tu es à jour ✓</p>
        </>
      )}
    </div>
  )
}
