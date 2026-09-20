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
import { EDITION, daysToRace, distanceById, vagueCourante } from '../data/race'

export default function Courir() {
  const {
    actKudos, toggleActKudos, openActivity, openMember, showToast,
    eventKudos, toggleEventKudos, joined, toggleJoin, openEvent,
    integrations, openIntegrations, openRunMatch, runMatches,
    openRace, dossier,
  } = useApp()
  const [view, setView] = useState('activites')
  const topRun = runMatches?.[0]
  const jours = daysToRace()

  const OfficialRaceBanner = () => (
    <button onClick={openRace} className="surface-hero relative w-full p-4 text-left tap">
      <span className="tmark"><b>{EDITION.label}</b> {EDITION.lieu} · {EDITION.moisCourt}</span>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="shrink-0">
          <div className="display whitespace-nowrap text-[40px] leading-[.85] text-craie">T–{jours}</div>
          <div className="mt-1.5 font-mono text-[9.5px] uppercase tracking-label text-craie/55">Jours avant la ligne</div>
        </div>
        <div className="text-right">
          {dossier ? (
            <>
              <div className="titre text-[14px] text-craie">{distanceById(dossier.distance).label} · {distanceById(dossier.distance).nom}</div>
              <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-brand-500">■ Dossier {dossier.reference}</div>
            </>
          ) : (
            <>
              <div className="titre text-[14px] text-craie">5 · 10 · 21,1 km</div>
              <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-brand-500">Vague {vagueCourante().nom} ouverte →</div>
            </>
          )}
        </div>
      </div>
    </button>
  )

  const RunMatchBanner = () => (
    <button
      onClick={openRunMatch}
      className="relative w-full border border-line p-4 text-left tap"
    >
      <div className="relative flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-encre text-craie">
          <Icon name="activity" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] font-bold uppercase text-brand-600">■ RunMatch · binôme de course</p>
          <p className="titre mt-0.5 text-[14px]">
            {topRun ? `Cours avec ${topRun.name.split(' ')[0]} cette semaine` : 'Trouve ton binôme de run'}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-fg-muted">Même allure, et un vrai intérêt business. La sortie devient le RDV.</p>
        </div>
        <span className="font-mono text-fg-faint">→</span>
      </div>
    </button>
  )
  const pct = Math.round((CHALLENGE.current / CHALLENGE.total) * 100)
  const km = CURRENT_USER.stats.km
  const season = seasonProgress(km)
  const week = CURRENT_USER.week
  const weekKm = week.km.reduce((t, k) => t + k, 0)
  const weekMax = Math.max(...week.km, 1)

  const WeekSummary = () => (
    <section className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-faint">Cette semaine</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="display text-[30px] leading-none text-fg tabular-nums">{weekKm.toFixed(1)}</span>
            <span className="text-sm font-semibold text-fg-muted">km</span>
          </div>
        </div>
        <div className="flex gap-5 text-right">
          <div>
            <div className="text-[15px] font-bold leading-none text-fg tabular-nums">{week.runs}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-fg-faint">sorties</div>
          </div>
          <div>
            <div className="text-[15px] font-bold leading-none text-fg tabular-nums">{week.time.slice(0, 4)}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-fg-faint">temps</div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-stretch justify-between gap-1.5" style={{ height: 66 }}>
        {week.km.map((k, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full transition-all ${k > 0 ? 'bg-fg' : 'bg-surface-2'}`}
                style={{ height: k > 0 ? `${22 + (k / weekMax) * 78}%` : '6px' }}
                title={k > 0 ? `${week.days[i]} · ${k.toFixed(1)} km` : 'Repos'}
              />
            </div>
            <span className="text-[10px] font-semibold text-fg-faint">{week.days[i]}</span>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <span className="tmark"><b>T–</b> / AVANT LA LIGNE</span>
        <h1 className="mt-2 text-[30px]">Courir, <span className="creuse">rencontrer.</span></h1>

        <div className="mt-4 grid grid-cols-2 border border-line">
          {[
            { id: 'activites', label: 'Activités' },
            { id: 'sorties', label: 'Sorties' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              className={`py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${
                view === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'activites' ? (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-3">
          <WeekSummary />
          <OfficialRaceBanner />
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
                <div className="text-sm font-semibold text-fg">Connecter Strava</div>
                <div className="truncate text-xs text-fg-faint">Importe tes courses automatiquement</div>
              </div>
              <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-fg-faint" />
            </button>
          )}

          <button
            onClick={() => showToast('Enregistrement bientôt disponible')}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-line-strong px-3 py-3 text-left tap hover:bg-black/[0.04]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="activity" className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-fg">Enregistrer une activité</div>
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
          <OfficialRaceBanner />
          <RunMatchBanner />
          {/* Défi + classement */}
          <section className="overflow-hidden rounded-3xl surface-hero text-white shadow-float">
            <div className="relative overflow-hidden p-5">
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative flex items-center gap-4">
                <ProgressRing value={pct} size={84} stroke={9} color="#FF4400" track="rgba(239,235,226,0.16)">
                  <div className="text-xl font-semibold leading-none">{pct}%</div>
                </ProgressRing>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon name="flame" className="h-4 w-4 text-white" filled /> {CHALLENGE.title}
                  </div>
                  <div className="text-2xl font-semibold">{CHALLENGE.subtitle}</div>
                  <div className="mt-1 text-[13px] text-white/65">
                    {CHALLENGE.current} km · plus que {CHALLENGE.total - CHALLENGE.current} km en {CHALLENGE.daysLeft} jours
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/55">
                <Icon name="trophy" className="h-3.5 w-3.5" /> Classement
              </div>
              <div className="space-y-1">
                {LEADERBOARD.map((p, i) => (
                  <div
                    key={p.name}
                    className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${p.me ? 'bg-white/15 ring-1 ring-white/25' : ''}`}
                  >
                    <span className={`w-5 text-center text-sm font-bold ${i < 3 ? 'text-white' : 'text-white/45'}`}>{i + 1}</span>
                    <Avatar name={p.name} size="xs" />
                    <span className={`flex-1 truncate text-sm ${p.me ? 'font-semibold text-white' : 'text-white/80'}`}>
                      {p.name} {p.me && <span className="font-bold text-white">· toi</span>}
                    </span>
                    <span className="text-sm font-semibold text-white/90">{p.km} km</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Saison — cours, débloque */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold-dark ring-1 ring-gold/25">
                  <Icon name="trophy" className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg">{SEASON.label}</div>
                  <div className="text-[11px] text-fg-muted">Cours, débloque · fin dans {SEASON.endsIn}</div>
                </div>
              </div>
              <span className="bg-encre px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-craie">Niveau {season.level}</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-brand-500" />
              <span className="shrink-0 text-[12px] font-semibold tabular-nums text-fg">{km} km</span>
            </div>
            <p className="mt-1.5 text-[12px] text-fg-muted">
              {season.next
                ? <>Plus que <span className="font-semibold text-fg">{season.remaining} km</span> pour « {season.next.title} ».</>
                : 'Tous les paliers débloqués'}
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
                        <span className={`text-sm font-semibold ${unlocked ? 'text-fg' : 'text-fg-soft'}`}>{t.title}</span>
                        <span className="text-[11px] font-semibold tabular-nums text-fg-faint">{t.km} km</span>
                      </div>
                      <div className="truncate text-[12px] text-fg-muted">{t.reward}</div>
                    </div>
                    {isNext && <span className="shrink-0 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">À venir</span>}
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
                      <span className="text-[11px] font-semibold uppercase text-brand-600">{a.day.slice(0, 3)}</span>
                      <span className="text-lg font-semibold leading-none text-fg">{a.time.slice(0, 2)}</span>
                      <span className="text-[11px] text-fg-faint">{a.time.slice(2)}</span>
                    </div>
                    <div className="min-w-0 flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-tight text-fg">{a.title}</h3>
                        <span className="mt-0.5 shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">{d.relative}</span>
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
                        {a.tag && <span className="ml-1 font-semibold text-brand-600">{a.tag}</span>}
                      </div>
                    </div>
                    <Icon name="chevronRight" className="mr-3 h-5 w-5 shrink-0 self-center text-fg-faint" />
                  </button>

                  <div className="flex items-center justify-between px-4 pb-3">
                    <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrits`)} />
                    <button
                      onClick={() => toggleEventKudos(a.id)}
                      aria-pressed={k.liked}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                        k.liked ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-2 text-fg-muted'
                      }`}
                    >
                      <Icon name="thumbsUp" className="h-4 w-4" filled={k.liked} />
                      <span className="tabular-nums">{k.count}</span>
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => toggleJoin(a.id)}
                      className={`w-full ${
                        isJoined ? 'btn btn-encre' : 'btn btn-impact'
                      }`}
                    >
                      <span>{isJoined ? 'Inscrit·e' : 'Je participe'}</span><span className="arr">→</span>
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
