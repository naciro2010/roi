import { lazy, Suspense } from 'react'
import { useApp } from '../AppContext'

// Leaflet (lib + CSS) est chargé à la demande, hors du bundle principal.
const RouteMapImpl = lazy(() => import('./RouteMapImpl'))

export default function RouteMap({ className = '', ...props }) {
  // Mode sobriété : on n'appelle pas les tuiles réseau (OpenStreetMap/CARTO),
  // seul le tracé GPS s'affiche — la carte reste informative sans télécharger
  // d'images. `useApp()` peut être nul hors provider : on retombe alors sur false.
  const lowData = !!useApp()?.eco
  return (
    <Suspense fallback={<div className={`${className} animate-pulse bg-surface-2`} aria-label="Chargement de la carte…" />}>
      <RouteMapImpl className={className} lowData={lowData} {...props} />
    </Suspense>
  )
}
