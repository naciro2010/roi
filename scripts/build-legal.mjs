// Génère public/confidentialite.html et public/cgu.html depuis src/data/legal.js
// (URL publique exigée par l'App Store et Google Play).
import { writeFileSync } from 'node:fs'
import { LEGAL, ENTITE } from '../src/data/legal.js'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

for (const [cle, doc] of Object.entries(LEGAL)) {
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.titre)} — R.O.I</title>
<style>
body{margin:0;background:#EFEBE2;color:#131211;font:16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:680px;margin:0 auto;padding:32px 20px 64px}
h1{font-size:28px;font-weight:500;margin:0 0 12px}h2{font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin:28px 0 8px}
a{color:#C93600}small{color:#57534A}
</style></head><body><main>
<h1>${esc(doc.titre)}</h1>
<p>${esc(doc.intro)}</p>
${doc.sections.map((s) => `<h2>${esc(s.t)}</h2>\n${s.p.map((x) => `<p>${esc(x)}</p>`).join('\n')}`).join('\n')}
<p><small>Mis à jour le ${esc(ENTITE.maj)} · <a href="mailto:${esc(ENTITE.contact)}">${esc(ENTITE.contact)}</a></small></p>
</main></body></html>
`
  writeFileSync(new URL(`../public/${cle}.html`, import.meta.url), html)
}
console.log('Pages légales générées.')
