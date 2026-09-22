/* ==========================================================================
   LES NOUVELLES DE R.O.I — la voix de l'organisation.

   C'est la première vocation de l'app : entre deux éditions, on ne laisse
   pas les gens sans nouvelles. Le parcours, les vagues, le programme, ce que
   l'édition précédente a produit. Une nouvelle = un fait, une date, et ce
   que ça change pour toi. Jamais de communiqué.

   `categorie` : 'course' (l'épreuve) · 'reseau' (ce que ça produit) ·
   'pratique' (ce qu'il faut savoir faire). `epingle` remonte en tête.
   ========================================================================== */

export const CATEGORIES = {
  course: { label: 'La course', icon: 'flag' },
  reseau: { label: 'Le réseau', icon: 'users' },
  pratique: { label: 'Pratique', icon: 'shield' },
}

export const NEWS = [
  {
    id: 'a1',
    date: '2026-09-18',
    categorie: 'course',
    epingle: true,
    titre: 'Le parcours de l’Édition 01 est bouclé',
    chapo: 'Départ au pied de la Grande Arche, tracé fermé entre les tours, arrivée à l’intérieur de l’Arena. Les trois distances partagent la même boucle.',
    texte:
      'Le tracé est validé avec la préfecture et Paris La Défense : une boucle de 5 km sur l’esplanade, les parvis et les dalles, entièrement fermée à la circulation. Le 10 km en fait deux, le 21,1 km quatre, plus la portion mesurée qui amène à la distance officielle.\n\nCe qui change pour toi : le départ se fera par sas d’allure au pied de la Grande Arche, et la ligne d’arrivée est à l’intérieur de Paris La Défense Arena. Tu franchis la ligne en salle, tu reprends ton souffle, et la journée continue sans que personne n’ait à se déplacer.',
  },
  {
    id: 'a2',
    date: '2026-09-10',
    categorie: 'reseau',
    titre: 'Les rencontres de l’après-midi passent à huit minutes pile',
    chapo: 'Sur la Pilote, elles duraient « le temps qu’il faut ». Ça ne marchait que pour ceux qui savent partir.',
    texte:
      'Huit minutes, une sonnerie, on change de table. C’est court, et c’est exprès : en huit minutes on sait si on a envie de se revoir, et personne n’est coincé une heure avec quelqu’un qu’il ne cherchait pas.\n\nCe qui change pour toi : tu choisis qui tu veux voir depuis l’app, dans les six semaines qui précèdent la course. On s’occupe de l’ordre et des tables. En Premium, six rencontres sont réservées à l’avance.',
  },
  {
    id: 'a3',
    date: '2026-09-02',
    categorie: 'pratique',
    titre: 'La vague Early Bird court jusqu’au 28 février',
    chapo: '350 €, quelle que soit la distance. Ensuite 400 €, puis 500 € en Last Call.',
    texte:
      'Le tarif ne dépend pas de la distance : 5, 10 ou 21,1 km, c’est le même dossard et le même accès à l’après-midi. Ce qui fait monter le prix, c’est le moment où tu prends ta place.\n\nCe qui change pour toi : si ta place n’est pas prise, elle l’est à 350 € jusqu’au 28 février 2027. Le justificatif (Kbis, avis SIRENE ou cooptation) peut suivre — c’est la demande qui garde le tarif.',
  },
  {
    id: 'a4',
    date: '2026-08-21',
    categorie: 'reseau',
    titre: '2 412 dossards pris — six fois la Pilote',
    chapo: 'À quinze mois du départ, l’Édition 01 a déjà dépassé six fois le peloton de la Pilote.',
    texte:
      'Sur les 2 412 places prises, 41 % viennent d’une recommandation d’un finisher de la Pilote. C’est la cooptation qui fait le peloton, pas la publicité — et c’est très bien comme ça.\n\nCe qui change pour toi : l’annuaire s’étoffe chaque semaine. Les propositions du lundi matin sont tirées de ce peloton, pas d’une base achetée.',
  },
  {
    id: 'a5',
    date: '2026-07-15',
    categorie: 'course',
    titre: 'Paris La Défense Arena signe pour trois éditions',
    chapo: 'L’Arena accueille l’arrivée et l’après-midi jusqu’en 2029. La date ne bougera plus : fin novembre, chaque année.',
    texte:
      'Trois éditions engagées, avec la même salle et la même date : le dernier samedi de novembre. C’est ce qu’il fallait pour que le rendez-vous devienne une habitude plutôt qu’un événement.\n\nCe qui change pour toi : tu peux caler ton année dessus. La prochaine est le samedi 27 novembre 2027.',
  },
  {
    id: 'a6',
    date: '2026-06-30',
    categorie: 'reseau',
    titre: 'Ce que la Pilote a produit, huit mois après',
    chapo: '380 finishers, 1 240 rencontres de huit minutes, et de quoi savoir que le format tient.',
    texte:
      'On a rappelé les 380 finishers de novembre 2025. Huit mois après : 1 240 rencontres tenues le jour J, 310 conversations qui ont continué, 47 recrutements, 12 levées avancées, 9 associations. Et 61 % qui disent avoir revu au moins une personne rencontrée ce jour-là.\n\nCe qui change pour toi : c’est le chiffre qui nous sert de cahier des charges pour l’Édition 01. Si l’après-midi ne produit pas ça, il est raté.',
  },
]

/* Les nouvelles, épinglées d'abord, puis de la plus récente à la plus ancienne. */
export const NOUVELLES = [...NEWS].sort((a, b) => (b.epingle ? 1 : 0) - (a.epingle ? 1 : 0) || b.date.localeCompare(a.date))

export const nouvelleById = (id) => NEWS.find((n) => n.id === id)

/* « Il y a 4 jours » · « 12 sept. » — la date d'une nouvelle, courte. */
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
export function dateNouvelle(iso, now = new Date()) {
  const d = new Date(`${iso}T00:00:00`)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const jours = Math.round((today - d) / 86400000)
  if (jours <= 0) return 'aujourd’hui'
  if (jours === 1) return 'hier'
  if (jours < 7) return `il y a ${jours} jours`
  if (jours < 30) return `il y a ${Math.round(jours / 7)} sem.`
  return `${d.getDate()} ${MOIS[d.getMonth()]}`
}
