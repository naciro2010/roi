import { estNatif, plateforme } from './native'

/* Achats intégrés (App Store / Google Play) via RevenueCat.

   Apple (règle 3.1.1) et Google exigent leur propre système de paiement pour
   vendre un abonnement numérique dans l'app. Sur le web, rien ne change : le
   règlement reste sur runoninvest.fr. Sur mobile natif, c'est ce module.

   Mise en place côté RevenueCat / consoles : voir STORES.md. Les clés publiques
   SDK arrivent par l'environnement de build (VITE_REVENUECAT_IOS_KEY /
   VITE_REVENUECAT_ANDROID_KEY). Sans clé, `achatsDisponibles()` renvoie false et
   l'UI le dit franchement au lieu de faire semblant. */

const CLE = plateforme === 'ios'
  ? import.meta.env.VITE_REVENUECAT_IOS_KEY
  : import.meta.env.VITE_REVENUECAT_ANDROID_KEY

/* Les « entitlements » RevenueCat portent le nom du palier. */
const PALIERS = ['cercle', 'premium', 'membre']

let pret = null
function sdk() {
  if (!pret) {
    pret = import('@revenuecat/purchases-capacitor').then(async (m) => {
      await m.Purchases.configure({ apiKey: CLE })
      return m
    })
  }
  return pret
}

export const achatsDisponibles = () => estNatif && !!CLE

/* Traduit l'état RevenueCat en abonnement R.O.I : { palier, echeance, periodicite } ou null. */
function versAbonnement(info) {
  const actifs = info?.entitlements?.active || {}
  const palier = PALIERS.find((p) => actifs[p])
  if (!palier) return null
  const e = actifs[palier]
  return {
    palier,
    echeance: (e.expirationDate || '').slice(0, 10) || null,
    periodicite: /annual|annuel|year/i.test(e.productIdentifier || '') ? 'annuel' : 'mensuel',
  }
}

export async function etatAbonnement() {
  if (!achatsDisponibles()) return null
  const { Purchases } = await sdk()
  const { customerInfo } = await Purchases.getCustomerInfo()
  return versAbonnement(customerInfo)
}

/* Lance l'achat du palier. L'identifiant produit suit la convention
   `roi_<palier>_<mensuel|annuel>` créée dans les deux consoles. */
export async function acheter(palier, periodicite = 'annuel') {
  if (!achatsDisponibles()) throw new Error('indisponible')
  const { Purchases } = await sdk()
  const { offerings } = await Purchases.getOfferings()
  const paquets = offerings?.current?.availablePackages || []
  const id = `roi_${palier}_${periodicite}`
  const paquet = paquets.find((p) => p.product?.identifier?.startsWith(id))
  if (!paquet) throw new Error('produit introuvable')
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: paquet })
    return versAbonnement(customerInfo)
  } catch (e) {
    if (e?.userCancelled) return null
    throw e
  }
}

export async function restaurer() {
  if (!achatsDisponibles()) throw new Error('indisponible')
  const { Purchases } = await sdk()
  const { customerInfo } = await Purchases.restorePurchases()
  return versAbonnement(customerInfo)
}

/* Page de gestion / résiliation de l'abonnement dans le store. */
export const urlGestionAbonnement = plateforme === 'ios'
  ? 'https://apps.apple.com/account/subscriptions'
  : 'https://play.google.com/store/account/subscriptions'
