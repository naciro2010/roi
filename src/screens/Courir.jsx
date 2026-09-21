import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { SectionTitle, ProgressBar, Action } from '../components/primitives'
import { ActivityCard } from '../components/ActivityCard'
import ServiceLogo from '../components/ServiceLogo'
import { ACTIVITIES } from '../data/activities'
import { EVENTS, LEADERBOARD } from '../data/events'
import { serviceById } from '../data/integrations'
import { formatEventDate } from '../lib/dates'
import { CURRENT_USER } from '../data/user'
import { TIERS, seasonProgress } from '../data/levels'

export default function Courir() {
  const {
    actKudos, toggleActKudos, openActivity, openMember, showToast,
    eventKudos, toggleEventKudos, joined, toggleJoin, openEvent,
    integrations, openIntegrations, openRunMatch, runMatches,
  } = useApp()
  const [view, setView] = useState('activites')
  const [paliersOuverts, setPaliersOuverts] = useState(false)
  const topRun = runMatches?.[0]

  const km = CURRENT_USER.stats.km
  const season = seasonProgress(km)
  const week = CURRENT_USER.week
  const weekKm = week.km.reduce((t, k) => t + k, 0)
  const weekMax = Math.max(...week.km, 1)

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-[28px]">Courir</h1>
        <p className="aide mt-1">
          Les kilomètres que tu cours avec quelqu’un comptent double : c’est là que les vraies conversations se passent.
        </p>

        <div className="mt-4 grid grid-cols-2 border border-line">
          {[
            { id: 'activites', label: 'Mes sorties' },
            { id: 'sorties', label: 'Courir à plusieurs' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              aria-current={view === s.id ? 'page' : undefined}
              className={`py-3 font-mono text-[11px] font-bold uppercase tracking-mono transition tap ${view === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Mes sorties ---- */}
      {view === 'activites' ? (
        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {/* Cette semaine : un chiffre, sept barres, rien d'autre. */}
          <section>
            <SectionTitle help="Ce que tu as couru ces sept derniers jours.">Cette semaine</SectionTitle>
            <div className="border border-line p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="display text-[34px] leading-none text-fg tabular-nums">{weekKm.toFixed(1)}</span>
                    <span className="text-[14px] font-medium text-fg-muted">km</span>
                  </div>
                  <div className="mt-1 text-[12.5px] text-fg-muted">
                    {week.runs} sortie{week.runs > 1 ? 's' : ''} · {week.time.slice(0, 4)} de course
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-stretch justify-between gap-1.5 border-t border-line pt-4" style={{ height: 78 }}>
                {week.km.map((k, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full transition-all ${k > 0 ? 'bg-fg' : 'bg-surface-2'}`}
                        style={{ height: k > 0 ? `${22 + (k / weekMax) * 78}%` : '4px' }}
                        title={k > 0 ? `${week.days[i]} · ${k.toFixed(1)} km` : 'Repos'}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-fg-faint">{week.days[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Deux choses à faire ici, pas dix. */}
          <section className="space-y-2">
            <Action
              icon="users" plein
              label={topRun ? `Cours avec ${topRun.name.split(' ')[0]}` : 'Trouve quelqu’un avec qui courir'}
              detail="Même allure, une vraie raison de se parler. La sortie devient le rendez-vous."
              onClick={openRunMatch}
            />
            {integrations.strava ? (
              <div className="lien-bloc">
                <span className="ico"><Icon name="check" className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium text-fg">Strava est connecté</span>
                  <span className="mt-0.5 block text-[13px] text-fg-muted">Tes sorties arrivent toutes seules.</span>
                </span>
              </div>
            ) : (
              <button onClick={openIntegrations} className="lien-bloc tap hover:bg-surface-2">
                <ServiceLogo service={serviceById('strava')} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium text-fg">Connecte Strava ou ta montre</span>
                  <span className="mt-0.5 block text-[13px] text-fg-muted">Tes sorties arrivent seules, tu n’as rien à saisir.</span>
                </span>
                <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
              </button>
            )}
            <button onClick={() => showToast('Bientôt : noter une sortie à la main')} className="lien-bloc border-dashed border-line-strong tap hover:bg-surface-2">
              <span className="ico"><Icon name="plus" className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium text-fg">Ajouter une sortie à la main</span>
                <span className="mt-0.5 block text-[13px] text-fg-muted">Avec qui as-tu couru ?</span>
              </span>
            </button>
          </section>

          <section>
            <SectionTitle help="Tes dernières sorties, et qui tu as croisé sur chacune.">Ton historique</SectionTitle>
            <div className="space-y-3">
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
          </section>
        </div>
      ) : (
        /* ---- Courir à plusieurs ---- */
        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          <section>
            <SectionTitle help="Des sorties ouvertes à tous, à allure de conversation, avec un café à l’arrivée.">
              Les prochaines sorties
            </SectionTitle>
            <div className="space-y-3">
              {EVENTS.map((a) => {
                const k = eventKudos[a.id]
                const isJoined = joined[a.id]
                const d = formatEventDate(a.date)
                return (
                  <article key={a.id} className="border border-line">
                    <button onClick={() => openEvent(a.id)} className="flex w-full items-stretch text-left tap">
                      <div className="flex w-[74px] shrink-0 flex-col items-center justify-center border-r border-line bg-surface-2 py-3 text-center">
                        <span className="font-mono text-[10.5px] font-bold uppercase tracking-mono text-brand-500">{a.day.slice(0, 3)}</span>
                        <span className="display mt-0.5 text-[22px] leading-none text-fg">{a.time.slice(0, 2)}</span>
                        <span className="font-mono text-[10.5px] text-fg-faint">{a.time.slice(2)}</span>
                      </div>
                      <div className="min-w-0 flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[15px] font-medium leading-snug text-fg">{a.title}</h3>
                          <span className="tag shrink-0">{d.relative}</span>
                        </div>
                        <div className="mt-1.5 text-[13px] text-fg-muted">
                          {a.distance} · {a.pace} · {a.level}
                        </div>
                        <div className="mt-0.5 text-[13px] text-fg-muted">{a.place}</div>
                        <div className="mt-0.5 text-[12.5px] text-fg-faint">Organisée par {a.organizer}</div>
                      </div>
                    </button>

                    <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                      <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrit·es`)} />
                      <button
                        onClick={() => toggleEventKudos(a.id)}
                        aria-pressed={k.liked}
                        aria-label="Bien couru"
                        className={`flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-mono tap ${k.liked ? 'text-brand-500' : 'text-fg-muted'}`}
                      >
                        <Icon name="thumbsUp" className="h-4 w-4" filled={k.liked} />
                        <span className="tabular-nums">{k.count}</span>
                      </button>
                    </div>

                    <div className="px-4 pb-4">
                      <button onClick={() => toggleJoin(a.id)} className={`w-full justify-between ${isJoined ? 'btn btn-encre' : 'btn btn-impact'}`}>
                        <span>{isJoined ? 'Tu y es inscrit·e' : 'J’y serai'}</span><span className="arr">→</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Les paliers : une ligne visible, le détail au clic. La règle
              ci-dessous tient en une phrase ; l'échelle complète n'a pas
              besoin d'être à l'écran en permanence. */}
          <section>
            <SectionTitle help="Plus tu cours avec d’autres, plus on te propose de rencontres. C’est tout le mécanisme.">
              Tes kilomètres partagés
            </SectionTitle>
            <div className="border border-line p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="display text-[30px] leading-none tabular-nums">{km} <small className="font-mono text-[12px] tracking-mono">km</small></span>
                <span className="text-[13px] text-fg-muted">courus avec quelqu’un</span>
              </div>
              <div className="mt-3"><ProgressBar value={season.pct} total={100} className="bg-surface-2" barClassName="bg-brand-500" /></div>
              <p className="mt-2 text-[13.5px] leading-snug text-fg-soft">
                {season.next
                  ? <>Encore <b className="font-medium text-fg">{season.remaining} km</b> avec quelqu’un et tu débloques : {season.next.reward.toLowerCase()}.</>
                  : 'Tu as atteint le dernier palier.'}
              </p>
              <button
                onClick={() => setPaliersOuverts((o) => !o)}
                aria-expanded={paliersOuverts}
                className="mt-3 font-mono text-[11px] font-bold uppercase tracking-mono text-brand-500 tap"
              >
                {paliersOuverts ? 'Masquer les paliers' : 'Voir tous les paliers'} <span aria-hidden>{paliersOuverts ? '↑' : '↓'}</span>
              </button>
              {paliersOuverts && (
                <div className="mt-3 border-t border-line">
                  {TIERS.map((t) => {
                    const unlocked = km >= t.km
                    return (
                      <div key={t.km} className="flex items-center gap-3 border-b border-line py-3">
                        <span className={`ico ${unlocked ? 'plein' : ''}`}>
                          <Icon name={unlocked ? 'checkCircle' : 'lock'} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-medium text-fg">{t.km} km — {t.title}</div>
                          <div className="mt-0.5 text-[13px] leading-snug text-fg-muted">{t.reward}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionTitle help="Celles et ceux qui courent le plus souvent accompagnés, ce mois-ci.">
              Qui court avec les autres
            </SectionTitle>
            <div className="border border-line px-4">
              {LEADERBOARD.slice(0, 5).map((p, i) => (
                <div key={p.name} className={`flex items-center gap-3 border-b border-line py-3 last:border-b-0 ${p.me ? 'font-medium' : ''}`}>
                  <span className={`w-5 font-mono text-[12px] font-bold tabular-nums ${i < 3 ? 'text-brand-500' : 'text-fg-faint'}`}>{i + 1}</span>
                  <Avatar name={p.name} size="xs" />
                  <span className="flex-1 truncate text-[14px] text-fg">
                    {p.name}{p.me && <span className="ml-1.5 text-[12.5px] text-brand-500">· toi</span>}
                  </span>
                  <span className="font-mono text-[13px] font-bold tabular-nums text-fg">{p.km} km</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
