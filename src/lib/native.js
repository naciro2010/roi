import { Capacitor } from '@capacitor/core'

/* Le pont avec l'enveloppe native (Capacitor). Sur le web, tout ici est un
   no-op : l'app reste la PWA qu'elle a toujours été. */
export const estNatif = Capacitor.isNativePlatform()
export const plateforme = Capacitor.getPlatform() // 'ios' | 'android' | 'web'

/* Au démarrage : barre d'état craie, écran de lancement retiré, et le bouton
   « retour » d'Android qui ferme d'abord la sheet ouverte (via `surRetour`)
   avant de quitter l'app. */
export async function initNatif({ surRetour } = {}) {
  if (!estNatif) return
  try {
    const [{ StatusBar, Style }, { SplashScreen }, { App }] = await Promise.all([
      import('@capacitor/status-bar'),
      import('@capacitor/splash-screen'),
      import('@capacitor/app'),
    ])
    if (plateforme === 'android') {
      await StatusBar.setBackgroundColor({ color: '#EFEBE2' })
    }
    await StatusBar.setStyle({ style: Style.Light })
    await SplashScreen.hide()
    App.addListener('backButton', ({ canGoBack }) => {
      if (surRetour && surRetour()) return
      if (canGoBack) window.history.back()
      else App.exitApp()
    })
  } catch {
    /* un plugin manquant ne doit jamais bloquer l'app */
  }
}

/* Notifications push : demandées seulement quand l'utilisateur les accepte
   (jamais au premier lancement). Nécessite Firebase (Android) et la clé APNs
   (iOS) — voir STORES.md. Renvoie le jeton d'appareil ou null. */
export async function activerPush() {
  if (!estNatif) return null
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')
    const etat = await PushNotifications.requestPermissions()
    if (etat.receive !== 'granted') return null
    return await new Promise((resolve) => {
      PushNotifications.addListener('registration', (t) => resolve(t.value))
      PushNotifications.addListener('registrationError', () => resolve(null))
      PushNotifications.register()
    })
  } catch {
    return null
  }
}
