import { useState } from 'react'
import Icon from './Icon'
import { Avatar } from './Avatar'
import { PILL_TONES } from './primitives'
import { POST_TYPES } from '../data/feed'
import { CURRENT_USER } from '../data/user'

const ORDER = ['reflexion', 'rex', 'tip', 'milestone']

export default function PostComposer({ open, onClose, onPublish }) {
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
      <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
        <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <button onClick={onClose} className="text-sm font-semibold text-ink-500 tap">Annuler</button>
          <h2 className="text-base font-bold text-ink-900">Nouveau post</h2>
          <button
            onClick={publish}
            disabled={!text.trim()}
            className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-bold text-white shadow-brand tap disabled:opacity-40"
          >
            Publier
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={CURRENT_USER.name} size="md" />
            <div>
              <div className="font-bold text-ink-900">{CURRENT_USER.name}</div>
              <div className="text-[12px] text-ink-400">{CURRENT_USER.title}</div>
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
                    active ? PILL_TONES[meta.tone] + ' ring-2 ring-offset-1 ring-brand-200' : 'bg-ink-100 text-ink-500'
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
            className="mt-4 w-full resize-none rounded-2xl border border-ink-200 bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-900 outline-none focus:ring-2 focus:ring-brand-200 placeholder:text-ink-400"
          />
        </div>
      </div>
    </div>
  )
}
