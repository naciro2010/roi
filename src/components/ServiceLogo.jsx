import Icon from './Icon'

/* Pastille de marque (glyphes simplifiés, sans logo officiel). */
const SIZES = { sm: 'h-9 w-9 rounded-xl', md: 'h-11 w-11 rounded-2xl', lg: 'h-12 w-12 rounded-2xl' }

function Glyph({ id }) {
  if (id === 'strava') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M10.6 3 4.8 14.4h3.4L10.6 9.6l2.4 4.8h3.4z" fill="#fff" />
        <path d="M13.4 14.4 11.9 17l-1.5-2.6H8.1l3.8 6.4 3.8-6.4z" fill="rgba(255,255,255,0.7)" />
      </svg>
    )
  }
  if (id === 'linkedin') return <span className="text-[15px] font-semibold lowercase text-white">in</span>
  if (id === 'apple') return <Icon name="heart" className="h-5 w-5 text-white" filled />
  if (id === 'garmin') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M12 4 4 18h16z" fill="#fff" />
      </svg>
    )
  }
  if (id === 'coros') return <span className="text-[15px] font-semibold text-white">C</span>
  if (id === 'polar') {
    return <span className="grid h-5 w-5 place-items-center rounded-full border-[3px] border-canvas" />
  }
  return <span className="text-[15px] font-semibold text-white">{id[0]?.toUpperCase()}</span>
}

export default function ServiceLogo({ service, size = 'md' }) {
  return (
    <span className={`grid shrink-0 place-items-center ${SIZES[size]}`} style={{ backgroundColor: service.color }}>
      <Glyph id={service.id} />
    </span>
  )
}
