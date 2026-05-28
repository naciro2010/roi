/* Pipeline ROI — le CRM léger branché sur les kilomètres.
   ───────────────────────────────────────────────────────
   Chaque relation business suit un cycle visible : Rencontré → En discussion →
   Intro / pitch → Deal en cours → Conclu. Le pipeline rend le « score réseau »
   vivant : on voit le retour sur les km investis (qui on a rencontré en
   courant, et ce que ça a produit). Une sortie courue ou un RDV proposé fait
   avancer une relation — c'est la boucle « 1 sortie = 1 opportunité ».

   Une entrée (deal) :
     id, name (contact), stage, value (k€, optionnel), kind (nature de la relation),
     next (prochaine action), nextDate (ISO, optionnel), via (origine de la relation). */

export const PIPELINE_STAGES = [
  { id: 'met', label: 'Rencontré', short: 'Rencontré', icon: 'users', tone: 'ink' },
  { id: 'talking', label: 'En discussion', short: 'Discussion', icon: 'chat', tone: 'brand' },
  { id: 'intro', label: 'Intro / pitch', short: 'Intro', icon: 'send', tone: 'indigo' },
  { id: 'deal', label: 'Deal en cours', short: 'Deal', icon: 'briefcase', tone: 'amber' },
  { id: 'won', label: 'Conclu', short: 'Conclu', icon: 'checkCircle', tone: 'emerald' },
]

export const INITIAL_PIPELINE = [
  {
    id: 'd1', name: 'Karim Haddad', stage: 'deal', value: 40,
    kind: 'Investissement seed · ticket 20–50k',
    next: 'Envoyer le deck v2', nextDate: '2026-05-30',
    via: 'Rencontré au Run & Pitch',
  },
  {
    id: 'd2', name: 'Sarah Khalil', stage: 'talking', value: 0,
    kind: 'Associée produit potentielle',
    next: 'Sortie longue dimanche · comparer les pitchs', nextDate: '2026-05-31',
    via: '2 sorties courues ensemble',
  },
  {
    id: 'd3', name: 'Yanis Benali', stage: 'intro', value: 8,
    kind: 'Renfort React pour le MVP',
    next: 'Caler le périmètre de la mission', nextDate: '2026-06-02',
    via: 'Discute de ton MVP',
  },
  {
    id: 'd4', name: 'Inès Roy', stage: 'talking', value: 0,
    kind: 'Fonds early-stage · B2B & climat',
    next: 'Intro vers deux fonds B2B', nextDate: '2026-06-05',
    via: 'Veut te rencontrer',
  },
  {
    id: 'd5', name: 'Claire Moreau', stage: 'met', value: 0,
    kind: 'Mentorat scaling & ops',
    next: 'Visio mentorat', nextDate: '2026-06-03',
    via: 'Rencontrée à la sortie de jeudi',
  },
]

export function stageIndex(id) {
  const i = PIPELINE_STAGES.findIndex((s) => s.id === id)
  return i < 0 ? 0 : i
}

export function stageMeta(id) {
  return PIPELINE_STAGES.find((s) => s.id === id) || PIPELINE_STAGES[0]
}

/* Stage voisin (dir = +1 avancer, -1 reculer), borné aux extrémités. */
export function shiftStage(id, dir = 1) {
  const next = Math.max(0, Math.min(PIPELINE_STAGES.length - 1, stageIndex(id) + dir))
  return PIPELINE_STAGES[next].id
}

/* Synthèse du pipeline : valeur en jeu, conclus, répartition par étape. */
export function pipelineStats(deals = []) {
  const value = deals.reduce((s, d) => s + (d.value || 0), 0)
  const won = deals.filter((d) => d.stage === 'won')
  const wonValue = won.reduce((s, d) => s + (d.value || 0), 0)
  const active = deals.filter((d) => d.stage !== 'won')
  const byStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.id, deals.filter((d) => d.stage === s.id)]),
  )
  return { total: deals.length, active: active.length, value, won: won.length, wonValue, byStage }
}
