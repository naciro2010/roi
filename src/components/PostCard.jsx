import { useState } from 'react'
import Icon from './Icon'
import { Avatar } from './Avatar'
import { PILL_TONES } from './primitives'
import { ActivityPreview } from './ActivityCard'
import { POST_TYPES } from '../data/feed'
import { personFor } from '../data/network'
import { CURRENT_USER } from '../data/user'

function subtitleFor(name) {
  return name === CURRENT_USER.name ? CURRENT_USER.title : personFor(name).title
}

export default function PostCard({ post, activity, onLike, onAddComment, onShare, onOpenActivity, onOpenAuthor }) {
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const meta = POST_TYPES[post.type]

  function submit() {
    const text = draft.trim()
    if (!text) return
    onAddComment(text)
    setDraft('')
    setShowComments(true)
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      {/* En-tête auteur */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Avatar name={post.author} size="md" onClick={onOpenAuthor} />
        <button onClick={onOpenAuthor} className="min-w-0 flex-1 text-left">
          <div className="truncate font-bold text-ink-900">{post.author}</div>
          <div className="truncate text-[12px] text-ink-400">{subtitleFor(post.author)} · {post.time}</div>
        </button>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${PILL_TONES[meta.tone]}`}>
          <Icon name={meta.icon} className="h-3 w-3" filled={meta.icon === 'sparkles'} />
          {meta.label}
        </span>
      </div>

      {/* Texte */}
      <p className="whitespace-pre-line px-4 text-[14px] leading-relaxed text-ink-800">{post.text}</p>

      {/* Activité liée */}
      {activity && (
        <div className="px-4 pt-3">
          <ActivityPreview activity={activity} onOpen={onOpenActivity} mapClass="h-36" />
        </div>
      )}

      {/* Compteurs */}
      <div className="flex items-center justify-between px-4 pt-3 text-[12px] text-ink-400">
        <span className="inline-flex items-center gap-1">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-white">
            <Icon name="heart" className="h-2.5 w-2.5" filled />
          </span>
          {post.likes}
        </span>
        {post.comments.length > 0 && (
          <button onClick={() => setShowComments((s) => !s)} className="tap">
            {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-1 flex items-center justify-around border-t border-ink-100 px-2 py-1">
        <button
          onClick={onLike}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold tap ${
            post.liked ? 'text-[#9A5560]' : 'text-ink-500'
          }`}
        >
          <Icon name="heart" className="h-[18px] w-[18px]" filled={post.liked} /> J'aime
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-ink-500 tap"
        >
          <Icon name="comment" className="h-[18px] w-[18px]" /> Commenter
        </button>
        <button
          onClick={onShare}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-ink-500 tap"
        >
          <Icon name="share" className="h-[18px] w-[18px]" /> Partager
        </button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="border-t border-ink-100 bg-ink-50/60 px-4 py-3">
          <div className="space-y-2.5">
            {post.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Avatar name={c.author} size="xs" onClick={() => onOpenAuthor?.(c.author)} />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-white px-3 py-2 shadow-soft">
                  <div className="text-[12px] font-bold text-ink-900">{c.author}</div>
                  <div className="text-[13px] leading-snug text-ink-700">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Avatar name={CURRENT_USER.name} size="xs" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Ajoute un commentaire…"
              className="flex-1 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button onClick={submit} disabled={!draft.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white tap disabled:opacity-40">
              <Icon name="send" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
