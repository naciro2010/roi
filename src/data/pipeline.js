/* Le pipeline — ce que chaque rencontre produit.

   Chaque relation suit un cycle visible : Rencontré·e → En conversation →
   Présenté·e → En cours → Conclu. On y voit les kilomètres investis par
   relation (qui tu as rencontré en courant) et ce qui est en jeu. Une sortie
   courue ou une rencontre proposée fait avancer une relation.

   Une entrée :
     id, name (la personne), stage, value (k€, optionnel), kind (le verbe et
     l'objet de la relation), next (prochaine action), nextDate (ISO, optionnel),
     via (d'où vient la relation). */

export const PIPELINE_STAGES = [
  { id: 'met', label: 'Rencontré·e', short: 'Rencontré·e', icon: 'users', tone: 'ink' },
  { id: 'talking', label: 'En conversation', short: 'Conversation', icon: 'chat', tone: 'brand' },
  { id: 'intro', label: 'Présenté·e', short: 'Présenté·e', icon: 'send', tone: 'indigo' },
  { id: 'deal', label: 'En cours', short: 'En cours', icon: 'briefcase', tone: 'amber' },
  { id: 'won', label: 'Conclu', short: 'Conclu', icon: 'checkCircle', tone: 'emerald' },
]

export const INITIAL_PIPELINE = [
  {
    id: 'd1', name: 'Karim Haddad', stage: 'deal', value: 40,
    kind: 'Lever · un ticket 20–50 k€ en amorçage',
    next: 'Envoyer le dossier revu', nextDate: '2026-05-30',
    via: 'Rencontré à la sortie du jeudi, au canal',
  },
  {
    id: 'd2', name: 'Sarah Khalil', stage: 'talking', value: 0,
    kind: 'S’associer · une associée produit, peut-être',
    next: 'Sortie longue dimanche · on parle levée pendant', nextDate: '2026-05-31',
    via: 'Deux sorties courues ensemble',
  },
  {
    id: 'd3', name: 'Yanis Benali', stage: 'intro', value: 8,
    kind: 'Recruter · un renfort React pour le tableau de bord',
    next: 'Fixer le périmètre de la mission', nextDate: '2026-06-02',
    via: 'Présenté par Hugo',
  },
  {
    id: 'd4', name: 'Inès Roy', stage: 'talking', value: 0,
    kind: 'Lever · fonds early-stage, B2B et climat',
    next: 'Présentation vers deux fonds B2B', nextDate: '2026-06-05',
    via: 'Veut te rencontrer',
  },
  {
    id: 'd5', name: 'Claire Moreau', stage: 'met', value: 0,
    kind: 'Conseil · structurer la première équipe',
    next: 'Visio de conseil', nextDate: '2026-06-03',
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

/* Étape voisine (dir = +1 avancer, -1 reculer), bornée aux extrémités. */
export function shiftStage(id, dir = 1) {
  const next = Math.max(0, Math.min(PIPELINE_STAGES.length - 1, stageIndex(id) + dir))
  return PIPELINE_STAGES[next].id
}

/* Synthèse du pipeline : ce qui est en jeu, ce qui est conclu, la répartition par étape. */
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
