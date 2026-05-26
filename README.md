# ROI — Le réseau qui rapporte

Application mobile-first de networking pour entrepreneurs qui courent.
Un mélange de **LinkedIn**, **Strava** et **Happn** au design épuré et professionnel :
on partage ses sorties et ses réflexions, on participe à des courses pour
rencontrer du monde, on se fait matcher avec les bonnes personnes, et on crée
des groupes pour échanger.

## Fonctionnalités

- **Fil** — feed social façon LinkedIn : posts (réflexion, REX de rencontre, tip,
  étape, partage d'activité), like / commentaire / partage, composer de post, et
  carte ROI compacte (score réseau).
- **Réseau** — matchs intelligents (score + contexte partagé) et annuaire des
  membres avec recherche et filtres.
- **Courir** — façon Strava :
  - *Activités* : sorties réalisées avec **tracé GPS sur carte** (Leaflet + OpenStreetMap/CARTO),
    distance / temps / allure / dénivelé, splits par km, kudos, et lien réseau
    (« rencontré X & Y sur cette sortie » → mise en relation directe).
  - *Sorties* : défi du mois, classement, et sorties à venir (distance, allure, niveau, lieu).
- **Messages** — discussions 1:1 et **groupes** (création, découverte, chat de groupe).
- **Profil** — besoins éditables, ce que je propose, stats running, mes activités,
  centres d'intérêt, communauté.
- **Fiches** — fiche membre et fiche activité ouvertes en bottom-sheet.

## Architecture

```
src/
  App.jsx            orchestrateur : état partagé + contexte + layout + overlays
  AppContext.js      contexte applicatif (useApp)
  data/              données fictives (user, network, events, messages, feed, activities, notifications)
  lib/               helpers (avatars)
  components/        UI réutilisable (Icon, Avatar, primitives, BottomNav, RouteMap, PostCard, ActivityCard…)
  screens/           écrans (Accueil/Fil, Reseau, Courir, Messages, Profil) + overlays (MemberSheet, ActivitySheet)
```

## Stack

React 18 · Vite · Tailwind CSS · Leaflet (cartes). Données fictives, aucune dépendance back-end.

> Les cartes chargent leurs tuiles depuis OpenStreetMap/CARTO : un accès réseau
> sortant est nécessaire à l'affichage du fond de carte (le tracé GPS, lui,
> s'affiche toujours).

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
```
