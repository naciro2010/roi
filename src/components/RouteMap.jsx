import { lazy, Suspense } from 'react'

// Leaflet (lib + CSS) est chargé à la demande, hors du bundle principal.
const RouteMapImpl = lazy(() => import('./RouteMapImpl'))

export default function RouteMap({ className = '', ...props }) {
  return (
    <Suspense fallback={<div className={`${className} animate-pulse bg-ink-100`} aria-label="Chargement de la carte…" />}>
      <RouteMapImpl className={className} {...props} />
    </Suspense>
  )
}
