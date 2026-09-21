import { useState } from 'react'
import { EDITION, distanceById, dossardActif } from '../data/race'

/* LE DOSSARD — « Un seul dossard : il te fait franchir la ligne, puis il
   devient ton profil. » Recto la course (numéro, chrono), verso le réseau
   (nom, fonction, entreprise). Le même papier des deux côtés : c'est
   justement l'argument. Retournable au clic et au clavier. */
export default function Dossard({ dossier, nom, fonction, entreprise, verso = true, flippable = true, className = '' }) {
  const [flipped, setFlipped] = useState(verso)
  const numero = dossier?.reference ? dossier.reference.slice(-3) : '···'
  const dist = dossier ? distanceById(dossier.distance) : null
  const nomComplet = nom || (dossier ? `${dossier.prenom || ''} ${dossier.nom || ''}`.trim() : 'Ton nom')
  const Tag = flippable ? 'button' : 'div'
  return (
    <Tag
      type={flippable ? 'button' : undefined}
      onClick={flippable ? () => setFlipped((f) => !f) : undefined}
      aria-pressed={flippable ? flipped : undefined}
      aria-label={flippable ? 'Ton dossard — retourner' : 'Ton dossard'}
      className={`dossard ${className}`}
    >
      <span className="d-inner">
        <span className="d-face d-recto">
          <span className="d-head">
            <span className="d-logo">R<i />O<i />I</span>
            <span className="d-ed">{EDITION.label}</span>
          </span>
          <span className="d-num">{numero}</span>
          <span className="d-foot">
            <span>{dist ? `${dist.km} km` : EDITION.lieu}</span>
            <span>{EDITION.moisCourt}</span>
          </span>
        </span>
        <span className="d-face d-verso">
          <span className="d-head">
            <span className="d-logo">R<i />O<i />I</span>
            <span className="d-ed">Profil</span>
          </span>
          <span className="d-champs">
            <span className="d-champ"><b>Nom</b><span>{nomComplet}</span></span>
            <span className="d-champ"><b>Fonction</b><span>{fonction || dossier?.fonction || 'Ta fonction'}</span></span>
            <span className="d-champ"><b>Entreprise</b><span>{entreprise || dossier?.entreprise || 'Ton entreprise'}</span></span>
          </span>
          <span className="d-actif">{dossardActif(dossier?.formule)}</span>
        </span>
      </span>
    </Tag>
  )
}
