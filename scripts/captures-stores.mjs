/* Captures d'écran pour l'App Store et Google Play, depuis le build des stores.
   Prérequis : `npm run build:store`, puis Playwright (npx playwright, ou
   installé globalement). Usage : node scripts/captures-stores.mjs
   Sorties : store/captures/{ios,android}/NN-nom.png et la bannière Play. */
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { setTimeout as attendre } from 'node:timers/promises'

const PORT = 4318
const BASE = `http://localhost:${PORT}/`
const serveur = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
await attendre(2500)

/* iPhone 6,9" (1320 × 2868) et téléphone Android (1080 × 2160, ratio 2:1 max). */
const APPAREILS = {
  ios: { viewport: { width: 440, height: 956 }, deviceScaleFactor: 3 },
  android: { viewport: { width: 360, height: 720 }, deviceScaleFactor: 3 },
}

const ECRANS = [
  { nom: '01-accueil', faire: async () => {} },
  { nom: '02-rencontres', faire: async (p) => p.getByRole('button', { name: 'Rencontres' }).last().click() },
  { nom: '03-la-course', faire: async (p) => { await p.getByRole('button', { name: 'Profil' }).last().click(); await p.getByText('Ma course').click() } },
  { nom: '04-messages', faire: async (p) => p.getByRole('button', { name: 'Messages' }).last().click() },
  { nom: '05-profil', faire: async (p) => p.getByRole('button', { name: 'Profil' }).last().click() },
  { nom: '06-confidentialite', faire: async (p) => { await p.getByRole('button', { name: 'Profil' }).last().click(); await p.getByText('Confidentialité et suppression du compte').click() } },
]

const navigateur = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
try {
  for (const [os, appareil] of Object.entries(APPAREILS)) {
    const dossier = `store/captures/${os}`
    mkdirSync(dossier, { recursive: true })
    for (const ecran of ECRANS) {
      const ctx = await navigateur.newContext({ ...appareil, isMobile: true, hasTouch: true, locale: 'fr-FR', reducedMotion: 'reduce' })
      await ctx.addInitScript(() => localStorage.setItem('roi2_onboarded', '1'))
      const p = await ctx.newPage()
      await p.goto(BASE)
      await p.waitForLoadState('networkidle')
      await ecran.faire(p)
      await p.waitForTimeout(700)
      await p.screenshot({ path: `${dossier}/${ecran.nom}.png` })
      await ctx.close()
    }
    console.log(`Captures ${os} : ${dossier}`)
  }

  // La bannière Google Play (1024 × 500).
  const ctx = await navigateur.newContext({ viewport: { width: 1024, height: 500 } })
  const p = await ctx.newPage()
  await p.goto(BASE)
  await p.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:Archivo;src:url(${BASE}fonts/archivo-latin-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%}
    body{margin:0;width:1024px;height:500px;background:#070707;color:#EFEBE2;font-family:Archivo,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 72px;box-sizing:border-box;position:relative;overflow:hidden}
    .logo{font-size:96px;font-weight:300;font-stretch:125%;letter-spacing:.02em;display:flex;align-items:baseline;gap:18px}
    .logo i{display:inline-block;width:26px;height:26px;background:#FF4400}
    p{font-size:30px;font-weight:300;font-stretch:112%;margin:22px 0 0;max-width:760px;line-height:1.3}
    .ligne{position:absolute;left:0;right:0;bottom:84px;height:4px;background:rgba(239,235,226,.25)}
    .ligne:after{content:"";position:absolute;left:0;top:0;bottom:0;width:38%;background:#FF4400}
  </style></head><body><div class="logo">R<i></i>O<i></i>I</div><p>Une course par an. Un réseau toute l’année.</p><div class="ligne"></div></body></html>`)
  await p.waitForTimeout(400)
  await p.screenshot({ path: 'store/google-play/banniere-1024x500.png' })
  await ctx.close()
  console.log('Bannière Play : store/google-play/banniere-1024x500.png')
} finally {
  await navigateur.close()
  serveur.kill()
}
