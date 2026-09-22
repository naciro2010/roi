// Avatars : pas de photo. Les initiales (deux lettres au plus) sur un fond
// déterministe — le nom donne toujours la même couleur. Palette resserrée
// de huit paires [fond, texte], toujours en rond.
export const AVATAR_TINTS = [
  'bg-craie-2 text-encre', // #E7E1D4 / #131211
  'bg-encre text-craie', // #131211 / #EFEBE2
  'bg-craie-3 text-encre', // #D9D2C2 / #131211
  'bg-encre-2 text-craie', // #2A2723 / #EFEBE2
  'bg-brand-500 text-craie', // #FF4400 / #EFEBE2
  'bg-craie-2 text-encre',
  'bg-craie-3 text-encre',
  'bg-encre text-craie',
]

export const AVATAR_SIZES = {
  xs: 'w-8 h-8 text-[11px]',
  sm: 'w-[34px] h-[34px] text-[12px]',
  md: 'w-10 h-10 text-[13px]',
  lg: 'w-[46px] h-[46px] text-[15px]',
  xl: 'w-[60px] h-[60px] text-[19px]',
  '2xl': 'w-[66px] h-[66px] text-[22px]',
}

export function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function hashOf(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h
}

export function tintFor(name) {
  return AVATAR_TINTS[hashOf(name) % AVATAR_TINTS.length]
}
