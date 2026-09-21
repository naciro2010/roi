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

  /* L'édition : le bloc encre T–, le même qu'à l'accueil. */
  const OfficialRaceBanner = () => (
    <button onClick={openRace} className="surface-hero relative w-full p-4 text-left tap">
      <span className="tmark"><b>{EDITION.label}</b> {EDITION.lieu} · {EDITION.moisCourt}</span>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="shrink-0">
          <div className="display whitespace-nowrap text-[40px] leading-[.85] text-craie">T–{jours}</div>
          <div className="mt-1.5 font-mono text-[9.5px] uppercase tracking-label t-beton">Jours avant la ligne</div>
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

  /* Le binôme : la sortie à deux. */
  const BinomeBanner = () => (
    <button onClick={openRunMatch} className="flex w-full items-center gap-3 border border-line p-4 text-left tap">
      <span className="ico plein"><Icon name="activity" className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ Binôme · la sortie à deux</p>
        <p className="titre mt-0.5 text-[14px]">
          {topRun ? `Cours avec ${topRun.name.split(' ')[0]} cette semaine` : 'Trouve ton binôme de sortie'}
        </p>
        <p className="mt-0.5 text-[12px] leading-snug text-fg-muted">Même allure, une vraie raison de se parler. La sortie devient le rendez-vous.</p>
      </div>
      <span className="font-mono text-fg-faint" aria-hidden>→</span>
    </button>
  )

  const pct = Math.round((CHALLENGE.current / CHALLENGE.total) * 100)
  const km = CURRENT_USER.stats.km
  const season = seasonProgress(km)
  const week = CURRENT_USER.week
  const weekKm = week.km.reduce((t, k) => t + k, 0)
  const weekMax = Math.max(...week.km, 1)

  /* Cette semaine : gros chiffre fin, labels mono, sept barres encre. */
  const WeekSummary = () => (
    <section className="border border-line p-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-label text-fg-faint">Cette semaine</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="display text-[30px] leading-none text-fg tabular-nums">{weekKm.toFixed(1)}</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-mono text-fg-muted">km</span>
          </div>
        </div>
        <div className="flex gap-5 text-right">
          <div>
            <div className="display text-[18px] leading-none text-fg tabular-nums">{week.runs}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-label text-fg-faint">sorties</div>
          </div>
          <div>
            <div className="display text-[18px] leading-none text-fg tabular-nums">{week.time.slice(0, 4)}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-label text-fg-faint">temps</div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-stretch justify-between gap-1.5 border-t border-line pt-3" style={{ height: 78 }}>
        {week.km.map((k, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full transition-all ${k > 0 ? 'bg-fg' : 'bg-surface-2'}`}
                style={{ height: k > 0 ? `${22 + (k / weekMax) * 78}%` : '4px' }}
                title={k > 0 ? `${week.days[i]} · ${k.toFixed(1)} km` : 'Repos'}
              />
            </div>
            <span className="font-mono text-[9px] font-bold text-fg-faint">{week.days[i]}</span>
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
            { id: 'activites', label: 'Mes sorties' },
            { id: 'sorties', label: 'Sorties du réseau' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              className={`py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${view === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
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
          <BinomeBanner />
          {integrations.strava ? (
            <div className="flex items-center gap-2.5 border border-line px-3.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono text-fg">
              <span className="h-1.5 w-1.5 bg-brand-500" /> Tes sorties arrivent depuis Strava
            </div>
          ) : (
            <button onClick={openIntegrations} className="flex w-full items-center gap-3 border border-line p-3 text-left tap">
              <ServiceLogo service={serviceById('strava')} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-fg">Importer tes sorties</div>
                <div className="truncate text-xs text-fg-faint">Depuis Strava, sans rien saisir</div>
              </div>
              <span className="font-mono text-fg-faint" aria-hidden>→</span>
            </button>
          )}

          <button onClick={() => showToast('Bientôt : noter une sortie à la main')} className="flex w-full items-center gap-3 border border-dashed border-line-strong px-3 py-3 text-left tap hover:bg-surface-2">
            <span className="ico"><Icon name="activity" className="h-4 w-4" /></span>
            <div>
              <div className="text-sm font-medium text-fg">Noter une sortie</div>
              <div className="text-xs text-fg-faint">Avec qui as-tu couru ? Ta sortie devient une rencontre</div>
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
          <BinomeBanner />

          {/* Kilomètres investis ce mois + qui court le plus avec les autres */}
          <section className="surface-hero">
            <div className="flex items-center gap-4 p-5">
              <ProgressRing value={pct} size={84} stroke={8} color="#FF4400" track="rgba(239,235,226,0.16)">
                <div className="display text-[22px] leading-none text-craie">{pct}%</div>
              </ProgressRing>
              <div className="min-w-0 flex-1">
                <span className="tmark"><b>T+</b> / {CHALLENGE.title}</span>
                <div className="titre mt-1.5 text-[16px] text-craie">{CHALLENGE.subtitle}</div>
                <div className="mt-1 text-[12.5px] t-muted">
                  {CHALLENGE.current} km investis · plus que {CHALLENGE.total - CHALLENGE.current} km en {CHALLENGE.daysLeft} jours
                </div>
              </div>
            </div>

            <div className="border-t border-line-craie px-5 py-4">
              <div className="mb-2 font-mono text-[9.5px] uppercase tracking-label t-beton">Qui court le plus avec les autres</div>
              <div className="border-t border-line-craie">
                {LEADERBOARD.map((p, i) => (
                  <div key={p.name} className={`flex items-center gap-3 border-b border-line-craie px-1 py-2 ${p.me ? 'bg-craie/10' : ''}`}>
                    <span className={`w-6 font-mono text-[11px] font-bold tabular-nums ${i < 3 ? 'text-brand-500' : 't-beton'}`}>0{i + 1}</span>
                    <Avatar name={p.name} size="xs" />
                    <span className={`flex-1 truncate text-sm ${p.me ? 'font-medium text-craie' : 't-muted'}`}>
                      {p.name} {p.me && <span className="font-mono text-[9.5px] uppercase tracking-mono text-brand-500">· toi</span>}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-craie tabular-nums">{p.km} km</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Kilomètres investis — les km courus avec quelqu'un ouvrent des rencontres */}
          <section className="border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="tmark">{SEASON.label}</h2>
                <div className="mt-1 text-[12px] text-fg-muted">Les kilomètres courus avec quelqu'un ouvrent des rencontres.</div>
              </div>
              <span className="tag on shrink-0">Palier {season.level}</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-brand-500" />
              <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-fg">{km} km</span>
            </div>
            <p className="mt-1.5 text-[12px] text-fg-muted">
              {season.next
                ? <>Plus que <b className="font-medium text-fg">{season.remaining} km</b> avec quelqu'un pour « {season.next.title} ».</>
                : `Tous les paliers sont ouverts · fin dans ${SEASON.endsIn}`}
            </p>

            <div className="mt-4 border-t border-line">
              {TIERS.map((t) => {
                const unlocked = km >= t.km
                const isNext = season.next?.km === t.km
                return (
                  <div key={t.km} className={`flex items-center gap-3 border-b border-line py-2.5 ${isNext ? 'bg-surface-2 px-2' : ''}`}>
                    <span className={`ico ${unlocked ? 'plein' : ''}`}>
                      <Icon name={unlocked ? 'checkCircle' : 'lock'} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${unlocked ? 'text-fg' : 'text-fg-soft'}`}>{t.title}</span>
                        <span className="font-mono text-[9.5px] font-bold tabular-nums text-fg-faint">{t.km} KM</span>
                      </div>
                      <div className="truncate text-[12px] text-fg-muted">{unlocked ? 'Ouvert · ' : 'Ouvre · '}{t.reward}</div>
                    </div>
                    {isNext && <span className="tag impact shrink-0">Prochain</span>}
                  </div>
                )
              })}
            </div>
          </section>

          <SectionTitle t="T+">LES SORTIES DU RÉSEAU</SectionTitle>

          <div className="space-y-3">
            {EVENTS.map((a) => {
              const k = eventKudos[a.id]
              const isJoined = joined[a.id]
              const d = formatEventDate(a.date)
              return (
                <article key={a.id} className="border border-line">
                  <button onClick={() => openEvent(a.id)} className="flex w-full items-stretch text-left tap">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-line bg-surface-2 py-3 text-center">
                      <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">{a.day.slice(0, 3)}</span>
                      <span className="display mt-0.5 text-[22px] leading-none text-fg">{a.time.slice(0, 2)}</span>
                      <span className="font-mono text-[9.5px] text-fg-faint">{a.time.slice(2)}</span>
                    </div>
                    <div className="min-w-0 flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="titre text-[14px] text-fg">{a.title}</h3>
                        <span className="tag shrink-0">{d.relative}</span>
                      </div>
                      <div className="mt-1.5 font-mono text-[9.5px] uppercase tracking-mono text-fg-muted">
                        {a.distance} · {a.pace} · {a.level}
                      </div>
                      <div className="mt-1 text-[12.5px] text-fg-muted">
                        {a.place}
                        {a.tag && <span className="ml-1 font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">{a.tag}</span>}
                      </div>
                      <div className="mt-0.5 text-[12px] text-fg-faint">Hôte · {a.organizer}</div>
                    </div>
                  </button>

                  <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                    <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrit·es`)} />
                    <button
                      onClick={() => toggleEventKudos(a.id)}
                      aria-pressed={k.liked}
                      aria-label="Bien couru"
                      className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-mono tap ${k.liked ? 'text-brand-500' : 'text-fg-muted'}`}
                    >
                      <Icon name="thumbsUp" className="h-4 w-4" filled={k.liked} />
                      <span className="tabular-nums">{k.count}</span>
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <button onClick={() => toggleJoin(a.id)} className={`w-full justify-between ${isJoined ? 'btn btn-encre' : 'btn btn-impact'}`}>
                      <span>{isJoined ? "Inscrit·e · on t'attend au café" : "J'y serai"}</span><span className="arr">→</span>
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
