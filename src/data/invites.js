/* La cooptation (démo). Tu proposes un dossard à un dirigeant que tu connais :
   c'est l'une des trois voies d'accès (Kbis, avis SIRENE, cooptation). Deux
   membres qui te cooptent ouvrent le Cercle. Le Cercle gère trois dossards
   invités pour ton équipe. */

export const REFERRAL = {
  code: 'THOMAS-ROI',
  url: 'https://roi-mvp.up.railway.app/?coopte=THOMAS-ROI',
  reward: 'Propose un dossard à un dirigeant que tu connais : ta cooptation vaut justificatif. À deux cooptations, le Cercle s’ouvre.',
  goal: 2,
}

/* Cooptations déjà envoyées (statut : pending | joined). */
export const INITIAL_INVITES = [
  { id: 'inv-1', name: 'Julie Marchand', email: 'julie.marchand@gmail.com', status: 'joined', context: 'A pris son dossard', date: 'il y a 3 j' },
  { id: 'inv-2', name: 'Paul Girard', email: 'paul.girard@outlook.com', status: 'pending', context: 'Cooptation envoyée', date: 'il y a 1 j' },
]

/* Ce que la cooptation ouvre, mis en avant dans la rubrique « Coopter ». */
export const INVITE_PERKS = [
  { icon: 'gift', tone: 'amber', title: 'L’accès au dossard', text: 'Ta cooptation vaut justificatif : pas de Kbis à fournir pour la personne que tu proposes.' },
  { icon: 'sparkles', tone: 'brand', title: 'Le Cercle à deux cooptations', text: 'Quarante places, sur cooptation. Deux membres qui te cooptent suffisent.' },
  { icon: 'users', tone: 'emerald', title: 'Courir accompagné·e', text: 'Celles et ceux que tu cooptes courent l’édition à tes côtés, et tes sorties avec.' },
]

/* Les dossards invités d'un Cercle (ton équipe, tes associés). */
export const INITIAL_TEAMMATES = [
  { id: 't-1', name: 'Camille Rousseau', email: 'camille@stealth.io', role: 'Admin', status: 'active' },
]
