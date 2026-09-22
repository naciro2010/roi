import { AVATAR_SIZES, initials, tintFor } from '../lib/avatar'

/* Rond, les initiales au centre, un fond déterministe tiré du nom. */
export function Avatar({ name, size = 'md', ring = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? `Voir ${name}` : undefined}
      className={`${AVATAR_SIZES[size]} ${tintFor(name)} ${ring ? 'ring-2 ring-canvas' : ''} ${
        onClick ? 'tap' : ''
      } relative grid shrink-0 select-none place-items-center rounded-full font-semibold uppercase`}
    >
      {initials(name)}
    </Tag>
  )
}

export function AvatarStack({ names, total, onMore }) {
  const extra = total - names.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {names.map((n) => (
          <Avatar key={n} name={n} size="sm" ring />
        ))}
      </div>
      {extra > 0 && (
        <button
          onClick={onMore}
          className="-ml-2 grid h-[34px] min-w-[34px] place-items-center rounded-full bg-craie-2 px-1.5 text-[12px] font-semibold text-fg-muted ring-2 ring-canvas"
        >
          +{extra}
        </button>
      )}
    </div>
  )
}
