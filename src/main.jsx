import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { estNatif } from './lib/natif'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/* Hors ligne sur le web seulement : l'app native embarque déjà ses fichiers. */
if (import.meta.env.PROD && !estNatif && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* pas de hors ligne, tant pis */ })
  })
}
