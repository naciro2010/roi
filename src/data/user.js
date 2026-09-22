/* Toi : Thomas Lefèvre. Qui tu es ici (nom, fonction, entreprise), ce que tu
   cherches, ce que tu apportes — et les deux choses qui ouvrent l'app :

   1. `editions` — les R.O.I que tu as déjà courus. L'app est réservée aux
      finishers : sans une édition au compteur, on ne rentre pas.
   2. `abonnement` — ce qui garde l'accès ouvert ensuite. Expiré, l'app passe
      en lecture seule (voir data/plans.js et App.jsx).

   `dossard` est ta place sur la prochaine édition : le numéro qu'on voit en
   ouvrant l'app, et l'état de ton dossier. */

export const CURRENT_USER = {
  name: 'Thomas Lefèvre',
  title: 'Fondateur · SaaS B2B',
  role: 'Fondateur',
  company: 'SaaS B2B · en amorçage',
  location: 'Paris 11e',
  community: 'Édition 01',
  joined: 'Dossard pris en décembre 2025',

  /* Ta place sur l'Édition 01 (27 novembre 2027). `sas` reste vide tant que
     les sas ne sont pas attribués — trois mois avant la course. */
  dossard: { numero: 1042, edition: '01', distance: '10', statut: 'valide', sas: null },

  /* Les R.O.I déjà courus — le laissez-passer. */
  editions: [
    {
      edition: '00', nom: 'La Pilote', lieu: 'Bois de Vincennes', date: '2025-11-22',
      numero: 142, distance: '10', chrono: '52:18', allure: '5:14',
      classement: 63, finishers: 380,
      rencontres: 9, note: 'Neuf personnes rencontrées, deux qui comptent encore.',
    },
  ],

  /* L'abonnement qui garde l'accès ouvert. `statut` : actif | expire. */
  abonnement: {
    palier: 'membre',
    statut: 'actif',
    periodicite: 'annuel',
    depuis: '2025-12-02',
    echeance: '2026-12-02',
  },
  bio: "Je construis un SaaS B2B : un tableau de bord, et l’onboarding qui va avec. Je prépare une levée d’amorçage. Je cours le matin, le long de la Seine, à une allure où l’on peut encore parler.",
  needs: ['Lève · une levée d’amorçage', 'Recrute · un développeur React', 'Des conseils de dirigeants qui ont déjà structuré une équipe'],
  offering: ['Des retours produit', 'Des présentations dans le SaaS B2B'],
  interests: ['Levée d’amorçage', 'Produit', 'Sorties longues', 'Café d’arrivée', 'Design'],
  stats: { km: 42, sorties: 6, defis: 2 },
  // Volume des 7 derniers jours (lun→dim), en km — pour le résumé « Cette semaine ».
  // `kmAvec` : la part courue avec au moins une autre personne.
  week: { days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], km: [6.2, 0, 8.1, 5.3, 0, 12.4, 4.5], runs: 5, time: '3:21:00', kmAvec: 27.6 },
  roi: {
    score: 78,
    weekDelta: 6,
    connections: 34,
    meetings: 12,
    opportunities: 5,
    connectionsDelta: 4,
    meetingsDelta: 2,
    opportunitiesDelta: 1,
    // Évolution sur les dernières semaines (pour la courbe de l'accueil).
    trend: [58, 61, 60, 66, 69, 72, 74, 78],
  },
}
