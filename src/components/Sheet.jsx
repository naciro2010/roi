import Icon from './Icon'
import { useSheetDrag } from '../lib/useSheetDrag'

/* La sheet : un voile, un panneau ancré en bas qui monte de 24 px en 280 ms.
   Coins hauts à 22 px, 560 px de large au plus, 88 % de la hauteur au plus.
   L'en-tête est collant : le titre, et un bouton rond pour fermer.

   `pad` = false quand le contenu gère lui-même ses marges (une liste qui
   doit toucher les bords, par exemple). */
export default function Sheet({ title, onClose, children, footer, pad = true, maxWidth = 560 }) {
  const drag = useSheetDrag(onClose)
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div
        style={{ maxWidth, ...drag.style }}
        className="animate-sheetUp relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-canvas"
      >
        <div
          {...drag.handleProps}
          className="flex shrink-0 items-center justify-between gap-3 bg-canvas px-5 pb-3 pt-[18px]"
        >
          <h2 className="text-[20px] font-medium tracking-[-.01em]">{title}</h2>
          <button onClick={onClose} className="rond tap" aria-label="Fermer">
            <Icon name="x" className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className={`no-scrollbar flex-1 overflow-y-auto ${pad ? 'px-5 pb-7' : 'pb-7'}`}>{children}</div>

        {footer && <div className="shrink-0 border-t border-line-soft bg-canvas px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  )
}

/* Le bloc encre d'une sheet : le seul aplat plein de l'écran. */
export function SheetBloc({ className = '', children }) {
  return <div className={`surface-hero rounded-2xl p-[22px] ${className}`}>{children}</div>
}
