import Sheet from '../components/Sheet'
import { LEGAL, ENTITE } from '../data/legal'

/* Confidentialité et conditions d'utilisation : le même texte que les pages
   web publiées (voir scripts/build-legal.mjs). */
export default function LegalSheet({ quoi, onClose }) {
  const doc = LEGAL[quoi]
  if (!doc) return null
  return (
    <Sheet title={doc.titre} onClose={onClose}>
      <p className="text-[14.5px] leading-[1.65] text-fg-soft">{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.t} className="mt-5">
          <h3 className="titre-section mb-2">{s.t}</h3>
          {s.p.map((x) => (
            <p key={x} className="mb-2 text-[14.5px] leading-[1.65] text-fg-soft">{x}</p>
          ))}
        </section>
      ))}
      <p className="mt-6 text-[13px] text-fg-faint">Mis à jour le {ENTITE.maj}.</p>
    </Sheet>
  )
}
