import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { ProgressBar } from '../components/primitives'
import { useSheetDrag } from '../lib/useSheetDrag'
import { REFERRAL, INVITE_PERKS } from '../data/invites'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validEmail(v) {
  return EMAIL_RE.test(v.trim())
}

/* La cooptation — l'une des trois voies d'accès au dossard (Kbis, avis
   SIRENE, cooptation d'un participant déjà inscrit). « Un seul critère :
   exercer. » Deux membres qui te cooptent ouvrent le Cercle. */
export default function InviteSheet({ onClose }) {
  const {
    plan, invites, sendInvite, referralJoined,
    teammates, inviteTeammate, openPlans, showToast,
  } = useApp()
  const drag = useSheetDrag(onClose)
  const [view, setView] = useState('email')
  const [email, setEmail] = useState('')
  const [teamEmail, setTeamEmail] = useState('')

  const isCercle = plan === 'business'

  function copyLink() {
    try { navigator.clipboard?.writeText(REFERRAL.url) } catch { /* presse-papier indisponible */ }
    showToast('Lien de cooptation copié')
  }
  function shareLink() {
    if (navigator.share) {
      navigator.share({ title: 'Un dossard R.O.I pour toi', text: 'Une course par an. Un réseau toute l’année. Je te coopte.', url: REFERRAL.url }).catch(() => {})
    } else {
      copyLink()
    }
  }
  function submitInvite(e) {
    e.preventDefault()
    if (!validEmail(email)) { showToast('E-mail invalide'); return }
    sendInvite(email.trim())
    setEmail('')
  }
  function submitTeammate(e) {
    e.preventDefault()
    if (!validEmail(teamEmail)) { showToast('E-mail invalide'); return }
    inviteTeammate(teamEmail.trim())
    setTeamEmail('')
  }

  const tabs = [
    { id: 'email', label: 'Par e-mail' },
    { id: 'lien', label: 'Par lien' },
    { id: 'equipe', label: 'Mon équipe' },
  ]

  /* Vers le Cercle : le bloc encre, un chiffre, une ligne qui se remplit. */
  const progression = (
    <section className="surface-hero p-4">
      <span className="tmark"><b>T–</b> / VERS LE CERCLE</span>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="display text-[40px] leading-[.85] text-craie tabular-nums">{referralJoined}<span className="text-[20px] t-beton">/{REFERRAL.goal}</span></div>
        <div className="max-w-[24ch] text-right text-[12px] leading-snug t-muted">{REFERRAL.reward}</div>
      </div>
      <div className="mt-3"><ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-craie/15" barClassName="bg-brand-500" /></div>
    </section>
  )

  const cooptations = invites.length > 0 && (
    <section>
      <h3 className="tmark"><b>{invites.length}</b> / TES COOPTATIONS</h3>
      <div className="mt-2 border-b border-line">
        {invites.map((inv) => {
          const joined = inv.status === 'joined'
          return (
            <div key={inv.id} className="rangee">
              <Avatar name={inv.name || inv.email} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-fg">{inv.name || inv.email}</div>
                <div className="truncate text-[12px] text-fg-faint">{inv.context} · {inv.date}</div>
              </div>
              <span className={`tag shrink-0 ${joined ? 'on' : ''}`}>{joined ? 'Dossard pris' : 'Envoyée'}</span>
            </div>
          )
        })}
      </div>
    </section>
  )

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-canvas">
        <div className="relative shrink-0 border-b border-fg px-5 pb-4 pt-3">
          <div {...drag.handleProps} className="mx-auto mb-3 h-1 w-10 bg-line-strong" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="tmark"><b>T–</b> / LA COOPTATION</span>
              <h2 className="mt-2 text-[22px] text-fg">Coopte quelqu’un<br /><span className="creuse">qui exerce.</span></h2>
            </div>
            <button onClick={onClose} className="ico shrink-0 tap" aria-label="Fermer">
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-fg-muted">
            Un seul critère : exercer. La cooptation est l’une des trois voies d’accès au dossard, avec le Kbis et l’avis SIRENE. Tu proposes un dossard à quelqu’un que tu connais ; deux membres qui te cooptent ouvrent le Cercle.
          </p>
          <div className="mt-3 flex divide-x divide-line border border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex-1 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${view === t.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {view === 'email' && (
            <div className="space-y-5">
              {progression}

              {/* Coopter par e-mail */}
              <form onSubmit={submitInvite} className="border border-line p-4">
                <div className="champ">
                  <label htmlFor="coopte-mail">Par e-mail</label>
                  <input id="coopte-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@entreprise.com" autoComplete="email" inputMode="email" />
                </div>
                <p className="mt-2 text-[12px] text-fg-muted">Il ou elle reçoit ta cooptation et prend son dossard sur le site, en cinq minutes.</p>
                <button type="submit" className="btn btn-impact btn-sm mt-3 w-full justify-between"><span>Envoyer la cooptation</span><span className="arr">→</span></button>
              </form>

              {/* Ce que ça ouvre : trois cellules du cadre */}
              <section className="cadre grid-cols-3">
                {INVITE_PERKS.map((p, i) => (
                  <div key={p.title} className="p-3">
                    <span className="font-mono text-[10px] font-bold tracking-label text-brand-500">0{i + 1}</span>
                    <div className="titre mt-1.5 text-[11.5px] text-fg">{p.title}</div>
                    <div className="mt-1 text-[11px] leading-snug text-fg-muted">{p.text}</div>
                  </div>
                ))}
              </section>

              {cooptations}
            </div>
          )}

          {view === 'lien' && (
            <div className="space-y-5">
              {progression}

              {/* Lien & partage */}
              <section className="border border-line p-4">
                <div className="champ">
                  <span className="lbl">Ton lien de cooptation</span>
                  <div className="input-ligne truncate font-mono text-[12px] text-fg" style={{ padding: '9px 0' }}>{REFERRAL.url}</div>
                </div>
                <p className="mt-2 text-[12px] text-fg-muted">Envoie-le comme tu veux : la cooptation est reliée à ton dossard, le dossard se prend sur le site.</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={copyLink} className="btn btn-ghost btn-sm justify-center"><Icon name="copy" className="h-4 w-4" /><span>Copier</span></button>
                  <button onClick={shareLink} className="btn btn-impact btn-sm justify-center"><Icon name="share" className="h-4 w-4" /><span>Partager</span></button>
                </div>
              </section>

              {cooptations}
            </div>
          )}

          {view === 'equipe' && (
            <div className="space-y-5">
              {!isCercle ? (
                <section className="surface-hero p-5">
                  <span className="tmark"><b>FORMULE 03</b> / LE CERCLE</span>
                  <h3 className="mt-3 text-[20px] text-craie">Les dossards<br /><span className="creuse">de ton équipe.</span></h3>
                  <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed t-muted">
                    Le Cercle comprend trois dossards invités pour ton équipe ou tes associés. Quarante places, sur cooptation de deux membres.
                  </p>
                  <button onClick={() => { onClose(); openPlans() }} className="btn btn-impact mt-4 w-full justify-between">
                    <span>Demander une place</span><span className="arr">→</span>
                  </button>
                </section>
              ) : (
                <>
                  <form onSubmit={submitTeammate} className="border border-line p-4">
                    <div className="champ">
                      <label htmlFor="equipe-mail">Ajouter un dossard invité</label>
                      <input id="equipe-mail" type="email" value={teamEmail} onChange={(e) => setTeamEmail(e.target.value)} placeholder="collegue@entreprise.com" autoComplete="email" inputMode="email" />
                    </div>
                    <p className="mt-2 text-[12px] text-fg-muted">Trois dossards invités pour ton équipe, avec tout le Premium.</p>
                    <button type="submit" className="btn btn-impact btn-sm mt-3 w-full justify-between"><span>Envoyer le dossard invité</span><span className="arr">→</span></button>
                  </form>

                  <section>
                    <h3 className="tmark"><b>{teammates.length}</b> / LES DOSSARDS DE TON ÉQUIPE</h3>
                    <div className="mt-2 border-b border-line">
                      {teammates.map((t) => (
                        <div key={t.id} className="rangee">
                          <Avatar name={t.name || t.email} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-fg">{t.name || t.email}</div>
                            <div className="truncate text-[12px] text-fg-faint">{t.email}</div>
                          </div>
                          <span className={`tag shrink-0 ${t.status === 'active' ? 'on' : ''}`}>
                            {t.role || (t.status === 'active' ? 'Membre' : 'Dossard invité')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
