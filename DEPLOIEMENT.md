# Publier R.O.I sur l'App Store et Google Play

L'app web (React + Vite) est empaquetée en app native par **Capacitor 8** : le même code, embarqué dans une WebView, avec quelques gestes natifs (retour Android, barre d'état, retour haptique, liens profonds, onglet système pour les liens du site).

```
package.json            version de l'app (1.0.0) — Android et iOS la reprennent
capacitor.config.json   identifiant fr.runoninvest.app, nom « R.O.I », écran de lancement
android/                projet Android Studio (Gradle)
ios/                    projet Xcode (Swift Package Manager, sans CocoaPods)
assets/                 sources des icônes et écrans de lancement (npm run visuels)
store/                  textes, captures et réponses aux questionnaires des stores
public/confidentialite.html · suppression-compte.html · support.html   pages exigées par les stores
public/.well-known/     fichiers de vérification des liens profonds
.github/workflows/      CI, publication Google Play, publication TestFlight
```

## Les commandes

```bash
npm install
npm test                 # tests (vitest)
npm run build:store      # build web des stores : mode démo coupé (VITE_DEMO=false)
npm run natif:sync       # build:store + copie dans android/ et ios/
npm run android          # … puis ouvre Android Studio
npm run ios              # … puis ouvre Xcode (macOS)
npm run visuels          # régénère les PNG (PWA + assets/) depuis le signe R.O.I
npm run natif:visuels    # décline assets/ en icônes et écrans de lancement natifs
```

Après **toute** modification du code web : `npm run natif:sync` avant de builder en natif.

## Ce qui change dans les apps natives

| | Web | Android / iOS |
|---|---|---|
| Mode démo (« Aperçu des états », réinitialisation, faux finisher, connexions Strava/montre simulées) | visible | **masqué** (`VITE_DEMO=false`) |
| Abonnement : prix, boutons d'achat, lien « Gérer le règlement » | visibles | **masqués** — voir « Abonnement » plus bas |
| Liens vers runoninvest.fr | nouvel onglet | onglet du système (Safari View Controller / Custom Tabs) |
| Lien profond `?dossier=&email=` | à l'ouverture | aussi via `https://roi-mvp.up.railway.app/?dossier=…` et `roi://…?dossier=…` |
| Bouton retour | — | ferme la sheet du dessus, puis revient à l'accueil, puis sort |
| Service worker (hors ligne) | oui | non (les fichiers sont déjà dans l'app) |

Le code est dans `src/lib/natif.js` (`estNatif`, `modeDemo`, `ouvrirLien`, …).

---

## 1. Les comptes à ouvrir (une seule fois)

| | Apple | Google |
|---|---|---|
| Compte | [Apple Developer Program](https://developer.apple.com/programs/enroll/) — 99 $/an. **En organisation** (D-U-N-S requis) pour que le vendeur affiché soit « R.O.I », pas une personne | [Play Console](https://play.google.com/console/signup) — 25 $ une fois. **Organisation** conseillée : sinon, test fermé obligatoire de 12 testeurs × 14 jours avant la production |
| Créer l'app | App Store Connect → Apps → « + » → Bundle ID `fr.runoninvest.app`, SKU `roi-app-ios` | Play Console → Créer une app → « R.O.I — Run On Investment », français, app, gratuite |

## 2. Google Play

### 2.1 La clé d'envoi (une seule fois — à garder précieusement)

```bash
keytool -genkeypair -v -keystore roi-upload.jks -alias roi -keyalg RSA -keysize 4096 -validity 10000
```

Google Play gère la clé de signature finale (« Play App Signing », activé par défaut) ; ce fichier n'est que la **clé d'envoi**. Le ranger dans un coffre (1Password, Bitwarden…) avec ses mots de passe. **Ne jamais le commiter** (`*.jks` et `keystore.properties` sont ignorés).

Pour builder en local, créer `android/keystore.properties` :
```
storeFile=/chemin/vers/roi-upload.jks
storePassword=…
keyAlias=roi
keyPassword=…
```
puis `npm run natif:sync && cd android && ./gradlew bundleRelease` → `android/app/build/outputs/bundle/release/app-release.aab`.

### 2.2 Les secrets GitHub (Settings → Secrets and variables → Actions)

| Secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 roi-upload.jks` (macOS : `base64 -i roi-upload.jks`) |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du keystore |
| `ANDROID_KEY_ALIAS` | `roi` |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé |
| `PLAY_SERVICE_ACCOUNT_JSON` | *(facultatif)* JSON d'un compte de service Google Cloud invité dans la Play Console (Utilisateurs et autorisations → « Publier sur les pistes de test ») |

### 2.3 Le premier envoi — à la main

Google refuse l'envoi par API tant qu'aucune version n'a été déposée à la main :

1. Lancer **Actions → « Android — publication » → Run workflow** (ou pousser un tag `v1.0.0`).
2. Télécharger l'artefact `roi-release-aab`.
3. Play Console → Tests → **Test interne** → Créer une version → déposer le `.aab`.
4. Remplir la fiche et la rubrique « Contenu de l'app » avec `store/google-play.md`.

Les envois suivants partent seuls : tag `vX.Y.Z` → piste interne. Le `versionCode` est le numéro du run GitHub (toujours croissant) ; le `versionName` vient de `package.json`.

### 2.4 Les App Links

Une fois l'app signée par Google Play : Play Console → Configuration → **Intégrité de l'app** → copier l'empreinte **SHA-256 du certificat de signature de l'app**, la coller dans `public/.well-known/assetlinks.json` (à la place de `REMPLACER_PAR_…`), et redéployer l'app web. Sans ça, les liens `https://roi-mvp.up.railway.app/…` s'ouvrent dans le navigateur au lieu de l'app (le schéma `roi://` marche quand même).

## 3. App Store

### 3.1 La clé API App Store Connect

App Store Connect → Utilisateurs et accès → **Intégrations → Clés API App Store Connect** → générer une clé avec le rôle **Admin** (nécessaire pour que Xcode crée lui-même certificats et profils). Télécharger le `.p8` (une seule fois possible).

| Secret GitHub | Valeur |
|---|---|
| `APPLE_TEAM_ID` | Team ID (developer.apple.com → Membership, 10 caractères) |
| `ASC_KEY_ID` | Key ID de la clé |
| `ASC_ISSUER_ID` | Issuer ID (en haut de la page des clés) |
| `ASC_KEY_P8_BASE64` | `base64 -i AuthKey_XXXX.p8` |

### 3.2 Builder et envoyer sur TestFlight

- **Par la CI** : tag `vX.Y.Z` ou **Actions → « iOS — publication » → Run workflow**. Le runner macOS archive, signe (signature automatique, capacités Associated Domains comprises) et envoie sur TestFlight. `CFBundleShortVersionString` = version de `package.json`, `CFBundleVersion` = numéro du run.
- **Depuis un Mac** : `npm run ios` → dans Xcode, cible *App* → Signing & Capabilities → choisir l'équipe → Product → Archive → Distribute App → App Store Connect.

Puis App Store Connect → TestFlight : la version apparaît après traitement (10–30 min). L'ajouter à une version de l'app, remplir la fiche avec `store/app-store.md`, déposer les captures `store/captures/ios/`, **Soumettre pour vérification**.

### 3.3 Les liens universels

Remplacer `REMPLACER_PAR_TEAM_ID` dans `public/.well-known/apple-app-site-association` par le Team ID, et redéployer l'app web. Le fichier doit être servi **sans redirection**, en HTTPS, idéalement en `application/json`.

## 4. Publier une nouvelle version

1. Monter `version` dans `package.json` (ex. `1.0.1`).
2. Commit, puis `git tag v1.0.1 && git push origin v1.0.1`.
3. Les deux workflows de publication partent : `.aab` sur la piste interne Play, `.ipa` sur TestFlight.
4. Promouvoir en production dans chaque console.

---

## 5. Avant de soumettre — ce qui peut faire refuser l'app

Le packaging est prêt ; **le produit, lui, reste une maquette** (données fictives, aucun back-end). Ce qu'il faut savoir avant d'appuyer sur « Soumettre » :

1. **Données fictives (Apple 2.1 / 2.3, Google « fonctionnalité minimale »).** L'app s'ouvre sur un membre fictif (Thomas), avec des messages et des rencontres simulés ; une demande envoyée ne part chez personne. Apple refuse régulièrement les apps « démo ». Pour une vraie mise en production, il faut un back-end : comptes (connexion par le dossier du site, qui existe déjà via `/api/dossier`), annuaire, demandes de rencontre, messagerie. Pour un **test interne / TestFlight** auprès des finishers de La Pilote, l'app est publiable telle quelle.
2. **Abonnement (Apple 3.1.1, règles de paiement Google Play).** Un abonnement qui ouvre des fonctions de l'app est un contenu numérique : dans l'app native, il ne peut être vendu que par l'achat intégré d'Apple / Google Play Billing, et l'app ne doit pas renvoyer vers un paiement externe. C'est pourquoi l'app native n'affiche ni prix, ni bouton d'achat, ni lien vers le règlement. Le **dossard**, lui, est un billet pour un événement physique : le vendre sur le site est autorisé. Pour vendre l'abonnement dans l'app, brancher StoreKit / Play Billing (par exemple via RevenueCat) et déclarer les produits dans les deux consoles.
3. **App « enveloppe web » (Apple 4.2).** L'app ajoute du natif (liens profonds, retour haptique, bouton retour, onglet système) mais reste une WebView. Les notifications push (rendez-vous acceptés, messages) seraient le meilleur argument — elles demandent le back-end du point 1.
4. **Mentions légales.** Compléter la raison sociale, l'adresse et le SIREN dans `public/confidentialite.html` (commentaire `À compléter`).
5. **Suppression du compte.** Elle passe aujourd'hui par un e-mail à contact@runoninvest.fr (accepté par les deux stores si la demande est traitée). Quand le site aura une route de suppression, la brancher dans `ConfidentialiteSheet.jsx`.

## 6. Vérifié / à vérifier

- ✅ `npm test` (19 tests), `npm run build`, `npm run build:store`, `cap sync` sur les deux plateformes.
- ✅ CI GitHub : build web, APK debug Android, build iOS simulateur (sans signature).
- ⏳ Builds signés et envoi aux stores : dépendent des comptes et des secrets ci-dessus, pas testables sans eux.
- ⏳ Essai sur appareils réels : bouton retour, encoches (safe areas), ouverture des liens du site, lien profond depuis l'espace.
