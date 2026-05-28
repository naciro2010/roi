// Teintes d'avatar claires et désaturées : tuile pastel + initiales profondes.
export const AVATAR_TINTS = [
  'bg-[#DDE3F1] text-[#3C455B]',
  'bg-[#E2DBE6] text-[#574A60]',
  'bg-[#D9E2E6] text-[#3F5560]',
  'bg-[#DCE6DD] text-[#3F5A45]',
  'bg-[#E7DDD4] text-[#6B5544]',
  'bg-[#EFE5E6] text-[#7A4B53]',
  'bg-[#E5E1EE] text-[#473E66]',
  'bg-[#E0E6EC] text-[#3F4756]',
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
