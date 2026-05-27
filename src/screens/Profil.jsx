import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import ServiceLogo from '../components/ServiceLogo'
import { SectionTitle, ProgressRing, PlanBadge, ProgressBar } from '../components/primitives'
import { CURRENT_USER } from '../data/user'
import { ACTIVITIES } from '../data/activities'
import { SERVICES } from '../data/integrations'
import { REFERRAL } from '../data/invites'

export default function Profil() {
  const {
    showToast, goTo, openActivity, openEditProfile, openRoiInfo, replayOnboarding,
    openIntegrations, integrations, profile, resetDemo,
    plan, planMeta, openPlans, openInvite, openCopilot, referralJoined,
  } = useApp()
  const u = CURRENT_USER
  const myActivities = ACTIVITIES.filter((a) => a.athlete === u.name)
  const connectedCount = SERVICES.filter((s) => integrations[s.id]).length
  const isPaid = plan !== 'free'

  const stats = [
    { label: 'km ce mois', value: u.stats.km },
    { label: 'sorties', value: u.stats.sorties },
    { label: 'défis', value: u.stats.defis },
  ]
  const roiCards = [
    { label: 'Connexions', value: u.roi.connections, delta: u.roi.connectionsDelta },
    { label: 'RDV pris', value: u.roi.meetings, delta: u.roi.meetingsDelta },
    { label: 'Opportunités', value: u.roi.opportunities, delta: u.roi.opportunitiesDelta },
  ]
  const settings = [
    { icon: 'crown', label: 'Mon abonnement', onClick: openPlans, hint: planMeta.name },
    { icon: 'userPlus', label: 'Inviter des amis', onClick: openInvite },
    { icon: 'bookmark', label: 'Mes favoris', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sparkles', label: 'Revoir l’introduction', onClick: replayOnboarding },
    { icon: 'shield', label: 'Confidentialité', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sliders', label: 'Préférences', onClick: () => showToast('Bientôt disponible') },
    { icon: 'logout', label: 'Réinitialiser la démo', onClick: resetDemo },
  ]

  function shareProfile() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: `${u.name} · ROI`, text: `${u.name} — ${profile.title}`, url }).catch(() => {})
    } else {
      try { navigator.clipboard?.writeText(url) } catch { /* presse-papier indisponible */ }
      showToast('Lien du profil copié ✓')
    }
  }

  return (
    <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
      <div className="relative h-28 overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-hero-glow" />
      </div>

      <div className="px-5">
        <div className="-mt-12 flex flex-col items-center text-center">
          <div className="rounded-full p-1 ring-4 ring-white">
            <Avatar name={u.name} size="2xl" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-ink-900">{u.name}</h1>
            <PlanBadge plan={plan} />
          </div>
          <p className="text-sm text-ink-500">{profile.title}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
            <Icon name="mapPin" className="h-3.5 w-3.5" /> {u.location}
            <span className="text-ink-300">·</span>
            {u.joined}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={openEditProfile}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 shadow-soft tap"
            >
              <Icon name="pencil" className="h-4 w-4" /> Éditer le profil
            </button>
            <button
              onClick={shareProfile}
              aria-label="Partager mon profil"
              className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 shadow-soft tap"
            >
              <Icon name="share" className="h-4 w-4" /> Partager
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* À propos */}
          {profile.bio && (
            <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
              <h2 className="text-base font-bold text-ink-900">À propos</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{profile.bio}</p>
            </section>
          )}

          {/* ROI */}
          <section>
            <SectionTitle action="Comment ça marche ?" onAction={openRoiInfo}>Mon ROI réseau</SectionTitle>
            <button onClick={openRoiInfo} className="relative w-full overflow-hidden rounded-3xl bg-ink-950 p-4 text-left shadow-card tap">
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative flex items-center gap-4">
                <ProgressRing value={u.roi.score} size={88} stroke={9}>
                  <div className="text-2xl font-extrabold leading-none text-white tabular-nums">{u.roi.score}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-white/45">/ 100</div>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white">Score ROI</div>
                  <p className="mt-0.5 text-[12px] leading-snug text-white/55">La valeur que ton réseau te rapporte ce mois-ci.</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-bold text-success-300">
                    <Icon name="trendingUp" className="h-3.5 w-3.5" /> +{u.roi.weekDelta} cette semaine
                  </span>
                </div>
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2.5">
                {roiCards.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/10 p-2.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-white tabular-nums">{s.value}</span>
                      {s.delta != null && <span className="text-[11px] font-bold text-success-300 tabular-nums">+{s.delta}</span>}
                    </div>
                    <div className="text-[11px] text-white/55">{s.label}</div>
                  </div>
                ))}
              </div>
            </button>
          </section>

          {/* Copilot IA */}
          <button
            onClick={openCopilot}
            className="relative flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-ink-100 bg-white p-4 text-left shadow-soft tap"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#7E6FB0] text-white">
              <Icon name="sparkles" className="h-5 w-5" filled />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-ink-900">Copilot IA</div>
              <p className="text-[12px] leading-snug text-ink-500">Qui rencontrer, quoi dire, quoi poster — propulsé par l’IA.</p>
            </div>
            <Icon name="chevronRight" className="h-5 w-5 text-ink-300" />
          </button>

          {/* Abonnement */}
          {isPaid ? (
            <section className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-white p-4 shadow-card">
              <div className="absolute inset-0 bg-gold-sheen" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-light text-gold-dark">
                  <Icon name="crown" className="h-6 w-6" filled />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink-900">Abonnement {planMeta.name}</span>
                    <PlanBadge plan={plan} />
                  </div>
                  <p className="text-[12px] text-ink-500">Tu profites de toutes les fonctionnalités.</p>
                </div>
                <button onClick={openPlans} className="shrink-0 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-700 tap">Gérer</button>
              </div>
            </section>
          ) : (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl bg-ink-950 p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Icon name="crown" className="h-5 w-5 text-gold-300" filled />
                  <span className="text-base font-extrabold">Passe à Pro</span>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/70">dès 9€/mois</span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">
                  Copilot IA illimité, matchs illimités, « qui veut me rencontrer » et intros prioritaires.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-900">
                  Voir les offres <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </div>
            </button>
          )}

          {/* Parrainage */}
          <button
            onClick={openInvite}
            className="flex w-full items-center gap-3 rounded-3xl border border-ink-100 bg-white p-4 text-left shadow-soft tap"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EFEBE1] text-[#5F553C]">
              <Icon name="gift" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-ink-900">Invite & gagne 1 mois Pro</div>
              <div className="mt-1.5 flex items-center gap-2">
                <ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-ink-100" barClassName="bg-gold" />
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-ink-500">{referralJoined}/{REFERRAL.goal}</span>
              </div>
            </div>
            <Icon name="chevronRight" className="h-5 w-5 text-ink-300" />
          </button>

          {/* Ce que je cherche */}
          <section className="rounded-3xl border-2 border-brand-200 bg-brand-light/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <Icon name="target" className="h-5 w-5 text-brand-600" /> Ce que je cherche
              </h2>
              <button
                onClick={openEditProfile}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow-soft tap"
              >
                <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {profile.needs.map((n) => (
                <li key={n} className="flex items-start gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-800 shadow-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          {/* Ce que je propose */}
          <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              <Icon name="link" className="h-5 w-5 text-success" /> Ce que je propose
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.offering.map((o) => (
                <span key={o} className="rounded-full bg-success-light px-3 py-1.5 text-sm font-semibold text-success-dark">
                  {o}
                </span>
              ))}
            </div>
          </section>

          {/* Stats running */}
          <section className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-3 text-center shadow-soft">
                <div className="text-xl font-extrabold text-ink-900 tabular-nums">{s.value}</div>
                <div className="text-[11px] text-ink-500">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Connexions & appareils */}
          <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <Icon name="link" className="h-5 w-5 text-brand-600" /> Connexions & appareils
              </h2>
              <button onClick={openIntegrations} className="flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-700 tap">
                Gérer
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {SERVICES.map((s) => {
                const on = !!integrations[s.id]
                return (
                  <button key={s.id} onClick={openIntegrations} className="relative tap" aria-label={s.name}>
                    <span className={on ? '' : 'opacity-30 grayscale'}>
                      <ServiceLogo service={s} />
                    </span>
                    {on && (
                      <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-success text-white ring-2 ring-white">
                        <Icon name="check" className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-2.5 text-xs text-ink-400">
              {connectedCount > 0
                ? `${connectedCount} connecté${connectedCount > 1 ? 's' : ''} · Strava, LinkedIn, ta montre…`
                : 'Connecte Strava, LinkedIn et ta montre pour tout synchroniser.'}
            </p>
          </section>

          {/* Mes activités */}
          {myActivities.length > 0 && (
            <section>
              <SectionTitle action="Tout voir" onAction={() => goTo('courir')}>Mes activités</SectionTitle>
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
                {myActivities.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => openActivity(a.id)}
                    className={`flex w-full items-center gap-3 px-3.5 py-3 text-left tap hover:bg-ink-50 ${i > 0 ? 'border-t border-ink-100' : ''}`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="activity" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-ink-900">{a.title}</div>
                      <div className="text-[12px] text-ink-500 tabular-nums">{a.date} · {a.distance.toFixed(1)} km</div>
                    </div>
                    <Icon name="chevronRight" className="h-4 w-4 text-ink-300" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Centres d'intérêt */}
          <section className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
            <h2 className="text-base font-bold text-ink-900">Centres d’intérêt</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="rounded-full bg-ink-100 px-3 py-1.5 text-sm font-semibold text-ink-600">
                  {i}
                </span>
              ))}
            </div>
          </section>

          {/* Communauté */}
          <section className="flex items-center gap-3 rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-light text-brand-600">
              <Icon name="users" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-ink-400">Membre de</div>
              <div className="font-bold text-ink-900">{u.community}</div>
            </div>
          </section>

          {/* Réglages */}
          <section className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
            {settings.map((s, i) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left tap hover:bg-ink-50 ${i > 0 ? 'border-t border-ink-100' : ''}`}
              >
                <Icon name={s.icon} className="h-5 w-5 text-ink-400" />
                <span className="flex-1 text-sm font-semibold text-ink-800">{s.label}</span>
                {s.hint && <span className="text-xs font-bold text-ink-400">{s.hint}</span>}
                <Icon name="chevronRight" className="h-4 w-4 text-ink-300" />
              </button>
            ))}
          </section>

          <button onClick={() => showToast('À bientôt 👋')} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-ink-400 tap">
            <Icon name="logout" className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
