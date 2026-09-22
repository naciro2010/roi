import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { Chip } from '../components/primitives'
import { MEMBERS, FILTERS, personFor } from '../data/network'
import { FREE_MATCH_LIMIT } from '../data/plans'
import { CURRENT_USER } from '../data/user'
import { bonusMatches } from '../data/levels'

/* Une personne, toujours présentée de la même façon : qui elle est, ce
   qu'elle cherche, un bouton. L'ancienne étiquette « POURQUOI CETTE
   PROPOSITION » a disparu : la raison est dans la phrase elle-même. */
function Personne({ name, besoin, contexte, onOpen, action, secondaire }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-[18px]">
      <button onClick={onOpen} className="flex w-full items-center gap-3 text-left tap">
        <Avatar name={name} size="lg" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-semibold text-fg">{name}</span>
          <span className="mt-px block truncate text-[13.5px] text-fg-faint">{personFor(name).title}</span>
        </span>
        <Icon name="chevronRight" className="h-[18px] w-[18px] shrink-0 text-fg-faint" />
      </button>

      <p className="mt-3.5 text-[14.5px] leading-[1.5] text-fg-soft">{besoin}</p>
      {contexte && <p className="mt-1 text-[13.5px] leading-[1.45] text-fg-faint">{contexte}</p>}

      <div className="mt-4 flex gap-2">
        <button
          onClick={action.onClick}
          disabled={action.fait}
          className={`flex-1 rounded-full border px-4 py-[11px] text-[14px] font-semibold tap ${
            action.fait
              ? 'border-transparent bg-craie-2 text-fg-muted'
              : action.accent
                ? 'border-transparent bg-brand-500 text-craie'
                : 'border-transparent bg-encre text-craie'
          }`}
        >
          {action.label}
        </button>
        {secondaire && (
          <button
            onClick={secondaire.onClick}
            className="rounded-full border border-line-strong px-4 py-[11px] text-[14px] font-semibold text-fg-muted tap"
          >
            {secondaire.label}
          </button>
        )}
      </div>
    </article>
  )
}

export default function Reseau() {
  const {
    openMember, sentSuggestions, sendSuggestion, contacted, contactMember,
    connections, requests, acceptRequest, declineRequest, messageMember,
    hasFeature, openPlans, reseauView, setReseauView, rankedMatches, track,
  } = useApp()

  const [filtre, setFiltre] = useState('Tous')
  const [query, setQuery] = useState('')

  const matchLimit = FREE_MATCH_LIMIT + bonusMatches(CURRENT_USER.stats.km)
  const sansLimite = hasFeature('unlimitedMatches')
  const suggestions = sansLimite ? rankedMatches : rankedMatches.slice(0, matchLimit)
  const cachees = rankedMatches.length - suggestions.length

  const q = query.trim().toLowerCase()
  const annuaire = MEMBERS.filter((m) => {
    const okFiltre = filtre === 'Tous' || m.category === filtre
    const okQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.need.toLowerCase().includes(q) ||
      personFor(m.name).title.toLowerCase().includes(q)
    return okFiltre && okQuery
  })

  const ONGLETS = [
    { id: 'suggestions', label: 'Pour toi', badge: 0 },
    { id: 'annuaire', label: 'Chercher', badge: 0 },
    { id: 'contacts', label: 'Contacts', badge: requests.length },
  ]

  /* Les cartes de la liste courante. */
  let cartes = []
  if (reseauView === 'suggestions') {
    cartes = suggestions.map((m) => ({
      name: m.name,
      besoin: m.reasons?.[0]?.text || personFor(m.name).title,
      contexte: m.reasons?.[1]?.text,
      action: sentSuggestions[m.name]
        ? { label: 'Demande envoyée', fait: true }
        : { label: 'Proposer une rencontre', accent: true, onClick: () => sendSuggestion(m.name, m.name) },
    }))
  } else if (reseauView === 'annuaire') {
    cartes = annuaire.map((m) => ({
      name: m.name,
      besoin: m.need,
      contexte: m.proximity,
      action: contacted[m.name]
        ? { label: 'Demande envoyée', fait: true }
        : { label: 'Proposer une rencontre', onClick: () => contactMember(m.name) },
    }))
  } else {
    cartes = [
      ...requests.map((r) => ({
        name: r.name,
        besoin: r.context,
        contexte: 'Dis oui et la conversation s’ouvre.',
        action: { label: 'Dire oui', accent: true, onClick: () => acceptRequest(r.name) },
        secondaire: { label: 'Décliner', onClick: () => declineRequest(r.name) },
      })),
      ...connections.map((c) => ({
        name: c.name,
        besoin: c.context,
        contexte: 'Vous avez dit oui tous les deux.',
        action: { label: 'Écrire', onClick: () => messageMember(c.name) },
      })),
    ]
  }

  return (
    <div className="animate-screenIn no-scrollbar h-full overflow-y-auto px-5 pb-7 pt-2">
      <h1 className="text-[27px]">Rencontres</h1>
      <p className="mt-1.5 text-[14px] leading-[1.5] text-fg-muted">
        Propose une rencontre : elle s’ouvre quand vous avez dit oui tous les deux.
      </p>

      {/* Sélecteur segmenté */}
      <div className="mt-[18px] flex gap-1.5 rounded-full bg-craie-2 p-1">
        {ONGLETS.map((o) => {
          const actif = reseauView === o.id
          return (
            <button
              key={o.id}
              onClick={() => setReseauView(o.id)}
              aria-current={actif ? 'page' : undefined}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-[9px] text-[13.5px] font-semibold tap ${
                actif ? 'bg-canvas text-fg' : 'text-fg-muted'
              }`}
            >
              {o.label}
              {o.badge > 0 && (
                <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-craie">
                  {o.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Recherche et filtres — onglet « Chercher » seulement */}
      {reseauView === 'annuaire' && (
        <>
          <div className="mt-4 flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-[11px]">
            <Icon name="search" className="h-[17px] w-[17px] shrink-0 text-fg-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Un nom, un métier, ce qu’il cherche…"
              aria-label="Chercher une personne"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14.5px] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="shrink-0 text-fg-faint tap" aria-label="Effacer la recherche">
                <Icon name="x" className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
            {FILTERS.map((f) => (
              <Chip
                key={f}
                on={filtre === f}
                aria-pressed={filtre === f}
                onClick={() => { if (f !== 'Tous') track({ type: 'filter', category: f }); setFiltre(f) }}
              >
                {f}
              </Chip>
            ))}
          </div>
        </>
      )}

      {/* La liste */}
      <div className="mt-4 flex flex-col gap-3">
        {cartes.map((c) => (
          <Personne
            key={`${reseauView}-${c.name}`}
            name={c.name}
            besoin={c.besoin}
            contexte={c.contexte}
            onOpen={() => openMember(c.name)}
            action={c.action}
            secondaire={c.secondaire}
          />
        ))}

        {cartes.length === 0 && (
          <p className="my-6 text-center text-[14px] text-fg-faint">
            Personne ne correspond. Essaie un autre mot, ou enlève le filtre.
          </p>
        )}

        {reseauView === 'suggestions' && !sansLimite && cachees > 0 && (
          <button onClick={openPlans} className="lien-bloc tap">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas text-fg">
              <Icon name="lock" className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold">
                {cachees} autre{cachees > 1 ? 's' : ''} proposition{cachees > 1 ? 's' : ''} cette semaine
              </span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-fg-muted">
                Tu en as {matchLimit} par semaine. En Premium, il n’y a pas de limite.
              </span>
            </span>
            <Icon name="chevronRight" className="h-[18px] w-[18px] shrink-0 text-fg-faint" />
          </button>
        )}
      </div>
    </div>
  )
}
