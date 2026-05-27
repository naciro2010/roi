import { useEffect, useRef, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { PILL_TONES } from '../components/primitives'
import { COPILOT_INSIGHTS, COPILOT_PROMPTS } from '../data/copilot'
import { FREE_AI_LIMIT } from '../data/plans'

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-ink-300"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function CopilotSheet({ onClose }) {
  const { copilotThread, copilotTyping, sendCopilot, aiUnlimited, aiUses, openPlans } = useApp()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  const remaining = Math.max(0, FREE_AI_LIMIT - aiUses)
  const atLimit = !aiUnlimited && remaining === 0
  const showInsights = copilotThread.length <= 1

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [copilotThread.length, copilotTyping])

  function submit(payload) {
    const sent = sendCopilot(payload)
    if (sent) setDraft('')
  }

  function onInsight(ins) {
    if (ins.intent === 'post-idea') {
      submit({ text: 'Donne-moi une idée de post pour aujourd’hui', intent: 'post-idea' })
    } else {
      submit({ text: `${ins.action} — ${ins.member || ''}`.trim(), intent: ins.intent })
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-ink-50">
      {/* En-tête IA premium */}
      <div className="relative shrink-0 overflow-hidden bg-ink-950 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Icon name="sparkles" className="h-5 w-5 text-brand-200" filled />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold leading-tight">Copilot IA</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-success-300">
                <span className="h-1.5 w-1.5 rounded-full bg-success-300" /> en ligne
              </span>
            </div>
            <p className="truncate text-[12px] text-white/55">
              {aiUnlimited ? 'Illimité · plan Pro' : `${remaining} question${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} cette semaine`}
            </p>
          </div>
          <button onClick={onClose} className="glass-dark grid h-9 w-9 place-items-center rounded-full text-white tap" aria-label="Fermer">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Corps : insights + conversation */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-4 py-4">
        {showInsights && (
          <section>
            <div className="mb-2 flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wide text-ink-500">
              <Icon name="wand" className="h-3.5 w-3.5 text-brand-500" /> Pour toi cette semaine
            </div>
            <div className="space-y-2.5">
              {COPILOT_INSIGHTS.map((ins) => (
                <article key={ins.id} className="rounded-2xl border border-ink-100 bg-white p-3.5 shadow-soft">
                  <div className="flex gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${PILL_TONES[ins.tone]}`}>
                      <Icon name={ins.icon} className="h-4 w-4" filled={ins.icon === 'sparkles'} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-bold text-ink-900">{ins.title}</h3>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-600">{ins.text}</p>
                      <button
                        onClick={() => onInsight(ins)}
                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-bold text-brand-700 tap"
                      >
                        <Icon name="wand" className="h-3.5 w-3.5" /> {ins.action}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Conversation */}
        <div className="space-y-2.5">
          {copilotThread.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {m.from === 'ai' && (
                <span className="mr-2 mt-0.5 grid h-7 w-7 shrink-0 place-items-center self-end rounded-full bg-gradient-to-br from-brand-500 to-[#7E6FB0] text-white">
                  <Icon name="sparkles" className="h-3.5 w-3.5" filled />
                </span>
              )}
              <div
                className={`animate-bubbleIn max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-soft ${
                  m.from === 'me'
                    ? 'rounded-br-md bg-brand-500 text-white'
                    : 'rounded-bl-md border border-ink-100 bg-white text-ink-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {copilotTyping && (
            <div className="flex justify-start">
              <span className="mr-2 grid h-7 w-7 shrink-0 place-items-center self-end rounded-full bg-gradient-to-br from-brand-500 to-[#7E6FB0] text-white">
                <Icon name="sparkles" className="h-3.5 w-3.5" filled />
              </span>
              <div className="rounded-2xl rounded-bl-md border border-ink-100 bg-white shadow-soft">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pied : quota / prompts + saisie */}
      <div className="glass shrink-0 border-t border-ink-100 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        {atLimit ? (
          <div className="rounded-2xl border border-brand-200 bg-brand-light/60 p-3.5 text-center">
            <p className="text-[13px] font-bold text-ink-900">Tu as utilisé tes {FREE_AI_LIMIT} questions de la semaine</p>
            <p className="mt-0.5 text-[12px] text-ink-500">Passe à Pro pour un Copilot IA illimité, ou reviens lundi ☕</p>
            <button
              onClick={() => { onClose(); openPlans() }}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-[#7E6FB0] px-4 py-2 text-sm font-bold text-white shadow-brand tap"
            >
              <Icon name="crown" className="h-4 w-4" filled /> Passer à Pro
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {COPILOT_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => submit({ text: p.label, intent: p.intent })}
                  className="shrink-0 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-600 tap"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) submit({ text: draft.trim() }) }}
              className="flex items-center gap-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Demande à ton Copilot…"
                className="flex-1 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-200 placeholder:text-ink-400"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-brand tap disabled:opacity-40"
                aria-label="Envoyer"
              >
                <Icon name="send" className="h-5 w-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
