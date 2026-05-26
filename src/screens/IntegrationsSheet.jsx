import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import ServiceLogo from '../components/ServiceLogo'
import { SERVICES, CATEGORIES } from '../data/integrations'

export default function IntegrationsSheet({ onClose }) {
  const { integrations, toggleIntegration } = useApp()

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-ink-950/50" onClick={onClose} />
      <div className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-float">
        <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <h2 className="text-base font-bold text-ink-900">Comptes & appareils</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-500 tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <p className="text-[13px] leading-relaxed text-ink-500">
            Connecte tes comptes et ta montre pour importer tes courses, enrichir ton profil et faire monter ton ROI réseau sans rien saisir à la main.
          </p>

          {CATEGORIES.map((cat) => (
            <section key={cat.id} className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{cat.label}</p>
              <div className="space-y-2">
                {SERVICES.filter((s) => s.category === cat.id).map((s) => {
                  const connected = !!integrations[s.id]
                  return (
                    <article key={s.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
                      <ServiceLogo service={s} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-bold text-ink-900">{s.name}</span>
                          {connected && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#EAEEEB] px-1.5 py-0.5 text-[10px] font-bold text-[#48584E]">
                              <Icon name="check" className="h-2.5 w-2.5" /> Connecté
                            </span>
                          )}
                        </div>
                        <div className="truncate text-[12px] text-ink-400">
                          {connected ? 'Synchronisé · dernière sync à l’instant' : s.blurb}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleIntegration(s.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tap ${
                          connected ? 'border border-ink-200 text-ink-600' : 'bg-brand-500 text-white shadow-brand'
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

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-400">
            <Icon name="shield" className="h-3.5 w-3.5" /> Connexion sécurisée · tu peux te déconnecter à tout moment
          </p>
        </div>
      </div>
    </div>
  )
}
