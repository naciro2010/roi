/* ==========================================================================
   R.O.I — RUN ON INVESTMENT · L'édition
   La course annuelle, fin novembre : Édition 01, Paris La Défense, samedi
   27 novembre 2027. Une course le matin (5, 10 ou 21,1 km), un après-midi
   entier dans l'Arena. Puis chaque année, à la même période.

   Avant elle, une pré-édition : LA PILOTE (novembre 2025, Bois de Vincennes,
   380 finishers). C'est elle qui sert de laissez-passer — l'app est réservée
   à celles et ceux qui ont déjà couru un R.O.I (voir data/user.js).

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
  // La course est datée : samedi 27 novembre 2027. Le compte à rebours part
  // de là, et la cadence est annuelle — fin novembre, chaque année.
  mois: 'Novembre 2027',
  moisCourt: 'Nov. 2027',
  jour: 'Samedi 27 novembre 2027',
  date: '2027-11-27',
  cadence: 'Chaque année, fin novembre.',
  jauge: '10 000 décideurs attendus',
  accroche: "L'impact après la ligne d'arrivée.",
  manifeste: 'On ne se rencontre jamais aussi bien qu’essoufflé.',
}

/* ------------------------------------------------------------- la pilote
   La pré-édition : c'est elle qui ouvre l'accès à l'app. On ne rentre pas
   dans R.O.I en s'abonnant — on y rentre en ayant couru. */
export const EDITION_PILOTE = {
  numero: '00',
  label: 'Édition 00',
  nom: 'La Pilote',
  lieu: 'Bois de Vincennes',
  mois: 'Novembre 2025',
  moisCourt: 'Nov. 2025',
  jour: 'Samedi 22 novembre 2025',
  date: '2025-11-22',
  finishers: 380,
  resume: 'Une matinée, 380 coureurs, un déjeuner qui a duré jusqu’au soir. Le format tenait : on l’a gardé.',
}

/* Les éditions, de la plus récente à la plus ancienne. */
export const EDITIONS = [EDITION, EDITION_PILOTE]
export const editionByNumero = (n) => EDITIONS.find((e) => e.numero === String(n)) || EDITION

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
   celles du site ('5' · '10' · '21'), les mots aussi (section T+04 et
   formulaire d'inscription). Le site n'annonce ni dénivelé ni temps : on
   n'en invente pas. Le tracé sur la carte est indicatif. */
export const DISTANCES = [
  {
    id: '5', km: '5', label: '5 km', nom: 'Le Sprint',
    pourquoi: 'Pour se lancer, ou garder du souffle pour l’après-midi.',
    trace: 'Boucle Esplanade', route: LOOP_5K,
  },
  {
    id: '10', km: '10', label: '10 km', nom: 'La Référence', central: true,
    pourquoi: 'Un vrai effort, de l’énergie pour la suite.',
    trace: 'Entre les tours', route: LOOP_10K,
  },
  {
    id: '21', km: '21,1', label: '21,1 km', nom: 'Le Grand Format',
    pourquoi: 'Le semi de La Défense, mesuré.',
    trace: '21,0975 km · distance officielle', route: LOOP_10K,
  },
]
/* Ce que dit chaque ligne de distance sur le site, en pied. */
export const ACCES_RESEAU = 'Accès réseau ■ total'
export const distanceById = (id) => DISTANCES.find((d) => d.id === String(id)) || DISTANCES[1]

/* -------------------------------------------------------------------- vagues
   Trois vagues, un tarif qui monte. Les dates vivent aussi dans server.js et
   index.html côté site — à garder alignées. */
export const VAGUES = [
  { code: 'early', nom: 'Early Bird', prix: 350, fin: '2027-02-28T23:59:59+01:00', periode: 'Jusqu’au 28 février 2027' },
  { code: 'regulier', nom: 'Régulier', prix: 400, fin: '2027-06-30T23:59:59+02:00', periode: 'Mars → fin juin 2027' },
  { code: 'last', nom: 'Last Call', prix: 500, fin: null, periode: 'Juillet 2027 → jour J' },
]
export function vagueCourante(now = Date.now()) {
  return VAGUES.find((v) => !v.fin || now <= Date.parse(v.fin)) || VAGUES[VAGUES.length - 1]
}

/* ------------------------------------------------------------------ formules
   Les anciennes formules de course. Elles ont laissé la place aux paliers
   d'abonnement (data/plans.js) : l'app ne les affiche plus. On les garde ici
   parce que le site les documente encore — c'est lui la source de vérité du
   dossier, et le pont lit ce qu'il renvoie. */
export const FORMULES = [
  {
    id: 'dossard', n: '01', nom: 'Dossard', pour: 'La journée entière', prix: 'Tarif de la vague', etat: 'Inclus',
    base: 'Early Bird, Régulier ou Last Call : les trois vagues. Même prix quelle que soit la distance.',
    points: ['Course chronométrée, t-shirt R.O.I, médaille finisher', 'L’arrivée dans l’Arena et le déjeuner des finishers', 'Tout l’après-midi : rencontres de huit minutes, conversations debout, soirée', 'Ton profil dans l’annuaire des participants, le jour J'],
  },
  {
    id: 'premium', n: '02', nom: 'Premium', pour: 'Le réseau commence avant la ligne', prix: 'Sur demande', etat: 'Sur demande', mise: true,
    base: 'Se demande depuis ton espace, à tout moment jusqu’au jour J. Les conditions te sont précisées à la validation.',
    herite: 'Tout le Dossard, et',
    points: ['L’annuaire ouvert dès validation : tu sais qui court, des mois avant le départ', 'Six rencontres réservées à l’avance', 'Le Salon de l’Arena, vestiaire et douches sans attente, sas de départ dédié', 'Le dîner des fondateurs, le soir'],
  },
  {
    id: 'cercle', n: '03', nom: 'Cercle', pour: 'Quarante places', prix: 'Sur cooptation', etat: 'Sur cooptation',
    base: 'Sur demande depuis ton espace, ou sur cooptation de deux membres. Les conditions te sont précisées à la validation.',
    herite: 'Tout le Premium, et',
    points: ['La table des investisseurs au déjeuner, un rendez-vous garanti avec les fonds présents', 'Trois dossards invités pour ton équipe ou tes associés', 'Ta place au Cercle, reconduite les éditions suivantes'],
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
  { id: 'demande', n: '01', titre: 'Demande reçue', texte: 'Ton compte est créé, ta vague et ta distance sont notées. Le tarif est gardé.' },
  { id: 'justificatif', n: '02', titre: 'Justificatif', texte: 'Kbis, avis SIRENE ou cooptation : envoie ta pièce en un mail, depuis ton espace.' },
  { id: 'valide', n: '03', titre: 'Validation', texte: 'Réponse sous 48 h ouvrées. S’il manque quelque chose, on te dit précisément quoi.' },
  { id: 'paye', n: '04', titre: 'Paiement', texte: 'Après validation seulement. Le lien de paiement arrive par mail, ton dossard devient définitif.' },
]
export const ETAT_INDEX = { demande: 1, justificatif: 2, valide: 3, paye: 4 }

/* ------------------------------------------------- l'avancement de l'édition
   « Ta route vers l'Édition 01 » : ce qui est fait, ce qui s'ouvre quand.
   C'est ce qu'on regarde en ouvrant l'app — le dossard et où l'on en est.

   Un jalon est FAIT quand sa condition est remplie, À VENIR tant qu'il n'est
   pas encore ouvert (`ouvreA` = jours avant la course), EN COURS sinon. Rien
   n'est bloqué par un palier : un jalon à venir dit seulement « pas encore ». */
export const JALONS = [
  { id: 'dossard', icon: 'flag', titre: 'Ton dossard' },
  { id: 'dossier', icon: 'shield', titre: 'Ton dossier' },
  { id: 'distance', icon: 'activity', titre: 'Ta distance' },
  { id: 'sas', icon: 'users', titre: 'Ton sas de départ', ouvreA: 90 },
  { id: 'rdv', icon: 'calendar', titre: 'Tes rendez-vous', ouvreA: 42 },
  { id: 'jourj', icon: 'trophy', titre: 'Le jour J', ouvreA: 0 },
]

/* Le numéro de dossard, tel qu'il est imprimé : quatre chiffres. */
export const numeroDossard = (n) => String(n ?? '').padStart(4, '0')

/* État de chaque jalon, pour un dossard donné et un nombre de rendez-vous
   déjà réservés pour l'après-midi. */
export function avancementEdition({ dossard, rdv = 0, now = new Date() } = {}) {
  const jours = daysToRace(now)
  const d = dossard || null
  const dist = d?.distance ? distanceById(d.distance) : null

  const etat = {
    dossard: {
      fait: !!d?.numero,
      texte: d?.numero
        ? `Dossard n° ${numeroDossard(d.numero)} — ta place est prise.`
        : 'Prends ta place : l’inscription se fait sur le site, en cinq minutes.',
    },
    dossier: {
      fait: d?.statut === 'valide' || d?.statut === 'paye',
      texte: d?.statut === 'valide' || d?.statut === 'paye'
        ? 'Justificatif reçu, dossier validé.'
        : 'Envoie ton Kbis, ton avis SIRENE ou ta cooptation depuis ton espace.',
    },
    distance: {
      fait: !!dist,
      texte: dist
        ? `${dist.label} — ${dist.nom}.`
        : 'Choisis 5, 10 ou 21,1 km. Ça se change jusqu’à un mois avant.',
    },
    sas: {
      fait: !!d?.sas,
      texte: d?.sas
        ? `Sas ${d.sas} — départ par vagues d’allure.`
        : 'Les sas s’attribuent trois mois avant, sur l’allure que tu annonces.',
    },
    rdv: {
      fait: rdv > 0,
      texte: rdv > 0
        ? `${rdv} rencontre${rdv > 1 ? 's' : ''} réservée${rdv > 1 ? 's' : ''} pour l’après-midi.`
        : 'Les huit-minutes de l’après-midi se réservent six semaines avant.',
    },
    jourj: {
      fait: jours === 0,
      texte: jours === 0
        ? 'C’est aujourd’hui. On se retrouve dans l’Arena.'
        : 'L’arrivée est dans l’Arena. La journée continue jusqu’au soir.',
    },
  }

  const etapes = JALONS.map((j) => {
    const e = etat[j.id]
    const ouvert = j.ouvreA == null || jours <= j.ouvreA
    return {
      ...j,
      texte: e.texte,
      statut: e.fait ? 'fait' : ouvert ? 'encours' : 'avenir',
      ouvreDans: ouvert ? 0 : jours - j.ouvreA,
    }
  })

  const faits = etapes.filter((e) => e.statut === 'fait').length
  const courante = etapes.find((e) => e.statut === 'encours') || etapes.find((e) => e.statut === 'avenir') || null
  return {
    etapes,
    faits,
    total: etapes.length,
    pct: Math.round((faits / etapes.length) * 100),
    courante,
    jours,
  }
}

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
  { t: 'T+00', h: 'Dès 11 h', quoi: 'L’arrivée', texte: 'La ligne est dans l’Arena. On reprend son souffle, on prend un café, et les premières conversations commencent là : en sueur, sans carte de visite.' },
  { t: 'T+01', h: '12 h 30', quoi: 'Le déjeuner des finishers', texte: 'Tables par distance d’abord : on s’assoit avec ceux qui ont couru la même chose. Puis par secteur, si tu préfères. Personne ne déjeune seul.' },
  { t: 'T+02', h: '14 h', quoi: 'Les rencontres', texte: 'Des rendez-vous de huit minutes, proposés depuis ton profil : recruter, lever, vendre, s’associer. Tu choisis qui, on s’occupe du où. En Premium, tu les réserves des semaines à l’avance.' },
  { t: 'T+03', h: '16 h', quoi: 'Les conversations debout', texte: 'Trois prises de parole de quinze minutes, par des fondateurs qui ont couru le matin. Zéro slide. Puis on repart marcher, on repart parler.' },
  { t: 'T+04', h: '18 h', quoi: 'La soirée', texte: 'Le dîner des fondateurs pour les formules Premium et Cercle, la soirée pour tout le monde. Jusqu’au soir, et un peu après.' },
]

/* Les quatre principes du site (T+03 / LE RÉSEAU), gardés de ceux qui
   courent déjà ensemble. Mêmes titres, mêmes mots. */
export const PRINCIPES = [
  { n: '01', titre: 'Zéro pitch en course', texte: 'On court, on parle si on veut, on ne vend rien. Ça vient après — et ça vient mieux.' },
  { n: '02', titre: 'Zéro slide l’après-midi', texte: 'Des tables, des rendez-vous courts, des conversations debout. Pas de stand, pas d’écran.' },
  { n: '03', titre: 'Toutes les allures', texte: 'Aucun temps à tenir. Le 5 km existe pour ça, et personne ne regarde les classements en salle.' },
  { n: '04', titre: 'L’après compte autant', texte: 'Le café d’arrivée, le déjeuner, la soirée : c’est là que se fait l’essentiel du retour sur investissement.' },
]

/* Les quatre publics du site (le registre de T+03). */
export const PUBLICS = [
  { n: '01', qui: 'Indépendants & entrepreneurs', quoi: 'Rompre l’isolement, élargir son cercle, et retrouver l’énergie de ceux qui entreprennent au même moment que toi.' },
  { n: '02', qui: 'Intrapreneurs & cadres', quoi: 'Se challenger, rencontrer des profils qu’on ne croise jamais en interne, et nourrir sa capacité d’initiative.' },
  { n: '03', qui: 'Dirigeants & décideurs', quoi: 'Rencontrer ses homologues sans salon ni intermédiaire, incarner une culture de l’effort, tisser des relations de confiance.' },
  { n: '04', qui: 'Entreprises & équipes', quoi: 'Mobiliser ses équipes autour d’une expérience qui a du sens, et courir aux couleurs de l’entreprise. Dossards groupés et packs : entreprises@runoninvest.fr.' },
]

/* Les trois voies d'accès au dossard (T+03.1 / L'ACCÈS). */
export const ACCES = [
  { voie: 'Extrait Kbis', texte: 'Tu diriges ou tu détiens une société. Un extrait de moins de trois mois.' },
  { voie: 'Avis SIRENE', texte: 'Tu es indépendant·e. L’avis de situation s’obtient en ligne, gratuitement.' },
  { voie: 'Cooptation', texte: 'Tu es salarié·e. Une attestation de ton employeur, ou la cooptation d’un participant déjà inscrit.' },
]

/* Le lieu, en fiche clé / valeur (T+05). */
export const LIEU = [
  ['Départ', 'Village et sas de départ au pied de la Grande Arche.'],
  ['Parcours', 'Un tracé fermé entre les tours : esplanade, parvis et dalles. Une ou plusieurs boucles selon la distance.'],
  ['Arrivée', 'En salle, dans Paris La Défense Arena. La ligne est à l’intérieur.'],
  ['Après la ligne', 'Déjeuner, rencontres et soirée dans l’Arena, jusqu’au soir.'],
  ['Venir', 'Métro ligne 1, RER A, Transilien L, station La Défense Grande Arche.'],
]

/* Les adresses du site. */
export const CONTACTS = {
  contact: 'contact@runoninvest.fr',
  dossiers: 'dossiers@runoninvest.fr',
  entreprises: 'entreprises@runoninvest.fr',
  partenariats: 'partenariats@runoninvest.fr',
}

/* Celles et ceux qui courent cette année (aperçu de l'annuaire). */
export const QUI_COURT = ['Sarah Khalil', 'Marc Dubois', 'Nadia Cherif', 'Léa Fontaine', 'Yanis Benali', 'Claire Moreau']
export const INSCRITS = 2412
