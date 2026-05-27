import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Badge, MatchRing } from '../components/primitives'
import { SUGGESTIONS, MEMBERS, FILTERS, personFor } from '../data/network'
import { FREE_MATCH_LIMIT } from '../data/plans'

export default function Reseau() {
  const {
    openMember, sentSuggestions, sendSuggestion, contacted, contactMember,
    connections, requests, acceptRequest, declineRequest,
    hasFeature, openPlans,
  } = useApp()
  const unlimitedMatches = hasFeature('unlimitedMatches')
  const canSeeWhoWants = hasFeature('whoWantsToMeet')
  const visibleSuggestions = unlimitedMatches ? SUGGESTIONS : SUGGESTIONS.slice(0, FREE_MATCH_LIMIT)
  const [netView, setNetView] = useState('suggestions')
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')

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
        <h1 className="text-2xl font-extrabold text-fg">Réseau</h1>
        <p className="mt-0.5 text-sm text-fg-muted">Les bonnes personnes, au bon moment.</p>

        <div className="mt-4 flex gap-1 rounded-2xl bg-surface-2 p-1">
          {[
            { id: 'suggestions', label: 'Matchs' },
            { id: 'annuaire', label: 'Annuaire' },
            { id: 'contacts', label: 'Contacts' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setNetView(s.id)}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition tap ${
                netView === s.id ? 'bg-surface-3 text-fg shadow-card' : 'text-fg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {netView === 'suggestions' && (
        <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          <div className="flex w-full items-start gap-3 rounded-2xl border border-brand-200 bg-brand-light/60 p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-3 text-brand-300 ring-1 ring-brand-500/25">
              <Icon name="sparkles" className="h-4 w-4" filled />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-fg">{SUGGESTIONS.length} personnes à rencontrer</p>
              <p className="text-[12px] text-fg-muted">Sélection selon tes besoins, tes sorties et tes connexions.</p>
            </div>
          </div>

          {visibleSuggestions.map((p) => {
            const sent = sentSuggestions[p.id]
            return (
              <article key={p.id} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar name={p.name} size="lg" onClick={() => openMember(p.name)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-fg">{p.name}</div>
                    <div className="truncate text-sm text-fg-muted">{personFor(p.name).title}</div>
                  </div>
                  <MatchRing value={p.match} size={48} />
                </div>

                <div className="flex flex-wrap gap-2 px-4">
                  <Badge tone="brand">{p.needBadge}</Badge>
                  <Badge tone="emerald">{p.runBadge}</Badge>
                </div>

                <div className="mx-4 mt-3 space-y-1.5 rounded-2xl bg-surface-soft p-3">
                  {p.context.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-[13px] text-fg-soft">
                      <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-success" />
                      {c}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 p-4">
                  <button
                    onClick={() => sendSuggestion(p.id, p.name)}
                    className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white tap ${
                      sent ? 'bg-success' : 'bg-brand-500 shadow-brand hover:bg-brand-600'
                    }`}
                  >
                    {sent ? 'Demande envoyée ✓' : p.primaryAction}
                  </button>
                  <button
                    onClick={() => openMember(p.name)}
                    className="rounded-2xl border border-line-strong px-4 py-3 text-sm font-semibold text-fg-soft tap"
                  >
                    Profil
                  </button>
                </div>
              </article>
            )
          })}

          {!unlimitedMatches && (
            <button
              onClick={openPlans}
              className="relative w-full overflow-hidden rounded-3xl surface-hero p-4 text-left text-white shadow-float tap"
            >
              <div className="absolute inset-0 bg-aurora" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-300">
                  <Icon name="lock" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold">5 autres profils te correspondent</div>
                  <p className="text-[12px] text-white/60">Débloque les matchs illimités avec Pro.</p>
                </div>
                <span className="shrink-0 rounded-full bg-fg px-3 py-1.5 text-xs font-bold text-canvas">Pro</span>
              </div>
            </button>
          )}

          <p className="pt-1 text-center text-xs text-fg-faint">De nouveaux matchs chaque lundi matin ☕</p>
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
                placeholder="Rechercher un membre, un besoin…"
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
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition tap ${
                  filter === f ? 'bg-brand-500 text-white shadow-brand' : 'bg-surface-2 text-fg-soft'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-2">
            <p className="text-xs font-medium text-fg-faint">{list.length} membre{list.length > 1 ? 's' : ''}</p>
            {list.map((m) => (
              <article key={m.id} className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                <button onClick={() => openMember(m.name)} className="flex w-full items-center gap-3 text-left tap">
                  <Avatar name={m.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-fg">{m.name}</div>
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
                  className={`mt-3 w-full rounded-2xl py-2.5 text-sm font-bold tap ${
                    contacted[m.name] ? 'bg-success text-white' : 'border border-brand-300 text-brand-700 hover:bg-brand-light'
                  }`}
                >
                  {contacted[m.name] ? 'Demande envoyée ✓' : 'Entrer en contact'}
                </button>
              </article>
            ))}
            {list.length === 0 && (
              <div className="grid place-items-center py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-fg-faint">
                  <Icon name="search" className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold text-fg-soft">Aucun résultat</p>
                <p className="text-xs text-fg-faint">Essaie un autre filtre ou mot-clé.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {netView === 'contacts' && (
        <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {/* Qui veut me rencontrer (premium) */}
          {canSeeWhoWants ? (
            <section className="rounded-3xl border border-brand-200 bg-brand-light/50 p-3.5">
              <div className="flex items-center gap-1.5">
                <Icon name="sparkles" className="h-4 w-4 text-brand-600" filled />
                <p className="text-[13px] font-bold text-fg">2 personnes veulent te rencontrer</p>
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
                      <div className="truncate text-sm font-bold text-fg">{name}</div>
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
                  <div className="text-sm font-extrabold">2 personnes veulent te rencontrer</div>
                  <p className="text-[12px] text-white/60">Débloque-les avec Pro.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold-300">
                  <Icon name="lock" className="h-4 w-4" />
                </span>
              </div>
            </button>
          )}

          {requests.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-fg-muted">
                Demandes reçues
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{requests.length}</span>
              </div>
              <div className="space-y-2">
                {requests.map((r) => (
                  <article key={r.name} className="rounded-3xl border border-line bg-surface p-3.5 shadow-soft">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="md" onClick={() => openMember(r.name)} />
                      <button onClick={() => openMember(r.name)} className="min-w-0 flex-1 text-left">
                        <div className="truncate font-bold text-fg">{r.name}</div>
                        <div className="truncate text-[12px] text-fg-muted">{r.context}</div>
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => acceptRequest(r.name)} className="flex-1 rounded-2xl bg-brand-500 py-2.5 text-sm font-bold text-white shadow-brand tap">Accepter</button>
                      <button onClick={() => declineRequest(r.name)} className="rounded-2xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-fg-soft tap">Décliner</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-muted">Connexions · {connections.length}</div>
            <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              {connections.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => openMember(c.name)}
                  className={`flex w-full items-center gap-3 px-3.5 py-3 text-left tap hover:bg-white/[0.04] ${i > 0 ? 'border-t border-line' : ''}`}
                >
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-fg">{c.name}</div>
                    <div className="truncate text-[12px] text-fg-faint">{c.context}</div>
                  </div>
                  <Icon name="chevronRight" className="h-4 w-4 text-fg-faint" />
                </button>
              ))}
            </div>
          </section>

          {sentNames.length > 0 && (
            <section>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-muted">Demandes envoyées · {sentNames.length}</div>
              <div className="space-y-2">
                {sentNames.map((name) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-sm font-bold text-fg">{name}</button>
                    <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-fg-muted">En attente</span>
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
