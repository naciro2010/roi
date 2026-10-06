# Fiches des stores — R.O.I

Tout ce qu'il faut copier dans App Store Connect et la Play Console. Textes en
français (langue principale : **Français (France)**). Les limites de longueur
sont celles des stores ; chaque texte ici les respecte.

| Fichier | Contenu |
|---|---|
| `app-store.md` | Nom, sous-titre, mots-clés, description, texte promo, catégorie, âge, confidentialité de l'app (« App Privacy »), notes pour la revue |
| `google-play.md` | Titre, description courte et longue, catégorie, classification, sécurité des données (« Data safety »), accès pour la revue |
| `captures/ios/` | 6 captures iPhone 6,9" (1320 × 2868) |
| `captures/android/` | 6 captures téléphone (1080 × 2160) |
| `google-play/banniere-1024x500.png` | La bannière Play (« feature graphic ») |
| `../public/icon-512.png` | L'icône Play (512 × 512) ; l'icône App Store vient du projet Xcode |

Régénérer les captures après un changement d'interface :
`npm run build:store && node scripts/captures-stores.mjs` (Playwright requis).

## Les adresses à renseigner

| Champ | Adresse |
|---|---|
| Politique de confidentialité | https://roi-mvp.up.railway.app/confidentialite.html |
| Suppression du compte (Play) | https://roi-mvp.up.railway.app/suppression-compte.html |
| Assistance / support | https://roi-mvp.up.railway.app/support.html |
| Site marketing | https://runoninvest.fr |
| Contact | contact@runoninvest.fr |
