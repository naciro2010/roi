# Publier R.O.I sur Google Play et l'App Store

L'app est une PWA React emballée par **Capacitor 8** (`fr.runoninvest.app`). Le code natif est dans `android/` et `ios/`.
Ce document sépare ce qui est **fait dans le repo** de ce qui **reste à faire par une personne** (comptes, clés, consoles).

## 1. Fait dans le repo

| Sujet | Où |
|---|---|
| Enveloppe native Android + iOS | `android/`, `ios/`, `capacitor.config.json` |
| Icônes (toutes tailles), écran de lancement, icône adaptative | `resources/` → `npm run assets` |
| Manifeste PWA complet (icônes 192/512/maskable), service worker hors ligne (web seulement) | `public/` |
| Signature Android, `versionCode` piloté par l'environnement | `android/app/build.gradle` |
| Achats intégrés (RevenueCat), « Restaurer », mentions d'abonnement | `src/lib/billing.js`, `PlansSheet.jsx` |
| Politique de confidentialité + CGU (in-app **et** pages web `/confidentialite.html`, `/cgu.html`) | `src/data/legal.js`, `scripts/build-legal.mjs` |
| Suppression de compte dans l'app | `DeleteAccountSheet.jsx`, `src/lib/compte.js` |
| Signaler / bloquer (fiche membre, fil) ; les bloqués disparaissent partout | `Signaler.jsx`, `MemberSheet.jsx`, `App.jsx` |
| Bouton retour Android, barre d'état, splash, push (désactivé tant que Firebase/APNs ne sont pas configurés) | `src/lib/native.js` |
| Contrôles « démo » masqués en natif | `Profil.jsx` |
| API côté site : suppression + signalements | repo `Site-roi`, branche `claude/store-account-endpoints` |
| CI : build web + APK debug ; bundle Android signé en un clic | `.github/workflows/` |

## 2. À faire avant la soumission (bloquant)

1. **Compléter `ENTITE` dans `src/data/legal.js`** : raison sociale, adresse, SIREN, directeur de publication. Faire relire par un juriste. Puis `npm run build`.
2. **Déployer la branche `claude/store-account-endpoints` de `Site-roi`** (suppression de compte et signalement). Sans elle, la suppression échoue proprement avec un message — elle ne ment pas — et un compte relié ne peut pas être supprimé.
3. **Héberger les pages légales** sur une URL publique stable (`https://roi-mvp.up.railway.app/confidentialite.html` marche dès le déploiement ; idéalement la copier sur `runoninvest.fr/confidentialite`).
4. **Remplacer les données fictives par de vraies données.** L'app affiche des profils, messages et rencontres inventés (`src/data/*`). Apple refuse une app qui n'est qu'une démo (4.2) et les « membres » fictifs sont trompeurs pour les utilisateurs. Il faut un back-end pour l'annuaire, les messages et le fil — le site (`Site-roi`) ne porte aujourd'hui que les comptes.
5. **Modération réelle** : quelqu'un doit lire les signalements (`signalements` dans `data/comptes.json` du site) et agir sous 24 h, comme le promettent les CGU.

## 3. Comptes et consoles (par une personne)

### Google Play
1. Console : <https://play.google.com/console> — 25 $ une fois, vérification d'identité.
2. Compte **personnel** créé après nov. 2023 : test fermé de **12 testeurs pendant 14 jours** avant la production. Un compte **organisation** (D-U-N-S) en est dispensé.
3. Créer l'app `fr.runoninvest.app`, **Play App Signing activé**.
4. Générer la clé d'upload : `keytool -genkey -v -keystore upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload` — **sauvegarder le .jks et les mots de passe hors du repo** (coffre-fort).
5. Secrets GitHub : `ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `VITE_REVENUECAT_ANDROID_KEY`.
6. Actions → **Android — bundle signé** → Run workflow (version code 1, 2, 3…) → télécharger `app-release.aab` → Play Console → Test fermé → créer une version → importer.
7. Fiche du store (textes en §5), captures, **Data safety** (§6), classification du contenu (IARC), public cible **18+**, déclaration « contenu généré par les utilisateurs », URL de confidentialité.
8. Abonnements : *Monétiser → Produits → Abonnements* : `roi_membre_mensuel`, `roi_membre_annuel`, `roi_premium_mensuel`, `roi_premium_annuel`.

### App Store (nécessite un Mac avec Xcode)
1. <https://developer.apple.com/programs/> — 99 $/an. Organisation = numéro D-U-N-S (jusqu'à 2 semaines).
2. `npm ci && npm run cap:ios` ouvre Xcode. Onglet *Signing & Capabilities* : choisir l'équipe, bundle id `fr.runoninvest.app`. Ajouter *In-App Purchase*. (Ajouter *Push Notifications* seulement quand les notifications seront prêtes.)
3. Définir `VITE_REVENUECAT_IOS_KEY` avant `npm run build` (fichier `.env.production.local`, non versionné).
4. *Product → Archive* → *Distribute App* → App Store Connect → **TestFlight** pour tester sur de vrais iPhone.
5. App Store Connect : fiche (§5), captures **6,9″** (iPhone 16 Pro Max) et 6,5″, URL de confidentialité, **App Privacy** (§6), classification d'âge, notes de revue (§7).
6. Abonnements : *Monétisation → Abonnements*, un groupe `R.O.I`, mêmes identifiants produit que sur Android.
7. Soumettre à la revue (24–48 h ; un ou deux allers-retours sont normaux).

### RevenueCat (<https://app.revenuecat.com>, gratuit jusqu'à 2 500 $/mois)
Créer le projet, relier App Store Connect et Google Play, créer les *entitlements* **`membre`**, **`premium`**, **`cercle`** et une *offering* « current » contenant les produits ci-dessus. Les clés SDK publiques vont dans les variables `VITE_REVENUECAT_*_KEY`. Le palier Cercle n'est pas achetable (sur cooptation).

> ⚠ L'état de l'abonnement est relu depuis RevenueCat au démarrage. Sans back-end, un utilisateur qui désinstalle/réinstalle le retrouve via « Restaurer mes achats ».

### Notifications push (facultatif, après lancement)
Android : projet Firebase → `google-services.json` dans `android/app/`. iOS : clé APNs dans Firebase + capability Push. Tant que ce n'est pas fait, `activerPush()` renvoie `null`.

## 4. Mises à jour
`npm run cap:sync` après chaque changement web. Incrémenter `versionCode` (Android) / `CURRENT_PROJECT_VERSION` (iOS) à **chaque** envoi.

## 5. Textes de fiche (à adapter)
**Nom** : R.O.I — Run On Investment (≤ 30 car.)
**Sous-titre / description courte** : Une course. Un réseau toute l'année.
**Description** :
> R.O.I, c'est une course par an au cœur de Paris La Défense, et un réseau d'entrepreneurs qui continue entre deux lignes d'arrivée.
> Dans l'app : ton dossard et les nouvelles de la course, trois rencontres proposées chaque semaine (recruter, lever, vendre, s'associer), des sorties à allure de conversation, et le suivi de ce que chaque rencontre produit.
> Réservée à celles et ceux qui ont couru une édition. Abonnement Membre (9 €/mois ou 90 €/an) et Premium (29 €/mois ou 290 €/an), à reconduction automatique, résiliable à tout moment dans les réglages de ton compte.
**Catégorie** : Business (ou Santé et forme). **Mots-clés iOS** : course,running,réseau,entrepreneur,networking,La Défense,rencontres

## 6. Déclarations de confidentialité
**Collecte** (à reporter dans *Data safety* et *App Privacy*) :
- Nom, e-mail, fonction, entreprise (lus depuis le dossier du site) — lié à l'identité, fonctionnalité de l'app, **non utilisé pour le suivi**.
- Contenu utilisateur (messages, publications) — stocké sur l'appareil.
- Identifiant d'appareil pour les notifications — seulement si activées.
- Achats : état de l'abonnement (RevenueCat).
- Pas de publicité, pas de SDK de pistage, pas de localisation en arrière-plan. Données chiffrées en transit (HTTPS) ; suppression possible dans l'app.

## 7. Notes pour les relecteurs (App Store Connect → *Notes*)
> R.O.I est réservée aux participants d'une édition de la course. Aucune connexion n'est nécessaire pour la revue : l'app s'ouvre sur un profil de démonstration disposant d'un abonnement actif. L'inscription à la course se fait sur runoninvest.fr (hors app). Les abonnements numériques (Membre, Premium) s'achètent via achats intégrés ; le palier Cercle est accordé sur cooptation. Signaler/bloquer : fiche d'un membre ; supprimer le compte : Profil → Supprimer mon compte.

## 8. Risques de refus connus
- **Apple 4.2 / 2.1** : app à données fictives → voir §2.4.
- **Apple 3.1.1** : un abonnement numérique réglé hors de l'app est refusé. Le code natif passe par les achats intégrés ; ne pas rétablir de lien de paiement externe dans la version iOS.
- **Apple 1.2 / Google UGC** : signaler, bloquer, modérer — fait, à tenir dans le temps (§2.5).
- **Apple 5.1.1(v)** : suppression de compte dans l'app — faite, nécessite l'API du site.
- **Google** : compte personnel → 14 jours de test fermé obligatoires.
