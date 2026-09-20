import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { PILL_TONES, ProgressBar } from '../components/primitives'
import { useSheetDrag } from '../lib/useSheetDrag'
import { REFERRAL, INVITE_PERKS } from '../data/invites'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validEmail(v) {
  return EMAIL_RE.test(v.trim())
}

/* Coopter — l'une des trois voies d'accès au dossard (Kbis, SIRENE,
   cooptation). Deux membres qui te cooptent ouvrent le Cercle. */
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

  const progression = (
    <section className="relative overflow-hidden rounded-3xl surface-hero p-4 text-white shadow-float">
      <div className="absolute inset-0 bg-gold-sheen" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Icon name="users" className="h-5 w-5 text-gold-300" />
          <h3 className="text-base font-semibold">{referralJoined}/{REFERRAL.goal} cooptations vers le Cercle</h3>
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">{REFERRAL.reward}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-white/15" barClassName="bg-gold-300" />
          <span className="shrink-0 text-[12px] font-semibold tabular-nums text-gold-300">{referralJoined}/{REFERRAL.goal}</span>
        </div>
      </div>
    </section>
  )

  const cooptations = invites.length > 0 && (
    <section>
      <p className="mb-2 px-1 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">Tes cooptations · {invites.length}</p>
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
        {invites.map((inv, i) => {
          const joined = inv.status === 'joined'
          return (
            <div key={inv.id} className={`flex items-center gap-3 px-3.5 py-3 ${i > 0 ? 'border-t border-line' : ''}`}>
              <Avatar name={inv.name || inv.email} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-fg">{inv.name || inv.email}</div>
                <div className="truncate text-[12px] text-fg-faint">{inv.context} · {inv.date}</div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${joined ? 'bg-success-light text-success-dark' : 'bg-surface-2 text-fg-muted'}`}>
                {joined ? 'A pris son dossard' : 'Cooptation envoyée'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden bg-surface-soft shadow-float"
      >
        <div className="relative shrink-0 border-b border-line bg-surface px-5 pb-3 pt-3">
          <div {...drag.handleProps} className="mx-auto mb-3 h-1 w-10 bg-line-strong" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="tmark"><b>T–</b> / LA COOPTATION</span>
              <h2 className="titre mt-1 text-[20px] text-fg">Coopte un dirigeant</h2>
            </div>
            <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-fg-muted tap" aria-label="Fermer">
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-fg-muted">
            La cooptation est l’une des trois voies d’accès au dossard, avec le Kbis et l’avis SIRENE. Tu proposes un dossard à quelqu’un que tu connais ; deux membres qui te cooptent ouvrent le Cercle.
          </p>
          <div className="mt-3 flex divide-x divide-line border border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex-1 rounded-xl py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${view === t.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {view === 'email' && (
            <div className="space-y-4">
              {progression}

              {/* Coopter par e-mail */}
              <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <p className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">Par e-mail</p>
                <p className="mt-1 text-[12px] text-fg-muted">Il ou elle reçoit ta cooptation et prend son dossard sur le site, en cinq minutes.</p>
                <form onSubmit={submitInvite} className="mt-2.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line-strong bg-surface px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-200">
                    <Icon name="mail" className="h-4 w-4 text-fg-faint" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prenom@entreprise.com"
                      className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
                    />
                  </div>
                  <button type="submit" className="shrink-0 rounded-full btn btn-impact px-4 py-2.5 text-sm font-semibold text-white shadow-brand tap">Envoyer la cooptation</button>
                </form>
              </section>

              {/* Ce que ça ouvre */}
              <section className="grid grid-cols-3 gap-2.5">
                {INVITE_PERKS.map((p) => (
                  <div key={p.title} className="rounded-2xl border border-line bg-surface p-3 text-center shadow-soft">
                    <span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${PILL_TONES[p.tone]}`}>
                      <Icon name={p.icon} className="h-4 w-4" filled={p.icon === 'sparkles'} />
                    </span>
                    <div className="mt-2 text-[12px] font-semibold leading-tight text-fg">{p.title}</div>
                    <div className="mt-0.5 text-[11px] leading-snug text-fg-muted">{p.text}</div>
                  </div>
                ))}
              </section>

              {cooptations}
            </div>
          )}

          {view === 'lien' && (
            <div className="space-y-4">
              {progression}

              {/* Lien & partage */}
              <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <p className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">Ton lien de cooptation</p>
                <p className="mt-1 text-[12px] text-fg-muted">Envoie-le comme tu veux : la cooptation est reliée à ton dossard.</p>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-surface-soft px-3 py-2.5">
                  <Icon name="link" className="h-4 w-4 shrink-0 text-fg-faint" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg-soft">{REFERRAL.url}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <button onClick={copyLink} className="flex items-center justify-center gap-2 rounded-full border border-line-strong py-3 text-sm font-semibold text-fg-soft tap">
                    <Icon name="copy" className="h-4 w-4" /> Copier le lien
                  </button>
                  <button onClick={shareLink} className="flex items-center justify-center gap-2 rounded-full btn btn-impact py-3 text-sm font-semibold text-white shadow-brand tap">
                    <Icon name="share" className="h-4 w-4" /> Partager
                  </button>
                </div>
              </section>

              {cooptations}
            </div>
          )}

          {view === 'equipe' && (
            <div className="space-y-4">
              {!isCercle ? (
                <section className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-surface p-5 text-center shadow-card">
                  <div className="absolute inset-0 bg-gold-sheen" />
                  <div className="relative">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold-dark ring-1 ring-gold/25">
                      <Icon name="users" className="h-7 w-7" />
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-fg">Les dossards de ton équipe</h3>
                    <p className="mx-auto mt-1 max-w-[280px] text-[13px] leading-relaxed text-fg-muted">
                      Le Cercle comprend trois dossards invités pour ton équipe. Quarante places, sur cooptation de deux membres.
                    </p>
                    <button
                      onClick={() => { onClose(); openPlans() }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-dark to-gold px-5 py-2.5 text-sm font-semibold text-white shadow-brand tap"
                    >
                      <Icon name="crown" className="h-4 w-4" filled /> Demander une place
                    </button>
                  </div>
                </section>
              ) : (
                <>
                  <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">Ajouter un dossard invité</p>
                    <p className="mt-1 text-[12px] text-fg-muted">Trois dossards invités pour ton équipe, avec tout le Premium.</p>
                    <form onSubmit={submitTeammate} className="mt-2.5 flex items-center gap-2">
                      <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line-strong bg-surface px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-200">
                        <Icon name="mail" className="h-4 w-4 text-fg-faint" />
                        <input
                          type="email"
                          value={teamEmail}
                          onChange={(e) => setTeamEmail(e.target.value)}
                          placeholder="collegue@entreprise.com"
                          className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
                        />
                      </div>
                      <button type="submit" className="shrink-0 rounded-full btn btn-impact px-4 py-2.5 text-sm font-semibold text-white shadow-brand tap" aria-label="Ajouter un dossard invité">
                        <Icon name="userPlus" className="h-4 w-4" />
                      </button>
                    </form>
                  </section>

                  <section>
                    <p className="mb-2 px-1 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">Les dossards de ton équipe · {teammates.length}</p>
                    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                      {teammates.map((t, i) => (
                        <div key={t.id} className={`flex items-center gap-3 px-3.5 py-3 ${i > 0 ? 'border-t border-line' : ''}`}>
                          <Avatar name={t.name || t.email} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-fg">{t.name || t.email}</div>
                            <div className="truncate text-[12px] text-fg-faint">{t.email}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.status === 'active' ? 'bg-brand-50 text-brand-700' : 'bg-surface-2 text-fg-muted'}`}>
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
