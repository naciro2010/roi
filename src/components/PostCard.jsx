import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from './Icon'
import { Avatar } from './Avatar'
import { Badge } from './primitives'
import { ActivityPreview } from './ActivityCard'
import { POST_TYPES } from '../data/feed'
import { personFor } from '../data/network'
import { CURRENT_USER } from '../data/user'

export default function PostCard({ post, activity, onLike, onAddComment, onShare, onOpenActivity, onOpenAuthor }) {
  const { profile } = useApp()
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const meta = POST_TYPES[post.type]
  const subtitleFor = (name) => (name === CURRENT_USER.name ? profile.title : personFor(name).title)

  function submit() {
    const text = draft.trim()
    if (!text) return
    onAddComment(text)
    setDraft('')
    setShowComments(true)
  }

  return (
    <article className="border border-line">
      {/* En-tête auteur */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Avatar name={post.author} size="md" onClick={onOpenAuthor} />
        <button onClick={onOpenAuthor} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium text-fg">{post.author}</div>
          <div className="truncate text-[12px] text-fg-faint">{subtitleFor(post.author)} · {post.time}</div>
        </button>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      {/* Texte */}
      <p className="whitespace-pre-line px-4 text-[14px] leading-relaxed text-fg">{post.text}</p>

      {/* Sortie liée */}
      {activity && (
        <div className="px-4 pt-3">
          <ActivityPreview activity={activity} onOpen={onOpenActivity} mapClass="h-36" />
        </div>
      )}

      {/* Compteurs */}
      <div className="flex items-center justify-between px-4 pt-3 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-brand-500" />
          {post.likes} utile{post.likes > 1 ? 's' : ''}
        </span>
        {post.comments.length > 0 && (
          <button onClick={() => setShowComments((s) => !s)} className="tap">
            {post.comments.length} réponse{post.comments.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center divide-x divide-line border-t border-line">
        <button
          onClick={onLike}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono tap ${post.liked ? 'text-brand-500' : 'text-fg-muted'}`}
        >
          <Icon name="heart" className="h-4 w-4" filled={post.liked} /> Utile
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-muted tap"
        >
          <Icon name="comment" className="h-4 w-4" /> Répondre
        </button>
        <button
          onClick={onShare}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-muted tap"
        >
          <Icon name="share" className="h-4 w-4" /> Partager
        </button>
      </div>

      {/* Réponses */}
      {showComments && (
        <div className="border-t border-line bg-surface-2/60 px-4 py-3">
          <div className="space-y-2.5">
            {post.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Avatar name={c.author} size="xs" onClick={() => onOpenAuthor?.(c.author)} />
                <div className="min-w-0 flex-1 border-l-2 border-line pl-3">
                  <div className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg">{c.author}</div>
                  <div className="text-[13px] leading-snug text-fg-soft">{c.text}</div>
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
              placeholder="Répondre…"
              className="input-ligne flex-1 text-[13px]"
              style={{ padding: '6px 0' }}
            />
            <button onClick={submit} disabled={!draft.trim()} className="ico impact tap disabled:opacity-40" aria-label="Envoyer">
              <Icon name="send" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
