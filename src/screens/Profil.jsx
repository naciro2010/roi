import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { SectionTitle, PlanBadge, Tuile } from '../components/primitives'
import { CURRENT_USER } from '../data/user'
import { SERVICES } from '../data/integrations'
import { EDITION } from '../data/race'
import { initials } from '../lib/avatar'

/* Une ligne de réglage : une icône, un libellé, une indication à droite, un
   chevron. Une ligne = un libellé — les descriptions longues de l'ancienne
   app ont disparu. */
function LigneReglage({ icon, label, hint, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3.5 border-b border-line-soft px-0.5 py-[15px] text-left tap">
      <Icon name={icon} className="h-[19px] w-[19px] shrink-0 text-fg-muted" />
      <span className="min-w-0 flex-1 text-[15px] font-medium">{label}</span>
      {hint && <span className="shrink-0 text-[13.5px] text-fg-faint">{hint}</span>}
      <Icon name="chevronRight" className="h-[17px] w-[17px] shrink-0 text-fg-faint" />
    </button>
  )
}

export default function Profil() {
  const {
    showToast, openEditProfile, replayOnboarding, openIntegrations, integrations,
    profile, resetDemo, plan, planMeta, openPlans, openInvite, referralJoined,
    meetings, openAgenda, eco, toggleEco, openRace, openPipeline, openRoiInfo, pipeline,
  } = useApp()
  const u = CURRENT_USER
  const connectes = SERVICES.filter((s) => integrations[s.id]).length

  return (
    <div className="animate-screenIn no-scrollbar h-full overflow-y-auto px-5 pb-7 pt-2">
      {/* ---- Qui tu es ici. Le dossard recto/verso a quitté l'app. ---- */}
      <div className="flex items-center gap-4">
        <span className="grid h-[66px] w-[66px] shrink-0 place-items-center rounded-full bg-encre text-[22px] font-medium uppercase text-craie">
          {initials(u.name)}
        </span>
        <div className="min-w-0">
          <h1 className="text-[24px]">{u.name}</h1>
          <p className="mt-[3px] flex flex-wrap items-center gap-2 text-[14px] text-fg-muted">
            {profile.title}
            <PlanBadge plan={plan} />
          </p>
          <p className="mt-px text-[13.5px] text-fg-faint">{u.location} · {EDITION.label}</p>
        </div>
      </div>

      {/* ---- Trois chiffres ---- */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Tuile value={u.roi.connections} label="personnes rencontrées" size={28} />
        <Tuile value={u.stats.km} label="km courus à plusieurs" size={28} />
        <Tuile value={u.roi.meetings} label="présentations faites" size={28} />
      </div>

      {/* ---- Ce que tu cherches : la seule chose que les autres lisent ---- */}
      <section className="mt-[26px]">
        <SectionTitle>Ce que tu cherches</SectionTitle>
        <div className="rounded-xl border border-line bg-surface p-[18px]">
          {profile.bio && <p className="text-[14.5px] leading-[1.65] text-fg-soft">{profile.bio}</p>}

          <div className="mt-4 flex flex-col gap-2">
            {profile.needs.map((n) => (
              <div key={n} className="flex items-start gap-2.5 text-[14.5px] leading-[1.4]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {n}
              </div>
            ))}
          </div>

          <p className="mt-[18px] text-[13px] font-semibold text-fg-faint">J’apporte</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...profile.offering, ...profile.interests].map((o) => (
              <span key={o} className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[13px]">{o}</span>
            ))}
          </div>

          <button
            onClick={openEditProfile}
            className="mt-[18px] rounded-full bg-encre px-5 py-[11px] text-[14px] font-semibold text-craie tap"
          >
            Modifier mon profil
          </button>
        </div>
      </section>

      {/* ---- Ton compte : une ligne = un libellé ---- */}
      <section className="mt-[26px]">
        <SectionTitle>Ton compte</SectionTitle>
        <div>
          <LigneReglage icon="flag" label="Ma course" hint={EDITION.label} onClick={openRace} />
          <LigneReglage icon="calendar" label="Mes rendez-vous" hint={`${meetings.length}`} onClick={openAgenda} />
          <LigneReglage icon="briefcase" label="Le suivi de tes relations" hint={`${pipeline.length}`} onClick={openPipeline} />
          <LigneReglage icon="crown" label="Ma formule" hint={planMeta.name} onClick={openPlans} />
          <LigneReglage icon="gift" label="Inviter quelqu’un" hint={`${referralJoined}`} onClick={openInvite} />
          <LigneReglage
            icon="link"
            label="Strava, montre, LinkedIn"
            hint={connectes > 0 ? `${connectes} connecté${connectes > 1 ? 's' : ''}` : 'Aucun'}
            onClick={openIntegrations}
          />
          <LigneReglage icon="shield" label="Confidentialité" onClick={() => showToast('Bientôt disponible')} />
          <LigneReglage icon="trendingUp" label="Comment on compte" onClick={openRoiInfo} />
          <LigneReglage icon="sparkles" label="Revoir l’introduction" onClick={replayOnboarding} />

          {/* Mode sobriété : un interrupteur, et rien à deviner. */}
          <div className="flex w-full items-center gap-3.5 border-b border-line-soft px-0.5 py-[15px]">
            <Icon name="leaf" className="h-[19px] w-[19px] shrink-0 text-fg-muted" />
            <span className="min-w-0 flex-1 text-[15px] font-medium">Mode sobriété</span>
            <button onClick={toggleEco} role="switch" aria-checked={eco} aria-label="Mode sobriété" className="shrink-0 tap">
              <span className={`inter ${eco ? 'on' : ''}`} aria-hidden />
            </button>
          </div>

          <LigneReglage icon="refresh" label="Réinitialiser la démo" onClick={resetDemo} />
        </div>
      </section>

      <button
        onClick={() => showToast('À bientôt')}
        className="mt-6 flex w-full items-center justify-center gap-2 py-3 text-[14px] font-medium text-fg-faint tap"
      >
        <Icon name="logout" className="h-[18px] w-[18px]" /> Se déconnecter
      </button>
    </div>
  )
}
