import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { SectionTitle } from '../components/primitives'
import { MEMBERS, FILTERS, personFor } from '../data/network'
import { FREE_MATCH_LIMIT } from '../data/plans'
import { CURRENT_USER } from '../data/user'
import { bonusMatches } from '../data/levels'

/* Une personne, toujours présentée de la même façon : qui elle est, ce
   qu'elle cherche, un bouton. Trois informations, jamais plus — c'est ce
   qu'il faut pour décider si on veut lui parler. */
function Personne({ name, besoin, contexte, marque, contacted, onOpen, onContact, primaire = false }) {
  return (
    <article className="border border-line">
      <button onClick={onOpen} className="flex w-full items-center gap-3 p-4 text-left tap">
        <Avatar name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-medium text-fg">{name}</div>
          <div className="truncate text-[13px] text-fg-muted">{personFor(name).title}</div>
        </div>
        <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
      </button>

      <div className="border-t border-line px-4 py-3">
        {marque && <p className="mb-1.5 font-mono text-[10.5px] font-bold uppercase tracking-mono text-brand-500">{marque}</p>}
        <p className="text-[14px] font-medium leading-snug text-fg">{besoin}</p>
        {contexte && <p className="mt-1 text-[13px] leading-snug text-fg-muted">{contexte}</p>}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={onContact}
          disabled={contacted}
          className={`btn btn-sm w-full justify-between ${contacted ? 'btn-encre' : primaire ? 'btn-impact' : 'btn-ghost'}`}
        >
          <span>{contacted ? 'Demande envoyée' : 'Proposer une rencontre'}</span>
          {!contacted && <span className="arr">→</span>}
        </button>
      </div>
    </article>
  )
}

export default function Reseau() {
  const {
    openMember, sentSuggestions, sendSuggestion, contacted, contactMember,
    connections, requests, acceptRequest, declineRequest,
    hasFeature, openPlans, reseauView, setReseauView,
    rankedMatches, track,
  } = useApp()
  const km = CURRENT_USER.stats.km
  const matchLimit = FREE_MATCH_LIMIT + bonusMatches(km)
  const unlimitedMatches = hasFeature('unlimitedMatches')
  const visibleSuggestions = unlimitedMatches ? rankedMatches : rankedMatches.slice(0, matchLimit)
  const hiddenMatches = rankedMatches.length - visibleSuggestions.length
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')

  const connectionNames = connections.map((c) => c.name)
  const sentNames = Object.keys(contacted).filter((n) => contacted[n] && !connectionNames.includes(n))
  const enAttente = requests.length

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

  const ONGLETS = [
    { id: 'suggestions', label: 'Pour toi' },
    { id: 'annuaire', label: 'Chercher' },
    { id: 'contacts', label: 'Contacts', badge: enAttente },
  ]

  return (
    <div className="animate-screenIn flex h-full flex-col">
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-[28px]">Rencontres</h1>
        <p className="aide mt-1">
          Tout le monde ici court la même course. Propose une rencontre : elle s’ouvre quand vous avez dit oui tous les deux.
        </p>

        <div className="mt-4 flex divide-x divide-line border border-line">
          {ONGLETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setReseauView(s.id)}
              aria-current={reseauView === s.id ? 'page' : undefined}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 font-mono text-[11px] font-bold uppercase tracking-mono transition tap ${reseauView === s.id ? 'bg-fg text-canvas' : 'text-fg-muted'}`}
            >
              {s.label}
              {s.badge > 0 && (
                <span className={`grid h-4 min-w-4 place-items-center px-1 text-[9.5px] ${reseauView === s.id ? 'bg-brand-500 text-craie' : 'bg-brand-500 text-craie'}`}>
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Pour toi : trois propositions expliquées en une phrase ---- */}
      {reseauView === 'suggestions' && (
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          <SectionTitle help="Chaque lundi, on te propose des personnes dont l’intention répond à la tienne. On t’explique toujours pourquoi.">
            Proposé cette semaine
          </SectionTitle>

          {visibleSuggestions.map((m) => (
            <Personne
              key={m.name}
              name={m.name}
              marque="Pourquoi cette proposition"
              besoin={m.reasons?.[0]?.text || personFor(m.name).title}
              contexte={m.reasons?.[1]?.text}
              contacted={!!sentSuggestions[m.name]}
              onOpen={() => openMember(m.name)}
              onContact={() => sendSuggestion(m.name, m.name)}
              primaire
            />
          ))}

          {!unlimitedMatches && hiddenMatches > 0 && (
            <button onClick={openPlans} className="lien-bloc tap hover:bg-surface-2">
              <span className="ico"><Icon name="lock" className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium text-fg">
                  {hiddenMatches} autre{hiddenMatches > 1 ? 's' : ''} proposition{hiddenMatches > 1 ? 's' : ''} cette semaine
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">
                  Tu en as {matchLimit} par semaine. En Premium, il n’y a pas de limite.
                </span>
              </span>
              <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
            </button>
          )}

          <p className="pt-1 text-center text-[12.5px] text-fg-faint">De nouvelles propositions chaque lundi matin.</p>
        </div>
      )}

      {/* ---- Chercher : une barre, des filtres, une liste ---- */}
      {reseauView === 'annuaire' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-5 pt-4">
            <div className="champ flex items-center gap-2">
              <Icon name="search" className="h-4 w-4 shrink-0 text-fg-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Un nom, un métier, ce qu’il cherche…"
                aria-label="Chercher une personne"
                className="input-ligne text-[14px]"
                style={{ padding: '8px 0' }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-fg-faint tap" aria-label="Effacer la recherche">
                  <Icon name="x" className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="aide mt-2">Ou filtre par ce que la personne cherche :</p>
          </div>

          <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar px-5 pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { if (f !== 'Tous') track({ type: 'filter', category: f }); setFilter(f) }}
                aria-pressed={filter === f}
                className={`tag shrink-0 tap ${filter === f ? 'on' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-2 flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 pb-6 pt-2">
            <p className="text-[12.5px] text-fg-faint">
              {list.length} personne{list.length > 1 ? 's' : ''}
            </p>
            {list.map((m) => (
              <Personne
                key={m.id}
                name={m.name}
                marque={m.category}
                besoin={m.need}
                contexte={m.proximity}
                contacted={!!contacted[m.name]}
                onOpen={() => openMember(m.name)}
                onContact={() => contactMember(m.name)}
              />
            ))}
            {list.length === 0 && (
              <div className="grid place-items-center border border-dashed border-line-strong py-16 text-center">
                <span className="ico"><Icon name="search" className="h-5 w-5" /></span>
                <p className="mt-3 text-[14px] font-medium text-fg-soft">Personne ne correspond</p>
                <p className="mt-1 text-[13px] text-fg-faint">Essaie un autre mot, ou enlève le filtre.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Mes contacts : ce qui attend une réponse, puis le reste ---- */}
      {reseauView === 'contacts' && (
        <div className="flex-1 space-y-7 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          {requests.length > 0 && (
            <section>
              <SectionTitle help="Ces personnes ont demandé à te rencontrer. Dis oui et la conversation s’ouvre.">
                {requests.length === 1 ? 'Une demande en attente' : `${requests.length} demandes en attente`}
              </SectionTitle>
              <div className="space-y-2">
                {requests.map((r) => (
                  <article key={r.name} className="border border-fg p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="md" onClick={() => openMember(r.name)} />
                      <button onClick={() => openMember(r.name)} className="min-w-0 flex-1 text-left">
                        <div className="truncate text-[15px] font-medium text-fg">{r.name}</div>
                        <div className="text-[13px] leading-snug text-fg-muted">{r.context}</div>
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => acceptRequest(r.name)} className="btn btn-impact btn-sm flex-1 justify-between">
                        <span>Dire oui</span><span className="arr">→</span>
                      </button>
                      <button onClick={() => declineRequest(r.name)} className="btn btn-ghost btn-sm"><span>Décliner</span></button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle help="Vous avez dit oui tous les deux : vous pouvez vous écrire.">
              {connections.length} personne{connections.length > 1 ? 's' : ''} rencontrée{connections.length > 1 ? 's' : ''}
            </SectionTitle>
            <div className="border-b border-line">
              {connections.map((c) => (
                <button key={c.name} onClick={() => openMember(c.name)} className="rangee tap hover:bg-surface-2">
                  <Avatar name={c.name} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-fg">{c.name}</span>
                    <span className="block truncate text-[13px] text-fg-muted">{c.context}</span>
                  </span>
                  <span className="font-mono text-fg-faint" aria-hidden>→</span>
                </button>
              ))}
            </div>
          </section>

          {sentNames.length > 0 && (
            <section>
              <SectionTitle help="Tu as proposé une rencontre. Rien à faire : c’est à elles de répondre.">
                {sentNames.length} demande{sentNames.length > 1 ? 's' : ''} envoyée{sentNames.length > 1 ? 's' : ''}
              </SectionTitle>
              <div className="border-b border-line">
                {sentNames.map((name) => (
                  <div key={name} className="rangee">
                    <Avatar name={name} size="sm" onClick={() => openMember(name)} />
                    <button onClick={() => openMember(name)} className="min-w-0 flex-1 truncate text-left text-[14.5px] font-medium text-fg">{name}</button>
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
