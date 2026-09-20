import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import ServiceLogo from '../components/ServiceLogo'
import { SectionTitle, ProgressRing, PlanBadge, ProgressBar, Sparkline } from '../components/primitives'
import { CURRENT_USER } from '../data/user'
import { ACTIVITIES } from '../data/activities'
import { SERVICES } from '../data/integrations'
import { REFERRAL } from '../data/invites'
import { MEETING_TYPES } from '../data/meetings'
import { seasonProgress } from '../data/levels'
import { formatEventDate } from '../lib/dates'
import Dossard from '../components/Dossard'
import { EDITION, daysToRace, distanceById, formuleById, siteUrl } from '../data/race'

export default function Profil() {
  const {
    showToast, goTo, openActivity, openEditProfile, openRoiInfo, replayOnboarding,
    openIntegrations, integrations, profile, resetDemo,
    plan, planMeta, openPlans, openInvite, referralJoined,
    meetings, openAgenda, insights, rankedMatches, openMember,
    eco, toggleEco, dossier, openRace,
  } = useApp()
  const topMatch = rankedMatches?.[0]
  const u = CURRENT_USER
  const nextMeeting = [...meetings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  const season = seasonProgress(u.stats.km)
  const myActivities = ACTIVITIES.filter((a) => a.athlete === u.name)
  const connectedCount = SERVICES.filter((s) => integrations[s.id]).length
  const isPaid = plan !== 'free'

  const stats = [
    { label: 'km avec quelqu’un', value: u.stats.km },
    { label: 'sorties', value: u.stats.sorties },
    { label: 'rencontres', value: u.stats.defis },
  ]
  const roiCards = [
    { label: 'Rencontres', value: u.roi.connections, delta: u.roi.connectionsDelta },
    { label: 'Présentations', value: u.roi.meetings, delta: u.roi.meetingsDelta },
    { label: 'En cours', value: u.roi.opportunities, delta: u.roi.opportunitiesDelta },
  ]
  const settings = [
    { icon: 'crown', label: 'Ma formule', onClick: openPlans, hint: planMeta.name },
    { icon: 'userPlus', label: 'Coopter un dirigeant', onClick: openInvite },
    { icon: 'bookmark', label: 'Dossards gardés', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sparkles', label: 'Revoir l’introduction', onClick: replayOnboarding },
    { icon: 'shield', label: 'Confidentialité', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sliders', label: 'Préférences', onClick: () => showToast('Bientôt disponible') },
    { icon: 'logout', label: 'Réinitialiser la démo', onClick: resetDemo },
  ]

  function shareProfile() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: `${u.name} · R.O.I`, text: `${u.name} — ${profile.title}`, url }).catch(() => {})
    } else {
      try { navigator.clipboard?.writeText(url) } catch { /* presse-papier indisponible */ }
      showToast('Lien du dossard copié')
    }
  }

  return (
    <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
      {/* Le verso du dossard EST le profil : « un seul dossard, il te fait
          passer la ligne, puis il devient ton profil ». */}
      <div className="surface-hero px-5 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <span className="tmark"><b>T+</b> / TON DOSSARD</span>
          <span className="font-mono text-[9.5px] uppercase tracking-mono text-craie/50">{EDITION.label} · T–{daysToRace()}</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_168px] items-end gap-4">
          <div className="min-w-0">
            <h1 className="text-[28px] text-craie">{u.name.split(' ')[0]}<br /><span className="creuse">{u.name.split(' ').slice(1).join(' ')}</span></h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="truncate text-[13px] text-craie/70">{profile.title}</p>
              <PlanBadge plan={plan} />
            </div>
            <p className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-craie/50">{u.location} · {u.joined}</p>
          </div>
          <Dossard dossier={dossier} nom={u.name} fonction={profile.title} entreprise={u.company} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={openEditProfile} className="btn btn-encre btn-sm justify-between"><span>Éditer le verso</span><span className="arr">→</span></button>
          <button onClick={shareProfile} aria-label="Partager mon dossard" className="btn btn-ghost btn-sm justify-between text-craie"><span>Partager</span><span className="arr">→</span></button>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Le dossier : ce que le site sait, lu par l'app */}
        <button onClick={openRace} className="block w-full border border-line p-3.5 text-left tap">
          {dossier ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-600">■ Dossier {dossier.reference}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Vague {dossier.vague?.nom}</span>
              </div>
              <div className="titre mt-1.5 text-[15px]">{distanceById(dossier.distance).label} · {formuleById(dossier.formule).nom}</div>
              <div className="mt-1 text-[12px] text-fg-muted">Ta place est gardée. Le suivi du dossier et la formule se règlent sur le site, depuis ton espace.</div>
            </>
          ) : (
            <>
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-600">■ Pas encore de dossard</span>
              <div className="titre mt-1.5 text-[15px]">Prends ta place sur la ligne</div>
              <div className="mt-1 text-[12px] text-fg-muted">Un compte, une distance, une formule : cinq minutes sur runoninvest.fr. Ou relie un dossier déjà ouvert.</div>
            </>
          )}
          <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
            <span>{dossier ? 'Voir mon dossier' : 'Voir l’édition'}</span><span>→</span>
          </div>
        </button>
        <div className="mt-3 space-y-3">
          {/* En deux lignes */}
          {profile.bio && (
            <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
              <h2 className="tmark">En deux lignes</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-soft">{profile.bio}</p>
            </section>
          )}

          {/* Ce que ça rapporte */}
          <section>
            <SectionTitle t="T+" action="Comment ça marche ?" onAction={openRoiInfo}>CE QUE ÇA RAPPORTE</SectionTitle>
            <button onClick={openRoiInfo} className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left shadow-card tap">
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative flex items-center gap-4">
                <ProgressRing value={u.roi.score} size={88} stroke={9} color="#FF4400" track="rgba(239,235,226,0.16)">
                  <div className="text-2xl font-semibold leading-none text-white tabular-nums">{u.roi.score}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-white/45">/ 100</div>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-white">Ton R.O.I</div>
                    <Sparkline data={u.roi.trend} width={84} height={30} />
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug text-white/55">Ce que tes rencontres ont produit ce mois-ci.</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-[12px] font-bold text-white ring-1 ring-white/20">
                    <Icon name="trendingUp" className="h-3.5 w-3.5" /> +{u.roi.weekDelta} cette semaine
                  </span>
                </div>
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2.5">
                {roiCards.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/10 p-2.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-white tabular-nums">{s.value}</span>
                      {s.delta != null && <span className="text-[11px] font-bold text-white/90 tabular-nums">+{s.delta}</span>}
                    </div>
                    <div className="text-[11px] text-white/55">{s.label}</div>
                  </div>
                ))}
              </div>
            </button>
          </section>

          {/* Ce que tu regardes — ce que le « Pour toi » a compris de toi */}
          <section>
            <SectionTitle action="Voir le « Pour toi »" onAction={() => goTo('reseau')}>Ce que tu regardes</SectionTitle>
            <div className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
              <p className="mb-2.5 text-[12px] text-fg-muted">Ce que le « Pour toi » a compris de toi</p>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={insights?.learning ? insights.icon : 'wand'} className="h-4 w-4" filled />
                </span>
                <p className="min-w-0 flex-1 text-[13px] font-bold leading-snug text-fg">{insights?.headline}</p>
              </div>
              {insights?.topTopics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {insights.topTopics.map((t) => (
                    <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-fg-soft">#{t}</span>
                  ))}
                </div>
              )}
              {topMatch && (
                <button
                  onClick={() => openMember(topMatch.name)}
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-soft p-2.5 text-left tap hover:bg-black/[0.04]"
                >
                  <Avatar name={topMatch.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-fg">Pour toi · {topMatch.name}</div>
                    <div className="truncate text-[12px] text-fg-muted">{topMatch.reasons?.[0]?.text}</div>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold tabular-nums text-brand-600">{topMatch.score}</span>
                </button>
              )}
            </div>
          </section>

          {/* Tes rencontres */}
          <button
            onClick={openAgenda}
            className="flex w-full items-center gap-3 rounded-3xl border border-line bg-surface p-4 text-left shadow-soft tap"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-success-light text-success-dark">
              <Icon name="calendar" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-fg">Tes rencontres</div>
              <p className="truncate text-[12px] text-fg-muted">
                {meetings.length} à venir
                {nextMeeting && ` · ${MEETING_TYPES[nextMeeting.type].label} avec ${nextMeeting.with.split(' ')[0]} ${formatEventDate(nextMeeting.date).relative}`}
              </p>
            </div>
            <Icon name="chevronRight" className="h-5 w-5 text-fg-faint" />
          </button>

          {/* Kilomètres investis — les km avec quelqu’un font monter un palier */}
          <section className="overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="tmark">Kilomètres investis · palier {season.level}</h2>
              <button onClick={() => goTo('courir')} className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 tap">
                Détails <Icon name="chevronRight" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-brand-500" />
              <span className="shrink-0 text-[11px] font-semibold tabular-nums text-fg-muted">{u.stats.km} km</span>
            </div>
            <p className="mt-2 text-[12px] text-fg-muted">
              {season.next
                ? <>Plus que <span className="font-semibold text-fg">{season.remaining} km avec quelqu’un</span> pour atteindre « {season.next.title} » — {season.next.reward.toLowerCase()}.</>
                : 'Tête de peloton : tous les paliers sont atteints'}
            </p>
          </section>

          {/* Ta formule */}
          {isPaid ? (
            <section className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-surface p-4 shadow-card">
              <div className="absolute inset-0 bg-gold-sheen" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold-dark ring-1 ring-gold/25">
                  <Icon name="crown" className="h-6 w-6" filled />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-fg">Ta formule · {planMeta.name}</span>
                    <PlanBadge plan={plan} />
                  </div>
                  <p className="text-[12px] text-fg-muted">Elle se règle sur le site, depuis ton espace.</p>
                </div>
                <button onClick={openPlans} className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-fg-soft tap">Voir les formules</button>
              </div>
            </section>
          ) : (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Icon name="crown" className="h-5 w-5 text-white" filled />
                  <span className="text-base font-semibold">Passer en Premium</span>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70">Sur demande</span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">
                  L’annuaire dès validation, six rencontres réservées, sans limite de propositions.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-fg">
                  Voir les formules <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </div>
            </button>
          )}

          {/* Cooptation */}
          <button
            onClick={openInvite}
            className="flex w-full items-center gap-3 rounded-3xl border border-line bg-surface p-4 text-left shadow-soft tap"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-light text-gold-dark">
              <Icon name="gift" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-fg">Coopter un dirigeant</div>
              <div className="mt-1.5 flex items-center gap-2">
                <ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-surface-2" barClassName="bg-gold" />
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-fg-muted">{referralJoined}/{REFERRAL.goal} vers le Cercle</span>
              </div>
            </div>
            <Icon name="chevronRight" className="h-5 w-5 text-fg-faint" />
          </button>

          {/* Ce que je cherche */}
          <section className="border border-fg p-4">
            <div className="flex items-center justify-between">
              <h2 className="tmark">Ce que je cherche</h2>
              <button
                onClick={openEditProfile}
                className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft tap"
              >
                <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {profile.needs.map((n) => (
                <li key={n} className="flex items-start gap-2.5 rounded-2xl bg-surface px-3.5 py-2.5 text-sm font-semibold text-fg shadow-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          {/* Ce que j’apporte */}
          <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <h2 className="tmark">Ce que j’apporte</h2>
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
              <div key={s.label} className="rounded-2xl border border-line bg-surface p-3 text-center shadow-soft">
                <div className="display text-[26px] tabular-nums">{s.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-label text-fg-faint">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Strava, LinkedIn, ta montre */}
          <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="tmark">Strava, LinkedIn, ta montre</h2>
              <button onClick={openIntegrations} className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-soft tap">
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
                      <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-success text-white ring-2 ring-canvas">
                        <Icon name="check" className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-2.5 text-xs text-fg-faint">
              {connectedCount > 0
                ? `${connectedCount} connecté${connectedCount > 1 ? 's' : ''} · tes sorties arrivent seules`
                : 'Connecte Strava ou ta montre : tes sorties arrivent seules.'}
            </p>
          </section>

          {/* Mes sorties */}
          {myActivities.length > 0 && (
            <section>
              <SectionTitle action="Tout voir" onAction={() => goTo('courir')}>Mes sorties</SectionTitle>
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                {myActivities.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => openActivity(a.id)}
                    className={`flex w-full items-center gap-3 px-3.5 py-3 text-left tap hover:bg-black/[0.04] ${i > 0 ? 'border-t border-line' : ''}`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="activity" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-fg">{a.title}</div>
                      <div className="text-[12px] text-fg-muted tabular-nums">{a.date} · {a.distance.toFixed(1)} km</div>
                    </div>
                    <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Sujets */}
          <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <h2 className="tmark">Sujets</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-fg-soft">
                  {i}
                </span>
              ))}
            </div>
          </section>

          {/* Édition */}
          <section className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-light text-brand-600">
              <Icon name="users" className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-fg-faint">Édition</div>
              <div className="font-semibold text-fg">{u.community}</div>
            </div>
          </section>

          {/* Numérique responsable */}
          <section className="overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success-light text-success-dark">
                <Icon name="leaf" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="tmark">Numérique responsable</h2>
                <p className="text-[12px] text-fg-muted">Conçu pour consommer moins, sans rien sacrifier.</p>
              </div>
            </div>

            {/* Mode sobriété — toggle */}
            <button
              onClick={toggleEco}
              role="switch"
              aria-checked={eco}
              aria-label="Mode sobriété"
              className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-soft p-3 text-left tap"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-fg">Mode sobriété</div>
                <p className="text-[12px] leading-snug text-fg-muted">
                  Cartes allégées et effets coupés — moins de données, plus d’autonomie.
                </p>
              </div>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${eco ? 'bg-success' : 'bg-surface-2'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-all duration-200 ${eco ? 'left-[22px]' : 'left-0.5'}`}
                />
              </span>
            </button>

            {/* Mesures d'éco-conception en place */}
            <ul className="mt-3 space-y-2">
              {[
                'Polices système : zéro police web téléchargée',
                'Cartes & écrans chargés à la demande',
                'Aucun pisteur ni cookie publicitaire',
                'Animations réduites selon tes préférences système',
              ].map((m) => (
                <li key={m} className="flex items-start gap-2 text-[12.5px] text-fg-soft">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {/* Réglages */}
          <section className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
            {settings.map((s, i) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left tap hover:bg-black/[0.04] ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <Icon name={s.icon} className="h-5 w-5 text-fg-faint" />
                <span className="flex-1 text-sm font-semibold text-fg">{s.label}</span>
                {s.hint && <span className="text-xs font-semibold text-fg-faint">{s.hint}</span>}
                <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
              </button>
            ))}
          </section>

          <button onClick={() => showToast('À bientôt')} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-fg-faint tap">
            <Icon name="logout" className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
