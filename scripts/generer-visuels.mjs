/* Génère toutes les images de l'app depuis le signe R.O.I (public/icon.svg) :
   - public/ : icônes PWA (192, 512, maskable) et apple-touch-icon (180) ;
   - assets/ : les sources que `@capacitor/assets` décline en icônes et écrans
     de lancement Android / iOS (npm run natif:visuels).
   Usage : node scripts/generer-visuels.mjs */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const ENCRE = '#070707'
const CRAIE = '#EFEBE2'
const ORANGE = '#FF4400'

/* Le signe, sur un carré de `t` px : encre, un filet craie, le point orange.
   `zone` réduit le motif (icônes adaptatives : seul le centre est garanti). */
function signe(t, { zone = 1, fond = ENCRE } = {}) {
  const c = t / 2
  const p = (192 / 512) * t * zone // le point carré
  const f = (32 / 512) * t * zone // le filet
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">
    ${fond ? `<rect width="${t}" height="${t}" fill="${fond}"/>` : ''}
    <rect y="${c - f / 2}" width="${t}" height="${f}" fill="${CRAIE}" opacity=".45"/>
    <rect x="${c - p / 2}" y="${c - p / 2}" width="${p}" height="${p}" fill="${ORANGE}"/>
  </svg>`)
}

/* L'écran de lancement : fond craie, le signe en tuile au centre. */
function lancement(t, fond) {
  const tuile = Math.round(t * 0.22)
  const r = Math.round(tuile * 0.22)
  const o = (t - tuile) / 2
  const c = t / 2
  const p = (192 / 512) * tuile
  const f = (32 / 512) * tuile
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">
    <rect width="${t}" height="${t}" fill="${fond}"/>
    <clipPath id="c"><rect x="${o}" y="${o}" width="${tuile}" height="${tuile}" rx="${r}"/></clipPath>
    <g clip-path="url(#c)">
      <rect x="${o}" y="${o}" width="${tuile}" height="${tuile}" fill="${ENCRE}"/>
      <rect x="${o}" y="${c - f / 2}" width="${tuile}" height="${f}" fill="${CRAIE}" opacity=".45"/>
      <rect x="${c - p / 2}" y="${c - p / 2}" width="${p}" height="${p}" fill="${ORANGE}"/>
    </g>
  </svg>`)
}

/* Opaque par défaut : l'App Store refuse une icône avec canal alpha. Seul le
   premier plan de l'icône adaptative Android garde sa transparence. */
const png = (svg, out, { alpha = false } = {}) => {
  const img = sharp(svg)
  return (alpha ? img : img.flatten().removeAlpha()).png({ compressionLevel: 9 }).toFile(out)
}

mkdirSync('assets', { recursive: true })
await Promise.all([
  // PWA
  png(signe(192), 'public/icon-192.png'),
  png(signe(512), 'public/icon-512.png'),
  png(signe(512, { zone: 0.72 }), 'public/icon-maskable-512.png'),
  png(signe(180), 'public/apple-touch-icon.png'),
  // Sources natives (@capacitor/assets)
  png(signe(1024), 'assets/icon-only.png'),
  png(signe(1024, { zone: 0.62, fond: null }), 'assets/icon-foreground.png', { alpha: true }),
  png(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${ENCRE}"/></svg>`), 'assets/icon-background.png'),
  png(lancement(2732, CRAIE), 'assets/splash.png'),
  png(lancement(2732, '#131211'), 'assets/splash-dark.png'),
])
console.log('Visuels générés : public/ et assets/')
