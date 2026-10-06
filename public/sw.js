/* Service worker de l'app web R.O.I — hors ligne sobre.
   - Pages : le réseau d'abord, la dernière version gardée sinon.
   - Fichiers de /assets (nom haché, immuables) et fontes : le cache d'abord.
   - Rien d'une autre origine (le site, les tuiles de carte) n'est intercepté.
   Le nom du cache change à chaque version : les anciens sont supprimés. */
const CACHE = 'roi-v1'
const COQUILLE = ['/', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/fonts/archivo-latin-wdth-normal.woff2']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(COQUILLE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copie = r.clone()
          caches.open(CACHE).then((c) => c.put('/', copie))
          return r
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) {
    e.respondWith(
      caches.match(req).then((trouve) => trouve || fetch(req).then((r) => {
        if (r.ok) {
          const copie = r.clone()
          caches.open(CACHE).then((c) => c.put(req, copie))
        }
        return r
      })),
    )
  }
})
