import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import ServiceLogo from '../components/ServiceLogo'
import { SERVICES, CATEGORIES } from '../data/integrations'

export default function IntegrationsSheet({ onClose }) {
  const { integrations, toggleIntegration } = useApp()

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-voile" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-surface">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <span className="titre-section">Tes applis connectées</span>
            <h2 className="titre mt-1 text-[20px] text-fg">Tes sorties, importées</h2>
          </div>
          <button onClick={onClose} className="ico tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <p className="text-[13px] leading-relaxed text-fg-muted">
            Connecte Strava ou ta montre : tes sorties arrivent seules, tu n’as plus qu’à dire avec qui tu as couru. LinkedIn remplit le verso du dossard.
          </p>

          {CATEGORIES.map((cat) => (
            <section key={cat.id} className="mt-5">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-mono text-fg-faint">{cat.label}</p>
              <div className="space-y-2">
                {SERVICES.filter((s) => s.category === cat.id).map((s) => {
                  const connected = !!integrations[s.id]
                  return (
                    <article key={s.id} className="flex items-center gap-3 border border-line bg-surface p-3">
                      <ServiceLogo service={s} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-semibold text-fg">{s.name}</span>
                          {connected && (
                            <span className="tag on">
                              <Icon name="check" className="h-2.5 w-2.5" /> Connecté
                            </span>
                          )}
                        </div>
                        <div className="truncate text-[12px] text-fg-faint">
                          {connected ? 'Connecté · tes sorties arrivent seules' : s.blurb}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleIntegration(s.id)}
                        className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold tap ${
                          connected ? 'border border-line-strong text-fg-soft' : 'btn btn-impact'
                        }`}
                      >
                        {connected ? 'Déconnecter' : 'Connecter'}
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-fg-faint">
            <Icon name="shield" className="h-3.5 w-3.5" /> Connexion sécurisée · tu déconnectes quand tu veux
          </p>
        </div>
      </div>
    </div>
  )
}
