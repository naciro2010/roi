/* ==========================================================================
   La couche native : ce que l'app fait différemment quand elle tourne dans
   l'app Android / iOS (Capacitor) plutôt que dans un navigateur.
   Tout est importé à la demande : la version web n'en charge rien.
   ========================================================================== */
import { Capacitor } from '@capacitor/core'

export const estNatif = Capacitor.isNativePlatform()
export const plateforme = Capacitor.getPlatform() // 'web' | 'ios' | 'android'

/* Mode démo : les interrupteurs « Aperçu des états » et la réinitialisation.
   Allumé sur le web, éteint dans les builds des stores (VITE_DEMO=false). */
export const modeDemo = import.meta.env.VITE_DEMO !== 'false'

/* Ouvre un lien externe : onglet du système dans l'app native (Safari View
   Controller / Custom Tabs), nouvel onglet sur le web. */
export async function ouvrirLien(url) {
  // mailto:, tel: — c'est le système qui choisit l'appli.
  if (!/^https?:/i.test(url)) {
    window.location.href = url
    return
  }
  if (estNatif) {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url, presentationStyle: 'popover' })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

/* Un petit retour tactile sur les gestes qui comptent (kudo, oui, envoi). */
export async function vibrer() {
  if (!estNatif) return
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch { /* pas de moteur haptique */ }
}

/* Démarrage natif : barre d'état craie, écran de lancement retiré une fois
   React monté. */
export async function demarrerNatif() {
  if (!estNatif) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    // Texte sombre sur fond craie. Android est bord à bord (Capacitor 8) :
    // les marges viennent de env(safe-area-inset-*), déjà dans le CSS.
    await StatusBar.setStyle({ style: Style.Light })
  } catch { /* barre d'état indisponible */ }
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide({ fadeOutDuration: 200 })
  } catch { /* pas d'écran de lancement */ }

  // Les liens vers le site (dossard, espace) s'ouvrent dans l'onglet du
  // système, pas dans la WebView de l'app : on garde sa session du site.
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]')
    if (!a) return
    const href = a.getAttribute('href')
    if (/^https?:/i.test(href) && new URL(href).origin !== window.location.origin) {
      e.preventDefault()
      ouvrirLien(href)
    }
  }, true)
}

/* Le bouton retour d'Android : `retour()` ferme ce qui est ouvert et renvoie
   true ; s'il n'y a plus rien à fermer, l'app passe en arrière-plan. */
export function ecouterRetour(retour) {
  if (plateforme !== 'android') return () => {}
  let poignee
  import('@capacitor/app').then(({ App }) => {
    poignee = App.addListener('backButton', () => {
      if (!retour()) App.minimizeApp()
    })
  })
  return () => { poignee?.then?.((h) => h.remove()) }
}

/* Liens profonds dans l'app native : https://app.runoninvest.fr/?dossier=…
   (liens universels / App Links) ou roi://dossier?dossier=…  On renvoie la
   partie « ?… » de l'URL à l'appelant. */
export function ecouterLiensProfonds(surLien) {
  if (!estNatif) return () => {}
  let poignee
  import('@capacitor/app').then(({ App }) => {
    poignee = App.addListener('appUrlOpen', ({ url }) => {
      try { surLien(new URL(url).search) } catch { /* URL illisible */ }
    })
  })
  return () => { poignee?.then?.((h) => h.remove()) }
}
