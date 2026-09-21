import { useState } from 'react'
import { useApp } from '../AppContext'
import { Avatar } from './Avatar'
import { POST_TYPES } from '../data/feed'
import { CURRENT_USER } from '../data/user'

/* Les types de post viennent des données (libellés du fil) ; « activity » se
   crée depuis une sortie, pas depuis le composeur. */
const ORDER = Object.keys(POST_TYPES).filter((t) => t !== 'activity')
const DEFAULT_TYPE = ORDER[0]

export default function PostComposer({ open, onClose, onPublish }) {
  const { profile } = useApp()
  const [type, setType] = useState(DEFAULT_TYPE)
  const [text, setText] = useState('')
  if (!open) return null

  function publish() {
    const body = text.trim()
    if (!body) return
    onPublish({ type, text: body })
    setText('')
    setType(DEFAULT_TYPE)
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden bg-canvas">
        <div className="flex shrink-0 items-center justify-between border-b border-fg px-5 py-3.5">
          <button onClick={onClose} className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg-muted tap">Annuler</button>
          <h2 className="titre-section">Écrire dans le fil</h2>
          <button onClick={publish} disabled={!text.trim()} className="btn btn-impact btn-sm">
            <span>Publier</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={CURRENT_USER.name} size="md" />
            <div>
              <div className="text-sm font-medium text-fg">{CURRENT_USER.name}</div>
              <div className="text-[12px] text-fg-faint">{profile.title}</div>
            </div>
          </div>

          {/* Ce que le réseau raconte : une rencontre, un conseil, une réflexion, une étape. */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ORDER.map((t) => {
              const meta = POST_TYPES[t]
              return (
                <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={`tag tap ${type === t ? 'on' : ''}`}>
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
            placeholder="Une rencontre, une présentation faite, une sortie, un conseil…"
            className="input-ligne mt-4 w-full resize-none text-[14px] leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
