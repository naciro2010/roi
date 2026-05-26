/* Réseau de l'utilisateur.
   CONNECTIONS = relations acceptées · REQUESTS = demandes reçues à traiter.
   Les demandes *envoyées* sont dérivées de l'état runtime (contacted). */

export const CONNECTIONS = [
  { name: 'Claire Moreau', context: 'Rencontrée au Run & Pitch' },
  { name: 'Marc Dubois', context: 'Sorties longues du dimanche' },
  { name: 'Nadia Cherif', context: 'Croisée au défi 10 km' },
  { name: 'Léa Fontaine', context: 'Présentée par Claire' },
  { name: 'Karim Haddad', context: 'Échange sur ta seed' },
]

export const REQUESTS = [
  { name: 'Inès Roy', context: 'VC early-stage · veut parler de ta seed' },
  { name: 'Hugo Bernard', context: 'Recrute tech & ops · t’a croisé au fractionné' },
]
