# App Store Connect — fiche de l'app

## Informations de l'app
- **Nom** (30 car. max) : `R.O.I — Run On Investment`
- **Sous-titre** (30) : `Courir, puis faire affaire`
- **Bundle ID** : `fr.runoninvest.app`
- **SKU** : `roi-app-ios`
- **Catégorie principale** : Business · **secondaire** : Réseaux sociaux
- **Langue principale** : Français (France)
- **Appareils** : iPhone uniquement (portrait)

## Mots-clés (100 car. max, séparés par des virgules)
```
networking,course,running,entrepreneur,dirigeant,réseau,La Défense,rencontre,business,investisseur
```

## Texte promotionnel (170)
```
Édition 01 : samedi 27 novembre 2027, Paris La Défense. Retrouve ton dossard, ta route vers le départ et les rencontres qui comptent.
```

## Description (4 000)
```
R.O.I — Run On Investment, c'est une course par an au cœur de Paris La Défense, et un réseau toute l'année entre deux lignes d'arrivée.

L'app est réservée à celles et ceux qui ont déjà couru un R.O.I. On n'y entre pas en s'abonnant : on y entre en ayant franchi la ligne.

TON DOSSARD ET TA ROUTE VERS LA COURSE
• Ton numéro de dossard, ta distance (5, 10 ou 21,1 km) et ton sas de départ.
• Les six étapes jusqu'au jour J, et ce qui s'ouvre quand.
• Ton inscription faite sur runoninvest.fr, reliée en un geste.

DES RENCONTRES QUI ONT UN OBJET
• Chaque semaine, des propositions expliquées en une phrase : recruter, lever, vendre, s'associer.
• Une rencontre ne s'ouvre que si vous dites oui tous les deux. Personne ne voit ton e-mail ni ton téléphone.
• Huit minutes, un sujet, un lieu : à l'Arena le jour J, en courant, autour d'un café ou en visio.

COURIR À DEUX
• Propose une sortie à une allure où l'on peut encore parler.
• Les kilomètres courus à plusieurs remontent dans ta semaine.

LE SUIVI DE TES RELATIONS
• Où en est chaque relation, de la première rencontre à ce qu'elle a produit.

LES NOUVELLES DE R.O.I
• Le parcours, les vagues, le programme de l'après-midi : un fait, une date, et ce que ça change pour toi.

CONFIDENTIALITÉ
Aucune publicité, aucun pisteur. Tes données restent sur ton téléphone ; tu peux les effacer à tout moment depuis l'app.

Le dossard se prend sur runoninvest.fr.
```

## Nouveautés de la version 1.0.0
```
Première version : ton dossard, ta route vers l'Édition 01, les rencontres et les nouvelles de R.O.I.
```

## Classification par âge
Questionnaire : toutes les réponses « Aucun / Non », sauf **« Contenu généré par les utilisateurs ou messagerie »** → *Oui* (messages entre membres). Résultat attendu : **12+** (messagerie sans modération en temps réel). L'app vise des professionnels majeurs.

## Confidentialité de l'app (« App Privacy »)
« Collectez-vous des données ? » → **Oui**, uniquement :

| Type | Lié à l'identité | Suivi | Finalité |
|---|---|---|---|
| Coordonnées → Adresse e-mail | Oui | Non | Fonctionnalité de l'app |
| Identifiants → Identifiant utilisateur (référence de dossier) | Oui | Non | Fonctionnalité de l'app |

Rien d'autre (pas de localisation, pas d'analyse, pas de diagnostic, pas de publicité). Ces réponses correspondent à `ios/App/App/PrivacyInfo.xcprivacy`.

## Prix et disponibilité
Gratuite. Pas d'achat intégré dans la version 1.0 (voir « Abonnement » dans DEPLOIEMENT.md).

## Chiffrement (export compliance)
`ITSAppUsesNonExemptEncryption = NO` est déjà dans l'Info.plist : HTTPS seulement, aucune question à chaque envoi.

## Notes pour l'équipe de revue (App Review Information)
```
R.O.I is a networking app for people who ran the R.O.I race (Paris La Défense). The app opens directly on a sample member profile (Thomas), so no login is needed to review it: all features (meetings, messages, race bib, news) are usable as is.

Race bibs are purchased on our website (runoninvest.fr) — they are tickets for a physical event. The app contains no in-app purchase and no link to buy a digital subscription.

Account deletion: Profile → "Confidentialité et suppression du compte".
Contact: contact@runoninvest.fr
```
- **Identifiants de démo** : aucun (pas d'écran de connexion).
