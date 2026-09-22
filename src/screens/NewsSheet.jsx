import Icon from '../components/Icon'
import Sheet from '../components/Sheet'
import { NOUVELLES, CATEGORIES, nouvelleById, dateNouvelle } from '../data/news'
import { dateLongue } from '../data/plans'

/* Les nouvelles de R.O.I : la liste, ou une nouvelle en entier.
   C'est la première vocation de l'app — entre deux éditions, on ne laisse
   pas les gens sans nouvelles. */
export default function NewsSheet({ id, onSelect, onClose }) {
  const n = id ? nouvelleById(id) : null

  if (n) {
    const cat = CATEGORIES[n.categorie]
    return (
      <Sheet title="La nouvelle" onClose={onClose}>
        <button onClick={() => onSelect(null)} className="mb-4 flex items-center gap-2 text-[13.5px] font-semibold text-fg-muted tap">
          <Icon name="arrowLeft" className="h-4 w-4" /> Toutes les nouvelles
        </button>

        <div className="flex items-baseline gap-2 text-[12.5px]">
          <span className="font-semibold text-brand-500">{cat.label}</span>
          <span className="text-fg-faint">· {dateLongue(n.date)}</span>
        </div>
        <h3 className="mt-2 text-[22px] font-medium leading-tight tracking-[-.01em]">{n.titre}</h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-fg-soft">{n.chapo}</p>
        <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[1.65] text-fg-soft">{n.texte}</p>
      </Sheet>
    )
  }

  return (
    <Sheet title="Les nouvelles de R.O.I" onClose={onClose}>
      <p className="text-[14px] leading-[1.5] text-fg-muted">
        Le parcours, les vagues, le programme, et ce que l’édition précédente a produit.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {NOUVELLES.map((x) => {
          const cat = CATEGORIES[x.categorie]
          return (
            <button
              key={x.id}
              onClick={() => onSelect(x.id)}
              className="w-full rounded-xl border border-line bg-surface p-[18px] text-left tap"
            >
              <div className="flex items-baseline gap-2 text-[12.5px]">
                <span className="font-semibold text-brand-500">{cat.label}</span>
                <span className="text-fg-faint">· {dateNouvelle(x.date)}</span>
                {x.epingle && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-label="Épinglée" />}
              </div>
              <div className="mt-1.5 text-[15.5px] font-semibold leading-snug">{x.titre}</div>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-fg-muted">{x.chapo}</p>
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}
