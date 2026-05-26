import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { SectionTitle, PILL_TONES } from '../components/primitives'
import { CURRENT_USER } from '../data/user'
import { ACTIVITIES } from '../data/activities'

export default function Profil() {
  const { showToast, goTo, openActivity, openEditProfile, openRoiInfo, replayOnboarding, profile } = useApp()
  const u = CURRENT_USER
  const myActivities = ACTIVITIES.filter((a) => a.athlete === u.name)

  const stats = [
    { label: 'km ce mois', value: u.stats.km },
    { label: 'sorties', value: u.stats.sorties },
    { label: 'défis', value: u.stats.defis },
  ]
  const roiCards = [
    { label: 'Connexions', value: u.roi.connections, icon: 'users', tone: 'indigo' },
    { label: 'RDV pris', value: u.roi.meetings, icon: 'calendar', tone: 'emerald' },
    { label: 'Opportunités', value: u.roi.opportunities, icon: 'briefcase', tone: 'brand' },
  ]
  const settings = [
    { icon: 'bookmark', label: 'Mes favoris', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sparkles', label: 'Revoir l’introduction', onClick: replayOnboarding },
    { icon: 'shield', label: 'Confidentialité', onClick: () => showToast('Bientôt disponible') },
    { icon: 'sliders', label: 'Préférences', onClick: () => showToast('Bientôt disponible') },
  ]

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
          <h1 className="mt-3 text-xl font-extrabold text-ink-900">{u.name}</h1>
          <p className="text-sm text-ink-500">{profile.title}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
            <Icon name="mapPin" className="h-3.5 w-3.5" /> {u.location}
            <span className="text-ink-300">·</span>
            {u.joined}
          </div>
          <button
            onClick={openEditProfile}
            className="mt-3 flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 shadow-soft tap"
          >
            <Icon name="pencil" className="h-4 w-4" /> Éditer le profil
          </button>
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
            <div className="grid grid-cols-3 gap-2.5">
              {roiCards.map((s) => (
                <button key={s.label} onClick={openRoiInfo} className="rounded-2xl border border-ink-100 bg-white p-3 text-left shadow-soft tap">
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${PILL_TONES[s.tone]}`}>
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <div className="mt-2 text-xl font-extrabold text-ink-900">{s.value}</div>
                  <div className="text-[11px] text-ink-400">{s.label}</div>
                </button>
              ))}
            </div>
          </section>

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
              <Icon name="link" className="h-5 w-5 text-[#3F7559]" /> Ce que je propose
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.offering.map((o) => (
                <span key={o} className="rounded-full bg-[#E4EDE7] px-3 py-1.5 text-sm font-semibold text-[#3C5A48]">
                  {o}
                </span>
              ))}
            </div>
          </section>

          {/* Stats running */}
          <section className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-3 text-center shadow-soft">
                <div className="text-xl font-extrabold text-ink-900">{s.value}</div>
                <div className="text-[11px] text-ink-400">{s.label}</div>
              </div>
            ))}
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
                      <div className="text-[12px] text-ink-400">{a.date} · {a.distance.toFixed(1)} km</div>
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
