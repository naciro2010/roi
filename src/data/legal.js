/* ==========================================================================
   MENTIONS LÉGALES — source unique.
   Affichées dans l'app (LegalSheet) et publiées en pages web par
   `scripts/build-legal.mjs` (/confidentialite.html, /cgu.html), car les stores
   exigent une URL publique de politique de confidentialité.

   ⚠ À COMPLÉTER AVANT SOUMISSION : les champs ENTITE ci-dessous. Ce texte est
   un socle sérieux mais il doit être relu par la personne qui représente la
   société (et, idéalement, un juriste).
   ========================================================================== */

export const ENTITE = {
  nom: 'R.O.I — Run On Investment',
  editeur: '[Raison sociale, forme juridique et capital]',
  siege: '[Adresse du siège]',
  immat: '[SIREN / RCS]',
  directeur: '[Nom du directeur de la publication]',
  hebergeur: 'Railway Corp. (San Francisco, États-Unis)',
  contact: 'contact@runoninvest.fr',
  maj: '13 octobre 2026',
}

export const LEGAL = {
  confidentialite: {
    titre: 'Confidentialité',
    intro: `Cette politique explique quelles données l’application R.O.I (« l’app ») utilise, pourquoi, et comment les contrôler. Responsable du traitement : ${ENTITE.nom}, ${ENTITE.contact}.`,
    sections: [
      {
        t: 'Ce que l’app garde sur ton appareil',
        p: [
          'Ton profil, tes réglages, tes conversations, tes rencontres et ton suivi sont enregistrés sur ton appareil (stockage local). Ils ne quittent pas l’appareil, sauf ce qui est décrit ci-dessous.',
          'Tu peux tout effacer à tout moment : Profil → Supprimer mon compte.',
        ],
      },
      {
        t: 'Ce que l’app échange avec runoninvest.fr',
        p: [
          'Si tu relies ton inscription (référence + e-mail), l’app lit ton dossier sur runoninvest.fr : nom, fonction, distance choisie, état du dossier. Cette lecture est la seule donnée personnelle qui entre dans l’app depuis nos serveurs.',
          'Quand tu signales un membre, le signalement (nom du membre, motif, ta référence de dossier) est envoyé à l’équipe pour examen. Quand tu demandes la suppression de ton compte, la demande (référence + e-mail) est envoyée au site.',
        ],
      },
      {
        t: 'Abonnement et paiement',
        p: [
          'Sur iPhone et Android, l’abonnement se règle via l’App Store ou Google Play : nous ne voyons ni ta carte, ni tes moyens de paiement. Nous recevons seulement l’état de ton abonnement (palier, échéance) par notre prestataire RevenueCat.',
        ],
      },
      {
        t: 'Notifications',
        p: ['Les notifications ne sont activées que si tu les acceptes. Dans ce cas, un identifiant d’appareil est transmis à Apple ou Google pour acheminer le message. Tu peux les couper dans les réglages de ton téléphone.'],
      },
      {
        t: 'Services connectés (facultatif)',
        p: ['Strava, ta montre ou LinkedIn ne sont reliés que si tu le demandes. Tu choisis ce qui est partagé et tu peux déconnecter à tout moment.'],
      },
      {
        t: 'Ce que nous ne faisons pas',
        p: ['Pas de publicité, pas de revente de données, pas de pisteur tiers, pas de suivi de ta position en arrière-plan.'],
      },
      {
        t: 'Durée de conservation',
        p: ['Les données locales restent jusqu’à ce que tu les effaces ou désinstalles l’app. Les données du dossier sur runoninvest.fr sont conservées pendant la durée de la relation, puis trois ans, sauf obligation légale contraire. Après une demande de suppression, elles sont effacées sous 30 jours.'],
      },
      {
        t: 'Tes droits (RGPD)',
        p: [
          `Tu peux accéder à tes données, les corriger, les exporter, t’opposer à leur traitement ou les faire effacer. Écris à ${ENTITE.contact} ; nous répondons sous un mois. Tu peux aussi saisir la CNIL (cnil.fr).`,
          'Les transferts hors de l’Union européenne (hébergement, RevenueCat) sont encadrés par des clauses contractuelles types.',
        ],
      },
      {
        t: 'Mineurs',
        p: ['L’app est réservée aux personnes de 18 ans et plus.'],
      },
    ],
  },
  cgu: {
    titre: 'Conditions d’utilisation',
    intro: `Conditions d’utilisation de l’application ${ENTITE.nom}. En l’utilisant, tu les acceptes.`,
    sections: [
      {
        t: 'Qui peut utiliser l’app',
        p: ['L’app est réservée aux personnes majeures qui ont couru une édition de R.O.I. Un abonnement à jour garde l’accès complet ouvert ; à son terme, l’app passe en lecture seule.'],
      },
      {
        t: 'Abonnement',
        p: [
          'Les paliers Membre (9 €/mois ou 90 €/an) et Premium (29 €/mois ou 290 €/an) sont des abonnements à reconduction automatique. Sur iPhone et Android, le paiement est prélevé sur ton compte Apple ou Google à la confirmation de l’achat, et l’abonnement se renouvelle automatiquement sauf annulation au moins 24 h avant la fin de la période en cours.',
          'Tu gères et résilies ton abonnement dans les réglages de ton compte App Store ou Google Play. Le palier Cercle (190 €/mois) est accordé sur cooptation et se règle hors de l’app.',
          'Résilier ne retire pas ton dossard : cela ferme le réseau, pas la course.',
        ],
      },
      {
        t: 'Comportement attendu',
        p: [
          'Sois respectueux. Sont interdits : le harcèlement, les propos haineux, discriminatoires ou sexuellement explicites, l’usurpation d’identité, le démarchage commercial non sollicité, le spam, et tout contenu illégal.',
          'Tu peux signaler ou bloquer un membre depuis sa fiche, et signaler un message du fil. Nous examinons chaque signalement sous 24 h et pouvons retirer un contenu ou suspendre un compte qui enfreint ces règles.',
        ],
      },
      {
        t: 'Tes contenus',
        p: ['Ce que tu publies reste à toi. Tu nous autorises à l’afficher aux autres membres dans l’app, pour la durée où tu le laisses en ligne.'],
      },
      {
        t: 'Rencontres et sorties',
        p: ['Les rencontres et les sorties se font sous ta responsabilité. Choisis des lieux publics pour une première rencontre, et cours dans le respect de ta condition physique. R.O.I n’est pas responsable des échanges entre membres.'],
      },
      {
        t: 'Disponibilité et responsabilité',
        p: ['Nous faisons de notre mieux pour que l’app soit disponible, sans garantie d’absence d’interruption. Notre responsabilité est limitée dans la mesure permise par la loi.'],
      },
      {
        t: 'Suppression du compte',
        p: ['Tu peux supprimer ton compte depuis Profil → Supprimer mon compte. Le droit applicable est le droit français ; les tribunaux de Paris sont compétents, sous réserve des droits des consommateurs.'],
      },
      {
        t: 'Éditeur',
        p: [`${ENTITE.editeur} — ${ENTITE.siege} — ${ENTITE.immat}. Directeur de la publication : ${ENTITE.directeur}. Hébergeur : ${ENTITE.hebergeur}. Contact : ${ENTITE.contact}.`],
      },
    ],
  },
}
