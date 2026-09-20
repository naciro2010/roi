// Avatars « La Ligne » : des carrés de craie ou d'encre, initiales en Archivo
// étendu. Une seule variante orange pour rythmer les listes.
export const AVATAR_TINTS = [
  'bg-craie-2 text-fg',
  'bg-encre text-craie',
  'bg-craie-3 text-fg',
  'bg-encre-2 text-craie',
  'bg-craie-2 text-fg',
  'bg-brand-500 text-encre',
  'bg-craie-3 text-fg',
  'bg-encre text-craie',
]

export const AVATAR_SIZES = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-24 h-24 text-3xl',
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
