import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'

function ChipListEditor({ label, values, onChange, placeholder }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">{label}</div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={v}
              onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-soft text-fg-faint tap"
              aria-label="Supprimer"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...values, ''])} className="flex items-center gap-1 text-sm font-semibold text-brand-700 tap">
          <Icon name="plus" className="h-4 w-4" /> Ajouter
        </button>
      </div>
    </div>
  )
}

export default function EditProfileSheet({ onClose }) {
  const { profile, updateProfile, showToast } = useApp()
  const [title, setTitle] = useState(profile.title)
  const [bio, setBio] = useState(profile.bio)
  const [offering, setOffering] = useState(profile.offering)
  const [needs, setNeeds] = useState(profile.needs)
  const [interests, setInterests] = useState(profile.interests)

  function clean(arr, fallback) {
    const c = arr.map((x) => x.trim()).filter(Boolean)
    return c.length ? c : fallback
  }

  function save() {
    updateProfile({
      title: title.trim() || profile.title,
      bio: bio.trim(),
      offering: clean(offering, []),
      needs: clean(needs, ['—']),
      interests: clean(interests, []),
    })
    showToast('Profil mis à jour ✓')
    onClose()
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-float">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3.5">
          <button onClick={onClose} className="text-sm font-semibold text-fg-muted tap">Annuler</button>
          <h2 className="text-base font-semibold text-fg">Éditer le profil</h2>
          <button onClick={save} className="rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-brand tap">
            Enregistrer
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar px-5 py-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">Titre</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Fondateur · SaaS B2B"
              className="w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">Bio</div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Présente-toi en quelques lignes…"
              className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <ChipListEditor label="Ce que je cherche" values={needs} onChange={setNeeds} placeholder="Ton besoin…" />
          <ChipListEditor label="Ce que je propose" values={offering} onChange={setOffering} placeholder="Ce que tu apportes…" />
          <ChipListEditor label="Centres d’intérêt" values={interests} onChange={setInterests} placeholder="Un centre d’intérêt…" />
        </div>
      </div>
    </div>
  )
}
