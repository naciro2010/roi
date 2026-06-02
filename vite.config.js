import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build « sobre » : on vise les navigateurs modernes (moins de polyfills donc
// moins d'octets), on retire les `console`/`debugger` en production, et on
// isole React dans un chunk mis en cache au long cours. Leaflet est déjà
// chargé à la demande (import dynamique), hors du bundle initial.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    legalComments: 'none',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
}))
