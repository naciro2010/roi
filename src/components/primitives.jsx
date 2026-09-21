import Icon from './Icon'

/* Les briques partagées de l'interface. Règle de l'app : tout ce qui est ici
   se lit sans mode d'emploi. Pas de score en anneau, pas de mini-graphe de
   compatibilité, pas de jauge dont personne ne connaît l'échelle — un
   chiffre est accompagné de ce qu'il veut dire, ou il n'est pas affiché. */

/* Étiquette mono bordée, la puce carrée ■ orange devant : le `.tag` du site
   (les notes des cellules, la data des formats). */
export function Badge({ dot = true, on = false, className = '', children }) {
  return (
    <span className={`tag ${on ? 'on' : ''} ${className}`}>
      {dot && <b>■</b>}
      {children}
    </span>
  )
}

/* Jauge : un filet qui se remplit d'orange. Toujours accompagnée d'une
   phrase qui dit ce qui reste à faire — jamais seule. */
export function ProgressBar({ value, total, className = 'bg-craie/15', barClassName = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  return (
    <div className={`h-1 w-full overflow-hidden ${className}`}>
      <div className={`h-full ${barClassName} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* Le logotype R■O■I : deux points carrés orange, le même que sur le site. */
export function Logo({ light = false, size = 22 }) {
  return (
    <span
      className={`inline-flex items-center gap-[3px] leading-none ${light ? 'text-craie' : 'text-fg'}`}
      style={{ fontStretch: '118%', fontWeight: 300, fontSize: size, letterSpacing: '.04em' }}
      aria-label="R.O.I — Run On Investment"
    >
      R<i className="mb-[3px] inline-block self-end bg-brand-500" style={{ width: size * 0.27, height: size * 0.27, margin: `0 ${size * 0.23}px ${size * 0.14}px` }} />
      O<i className="mb-[3px] inline-block self-end bg-brand-500" style={{ width: size * 0.27, height: size * 0.27, margin: `0 ${size * 0.23}px ${size * 0.14}px` }} />
      I
    </span>
  )
}

/* La formule, près du nom (rien pour le Dossard). */
export function PlanBadge({ plan, className = '' }) {
  if (!plan || plan === 'free') return null
  return (
    <span className={`inline-flex items-center gap-1 bg-brand-500 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-mono text-encre ${className}`}>
      ■ {plan === 'business' ? 'Cercle' : 'Premium'}
    </span>
  )
}

/* Titre de section. Un titre dit ce qu'il y a dessous, en français, et
   `help` explique en une phrase à quoi ça sert : c'est la règle de lecture
   de l'app — jamais un libellé seul qu'il faut deviner. */
export function SectionTitle({ children, action, onAction, help }) {
  return (
    <div className="mb-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="titre-section">{children}</h2>
        {action && (
          <button onClick={onAction} className="flex shrink-0 items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-mono text-brand-500 tap">
            {action} <span aria-hidden>→</span>
          </button>
        )}
      </div>
      {help && <p className="aide mt-1">{help}</p>}
    </div>
  )
}

/* Une action mise en avant : un libellé lisible, une phrase qui dit ce qui
   se passe si on appuie, une flèche. Le motif de base de toute l'app. */
export function Action({ icon, label, detail, onClick, plein = false, marque, className = '' }) {
  return (
    <button onClick={onClick} className={`lien-bloc tap hover:bg-surface-2 ${className}`}>
      {icon && <span className={`ico ${plein ? 'plein' : ''}`}><Icon name={icon} className="h-4 w-4" /></span>}
      <span className="min-w-0 flex-1">
        {marque && <span className="mb-1 block font-mono text-[10.5px] font-bold uppercase tracking-mono text-brand-500">{marque}</span>}
        <span className="block text-[15px] font-medium leading-snug text-fg">{label}</span>
        {detail && <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">{detail}</span>}
      </span>
      <span className="shrink-0 font-mono text-fg-faint" aria-hidden>→</span>
    </button>
  )
}

/* Un chiffre et ce qu'il veut dire. Le label est une phrase, pas une
   abréviation : « personnes rencontrées », pas « RDV ». */
export function Chiffre({ value, label, suffix }) {
  return (
    <div>
      <div className="display text-[26px] leading-none tabular-nums">
        {value}{suffix && <small className="ml-1 align-top font-mono text-[11px] tracking-mono">{suffix}</small>}
      </div>
      <div className="mt-1.5 text-[12.5px] leading-snug text-fg-muted">{label}</div>
    </div>
  )
}

/* Fiche clé / valeur — la <dl class="fiche"> du site. rows = [[clé, valeur, note?]] */
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
