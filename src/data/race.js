/* ==========================================================================
   R.O.I — RUN ON INVESTMENT · L'édition
   La course annuelle : Édition 01, Paris La Défense, septembre 2027. Une
   course le matin (5, 10 ou 21,1 km), un après-midi entier dans l'Arena.
   Ces données sont celles du site (runoninvest.fr) : distances, vagues,
   formules, programme. L'inscription se fait SUR LE SITE — l'app lit le
   dossier, elle ne le crée jamais (voir lib/dossier.js).
   ========================================================================== */

/* Le site : la source de vérité de l'inscription. */
export const SITE_URL = 'https://runoninvest.fr'
export const APP_URL = 'https://roi-mvp.up.railway.app'

export function siteUrl(path = '', params) {
  const u = new URL(path.replace(/^\//, ''), SITE_URL + '/')
  if (params) Object.entries(params).forEach(([k, v]) => v != null && v !== '' && u.searchParams.set(k, v))
  return u.toString()
}

export const EDITION = {
  numero: '01',
  label: 'Édition 01',
  nom: 'R.O.I — Run On Investment',
  lieu: 'Paris La Défense',
  arrivee: 'Paris La Défense Arena',
  depart: 'Grande Arche',
  // Le site annonce « septembre 2027 » sans jour ferme : on compte les jours
  // jusqu'au premier du mois, et on l'affiche comme un mois, pas une date.
  mois: 'Septembre 2027',
  moisCourt: 'Sept. 2027',
  date: '2027-09-01',
  jauge: '10 000 participants',
  accroche: "L'impact après la ligne d'arrivée.",
  manifeste: 'On ne se rencontre jamais aussi bien qu’essoufflé.',
}

/* Jours avant la ligne (T–). */
export function daysToRace(now = new Date()) {
  const d = new Date(`${EDITION.date}T00:00:00`)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((d - today) / 86400000))
}

/* ---------------------------------------------------------------- parcours
   Boucles tracées autour de Paris La Défense Arena (départ & arrivée). */
export const LOOP_10K = [
  [48.8957, 2.2286], [48.8946, 2.2320], [48.8932, 2.2352], [48.8922, 2.2388],
  [48.8908, 2.2425], [48.8896, 2.2458], [48.8924, 2.2486], [48.8958, 2.2492],
  [48.8988, 2.2470], [48.9004, 2.2418], [48.9006, 2.2360], [48.8996, 2.2308],
  [48.8978, 2.2278], [48.8964, 2.2272], [48.8957, 2.2286],
]
export const LOOP_5K = [
  [48.8957, 2.2286], [48.8948, 2.2316], [48.8936, 2.2346], [48.8926, 2.2372],
  [48.8938, 2.2388], [48.8954, 2.2356], [48.8966, 2.2316], [48.8957, 2.2286],
]

/* ----------------------------------------------------------------- distances
   Trois distances, un seul dossard : même prix, même accès. Les clés sont
   celles du site ('5' · '10' · '21'). */
export const DISTANCES = [
  {
    id: '5', km: '5', label: '5 km', nom: 'Le Sprint',
    pourquoi: 'Pour se lancer, ou garder du souffle pour l’après-midi.',
    boucle: 'La petite boucle de l’Esplanade', route: LOOP_5K, deniv: '+18 m', duree: '20 à 35 min',
  },
  {
    id: '10', km: '10', label: '10 km', nom: 'La Référence', populaire: true,
    pourquoi: 'Un vrai effort, de l’énergie pour la suite.',
    boucle: 'Esplanade, Grande Arche, CNIT, pont de Neuilly, quais de Seine', route: LOOP_10K, deniv: '+42 m', duree: '40 min à 1 h 10',
  },
  {
    id: '21', km: '21,1', label: '21,1 km', nom: 'Le Grand Format',
    pourquoi: 'Le semi de La Défense, mesuré.',
    boucle: 'Deux fois la grande boucle', route: LOOP_10K, deniv: '+84 m', duree: '1 h 25 à 2 h 15',
  },
]
export const distanceById = (id) => DISTANCES.find((d) => d.id === String(id)) || DISTANCES[1]

/* -------------------------------------------------------------------- vagues
   Trois vagues, un tarif qui monte. Les dates vivent aussi dans server.js et
   index.html côté site — à garder alignées. */
export const VAGUES = [
  { code: 'early', nom: 'Early Bird', prix: 350, fin: '2026-11-30T23:59:59+01:00', periode: 'Jusqu’au 30 novembre 2026' },
  { code: 'regulier', nom: 'Régulier', prix: 400, fin: '2027-01-31T23:59:59+01:00', periode: 'Décembre 2026 → fin janvier 2027' },
  { code: 'last', nom: 'Last Call', prix: 500, fin: null, periode: 'Février 2027 → jour J' },
]
export function vagueCourante(now = Date.now()) {
  return VAGUES.find((v) => !v.fin || now <= Date.parse(v.fin)) || VAGUES[VAGUES.length - 1]
}

/* ------------------------------------------------------------------ formules
   Aucune formule n'achète une meilleure course : elle change quand le réseau
   commence, et combien de portes s'ouvrent après. */
export const FORMULES = [
  {
    id: 'dossard', n: '01', nom: 'Dossard', pour: 'La journée entière', prix: 'Tarif de la vague', etat: 'Inclus',
    points: ['Course chronométrée, t-shirt, médaille finisher', 'L’arrivée dans l’Arena et le déjeuner des finishers', 'Tout l’après-midi : rencontres, conversations debout, soirée', 'Ton profil dans l’annuaire des participants, le jour J'],
  },
  {
    id: 'premium', n: '02', nom: 'Premium', pour: 'Le réseau commence avant la ligne', prix: 'Sur demande', etat: 'Sur demande', mise: true,
    points: ['L’annuaire ouvert dès validation : tu sais qui court, des mois avant', 'Six rencontres réservées à l’avance, depuis l’app', 'Le Salon de l’Arena, vestiaire et douches sans attente', 'Le dîner des fondateurs, le soir'],
  },
  {
    id: 'cercle', n: '03', nom: 'Cercle', pour: 'Quarante places', prix: 'Sur cooptation', etat: 'Sur cooptation',
    points: ['Tout le Premium, et la table des investisseurs au déjeuner', 'Trois dossards invités pour ton équipe ou tes associés', 'Ta place au Cercle les éditions suivantes'],
  },
]
export const formuleById = (id) => FORMULES.find((f) => f.id === id) || FORMULES[0]

/* Étiquette du verso du dossard selon la formule (comme sur le site). */
export function dossardActif(formule) {
  return formule === 'premium' ? '■ Premium' : formule === 'cercle' ? '■ Cercle' : '■ Accès réseau actif'
}

/* -------------------------------------------------- les étapes du dossier
   demande → justificatif → valide → paye — l'état vit sur le site. */
export const ETAPES = [
  { id: 'demande', n: '01', titre: 'Demande reçue', texte: 'Compte créé, vague et distance notées. Le tarif est gardé.' },
  { id: 'justificatif', n: '02', titre: 'Justificatif', texte: 'Kbis, avis SIRENE ou cooptation, en un mail depuis ton espace.' },
  { id: 'valide', n: '03', titre: 'Validation', texte: 'Réponse sous 48 h ouvrées.' },
  { id: 'paye', n: '04', titre: 'Paiement', texte: 'Après validation seulement. Ton dossard devient définitif.' },
]
export const ETAT_INDEX = { demande: 1, justificatif: 2, valide: 3, paye: 4 }

/* ---------------------------------------------------- la journée : T– / T+ */
export const AVANT = {
  titre: 'La course',
  lead: 'Village au pied de la Grande Arche, départs par vagues d’allure, parcours fermé entre les tours.',
  points: ['5, 10 ou 21,1 km — départs par vagues d’allure, du rythme de conversation au chrono', 'Dossard à puce, chronométrage et classements officiels', 'Ravitaillements, signaleurs et secours sur tout le tracé', 'Village : retrait des dossards, consignes, échauffement'],
}
export const APRES = {
  titre: 'Le réseau',
  lead: 'La ligne est dans Paris La Défense Arena. On reprend son souffle, et la journée continue, jusqu’au soir.',
  points: ['Arrivée scénarisée dans l’Arena, café des finishers', 'Ton dossard porte ton nom, ta fonction, ton entreprise', 'Déjeuner par tables, rencontres courtes, conversations debout', 'Dîner des fondateurs et soirée, jusqu’au soir'],
}

/* Le programme de l'après-midi : T+ en tête de ligne. Indicatif. */
export const PROGRAMME = [
  { t: 'T+00', h: 'Dès 11 h', quoi: 'L’arrivée', texte: 'La ligne est dans l’Arena. Un café, et les premières conversations commencent là : en sueur, sans carte de visite.' },
  { t: 'T+01', h: '12 h 30', quoi: 'Le déjeuner des finishers', texte: 'Tables par distance d’abord, puis par secteur. Personne ne déjeune seul.' },
  { t: 'T+02', h: '14 h', quoi: 'Les rencontres', texte: 'Des rendez-vous de huit minutes, proposés depuis ton profil : recruter, lever, vendre, s’associer. En Premium, tu les réserves des semaines à l’avance.' },
  { t: 'T+03', h: '16 h', quoi: 'Les conversations debout', texte: 'Trois prises de parole de quinze minutes, par des fondateurs qui ont couru le matin. Zéro slide.' },
  { t: 'T+04', h: '18 h', quoi: 'La soirée', texte: 'Le dîner des fondateurs pour Premium et Cercle, la soirée pour tout le monde. Jusqu’au soir, et un peu après.' },
]

/* Les quatre principes gardés de ceux qui courent déjà ensemble. */
export const PRINCIPES = [
  { n: '01', titre: 'Zéro pitch en course', texte: 'On court d’abord. On parle pendant. On conclut après.' },
  { n: '02', titre: 'Toutes les allures', texte: 'Du rythme de conversation au chrono. Aucun niveau requis.' },
  { n: '03', titre: 'L’après compte autant', texte: 'L’essentiel du retour se fait une fois la ligne franchie.' },
  { n: '04', titre: 'Le réseau toute l’année', texte: 'Entre deux éditions, l’app garde la conversation ouverte.' },
]

/* Celles et ceux qui courent cette année (aperçu de l'annuaire). */
export const QUI_COURT = ['Sarah Khalil', 'Marc Dubois', 'Nadia Cherif', 'Léa Fontaine', 'Yanis Benali', 'Claire Moreau']
export const INSCRITS = 2412
