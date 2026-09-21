# R.O.I — Run On Investment · L'app

L'app de **R.O.I — Run On Investment** : une course par an au cœur de Paris La Défense (5 / 10 / 21,1 km, puis un après-midi entier dans l'Arena), et **un réseau toute l'année** entre deux lignes. Le site ([runoninvest.fr](https://runoninvest.fr), repo `Site-roi`) porte l'événement et l'inscription ; l'app est ce qui se passe avant et après : l'annuaire de celles et ceux qui courent, des rencontres de huit minutes, des sorties à allure de conversation, un suivi des relations branché sur les kilomètres.

> **R.O.I — L'impact après la ligne d'arrivée.**

Application mobile-first (PWA), vrai layout web sur grand écran. Données fictives, aucun back-end propre : le seul appel réseau est la lecture du dossier sur le site (voir « Le pont avec le site »). Le texte de l'app suit la bible de contenu `CONTENU.md`.

## La règle de lisibilité — ce qui prime sur tout le reste

L'app a un seul objectif d'interface : **on doit pouvoir s'en servir sans avoir rien appris.**
Quatre règles, appliquées partout, qui priment sur toute considération de style :

1. **Un libellé dit ce qu'il est, en français courant.** Les onglets s'appellent *Accueil, Rencontres,
   Courir, Messages, Profil* — pas *Fil, Annuaire, Dossard*. Les codes chrono (`T–01 / LES DOSSARDS`)
   ne servent plus de titres de section : ils restaient illisibles pour qui n'a pas lu la marque.
   Le compte à rebours de la course reste, en clair : « 345 jours avant la course ».
2. **Un titre est suivi d'une phrase qui explique à quoi ça sert** (`SectionTitle help="…"`, rendue en
   `.aide`). Jamais un libellé seul qu'il faut deviner.
3. **Un chiffre vient avec ce qu'il veut dire.** « 34 personnes rencontrées », pas « 34 » sous une
   abréviation. Les scores en anneau, les jauges de compatibilité et les courbes de tendance ont été
   retirés : personne n'en connaissait l'échelle. Le « pourquoi » d'une proposition est désormais une
   phrase (« Répond à ce que tu cherches : un développeur pour ton produit »), pas un pourcentage.
4. **Un écran répond à une question.** L'accueil répond à « et maintenant ? » : le compte à rebours,
   puis **une à deux prochaines étapes concrètes** calculées depuis l'état réel (une demande en attente,
   un rendez-vous à confirmer, une rencontre à proposer, un dossard à prendre), puis où aller, puis le fil.
   Plus de six blocs qui se disputent l'attention.

Deux conséquences sur le produit : **aucun palier de kilomètres ne ferme plus une partie de l'app**
(les filtres de l'annuaire étaient verrouillés jusqu'à 50 km — les paliers ne font plus qu'ajouter des
propositions), et le vocabulaire interne est traduit à l'écran (« cooptation » → *invitation*,
« cercles » → *groupes*, « pipeline » → *le suivi de tes relations*).

Côté code, les briques sont dans `src/components/primitives.jsx` (`SectionTitle`, `Action`, `Chiffre`)
et les classes dans `src/index.css` (`.titre-section`, `.aide`, `.carte`, `.lien-bloc`).

## Identité visuelle « La Ligne » — la même que le site

L'app reprend **exactement** le design system du site (`assets/roi.css` côté site) : deux fonds grainés — encre `#070707` et craie `#EFEBE2` —, un seul accent, l'orange impact `#FF4400`, et deux fontes auto-hébergées dans `public/fonts/` : **Archivo variable** en graisse fine (250) et chasse étendue (125 %) pour les titres, **JetBrains Mono** pour les labels, la nav, les boutons et toute la data. Aucun arrondi, aucune ombre portée, aucun dégradé, **aucun vert** : des filets, des aplats, de l'air.

- **`tailwind.config.js`** — les jetons. Les noms historiques de l'app (`canvas`, `surface`, `fg`, `brand`, `gold`, `success`…) sont conservés mais pointent tous dans la palette du site ; `white` et `black` eux-mêmes sont la craie et l'encre (le site n'a ni blanc ni noir purs), `success` est de l'encre sur craie (les états « fait », « confirmé », « connecté » ne sont pas verts : le site n'a qu'un vert, le message « ok » d'un formulaire, porté par `.form-msg.ok`). Toute l'échelle `borderRadius` vaut `0`, les ombres sont des filets d'un pixel, les fonds décoratifs (`aurora`, `mesh`…) sont `none`.
- **`src/index.css`** — les gestes du site, portés en classes : `.tmark` (l'étiquette chrono de la marque, carré 8 px comme sur le site), `.titre-section` et `.aide` (le titre de section lisible et sa phrase d'explication), `.carte` et `.lien-bloc`, `.display` / `.titre` / `.mono`, `.creuse` (la typo évidée, même épaisseur `.022em` et **même repli sous 620 px** : sur téléphone, le contour redevient plein, comme sur le site), `.bar` et `.laligne` (la barre d'impact, le filet + damier d'arrivée), `.btn` (`-impact` / `-encre` / `-ghost` / `-courante`), `.cadre` (la grille bordée), `.fiche` (la `<dl>` clé / valeur), `.champ` et `.input-ligne` (champs sur filet, `select` avec le triangle orange), `.tag` (l'étiquette mono bordée, `■` orange devant), `.rangee` (une ligne de liste sur filet), `.ico` (le pictogramme dans un carré), `.inter` (l'interrupteur carré), les couleurs contextuelles `.t-texte` / `.t-muted` / `.t-beton` qui basculent avec le fond, et **le dossard** recto/verso (`.dossard`, `.d-recto`, `.d-verso`). Le grain film est posé en `body::before`, comme sur le site, et coupé en Mode sobriété.
- **Les boutons ont les couleurs du site** : `.btn-impact` est **craie sur orange** (`#EFEBE2` sur `#FF4400`, le bouton principal et le `nav-cta` du site), et son survol reprend la finale du site sur fond clair (encre) ou la nav sur fond sombre (craie). L'orange est le même `#FF4400` sur les deux fonds, comme sur le site — y compris sur la craie. Le point d'accessibilité que le site documente (2,9:1 pour l'orange sur craie, trois sorties possibles « à trancher côté marque ») reste **ouvert, et se tranchera aux deux endroits en même temps** : l'app ne prend pas la décision à la place du site. L'anneau de focus, lui, est l'encre, pas l'orange (3:1 requis), comme sur le site.
- **La nav est celle du site** : encre à 88 % avec un flou léger, le logotype, des liens mono séparés par des filets craie, le lien courant en orange, le survol craie sur encre — en barre basse sur téléphone, en colonne à gauche sur grand écran, en en-tête au-dessus du fil.
- **Règles de base** : `h1` est en Archivo 125 % / 250, `h2`/`h3` en 110 % / 400, toujours en capitales — les utilitaires de graisse posés par les écrans sont neutralisés, un titre R.O.I n'est jamais gras. Tout texte en capitales qui n'est pas un titre passe en mono (`.uppercase`). Les titres de section sont des `.titre-section` (mono, lisibles), suivis d'une `.aide` qui explique en une phrase ; `.tmark` reste disponible pour l'étiquette chrono de la marque, mais ne sert plus de titre.
- **Convention T– / T+** : avant la ligne = la course, après la ligne = le réseau. Elle reste **la lecture interne du produit**, pas un libellé d'interface : à l'écran, le compte à rebours s'écrit « 345 jours avant la course » et la journée se découpe en « Le matin » / « L'après-midi ». Voir « La règle de lisibilité ».

Le composant `src/components/Dossard.jsx` est l'objet central : « un seul dossard, il te fait franchir la ligne, puis il devient ton profil ». Recto la course (numéro = les trois derniers caractères de la référence du dossier, distance, édition), verso le réseau (nom, fonction, entreprise, formule). Retournable au clic et au clavier (`aria-pressed`).

## Le pont avec le site : l'inscription là-bas, le dossard ici

L'inscription (compte, distance, formule, vague gardée, justificatif, validation, paiement) vit **sur le site**. L'app ne la refait pas : elle y envoie, puis elle **lit** le dossier.

- **Site → app** : depuis l'espace personnel du site, « Ouvrir mon dossard dans l'app » ouvre `https://roi-mvp.up.railway.app/?dossier=E01-000123&email=…`. Au chargement, l'app appelle `GET https://runoninvest.fr/api/dossier?reference&email` (lecture publique, CORS ouvert, limitée à dix essais par minute), enregistre le dossier (`localStorage`, clé `roi1.dossier`), ouvre la fiche de l'édition et nettoie l'URL. Depuis l'app, on peut aussi relier un dossier à la main (référence + e-mail) dans la fiche de l'édition.
- **App → site** : « Prendre un dossard » envoie sur `/inscription/?distance=10&formule=premium` avec la distance et la formule choisies dans l'app ; « Ouvrir mon espace » et « Changer de formule » renvoient sur `/espace/`. Le site garde la vérité du dossier ; l'app affiche la référence, la vague et son tarif, la distance, la formule, et les quatre étapes (`demande → justificatif → valide → paye`).
- **Sans site joignable** (aperçu, hors ligne) : `src/lib/dossier.js` bascule en mode local, comme le site le fait sans serveur — la référence est acceptée telle quelle et le dossier est reconstruit depuis le profil, avec un bandeau « aperçu hors ligne ».
- Les faits de l'édition (`src/data/race.js`) sont ceux du site, **mot pour mot** : Édition 01, Paris La Défense, septembre 2027, *10 000 décideurs attendus*, trois distances (Le Sprint · Boucle Esplanade, La Référence · Entre les tours · le format central, Le Grand Format · 21,0975 km · distance officielle, « accès réseau ■ total » pour les trois), trois vagues (Early Bird 350 € → Régulier 400 € → Last Call 500 €, dates alignées sur `server.js` du site), trois formules (Dossard · Premium · Cercle, avec les listes et le « Tout le Dossard, et » du site), les quatre étapes du dossier, le programme de l'après-midi `T+00…T+04`, les quatre principes, les quatre publics, les trois voies d'accès, la fiche du lieu. Le site n'annonce ni dénivelé, ni temps de course, ni tracé précis : l'app n'en invente pas (la carte est un tracé indicatif, et le dit). `SITE_URL`, `APP_URL` et les adresses de contact y sont définis.

## Une course annuelle, un réseau toute l'année

Le fond et le ton de tout le texte de l'app sont fixés dans **[`CONTENU.md`](CONTENU.md)** : la course est le prétexte, le réseau est le sujet. Les quatre verbes — **recruter · lever · vendre · s'associer** — structurent le profil, l'annuaire, les rencontres et le pipeline. On y documente aussi ce qu'on emprunte aux formats qui existent déjà (clubs de fondateurs qui courent puis prennent un café, sorties mensuelles de dirigeants « pas de badge, pas de slide, pas de chrono », rencontres flash de salon, matchmaking par intention des apps d'événement, intros 1:1 hebdomadaires) et comment R.O.I l'adapte.

- **Accueil** — le compte à rebours de la course, **ce qu'il y a à faire maintenant** (une à deux étapes,
  expliquées), les quatre endroits où aller, ton réseau en trois chiffres, puis le fil.
- **L'édition** (fiche, depuis l'accueil, Courir ou le profil) — ton inscription (ou : prendre un dossard /
  relier un dossier), le matin / l'après-midi, les trois distances, le programme, les formules, les vagues,
  qui court, les règles de la course.
- **Rencontres** — trois listes et rien d'autre : *Pour toi* (les propositions de la semaine, chacune
  expliquée en une phrase), *Chercher* (une barre de recherche et des filtres par intention, tous ouverts),
  *Contacts* (les demandes en attente d'abord, puis les personnes rencontrées, puis les demandes envoyées).
- **Les rencontres** — huit minutes, un sujet, un lieu : à l'Arena le jour J, en courant, autour d'un café,
  en visio. Six réservées à l'avance en Premium.
- **Le binôme** — la sortie à deux : jour, heure, lieu, distance, allure cible (la moyenne des deux).
- **Le suivi** (ex-« pipeline ») — où en est chaque relation : *Rencontré·e → En conversation → Présenté·e
  → En cours → Conclu*, avec les kilomètres investis par relation.
- **Courir** — *Mes sorties* (la semaine, deux ou trois actions, l'historique) et *Courir à plusieurs*
  (les prochaines sorties, tes kilomètres partagés avec le détail des paliers replié, qui court avec les autres).
- **Messages** — les conversations et les groupes.
- **Profil** — ton dossard (recto la course, verso ton profil), ta course, ce que tu cherches et ce que tu
  apportes, trois chiffres, puis **une seule liste « Ton compte »** : rendez-vous, formule, invitations,
  applis connectées, sorties, confidentialité, mode sobriété, réinitialisation.
- **Onboarding en quatre écrans** — une course par an · un réseau toute l'année · **comment ça marche**
  (les trois étapes : on te propose, tu proposes, vous dites oui) · dis ce que tu cherches.

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
  components/          Dossard, Icon, Avatar, BottomNav, Sidebar, RouteMap, PostCard…
  components/primitives.jsx  SectionTitle (titre + phrase d'explication), Action, Chiffre, Badge, ProgressBar, Logo
  screens/             Accueil, Reseau, Courir, Messages, Profil + fiches et sheets (RaceSheet = l'édition)
  index.css            les gestes « La Ligne » + les classes de lisibilité (.titre-section, .aide, .carte, .lien-bloc)
public/fonts/          Archivo variable + JetBrains Mono, les mêmes fichiers que le site
```

## Numérique responsable

- **Deux fontes, auto-hébergées, ~4 fichiers chargés** (Archivo latin + JetBrains Mono 500 préchargés, les autres en `font-display: swap`) — les mêmes fichiers que le site. Aucun service tiers, aucun pisteur.
- **Chargement à la demande** — seul l'accueil est dans le bundle initial ; écrans, fiches et Leaflet sont chargés à l'ouverture.
- **Mode sobriété** (dans le profil, activé d'office si l'appareil signale « économiseur de données ») — pas de tuiles réseau sur les cartes, pas de flou, et le **grain film est coupé** (c'est un filtre SVG plein écran).
- `prefers-reduced-motion` respecté (le dossard ne s'anime plus, il bascule).

## Stack

React 18 · Vite · Tailwind CSS · Leaflet (cartes). PWA installable (`manifest.webmanifest`, icône = le signe du site : encre, un filet craie, le point carré orange).

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
```

> Déployée sur Railway : https://roi-mvp.up.railway.app — c'est l'adresse que le site utilise pour « Ouvrir mon dossard dans l'app » (surchargeable côté site avec `data-app` sur `<body>`).
