import { useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { Badge } from '../components/primitives'
import { personFor, MEMBERS } from '../data/network'
import { ARCHETYPES } from '../data/profiling'
import { stageMeta } from '../data/pipeline'
import { ACTIVITIES } from '../data/activities'
import { CURRENT_USER } from '../data/user'
import { MEETING_TYPES } from '../data/meetings'
import { icebreaker } from '../lib/matching'
import { useSheetDrag } from '../lib/useSheetDrag'

/* Où se rencontrer : en courant, autour d'un café, en visio (libellés dans data/meetings). */
const LIEUX = ['cafe', 'run', 'visio']

/* Le verso d'un dossard, ouvert depuis l'annuaire : qui, ce qu'il cherche,
   ce qu'il apporte, pourquoi vous — et une première phrase toute prête. */
export default function MemberSheet({ name, onClose }) {
  const { contacted, contactMember, messageMember, openActivity, proposeMeeting, matchDetail, startIcebreaker, pipeline, addToPipeline, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const [proposing, setProposing] = useState(false)
  const p = personFor(name)
  const isContacted = contacted[name]
  const deal = pipeline?.find((d) => d.name === name)
  const match = matchDetail ? matchDetail(name) : null
  const arche = match ? ARCHETYPES[match.archetype] : null
  const category = MEMBERS.find((m) => m.name === name)?.category
  const sharedRuns = ACTIVITIES.filter(
    (a) =>
      (a.athlete === CURRENT_USER.name && a.metContacts.includes(name)) ||
      (a.athlete === name && a.metContacts.includes(CURRENT_USER.name)),
  )
  const ice = icebreaker(name, sharedRuns.length)
  const first = name.split(' ')[0]

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/65" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[90%] flex-col overflow-hidden bg-canvas">
        {/* Bande encre : la poignée, le bouton fermer */}
        <div className="surface-hero relative h-20 shrink-0">
          <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center border border-craie/30 text-craie tap" aria-label="Fermer">
            <Icon name="x" className="h-4 w-4" />
          </button>
          <div {...drag.handleProps} className="absolute left-1/2 top-0 z-10 flex h-9 w-24 -translate-x-1/2 items-center justify-center" aria-hidden="true">
            <div className="mt-3 h-1 w-10 bg-craie/40" />
          </div>
          <span className="titre-section absolute bottom-3 left-5 text-craie">Son profil</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          <div className="-mt-7 flex items-end gap-3">
            <div className="ring-4 ring-canvas">
              <Avatar name={name} size="xl" />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate text-[19px] font-medium text-fg">{name}</h2>
              <p className="truncate text-[13.5px] text-fg-muted">{p.title}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {category && <Badge>{category}</Badge>}
            {arche && <Badge dot={false}>{arche.short}</Badge>}
            <span className="text-[13px] text-fg-faint">{p.location}</span>
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-fg-soft">{p.bio}</p>

          {/* Pourquoi vous, pourquoi maintenant */}
          {match && match.reasons.length > 0 && (
            <div className="mt-4 border border-fg p-3.5">
              <h3 className="titre-section">Pourquoi vous deux</h3>
              <div className="mt-2.5 space-y-2">
                {match.reasons.map((r) => (
                  <div key={r.text} className="flex items-start gap-2.5 text-[14px] leading-snug text-fg-soft">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand-500" /> {r.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Une première phrase — toute prête, à partir de ce que vous avez en commun */}
          <div className="mt-3 border-l-[3px] border-brand-500 bg-surface-2 px-3.5 py-3">
            <div className="titre-section">Si tu ne sais pas quoi dire</div>
            <p className="mt-1.5 text-[14px] italic leading-relaxed text-fg-soft">« {ice} »</p>
            <button onClick={() => startIcebreaker(name)} className="btn btn-ghost btn-sm mt-2.5 w-full justify-between">
              <span>Envoyer cette phrase</span><span className="arr">→</span>
            </button>
          </div>

          {/* Le pipeline — où en est la relation, ou la suivre */}
          {deal ? (
            <div className="mt-3 flex items-center gap-3 border border-line p-3">
              <span className="ico plein"><Icon name="briefcase" className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-fg">Tu suis cette relation</div>
                <div className="mt-0.5 truncate text-[13px] text-fg-muted">Où vous en êtes : {stageMeta(deal.stage).label.toLowerCase()}.</div>
              </div>
            </div>
          ) : (
            <button onClick={() => { addToPipeline(name); showToast(`Tu suis maintenant ${first}`) }} className="btn btn-ghost btn-sm mt-3 w-full justify-between">
              <span>Suivre cette relation</span><span className="arr">→</span>
            </button>
          )}

          {p.looking?.length > 0 && (
            <div className="mt-5">
              <h3 className="titre-section">Ce que {first} cherche</h3>
              <ul className="mt-2 border-t border-fg">
                {p.looking.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 border-b border-line py-2.5 text-[14px] leading-snug text-fg">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand-500" />{x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.offering?.length > 0 && (
            <div className="mt-4">
              <h3 className="titre-section">Ce que {first} apporte</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.offering.map((x) => (
                  <span key={x} className="tag">{x}</span>
                ))}
              </div>
            </div>
          )}

          {sharedRuns.length > 0 && (
            <div className="mt-4">
              <h3 className="titre-section">{sharedRuns.length} sortie{sharedRuns.length > 1 ? 's' : ''} courue{sharedRuns.length > 1 ? 's' : ''} ensemble</h3>
              <div className="mt-1 border-b border-line">
                {sharedRuns.map((a) => (
                  <button key={a.id} onClick={() => openActivity(a.id)} className="rangee tap hover:bg-surface-2">
                    <span className="ico"><Icon name="activity" className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-medium text-fg">{a.title}</span>
                      <span className="mt-0.5 block text-[13px] text-fg-muted tabular-nums">{a.date} · {a.distance.toFixed(1)} km</span>
                    </span>
                    <span className="font-mono text-fg-faint" aria-hidden>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.mutuals?.length > 0 && (
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
              <AvatarStack names={p.mutuals.slice(0, 3)} total={p.mutuals.length} onMore={() => {}} />
              <span className="text-[13.5px] text-fg-muted">
                <b className="font-medium text-fg">{p.mutuals.length}</b> contacts en commun
              </span>
            </div>
          )}

          {p.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="tag">#{t}</span>
              ))}
            </div>
          )}
        </div>

        {proposing && (
          <div className="shrink-0 border-t border-fg px-5 pt-3">
            <p className="text-[13.5px] text-fg-muted">Huit minutes, où tu veux : en courant, autour d’un café ou en visio ?</p>
            <div className="cadre mt-2.5 grid-cols-3">
              {LIEUX.map((t) => {
                const meta = MEETING_TYPES[t]
                return (
                  <button key={t} onClick={() => { proposeMeeting({ with: name, type: t }); setProposing(false) }} className="flex flex-col items-center gap-1.5 py-3 text-fg tap hover:bg-fg hover:text-craie">
                    <Icon name={meta.icon} className="h-5 w-5" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-mono">{meta.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2 border-t border-fg bg-canvas px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button onClick={() => contactMember(name)} disabled={isContacted} className={`btn flex-1 justify-between ${isContacted ? 'btn-encre' : 'btn-impact'}`}>
            <span>{isContacted ? 'Demande envoyée' : 'Proposer une rencontre'}</span>{!isContacted && <span className="arr">→</span>}
          </button>
          <button
            onClick={() => setProposing((v) => !v)}
            className={`grid h-12 w-12 shrink-0 place-items-center border tap ${proposing ? 'border-brand-500 text-brand-500' : 'border-line-strong text-fg-soft'}`}
            aria-label="Proposer une sortie"
            title="Proposer une sortie"
          >
            <Icon name="activity" className="h-5 w-5" />
          </button>
          <button onClick={() => messageMember(name)} className="grid h-12 w-12 shrink-0 place-items-center border border-line-strong text-fg-soft tap" aria-label="Écrire" title="Écrire">
            <Icon name="chat" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
