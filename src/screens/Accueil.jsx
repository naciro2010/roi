import { useEffect, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar, AvatarStack } from '../components/Avatar'
import { Sparkline, SectionTitle } from '../components/primitives'
import PostCard from '../components/PostCard'
import { CURRENT_USER } from '../data/user'
import { activityById } from '../data/activities'
import { pipelineStats } from '../data/pipeline'
import { EDITION, daysToRace, vagueCourante, distanceById, QUI_COURT, INSCRITS } from '../data/race'

function PostSkeleton() {
  return (
    <div className="border border-line">
      <div className="flex items-center gap-3 p-4">
        <div className="shimmer h-11 w-11 bg-surface-2" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3 w-1/3 bg-surface-2" />
          <div className="shimmer h-2.5 w-1/2 bg-surface-2" />
        </div>
      </div>
      <div className="space-y-2 px-4 pb-4">
        <div className="shimmer h-2.5 w-full bg-surface-2" />
        <div className="shimmer h-2.5 w-5/6 bg-surface-2" />
        <div className="shimmer mt-2 h-32 w-full bg-surface-2" />
      </div>
    </div>
  )
}

export default function Accueil() {
  const { goTo, openRoiInfo, openComposer, openMember, openActivity, openAgenda, openInvite, openPipeline, openRunMatch, openRace, dossier, runMatches, pipeline, hasFeature, meetings, posts, togglePostLike, addComment, showToast } = useApp()
  const u = CURRENT_USER
  const pstats = pipelineStats(pipeline)
  const showPipelineValue = hasFeature('analytics')
  const topRun = runMatches?.[0]
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const jours = daysToRace()
  const vague = vagueCourante()

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-screenIn overflow-y-auto no-scrollbar pb-6">
      {/* ---- T– : la ligne approche. Le bloc encre de l'affiche. ---- */}
      <button onClick={openRace} className="surface-hero block w-full px-5 pb-5 pt-4 text-left tap">
        <span className="tmark"><b>{EDITION.label}</b> {EDITION.lieu} — {EDITION.moisCourt}</span>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="shrink-0">
            <div className="display whitespace-nowrap text-[56px] leading-[.82] text-craie">T–<span className="tabular-nums">{jours}</span></div>
            <div className="mt-2 font-mono text-[9.5px] uppercase tracking-label text-craie/60">Jours avant la ligne</div>
          </div>
          <div className="min-w-0 text-right">
            {dossier ? (
              <>
                <div className="font-mono text-[9.5px] uppercase tracking-mono text-craie/60">Dossier <b className="text-brand-500">{dossier.reference}</b></div>
                <div className="titre mt-1 text-[15px] text-craie">{distanceById(dossier.distance).label} · {dossier.vague?.nom}</div>
                <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-brand-500">■ Place gardée</div>
              </>
            ) : (
              <>
                <div className="font-mono text-[9.5px] uppercase tracking-mono text-craie/60">Vague <b className="text-brand-500">{vague.nom}</b> ouverte</div>
                <div className="titre mt-1 text-[15px] text-craie">Prends ta place sur la ligne</div>
                <div className="mt-1 font-mono text-[9.5px] uppercase tracking-mono text-brand-500">{vague.prix} € · 5 / 10 / 21,1 km →</div>
              </>
            )}
          </div>
        </div>
        <div className="laligne mt-4 text-craie" style={{ background: 'rgba(239,235,226,.2)' }} />
      </button>

      <div className="space-y-5 px-5 pt-5">
        {/* ---- Le score réseau : une fiche, pas une carte bancaire ---- */}
        <button onClick={openRoiInfo} className="block w-full text-left tap">
          <span className="tmark"><b>T+</b> / CE QUE TON RÉSEAU RAPPORTE</span>
          <div className="mt-2 flex items-end justify-between gap-3 border-b border-fg pb-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-[26px]">{greet}<br /><span className="creuse">{u.name.split(' ')[0]}</span>.</h1>
            </div>
            <div className="shrink-0 text-right">
              <div className="display text-[40px] leading-none">{u.roi.score}<small className="ml-1 align-top font-mono text-[10px] font-bold tracking-mono text-fg-faint">/100</small></div>
              <div className="mt-1 flex items-center justify-end gap-2">
                <Sparkline data={u.roi.trend} width={72} height={22} stroke="#070707" />
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">+{u.roi.weekDelta} cette sem.</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
            {[
              { value: u.roi.connections, label: 'Contacts' },
              { value: meetings.length, label: 'Rencontres' },
              { value: pstats.active, label: 'Pipeline' },
            ].map((s) => (
              <div key={s.label} className="py-2.5 pl-3 first:pl-0">
                <div className="display text-[22px] leading-none tabular-nums">{s.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-label text-fg-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </button>

        {/* ---- Actions : quatre cellules du cadre ---- */}
        <div className="cadre grid-cols-4">
          {[
            { icon: 'sparkles', label: 'Annuaire', onClick: () => goTo('reseau') },
            { icon: 'activity', label: 'Courir', onClick: () => goTo('courir') },
            { icon: 'calendar', label: 'Rencontres', onClick: openAgenda },
            { icon: 'gift', label: 'Coopter', onClick: openInvite },
          ].map((a) => (
            <button key={a.label} onClick={a.onClick} className="flex flex-col items-center gap-1.5 py-3 text-fg tap hover:bg-fg hover:text-craie">
              <Icon name={a.icon} className="h-5 w-5" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-mono">{a.label}</span>
            </button>
          ))}
        </div>

        {/* ---- Qui court cette année : le réseau commence avant la ligne ---- */}
        <div className="border border-line p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-mono text-brand-500">■ Qui court cette année</span>
            <AvatarStack names={QUI_COURT.slice(0, 4)} total={INSCRITS} onMore={() => goTo('reseau')} />
          </div>
          <button onClick={openRace} className="mt-3 flex w-full items-center gap-3 text-left tap">
            <div className="min-w-0 flex-1">
              <div className="titre text-[15px]">{INSCRITS.toLocaleString('fr-FR')} dossards déjà pris</div>
              <div className="mt-0.5 text-[12px] text-fg-muted">Fondateurs, dirigeants, investisseurs. Tu sais déjà qui sera sur la ligne : le réseau commence avant.</div>
            </div>
            <span className="font-mono text-fg-faint">→</span>
          </button>
        </div>

        {/* ---- Pipeline & RunMatch : la boucle business × course ---- */}
        <div className="cadre grid-cols-2">
          <button onClick={openPipeline} className="p-3.5 text-left tap">
            <div className="font-mono text-[9px] font-bold uppercase tracking-label text-fg-faint">Le pipeline</div>
            <div className="display mt-2 text-[30px] leading-none tabular-nums">
              {showPipelineValue ? <>{pstats.value}<small className="ml-1 align-top font-mono text-[10px] tracking-mono">k€</small></> : pstats.active}
            </div>
            <div className="mt-1.5 text-[11.5px] text-fg-muted">
              {showPipelineValue ? `${pstats.active} relation${pstats.active > 1 ? 's' : ''} en cours` : 'Ce que tes rencontres produisent'}
            </div>
          </button>
          <button onClick={openRunMatch} className="surface-hero p-3.5 text-left tap">
            <div className="font-mono text-[9px] font-bold uppercase tracking-label text-craie/55">Binôme</div>
            <div className="titre mt-2 text-[15px] text-craie">{topRun ? `Cours avec ${topRun.name.split(' ')[0]}` : 'Ta sortie à deux'}</div>
            <div className="mt-1.5 text-[11.5px] text-craie/60">Même allure, une vraie raison de se parler. La sortie devient le rendez-vous.</div>
          </button>
        </div>

        {/* ---- Le fil ---- */}
        <div>
          <SectionTitle t="T+" action="Écrire" onAction={openComposer}>Ce que le réseau raconte</SectionTitle>
          <div className="flex items-center gap-3 border border-line p-3">
            <Avatar name={u.name} size="md" onClick={() => goTo('profil')} />
            <button onClick={openComposer} className="input-ligne flex-1 text-left text-[13px] text-fg-faint tap" style={{ padding: '6px 0' }}>
              Une rencontre, une présentation faite, une sortie, un conseil…
            </button>
            <button onClick={openComposer} className="grid h-9 w-9 shrink-0 place-items-center bg-brand-500 text-encre tap" aria-label="Nouveau post">
              <Icon name="pencil" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
            {posts.map((p, i) => (
              <div key={p.id} className="animate-cardIn" style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}>
                <PostCard
                  post={p}
                  activity={activityById(p.activityId)}
                  onLike={() => togglePostLike(p.id)}
                  onAddComment={(text) => addComment(p.id, text)}
                  onShare={() => showToast('Partage bientôt disponible')}
                  onOpenActivity={() => openActivity(p.activityId)}
                  onOpenAuthor={(name) => openMember(name || p.author)}
                />
              </div>
            ))}
            <p className="pt-1 text-center font-mono text-[9.5px] uppercase tracking-mono text-fg-faint">— Tu es à jour —</p>
          </>
        )}
      </div>
    </div>
  )
}
