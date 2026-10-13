import { useState } from 'react'
import { useApp } from '../AppContext'

export const MOTIFS = ['Harcèlement ou propos déplacés', 'Spam ou démarchage', 'Faux profil', 'Contenu choquant ou illégal', 'Autre']

/* Signaler un membre ou un contenu : un lien discret qui déplie les motifs.
   Exigé par les stores dès qu'il y a du contenu entre utilisateurs. */
export default function Signaler({ name, label = 'Signaler', className = '' }) {
  const { signaler } = useApp()
  const [ouvert, setOuvert] = useState(false)
  const [fait, setFait] = useState(false)

  if (fait) return <span className={`text-[13px] text-fg-faint ${className}`}>Signalement envoyé</span>
  if (!ouvert) {
    return (
      <button onClick={() => setOuvert(true)} className={`text-[13px] text-fg-faint underline tap ${className}`}>
        {label}
      </button>
    )
  }
  return (
    <div role="group" aria-label="Motif du signalement" className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[13px] font-semibold">Pourquoi ?</span>
      {MOTIFS.map((m) => (
        <button
          key={m}
          onClick={() => { signaler(name, m); setFait(true) }}
          className="rounded-full border border-line bg-surface px-3.5 py-2 text-left text-[13.5px] tap"
        >
          {m}
        </button>
      ))}
      <button onClick={() => setOuvert(false)} className="text-left text-[13px] text-fg-faint underline tap">Annuler</button>
    </div>
  )
}
