const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.']
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

export function formatEventDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d - today) / 86400000)
  const full = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`

  let relative
  if (diff < 0) relative = 'passé'
  else if (diff === 0) relative = "aujourd'hui"
  else if (diff === 1) relative = 'demain'
  else if (diff < 7) relative = `dans ${diff} jours`
  else relative = `dans ${Math.round(diff / 7)} sem.`

  return { full, relative, diff }
}
