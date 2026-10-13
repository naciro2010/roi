/* Service worker minimal : l'app s'ouvre hors ligne. Les fichiers versionnés
   (/assets/*, /fonts/*) sont servis du cache d'abord ; les pages passent par le
   réseau et retombent sur la dernière version connue. Jamais d'API en cache. */
const VERSION = 'roi-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(['/', '/manifest.webmanifest'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/') || /\.(png|svg|webp)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((r) => {
        const copie = r.clone()
        caches.open(VERSION).then((c) => c.put(request, copie))
        return r
      })),
    )
  }
})
