import { AVATAR_SIZES, initials, tintFor } from '../lib/avatar'

export function Avatar({ name, size = 'md', ring = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? `Voir ${name}` : undefined}
      className={`${AVATAR_SIZES[size]} ${tintFor(name)} ${
        ring ? 'ring-2 ring-canvas' : ''
      } ${onClick ? 'tap' : ''} relative shrink-0 grid place-items-center font-medium uppercase select-none ring-1 ring-line`}
    >
      {initials(name)}
    </Tag>
  )
}

export function AvatarStack({ names, total, onMore }) {
  const extra = total - names.length
  return (
    <div className="flex items-center">
      <div className="flex gap-1">
        {names.map((n) => (
          <Avatar key={n} name={n} size="sm" />
        ))}
      </div>
      {extra > 0 && (
        <button
          onClick={onMore}
          className="ml-1 grid h-9 min-w-9 place-items-center border-2 border-canvas bg-surface-2 px-1 font-mono text-[11px] font-bold text-fg-muted"
        >
          +{extra}
        </button>
      )}
    </div>
  )
}
