import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { ProgressRing, SectionTitle, ProgressBar } from '../components/primitives'
import { ActivityCard } from '../components/ActivityCard'
import ServiceLogo from '../components/ServiceLogo'
import { ACTIVITIES } from '../data/activities'
import { EVENTS, CHALLENGE, LEADERBOARD } from '../data/events'
import { serviceById } from '../data/integrations'
import { formatEventDate } from '../lib/dates'
import { CURRENT_USER } from '../data/user'
import { SEASON, TIERS, seasonProgress } from '../data/levels'

export default function Courir() {
  const {
    actKudos, toggleActKudos, openActivity, openMember, showToast,
    eventKudos, toggleEventKudos, joined, toggleJoin, openEvent,
    integrations, openIntegrations, openRunMatch, runMatches,
  } = useApp()
  const [view, setView] = useState('activites')
  const topRun = runMatches?.[0]

  const RunMatchBanner = () => (
    <button
      onClick={openRunMatch}
      className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
    >
      <div className="absolute inset-0 bg-aurora" />
      <div className="relative flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/12 text-gold-300 ring-1 ring-white/15">
          <Icon name="activity" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">RunMatch · binôme de course</p>
          <p className="mt-0.5 text-[14px] font-extrabold leading-snug">
            {topRun ? `Cours avec ${topRun.name.split(' ')[0]} cette semaine` : 'Trouve ton binôme de run'}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-white/65">Même allure, et un vrai intérêt business. La sortie devient le RDV.</p>
        </div>
        <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-white/60" />
      </div>
    </button>
  )
  const pct = Math.round((CHALLENGE.current / CHALLENGE.total) * 100)
  const km = CURRENT_USER.stats.km
  const season = seasonProgress(km)

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-2xl font-extrabold text-fg">Courir</h1>
        <p className="mt-0.5 text-sm text-fg-muted">Cours, rencontre, avance.</p>

        <div className="mt-4 flex gap-1 rounded-2xl bg-surface-2 p-1">
          {[
            { id: 'activites', label: 'Activités' },
            { id: 'sorties', label: 'Sorties' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition tap ${
                view === s.id ? 'bg-surface-3 text-fg shadow-card' : 'text-fg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'activites' ? (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-3">
          <RunMatchBanner />
          {integrations.strava ? (
            <div className="flex items-center gap-2 rounded-2xl bg-success-light px-3.5 py-2.5 text-[12px] font-semibold text-success-dark">
              <Icon name="check" className="h-4 w-4 shrink-0" /> Tes courses sont synchronisées via Strava
            </div>
          ) : (
            <button
              onClick={openIntegrations}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left shadow-soft tap"
            >
              <ServiceLogo service={serviceById('strava')} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-fg">Connecter Strava</div>
                <div className="truncate text-xs text-fg-faint">Importe tes courses automatiquement</div>
              </div>
              <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-fg-faint" />
            </button>
          )}

          <button
            onClick={() => showToast('Enregistrement bientôt disponible 🏃')}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-line-strong px-3 py-3 text-left tap hover:bg-black/[0.04]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="activity" className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-fg">Enregistrer une activité</div>
              <div className="text-xs text-fg-faint">Ta sortie devient un post partageable</div>
            </div>
          </button>

          {ACTIVITIES.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              kudo={actKudos[a.id]}
              onKudo={() => toggleActKudos(a.id)}
              onOpen={() => openActivity(a.id)}
              onOpenAthlete={() => openMember(a.athlete)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar px-5 pb-6 pt-3">
          <RunMatchBanner />
          {/* Défi + classement */}
          <section className="overflow-hidden rounded-[28px] surface-hero text-white shadow-float">
            <div className="relative overflow-hidden p-5">
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative flex items-center gap-4">
                <ProgressRing value={pct} size={84} stroke={9} color="#FFFFFF" track="rgba(255,255,255,0.14)">
                  <div className="text-xl font-extrabold leading-none">{pct}%</div>
                </ProgressRing>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Icon name="flame" className="h-4 w-4 text-gold-300" filled /> {CHALLENGE.title}
                  </div>
                  <div className="text-2xl font-extrabold">{CHALLENGE.subtitle}</div>
                  <div className="mt-1 text-[13px] text-white/65">
                    {CHALLENGE.current} km · plus que {CHALLENGE.total - CHALLENGE.current} km en {CHALLENGE.daysLeft} jours
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/55">
                <Icon name="trophy" className="h-3.5 w-3.5" /> Classement
              </div>
              <div className="space-y-1">
                {LEADERBOARD.map((p, i) => (
                  <div
                    key={p.name}
                    className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${p.me ? 'bg-brand-500/20 ring-1 ring-brand-400/40' : ''}`}
                  >
                    <span className={`w-5 text-center text-sm font-bold ${i < 3 ? 'text-gold-300' : 'text-white/40'}`}>{i + 1}</span>
                    <Avatar name={p.name} size="xs" />
                    <span className={`flex-1 truncate text-sm ${p.me ? 'font-bold text-white' : 'text-white/80'}`}>
                      {p.name} {p.me && <span className="text-gold-300">· toi</span>}
                    </span>
                    <span className="text-sm font-bold text-white/90">{p.km} km</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Saison — cours, débloque */}
          <section className="rounded-[28px] border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold-dark ring-1 ring-gold/25">
                  <Icon name="trophy" className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-bold text-fg">{SEASON.label}</div>
                  <div className="text-[11px] text-fg-muted">Cours, débloque · fin dans {SEASON.endsIn}</div>
                </div>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-700">Niveau {season.level}</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-gradient-to-r from-brand-500 to-gold" />
              <span className="shrink-0 text-[12px] font-bold tabular-nums text-fg">{km} km</span>
            </div>
            <p className="mt-1.5 text-[12px] text-fg-muted">
              {season.next
                ? <>Plus que <span className="font-bold text-fg">{season.remaining} km</span> pour « {season.next.title} ».</>
                : 'Tous les paliers débloqués 🎉'}
            </p>

            <div className="mt-4 space-y-2">
              {TIERS.map((t) => {
                const unlocked = km >= t.km
                const isNext = season.next?.km === t.km
                return (
                  <div
                    key={t.km}
                    className={`flex items-center gap-3 rounded-2xl p-2.5 ${
                      isNext ? 'bg-brand-light/50 ring-1 ring-brand-200' : unlocked ? 'bg-surface-soft' : ''
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${unlocked ? 'bg-success-light text-success-dark' : 'bg-surface-2 text-fg-faint'}`}>
                      <Icon name={unlocked ? 'checkCircle' : 'lock'} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold ${unlocked ? 'text-fg' : 'text-fg-soft'}`}>{t.title}</span>
                        <span className="text-[11px] font-bold tabular-nums text-fg-faint">{t.km} km</span>
                      </div>
                      <div className="truncate text-[12px] text-fg-muted">{t.reward}</div>
                    </div>
                    {isNext && <span className="shrink-0 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">À venir</span>}
                  </div>
                )
              })}
            </div>
          </section>

          <SectionTitle>Sorties à venir</SectionTitle>

          <div className="space-y-3">
            {EVENTS.map((a) => {
              const k = eventKudos[a.id]
              const isJoined = joined[a.id]
              const d = formatEventDate(a.date)
              return (
                <article key={a.id} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                  <button onClick={() => openEvent(a.id)} className="flex w-full items-stretch text-left tap">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-surface-soft py-3 text-center">
                      <span className="text-[11px] font-bold uppercase text-brand-600">{a.day.slice(0, 3)}</span>
                      <span className="text-lg font-extrabold leading-none text-fg">{a.time.slice(0, 2)}</span>
                      <span className="text-[11px] text-fg-faint">{a.time.slice(2)}</span>
                    </div>
                    <div className="min-w-0 flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold leading-tight text-fg">{a.title}</h3>
                        <span className="mt-0.5 shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">{d.relative}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><Icon name="route" className="h-3.5 w-3.5" /> {a.distance}</span>
                        <span className="text-fg-faint">·</span>
                        <span>{a.pace}</span>
                        <span className="text-fg-faint">·</span>
                        <span>{a.level}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[12px] text-fg-muted">
                        <Icon name="mapPin" className="h-3.5 w-3.5" /> {a.place}
                        {a.tag && <span className="ml-1 font-bold text-brand-600">{a.tag}</span>}
                      </div>
                    </div>
                    <Icon name="chevronRight" className="mr-3 h-5 w-5 shrink-0 self-center text-fg-faint" />
                  </button>

                  <div className="flex items-center justify-between px-4 pb-3">
                    <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrits`)} />
                    <button
                      onClick={() => toggleEventKudos(a.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                        k.liked ? 'bg-like-light text-like' : 'bg-surface-2 text-fg-muted'
                      }`}
                    >
                      <Icon name="heart" className="h-4 w-4" filled={k.liked} />
                      {k.count}
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => toggleJoin(a.id)}
                      className={`w-full rounded-full py-3 text-sm font-bold tap ${
                        isJoined ? 'bg-success text-white' : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-brand hover:to-brand-700'
                      }`}
                    >
                      {isJoined ? 'Inscrit ✓' : 'Je participe'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
