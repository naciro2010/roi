import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'

function ChipListEditor({ label, hint, values, onChange, placeholder }) {
  return (
    <div>
      <div className="mb-2 tmark sans">{label}</div>
      {hint && <p className="-mt-1 mb-2 text-[12px] leading-snug text-fg-faint">{hint}</p>}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={v}
              onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={placeholder}
              className="input-ligne flex-1 text-sm"
            />
            <button
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center bg-surface-soft text-fg-faint tap"
              aria-label="Supprimer"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...values, ''])} className="flex items-center gap-1 text-sm font-semibold text-brand-500 tap">
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
    showToast('Dossard mis à jour')
    onClose()
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-surface">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3.5">
          <button onClick={onClose} className="text-sm font-semibold text-fg-muted tap">Annuler</button>
          <h2 className="text-base font-semibold text-fg">Le verso de ton dossard</h2>
          <button onClick={save} className="btn btn-impact px-4 py-1.5 text-sm font-semibold text-craie tap">
            Enregistrer mon dossard
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar px-5 py-4">
          <div>
            <div className="mb-2 tmark sans">Fonction · entreprise</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Fondateur · SaaS B2B"
              className="input-ligne text-sm"
            />
          </div>

          <div>
            <div className="mb-2 tmark sans">En deux lignes</div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Ce que tu construis, et pourquoi tu cours…"
              className="input-ligne w-full resize-none text-sm leading-relaxed"
            />
          </div>

          <ChipListEditor
            label="Ce que je cherche"
            hint="Recruter, lever, vendre, s'associer — une phrase chacun."
            values={needs}
            onChange={setNeeds}
            placeholder="Ex. Lève une seed, cherche un associé produit"
          />
          <ChipListEditor label="Ce que j'apporte" values={offering} onChange={setOffering} placeholder="Ex. Des retours produit, des présentations SaaS B2B" />
          <ChipListEditor label="Sujets" values={interests} onChange={setInterests} placeholder="Ex. Levée de fonds, product, trail" />
        </div>
      </div>
    </div>
  )
}
