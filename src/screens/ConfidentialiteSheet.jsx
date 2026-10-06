import { useState } from 'react'
import { useApp } from '../AppContext'
import Sheet from '../components/Sheet'
import { APP_URL, CONTACTS } from '../data/race'
import { ouvrirLien } from '../lib/natif'

/* ==========================================================================
   CONFIDENTIALITÉ — ce que l'app garde, où, et comment tout effacer.
   Les stores exigent deux choses ici : une politique lisible depuis l'app,
   et la suppression du compte faisable depuis l'app. On fait les deux, en
   phrases courtes.
   ========================================================================== */
const POINTS = [
  {
    titre: 'Ce qui reste sur ton téléphone',
    detail: 'Ton profil, tes messages, tes rendez-vous et tes réglages sont enregistrés sur cet appareil. Ils ne partent nulle part ailleurs.',
  },
  {
    titre: 'Ce qui passe par le site',
    detail: 'Quand tu relies ton inscription, l’app envoie ta référence de dossier et ton e-mail à runoninvest.fr pour lire ton dossard. Le site ne renvoie ni ton e-mail ni tes justificatifs.',
  },
  {
    titre: 'Ce qu’on ne fait pas',
    detail: 'Aucune publicité, aucun pisteur, aucun service de mesure d’audience. On ne vend ni ne prête tes données.',
  },
  {
    titre: 'Ce que les autres voient',
    detail: 'Ton nom, ta fonction, ce que tu cherches et ce que tu apportes. Jamais ton e-mail ni ton téléphone : une conversation ne s’ouvre que si vous avez dit oui tous les deux.',
  },
]

export default function ConfidentialiteSheet({ onClose }) {
  const { effacerMesDonnees, dossier } = useApp()
  const [confirmer, setConfirmer] = useState(false)
  const sujet = encodeURIComponent('Suppression de mon compte R.O.I')
  const corps = encodeURIComponent(
    `Bonjour,\n\nJe demande la suppression de mon compte R.O.I et des données associées.\n\nRéférence de dossier : ${dossier?.reference || '—'}\nE-mail du compte : ${dossier?.email || '—'}\n`,
  )

  return (
    <Sheet title="Confidentialité" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {POINTS.map((p) => (
          <div key={p.titre} className="carte p-[18px]">
            <h3 className="text-[15.5px] font-semibold">{p.titre}</h3>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-fg-soft">{p.detail}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => ouvrirLien(`${APP_URL}/confidentialite.html`)}
        className="mt-4 block text-[14px] font-semibold text-brand-500 tap"
      >
        Lire la politique de confidentialité complète
      </button>

      <section className="mt-7">
        <h3 className="titre-section">Supprimer mon compte</h3>
        <p className="aide">
          Deux gestes, selon ce que tu veux effacer. Le premier est immédiat ; le second est traité par l’équipe sous trente jours.
        </p>

        <div className="mt-3 flex flex-col gap-2.5">
          {!confirmer ? (
            <button
              onClick={() => setConfirmer(true)}
              className="rounded-full border border-line-strong px-5 py-3 text-[14px] font-semibold text-fg tap"
            >
              Effacer mes données de cet appareil
            </button>
          ) : (
            <div className="carte p-[18px]">
              <p className="text-[14px] leading-[1.55] text-fg-soft">
                Ton profil, tes messages, tes rendez-vous et le lien vers ton inscription seront effacés de ce
                téléphone. Ton dossard, lui, reste sur runoninvest.fr.
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <button onClick={effacerMesDonnees} className="rounded-full bg-encre px-5 py-[11px] text-[14px] font-semibold text-craie tap">
                  Oui, tout effacer
                </button>
                <button onClick={() => setConfirmer(false)} className="rounded-full border border-line-strong px-5 py-[11px] text-[14px] font-semibold tap">
                  Annuler
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => ouvrirLien(`mailto:${CONTACTS.contact}?subject=${sujet}&body=${corps}`)}
            className="rounded-full border border-line-strong px-5 py-3 text-[14px] font-semibold text-fg tap"
          >
            Supprimer mon compte R.O.I
          </button>
          <p className="text-[13px] leading-snug text-fg-faint">
            Ouvre un e-mail prêt à envoyer à {CONTACTS.contact}. Ton compte, ton dossier et tes justificatifs sont
            supprimés sous trente jours, et on te le confirme par écrit. Tu peux aussi passer par{' '}
            {APP_URL.replace('https://', '')}/suppression-compte.html.
          </p>
        </div>
      </section>
    </Sheet>
  )
}
