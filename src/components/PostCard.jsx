import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from './Icon'
import { Avatar } from './Avatar'
import { personFor } from '../data/network'
import { CURRENT_USER } from '../data/user'
import { nombre } from '../data/activities'

/* Une carte de post : l'auteur, un paragraphe, les stats de la sortie quand
   il y en a une, et une barre d'actions réduite au kudo. Les trois anciens
   boutons pleine largeur (Utile / Répondre / Partager) ont disparu : le
   retour vient de la couleur de la pilule, pas d'une animation. */
export default function PostCard({ post, activity, onLike, onAddComment, onOpenActivity, onOpenAuthor }) {
  const { profile } = useApp()
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const subtitleFor = (name) => (name === CURRENT_USER.name ? profile.title : personFor(name).title)
  const avec = activity?.metContacts?.length || 0

  function submit() {
    const text = draft.trim()
    if (!text) return
    onAddComment(text)
    setDraft('')
    setShowComments(true)
  }

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* En-tête auteur */}
      <div className="flex items-center gap-3 px-[18px] pt-4">
        <Avatar name={post.author} size="md" onClick={onOpenAuthor} />
        <button onClick={onOpenAuthor} className="min-w-0 flex-1 text-left">
          <div className="truncate text-[15px] font-semibold text-fg">{post.author}</div>
          <div className="mt-px truncate text-[13px] text-fg-faint">{subtitleFor(post.author)} · {post.time}</div>
        </button>
      </div>

      {/* Texte : un paragraphe dense, pas de puces. */}
      <p className="mt-3 whitespace-pre-line px-[18px] text-[14.5px] leading-[1.6] text-fg-soft">{post.text}</p>

      {/* Stats de sortie, quand le post porte une activité */}
      {activity && (
        <button
          onClick={onOpenActivity}
          className="mx-[18px] mt-3.5 flex w-[calc(100%-36px)] gap-[22px] border-t border-line-soft pt-3 text-left tap"
        >
          {[
            { v: nombre(activity.distance), l: 'km' },
            { v: activity.duration.replace(/:\d\d$/, ''), l: 'temps' },
            { v: activity.pace, l: 'allure' },
            { v: avec, l: avec > 1 ? 'rencontrés' : 'rencontré' },
          ].map((s) => (
            <span key={s.l} className="min-w-0">
              <span className="block text-[19px] font-medium tabular-nums">{s.v}</span>
              <span className="block text-[12px] text-fg-faint">{s.l}</span>
            </span>
          ))}
        </button>
      )}

      {/* Barre d'actions : un kudo, et le compte des réponses. */}
      <div className="mt-3.5 flex items-center gap-2 border-t border-line-soft px-3 py-2.5">
        <button
          onClick={onLike}
          aria-pressed={post.liked}
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-semibold ${
            post.liked ? 'bg-brand-500 text-craie' : 'bg-canvas text-fg-muted'
          }`}
        >
          <Icon name="thumbsUp" className="h-[17px] w-[17px]" filled={post.liked} />
          {post.likes}
        </button>
        {post.comments.length > 0 && (
          <button onClick={() => setShowComments((s) => !s)} className="text-[13.5px] text-fg-faint">
            {post.comments.length} réponse{post.comments.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Réponses */}
      {showComments && (
        <div className="border-t border-line-soft px-[18px] py-3.5">
          <div className="space-y-3">
            {post.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Avatar name={c.author} size="xs" onClick={() => onOpenAuthor?.(c.author)} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-fg">{c.author}</div>
                  <div className="text-[13.5px] leading-snug text-fg-soft">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            <Avatar name={CURRENT_USER.name} size="xs" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Répondre…"
              className="input-ligne flex-1 bg-canvas text-[13.5px]"
              style={{ padding: '8px 14px' }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-craie tap disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Icon name="send" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
