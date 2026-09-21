import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { SectionTitle, PlanBadge, ProgressBar, Chiffre } from '../components/primitives'
import { CURRENT_USER } from '../data/user'
import { SERVICES } from '../data/integrations'
import { REFERRAL } from '../data/invites'
import { MEETING_TYPES } from '../data/meetings'
import Dossard from '../components/Dossard'
import { EDITION, daysToRace, distanceById, formuleById } from '../data/race'

/* Une ligne de réglage : un libellé, une phrase qui dit ce que ça fait, une
   flèche. Jamais un libellé seul — si on doit deviner, c'est raté. */
function Reglage({ icon, label, detail, hint, onClick }) {
  return (
    <button onClick={onClick} className="rangee tap hover:bg-surface-2">
      {icon && <span className="ico"><Icon name={icon} className="h-4 w-4" /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium text-fg">{label}</span>
        {detail && <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">{detail}</span>}
      </span>
      {hint && <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-mono text-fg-faint">{hint}</span>}
      <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
    </button>
  )
}

export default function Profil() {
  const {
    showToast, goTo, openEditProfile, openRoiInfo, replayOnboarding,
    openIntegrations, integrations, profile, resetDemo,
    plan, planMeta, openPlans, openInvite, referralJoined,
    meetings, openAgenda, eco, toggleEco, dossier, openRace,
  } = useApp()
  const u = CURRENT_USER
  const nextMeeting = [...meetings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  const connectedCount = SERVICES.filter((s) => integrations[s.id]).length
  const isPaid = plan !== 'free'

  function shareProfile() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: `${u.name} · R.O.I`, text: `${u.name} — ${profile.title}`, url }).catch(() => {})
    } else {
      try { navigator.clipboard?.writeText(url) } catch { /* presse-papier indisponible */ }
      showToast('Lien de ton profil copié')
    }
  }

  return (
    <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
      {/* ---- Qui tu es ici : le verso du dossard EST ton profil. ---- */}
      <div className="surface-hero px-5 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="grid grid-cols-[1fr_150px] items-end gap-4">
          <div className="min-w-0">
            <h1 className="text-[26px] text-craie">{u.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-[14px] t-muted">{profile.title}</p>
              <PlanBadge plan={plan} />
            </div>
            <p className="mt-1 text-[13px] t-beton">{u.location}</p>
          </div>
          <Dossard dossier={dossier} nom={u.name} fonction={profile.title} entreprise={u.company} />
        </div>
        <p className="mt-4 text-[13px] leading-snug t-muted">
          Ce carré, c’est ton dossard : recto la course, verso ton profil. Touche-le pour le retourner.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={openEditProfile} className="btn btn-encre btn-sm justify-between"><span>Modifier</span><span className="arr">→</span></button>
          <button onClick={shareProfile} className="btn btn-ghost btn-sm justify-between text-craie"><span>Partager</span><span className="arr">→</span></button>
        </div>
      </div>

      <div className="space-y-7 px-5 pt-6">
        {/* ---- Ta course ---- */}
        <section>
          <SectionTitle help={`${EDITION.label} · ${EDITION.lieu} · dans ${daysToRace()} jours.`}>Ta course</SectionTitle>
          <button onClick={openRace} className="block w-full border border-line p-4 text-left tap hover:bg-surface-2">
            {dossier ? (
              <>
                <div className="text-[15px] font-medium text-fg">
                  {distanceById(dossier.distance).label} · formule {formuleById(dossier.formule).nom}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-fg-muted">
                  Ta place est gardée — dossier {dossier.reference}, vague {dossier.vague?.nom}. L’inscription et la formule se règlent sur le site.
                </p>
              </>
            ) : (
              <>
                <div className="text-[15px] font-medium text-fg">Tu n’as pas encore de dossard</div>
                <p className="mt-1 text-[13px] leading-snug text-fg-muted">
                  Cinq minutes sur runoninvest.fr : un compte, une distance, une formule. Ou relie un dossier déjà ouvert.
                </p>
              </>
            )}
            <span className="mt-2 inline-block font-mono text-[11px] font-bold uppercase tracking-mono text-brand-500">
              {dossier ? 'Voir mon dossier' : 'Voir la course'} →
            </span>
          </button>
        </section>

        {/* ---- Ce que tu cherches : la seule chose que les autres lisent ---- */}
        <section>
          <SectionTitle action="Modifier" onAction={openEditProfile} help="C’est ce que les autres voient de toi, et ce sur quoi on te propose des rencontres.">
            Ce que tu cherches
          </SectionTitle>
          <div className="border border-fg p-4">
            {profile.bio && <p className="text-[14.5px] leading-relaxed text-fg-soft">{profile.bio}</p>}

            <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-mono text-brand-500">Je cherche</p>
            <ul className="mt-2">
              {profile.needs.map((n) => (
                <li key={n} className="flex items-start gap-2.5 border-b border-line py-2.5 text-[14px] leading-snug text-fg">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand-500" />
                  {n}
                </li>
              ))}
            </ul>

            <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-mono text-fg-muted">J’apporte</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.offering.map((o) => <span key={o} className="tag">{o}</span>)}
              {profile.interests.map((i) => <span key={i} className="tag">{i}</span>)}
            </div>
          </div>
        </section>

        {/* ---- Tes chiffres ---- */}
        <section>
          <SectionTitle action="Comment ça marche ?" onAction={openRoiInfo} help="Depuis que tu es là.">
            Ce que ça t’a rapporté
          </SectionTitle>
          <div className="cadre grid-cols-3">
            <div className="p-3.5"><Chiffre value={u.roi.connections} label="personnes rencontrées" /></div>
            <div className="p-3.5"><Chiffre value={u.stats.km} label="km courus à plusieurs" /></div>
            <div className="p-3.5"><Chiffre value={u.roi.meetings} label="présentations faites" /></div>
          </div>
        </section>

        {/* ---- Tout le reste, en une liste : une ligne = un endroit ---- */}
        <section>
          <SectionTitle help="Tes rendez-vous, ta formule, tes connexions, tes préférences.">Ton compte</SectionTitle>
          <div className="border-b border-line">
            <Reglage
              icon="calendar" label="Mes rendez-vous" onClick={openAgenda}
              detail={nextMeeting
                ? `Le prochain : ${MEETING_TYPES[nextMeeting.type].label.toLowerCase()} avec ${nextMeeting.with.split(' ')[0]}.`
                : 'Aucun rendez-vous pour l’instant.'}
              hint={`${meetings.length}`}
            />
            <Reglage
              icon="crown" label="Ma formule" onClick={openPlans}
              detail={isPaid
                ? 'Elle se change sur le site, depuis ton espace.'
                : 'Premium ouvre les propositions sans limite et six rencontres réservées.'}
              hint={planMeta.name}
            />
            <Reglage
              icon="gift" label="Inviter quelqu’un" onClick={openInvite}
              detail="Ton invitation vaut justificatif. À deux invitations acceptées, le Cercle s’ouvre."
              hint={`${referralJoined}/${REFERRAL.goal}`}
            />
            <div className="px-0 pb-3">
              <ProgressBar value={referralJoined} total={REFERRAL.goal} className="bg-surface-2" barClassName="bg-brand-500" />
            </div>
            <Reglage
              icon="link" label="Strava, montre, LinkedIn" onClick={openIntegrations}
              detail={connectedCount > 0
                ? 'Tes sorties arrivent toutes seules.'
                : 'Connecte-les et tes sorties arrivent sans rien saisir.'}
              hint={connectedCount > 0 ? `${connectedCount} connecté${connectedCount > 1 ? 's' : ''}` : 'Aucun'}
            />
            <Reglage icon="activity" label="Mes sorties" detail="Ton historique de course." onClick={() => goTo('courir')} />
            <Reglage icon="sparkles" label="Revoir l’introduction" detail="Les quatre écrans du début, si tu veux les relire." onClick={replayOnboarding} />
            <Reglage icon="shield" label="Confidentialité" detail="Qui voit quoi de ton profil." onClick={() => showToast('Bientôt disponible')} />

            {/* Mode sobriété : un interrupteur, et ce qu'il fait, en clair. */}
            <div className="rangee">
              <span className="ico"><Icon name="leaf" className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium text-fg">Mode sobriété</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">
                  Cartes allégées et effets coupés : moins de données, plus de batterie.
                </span>
              </span>
              <button onClick={toggleEco} role="switch" aria-checked={eco} aria-label="Mode sobriété" className="shrink-0 tap">
                <span className={`inter ${eco ? 'on' : ''}`} aria-hidden />
              </button>
            </div>

            <Reglage icon="refresh" label="Réinitialiser la démo" detail="Tout revient à l’état de départ." onClick={resetDemo} />
          </div>
        </section>

        <button onClick={() => showToast('À bientôt')} className="flex w-full items-center justify-center gap-2 py-3 font-mono text-[11px] font-bold uppercase tracking-mono text-fg-faint tap">
          <Icon name="logout" className="h-4 w-4" /> Se déconnecter
        </button>
      </div>
    </div>
  )
}
