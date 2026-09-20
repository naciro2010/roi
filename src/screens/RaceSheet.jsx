import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { AvatarStack } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import Dossard from '../components/Dossard'
import { useSheetDrag } from '../lib/useSheetDrag'
import { lierDossier } from '../lib/dossier'
import {
  EDITION, daysToRace, siteUrl,
  DISTANCES, distanceById, VAGUES, vagueCourante, FORMULES, formuleById,
  ETAPES, ETAT_INDEX, AVANT, APRES, PROGRAMME, PRINCIPES, QUI_COURT, INSCRITS,
} from '../data/race'

const fmt = (n) => n.toLocaleString('fr-FR')

/* ==========================================================================
   L'ÉDITION — la course annuelle, vue depuis l'app.
   Une fiche de course, pas une plaquette : la ligne (T– / T+), les trois
   distances, les formules, les vagues, et — en tête — ton dossier, lu sur
   le site. L'inscription se fait sur runoninvest.fr : ici on y va, ou on
   relie un dossier déjà ouvert.
   ========================================================================== */
export default function RaceSheet({ onClose, onglet = 'edition' }) {
  const { dossier, lierDossierApp, delierDossier, goTo, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const [distance, setDistance] = useState(dossier?.distance || '10')
  const [formule, setFormule] = useState(dossier?.formule || 'dossard')
  const dist = distanceById(distance)
  const jours = daysToRace()
  const vague = vagueCourante()

  const urlInscription = siteUrl('inscription/', { distance, formule })

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-canvas" style={drag.style}>
        {/* En-tête encre : l'étiquette, le titre affiche, le compte à rebours */}
        <div className="surface-hero relative shrink-0 px-5 pb-5 pt-3">
          <div {...drag.handleProps} className="mx-auto mb-4 h-1 w-10 bg-craie/30" aria-hidden="true" />
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-craie/30 text-craie tap" aria-label="Fermer">
            <Icon name="x" className="h-4 w-4" />
          </button>
          <span className="tmark"><b>{EDITION.label}</b> — {EDITION.lieu}</span>
          <h1 className="display mt-3 text-[24px] text-craie">L’impact après<br /><span className="creuse">la ligne d’arrivée.</span></h1>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-craie/20 pt-3">
            <div className="shrink-0">
              <div className="display whitespace-nowrap text-[44px] leading-[.85] text-craie">T–<span className="tabular-nums">{jours}</span></div>
              <div className="mt-2 font-mono text-[9.5px] uppercase tracking-label text-craie/60">Jours avant la ligne</div>
            </div>
            <div className="min-w-0 text-right font-mono text-[9.5px] uppercase leading-[1.9] tracking-mono text-craie/60">
              {EDITION.mois} · 5 / 10 / 21,1 km<br />{EDITION.jauge}<br /><b className="text-brand-500">■ Vague {vague.nom} ouverte</b>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* ---------------------------------------------------- TON DOSSIER */}
          <section className="px-5 pb-6 pt-5">
            {dossier ? (
              <DossierLie dossier={dossier} onDelier={delierDossier} onEspace={() => window.open(siteUrl('espace/'), '_blank', 'noopener')} />
            ) : (
              <PrendreOuLier
                distance={distance} formule={formule} urlInscription={urlInscription}
                onLier={async (champs) => {
                  const r = await lierDossier(champs)
                  if (r.dossier) { lierDossierApp(r.dossier); showToast(`Dossier ${r.dossier.reference} relié`) }
                  return r
                }}
              />
            )}
          </section>

          {/* ---------------------------------------------------- LA JOURNÉE */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T–</b> / T+ — LA JOURNÉE</span>
            <h2 className="titre mt-3 text-[22px]">La course le matin,<br />le réseau l’après-midi.</h2>
            <div className="cadre mt-4 grid-cols-2">
              {[{ t: 'T–', ...AVANT }, { t: 'T+', ...APRES }].map((b) => (
                <div key={b.t} className="p-3.5">
                  <div className="display text-[34px] leading-none text-brand-500">{b.t}</div>
                  <h3 className="titre mt-2 text-[15px]">{b.titre}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-fg-muted">{b.lead}</p>
                  <ul className="mt-2.5 space-y-1.5">
                    {b.points.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex gap-2 text-[12px] leading-snug text-fg-soft">
                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-brand-500" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------- LES DISTANCES */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T–01</b> / LES DOSSARDS</span>
            <h2 className="titre mt-3 text-[22px]">Trois distances,<br />un seul dossard.</h2>
            <p className="mt-2 text-[13.5px] text-fg-muted">Même prix, même accès, même après-midi. Choisis la tienne : elle sera pré-remplie sur le site.</p>
            <div className="cadre mt-4 grid-cols-3" role="radiogroup" aria-label="Distance">
              {DISTANCES.map((d) => {
                const on = d.id === distance
                return (
                  <button
                    key={d.id} role="radio" aria-checked={on} onClick={() => setDistance(d.id)}
                    className={`flex flex-col p-3 text-left tap ${on ? 'bg-encre text-craie' : 'text-fg'}`}
                  >
                    <span className="display text-[30px] leading-none">{d.km}<small className={`ml-1 align-top font-mono text-[9px] font-bold tracking-mono ${on ? 'text-brand-500' : 'text-brand-600'}`}>KM</small></span>
                    <span className="mt-2 font-mono text-[9.5px] font-bold uppercase tracking-mono">{d.nom}</span>
                    <span className={`mt-1 text-[11px] leading-snug ${on ? 'text-craie/65' : 'text-fg-muted'}`}>{d.pourquoi}</span>
                    {d.populaire && <span className={`mt-2 font-mono text-[8.5px] font-bold uppercase tracking-mono ${on ? 'text-brand-500' : 'text-brand-600'}`}>■ La plus choisie</span>}
                  </button>
                )
              })}
            </div>
            <div className="relative mt-3 h-44 border border-line bg-surface-2">
              <RouteMap route={dist.route} className="h-full w-full" />
              <div className="pointer-events-none absolute left-2 top-2 z-[500] bg-encre px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-craie">
                {dist.boucle}
              </div>
              <div className="pointer-events-none absolute bottom-2 right-2 z-[500] bg-craie px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg">
                {dist.deniv} · {dist.duree}
              </div>
            </div>
            <p className="mt-2 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Départ {EDITION.depart} · arrivée dans {EDITION.arrivee}</p>
          </section>

          {/* ---------------------------------------------------- LE PROGRAMME T+ */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T+</b> / APRÈS LA LIGNE</span>
            <h2 className="titre mt-3 text-[22px]">Le programme de l’après-midi.</h2>
            <p className="mt-2 text-[13.5px] text-fg-muted">On court d’abord, on parle pendant, on prolonge après. Pas de stand, pas de slide, pas de pitch imposé.</p>
            <div className="mt-4 border-t border-fg">
              {PROGRAMME.map((r) => (
                <div key={r.t} className="grid grid-cols-[64px_1fr] gap-3 border-b border-line py-3">
                  <div className="font-mono text-[11px] font-bold tracking-mono text-brand-600">
                    {r.t}<small className="mt-0.5 block text-[9px] font-medium tracking-mono text-fg-faint">{r.h}</small>
                  </div>
                  <div>
                    <div className="titre text-[14px]">{r.quoi}</div>
                    <p className="mt-1 text-[12.5px] leading-snug text-fg-muted">{r.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------- LES FORMULES */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T–02</b> / LES FORMULES</span>
            <h2 className="titre mt-3 text-[22px]">La course est la même.<br />Le réseau, non.</h2>
            <p className="mt-2 text-[13.5px] text-fg-muted">Aucune formule n’achète une meilleure course. Ce qui change, c’est quand le réseau commence, et combien de portes s’ouvrent après.</p>
            <div className="mt-4 border-t border-fg" role="radiogroup" aria-label="Formule">
              {FORMULES.map((f) => {
                const on = f.id === formule
                return (
                  <button
                    key={f.id} role="radio" aria-checked={on} onClick={() => setFormule(f.id)}
                    className={`relative block w-full border-b border-line p-3.5 text-left tap ${f.mise || on ? 'bg-encre text-craie' : 'text-fg'} ${on ? 'ring-1 ring-inset ring-brand-500' : ''}`}
                  >
                    {f.mise && <span className="absolute right-0 top-0 bg-brand-500 px-2 py-1 font-mono text-[8.5px] font-bold tracking-mono text-encre">LE PLUS CHOISI</span>}
                    <div className="flex items-baseline justify-between gap-3 pr-24">
                      <span className={`font-mono text-[10px] font-bold tracking-label ${f.mise || on ? 'text-craie/60' : 'text-fg-faint'}`}>FORMULE {f.n}</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between gap-3">
                      <span className="display text-[26px]">{f.nom}</span>
                      <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ {f.etat}</span>
                    </div>
                    <div className={`mt-0.5 font-mono text-[9.5px] uppercase tracking-mono ${f.mise || on ? 'text-craie/60' : 'text-fg-faint'}`}>{f.pour}</div>
                    <ul className="mt-2.5 space-y-1">
                      {f.points.map((p, i) => (
                        <li key={i} className={`flex gap-2 text-[12px] leading-snug ${f.mise || on ? 'text-craie/80' : 'text-fg-soft'}`}>
                          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-brand-500" />{p}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Le tarif affiché est toujours celui de la vague. Premium et Cercle se demandent depuis ton espace.</p>
          </section>

          {/* ---------------------------------------------------- LES VAGUES */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T–03</b> / LES VAGUES</span>
            <h2 className="titre mt-3 text-[22px]">Trois vagues, un tarif qui monte.</h2>
            <div className="mt-4 border-t border-fg">
              {VAGUES.map((v, i) => {
                const ouverte = v.code === vague.code
                const passee = VAGUES.indexOf(vague) > i
                return (
                  <div key={v.code} className={`grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line py-3 ${passee ? 'opacity-45' : ''}`}>
                    <div>
                      <div className="font-mono text-[10px] font-bold tracking-label text-fg-faint">
                        VAGUE 0{i + 1} {ouverte && <b className="text-brand-600">■ OUVERTE</b>}
                      </div>
                      <div className="titre mt-0.5 text-[16px]">{v.nom}</div>
                      <div className="font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{v.periode}</div>
                    </div>
                    <div className="display text-[34px] leading-none">{v.prix}<small className="ml-0.5 align-top text-[13px]">€</small></div>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[12.5px] text-fg-muted">Ta vague et son tarif sont gardés dès la création de ton compte, le temps que ton dossier soit lu. Le paiement vient après la validation, jamais avant.</p>
            {!dossier && (
              <a href={urlInscription} target="_blank" rel="noopener" className="btn btn-impact mt-4 w-full justify-between">
                <span>Prendre un dossard · {dist.label}</span><span className="arr">→</span>
              </a>
            )}
          </section>

          {/* ---------------------------------------------------- QUI COURT */}
          <section className="border-t border-line px-5 py-6">
            <span className="tmark"><b>T+</b> / QUI COURT CETTE ANNÉE</span>
            <h2 className="titre mt-3 text-[22px]">Tu sais déjà qui sera<br />sur la ligne.</h2>
            <div className="mt-4 flex items-center gap-3 border border-line p-3.5">
              <AvatarStack names={QUI_COURT.slice(0, 4)} total={INSCRITS} onMore={() => goTo('reseau')} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-fg"><span className="font-mono tabular-nums">{fmt(INSCRITS)}</span> dossards déjà pris</p>
                <p className="font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Fondateurs · dirigeants · investisseurs</p>
              </div>
            </div>
            <button onClick={() => { onClose(); goTo('reseau') }} className="btn btn-encre mt-3 w-full justify-between">
              <span>Voir l’annuaire</span><span className="arr">→</span>
            </button>
            <p className="mt-2 text-[12.5px] text-fg-muted">L’annuaire complet s’ouvre le jour J. <b className="text-fg">En Premium, dès la validation</b> — des mois avant la ligne, avec six rencontres à réserver.</p>
          </section>

          {/* ---------------------------------------------------- PRINCIPES */}
          <section className="border-t border-line px-5 pb-10 pt-6">
            <span className="tmark"><b>T+</b> / CE QU’ON GARDE</span>
            <div className="cadre mt-4 grid-cols-2">
              {PRINCIPES.map((p) => (
                <div key={p.n} className="p-3.5">
                  <span className="font-mono text-[10px] font-bold tracking-label text-brand-600">{p.n}</span>
                  <h3 className="titre mt-1.5 text-[13.5px]">{p.titre}</h3>
                  <p className="mt-1 text-[12px] leading-snug text-fg-muted">{p.texte}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-mono text-fg-faint">
              <span>© R.O.I · {EDITION.label} · 2027</span>
              <a href={siteUrl('')} target="_blank" rel="noopener" className="text-fg">runoninvest.fr →</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------- dossier relié */
function DossierLie({ dossier, onDelier, onEspace }) {
  const n = ETAT_INDEX[dossier.etat] || 1
  const dist = distanceById(dossier.distance)
  const f = formuleById(dossier.formule)
  return (
    <div>
      <span className="tmark"><b>T–</b> / TON DOSSIER</span>
      <h2 className="display mt-3 text-[28px]">Bonjour <span className="creuse">{dossier.prenom}</span>.</h2>
      <p className="mt-2 font-mono text-[10px] uppercase leading-[1.9] tracking-mono text-fg-faint">
        Dossier <b className="text-brand-600">{dossier.reference}</b> · Vague <b className="text-brand-600">{dossier.vague?.nom}</b> · Édition {dossier.edition || '01'}
      </p>
      {dossier.local && (
        <p className="mt-3 border border-dashed border-line-strong px-3 py-2 font-mono text-[10px] uppercase leading-relaxed tracking-mono text-fg-faint">
          <b className="text-brand-600">Aperçu hors ligne</b> — le site n’a pas répondu : ce dossier est reconstruit dans l’app.
        </p>
      )}

      <div className="mt-4 grid grid-cols-[1fr_168px] items-start gap-4">
        <dl className="border-t border-fg">
          {[
            ['Distance', `${dist.label} — ${dist.nom}`],
            ['Formule', f.nom],
            ['Tarif', dossier.vague ? `${dossier.vague.prix} € — vague ${dossier.vague.nom}` : '—'],
            ['Dossard', `${dossier.prenom} ${dossier.nom} · ${dossier.fonction} · ${dossier.entreprise}`],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-line py-2">
              <dt className="font-mono text-[9px] font-bold uppercase tracking-label text-brand-600">{k}</dt>
              <dd className="mt-0.5 text-[13px] font-medium leading-snug text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <Dossard dossier={dossier} />
      </div>

      <ol className="cadre mt-5 grid-cols-2" aria-label="Les quatre étapes du dossier">
        {ETAPES.map((e, i) => (
          <li key={e.id} className={`etape-suivi ${i + 1 < n ? 'fait' : ''} ${i + 1 === n ? 'cours' : ''}`} aria-current={i + 1 === n ? 'step' : undefined}>
            <span className="e-n">{e.n}</span>
            <h4>{e.titre}</h4>
            <p>{e.texte}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-col gap-2">
        <button onClick={onEspace} className="btn btn-impact w-full justify-between"><span>Ouvrir mon espace sur le site</span><span className="arr">→</span></button>
        <a href={siteUrl('espace/#formule')} target="_blank" rel="noopener" className="btn btn-ghost w-full justify-between"><span>Changer de formule</span><span className="arr">→</span></a>
      </div>
      <p className="mt-3 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
        <span>Le site garde la vérité du dossier.</span>
        <button onClick={onDelier} className="text-fg underline decoration-brand-500 underline-offset-4 tap">Délier</button>
      </p>
    </div>
  )
}

/* ---------------------------------------------------- prendre / relier */
function PrendreOuLier({ distance, formule, urlInscription, onLier }) {
  const [mode, setMode] = useState('prendre')
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState('')
  const [busy, setBusy] = useState(false)
  const dist = distanceById(distance)
  const f = formuleById(formule)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErreur('')
    const r = await onLier({ reference, email })
    setBusy(false)
    if (r.erreur) setErreur(r.erreur)
  }

  return (
    <div>
      <span className="tmark"><b>T–</b> / TON DOSSARD</span>
      <h2 className="display mt-3 text-[28px]">Un seul dossard.<br /><span className="creuse">Deux faces.</span></h2>
      <p className="mt-2 text-[13.5px] text-fg-muted">Recto, il te fait passer la ligne. Verso, il devient ton profil — ici, toute l’année. <b className="text-fg">L’inscription se fait sur le site</b>, ton dossier se relie ensuite en deux champs.</p>

      <div className="mt-4 grid grid-cols-2 border border-line" role="tablist">
        {[['prendre', 'Prendre un dossard'], ['relier', 'J’ai déjà un dossier']].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            className={`py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono tap ${mode === id ? 'bg-encre text-craie' : 'text-fg-muted'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'prendre' ? (
        <div className="mt-4 grid grid-cols-[1fr_128px] items-start gap-4">
          <div>
            <dl className="border-t border-fg">
              {[['Distance', `${dist.label} — ${dist.nom}`], ['Formule', `${f.nom} · ${f.prix}`], ['Vague', `${vagueCourante().nom} · ${vagueCourante().prix} €`]].map(([k, v]) => (
                <div key={k} className="border-b border-line py-2">
                  <dt className="font-mono text-[9px] font-bold uppercase tracking-label text-brand-600">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[12px] leading-snug text-fg-muted">Un compte, une distance, une formule : cinq minutes. Ta vague est gardée dès l’envoi.</p>
          </div>
          <Dossard verso={false} />
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4" noValidate>
          <div className="champ">
            <label htmlFor="ref">Référence du dossier</label>
            <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="E01-000123" autoComplete="off" spellCheck={false} />
          </div>
          <div className="champ mt-3">
            <label htmlFor="mail">E-mail du compte</label>
            <input id="mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@entreprise.fr" autoComplete="email" inputMode="email" />
          </div>
          <p className="mt-2 text-[12px] leading-snug text-fg-muted">La référence est en haut de ton espace sur le site. Depuis l’espace, « Ouvrir mon dossard dans l’app » remplit tout seul ces deux champs.</p>
          {erreur && <p className="form-msg mt-3" role="alert">{erreur}</p>}
          <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-impact mt-4 w-full justify-between">
            <span>{busy ? 'Lecture du dossier…' : 'Relier mon dossier'}</span><span className="arr">→</span>
          </button>
        </form>
      )}

      {mode === 'prendre' && (
        <a href={urlInscription} target="_blank" rel="noopener" className="btn btn-impact mt-4 w-full justify-between">
          <span>Prendre un dossard sur le site</span><span className="arr">→</span>
        </a>
      )}
    </div>
  )
}
