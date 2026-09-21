/* Toi : Thomas Lefèvre. Le verso de ton dossard (nom, fonction, entreprise,
   formule) et ce que le profil ajoute : ce que tu cherches, ce que tu apportes. */

export const CURRENT_USER = {
  name: 'Thomas Lefèvre',
  title: 'Fondateur · SaaS B2B',
  role: 'Fondateur',
  company: 'SaaS B2B · en amorçage',
  location: 'Paris 11e',
  community: 'Édition 01',
  joined: 'Dossard pris en septembre 2026',
  bio: "Je construis un SaaS B2B : un tableau de bord, et l’onboarding qui va avec. Je prépare une levée d’amorçage. Je cours le matin, le long de la Seine, à une allure où l’on peut encore parler.",
  needs: ['Lève · une levée d’amorçage', 'Recrute · un développeur React', 'Des conseils de dirigeants qui ont déjà structuré une équipe'],
  offering: ['Des retours produit', 'Des présentations dans le SaaS B2B'],
  interests: ['Levée d’amorçage', 'Produit', 'Sorties longues', 'Café d’arrivée', 'Design'],
  stats: { km: 42, sorties: 6, defis: 2 },
  // Volume des 7 derniers jours (lun→dim), en km — pour le résumé « Cette semaine ».
  week: { days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], km: [6.2, 0, 8.1, 5.3, 0, 12.4, 4.5], runs: 5, time: '3:21:00' },
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
