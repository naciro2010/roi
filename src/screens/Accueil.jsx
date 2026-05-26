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
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      <div className="flex items-center gap-3 p-4">
        <div className="shimmer h-11 w-11 rounded-full bg-ink-100" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3 w-1/3 rounded bg-ink-100" />
          <div className="shimmer h-2.5 w-1/2 rounded bg-ink-100" />
        </div>
      </div>
      <div className="space-y-2 px-4 pb-4">
        <div className="shimmer h-2.5 w-full rounded bg-ink-100" />
        <div className="shimmer h-2.5 w-5/6 rounded bg-ink-100" />
        <div className="shimmer mt-2 h-32 w-full rounded-2xl bg-ink-100" />
      </div>
    </div>
  )
}

export default function Accueil() {
  const { goTo, openRoiInfo, openComposer, openMember, openActivity, posts, togglePostLike, addComment, showToast } = useApp()
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
        className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-ink-950 p-4 text-left text-white shadow-float tap"
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
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] font-bold text-[#AEC6B5]">
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
      <div className="flex items-center gap-3 rounded-3xl border border-ink-100 bg-white p-3 shadow-soft">
        <Avatar name={u.name} size="md" onClick={() => goTo('profil')} />
        <button
          onClick={openComposer}
          className="flex-1 rounded-full bg-ink-100 px-4 py-2.5 text-left text-sm text-ink-400 tap"
        >
          Partage une réflexion, un REX, un tip…
        </button>
        <button onClick={openComposer} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-brand tap" aria-label="Nouveau post">
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
          <p className="pt-1 text-center text-xs text-ink-400">Tu es à jour ✓</p>
        </>
      )}
    </div>
  )
}
