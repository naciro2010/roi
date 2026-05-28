/* RunMatch — la sortie matchée à 2 (Happn × pitch).
   ──────────────────────────────────────────────────
   À partir du profil de course d'un membre (créneau, allure, zone, distance),
   on propose un créneau de sortie concret : un jour, une heure, un lieu, une
   distance et une allure cible (la moyenne des deux allures, pour tenir la
   conversation). La sortie devient le rendez-vous business. */

import { profileFor, ME } from '../data/profiling'

/* Lieu de rendez-vous lisible par zone de course. */
const ZONE_PLACE = {
  seine: 'Bords de Seine · Pont de l’Alma',
  canal: 'Canal Saint-Martin',
  vincennes: 'Bois de Vincennes · Lac Daumesnil',
  ouest: 'Bois de Boulogne',
  ouest_paris: 'Bois de Boulogne',
  paris11: 'Paris 11e · Bastille',
  paris: 'Paris',
}

/* Format de sortie par type de distance. */
const DISTANCE = {
  tempo: { km: 8, label: '8 km tempo' },
  long: { km: 12, label: '12 km easy' },
  recovery: { km: 5, label: '5 km récup' },
}

function isoLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* min/km décimal → "m:ss". */
export function paceStr(p) {
  const m = Math.floor(p)
  const s = Math.round((p - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/* Construit une proposition de sortie pour un binôme donné. */
export function suggestRun(name) {
  const them = profileFor(name)
  const r = them.run || {}
  const d = new Date()
  let time
  if (r.window === 'we') {
    const add = (6 - d.getDay() + 7) % 7 || 7 // prochain samedi
    d.setDate(d.getDate() + add)
    time = '09:00'
  } else {
    d.setDate(d.getDate() + 1) // demain
    time = r.window === 'pm' ? '18:30' : '07:30'
  }
  const pace = ((ME.run.pace || 6) + (r.pace || 6)) / 2
  const dist = DISTANCE[r.distance] || DISTANCE.tempo
  const paceLabel = `${paceStr(pace)} /km`
  return {
    date: isoLocal(d),
    time,
    place: ZONE_PLACE[r.zone] || 'Paris',
    distance: dist.label,
    km: dist.km,
    pace: paceLabel,
    window: r.window,
    note: `RunMatch · ${dist.label} · allure ${paceStr(pace)}/km`,
  }
}
