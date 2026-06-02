const ICON_PATHS = {
  sparkles: 'M11 3l1.6 5.4L18 10l-5.4 1.6L11 17l-1.6-5.4L4 10l5.4-1.6z',
  activity: 'M3 12h4l3 8 4-16 3 8h4',
  chat: 'M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z',
  arrowLeft: 'M15 18l-6-6 6-6',
  pencil: 'M4 20h4L18 10l-4-4L4 16zM14 6l4 4',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  x: 'M6 6l12 12M18 6 6 18',
  route: 'M9 18h6a3 3 0 0 0 3-3V9',
  flame: 'M12 3c1 3-1.5 4-1.5 6.5A3.5 3.5 0 0 0 14 13c0-1 .5-2 .5-2 1 1.5 1.5 3 1.5 4a4 4 0 1 1-8 0c0-3 2.5-4 4-12z',
  home: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  briefcase: 'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3',
  trendingUp: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  check: 'M20 6 9 17l-5-5',
  chevronRight: 'M9 18l6-6-6-6',
  star: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9z',
  zap: 'M13 2 3 14h7l-1 8 10-12h-7l1-8z',
  link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  comment: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  mountain: 'M8 3l4 8 5-5 5 15H2z',
  lock: 'M6 10V8a6 6 0 0 1 12 0v2M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z',
  crown: 'M3 8l4.5 3L12 5l4.5 6L21 8l-2 11H5L3 8z',
  gift: 'M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 8h20v4H2zM12 8V4M12 8c-3 0-5-1.2-5-2.5S8.5 3 12 8zM12 8c3 0 5-1.2 5-2.5S15.5 3 12 8z',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6.5 12 13l8.5-6.5',
  copy: 'M9 9h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM4 15V4a1 1 0 0 1 1-1h11',
  wand: 'M15 4V2M15 10V8M11 6H9M21 6h-2M18 9l-1.5-1.5M18 3l-1.5 1.5M3 21l9-9M14 7l3 3',
  cpu: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M6 6h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM9 9h6v6H9z',
  infinity: 'M6 8a4 4 0 1 0 0 8c2 0 3-1.5 4.5-4S15 8 18 8a4 4 0 1 1 0 8c-3 0-4.5-1.5-6-4',
  userPlus: 'M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',
  creditCard: 'M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM2 10h20M6 15h4',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  checkCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-6',
  refresh: 'M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 11a4 4 0 0 1 1-2.5C13 5 19 4 19 4s-1 6-4.5 9A4 4 0 0 1 12 14M9 11l-4 1M13 15l-1 4M9 11l4 4M15 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  coffee: 'M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM16 9h2a2 2 0 0 1 0 5h-1M7 2v2M11 2v2',
  video: 'M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3',
  leaf: 'M11 20A7 7 0 0 1 4 13C4 8 8 4 20 4c0 9-4 13-9 13-2 0-4-1-4-1M4 21c2-6 5-9 9-11',
}

export default function Icon({ name, className = 'w-5 h-5', filled = false }) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke} fill={filled ? 'currentColor' : 'none'}>
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18z" />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    )
  }
  if (name === 'compass') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M16 8l-2 6-6 2 2-6z" />
      </svg>
    )
  }
  if (name === 'mapPin') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <path d="M12 22s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }
  if (name === 'target') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" className={className} {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} fill={filled ? 'currentColor' : 'none'}>
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}
