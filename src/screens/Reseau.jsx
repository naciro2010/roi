import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Badge, MatchRing, CompatBars } from '../components/primitives'
import { MEMBERS, FILTERS, personFor } from '../data/network'
import { FREE_MATCH_LIMIT } from '../data/plans'
import { CURRENT_USER } from '../data/user'
import { bonusMatches, categoryTier, isCategoryLocked } from '../data/levels'
import { ARCHETYPES } from '../data/profiling'

const ACTION_BY_ARCHE = {
  investor: 'Proposer une rencontre',
  developer: 'Proposer une rencontre',
  mentor: 'Demander un conseil',
  founder: 'Proposer une sortie',
  operator: 'Proposer une rencontre',
}

export default function Reseau() {
  const {
    openMember, sentSuggestions, sendSuggestion, contacted, contactMember,
    connections, requests, acceptRequest, declineRequest,
    hasFeature, openPlans, showToast,
    rankedMatches, insights, track,
  } = useApp()
  const km = CURRENT_USER.stats.km
  const matchLimit = FREE_MATCH_LIMIT + bonusMatches(km)
  const unlimitedMatches = hasFeature('unlimitedMatches')
  const canSeeWhoWants = hasFeature('whoWantsToMeet')
  const visibleSuggestions = unlimitedMatches ? rankedMatches : rankedMatches.slice(0, matchLimit)
  const hiddenMatches = rankedMatches.length - visibleSuggestions.length
  const [netView, setNetView] = useState('suggestions')
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')

  function pickFilter(f) {
    if (isCategoryLocked(km, f)) {
      const tier = categoryTier(f)
      showToast(`Cours ${tier.km - km} km de plus avec quelqu'un pour ouvrir « ${f} »`)
      return
    }
    if (f !== 'Tous') track({ type: 'filter', category: f })
    setFilter(f)
  }

  const connectionNames = connections.map((c) => c.name)
  const sentNames = Object.keys(contacted).filter((n) => contacted[n] && !connectionNames.includes(n))

  const list = MEMBERS.filter((m) => {
    const okFilter = filter === 'Tous' || m.category === filter
    const q = query.trim().toLowerCase()
    const okQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.need.toLowerCase().includes(q) ||
      personFor(m.name).title.toLowerCase().includes(q)
    return okFilter && okQuery
  })

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <span className="tmark"><b>T+</b> / L'ANNUAIRE</span>
        <h1 className="mt-2 text-[30px]">Qui court <span className="creuse">cette année.</span></h1>
        <p className="mt-1 text-sm text-fg-muted">Qui court cette année : recruter, lever, vendre, s'associer.</p>

        <div className="mt-4 flex divide-x divide-line border border-line">
          {[
            { id: 'suggestions', label: 'Pour toi' },
            { id: 'annuaire', label: 'Annuaire' },
            { id: 'contacts', label: 'Contacts' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setNetView(s.id)}
              className={`flex-1 rounded-xl py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${
                netView === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {netView === 'suggestions' && (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {/* Bandeau « Pour toi » — trois rencontres proposées par semaine, expliquées */}
          <div className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-white shadow-float">
            <div className="absolute inset-0 bg-aurora" />
            <div className="relative flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                <Icon name={insights.learning ? insights.icon : 'wand'} className="h-5 w-5" filled />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">Pour toi · trois rencontres par semaine</p>
                </div>
                <p className="mt-0.5 text-[14px] font-semibold leading-snug">{insights.headline}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-white/65">On a remonté les profils qui répondent à ce que tu cherches et à ce que tu regardes.</p>
                {insights.topTopics?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {insights.topTopics.map((t) => (
                      <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/85">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {visibleSuggestions.map((m) => {
            const sent = sentSuggestions[m.name]
            const arche = ARCHETYPES[m.archetype]
            const action = ACTION_BY_ARCHE[m.archetype] || 'Proposer une rencontre'
            return (
              <article key={m.name} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar name={m.name} size="lg" onClick={() => openMember(m.name)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-fg">{m.name}</div>
                    <div className="truncate text-sm text-fg-muted">{personFor(m.name).title}</div>
                  </div>
                  <MatchRing value={m.score} size={48} />
                </div>

                <div className="px-4">
                  <Badge tone={arche.tone}>{arche.short}</Badge>
                </div>

                <div className="mx-4 mt-3 space-y-1.5 rounded-2xl bg-surface-soft p-3">
                  {m.reasons.map((r) => (
                    <div key={r.text} className="flex items-center gap-2 text-[13px] text-fg-soft">
                      <Icon name={r.icon} className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                      {r.text}
                    </div>
                  ))}
                  <CompatBars parts={m.parts} className="pt-1.5" />
                </div>

                <div className="flex gap-2 p-4">
                  <button
                    onClick={() => sendSuggestion(m.name, m.name)}
                    className={`flex-1 rounded-2xl py-3 text-sm font-semibold text-white tap ${
                      sent ? 'bg-success' : 'btn btn-impact shadow-brand hover:to-brand-700'
                    }`}
                  >
                    {sent ? 'Rencontre proposée' : action}
                  </button>
                  <button
                    onClick={() => openMember(m.name)}
                    className="rounded-2xl border border-line-strong px-4 py-3 text-sm font-semibold text-fg-soft tap"
                  >
                    Le dossard
                  </button>
                </div>
              </article>
            )
          })}

          {bonusMatches(km) > 0 && (
            <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold text-success-dark">
              <Icon name="trophy" className="h-3.5 w-3.5" /> +{bonusMatches(km)} rencontre{bonusMatches(km) > 1 ? 's' : ''} par semaine, ouverte{bonusMatches(km) > 1 ? 's' : ''} par tes kilomètres
            </p>
          )}

          {!unlimitedMatches && hiddenMatches > 0 && (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/15 text-white">
                  <Icon name="lock" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{hiddenMatches} autre{hiddenMatches > 1 ? 's' : ''} rencontre{hiddenMatches > 1 ? 's' : ''} pour toi cette semaine</div>
                  <p className="text-[12px] text-white/60">Trois rencontres proposées par semaine avec le Dossard. En Premium, sans limite — depuis ton espace.</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-fg">Premium</span>
              </div>
            </button>
          )}

          <p className="pt-1 text-center text-xs text-fg-faint">Trois nouvelles propositions chaque lundi matin</p>
        </div>
      )}

      {netView === 'annuaire' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-5 pt-3">
            <div className="flex items-center gap-2 rounded-2xl border border-line-strong bg-surface px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-200">
              <Icon name="search" className="h-4 w-4 text-fg-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Un nom, une fonction, ce qu'il cherche…"
                className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-fg-faint tap" aria-label="Effacer">
                  <Icon name="x" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
            {FILTERS.map((f) => {
              const locked = isCategoryLocked(km, f)
              return (
                <button
                  key={f}
                  onClick={() => pickFilter(f)}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition tap ${
                    filter === f ? 'btn btn-impact' : locked ? 'bg-surface-2 text-fg-faint' : 'bg-surface-2 text-fg-soft'
                  }`}
                >
                  {locked && <Icon name="lock" className="h-3 w-3" />}
                  {f}
                </button>
              )
            })}
          </div>

          <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-2">
            <p className="text-xs font-medium text-fg-faint">{list.length} dossard{list.length > 1 ? 's' : ''}</p>
            {list.map((m) => (
              <article key={m.id} className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <button onClick={() => openMember(m.name)} className="flex w-full items-center gap-3 text-left tap">
                  <Avatar name={m.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-fg">{m.name}</div>
                    <div className="truncate text-sm text-fg-muted">{personFor(m.name).title}</div>
                  </div>
                  <Icon name="chevronRight" className="h-5 w-5 text-fg-faint" />
                </button>
                <p className="mt-3 text-sm font-semibold text-brand-700">{m.need}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-fg-faint">
                  <Icon name="mapPin" className="h-3.5 w-3.5" />
                  {m.proximity}
                </div>
                <button
                  onClick={() => contactMember(m.name)}
                  className={`mt-3 w-full rounded-full py-3 text-sm font-semibold tap ${
                    contacted[m.name] ? 'bg-success text-white' : 'border border-brand-300 text-brand-700 hover:bg-brand-light'
                  }`}
                >
                  {contacted[m.name] ? 'Rencontre proposée' : 'Proposer une rencontre'}
                </button>
              </article>
            ))}
            {list.length === 0 && (
              <div className="grid place-items-center py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-fg-faint">
                  <Icon name="search" className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold text-fg-soft">Personne ne répond à ça pour l'instant</p>
                <p className="text-xs text-fg-faint">Essaie un autre verbe, ou un nom.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {netView === 'contacts' && (
        <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {/* Qui veut te rencontrer (Premium) */}
          {canSeeWhoWants ? (
            <section className="rounded-3xl border border-brand-200 bg-brand-light/50 p-3.5">
              <div className="flex items-center gap-1.5">
                <Icon name="sparkles" className="h-4 w-4 text-brand-600" filled />
                <p className="text-[13px] font-semibold text-fg">2 personnes veulent te rencontrer</p>
              </div>
              <div className="mt-3 space-y-2">
                {['Inès Roy', 'Hugo Bernard'].map((name) => (
                  <button
                    key={name}
                    onClick={() => openMember(name)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-surface p-2.5 text-left shadow-soft tap"
                  >
                    <Avatar name={name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-fg">{name}</div>
                      <div className="truncate text-[12px] text-fg-muted">{personFor(name).title}</div>
                    </div>
                    <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {['Inès Roy', 'Hugo Bernard'].map((name) => (
                    <span key={name} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-2 ring-black/70 blur-[3px]">
                      <Icon name="user" className="h-4 w-4" />
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">2 personnes veulent te rencontrer</div>
                  <p className="text-[12px] text-white/60">Voir qui veut te rencontrer : en Premium.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <Icon name="lock" className="h-4 w-4" />
                </span>
              </div>
            </button>
          )}

          {requests.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                Veulent te rencontrer
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">{requests.length}</span>
              </div>
              <div className="space-y-2">
                {requests.map((r) => (
                  <article key={r.name} className="rounded-3xl border border-line bg-surface p-3.5 shadow-soft">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="md" onClick={() => openMember(r.name)} />
                      <button onClick={() => openMember(r.name)} className="min-w-0 flex-1 text-left">
                        <div className="truncate font-semibold text-fg">{r.name}</div>
                        <div className="truncate text-[12px] text-fg-muted">{r.context}</div>
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => acceptRequest(r.name)} className="flex-1 rounded-full btn btn-impact py-2.5 text-sm font-semibold text-white shadow-brand tap">Accepter</button>
                      <button onClick={() => declineRequest(r.name)} className="rounded-2xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-fg-soft tap">Décliner</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">Tes contacts · {connections.length}</div>
            <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              {connections.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => openMember(c.name)}
                  className={`flex w-full items-center gap-3 px-3.5 py-3 text-left tap hover:bg-black/[0.04] ${i > 0 ? 'border-t border-line' : ''}`}
                >
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-fg">{c.name}</div>
                    <div className="truncate text-[12px] text-fg-faint">{c.context}</div>
                  </div>
                  <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
                </button>
              ))}
            </div>
          </section>

          {sentNames.length > 0 && (
            <section>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">En attente · {sentNames.length}</div>
              <div className="space-y-2">
                {sentNames.map((name) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-fg">{name}</button>
                    <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-muted">En attente</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
