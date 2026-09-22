import Icon from './Icon'

/* Les briques partagées de l'interface. Règle de l'app : tout ce qui est ici
   se lit sans mode d'emploi. Pas de score en anneau, pas de mini-graphe de
   compatibilité, pas de jauge dont personne ne connaît l'échelle — un
   chiffre est accompagné de ce qu'il veut dire, ou il n'est pas affiché.

   Depuis la refonte, l'apparence change mais l'API ne bouge pas : les écrans
   continuent de consommer ces composants tels quels. */

/* La carte de contenu : 18 px de rayon, un filet, le fond surface. */
export function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`rounded-xl border border-line bg-surface ${className}`} {...props}>
      {children}
    </Tag>
  )
}

/* Le bouton : une pilule, trois variantes.
   `accent` = orange · `encre` = neutre plein · `bordure` = secondaire.
   `fait` est l'état « c'est envoyé » : gris chaud, non cliquable. */
const BTN_VARIANTES = {
  accent: 'bg-brand-500 text-craie border-transparent',
  encre: 'bg-encre text-craie border-transparent',
  bordure: 'bg-transparent text-fg-muted border-line-strong',
  fait: 'bg-craie-2 text-fg-muted border-transparent',
}
export function Btn({ variante = 'accent', full = false, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-[11px] text-[14px] font-semibold tap ${
        BTN_VARIANTES[variante] || BTN_VARIANTES.accent
      } ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* La puce : une pilule d'information ou de filtre. */
export function Chip({ on = false, className = '', children, ...props }) {
  const Tag = props.onClick ? 'button' : 'span'
  return (
    <Tag
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-[7px] text-[13px] font-medium ${
        on ? 'border-encre bg-encre text-craie' : 'border-line-strong bg-transparent text-fg-muted'
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

/* Étiquette d'information (ce que quelqu'un apporte, un état). */
export function Badge({ dot = false, on = false, className = '', children }) {
  return (
    <span className={`tag ${on ? 'on' : ''} ${className}`}>
      {dot && <b>■</b>}
      {children}
    </span>
  )
}

/* Jauge : un filet qui se remplit d'orange. Toujours accompagnée d'une
   phrase qui dit ce qui reste à faire — jamais seule. */
export function ProgressBar({ value, total, className = 'bg-craie-2', barClassName = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className={`h-[3px] w-full overflow-hidden rounded-full ${className}`}>
      <div className={`h-full rounded-full ${barClassName} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* Le logotype R■O■I : deux carrés orange posés sur la ligne de base. C'est,
   avec l'orange, le seul signal d'identité que la refonte conserve. */
export function Logo({ light = false, size = 21 }) {
  const carre = { width: 5, height: 5, margin: '0 4px 3px' }
  return (
    <span
      className={`inline-flex items-center leading-none ${light ? 'text-craie' : 'text-fg'}`}
      style={{ fontStretch: '112%', fontWeight: 400, fontSize: size, letterSpacing: '.03em' }}
      aria-label="R.O.I — Run On Investment"
    >
      R<i className="inline-block self-end bg-brand-500" style={carre} />
      O<i className="inline-block self-end bg-brand-500" style={carre} />
      I
    </span>
  )
}

/* La formule, près du nom (rien pour le Dossard). */
export function PlanBadge({ plan, className = '' }) {
  if (!plan || plan === 'free') return null
  return (
    <span className={`inline-flex items-center rounded-full bg-brand-500 px-2 py-[3px] text-[11px] font-semibold text-craie ${className}`}>
      {plan === 'business' ? 'Cercle' : 'Premium'}
    </span>
  )
}

/* Titre de section : 13 px, gras, capitales, béton. `help` explique en une
   phrase à quoi sert ce qu'il y a dessous. */
export function SectionTitle({ children, action, onAction, help }) {
  return (
    <div className="mb-2.5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="titre-section">{children}</h2>
        {action && (
          <button onClick={onAction} className="shrink-0 text-[13px] font-semibold text-brand-500 tap">
            {action}
          </button>
        )}
      </div>
      {help && <p className="aide mt-1.5 text-[13.5px]">{help}</p>}
    </div>
  )
}

/* Une action mise en avant : une pastille, un libellé, une phrase qui dit ce
   qui se passe si on appuie, un chevron. Le motif de base de toute l'app.
   `plein` réservait autrefois un fond encre ; la pastille est désormais
   neutre, sauf `marque` qui la passe en orange (une seule par écran). */
export function Action({ icon, label, detail, onClick, plein = false, marque, className = '' }) {
  const accent = !!marque
  return (
    <button onClick={onClick} className={`lien-bloc tap ${className}`}>
      {icon && (
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
            accent ? 'bg-brand-500 text-craie' : 'bg-canvas text-fg'
          }`}
        >
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold leading-snug text-fg">{label}</span>
        {detail && <span className="mt-0.5 block text-[13.5px] leading-snug text-fg-muted">{detail}</span>}
      </span>
      <Icon name="chevronRight" className="h-[18px] w-[18px] shrink-0 text-fg-faint" />
    </button>
  )
}

/* Un chiffre et ce qu'il veut dire. Le label est une phrase, pas une
   abréviation : « personnes rencontrées », pas « RDV ». */
export function Chiffre({ value, label, suffix, size = 30 }) {
  return (
    <div>
      <div className="font-medium leading-none tabular-nums" style={{ fontSize: size, letterSpacing: '-.01em' }}>
        {value}{suffix && <small className="ml-1 align-top text-[13px] font-normal text-fg-faint">{suffix}</small>}
      </div>
      <div className="mt-2 text-[12.5px] leading-[1.3] text-fg-muted">{label}</div>
    </div>
  )
}

/* Une tuile de stat : le chiffre, ce qu'il veut dire, dans une carte. */
export function Tuile({ value, label, size = 30 }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-3.5 py-4">
      <Chiffre value={value} label={label} size={size} />
    </div>
  )
}

/* Fiche clé / valeur. rows = [[clé, valeur, note?]] */
export function Fiche({ rows, className = '' }) {
  return (
    <dl className={`fiche ${className}`}>
      {rows.map(([k, v, note]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}{note && <small>{note}</small>}</dd>
        </div>
      ))}
    </dl>
  )
}
