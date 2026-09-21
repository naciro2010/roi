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
import { EDITION, daysToRace, distanceById, formuleById } from '../data/race'

/* Une rangée de liste : un filet au-dessus, un carré pour l'icône, le
   libellé, le détail en dessous — la fiche du site, ligne par ligne. */
function Rangee({ icon, label, detail, hint, onClick, plein = false, children }) {
  return (
    <button onClick={onClick} className="rangee tap hover:bg-surface-2">
      {icon && <span className={`ico ${plein ? 'plein' : ''}`}><Icon name={icon} className="h-4 w-4" /></span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg">{label}</span>
        {detail && <span className="block truncate text-[12px] text-fg-muted">{detail}</span>}
        {children}
      </span>
      {hint && <span className="shrink-0 font-mono text-[9.5px] font-bold uppercase tracking-mono text-fg-faint">{hint}</span>}
      <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
    </button>
  )
}

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
  const edition = dossier ? `${EDITION.label} · dossard ${distanceById(dossier.distance).label}` : u.community

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
    { icon: 'userPlus', label: 'Proposer un dossard', onClick: openInvite, hint: 'Cooptation' },
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
        <div className="flex items-center justify-between gap-3">
          <span className="tmark"><b>T+</b> / TON DOSSARD</span>
          <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-mono t-beton">{EDITION.label} · T–{daysToRace()}</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_168px] items-end gap-4">
          <div className="min-w-0">
            <h1 className="text-[28px] text-craie">{u.name.split(' ')[0]}<br /><span className="creuse">{u.name.split(' ').slice(1).join(' ')}</span></h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="truncate text-[13px] t-muted">{profile.title}</p>
              <PlanBadge plan={plan} />
            </div>
            <p className="mt-1 font-mono text-[9.5px] uppercase tracking-mono t-beton">{u.location} · {u.joined}</p>
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
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ Dossier {dossier.reference}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Vague {dossier.vague?.nom}</span>
              </div>
              <div className="titre mt-1.5 text-[15px]">{distanceById(dossier.distance).label} · {formuleById(dossier.formule).nom}</div>
              <div className="mt-1 text-[12px] text-fg-muted">Ta place est gardée. Le suivi du dossier et la formule se règlent sur le site, depuis ton espace.</div>
            </>
          ) : (
            <>
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ Pas encore de dossard</span>
              <div className="titre mt-1.5 text-[15px]">Prends ta place sur la ligne</div>
              <div className="mt-1 text-[12px] text-fg-muted">Un compte, une distance, une formule : cinq minutes sur runoninvest.fr. Ou relie un dossier déjà ouvert.</div>
            </>
          )}
          <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
            <span>{dossier ? 'Voir mon dossier' : 'Voir l’édition'}</span><span>→</span>
          </div>
        </button>

        <div className="mt-5 space-y-6">
          {/* En deux lignes */}
          {profile.bio && (
            <section>
              <SectionTitle>En deux lignes</SectionTitle>
              <p className="border-t border-fg pt-3 text-[14px] leading-relaxed text-fg-soft">{profile.bio}</p>
            </section>
          )}

          {/* Ce que ça rapporte : le bloc encre, gros chiffres, labels mono */}
          <section>
            <SectionTitle t="T+" action="Comment ça marche ?" onAction={openRoiInfo}>CE QUE ÇA RAPPORTE</SectionTitle>
            <button onClick={openRoiInfo} className="surface-hero w-full p-4 text-left tap">
              <div className="flex items-center gap-4">
                <ProgressRing value={u.roi.score} size={84} stroke={8} color="#FF4400" track="rgba(239,235,226,0.16)">
                  <div className="display text-[26px] leading-none text-craie tabular-nums">{u.roi.score}</div>
                  <div className="mt-0.5 font-mono text-[9px] tracking-mono t-beton">/ 100</div>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="titre text-[15px] text-craie">Ton R.O.I</div>
                    <Sparkline data={u.roi.trend} width={84} height={30} />
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug t-muted">Ce que tes rencontres ont produit ce mois-ci.</p>
                  <span className="mt-2 inline-block font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">+{u.roi.weekDelta} cette semaine</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-line-craie border-t border-line-craie">
                {roiCards.map((s) => (
                  <div key={s.label} className="py-2.5 pl-3 first:pl-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="display text-[22px] leading-none text-craie tabular-nums">{s.value}</span>
                      {s.delta != null && <span className="font-mono text-[10px] font-bold text-brand-500 tabular-nums">+{s.delta}</span>}
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-label t-beton">{s.label}</div>
                  </div>
                ))}
              </div>
            </button>
          </section>

          {/* Ce que tu regardes — ce que le « Pour toi » a compris de toi */}
          <section>
            <SectionTitle action="Voir le « Pour toi »" onAction={() => goTo('reseau')}>Ce que tu regardes</SectionTitle>
            <div className="border border-line p-4">
              <div className="flex items-center gap-3">
                <span className="ico plein"><Icon name={insights?.learning ? insights.icon : 'wand'} className="h-4 w-4" filled /></span>
                <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-fg">{insights?.headline}</p>
              </div>
              {insights?.topTopics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {insights.topTopics.map((t) => (
                    <span key={t} className="tag">#{t}</span>
                  ))}
                </div>
              )}
              {topMatch && (
                <button onClick={() => openMember(topMatch.name)} className="rangee mt-3 tap">
                  <Avatar name={topMatch.name} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-fg">Pour toi · {topMatch.name}</span>
                    <span className="block truncate text-[12px] text-fg-muted">{topMatch.reasons?.[0]?.text}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-brand-500">{topMatch.score}</span>
                </button>
              )}
            </div>
          </section>

          {/* Tes rencontres, tes kilomètres, ta formule, la cooptation : une liste */}
          <section>
            <SectionTitle t="T+">LE RÉSEAU, TOUTE L’ANNÉE</SectionTitle>
            <div className="border-b border-line">
              <Rangee
                icon="calendar" plein label="Tes rencontres" onClick={openAgenda}
                detail={`${meetings.length} à venir${nextMeeting ? ` · ${MEETING_TYPES[nextMeeting.type].label} avec ${nextMeeting.with.split(' ')[0]} ${formatEventDate(nextMeeting.date).relative}` : ''}`}
              />
              <Rangee icon="activity" label={`Kilomètres investis · palier ${season.level}`} onClick={() => goTo('courir')} hint={`${u.stats.km} km`}>
                <span className="mt-1.5 block"><ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-brand-500" /></span>
                <span className="mt-1 block text-[12px] text-fg-muted">
                  {season.next
                    ? <>Plus que <b className="font-medium text-fg">{season.remaining} km avec quelqu’un</b> pour « {season.next.title} » — {season.next.reward.toLowerCase()}.</>
                    : 'Tête de peloton : tous les paliers sont atteints.'}
                </span>
              </Rangee>
              <Rangee
                icon="crown" plein={isPaid} label={`Ta formule · ${planMeta.name}`} onClick={openPlans}
                detail={isPaid ? 'Elle se règle sur le site, depuis ton espace.' : 'Premium : l’annuaire dès validation, six rencontres réservées, sans limite de propositions.'}
                hint={isPaid ? planMeta.etat : 'Sur demande'}
              />
              <Rangee icon="gift" label="Proposer un dossard" onClick={openInvite} hint={`${referralJoined}/${REFERRAL.goal} vers le Cercle`}>
                <span className="mt-1.5 block"><ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-surface-2" barClassName="bg-brand-500" /></span>
                <span className="mt-1 block text-[12px] text-fg-muted">La cooptation vaut justificatif. À deux cooptations, le Cercle s’ouvre.</span>
              </Rangee>
            </div>
          </section>

          {/* Ce que je cherche · ce que j'apporte : les deux faces de l'intention */}
          <section className="border border-fg p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="tmark"><b>T+</b> / CE QUE JE CHERCHE</h2>
              <button onClick={openEditProfile} className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-mono text-brand-500 tap">
                <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
              </button>
            </div>
            <ul className="mt-3 border-t border-fg">
              {profile.needs.map((n) => (
                <li key={n} className="flex items-start gap-2.5 border-b border-line py-2.5 text-[13.5px] font-medium text-fg">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand-500" />
                  {n}
                </li>
              ))}
            </ul>
            <h2 className="tmark mt-5">Ce que j’apporte</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.offering.map((o) => (
                <span key={o} className="tag">{o}</span>
              ))}
            </div>
          </section>

          {/* Les chiffres, toujours reliés à quelqu'un */}
          <section className="cadre grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="p-3 text-center">
                <div className="display text-[26px] tabular-nums">{s.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-label text-fg-faint">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Strava, LinkedIn, ta montre */}
          <section className="border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="tmark">Strava, LinkedIn, ta montre</h2>
              <button onClick={openIntegrations} className="font-mono text-[10px] font-bold uppercase tracking-mono text-brand-500 tap">Gérer →</button>
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
                      <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center bg-encre text-craie ring-2 ring-canvas">
                        <Icon name="check" className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
              {connectedCount > 0
                ? `${connectedCount} connecté${connectedCount > 1 ? 's' : ''} · tes sorties arrivent seules`
                : 'Connecte Strava ou ta montre : tes sorties arrivent seules.'}
            </p>
          </section>

          {/* Mes sorties */}
          {myActivities.length > 0 && (
            <section>
              <SectionTitle t="T–" action="Tout voir" onAction={() => goTo('courir')}>MES SORTIES</SectionTitle>
              <div className="border-b border-line">
                {myActivities.map((a) => (
                  <Rangee key={a.id} icon="activity" label={a.title} detail={`${a.date} · ${a.distance.toFixed(1)} km`} onClick={() => openActivity(a.id)} />
                ))}
              </div>
            </section>
          )}

          {/* Sujets · Édition */}
          <section className="border border-line p-4">
            <h2 className="tmark">Sujets</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <span key={i} className="tag">{i}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
              <span className="ico"><Icon name="flag" className="h-4 w-4" /></span>
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-label text-fg-faint">Édition</div>
                <div className="truncate text-sm font-medium text-fg">{edition}</div>
              </div>
            </div>
          </section>

          {/* Numérique responsable */}
          <section className="border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="ico"><Icon name="leaf" className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <h2 className="tmark">Numérique responsable</h2>
                <p className="text-[12px] text-fg-muted">Conçu pour consommer moins, sans rien sacrifier.</p>
              </div>
            </div>

            {/* Mode sobriété — interrupteur carré */}
            <button onClick={toggleEco} role="switch" aria-checked={eco} aria-label="Mode sobriété" className="mt-3 flex w-full items-center gap-3 border-t border-line pt-3 text-left tap">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-fg">Mode sobriété</div>
                <p className="text-[12px] leading-snug text-fg-muted">Cartes allégées, grain et effets coupés — moins de données, plus d’autonomie.</p>
              </div>
              <span className={`inter ${eco ? 'on' : ''}`} aria-hidden />
            </button>

            {/* Mesures d'éco-conception en place */}
            <ul className="mt-3 border-t border-line">
              {[
                'Deux fontes auto-hébergées, aucun service tiers',
                'Cartes & écrans chargés à la demande',
                'Aucun pisteur ni cookie publicitaire',
                'Animations réduites selon tes préférences système',
              ].map((m) => (
                <li key={m} className="flex items-start gap-2.5 border-b border-line py-2 text-[12.5px] text-fg-soft">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 bg-brand-500" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {/* Réglages */}
          <section className="border-b border-line">
            {settings.map((s) => (
              <Rangee key={s.label} icon={s.icon} label={s.label} hint={s.hint} onClick={s.onClick} />
            ))}
          </section>

          <button onClick={() => showToast('À bientôt')} className="flex w-full items-center justify-center gap-2 py-2 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint tap">
            <Icon name="logout" className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
