import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* Implémentation Leaflet (chargée à la demande via RouteMap).
   `interactive=false` → vignette figée (cartes du feed / liste).
   `interactive=true`  → carte manipulable (vue détail). */
export default function RouteMapImpl({ route, interactive = false, className = '' }) {
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!ref.current || !route?.length) return

    const map = L.map(ref.current, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: false,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      touchZoom: interactive,
      tap: interactive,
      attributionControl: interactive,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const latlngs = route.map((p) => L.latLng(p[0], p[1]))

    // Tracé : halo blanc puis ligne bleu électrique pour le contraste.
    L.polyline(latlngs, { color: '#ffffff', weight: 7, opacity: 0.9, lineJoin: 'round' }).addTo(map)
    L.polyline(latlngs, { color: '#3B5BFF', weight: 4, opacity: 1, lineJoin: 'round' }).addTo(map)

    const start = latlngs[0]
    const end = latlngs[latlngs.length - 1]
    L.circleMarker(start, { radius: 5, color: '#fff', weight: 2, fillColor: '#2E7D5A', fillOpacity: 1 }).addTo(map)
    L.circleMarker(end, { radius: 5, color: '#fff', weight: 2, fillColor: '#3B5BFF', fillOpacity: 1 }).addTo(map)

    map.fitBounds(L.latLngBounds(latlngs), { padding: [22, 22] })

    // Le conteneur peut se stabiliser après l'animation d'écran / le layout.
    const raf = requestAnimationFrame(() => map.invalidateSize())
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(ref.current)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [route, interactive])

  return <div ref={ref} className={className} aria-label="Carte du parcours" />
}
