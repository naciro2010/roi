import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import Sheet from '../components/Sheet'
import { Avatar, AvatarStack } from '../components/Avatar'
import { personFor } from '../data/network'
import { ACTIVITIES, nombre } from '../data/activities'
import { CURRENT_USER } from '../data/user'
import { icebreaker } from '../lib/matching'

/* La fiche d'une personne : qui elle est, ce qu'elle cherche, ce qu'elle
   apporte, et deux boutons. Ce que le repo ajoute au-dessus de la maquette
   — pourquoi vous deux, la première phrase toute prête, vos sorties
   communes — reste là, dans le même langage visuel. */
export default function MemberSheet({ name, onClose }) {
  const { contacted, contactMember, messageMember, openActivity, matchDetail, startIcebreaker } = useApp()
  const p = personFor(name)
  const envoye = !!contacted[name]
  const match = matchDetail ? matchDetail(name) : null
  const sorties = ACTIVITIES.filter(
    (a) =>
      (a.athlete === CURRENT_USER.name && a.metContacts.includes(name)) ||
      (a.athlete === name && a.metContacts.includes(CURRENT_USER.name)),
  )

  return (
    <Sheet
      title="Son profil"
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            onClick={() => !envoye && contactMember(name)}
            disabled={envoye}
            className={`flex-1 rounded-full px-5 py-3 text-[14px] font-semibold tap ${
              envoye ? 'bg-craie-2 text-fg-muted' : 'bg-brand-500 text-craie'
            }`}
          >
            {envoye ? 'Demande envoyée' : 'Proposer une rencontre'}
          </button>
          <button
            onClick={() => messageMember(name)}
            className="rounded-full border border-line-strong px-5 py-3 text-[14px] font-semibold text-fg-muted tap"
          >
            Écrire
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-3.5">
        <Avatar name={name} size="xl" />
        <div className="min-w-0">
          <div className="truncate text-[19px] font-semibold">{name}</div>
          <div className="mt-0.5 truncate text-[14px] text-fg-muted">{p.title}</div>
          <div className="truncate text-[13.5px] text-fg-faint">{p.location}</div>
        </div>
      </div>

      <p className="mt-[18px] text-[14.5px] leading-[1.65] text-fg-soft">{p.bio}</p>

      {p.looking?.length > 0 && (
        <>
          <h3 className="titre-section mb-2 mt-[22px]">Ce qu’il ou elle cherche</h3>
          <div className="flex flex-col gap-2">
            {p.looking.map((x) => (
              <div key={x} className="flex items-start gap-2.5 text-[14.5px] leading-[1.4]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{x}
              </div>
            ))}
          </div>
        </>
      )}

      {p.offering?.length > 0 && (
        <>
          <h3 className="titre-section mb-2 mt-[22px]">Ce qu’il ou elle apporte</h3>
          <div className="flex flex-wrap gap-1.5">
            {p.offering.map((x) => (
              <span key={x} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px]">{x}</span>
            ))}
          </div>
        </>
      )}

      {/* Pourquoi vous deux — la raison, en une phrase. */}
      {match?.reasons?.length > 0 && (
        <>
          <h3 className="titre-section mb-2 mt-[22px]">Pourquoi vous deux</h3>
          <div className="flex flex-col gap-2">
            {match.reasons.map((r) => (
              <div key={r.text} className="flex items-start gap-2.5 text-[14.5px] leading-[1.4] text-fg-soft">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{r.text}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Une première phrase, toute prête. */}
      <div className="mt-[22px] rounded-xl border border-line bg-surface p-[18px]">
        <h3 className="titre-section">Si tu ne sais pas quoi dire</h3>
        <p className="mt-2 text-[14.5px] leading-[1.55] text-fg-soft">« {icebreaker(name, sorties.length)} »</p>
        <button
          onClick={() => startIcebreaker(name)}
          className="mt-3.5 rounded-full bg-encre px-5 py-2.5 text-[13.5px] font-semibold text-craie tap"
        >
          Envoyer cette phrase
        </button>
      </div>

      {sorties.length > 0 && (
        <>
          <h3 className="titre-section mb-2 mt-[22px]">
            {sorties.length} sortie{sorties.length > 1 ? 's' : ''} courue{sorties.length > 1 ? 's' : ''} ensemble
          </h3>
          <div>
            {sorties.map((a) => (
              <button key={a.id} onClick={() => openActivity(a.id)} className="rangee tap">
                <span className="ico"><Icon name="activity" className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{a.title}</span>
                  <span className="mt-0.5 block text-[13.5px] text-fg-faint tabular-nums">{a.date} · {nombre(a.distance)} km</span>
                </span>
                <Icon name="chevronRight" className="h-[17px] w-[17px] shrink-0 text-fg-faint" />
              </button>
            ))}
          </div>
        </>
      )}

      {p.mutuals?.length > 0 && (
        <div className="mt-[22px] flex items-center gap-3 border-t border-line-soft pt-4">
          <AvatarStack names={p.mutuals.slice(0, 3)} total={p.mutuals.length} onMore={() => {}} />
          <span className="text-[13.5px] text-fg-muted">
            <b className="font-semibold text-fg">{p.mutuals.length}</b> contacts en commun
          </span>
        </div>
      )}
    </Sheet>
  )
}
