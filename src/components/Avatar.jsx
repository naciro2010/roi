import { AVATAR_SIZES, initials, tintFor } from '../lib/avatar'

export function Avatar({ name, size = 'md', ring = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? `Voir ${name}` : undefined}
      className={`${AVATAR_SIZES[size]} ${tintFor(name)} ${
        ring ? 'ring-2 ring-canvas' : ''
      } ${onClick ? 'tap' : ''} relative shrink-0 rounded-full grid place-items-center font-semibold select-none`}
    >
      {initials(name)}
    </Tag>
  )
}

export function AvatarStack({ names, total, onMore }) {
  const extra = total - names.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {names.map((n) => (
          <Avatar key={n} name={n} size="sm" ring />
        ))}
      </div>
      {extra > 0 && (
        <button
          onClick={onMore}
          className="ml-2 grid h-9 min-w-9 place-items-center rounded-full border-2 border-canvas bg-surface-2 px-1 text-xs font-semibold text-fg-muted"
        >
          +{extra}
        </button>
      )}
    </div>
  )
}
