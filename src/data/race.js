/* La course officielle ROI — « ROI Business Run · La Défense ».
   L'évènement signature de l'app : une course de networking haut de gamme, au
   pied de Paris La Défense Arena, exclusivement pour les dirigeant·es, fondateur·rices
   et top managers (du CAC 40 à la TPE). Données fictives — aucun paiement réel. */

/* ---------------------------------------------------------------- parcours
   Boucles tracées autour de Paris La Défense Arena (départ & arrivée).
   Coordonnées plausibles le long de l'Esplanade, de la Grande Arche, du
   boulevard circulaire et des quais de Seine (Courbevoie / Neuilly). */
export const LOOP_10K = [
  [48.8957, 2.2286], // Paris La Défense Arena — départ / arrivée
  [48.8946, 2.2320],
  [48.8932, 2.2352], // Grande Arche
  [48.8922, 2.2388], // CNIT · La Coupole
  [48.8908, 2.2425],
  [48.8896, 2.2458], // Pont de Neuilly
  [48.8924, 2.2486],
  [48.8958, 2.2492], // Quais de Seine · Courbevoie
  [48.8988, 2.2470],
  [48.9004, 2.2418],
  [48.9006, 2.2360], // Boulevard circulaire nord
  [48.8996, 2.2308],
  [48.8978, 2.2278],
  [48.8964, 2.2272],
  [48.8957, 2.2286], // retour Arena
]

export const LOOP_5K = [
  [48.8957, 2.2286], // Arena — départ / arrivée
  [48.8948, 2.2316],
  [48.8936, 2.2346], // Esplanade
  [48.8926, 2.2372], // Grande Arche
  [48.8938, 2.2388],
  [48.8954, 2.2356],
  [48.8966, 2.2316],
  [48.8957, 2.2286], // retour Arena
]

/* ----------------------------------------------------------------- formats
   Trois distances, toutes au départ et à l'arrivée de l'Arena. */
export const DISTANCES = [
  {
    id: '5k',
    label: '5 km',
    name: 'Le Sprint des décideurs',
    loops: 'Une petite boucle',
    loopsShort: '1 petite boucle',
    route: LOOP_5K,
    elevation: '+18 m',
    duration: '20 à 35 min',
    tone: 'emerald',
    spots: 3000,
    taken: 2120,
    tagline: 'Court, intense, redoutablement efficace pour briser la glace.',
    description:
      "La petite boucle de l'Esplanade : un format vif et accessible, idéal pour une première fois ou pour pitcher l'esprit léger. On part de l'Arena, on file vers la Grande Arche et on revient — 5 km pour rencontrer sans s'épuiser.",
  },
  {
    id: '10k',
    label: '10 km',
    name: 'La distance reine',
    loops: 'Une grande boucle',
    loopsShort: '1 grande boucle',
    route: LOOP_10K,
    elevation: '+42 m',
    duration: '40 min à 1 h 10',
    tone: 'brand',
    popular: true,
    spots: 5000,
    taken: 4380,
    tagline: 'Le format networking par excellence : assez long pour conclure.',
    description:
      "La grande boucle : Esplanade, Grande Arche, CNIT, pont de Neuilly puis les quais de Seine avant de remonter par le boulevard circulaire jusqu'à l'Arena. 10 km à l'allure conversation — le temps idéal pour faire connaissance, pitcher et caler un prochain rendez-vous.",
  },
  {
    id: 'semi',
    label: 'Semi · 21,1 km',
    name: 'Le défi des dirigeants',
    loops: 'Deux grandes boucles',
    loopsShort: '2 grandes boucles',
    route: LOOP_10K,
    elevation: '+84 m',
    duration: '1 h 25 à 2 h 15',
    tone: 'gold',
    spots: 2000,
    taken: 1290,
    tagline: 'Le terrain des relations qui comptent vraiment.',
    description:
      "Deux fois la grande boucle, soit 21,1 km au cœur de La Défense. Le format des dirigeant·es qui veulent aller au bout — et créer, sur la durée de l'effort, le genre de lien qu'aucun déjeuner d'affaires ne reproduit. Ravitaillements premium à chaque passage à l'Arena.",
  },
]

/* Places & jauge de remplissage (scarcité). */
export const TOTAL_SPOTS = DISTANCES.reduce((t, d) => t + d.spots, 0)
export const TOTAL_TAKEN = DISTANCES.reduce((t, d) => t + d.taken, 0)
export function spotsInfo(d) {
  const left = d.spots - d.taken
  const pct = Math.round((d.taken / d.spots) * 100)
  return { left, pct, almostFull: pct >= 85, full: left <= 0 }
}

/* Coureur·ses déjà engagé·es mis en avant (preuve sociale). */
export const FEATURED_RUNNERS = ['Sarah Khalil', 'Marc Dubois', 'Nadia Cherif', 'Léa Fontaine', 'Yanis Benali']

export const distanceById = (id) => DISTANCES.find((d) => d.id === id) || DISTANCES[1]

/* -------------------------------------------------------------------- SAS
   Sas de départ par objectif d'allure — du plus rapide au plus « networking ». */
export const SAS = [
  {
    id: 'elite',
    label: 'SAS Élite',
    pace: '< 4:00 /km',
    color: 'gold',
    note: 'Sub-élite & compétiteurs. Départ en tête de peloton.',
  },
  {
    id: 'perf',
    label: 'SAS Performance',
    pace: '4:00 – 5:00 /km',
    color: 'brand',
    note: 'Coureur·ses réguliers qui visent un chrono.',
  },
  {
    id: 'tempo',
    label: 'SAS Tempo',
    pace: '5:00 – 6:00 /km',
    color: 'emerald',
    note: 'Le bon équilibre effort / conversation.',
  },
  {
    id: 'business',
    label: 'SAS Business',
    pace: '> 6:00 /km',
    color: 'indigo',
    popular: true,
    note: 'Allure conversation assumée — le sas où l’on pitche en courant.',
  },
]

export const sasById = (id) => SAS.find((s) => s.id === id)

/* ------------------------------------------------------------------- prix
   Ticket d'entrée à 500 € HT. Tarif dégressif pour les inscriptions de groupe
   (équipes & comités de direction). */
export const PRICE_HT = 500
export const VAT_RATE = 0.2

export const GROUP_TIERS = [
  { min: 10, off: 0.15, label: '10 dossards et +' },
  { min: 5, off: 0.1, label: '5 à 9 dossards' },
  { min: 3, off: 0.05, label: '3 à 4 dossards' },
]

export function tierFor(qty) {
  return GROUP_TIERS.find((t) => qty >= t.min) || null
}

/* Bons de réduction (vouchers) acceptés — codes partenaires / parrainage. */
export const VOUCHERS = {
  ROI100: { off: 100, label: '−100 € · code partenaire' },
  TPE2026: { off: 75, label: '−75 € · offre TPE & indépendants' },
  RUNCEO: { off: 50, label: '−50 € · parrainage dirigeant' },
}

/* Calcule le récapitulatif tarifaire (en € HT puis TTC). `voucherOff` en €. */
export function priceBreakdown(qty = 1, voucherOff = 0) {
  const tier = tierFor(qty)
  const unit = PRICE_HT
  const gross = unit * qty
  const tierOff = tier ? Math.round(gross * tier.off) : 0
  const subHt = Math.max(0, gross - tierOff - voucherOff)
  const vat = Math.round(subHt * VAT_RATE)
  return { unit, qty, gross, tier, tierOff, voucherOff, subHt, vat, ttc: subHt + vat }
}

/* --------------------------------------------------------------- l'évènement */
export const RACE = {
  id: 'roi-defense-2026',
  name: 'ROI Business Run',
  place: 'Paris La Défense',
  edition: '1ʳᵉ édition',
  date: '2026-09-17',
  gunTime: '07:30',
  venue: 'Paris La Défense Arena',
  address: '99 Jardin de l’Arche, 92000 Nanterre',
  tagline: 'La course officielle où le business se court en tête.',
  intro:
    "Une matinée. 10 000 décideur·ses. Un seul peloton. Le ROI Business Run réunit la plus grande communauté de dirigeant·es-coureur·ses d’Europe au pied de Paris La Défense Arena — la seule course pensée de bout en bout pour faire des affaires. Départ et arrivée à l’Arena, parcours fermé au cœur du premier quartier d’affaires d’Europe.",
  audience:
    'Ouvert aux dirigeant·es, fondateur·rices, top managers, cadres et entrepreneur·ses — du CAC 40 à la TPE.',
}

/* Chiffres clés affichés en bandeau. */
export const RACE_STATS = [
  { value: '10 000', label: 'Coureurs visés' },
  { value: '500+', label: 'Entreprises' },
  { value: '60', label: 'Nationalités' },
  { value: '90 min', label: 'Pour tout changer' },
]

/* Pourquoi courir — l'argumentaire business. */
export const WHY = [
  {
    icon: 'users',
    title: 'Le plus grand rassemblement business d’Europe',
    text: '10 000 décideur·ses et 500+ entreprises au même endroit, au même moment. En 90 minutes de course, vous croisez plus de profils qualifiés qu’en six mois de salons.',
  },
  {
    icon: 'activity',
    title: 'Pitcher en courant, sans la barrière du costume',
    text: 'L’allure conversation fait tomber les armures. On se parle vraiment, d’égal à égal — l’effort partagé crée en une sortie ce qu’un déjeuner d’affaires met des mois à bâtir.',
  },
  {
    icon: 'briefcase',
    title: 'Des rencontres qui se transforment en deals',
    text: 'Chaque dossard est connecté à l’app ROI : profils, besoins et offres pré-matchés avant le départ. Vous arrivez en sachant déjà qui rencontrer — et repartez avec un pipeline.',
  },
  {
    icon: 'trendingUp',
    title: 'Une visibilité de dirigeant',
    text: 'Village business premium, dossard nominatif, lounge partenaires et soirée de gala : votre marque et la vôtre s’affichent au cœur de La Défense.',
  },
]

/* Ce que comprend le dossard à 500 €. */
export const INCLUDED = [
  { icon: 'medal', text: 'Dossard nominatif + puce chrono électronique' },
  { icon: 'crown', text: 'Accès au Village Business & lounge networking premium' },
  { icon: 'coffee', text: 'Petit-déjeuner d’affaires + ravitaillements gastronomiques' },
  { icon: 'shield', text: 'Vestiaire, douches & consigne sécurisée' },
  { icon: 'gift', text: 'Tee-shirt technique + médaille finisher gravée' },
  { icon: 'sparkles', text: 'Photos officielles offertes & certificat de course' },
  { icon: 'video', text: 'Accès à l’afterwork & à la soirée de gala networking' },
  { icon: 'rocket', text: '1 mois ROI Pro offert + mise en relation pré-course dans l’app' },
]

/* Déroulé de la matinée. */
export const PROGRAM = [
  { time: '06:30', title: 'Ouverture du village', text: 'Retrait des dossards, café d’accueil, échauffement coaché.' },
  { time: '07:30', title: 'Départ Élite & Performance', text: 'Coup d’envoi depuis l’Arena, par sas successifs.' },
  { time: '07:45', title: 'Départ Tempo & Business', text: 'Les sas allure conversation s’élancent.' },
  { time: '09:00', title: 'Remise des médailles', text: 'Podiums par distance et challenge inter-entreprises.' },
  { time: '09:30', title: 'Petit-déjeuner d’affaires', text: 'Speed-networking guidé par l’app + stands partenaires.' },
  { time: '11:00', title: 'Afterwork de clôture', text: 'On prolonge les conversations, on cale les rendez-vous.' },
]

/* Témoignages. */
export const TESTIMONIALS = [
  {
    name: 'Sarah Khalil',
    title: 'CEO · Fintech',
    text: 'J’ai signé mon premier client grand compte sur les 3 derniers kilomètres. Aucun salon ne m’a jamais donné ça.',
  },
  {
    name: 'Marc Dubois',
    title: 'Fondateur · Industrie',
    text: 'On y vient en short, on en repart avec un board. Le seul évènement où mon comex et mes prospects courent côte à côte.',
  },
]

/* FAQ. */
export const FAQ = [
  {
    q: 'Faut-il un bon niveau pour participer ?',
    a: 'Non. Le SAS Business est pensé pour l’allure conversation — on peut marcher, pitcher, reprendre. L’objectif est la rencontre, pas le chrono.',
  },
  {
    q: 'Le dossard est-il facturable à mon entreprise ?',
    a: 'Oui. Choisissez le paiement par bon de commande à l’inscription : vous recevez une facture acquittée au nom de votre société, payable à 30 jours.',
  },
  {
    q: 'Peut-on inscrire toute une équipe ?',
    a: 'Oui, en inscription de groupe — tarif dégressif dès 3 dossards. Un classement inter-entreprises récompense les meilleures équipes.',
  },
  {
    q: 'Et si je dois annuler ?',
    a: 'Remboursement intégral jusqu’à 30 jours avant la course, ou transfert du dossard à un·e collaborateur·rice sans frais.',
  },
]

/* Moyens de paiement B2B. */
export const PAY_METHODS = [
  { id: 'voucher', label: 'Bon de commande', sub: 'Facture entreprise · paiement à 30 j', icon: 'briefcase' },
  { id: 'card', label: 'Carte bancaire', sub: 'Visa · Mastercard · Amex', icon: 'creditCard' },
  { id: 'paypal', label: 'PayPal', sub: 'Paiement en un clic', icon: 'wallet' },
  { id: 'gpay', label: 'Google Pay', sub: 'Paiement express', icon: 'wallet' },
]
