import { useState } from 'react'
import { useApp } from '../AppContext'
import Sheet from '../components/Sheet'

/* Supprimer mon compte — initiée dans l'app (exigence Apple 5.1.1(v)). On
   demande une confirmation écrite, puis le site efface le dossier et l'appareil
   est vidé. */
export default function DeleteAccountSheet({ onClose }) {
  const { effacerCompte } = useApp()
  const [mot, setMot] = useState('')
  const [etat, setEtat] = useState({ cours: false, erreur: '' })
  const ok = mot.trim().toUpperCase() === 'SUPPRIMER'

  async function confirmer() {
    setEtat({ cours: true, erreur: '' })
    const r = await effacerCompte()
    if (!r.ok) setEtat({ cours: false, erreur: r.erreur })
  }

  return (
    <Sheet title="Supprimer mon compte" onClose={onClose}>
      <p className="text-[14.5px] leading-[1.65] text-fg-soft">
        Ton profil, tes conversations, tes rencontres et ton suivi sont effacés de cet appareil, et ton
        dossier est supprimé de runoninvest.fr sous 30 jours. C’est définitif.
      </p>
      <p className="mt-3 text-[14.5px] leading-[1.65] text-fg-soft">
        Ton abonnement n’est pas résilié par cette action : il se gère dans les réglages de ton compte
        App Store ou Google Play. Ton dossard pour la course est conservé tant que tu ne demandes pas
        son annulation à l’équipe.
      </p>
      <label className="mt-5 block text-[13.5px] font-semibold" htmlFor="confirm">
        Écris SUPPRIMER pour confirmer
      </label>
      <input
        id="confirm"
        value={mot}
        onChange={(e) => setMot(e.target.value)}
        autoCapitalize="characters"
        autoComplete="off"
        className="champ mt-2 w-full"
      />
      {etat.erreur && <p role="alert" className="mt-3 text-[13.5px] text-brand-500">{etat.erreur}</p>}
      <button
        onClick={confirmer}
        disabled={!ok || etat.cours}
        className="mt-5 w-full rounded-full bg-brand-500 px-5 py-3 text-[14px] font-semibold text-craie tap disabled:opacity-40"
      >
        {etat.cours ? 'Suppression…' : 'Supprimer définitivement mon compte'}
      </button>
    </Sheet>
  )
}
