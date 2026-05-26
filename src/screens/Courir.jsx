import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { ProgressRing, SectionTitle } from '../components/primitives'
import { ActivityCard } from '../components/ActivityCard'
import ServiceLogo from '../components/ServiceLogo'
import { ACTIVITIES } from '../data/activities'
import { EVENTS, CHALLENGE, LEADERBOARD } from '../data/events'
import { serviceById } from '../data/integrations'

export default function Courir() {
  const {
    actKudos, toggleActKudos, openActivity, openMember, showToast,
    eventKudos, toggleEventKudos, joined, toggleJoin, openEvent,
    integrations, openIntegrations,
  } = useApp()
  const [view, setView] = useState('activites')
  const pct = Math.round((CHALLENGE.current / CHALLENGE.total) * 100)

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-2xl font-extrabold text-ink-900">Courir</h1>
        <p className="mt-0.5 text-sm text-ink-500">Cours, rencontre, avance.</p>

        <div className="mt-4 flex gap-1 rounded-2xl bg-ink-100 p-1">
          {[
            { id: 'activites', label: 'Activités' },
            { id: 'sorties', label: 'Sorties' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition tap ${
                view === s.id ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'activites' ? (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-3">
          {integrations.strava ? (
            <div className="flex items-center gap-2 rounded-2xl bg-[#EAEEEB] px-3.5 py-2.5 text-[12px] font-semibold text-[#48584E]">
              <Icon name="check" className="h-4 w-4 shrink-0" /> Tes courses sont synchronisées via Strava
            </div>
          ) : (
            <button
              onClick={openIntegrations}
              className="flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 text-left shadow-soft tap"
            >
              <ServiceLogo service={serviceById('strava')} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-ink-900">Connecter Strava</div>
                <div className="truncate text-xs text-ink-400">Importe tes courses automatiquement</div>
              </div>
              <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-ink-300" />
            </button>
          )}

          <button
            onClick={() => showToast('Enregistrement bientôt disponible 🏃')}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-ink-300 px-3 py-3 text-left tap hover:bg-ink-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="activity" className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-900">Enregistrer une activité</div>
              <div className="text-xs text-ink-400">Ta sortie devient un post partageable</div>
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
          {/* Défi + classement */}
          <section className="overflow-hidden rounded-[28px] bg-ink-950 text-white shadow-float">
            <div className="relative overflow-hidden p-5">
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative flex items-center gap-4">
                <ProgressRing value={pct} size={84} stroke={9} color="#AEB8D6" track="rgba(255,255,255,0.14)">
                  <div className="text-xl font-extrabold leading-none">{pct}%</div>
                </ProgressRing>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Icon name="flame" className="h-4 w-4 text-brand-400" filled /> {CHALLENGE.title}
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
                    <span className={`w-5 text-center text-sm font-bold ${i < 3 ? 'text-brand-400' : 'text-white/40'}`}>{i + 1}</span>
                    <Avatar name={p.name} size="xs" />
                    <span className={`flex-1 truncate text-sm ${p.me ? 'font-bold text-white' : 'text-white/80'}`}>
                      {p.name} {p.me && <span className="text-brand-300">· toi</span>}
                    </span>
                    <span className="text-sm font-bold text-white/90">{p.km} km</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <SectionTitle>Sorties à venir</SectionTitle>

          <div className="space-y-3">
            {EVENTS.map((a) => {
              const k = eventKudos[a.id]
              const isJoined = joined[a.id]
              return (
                <article key={a.id} className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
                  <button onClick={() => openEvent(a.id)} className="flex w-full items-stretch text-left tap">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-ink-50 py-3 text-center">
                      <span className="text-[11px] font-bold uppercase text-brand-600">{a.day.slice(0, 3)}</span>
                      <span className="text-lg font-extrabold leading-none text-ink-900">{a.time.slice(0, 2)}</span>
                      <span className="text-[11px] text-ink-400">{a.time.slice(2)}</span>
                    </div>
                    <div className="min-w-0 flex-1 p-4">
                      <h3 className="font-bold leading-tight text-ink-900">{a.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-ink-500">
                        <span className="inline-flex items-center gap-1"><Icon name="route" className="h-3.5 w-3.5" /> {a.distance}</span>
                        <span className="text-ink-300">·</span>
                        <span>{a.pace}</span>
                        <span className="text-ink-300">·</span>
                        <span>{a.level}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-400">
                        <Icon name="mapPin" className="h-3.5 w-3.5" /> {a.place}
                        {a.tag && <span className="ml-1 font-bold text-brand-600">{a.tag}</span>}
                      </div>
                    </div>
                    <Icon name="chevronRight" className="mr-3 h-5 w-5 shrink-0 self-center text-ink-300" />
                  </button>

                  <div className="flex items-center justify-between px-4 pb-3">
                    <AvatarStack names={a.attendees} total={a.participants} onMore={() => showToast(`${a.participants} inscrits`)} />
                    <button
                      onClick={() => toggleEventKudos(a.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tap ${
                        k.liked ? 'bg-[#EFE5E6] text-[#8C5560]' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      <Icon name="heart" className="h-4 w-4" filled={k.liked} />
                      {k.count}
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => toggleJoin(a.id)}
                      className={`w-full rounded-2xl py-2.5 text-sm font-bold tap ${
                        isJoined ? 'bg-[#4E6B59] text-white' : 'bg-ink-900 text-white hover:bg-ink-800'
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
