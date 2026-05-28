import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from './Icon'
import { Avatar } from './Avatar'
import { PILL_TONES } from './primitives'
import { POST_TYPES } from '../data/feed'
import { CURRENT_USER } from '../data/user'

const ORDER = ['reflexion', 'rex', 'tip', 'milestone']

export default function PostComposer({ open, onClose, onPublish }) {
  const { profile } = useApp()
  const [type, setType] = useState('reflexion')
  const [text, setText] = useState('')
  if (!open) return null

  function publish() {
    const body = text.trim()
    if (!body) return
    onPublish({ type, text: body })
    setText('')
    setType('reflexion')
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-float">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3.5">
          <button onClick={onClose} className="text-sm font-semibold text-fg-muted tap">Annuler</button>
          <h2 className="text-base font-bold text-fg">Nouveau post</h2>
          <button
            onClick={publish}
            disabled={!text.trim()}
            className="rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-1.5 text-sm font-bold text-white shadow-brand tap disabled:opacity-40"
          >
            Publier
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={CURRENT_USER.name} size="md" />
            <div>
              <div className="font-bold text-fg">{CURRENT_USER.name}</div>
              <div className="text-[12px] text-fg-faint">{profile.title}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {ORDER.map((t) => {
              const meta = POST_TYPES[t]
              const active = type === t
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold tap ${
                    active ? PILL_TONES[meta.tone] + ' ring-1 ring-brand-500/40' : 'bg-surface-2 text-fg-muted'
                  }`}
                >
                  <Icon name={meta.icon} className="h-3.5 w-3.5" filled={meta.icon === 'sparkles'} />
                  {meta.label}
                </button>
              )
            })}
          </div>

          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Partage une réflexion, un REX de rencontre, un tip…"
            className="mt-4 w-full resize-none rounded-2xl border border-line-strong bg-surface-soft px-4 py-3 text-[14px] leading-relaxed text-fg outline-none focus:ring-2 focus:ring-brand-200 placeholder:text-fg-faint"
          />
        </div>
      </div>
    </div>
  )
}
