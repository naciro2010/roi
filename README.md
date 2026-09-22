# R.O.I — Run On Investment · L'app

L'app de **R.O.I — Run On Investment** : une course par an au cœur de Paris La Défense (5 / 10 / 21,1 km, puis un après-midi entier dans l'Arena), et **un réseau toute l'année** entre deux lignes. Le site ([runoninvest.fr](https://runoninvest.fr), repo `Site-roi`) porte l'événement et l'inscription ; l'app est ce qui se passe avant et après : l'annuaire de celles et ceux qui courent, des rencontres de huit minutes, des sorties à allure de conversation, un suivi des relations branché sur les kilomètres.

> **R.O.I — L'impact après la ligne d'arrivée.**

Application mobile-first (PWA), vrai layout web sur grand écran. Données fictives, aucun back-end propre : le seul appel réseau est la lecture du dossier sur le site (voir « Le pont avec le site »). Le texte de l'app suit la bible de contenu `CONTENU.md`.

## La règle de lisibilité — ce qui prime sur tout le reste

L'app a un seul objectif d'interface : **on doit pouvoir s'en servir sans avoir rien appris.**
Quatre règles, appliquées partout, qui priment sur toute considération de style :

1. **Un libellé dit ce qu'il est, en français courant.** Les onglets s'appellent *Accueil, Rencontres,
   Messages, Profil* — pas *Fil, Annuaire, Dossard*. Les codes chrono (`T–01 / LES DOSSARDS`)
   ne servent plus de titres de section : ils restaient illisibles pour qui n'a pas lu la marque.
   Le compte à rebours de la course reste, en clair : « 344 jours avant la course ».
2. **Un titre est suivi d'une phrase qui explique à quoi ça sert** (`SectionTitle help="…"`, rendue en
   `.aide`). Jamais un libellé seul qu'il faut deviner.
3. **Un chiffre vient avec ce qu'il veut dire.** « 34 personnes rencontrées », pas « 34 » sous une
   abréviation. Les scores en anneau, les jauges de compatibilité et les courbes de tendance ont été
   retirés : personne n'en connaissait l'échelle. Le « pourquoi » d'une proposition est désormais une
   phrase (« Répond à ce que tu cherches : un développeur pour ton produit »), pas un pourcentage.
4. **Un écran répond à une question.** L'accueil répond à « où j'en suis de ma semaine, et qu'est-ce
   que je dois faire ? » : le résumé de la semaine (km), la course réduite à une ligne cliquable,
   **une à deux prochaines étapes concrètes** calculées depuis l'état réel (une demande en attente,
   un rendez-vous à confirmer), ton réseau en trois chiffres, puis le fil.
   Plus de six blocs qui se disputent l'attention.

Deux conséquences sur le produit : **aucun palier de kilomètres ne ferme plus une partie de l'app**
(les filtres de l'annuaire étaient verrouillés jusqu'à 50 km — les paliers ne font plus qu'ajouter des
propositions), et le vocabulaire interne est traduit à l'écran (« cooptation » → *invitation*,
« cercles » → *groupes*, « pipeline » → *le suivi de tes relations*).

Côté code, les briques sont dans `src/components/primitives.jsx` (`SectionTitle`, `Action`, `Chiffre`)
et les classes dans `src/index.css` (`.titre-section`, `.aide`, `.carte`, `.lien-bloc`).

## Identité visuelle — la refonte « simple, claire, fluide »

L'app ne garde de l'identité éditoriale du site que **deux signaux** : le logotype `R■O■I` (carrés orange en séparateurs, alignés sur la ligne de base) et l'orange impact `#FF4400` comme **unique** couleur d'accent. Tout le reste est neutre, clair et calme : fond craie partout, **un seul** bloc encre par écran (le résumé de la semaine sur l'Accueil, et le plein écran d'onboarding), coins souples, Archivo en graisses normales, plus de JetBrains Mono, plus de capitales espacées, plus de grain, densité aérée. Le modèle d'interaction vise la fluidité d'une app de course : gros chiffres de stats, fil d'activités en cartes, un kudo en un tap, sheets qui montent depuis le bas.

- **Couleurs** — fond app craie `#EFEBE2`, surface `#F7F5F0` (cartes, tuiles, champs), surface 2 `#E7E1D4` (segmenté, boutons ronds secondaires), encre `#131211` (texte principal, l'unique aplat plein), texte 2 `#2A2723`, texte 3 `#57534A`, texte 4 `#6B6558`, accent `#FF4400`, bordure `rgba(19,18,17,.1)`, séparateur `rgba(19,18,17,.08)`, voile de sheet `rgba(19,18,17,.45)`. Contraste : `#57534A` sur `#F7F5F0` = 7,0:1, `#6B6558` sur `#EFEBE2` = 5,1:1 ; `#EFEBE2` sur `#FF4400` = 3,4:1, réservé aux boutons et aux puces, jamais au texte courant.
- **Typographie** — une seule famille, **Archivo variable** (`font-stretch: 100 %` partout sauf le logotype à `112 %`). Chiffre héros 60/500, titre de page 27/500, titre de profil 24/500, chiffre de tuile 28–30/500, nom de carte 15,5–16/600, corps 14,5/400 (`line-height` 1,6), bouton 14–15/600, méta 13–13,5/400, titre de section 13/600 en capitales `letter-spacing:.06em`. **JetBrains Mono a quitté le bundle.**
- **Rayons** — `12px` item de nav sidebar · `16px` tuile de stat et ligne d'action · `18px` carte et bulle de message · `20px` bloc encre · `22px 22px 0 0` sheet · `999px` bouton, puce, champ, avatar.
- **Ombres** — aucune. La hiérarchie passe par la bordure `rgba(19,18,17,.1)` et le fond `#F7F5F0`.
- **Animations** — `sheetUp` (280 ms, `cubic-bezier(.22,1,.36,1)`, 24 px de montée) pour les sheets, `fade` 200 ms pour les voiles et l'onboarding, 180 ms pour le toast. Rien d'autre : le kudo change d'état instantanément, le retour vient de la couleur.
- **`tailwind.config.js`** — les jetons. Les noms historiques (`canvas`, `surface`, `fg`, `brand`, `success`…) sont conservés et pointent dans la nouvelle palette ; `white` et `black` restent la craie et l'encre. L'échelle `borderRadius` porte les rayons ci-dessus, les ombres valent `none`, l'alias `mono` pointe sur Archivo, et la bascule `lg` est à **1000 px** (nav basse ↔ sidebar).
- **`src/index.css`** — les classes partagées, redessinées : `.titre-section` (13/600 capitales), `.aide`, `.carte` (18 px, filet, fond surface), `.lien-bloc` (16 px), `.btn` (`-impact` orange / `-encre` neutre plein / `-ghost` à bordure, tous en pilule), `.tag` (la pilule d'information), `.rangee` (une ligne de liste sur séparateur), `.ico` et `.rond` (les pastilles rondes), `.inter` (l'interrupteur arrondi), `.champ` / `.input-ligne` (champs en pilule sur fond surface), `.cadre` (une grille de tuiles séparées par un `gap`), `.fiche`, `.surface-hero` (le bloc encre), et les couleurs contextuelles `.t-texte` / `.t-muted` / `.t-beton`. Le grain film et le dossard recto/verso ont été retirés.
- **Nav** — **quatre** onglets : Accueil · Rencontres · Messages · Profil. « Courir » a disparu ; son contenu (volume hebdomadaire, sorties) est remonté dans le bloc « Cette semaine » et dans les stats des posts du fil. Sur téléphone, barre basse craie avec un filet en haut, icône 22 px et label 11 px, l'onglet actif en orange (icône **et** label) ; sur grand écran, sidebar claire de 240 px, items à `border-radius:12px`, actif sur `#E7E1D4` en orange, et les jours avant la course en pied. Colonne de contenu : `620px` centrés au-dessus de 1000 px, pleine largeur en dessous.
- **Avatars** — ronds, initiales sur fond déterministe (hash du nom modulo huit paires `[fond, texte]`, voir `src/lib/avatar.js`). Pas de photo.
- **Icônes** — traits SVG `viewBox="0 0 24 24"`, `fill:none`, `stroke-width:1.8` (`1.9` dans la nav basse).
- **Convention T– / T+** : avant la ligne = la course, après la ligne = le réseau. Elle reste **la lecture interne du produit**, pas un libellé d'interface.

**Le dossard recto/verso a quitté l'app** (il reste un sujet du site) : le Profil est désormais un avatar rond, un nom, et trois chiffres.

## Le pont avec le site : l'inscription là-bas, le dossard ici

L'inscription (compte, distance, formule, vague gardée, justificatif, validation, paiement) vit **sur le site**. L'app ne la refait pas : elle y envoie, puis elle **lit** le dossier.

- **Site → app** : depuis l'espace personnel du site, « Ouvrir mon dossard dans l'app » ouvre `https://roi-mvp.up.railway.app/?dossier=E01-000123&email=…`. Au chargement, l'app appelle `GET https://runoninvest.fr/api/dossier?reference&email` (lecture publique, CORS ouvert, limitée à dix essais par minute), enregistre le dossier (`localStorage`, clé `roi1.dossier`), ouvre la fiche de l'édition et nettoie l'URL. Depuis l'app, on peut aussi relier un dossier à la main (référence + e-mail) dans la fiche de l'édition.
- **App → site** : « Prendre un dossard » envoie sur `/inscription/?distance=10&formule=premium` avec la distance et la formule choisies dans l'app ; « Ouvrir mon espace » et « Changer de formule » renvoient sur `/espace/`. Le site garde la vérité du dossier ; l'app affiche la référence, la vague et son tarif, la distance, la formule, et les quatre étapes (`demande → justificatif → valide → paye`).
- **Sans site joignable** (aperçu, hors ligne) : `src/lib/dossier.js` bascule en mode local, comme le site le fait sans serveur — la référence est acceptée telle quelle et le dossier est reconstruit depuis le profil, avec un bandeau « aperçu hors ligne ».
- Les faits de l'édition (`src/data/race.js`) sont ceux du site, **mot pour mot** : Édition 01, Paris La Défense, septembre 2027, *10 000 décideurs attendus*, trois distances (Le Sprint · Boucle Esplanade, La Référence · Entre les tours · le format central, Le Grand Format · 21,0975 km · distance officielle, « accès réseau ■ total » pour les trois), trois vagues (Early Bird 350 € → Régulier 400 € → Last Call 500 €, dates alignées sur `server.js` du site), trois formules (Dossard · Premium · Cercle, avec les listes et le « Tout le Dossard, et » du site), les quatre étapes du dossier, le programme de l'après-midi `T+00…T+04`, les quatre principes, les quatre publics, les trois voies d'accès, la fiche du lieu. Le site n'annonce ni dénivelé, ni temps de course, ni tracé précis : l'app n'en invente pas (la carte est un tracé indicatif, et le dit). `SITE_URL`, `APP_URL` et les adresses de contact y sont définis.

## Une course annuelle, un réseau toute l'année

Le fond et le ton de tout le texte de l'app sont fixés dans **[`CONTENU.md`](CONTENU.md)** : la course est le prétexte, le réseau est le sujet. Les quatre verbes — **recruter · lever · vendre · s'associer** — structurent le profil, l'annuaire, les rencontres et le pipeline. On y documente aussi ce qu'on emprunte aux formats qui existent déjà (clubs de fondateurs qui courent puis prennent un café, sorties mensuelles de dirigeants « pas de badge, pas de slide, pas de chrono », rencontres flash de salon, matchmaking par intention des apps d'événement, intros 1:1 hebdomadaires) et comment R.O.I l'adapte.

- **Accueil** — le résumé de ta semaine de course (le seul bloc encre de l'app), la course en une ligne,
  **ce qu'il y a à faire maintenant** (une à deux étapes, expliquées), ton réseau en trois chiffres, puis le fil.
- **La course** (sheet, depuis la ligne de l'accueil ou « Ma course » dans les réglages) — le compte à
  rebours dans un bloc encre, les trois distances, le programme de l'après-midi, puis ton inscription :
  prendre un dossard sur le site, ou relier un dossier déjà ouvert.
- **Rencontres** — trois listes et rien d'autre : *Pour toi* (les propositions de la semaine, chacune
  expliquée en une phrase), *Chercher* (une barre de recherche et des filtres par intention, tous ouverts),
  *Contacts* (les demandes en attente d'abord, puis les personnes rencontrées, puis les demandes envoyées).
- **Les rencontres** — huit minutes, un sujet, un lieu : à l'Arena le jour J, en courant, autour d'un café,
  en visio. Six réservées à l'avance en Premium.
- **Le binôme** — la sortie à deux : jour, heure, lieu, distance, allure cible (la moyenne des deux).
- **Le suivi** (ex-« pipeline ») — où en est chaque relation : *Rencontré·e → En conversation → Présenté·e
  → En cours → Conclu*, avec les kilomètres investis par relation.
- **Ta semaine de course** — le volume hebdomadaire, les sorties, le temps couru et les kilomètres
  courus à plusieurs remontent dans le bloc « Cette semaine » de l'Accueil, et dans les stats des posts
  du fil (km · temps · allure · rencontrés). L'onglet *Courir* a disparu.
- **Messages** — les conversations et les groupes, dans une seule liste.
- **Profil** — ton avatar, ce que tu cherches et ce que tu apportes, trois chiffres, puis **une seule
  liste « Ton compte »** : ma course, rendez-vous, formule, invitations, applis connectées,
  confidentialité, revoir l'introduction, mode sobriété, réinitialisation.
- **Onboarding en trois écrans** — une course par an · un réseau toute l'année · **comment ça marche**
  (tu proposes, la personne dit oui, la conversation s'ouvre).

## Architecture

```
src/
  App.jsx              orchestrateur : état partagé + contexte + layout + overlays (+ lien profond ?dossier=)
  AppContext.js        contexte applicatif (useApp)
  data/race.js         l'édition : faits du site, distances, vagues, formules, programme, SITE_URL
  ../CONTENU.md        la bible de contenu : positionnement, ton, vocabulaire, emprunts aux formats existants
  data/                autres données fictives (user, network, profiling, events, messages, feed, activities…)
  lib/dossier.js       le pont : lecture du dossier sur le site, repli local
  lib/matching.js      moteur de matching comportemental « Pour toi »
  components/          Icon, Avatar, BottomNav, Sidebar, Sheet, RouteMap, PostCard…
  components/primitives.jsx  Card, Btn, Chip, SectionTitle, Action, Chiffre, Tuile, Badge, ProgressBar, Logo
  components/Sheet.jsx  le conteneur commun des sheets (voile + panneau + sheetUp + en-tête collant)
  screens/             Accueil, Reseau, Messages, Profil + fiches et sheets (RaceSheet = la course)
  index.css            les classes partagées (.titre-section, .aide, .carte, .lien-bloc, .btn, .tag, .ico…)
public/fonts/          Archivo variable (les deux fichiers latin / latin-ext)
```

## Numérique responsable

- **Une seule fonte, auto-hébergée, deux fichiers** (Archivo latin préchargé, latin-ext en `font-display: swap`). JetBrains Mono a quitté le bundle avec les labels en capitales espacées. Aucun service tiers, aucun pisteur.
- **Chargement à la demande** — seul l'accueil est dans le bundle initial ; écrans, fiches et Leaflet sont chargés à l'ouverture.
- **Mode sobriété** (dans le profil, activé d'office si l'appareil signale « économiseur de données ») — pas de tuiles réseau sur les cartes, pas d'effets. Le **grain film a été supprimé de l'app** : c'était un filtre SVG plein écran, il ne coûte plus rien à personne.
- `prefers-reduced-motion` respecté.

## Stack

React 18 · Vite · Tailwind CSS · Leaflet (cartes). PWA installable (`manifest.webmanifest`, icône = le signe du site : encre, un filet craie, le point carré orange).

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
```

> Déployée sur Railway : https://roi-mvp.up.railway.app — c'est l'adresse que le site utilise pour « Ouvrir mon dossard dans l'app » (surchargeable côté site avec `data-app` sur `<body>`).
