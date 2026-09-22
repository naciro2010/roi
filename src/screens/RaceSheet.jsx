import { useState } from 'react'
import { useApp } from '../AppContext'
import Sheet, { SheetBloc } from '../components/Sheet'
import { lierDossier } from '../lib/dossier'
import {
  EDITION, daysToRace, siteUrl, DISTANCES, distanceById, formuleById,
  VAGUES, vagueCourante, PROGRAMME,
} from '../data/race'

/* ==========================================================================
   LA COURSE — ouverte depuis la ligne de l'Accueil et depuis « Ma course ».
   Le compte à rebours dans un bloc encre, les trois distances, le programme
   de l'après-midi, et l'inscription. L'inscription se fait sur le site :
   ici on y va, ou on relie un dossier déjà ouvert.
   ========================================================================== */
export default function RaceSheet({ onClose }) {
  const { dossier, lierDossierApp, delierDossier, showToast } = useApp()
  const [relier, setRelier] = useState(false)
  const jours = daysToRace()
  const vague = vagueCourante()
  const [early, regulier, last] = VAGUES

  return (
    <Sheet title="La course" onClose={onClose}>
      {/* ---- Le compte à rebours ---- */}
      <SheetBloc>
        <div className="flex items-end gap-2.5">
          <span className="text-[52px] font-medium leading-[.9] tracking-[-.02em] tabular-nums">{jours}</span>
          <span className="pb-2 text-[14px] text-craie/70">jours avant la course</span>
        </div>
        <p className="mt-3.5 text-[14.5px] leading-[1.55] text-craie/80">
          {EDITION.label} · {EDITION.lieu} · {EDITION.mois.toLowerCase()}. 5, 10 ou 21,1 km le matin, puis tout un
          après-midi dans l’Arena. {EDITION.jauge}.
        </p>
      </SheetBloc>

      {/* ---- Les trois distances ---- */}
      <div className="mt-[18px] flex flex-col gap-2.5">
        {DISTANCES.map((d) => (
          <div key={d.id} className="flex items-center gap-3.5 rounded-lg border border-line bg-surface px-[18px] py-4">
            <span className="w-[72px] shrink-0 text-[19px] font-medium tabular-nums">{d.label}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{d.nom}</span>
              <span className="mt-px block text-[13.5px] leading-[1.4] text-fg-muted">
                {d.pourquoi}{d.central ? ' Le format central.' : ''}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* ---- L'après-midi ---- */}
      <h3 className="titre-section mb-2.5 mt-6">L’après-midi</h3>
      <div className="flex flex-col gap-3.5">
        {PROGRAMME.map((p) => (
          <div key={p.t} className="flex gap-3.5">
            <span className="w-16 shrink-0 pt-0.5 text-[13px] font-semibold text-brand-500">{p.h}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{p.quoi}</span>
              <span className="mt-0.5 block text-[13.5px] leading-[1.5] text-fg-muted">{p.texte}</span>
            </span>
          </div>
        ))}
      </div>

      {/* ---- Ton inscription ---- */}
      <h3 className="titre-section mb-2.5 mt-6">Ton inscription</h3>
      {dossier ? (
        <>
          <p className="text-[14.5px] leading-[1.6] text-fg-soft">
            Ta place est gardée : {distanceById(dossier.distance).label}, formule {formuleById(dossier.formule).nom},
            dossier {dossier.reference}. Le site garde la vérité du dossier.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={siteUrl('espace/')}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-brand-500 px-[22px] py-3 text-[14px] font-semibold text-craie tap"
            >
              Ouvrir mon espace
            </a>
            <button
              onClick={delierDossier}
              className="rounded-full border border-line-strong px-[22px] py-3 text-[14px] font-semibold text-fg tap"
            >
              Délier mon dossier
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-[14.5px] leading-[1.6] text-fg-soft">
            L’inscription se fait sur runoninvest.fr, en cinq minutes : un compte, une distance, une formule.
            L’app lit ensuite ton dossier et ton dossard s’affiche ici.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={siteUrl('inscription/', { distance: '10' })}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-brand-500 px-[22px] py-3 text-[14px] font-semibold text-craie tap"
            >
              Prendre un dossard
            </a>
            <button
              onClick={() => setRelier((v) => !v)}
              className="rounded-full border border-line-strong px-[22px] py-3 text-[14px] font-semibold text-fg tap"
            >
              Relier mon dossier
            </button>
          </div>

          {relier && (
            <FormulaireDossier
              onLier={async (champs) => {
                const r = await lierDossier(champs)
                if (r.dossier) {
                  lierDossierApp(r.dossier)
                  showToast(`C’est bon : ton inscription ${r.dossier.reference} est reliée`)
                  setRelier(false)
                }
                return r
              }}
            />
          )}
        </>
      )}

      <p className="mt-3.5 text-[13px] leading-snug text-fg-faint">
        Vague {early.nom} · {early.prix} € {early.periode.toLowerCase()}, puis {regulier.nom} {regulier.prix} €,
        {' '}{last.nom} {last.prix} €.{vague.code !== 'early' && ` Vague en cours : ${vague.nom}.`}
      </p>
    </Sheet>
  )
}

/* Deux champs : la référence du dossier, l'e-mail du compte. Depuis l'espace
   du site, « Ouvrir mon dossard dans l'app » les remplit tout seul. */
function FormulaireDossier({ onLier }) {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setErreur('')
    const r = await onLier({ reference, email })
    setBusy(false)
    if (r.erreur) setErreur(r.erreur)
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-line bg-surface p-[18px]" noValidate>
      <div className="champ">
        <label htmlFor="ref">Référence du dossier</label>
        <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="E01-000123" autoComplete="off" spellCheck={false} />
      </div>
      <div className="champ mt-3">
        <label htmlFor="mail">E-mail du compte</label>
        <input id="mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@entreprise.fr" autoComplete="email" inputMode="email" />
      </div>
      <p className="mt-2.5 text-[13px] leading-snug text-fg-muted">
        La référence est en haut de ton espace sur le site.
      </p>
      {erreur && <p className="form-msg mt-3" role="alert">{erreur}</p>}
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="mt-4 w-full rounded-full bg-encre px-5 py-3 text-[14px] font-semibold text-craie tap disabled:opacity-60"
      >
        {busy ? 'Lecture du dossier…' : 'Relier mon dossier'}
      </button>
    </form>
  )
}
