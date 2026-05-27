// Teintes d'avatar sombres et désaturées : tuile profonde + initiales lumineuses.
export const AVATAR_TINTS = [
  'bg-[#2A3350] text-[#AEB8DA]',
  'bg-[#2E2A3D] text-[#C2B6D6]',
  'bg-[#23323A] text-[#A8C5CF]',
  'bg-[#2C3243] text-[#B4BCCE]',
  'bg-[#1F3328] text-[#9FD0B0]',
  'bg-[#322A22] text-[#D8C2A6]',
  'bg-[#312530] text-[#D6AEC2]',
  'bg-[#28303F] text-[#B7C0D2]',
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
