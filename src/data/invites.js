/* Invitations & parrainage (démo). On invite des gens de l'extérieur par
   e-mail ou lien, et on suit leur statut. Le plan Business gère des sièges. */

export const REFERRAL = {
  code: 'THOMAS-ROI',
  url: 'https://roi.app/i/THOMAS-ROI',
  reward: 'Invite 3 personnes qui rejoignent → 1 mois Pro offert.',
  goal: 3,
}

/* Invitations déjà envoyées (statut : pending | joined). */
export const INITIAL_INVITES = [
  { id: 'inv-1', name: 'Julie Marchand', email: 'julie.marchand@gmail.com', status: 'joined', context: 'A rejoint ROI', date: 'il y a 3 j' },
  { id: 'inv-2', name: 'Paul Girard', email: 'paul.girard@outlook.com', status: 'pending', context: 'Invitation envoyée', date: 'il y a 1 j' },
]

/* Avantages mis en avant dans la rubrique « Inviter ». */
export const INVITE_PERKS = [
  { icon: 'gift', tone: 'amber', title: '1 mois Pro offert', text: 'Dès que 3 invité·es rejoignent ROI.' },
  { icon: 'sparkles', tone: 'brand', title: 'Réseau plus riche', text: 'Plus de monde = de meilleurs matchs IA.' },
  { icon: 'users', tone: 'emerald', title: 'Cours accompagné·e', text: 'Invite tes contacts à tes sorties.' },
]

/* Coéquipiers d'un espace Business (sièges). */
export const INITIAL_TEAMMATES = [
  { id: 't-1', name: 'Camille Rousseau', email: 'camille@stealth.io', role: 'Admin', status: 'active' },
]
