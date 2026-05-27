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

export default function InviteSheet({ onClose }) {
  const {
    plan, invites, sendInvite, referralJoined,
    teammates, inviteTeammate, openPlans, showToast,
  } = useApp()
  const drag = useSheetDrag(onClose)
  const [view, setView] = useState('amis')
  const [email, setEmail] = useState('')
  const [teamEmail, setTeamEmail] = useState('')

  const isBusiness = plan === 'business'
  const pct = Math.min(100, Math.round((referralJoined / REFERRAL.goal) * 100))

  function copyLink() {
    try { navigator.clipboard?.writeText(REFERRAL.url) } catch { /* presse-papier indisponible */ }
    showToast('Lien d’invitation copié ✓')
  }
  function shareLink() {
    if (navigator.share) {
      navigator.share({ title: 'Rejoins-moi sur ROI', text: 'Le réseau qui rapporte pour entrepreneurs qui courent.', url: REFERRAL.url }).catch(() => {})
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

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div
        style={drag.style}
        className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[94%] flex-col overflow-hidden rounded-t-[28px] bg-surface-soft shadow-float"
      >
        <div className="relative shrink-0 border-b border-line bg-surface px-5 pb-3 pt-3">
          <div {...drag.handleProps} className="mx-auto mb-3 h-1 w-10 rounded-full bg-surface-3" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-fg">Inviter sur ROI</h2>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-muted tap" aria-label="Fermer">
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-1 rounded-2xl bg-surface-2 p-1">
            {[{ id: 'amis', label: 'Amis & contacts' }, { id: 'equipe', label: 'Mon équipe' }].map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition tap ${view === t.id ? 'bg-surface-3 text-fg shadow-card' : 'text-fg-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {view === 'amis' ? (
            <div className="space-y-4">
              {/* Récompense parrainage */}
              <section className="relative overflow-hidden rounded-3xl surface-hero p-4 text-white shadow-float">
                <div className="absolute inset-0 bg-gold-sheen" />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Icon name="gift" className="h-5 w-5 text-gold-300" />
                    <h3 className="text-base font-extrabold">1 mois Pro offert</h3>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">{REFERRAL.reward}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-white/15" barClassName="bg-gold-300" />
                    <span className="shrink-0 text-[12px] font-bold tabular-nums text-gold-300">{referralJoined}/{REFERRAL.goal}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/45">{pct}% du chemin — continue, ça paie 💪</p>
                </div>
              </section>

              {/* Lien & partage */}
              <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-wide text-fg-faint">Ton lien d’invitation</p>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-surface-soft px-3 py-2.5">
                  <Icon name="link" className="h-4 w-4 shrink-0 text-fg-faint" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg-soft">{REFERRAL.url}</span>
                  <button onClick={copyLink} className="shrink-0 rounded-full bg-surface-3 px-3 py-1.5 text-[12px] font-bold text-white tap" aria-label="Copier le lien">
                    <Icon name="copy" className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button onClick={shareLink} className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3 text-sm font-bold text-white shadow-brand tap">
                  <Icon name="share" className="h-4 w-4" /> Partager mon lien
                </button>
              </section>

              {/* Inviter par e-mail */}
              <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-wide text-fg-faint">Inviter par e-mail</p>
                <p className="mt-1 text-[12px] text-fg-muted">Même hors de la communauté — ils reçoivent une invitation à rejoindre ROI.</p>
                <form onSubmit={submitInvite} className="mt-2.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line-strong bg-surface px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-200">
                    <Icon name="mail" className="h-4 w-4 text-fg-faint" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prenom@email.com"
                      className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
                    />
                  </div>
                  <button type="submit" className="shrink-0 rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-brand tap">Inviter</button>
                </form>
              </section>

              {/* Avantages */}
              <section className="grid grid-cols-3 gap-2.5">
                {INVITE_PERKS.map((p) => (
                  <div key={p.title} className="rounded-2xl border border-line bg-surface p-3 text-center shadow-soft">
                    <span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${PILL_TONES[p.tone]}`}>
                      <Icon name={p.icon} className="h-4 w-4" filled={p.icon === 'sparkles'} />
                    </span>
                    <div className="mt-2 text-[12px] font-bold leading-tight text-fg">{p.title}</div>
                    <div className="mt-0.5 text-[11px] leading-snug text-fg-muted">{p.text}</div>
                  </div>
                ))}
              </section>

              {/* Invitations envoyées */}
              {invites.length > 0 && (
                <section>
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-fg-faint">Invitations · {invites.length}</p>
                  <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                    {invites.map((inv, i) => {
                      const joined = inv.status === 'joined'
                      return (
                        <div key={inv.id} className={`flex items-center gap-3 px-3.5 py-3 ${i > 0 ? 'border-t border-line' : ''}`}>
                          <Avatar name={inv.name || inv.email} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-fg">{inv.name || inv.email}</div>
                            <div className="truncate text-[12px] text-fg-faint">{inv.context} · {inv.date}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${joined ? 'bg-success-light text-success-dark' : 'bg-surface-2 text-fg-muted'}`}>
                            {joined ? 'Inscrit·e ✓' : 'En attente'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!isBusiness ? (
                <section className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-surface p-5 text-center shadow-card">
                  <div className="absolute inset-0 bg-gold-sheen" />
                  <div className="relative">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold-300 ring-1 ring-gold/25">
                      <Icon name="users" className="h-7 w-7" />
                    </span>
                    <h3 className="mt-3 text-lg font-extrabold text-fg">Invite ton équipe</h3>
                    <p className="mx-auto mt-1 max-w-[280px] text-[13px] leading-relaxed text-fg-muted">
                      Les sièges d’équipe, l’espace partagé et les analytics ROI sont inclus dans le plan Business.
                    </p>
                    <button
                      onClick={() => { onClose(); openPlans() }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-dark to-gold px-5 py-2.5 text-sm font-bold text-white shadow-brand tap"
                    >
                      <Icon name="crown" className="h-4 w-4" filled /> Passer à Business
                    </button>
                  </div>
                </section>
              ) : (
                <>
                  <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-wide text-fg-faint">Inviter un coéquipier</p>
                    <p className="mt-1 text-[12px] text-fg-muted">Il rejoint ton espace Business avec un accès Pro complet.</p>
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
                      <button type="submit" className="shrink-0 rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-brand tap">
                        <Icon name="userPlus" className="h-4 w-4" />
                      </button>
                    </form>
                  </section>

                  <section>
                    <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-fg-faint">Membres · {teammates.length}</p>
                    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                      {teammates.map((t, i) => (
                        <div key={t.id} className={`flex items-center gap-3 px-3.5 py-3 ${i > 0 ? 'border-t border-line' : ''}`}>
                          <Avatar name={t.name || t.email} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-fg">{t.name || t.email}</div>
                            <div className="truncate text-[12px] text-fg-faint">{t.email}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${t.status === 'active' ? 'bg-brand-50 text-brand-700' : 'bg-surface-2 text-fg-muted'}`}>
                            {t.role || (t.status === 'active' ? 'Membre' : 'Invité·e')}
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
