# ROI — Le réseau qui rapporte

Application mobile-first de networking pour entrepreneurs qui courent.
Un mélange de **LinkedIn**, **Strava** et **Happn** au design épuré et professionnel :
on partage ses sorties et ses réflexions, on participe à des courses pour
rencontrer du monde, on se fait matcher avec les bonnes personnes, et on crée
des groupes pour échanger.

## Fonctionnalités

- **Copilot IA** — assistant de networking accessible partout via le bouton
  flottant : insights proactifs (qui rencontrer, qui relancer), rédaction
  d'intros, résumé de la semaine réseau, et chat avec prompts suggérés. Mis en
  avant aussi sur le Fil et le Réseau (badges « IA »). Rédaction de posts assistée
  par l'IA dans le composer.
- **Abonnement** — 3 plans (Découverte gratuit · Pro · Business), bascule
  mensuel/annuel, et déblocage progressif des fonctionnalités premium (matchs
  illimités, Copilot illimité, « qui veut me rencontrer », filtres avancés,
  sièges d'équipe…). Les surfaces verrouillées invitent à passer à l'offre
  supérieure.
- **Invitations & parrainage** — invite des contacts externes par e-mail ou lien
  partageable, suivi du statut, récompense de parrainage (3 invité·es → 1 mois
  Pro), et gestion des sièges d'équipe pour le plan Business. L'onboarding détecte
  une invitation (`?invite=Prénom`) et accueille la personne par son parrain.
- **Fil** — feed social façon LinkedIn : posts (réflexion, REX de rencontre, tip,
  étape, partage d'activité), like / commentaire / partage, composer de post, et
  carte ROI compacte (score réseau).
- **Réseau · Match IA « Pour toi »** — moteur de matching **comportemental**
  (façon algorithme TikTok/Instagram, mais pour le business). Le score n'est plus
  figé : il combine la complémentarité besoins ↔ offres, la compatibilité running
  (créneau, allure, zone, sorties communes), les sujets et le réseau, **avec ton
  comportement dans l'app** — qui tu regardes, likes, contactes, filtres. Plus tu
  explores un type de profil (investisseurs, tech, mentors…), plus il remonte.
  Chaque match est **expliqué** (pourquoi vous matchez + décomposition Besoin /
  Running / Affinité) et le bandeau « Pour toi » montre ce que l'algorithme
  apprend de toi. Annuaire des membres avec recherche et filtres. **Brise-glace
  IA** : message d'intro pré-rédigé à partir de vos points communs.
- **RunMatch · binôme de course** — la sortie matchée à 2 (Happn × pitch). À partir
  du profil de course d'un membre (créneau, allure, zone, distance), ROI propose une
  **sortie concrète** : un jour, une heure, un lieu, une distance et une **allure cible**
  (la moyenne des deux allures, pour tenir la conversation). Le classement privilégie la
  **compatibilité running** puis l'intérêt business — la sortie devient le rendez-vous.
  « Proposer ce run » crée un RDV daté dans l'agenda **et** alimente le Pipeline ROI.
  Accessible depuis l'accueil et l'onglet *Courir*.
- **Pipeline ROI** — le CRM léger branché sur les kilomètres. Chaque relation suit un
  cycle visible (*Rencontré → En discussion → Intro / pitch → Deal en cours → Conclu*)
  dans un **kanban** horizontal. On voit le **retour sur les km investis** (qui on a
  rencontré en courant, les km partagés par relation, la valeur en jeu en k€). Contacter
  un membre ou proposer un run **fait entrer la relation dans le pipeline** ; un bouton
  « Faire avancer » la pousse d'étape en étape. La carte d'accueil affiche la valeur en
  jeu et le nombre de relations actives.
- **Courir** — façon Strava :
  - *Activités* : sorties réalisées avec **tracé GPS sur carte** (Leaflet + OpenStreetMap/CARTO),
    distance / temps / allure / dénivelé, splits par km, kudos, et lien réseau
    (« rencontré X & Y sur cette sortie » → mise en relation directe).
  - *Sorties* : défi du mois, classement, et sorties à venir (distance, allure, niveau, lieu).
- **Messages** — discussions 1:1 et **groupes** (création, découverte, chat de groupe).
- **Profil** — besoins éditables, ce que je propose, stats running, mes activités,
  centres d'intérêt, communauté.
- **Connexions & appareils** — connexion (mock) à Strava, LinkedIn et aux montres
  (Apple Santé, Garmin, COROS, Polar) pour importer courses et profil.
- **Onboarding, recherche globale, explication du score ROI, profil éditable.**
- **Fiches** — fiche membre, fiche activité et fiche événement en bottom-sheet.

## Architecture

```
src/
  App.jsx            orchestrateur : état partagé + contexte + layout + overlays
  AppContext.js      contexte applicatif (useApp)
  data/              données fictives (user, network, profiling, events, messages, feed, activities, notifications)
  lib/matching.js    moteur de matching comportemental « Pour toi » (scoring, signaux, insights, brise-glace)
  lib/               helpers (avatars)
  components/        UI réutilisable (Icon, Avatar, primitives, BottomNav, RouteMap, PostCard, ActivityCard…)
  screens/           écrans (Accueil/Fil, Reseau, Courir, Messages, Profil) + overlays (MemberSheet, ActivitySheet)
```

## Stack

React 18 · Vite · Tailwind CSS · Leaflet (cartes). Données fictives, aucune dépendance back-end.
PWA installable (manifest + icône, `display: standalone`) pour un rendu d'app
mobile plein écran ; mobile-first et responsive (cadre « téléphone » sur desktop).

> Les cartes chargent leurs tuiles depuis OpenStreetMap/CARTO : un accès réseau
> sortant est nécessaire à l'affichage du fond de carte (le tracé GPS, lui,
> s'affiche toujours).

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
```
