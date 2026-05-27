/* Copilot IA ROI — assistant de networking (démo : réponses scriptées).
   Met en valeur l'IA : insights proactifs + chat avec suggestions. */

export const COPILOT_GREETING =
  'Salut Thomas 👋 Je suis ton Copilot IA. J’analyse tes sorties, tes connexions et tes besoins pour te dire qui rencontrer et quoi dire. Demande-moi ce que tu veux.'

/* Cartes d'insight générées par l'IA (affichées en haut du Copilot). */
export const COPILOT_INSIGHTS = [
  {
    id: 'i1',
    icon: 'sparkles',
    tone: 'brand',
    title: 'Sarah lève une seed, comme toi',
    text: 'Vous courez tous les deux la Seine le dimanche. Propose-lui une sortie pour échanger vos pitchs — 94 % de compatibilité.',
    action: 'Rédiger l’intro',
    intent: 'compose-sarah',
    member: 'Sarah Khalil',
  },
  {
    id: 'i2',
    icon: 'flame',
    tone: 'amber',
    title: 'Relance Yanis',
    text: 'Il prend des missions React et n’a pas répondu depuis 4 jours. Un petit mot avant le défi 10 km maximise tes chances.',
    action: 'Préparer un message',
    intent: 'compose-yanis',
    member: 'Yanis Benali',
  },
  {
    id: 'i3',
    icon: 'trendingUp',
    tone: 'emerald',
    title: '+6 de ROI cette semaine',
    text: '2 RDV pris et 1 opportunité ouverte. Garde le rythme : un post REX ce soir te rendrait visible auprès de 3 investisseurs.',
    action: 'Idée de post',
    intent: 'post-idea',
  },
]

/* Prompts suggérés (chips sous le champ). */
export const COPILOT_PROMPTS = [
  { id: 'p1', label: 'Qui rencontrer cette semaine ?', intent: 'who' },
  { id: 'p2', label: 'Rédige une intro à Karim', intent: 'compose-karim' },
  { id: 'p3', label: 'Résume ma semaine réseau', intent: 'recap' },
  { id: 'p4', label: 'Idée de post pour aujourd’hui', intent: 'post-idea' },
]

/* Réponses scriptées par intention + repli par mots-clés. */
const REPLIES = {
  who:
    'Cette semaine, 3 personnes valent le détour :\n\n• Sarah Khalil (94 %) — même objectif seed, court la Seine le dimanche.\n• Yanis Benali (89 %) — dev React dispo, inscrit à ton défi 10 km.\n• Claire Moreau (86 %) — mentor scaling, présente au Run & Pitch jeudi.\n\nVeux-tu que je rédige un message d’intro pour l’une d’elles ?',
  'compose-sarah':
    'Voici une intro pour Sarah, calée sur votre point commun :\n\n« Salut Sarah ! Je prépare aussi une seed et je cours la Seine le dimanche. Ça te dirait qu’on cale une sortie tranquille pour comparer nos approches de pitch ? J’ai deux/trois apprentissages qui pourraient t’être utiles. »\n\nJe peux l’ajuster (plus court, plus direct, en anglais…).',
  'compose-yanis':
    'Relance courte et concrète pour Yanis :\n\n« Hello Yanis ! On se croise au défi 10 km — parfait pour faire connaissance. Je cherche un renfort React sur mon MVP (dashboard + onboarding). On court ensemble dimanche et on en parle ? »',
  'compose-karim':
    'Intro pour Karim (business angel) :\n\n« Bonjour Karim, je construis un SaaS B2B en pleine préparation de seed. Claire m’a parlé de votre approche d’investissement. Seriez-vous ouvert à un échange — autour d’un café ou d’un footing ? J’envoie mon deck si pertinent. »',
  recap:
    'Ta semaine réseau en bref :\n\n• Score ROI : 78 (+6) 📈\n• 4 nouvelles connexions, 2 RDV pris, 1 opportunité ouverte\n• Sortie la plus rentable : dimanche Seine (2 rencontres)\n\nPriorité de la semaine prochaine : convertir l’échange avec Karim en RDV deck.',
  'post-idea':
    'Idée de post REX qui performe bien dans ta communauté :\n\n« Cette semaine j’ai compris que mon onboarding perdait 40 % des users à l’étape 2. Un café-running avec un autre fondateur SaaS m’a débloqué l’idée : couper le formulaire en 2. Résultat lundi. »\n\nCourt, concret, ça déclenche des commentaires. Je le publie ?',
}

const DEFAULT_REPLY =
  'Bonne question. Je croise tes besoins (dev React, conseils scaling), tes sorties et ton réseau pour te proposer la meilleure action. Dis-moi si tu veux que je trouve une personne, que je rédige un message ou que je résume ta semaine.'

export function copilotReply({ intent, text = '' }) {
  if (intent && REPLIES[intent]) return REPLIES[intent]
  const t = text.toLowerCase()
  if (/intro|message|rédige|ecris|écris|relance/.test(t)) return REPLIES['compose-sarah']
  if (/qui|rencontr|match|qui voir/.test(t)) return REPLIES.who
  if (/résum|recap|semaine|bilan|roi/.test(t)) return REPLIES.recap
  if (/post|publier|idée|idee|écrire un post/.test(t)) return REPLIES['post-idea']
  return DEFAULT_REPLY
}
