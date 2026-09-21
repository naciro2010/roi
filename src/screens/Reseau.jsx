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

/* Une personne de l'annuaire : le verso de son dossard, et un bouton. */
function Fiche({ name, category, need, proximity, contacted, onOpen, onContact }) {
  return (
    <article className="border border-line p-4">
      <button onClick={onOpen} className="flex w-full items-center gap-3 text-left tap">
        <Avatar name={name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-fg">{name}</div>
          <div className="truncate text-[12.5px] text-fg-muted">{personFor(name).title}</div>
        </div>
        {category && <Badge>{category}</Badge>}
      </button>
      <p className="mt-3 border-t border-line pt-2.5 text-[13.5px] font-medium text-fg">{need}</p>
      <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{proximity}</div>
      <button onClick={onContact} disabled={contacted} className={`btn btn-sm mt-3 w-full justify-between ${contacted ? 'btn-encre' : 'btn-ghost'}`}>
        <span>{contacted ? 'Rencontre proposée' : 'Proposer une rencontre'}</span>{!contacted && <span className="arr">→</span>}
      </button>
    </article>
  )
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
        <p className="mt-1 text-sm text-fg-muted">Nom, fonction, entreprise — le verso de chaque dossard. Filtre par ce que tu cherches : recruter, lever, vendre, s'associer.</p>

        <div className="mt-4 flex divide-x divide-line border border-line">
          {[
            { id: 'suggestions', label: 'Pour toi' },
            { id: 'annuaire', label: 'Annuaire' },
            { id: 'contacts', label: 'Contacts' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setNetView(s.id)}
              className={`flex-1 py-2.5 font-mono text-[10px] font-bold uppercase tracking-mono transition tap ${netView === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {netView === 'suggestions' && (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {/* Bandeau « Pour toi » — trois rencontres proposées par semaine, expliquées */}
          <div className="surface-hero p-4">
            <span className="tmark"><b>T+</b> / POUR TOI — TROIS RENCONTRES PAR SEMAINE</span>
            <div className="mt-3 flex items-start gap-3">
              <span className="ico plein"><Icon name={insights.learning ? insights.icon : 'wand'} className="h-4 w-4" filled /></span>
              <div className="min-w-0 flex-1">
                <p className="titre text-[14px] text-craie">{insights.headline}</p>
                <p className="mt-1 text-[12px] leading-snug t-muted">On a remonté celles et ceux qui répondent à ce que tu cherches et à ce que tu regardes.</p>
                {insights.topTopics?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {insights.topTopics.map((t) => (
                      <span key={t} className="tag">#{t}</span>
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
              <article key={m.name} className="border border-line">
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar name={m.name} size="lg" onClick={() => openMember(m.name)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-fg">{m.name}</div>
                    <div className="truncate text-[12.5px] text-fg-muted">{personFor(m.name).title}</div>
                    <div className="mt-1.5"><Badge>{arche.short}</Badge></div>
                  </div>
                  <MatchRing value={m.score} size={48} />
                </div>

                {/* Pourquoi vous, pourquoi maintenant */}
                <div className="mx-4 space-y-1.5 border-t border-line pt-3">
                  {m.reasons.map((r) => (
                    <div key={r.text} className="flex items-center gap-2 text-[13px] text-fg-soft">
                      <span className="h-1.5 w-1.5 shrink-0 bg-brand-500" />
                      {r.text}
                    </div>
                  ))}
                  <CompatBars parts={m.parts} className="pt-2" />
                </div>

                <div className="flex gap-2 p-4">
                  <button onClick={() => sendSuggestion(m.name, m.name)} disabled={sent} className={`btn btn-sm flex-1 justify-between ${sent ? 'btn-encre' : 'btn-impact'}`}>
                    <span>{sent ? 'Rencontre proposée' : action}</span>{!sent && <span className="arr">→</span>}
                  </button>
                  <button onClick={() => openMember(m.name)} className="btn btn-sm btn-ghost">
                    <span>Le dossard</span>
                  </button>
                </div>
              </article>
            )
          })}

          {bonusMatches(km) > 0 && (
            <p className="text-center font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">
              <b className="text-brand-500">■</b> +{bonusMatches(km)} rencontre{bonusMatches(km) > 1 ? 's' : ''} par semaine, ouverte{bonusMatches(km) > 1 ? 's' : ''} par tes kilomètres
            </p>
          )}

          {!unlimitedMatches && hiddenMatches > 0 && (
            <button onClick={openPlans} className="surface-hero flex w-full items-center gap-3 p-4 text-left tap">
              <span className="ico plein"><Icon name="lock" className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="titre block text-[14px] text-craie">{hiddenMatches} autre{hiddenMatches > 1 ? 's' : ''} rencontre{hiddenMatches > 1 ? 's' : ''} pour toi cette semaine</span>
                <span className="mt-0.5 block text-[12px] t-muted">Trois propositions par semaine avec le Dossard. En Premium, sans limite — depuis ton espace.</span>
              </span>
              <span className="tag on shrink-0">Premium</span>
            </button>
          )}

          <p className="pt-1 text-center font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">Trois nouvelles propositions chaque lundi matin</p>
        </div>
      )}

      {netView === 'annuaire' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-5 pt-3">
            <div className="champ flex items-center gap-2">
              <Icon name="search" className="h-4 w-4 shrink-0 text-fg-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Un nom, une fonction, ce qu'il cherche…"
                className="input-ligne text-sm"
                style={{ padding: '8px 0' }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-fg-faint tap" aria-label="Effacer">
                  <Icon name="x" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtres par intention : Recrute · Lève · Vend · S'associe · Conseille */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar px-5 pb-1">
            {FILTERS.map((f) => {
              const locked = isCategoryLocked(km, f)
              return (
                <button key={f} onClick={() => pickFilter(f)} aria-pressed={filter === f} className={`tag shrink-0 tap ${filter === f ? 'on' : locked ? 'opacity-50' : ''}`}>
                  {locked && <Icon name="lock" className="h-3 w-3" />}
                  {f}
                </button>
              )
            })}
          </div>

          <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-2">
            <p className="font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">{list.length} dossard{list.length > 1 ? 's' : ''}</p>
            {list.map((m) => (
              <Fiche
                key={m.id} name={m.name} category={m.category} need={m.need} proximity={m.proximity}
                contacted={!!contacted[m.name]} onOpen={() => openMember(m.name)} onContact={() => contactMember(m.name)}
              />
            ))}
            {list.length === 0 && (
              <div className="grid place-items-center border border-dashed border-line-strong py-16 text-center">
                <span className="ico"><Icon name="search" className="h-5 w-5" /></span>
                <p className="mt-3 text-sm font-medium text-fg-soft">Personne ne répond à ça pour l'instant</p>
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
            <section className="border border-fg p-3.5">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ 2 personnes veulent te rencontrer</p>
              <div className="mt-2">
                {['Inès Roy', 'Hugo Bernard'].map((name) => (
                  <button key={name} onClick={() => openMember(name)} className="rangee tap">
                    <Avatar name={name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg">{name}</span>
                      <span className="block truncate text-[12px] text-fg-muted">{personFor(name).title}</span>
                    </span>
                    <span className="font-mono text-fg-faint" aria-hidden>→</span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <button onClick={openPlans} className="surface-hero flex w-full items-center gap-3 p-4 text-left tap">
              <span className="flex -space-x-2">
                {['Inès Roy', 'Hugo Bernard'].map((name) => (
                  <span key={name} className="grid h-9 w-9 place-items-center border border-craie/30 bg-craie/10 text-craie blur-[3px]">
                    <Icon name="user" className="h-4 w-4" />
                  </span>
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="titre block text-[14px] text-craie">2 personnes veulent te rencontrer</span>
                <span className="block text-[12px] t-muted">Voir qui veut te rencontrer : en Premium.</span>
              </span>
              <span className="ico plein"><Icon name="lock" className="h-4 w-4" /></span>
            </button>
          )}

          {requests.length > 0 && (
            <section>
              <h2 className="tmark"><b>{requests.length}</b> / VEULENT TE RENCONTRER</h2>
              <div className="mt-2 space-y-2">
                {requests.map((r) => (
                  <article key={r.name} className="border border-line p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="md" onClick={() => openMember(r.name)} />
                      <button onClick={() => openMember(r.name)} className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium text-fg">{r.name}</div>
                        <div className="truncate text-[12px] text-fg-muted">{r.context}</div>
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => acceptRequest(r.name)} className="btn btn-impact btn-sm flex-1 justify-between"><span>Dire oui</span><span className="arr">→</span></button>
                      <button onClick={() => declineRequest(r.name)} className="btn btn-ghost btn-sm"><span>Décliner</span></button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="tmark"><b>{connections.length}</b> / TES CONTACTS</h2>
            <div className="mt-2 border-b border-line">
              {connections.map((c) => (
                <button key={c.name} onClick={() => openMember(c.name)} className="rangee tap hover:bg-surface-2">
                  <Avatar name={c.name} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{c.name}</span>
                    <span className="block truncate text-[12px] text-fg-faint">{c.context}</span>
                  </span>
                  <span className="font-mono text-fg-faint" aria-hidden>→</span>
                </button>
              ))}
            </div>
          </section>

          {sentNames.length > 0 && (
            <section>
              <h2 className="tmark"><b>{sentNames.length}</b> / EN ATTENTE</h2>
              <div className="mt-2 border-b border-line">
                {sentNames.map((name) => (
                  <div key={name} className="rangee">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-medium text-fg">{name}</button>
                    <span className="tag">En attente</span>
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
