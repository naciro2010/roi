# Google Play Console — fiche de l'app

## Détails de l'app
- **Nom de l'app** (30) : `R.O.I — Run On Investment`
- **Nom du package** : `fr.runoninvest.app`
- **Langue par défaut** : Français (France) – fr-FR
- **App ou jeu** : App · **Gratuite**
- **Catégorie** : Entreprise · **Tags** : Réseautage, Course à pied, Événements
- **E-mail de contact** : contact@runoninvest.fr · **Site** : https://runoninvest.fr

## Description courte (80)
```
Une course par an à Paris La Défense. Un réseau d'entrepreneurs toute l'année.
```

## Description complète (4 000)
Reprendre la description de `app-store.md` (même texte, il tient dans la limite).

## Éléments graphiques
- Icône : `public/icon-512.png` (512 × 512)
- Bannière : `store/google-play/banniere-1024x500.png`
- Captures téléphone : `store/captures/android/*.png` (6 captures, 1080 × 2160)

## Contenu de l'app (rubrique « Règles »)
| Déclaration | Réponse |
|---|---|
| Politique de confidentialité | https://roi-mvp.up.railway.app/confidentialite.html |
| Accès à l'app | Toutes les fonctionnalités sont disponibles sans restriction (pas de connexion) |
| Annonces | Non, l'app ne contient pas d'annonces |
| Classification du contenu | Questionnaire IARC, catégorie « Réseaux sociaux / communication » : interaction entre utilisateurs **Oui**, partage de position **Non**, achats numériques **Non**. Résultat attendu : PEGI 12 / Tous publics + interactions |
| Public cible | 18 ans et plus |
| Appli d'actualité | Non |
| Applis gouvernementales / santé / financières | Non |
| Suppression du compte | https://roi-mvp.up.railway.app/suppression-compte.html — et dans l'app : Profil → Confidentialité et suppression du compte |

## Sécurité des données (« Data safety »)
- Collecte ou partage de données ? **Oui (collecte)**, **aucun partage** avec des tiers.
- Chiffrement en transit : **Oui** (HTTPS).
- Suppression sur demande : **Oui**.

| Catégorie | Type | Collecté | Partagé | Facultatif | Finalité |
|---|---|---|---|---|---|
| Informations personnelles | Adresse e-mail | Oui | Non | Oui (seulement pour relier son inscription) | Fonctionnement de l'app |
| Informations personnelles | ID utilisateur (référence de dossier) | Oui | Non | Oui | Fonctionnement de l'app |

Les données stockées uniquement sur l'appareil ne comptent pas comme « collectées » au sens de Google Play.

## Pistes de test
1. **Test interne** (jusqu'à 100 testeurs, sans revue) : premier envoi automatique par la CI (`android-release.yml`, piste `internal`).
2. Les comptes personnels créés après nov. 2023 doivent passer par un **test fermé de 12 testeurs pendant 14 jours** avant la production. Un compte **Organisation** (avec numéro D-U-N-S) en est dispensé.
3. **Production** : promouvoir la version depuis la Play Console, ou relancer le workflow avec la piste `production` (envoyée en brouillon).
