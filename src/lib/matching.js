/* « Pour toi » — les rencontres proposées, et pourquoi.

   Le score n'est PAS figé : il combine ce qui se répond (ce que tu cherches ↔
   ce qu'on t'apporte, la course, les sujets, les relations communes) avec ce
   que tu FAIS dans l'app. Plus tu regardes, aimes, écris à un type de profil,
   plus ce type remonte. Tout est pur et déterministe : (toi, profils, signaux)
   → score, et chaque proposition est expliquée.

   Signaux (signals) — journal comportemental persistant :
     views   : { [name]: count }   profils ouverts
     likes   : { [name]: count }   posts likés (attribués à l'auteur)
     msgs    : { [name]: count }   messages envoyés
     contacts: { [name]: true }    rencontres proposées (intention forte)
     filters : { [category]: count } filtres d'annuaire utilisés
     topics  : { [topic]: weight }  sujets recherchés / explorés
*/

import { ARCHETYPES, ME, profileFor, RUN_WINDOWS, RUN_ZONES } from '../data/profiling'

export const EMPTY_SIGNALS = { views: {}, likes: {}, msgs: {}, contacts: {}, filters: {}, topics: {} }

/* Poids d'une action (ce qu'elle nous apprend). */
const ACTION_WEIGHT = { view: 1, like: 1.6, msg: 2.4, contact: 3.4, filter: 1.2, search: 1 }

/* Pondération des composantes du score final. */
const W = { need: 0.34, behavior: 0.26, run: 0.18, vibe: 0.13, social: 0.09 }

/* Filtres de l'annuaire (data/network.js) → archétype d'intérêt (alimente le « Pour toi »). */
const FILTER_ARCHE = {
  'Lève': 'investor',
  'Recrute': 'operator',
  'Vend': 'developer',
  'S’associe': 'founder',
  'Conseille': 'mentor',
}

const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n))

/* signaux (réducteur pur) */

export function recordSignal(signals, { type, name, category, topics }) {
  const s = {
    views: { ...signals.views },
    likes: { ...signals.likes },
    msgs: { ...signals.msgs },
    contacts: { ...signals.contacts },
    filters: { ...signals.filters },
    topics: { ...signals.topics },
  }
  if (type === 'view' && name) s.views[name] = (s.views[name] || 0) + 1
  if (type === 'like' && name) s.likes[name] = (s.likes[name] || 0) + 1
  if (type === 'msg' && name) s.msgs[name] = (s.msgs[name] || 0) + 1
  if (type === 'contact' && name) s.contacts[name] = true
  if (type === 'filter' && category) s.filters[category] = (s.filters[category] || 0) + 1
  // Toute action sur une personne irrigue aussi l'intérêt pour ses sujets.
  const tw = ACTION_WEIGHT[type] || 1
  const list = topics || (name ? profileFor(name).topics : [])
  list.forEach((t) => { s.topics[t] = (s.topics[t] || 0) + tw })
  return s
}

/* vecteur d'intérêt comportemental */

/* Agrège le comportement en un vecteur d'affinité par archétype + sujets.
   C'est ce qu'on apprend de toi. */
export function interestVector(signals = EMPTY_SIGNALS) {
  const arche = {}
  const perPerson = {}
  const add = (name, w) => {
    const p = profileFor(name)
    arche[p.archetype] = (arche[p.archetype] || 0) + w
    perPerson[name] = (perPerson[name] || 0) + w
  }
  Object.entries(signals.views || {}).forEach(([n, c]) => add(n, c * ACTION_WEIGHT.view))
  Object.entries(signals.likes || {}).forEach(([n, c]) => add(n, c * ACTION_WEIGHT.like))
  Object.entries(signals.msgs || {}).forEach(([n, c]) => add(n, c * ACTION_WEIGHT.msg))
  Object.keys(signals.contacts || {}).forEach((n) => add(n, ACTION_WEIGHT.contact))
  // Les filtres d'annuaire renseignent aussi l'intention (sans cibler une personne).
  Object.entries(signals.filters || {}).forEach(([cat, c]) => {
    const a = FILTER_ARCHE[cat]
    if (a) arche[a] = (arche[a] || 0) + c * ACTION_WEIGHT.filter
  })

  const archeMax = Math.max(1, ...Object.values(arche))
  const topicMax = Math.max(1, ...Object.values(signals.topics || {}))
  return {
    arche, // brut, pour le tri des centres d'intérêt
    archeNorm: Object.fromEntries(Object.entries(arche).map(([k, v]) => [k, v / archeMax])),
    perPerson,
    topicsNorm: Object.fromEntries(Object.entries(signals.topics || {}).map(([k, v]) => [k, v / topicMax])),
    total: Object.values(perPerson).reduce((a, b) => a + b, 0),
    // Force totale du signal d'intérêt (actions sur les personnes + filtres).
    strength: Object.values(arche).reduce((a, b) => a + b, 0),
  }
}

/* composantes du score */

const overlap = (a = [], b = []) => a.filter((x) => b.includes(x)).length

function provideSatisfies(provider, seek, seeker) {
  const pv = provider.provides || []
  switch (seek) {
    case 'capital': return pv.includes('capital')
    case 'talent': return pv.includes('talent')
    case 'cofounder': return pv.includes('cofounder') || provider.archetype === 'founder'
    case 'mentor': return pv.includes('mentor')
    case 'expertise': return pv.includes('expertise') || pv.includes('mentor')
    case 'intros': return pv.includes('intros')
    // « cherche des clients » est satisfait par quelqu'un qui recrute / achète.
    case 'clients': return (provider.seeks || []).includes('talent')
    default: return false
  }
}

/* Ce qui se répond : ce que je cherche ↔ ce qu'on m'apporte, et l'inverse. */
function needFit(me, them) {
  const seeks = me.seeks || []
  const theirSeeks = them.seeks || []
  let a = 0
  seeks.forEach((s) => { if (provideSatisfies(them, s, me)) a++ })
  let b = 0
  theirSeeks.forEach((s) => { if (provideSatisfies(me, s, them)) b++ })
  const aFrac = seeks.length ? a / seeks.length : 0
  const bFrac = theirSeeks.length ? b / theirSeeks.length : 0
  // Les sujets communs renforcent la pertinence (ex. thèse d'un investisseur).
  const topic = overlap(me.topics, them.topics) / Math.max(3, me.topics?.length || 3)
  return clamp(0.55 * aFrac + 0.3 * bFrac + 0.3 * topic)
}

/* Ce qu'on a en commun en course : créneau, allure, zone, distance, sorties. */
function runFit(me, them, sharedRuns = 0) {
  const a = me.run || {}
  const b = them.run || {}
  let s = 0
  if (a.window && a.window === b.window) s += 0.32
  if (a.zone && a.zone === b.zone) s += 0.26
  if (a.distance && a.distance === b.distance) s += 0.12
  const paceGap = Math.abs((a.pace || 6) - (b.pace || 6))
  s += 0.3 * clamp(1 - paceGap / 1.6) // allures proches → bonus
  const sharedEvents = overlap(me.events, them.events)
  if (sharedEvents) s += 0.18
  if (sharedRuns) s += 0.3 // déjà couru ensemble = signal très fort
  return clamp(s)
}

function vibeFit(me, them) {
  const o = overlap(me.topics, them.topics)
  return clamp(o / Math.max(3, them.topics?.length || 3))
}

/* Ce que ton comportement a montré : à quel point cette fiche colle à ce que
   tu explores en ce moment (le cœur du « Pour toi »). */
function behaviorFit(them, vec, name) {
  const arche = vec.archeNorm[them.archetype] || 0
  const topicW = (them.topics || []).map((t) => vec.topicsNorm[t] || 0)
  const topic = topicW.length ? topicW.reduce((a, b) => a + b, 0) / topicW.length : 0
  const direct = clamp((vec.perPerson[name] || 0) / 8) // intérêt direct répété
  return clamp(0.55 * arche + 0.3 * topic + 0.3 * direct)
}

/* score complet + le pourquoi */

export function scoreMatch(name, signals = EMPTY_SIGNALS, opts = {}) {
  const them = profileFor(name)
  const vec = opts.vec || interestVector(signals)
  const sharedRuns = opts.sharedRuns || 0
  const mutuals = opts.mutuals || 0

  const parts = {
    need: needFit(ME, them),
    run: runFit(ME, them, sharedRuns),
    vibe: vibeFit(ME, them),
    social: clamp(mutuals / 4),
    behavior: behaviorFit(them, vec, name),
  }

  const raw = Object.entries(W).reduce((sum, [k, w]) => sum + w * parts[k], 0)
  // Mappe sur ~58..98 pour un rendu lisible, + petit bonus d'affinité directe.
  const directBump = Math.min(4, (signals.views?.[name] || 0) * 1.5 + (signals.likes?.[name] || 0) * 2)
  const score = Math.round(clamp(58 + raw * 40 + directBump, 0, 98))

  return { name, score, parts, archetype: them.archetype, reasons: buildReasons(them, parts, vec, name, sharedRuns, mutuals) }
}

/* Le pourquoi, lisible, trié par contribution. */
function buildReasons(them, parts, vec, name, sharedRuns, mutuals) {
  const out = []
  if (parts.need >= 0.45) {
    if ((them.provides || []).includes('capital') && ME.seeks.includes('capital'))
      out.push({ icon: 'trendingUp', text: 'Tu lèves — ' + name.split(' ')[0] + ' investit sur ce que tu construis' })
    else if ((them.provides || []).includes('talent') && ME.seeks.includes('talent'))
      out.push({ icon: 'cpu', text: 'Répond à ce que tu cherches : un développeur pour ton produit' })
    else if ((them.provides || []).includes('mentor'))
      out.push({ icon: 'compass', text: 'Conseille sur un sujet que tu creuses : structurer une équipe' })
    else
      out.push({ icon: 'target', text: 'Vos intentions se répondent' })
  }
  if (sharedRuns) out.push({ icon: 'activity', text: `${sharedRuns} sortie${sharedRuns > 1 ? 's' : ''} déjà courue${sharedRuns > 1 ? 's' : ''} ensemble` })
  else if (parts.run >= 0.5) {
    const win = RUN_WINDOWS[them.run?.window]
    const zone = RUN_ZONES[them.run?.zone]
    out.push({ icon: 'route', text: `Vous courez ${win} ${zone}` })
  }
  if ((vec.archeNorm[them.archetype] || 0) >= 0.6 && vec.strength >= 3)
    out.push({ icon: 'sparkles', text: `Tu regardes beaucoup les ${ARCHETYPES[them.archetype].label.toLowerCase()} en ce moment` })
  if (mutuals >= 2) out.push({ icon: 'users', text: `${mutuals} relations en commun` })
  if (parts.vibe >= 0.5 && out.length < 4) {
    const shared = (them.topics || []).filter((t) => ME.topics.includes(t)).slice(0, 2)
    if (shared.length) out.push({ icon: 'link', text: `Sujets en commun : ${shared.join(', ')}` })
  }
  return out.slice(0, 4)
}

/* classement & synthèse */

export function rankMatches(names, signals = EMPTY_SIGNALS, ctx = {}) {
  const vec = interestVector(signals)
  return names
    .map((name) =>
      scoreMatch(name, signals, {
        vec,
        sharedRuns: ctx.sharedRuns?.[name] || 0,
        mutuals: ctx.mutuals?.[name] || 0,
      }),
    )
    .sort((a, b) => b.score - a.score)
}

/* Le binôme (la sortie à deux)

   Même matière première que le « Pour toi », mais repondérée autour de la
   course : on veut d'abord quelqu'un avec qui courir (même allure, même
   créneau, même zone), et ensuite une intention qui se répond.
   La sortie devient le rendez-vous — d'où le poids fort sur `run`. */
const RUN_W = { run: 0.48, need: 0.27, behavior: 0.15, vibe: 0.1 }

function buildRunReasons(them, parts, name, sharedRuns) {
  const out = []
  if (sharedRuns) out.push({ icon: 'activity', text: `Déjà ${sharedRuns} sortie${sharedRuns > 1 ? 's' : ''} courue${sharedRuns > 1 ? 's' : ''} ensemble` })
  const win = RUN_WINDOWS[them.run?.window]
  const zone = RUN_ZONES[them.run?.zone]
  if (win && zone) out.push({ icon: 'route', text: `Vous courez ${win} ${zone}` })
  const gap = Math.abs((ME.run?.pace || 6) - (them.run?.pace || 6))
  if (gap <= 0.4) out.push({ icon: 'activity', text: 'Allures très proches — vous tiendrez la conversation' })
  if ((them.provides || []).includes('capital') && ME.seeks.includes('capital'))
    out.push({ icon: 'trendingUp', text: `Et ${name.split(' ')[0]} investit sur ce que tu construis` })
  else if ((them.provides || []).includes('talent') && ME.seeks.includes('talent'))
    out.push({ icon: 'cpu', text: 'Et c’est le développeur que tu cherches' })
  else if ((them.provides || []).includes('mentor'))
    out.push({ icon: 'compass', text: 'Et peut te conseiller pour structurer ton équipe' })
  else if (parts.need >= 0.4)
    out.push({ icon: 'target', text: 'Et vos intentions se répondent' })
  return out.slice(0, 3)
}

export function scoreRunMatch(name, signals = EMPTY_SIGNALS, opts = {}) {
  const them = profileFor(name)
  const vec = opts.vec || interestVector(signals)
  const sharedRuns = opts.sharedRuns || 0
  const parts = {
    need: needFit(ME, them),
    run: runFit(ME, them, sharedRuns),
    vibe: vibeFit(ME, them),
    behavior: behaviorFit(them, vec, name),
  }
  const raw = RUN_W.run * parts.run + RUN_W.need * parts.need + RUN_W.behavior * parts.behavior + RUN_W.vibe * parts.vibe
  const score = Math.round(clamp(56 + raw * 42, 0, 98))
  return { name, score, parts, archetype: them.archetype, run: them.run, reasons: buildRunReasons(them, parts, name, sharedRuns) }
}

/* Classement des binômes : la course d'abord. */
export function rankRunMatches(names, signals = EMPTY_SIGNALS, ctx = {}) {
  const vec = interestVector(signals)
  return names
    .map((name) => scoreRunMatch(name, signals, { vec, sharedRuns: ctx.sharedRuns?.[name] || 0 }))
    .sort((a, b) => b.parts.run - a.parts.run || b.score - a.score)
}

const ACTION_VERB = { view: 'consultés', like: 'likés', contact: 'contactés', msg: 'messagés' }

/* Ce que ton comportement a montré, affiché dans le bandeau « Pour toi ». */
export function behaviorInsights(signals = EMPTY_SIGNALS) {
  const vec = interestVector(signals)
  const topArche = Object.entries(vec.arche).sort((a, b) => b[1] - a[1])[0]
  const topTopics = Object.entries(signals.topics || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t)

  if (!topArche || vec.strength < 2) {
    return {
      learning: false,
      archetype: null,
      headline: 'On apprend ce que tu cherches',
      detail: 'Ouvre quelques fiches : les rencontres proposées suivront ce qui t’intéresse vraiment.',
      topTopics,
    }
  }
  const meta = ARCHETYPES[topArche[0]]
  return {
    learning: true,
    archetype: topArche[0],
    icon: meta.icon,
    tone: meta.tone,
    headline: `Tu cherches surtout des ${meta.label.toLowerCase()}`,
    detail: 'On a remonté celles et ceux qui répondent à ce que tu as regardé ces derniers jours.',
    topTopics,
  }
}

/* La première phrase, toute prête, à partir de ce que vous avez en commun (pour la fiche). */
export function icebreaker(name, sharedRuns = 0) {
  const them = profileFor(name)
  const first = name.split(' ')[0]
  if (sharedRuns) return `Salut ${first}, bien couru pour la dernière. On remet ça, et on parle de nos boîtes pendant ?`
  if ((them.provides || []).includes('capital'))
    return `Bonjour ${first}, je prépare une levée d’amorçage pour un SaaS B2B. Huit minutes, en courant ou autour d’un café, pour te présenter le projet ?`
  if ((them.provides || []).includes('talent'))
    return `Salut ${first}, je construis un SaaS B2B et je cherche un développeur React. On en parle en courant ?`
  if ((them.provides || []).includes('mentor'))
    return `Bonjour ${first}, tu as structuré une équipe avant moi. J’aimerais ton regard là-dessus — un café sur les quais, ou une sortie ?`
  const topic = (them.topics || [])[0]
  return `Salut ${first}, on partage pas mal de sujets${topic ? ` (${topic})` : ''}. Une sortie à allure de conversation, et on voit ce que ça produit ?`
}
