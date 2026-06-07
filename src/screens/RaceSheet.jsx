import { useMemo, useState } from 'react'
import { useApp } from '../AppContext'
import Icon from '../components/Icon'
import { Avatar } from '../components/Avatar'
import RouteMap from '../components/RouteMap'
import { useSheetDrag } from '../lib/useSheetDrag'
import { formatEventDate } from '../lib/dates'
import { CURRENT_USER } from '../data/user'
import {
  RACE, RACE_STATS, WHY, INCLUDED, PROGRAM, TESTIMONIALS, FAQ,
  DISTANCES, distanceById, SAS, sasById, PAY_METHODS,
  GROUP_TIERS, VOUCHERS, priceBreakdown, tierFor,
} from '../data/race'

/* Accents par tonalité (les distances/SAS utilisent emerald/brand/gold/indigo). */
const ACCENT = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500', solid: 'bg-brand-500', ring: 'ring-brand-300', soft: 'bg-brand-light' },
  emerald: { bg: 'bg-success-light', text: 'text-success-dark', dot: 'bg-success', solid: 'bg-success', ring: 'ring-success/40', soft: 'bg-success-light' },
  gold: { bg: 'bg-gold-light', text: 'text-gold-dark', dot: 'bg-gold', solid: 'bg-gold', ring: 'ring-gold/50', soft: 'bg-gold-light' },
  indigo: { bg: 'bg-[#EAE7F5]', text: 'text-[#403881]', dot: 'bg-[#5E63B8]', solid: 'bg-[#5E63B8]', ring: 'ring-[#5E63B8]/40', soft: 'bg-[#EAE7F5]' },
}

const STEPS = ['Distance', 'Format', 'Profil', 'Entreprise', 'Sas', 'Paiement']

/* ----------------------------------------------------------------- champs */
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[12px] font-semibold text-fg-soft">
        {label}
        {hint && <span className="font-medium text-fg-faint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-line bg-surface px-3.5 py-3 text-[14px] text-fg shadow-soft outline-none transition placeholder:text-fg-faint focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    />
  )
}

export default function RaceSheet({ onClose }) {
  const { registerRace, raceRegistration, showToast } = useApp()
  const drag = useSheetDrag(onClose)
  const alreadyIn = raceRegistration?.confirmed

  // 0 = annonce (landing) · 1→6 = tunnel d'inscription · 7 = confirmation
  const [step, setStep] = useState(0)

  const [first, ...rest] = CURRENT_USER.name.split(' ')
  const [form, setForm] = useState({
    distance: '10k',
    type: 'solo',
    qty: 1,
    firstName: first,
    lastName: rest.join(' '),
    email: '',
    phone: '',
    company: CURRENT_USER.company,
    role: CURRENT_USER.role,
    siren: '',
    size: '',
    teamName: '',
    sas: 'business',
    voucher: '',
    voucherOk: null, // null | {off,label} | false
    pay: 'voucher',
    poNumber: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
    consent: false,
  })
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const dist = distanceById(form.distance)
  const d = formatEventDate(RACE.date)
  const voucherOff = form.voucherOk ? form.voucherOk.off : 0
  const bill = useMemo(
    () => priceBreakdown(form.type === 'group' ? form.qty : 1, voucherOff),
    [form.type, form.qty, voucherOff],
  )

  function applyVoucher() {
    const code = form.voucher.trim().toUpperCase()
    if (!code) return set({ voucherOk: null })
    const v = VOUCHERS[code]
    set({ voucherOk: v || false })
    showToast(v ? `Code appliqué · ${v.label}` : 'Code invalide')
  }

  const emailOk = /^\S+@\S+\.\S+$/.test(form.email)
  function canContinue() {
    switch (step) {
      case 1: return !!form.distance
      case 2: return form.type === 'solo' || form.qty >= 2
      case 3: return form.firstName.trim() && form.lastName.trim() && emailOk
      case 4: return form.company.trim().length > 0
      case 5: return !!form.sas
      case 6:
        if (!form.consent) return false
        if (form.pay === 'voucher') return form.poNumber.trim().length > 0
        if (form.pay === 'card') return form.cardNumber.replace(/\s/g, '').length >= 12 && form.cardExp && form.cardCvc.length >= 3
        return true // paypal / gpay : flux externe simulé
      default: return true
    }
  }

  function next() { setStep((s) => Math.min(7, s + 1)) }
  function back() { setStep((s) => Math.max(0, s - 1)) }

  function confirm() {
    const dossard = `RUN-${Math.floor(1000 + Math.random() * 9000)}`
    registerRace({
      confirmed: true,
      dossard,
      distance: form.distance,
      type: form.type,
      qty: form.type === 'group' ? form.qty : 1,
      sas: form.sas,
      pay: form.pay,
      ttc: bill.ttc,
    })
    setStep(7)
  }

  /* ----------------------------------------------------------- rendu étapes */
  const renderIntro = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Carte du parcours en bandeau */}
      <div className="relative h-52 shrink-0 bg-surface-2">
        <RouteMap route={dist.route} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="pointer-events-none absolute left-4 top-3 z-[500] inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 shadow-soft backdrop-blur">
          <Icon name="flag" className="h-3.5 w-3.5" /> Départ & arrivée · {RACE.venue}
        </span>
        <div className="pointer-events-none absolute bottom-3 left-4 z-[500] text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{RACE.edition} · {d.full}</div>
          <div className="text-[22px] font-extrabold leading-tight drop-shadow">{RACE.name}</div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
          <Icon name="sparkles" className="h-3.5 w-3.5" filled /> Course officielle ROI
        </span>
        <h2 className="mt-2.5 text-[22px] font-extrabold leading-tight text-fg">{RACE.tagline}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-fg-soft">{RACE.intro}</p>

        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-brand-100 bg-brand-light/50 px-3.5 py-3">
          <Icon name="crown" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" filled />
          <p className="text-[12.5px] font-semibold leading-snug text-brand-800">{RACE.audience}</p>
        </div>

        {/* Chiffres clés */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {RACE_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface px-2 py-2.5 text-center shadow-soft">
              <div className="text-[17px] font-extrabold leading-none tabular-nums text-fg">{s.value}</div>
              <div className="mt-1 text-[10px] font-semibold leading-tight text-fg-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Distances */}
        <h3 className="mt-6 text-[15px] font-bold text-fg">Trois distances, un seul peloton</h3>
        <p className="mt-0.5 text-[12.5px] text-fg-muted">Toutes au départ et à l’arrivée de l’Arena.</p>
        <div className="mt-3 space-y-2.5">
          {DISTANCES.map((x) => {
            const a = ACCENT[x.tone]
            return (
              <div key={x.id} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                <div className="flex items-center gap-3 p-3.5">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${a.bg} ${a.text} text-center text-[13px] font-extrabold leading-none`}>
                    {x.label.replace(' · 21,1 km', '').replace(' km', 'k').replace('Semi', '21')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="truncate text-[14px] font-bold text-fg">{x.name}</h4>
                      {x.popular && <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Top</span>}
                    </div>
                    <p className="truncate text-[12px] text-fg-muted">{x.loops} · {x.elevation} · {x.duration}</p>
                  </div>
                </div>
                <p className="px-3.5 pb-3.5 text-[12.5px] leading-relaxed text-fg-soft">{x.tagline}</p>
              </div>
            )
          })}
        </div>

        {/* Pourquoi business */}
        <h3 className="mt-6 text-[15px] font-bold text-fg">Pourquoi courir le ROI Business Run</h3>
        <div className="mt-3 space-y-2.5">
          {WHY.map((w) => (
            <div key={w.title} className="flex gap-3 rounded-3xl border border-line bg-surface p-3.5 shadow-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name={w.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h4 className="text-[13.5px] font-bold text-fg">{w.title}</h4>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-fg-soft">{w.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inclus */}
        <div className="mt-6 overflow-hidden rounded-3xl surface-hero text-white shadow-float">
          <div className="relative p-5">
            <div className="absolute inset-0 bg-aurora" />
            <div className="relative">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[15px] font-bold">Votre dossard tout compris</h3>
                <div className="text-right">
                  <div className="text-[24px] font-extrabold leading-none tabular-nums">500 €<span className="ml-1 text-[12px] font-semibold text-white/55">HT</span></div>
                  <div className="text-[11px] text-white/60">soit 600 € TTC</div>
                </div>
              </div>
              <ul className="mt-3.5 grid gap-2">
                {INCLUDED.map((i) => (
                  <li key={i.text} className="flex items-start gap-2.5 text-[12.5px]">
                    <Icon name={i.icon} className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                    <span className="text-white/90">{i.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/55">
                <Icon name="users" className="h-3.5 w-3.5" /> Tarif dégressif dès 3 dossards pour les équipes.
              </p>
            </div>
          </div>
        </div>

        {/* Programme */}
        <h3 className="mt-6 text-[15px] font-bold text-fg">Le déroulé de la matinée</h3>
        <div className="mt-3 space-y-0">
          {PROGRAM.map((p, i) => (
            <div key={p.time} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">{p.time}</span>
                {i < PROGRAM.length - 1 && <span className="my-0.5 w-px flex-1 bg-line-strong" />}
              </div>
              <div className="pb-4">
                <h4 className="text-[13.5px] font-bold text-fg">{p.title}</h4>
                <p className="text-[12px] text-fg-muted">{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <div className="mt-2 space-y-2.5">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-line bg-surface-soft p-4 shadow-soft">
              <blockquote className="text-[13px] italic leading-relaxed text-fg-soft">« {t.text} »</blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <Avatar name={t.name} size="sm" />
                <div>
                  <div className="text-[12.5px] font-bold text-fg">{t.name}</div>
                  <div className="text-[11px] text-fg-muted">{t.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* FAQ */}
        <h3 className="mt-6 text-[15px] font-bold text-fg">Questions fréquentes</h3>
        <div className="mt-3 space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface px-3.5 py-3 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[13px] font-semibold text-fg">
                {f.q}
                <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-fg-faint transition group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-[12.5px] leading-relaxed text-fg-soft">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-fg-faint">
          <Icon name="mapPin" className="h-3.5 w-3.5" /> {RACE.venue} · {RACE.address}
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (step) {
      /* 1 — Distance */
      case 1:
        return (
          <StepBody title="Choisis ta distance" sub="Toutes au départ et à l’arrivée de l’Arena.">
            <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
              <RouteMap route={dist.route} className="h-40 w-full" />
            </div>
            <div className="mt-3 space-y-2.5">
              {DISTANCES.map((x) => {
                const a = ACCENT[x.tone]
                const on = form.distance === x.id
                return (
                  <button
                    key={x.id}
                    onClick={() => set({ distance: x.id })}
                    className={`flex w-full items-center gap-3 rounded-3xl border p-3.5 text-left tap ${
                      on ? `border-transparent ring-2 ${a.ring} ${a.soft}` : 'border-line bg-surface shadow-soft'
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${a.bg} ${a.text} text-[12px] font-extrabold`}>
                      {x.label.replace(' · 21,1 km', '').replace(' km', 'k').replace('Semi', '21')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[14px] font-bold text-fg">{x.label}</span>
                        {x.popular && <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Top</span>}
                      </div>
                      <div className="truncate text-[12px] text-fg-muted">{x.loopsShort} · {x.elevation} · {x.duration}</div>
                    </div>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? `${a.solid} border-transparent text-white` : 'border-line-strong text-transparent'}`}>
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 rounded-2xl bg-surface-soft px-3.5 py-3 text-[12.5px] leading-relaxed text-fg-soft">{dist.description}</p>
          </StepBody>
        )

      /* 2 — Solo / Groupe */
      case 2:
        return (
          <StepBody title="Solo ou en équipe ?" sub="Inscris-toi seul·e ou engage toute ta boîte.">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'solo', icon: 'user', label: 'En solo', sub: 'Un dossard nominatif' },
                { id: 'group', icon: 'users', label: 'En groupe', sub: 'Tarif dégressif dès 3' },
              ].map((o) => {
                const on = form.type === o.id
                return (
                  <button
                    key={o.id}
                    onClick={() => set({ type: o.id, qty: o.id === 'group' ? Math.max(2, form.qty) : 1 })}
                    className={`rounded-3xl border p-4 text-left tap ${on ? 'border-transparent bg-brand-light ring-2 ring-brand-300' : 'border-line bg-surface shadow-soft'}`}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl ${on ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
                      <Icon name={o.icon} className="h-5 w-5" />
                    </span>
                    <div className="mt-2.5 text-[14px] font-bold text-fg">{o.label}</div>
                    <div className="text-[12px] text-fg-muted">{o.sub}</div>
                  </button>
                )
              })}
            </div>

            {form.type === 'group' && (
              <div className="mt-4 space-y-3">
                <Field label="Nom de l’équipe / délégation">
                  <TextInput value={form.teamName} onChange={(e) => set({ teamName: e.target.value })} placeholder="Ex. Comex Acme, Team Sales…" />
                </Field>
                <div className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-bold text-fg">Nombre de dossards</div>
                      <div className="text-[12px] text-fg-muted">Coureur·ses de ton équipe</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Stepper value={form.qty} min={2} onChange={(q) => set({ qty: q })} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {GROUP_TIERS.slice().reverse().map((t) => {
                      const on = tierFor(form.qty)?.min === t.min
                      return (
                        <span key={t.min} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${on ? 'bg-success-light text-success-dark' : 'bg-surface-2 text-fg-muted'}`}>
                          {t.label} · −{Math.round(t.off * 100)}%
                        </span>
                      )
                    })}
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-[12px] text-fg-muted">
                  <Icon name="trophy" className="h-3.5 w-3.5 text-gold-dark" /> Les équipes concourent au challenge inter-entreprises.
                </p>
              </div>
            )}
          </StepBody>
        )

      /* 3 — Coordonnées */
      case 3:
        return (
          <StepBody title={form.type === 'group' ? 'Le·la responsable d’inscription' : 'Tes coordonnées'} sub={form.type === 'group' ? 'Contact principal pour l’équipe.' : 'Pour ton dossard et ta confirmation.'}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom"><TextInput value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="Prénom" /></Field>
                <Field label="Nom"><TextInput value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Nom" /></Field>
              </div>
              <Field label="E-mail professionnel" hint={emailOk ? '✓' : ''}>
                <TextInput type="email" inputMode="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="prenom@entreprise.com" />
              </Field>
              <Field label="Téléphone" hint="optionnel">
                <TextInput type="tel" inputMode="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="06 12 34 56 78" />
              </Field>
              <Field label="Fonction">
                <TextInput value={form.role} onChange={(e) => set({ role: e.target.value })} placeholder="Fondateur·rice, CEO, DG…" />
              </Field>
            </div>
          </StepBody>
        )

      /* 4 — Entreprise */
      case 4:
        return (
          <StepBody title="Ton entreprise" sub="Affichée sur ton dossard et utilisée pour la facturation.">
            <div className="space-y-3">
              <Field label="Raison sociale">
                <TextInput value={form.company} onChange={(e) => set({ company: e.target.value })} placeholder="Nom de la société" />
              </Field>
              <Field label="SIREN / N° TVA" hint="pour la facture">
                <TextInput value={form.siren} onChange={(e) => set({ siren: e.target.value })} placeholder="FR.. ou 9 chiffres" />
              </Field>
              <Field label="Taille de l’entreprise">
                <div className="grid grid-cols-2 gap-2">
                  {['TPE / Indépendant', 'PME', 'ETI', 'Grand groupe'].map((s) => (
                    <button
                      key={s}
                      onClick={() => set({ size: s })}
                      className={`rounded-2xl border px-3 py-2.5 text-[13px] font-semibold tap ${form.size === s ? 'border-transparent bg-brand-500 text-white shadow-brand' : 'border-line bg-surface text-fg-soft shadow-soft'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-light/60 px-3.5 py-3">
              <Icon name="cpu" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <p className="text-[12px] leading-snug text-brand-800">Ton profil entreprise alimente le matching ROI : tu sauras qui rencontrer avant même le coup de feu.</p>
            </div>
          </StepBody>
        )

      /* 5 — Sas */
      case 5:
        return (
          <StepBody title="Choisis ton sas de départ" sub="On t’aligne selon ton allure et ton objectif.">
            <div className="space-y-2.5">
              {SAS.map((s) => {
                const a = ACCENT[s.color]
                const on = form.sas === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => set({ sas: s.id })}
                    className={`flex w-full items-center gap-3 rounded-3xl border p-3.5 text-left tap ${on ? `border-transparent ring-2 ${a.ring} ${a.soft}` : 'border-line bg-surface shadow-soft'}`}
                  >
                    <span className={`h-9 w-1.5 shrink-0 rounded-full ${a.solid}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-bold text-fg">{s.label}</span>
                        <span className={`rounded-full ${a.bg} ${a.text} px-2 py-0.5 text-[11px] font-bold tabular-nums`}>{s.pace}</span>
                        {s.popular && <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Conseillé</span>}
                      </div>
                      <div className="mt-0.5 text-[12px] text-fg-muted">{s.note}</div>
                    </div>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? `${a.solid} border-transparent text-white` : 'border-line-strong text-transparent'}`}>
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )
              })}
            </div>
          </StepBody>
        )

      /* 6 — Paiement B2B */
      case 6:
        return (
          <StepBody title="Récapitulatif & paiement" sub="Paiement sécurisé · facture entreprise disponible.">
            {/* Récap */}
            <div className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
              <Row label={dist.label} value={dist.name} />
              <Row label="Format" value={form.type === 'group' ? `Équipe · ${form.qty} dossards` : 'Solo · 1 dossard'} />
              <Row label="Sas" value={sasById(form.sas)?.label} />
              <Row label={form.type === 'group' ? `Coordinateur·rice` : 'Coureur·se'} value={`${form.firstName} ${form.lastName}`} />
              <Row label="Entreprise" value={form.company} last />
            </div>

            {/* Code promo / voucher */}
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <Field label="Code promo / parrainage" hint="optionnel">
                  <TextInput
                    value={form.voucher}
                    onChange={(e) => set({ voucher: e.target.value, voucherOk: null })}
                    placeholder="Ex. ROI100"
                  />
                </Field>
              </div>
              <button onClick={applyVoucher} className="mb-px shrink-0 rounded-2xl bg-fg px-4 py-3 text-[13px] font-semibold text-white tap">Appliquer</button>
            </div>
            {form.voucherOk === false && <p className="mt-1.5 text-[12px] font-semibold text-like">Code invalide.</p>}
            {form.voucherOk && <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-success-dark"><Icon name="checkCircle" className="h-3.5 w-3.5" /> {form.voucherOk.label}</p>}

            {/* Détail prix */}
            <div className="mt-3 rounded-3xl border border-line bg-surface-soft p-4">
              <PriceRow label={`Dossard${bill.qty > 1 ? `s × ${bill.qty}` : ''}`} value={`${bill.gross} €`} />
              {bill.tierOff > 0 && <PriceRow label={`Remise groupe (−${Math.round(bill.tier.off * 100)}%)`} value={`−${bill.tierOff} €`} good />}
              {bill.voucherOff > 0 && <PriceRow label="Code promo" value={`−${bill.voucherOff} €`} good />}
              <PriceRow label="Total HT" value={`${bill.subHt} €`} />
              <PriceRow label="TVA 20 %" value={`${bill.vat} €`} muted />
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2.5">
                <span className="text-[14px] font-bold text-fg">Total TTC</span>
                <span className="text-[20px] font-extrabold tabular-nums text-fg">{bill.ttc} €</span>
              </div>
            </div>

            {/* Moyens de paiement */}
            <h4 className="mt-5 text-[13px] font-bold text-fg">Moyen de paiement</h4>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              {PAY_METHODS.map((m) => {
                const on = form.pay === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => set({ pay: m.id })}
                    className={`rounded-2xl border p-3 text-left tap ${on ? 'border-transparent bg-brand-light ring-2 ring-brand-300' : 'border-line bg-surface shadow-soft'}`}
                  >
                    <div className="flex items-center justify-between">
                      <PayMark id={m.id} active={on} />
                      <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? 'border-transparent bg-brand-500 text-white' : 'border-line-strong text-transparent'}`}>
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                    </div>
                    <div className="mt-2 text-[13px] font-bold text-fg">{m.label}</div>
                    <div className="text-[11px] text-fg-muted">{m.sub}</div>
                  </button>
                )
              })}
            </div>

            {/* Panneau spécifique au moyen choisi */}
            <div className="mt-3">
              {form.pay === 'voucher' && (
                <div className="space-y-3 rounded-3xl border border-line bg-surface p-4 shadow-soft">
                  <Field label="N° de bon de commande (PO)">
                    <TextInput value={form.poNumber} onChange={(e) => set({ poNumber: e.target.value })} placeholder="PO-2026-..." />
                  </Field>
                  <p className="flex items-start gap-2 text-[12px] leading-snug text-fg-muted">
                    <Icon name="briefcase" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                    Une facture acquittée est émise au nom de {form.company || 'votre société'}, payable à 30 jours. Aucun débit immédiat.
                  </p>
                </div>
              )}
              {form.pay === 'card' && (
                <div className="space-y-3 rounded-3xl border border-line bg-surface p-4 shadow-soft">
                  <Field label="Numéro de carte">
                    <TextInput inputMode="numeric" value={form.cardNumber} onChange={(e) => set({ cardNumber: formatCard(e.target.value) })} placeholder="4242 4242 4242 4242" maxLength={19} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiration"><TextInput inputMode="numeric" value={form.cardExp} onChange={(e) => set({ cardExp: formatExp(e.target.value) })} placeholder="MM/AA" maxLength={5} /></Field>
                    <Field label="CVC"><TextInput inputMode="numeric" value={form.cardCvc} onChange={(e) => set({ cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" /></Field>
                  </div>
                </div>
              )}
              {(form.pay === 'paypal' || form.pay === 'gpay') && (
                <div className="flex items-center gap-2.5 rounded-3xl border border-line bg-surface p-4 text-[12.5px] text-fg-muted shadow-soft">
                  <Icon name="shield" className="h-4 w-4 shrink-0 text-brand-600" />
                  Tu seras redirigé·e vers {form.pay === 'paypal' ? 'PayPal' : 'Google Pay'} pour valider en un clic. Tu peux demander la facture entreprise ensuite.
                </div>
              )}
            </div>

            {/* Consentement */}
            <button onClick={() => set({ consent: !form.consent })} className="mt-4 flex w-full items-start gap-2.5 text-left">
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${form.consent ? 'border-transparent bg-brand-500 text-white' : 'border-line-strong text-transparent'}`}>
                <Icon name="check" className="h-3 w-3" />
              </span>
              <span className="text-[12px] leading-snug text-fg-soft">J’accepte le règlement de la course, les CGV et atteste être apte à courir (certificat médical à fournir avant l’épreuve).</span>
            </button>
          </StepBody>
        )

      /* 7 — Confirmation */
      case 7:
        return (
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-10">
            <div className="flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-success-light text-success">
                <Icon name="checkCircle" className="h-9 w-9" />
              </span>
              <h2 className="mt-4 text-[22px] font-extrabold text-fg">Inscription confirmée</h2>
              <p className="mt-1.5 max-w-[300px] text-[13.5px] leading-relaxed text-fg-soft">
                Rendez-vous le {d.full} à {RACE.gunTime} à {RACE.venue}. Ta confirmation et ta facture partent par e-mail.
              </p>
            </div>

            {/* Billet / dossard */}
            <div className="mt-6 overflow-hidden rounded-3xl surface-hero text-white shadow-float">
              <div className="relative p-5">
                <div className="absolute inset-0 bg-aurora" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">{RACE.name} · {RACE.edition}</div>
                    <Icon name="flag" className="h-5 w-5 text-white/70" />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-white/55">Dossard</div>
                      <div className="text-[26px] font-extrabold leading-none tabular-nums">{raceRegistration?.dossard}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-white/55">Distance</div>
                      <div className="text-[18px] font-extrabold">{dist.label}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-[12px]">
                    <div><div className="text-white/55">Sas</div><div className="font-bold">{sasById(form.sas)?.label.replace('SAS ', '')}</div></div>
                    <div><div className="text-white/55">Format</div><div className="font-bold">{form.type === 'group' ? `Équipe ×${form.qty}` : 'Solo'}</div></div>
                    <div><div className="text-white/55">Réglé</div><div className="font-bold tabular-nums">{bill.ttc} € TTC</div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
                <Icon name="cpu" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <p className="text-[12.5px] leading-snug text-fg-soft"><span className="font-bold text-fg">ROI Pro activé 1 mois.</span> On pré-matche déjà les profils à rencontrer le jour J dans l’app.</p>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
                <Icon name="coffee" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <p className="text-[12.5px] leading-snug text-fg-soft">Petit-déjeuner d’affaires & afterwork inclus. Pense à réserver ta matinée.</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  /* ----------------------------------------------------------------- footer */
  const footer = () => {
    if (step === 0) {
      if (alreadyIn) {
        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-success-light px-4 py-3 text-[13px] font-bold text-success-dark">
              <Icon name="checkCircle" className="h-4 w-4" /> Inscrit·e · dossard {raceRegistration.dossard}
            </div>
          </div>
        )
      }
      return (
        <button onClick={() => setStep(1)} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 py-3.5 text-[15px] font-bold text-white shadow-brand tap">
          S’inscrire — 500 € HT <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      )
    }
    if (step === 7) {
      return (
        <button onClick={onClose} className="w-full rounded-full bg-gradient-to-b from-brand-500 to-brand-600 py-3.5 text-[15px] font-bold text-white shadow-brand tap">
          Terminer
        </button>
      )
    }
    const isPay = step === 6
    return (
      <div className="flex items-center gap-2.5">
        <button onClick={back} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-fg-soft tap" aria-label="Précédent">
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>
        <button
          onClick={isPay ? confirm : next}
          disabled={!canContinue()}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white tap disabled:opacity-40 ${
            isPay ? 'bg-gradient-to-b from-success to-success-dark shadow-brand' : 'bg-gradient-to-b from-brand-500 to-brand-600 shadow-brand'
          }`}
        >
          {isPay
            ? (form.pay === 'voucher' ? `Valider le bon de commande` : `Payer ${bill.ttc} € TTC`)
            : <>Continuer <Icon name="arrowRight" className="h-4 w-4" /></>}
        </button>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 animate-fadeIn bg-black/70" onClick={onClose} />
      <div style={drag.style} className="animate-sheetIn absolute inset-x-0 bottom-0 flex max-h-[96%] flex-col overflow-hidden rounded-t-[28px] bg-surface-soft shadow-float">
        {/* En-tête */}
        <div className="relative z-10 shrink-0 border-b border-line bg-surface px-5 pb-3 pt-2.5">
          <div {...drag.handleProps} className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <div className="flex items-center justify-between">
            {step > 0 && step < 7 ? (
              <button onClick={back} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-soft tap" aria-label="Précédent">
                <Icon name="arrowLeft" className="h-5 w-5" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-700">
                <Icon name="flag" className="h-4 w-4" /> ROI Business Run
              </span>
            )}
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-muted tap" aria-label="Fermer">
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>

          {/* Barre de progression du tunnel */}
          {step > 0 && step < 7 && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-fg-muted">
                <span className="text-fg">{STEPS[step - 1]}</span>
                <span className="tabular-nums">Étape {step}/6</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {step === 0 ? renderIntro() : renderStep()}

        <div className="glass shrink-0 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {footer()}
          {step > 0 && step < 7 && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-fg-faint">
              <Icon name="shield" className="h-3 w-3" /> Données chiffrées · facture entreprise · annulable jusqu’à J-30
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- sous-composants */
function StepBody({ title, sub, children }) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
      <h2 className="text-[19px] font-extrabold leading-tight text-fg">{title}</h2>
      {sub && <p className="mt-0.5 text-[13px] text-fg-muted">{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Stepper({ value, min = 1, max = 99, onChange }) {
  const btn = 'grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg-soft tap disabled:opacity-40'
  return (
    <div className="flex items-center gap-2.5">
      <button className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Retirer">
        <span className="h-0.5 w-3.5 rounded-full bg-current" />
      </button>
      <span className="w-7 text-center text-[18px] font-extrabold tabular-nums text-fg">{value}</span>
      <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Ajouter">
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  )
}

function Row({ label, value, last }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-1.5 ${last ? '' : 'border-b border-line'}`}>
      <span className="text-[12.5px] text-fg-muted">{label}</span>
      <span className="truncate text-[13px] font-semibold text-fg">{value}</span>
    </div>
  )
}

function PriceRow({ label, value, good, muted }) {
  return (
    <div className="flex items-center justify-between py-1 text-[13px]">
      <span className={muted ? 'text-fg-faint' : 'text-fg-soft'}>{label}</span>
      <span className={`tabular-nums font-semibold ${good ? 'text-success-dark' : muted ? 'text-fg-muted' : 'text-fg'}`}>{value}</span>
    </div>
  )
}

/* Marque de paiement — logos texte (aucun asset réseau, sobriété). */
function PayMark({ id, active }) {
  if (id === 'paypal') {
    return <span className="text-[15px] font-extrabold italic"><span className="text-[#003087]">Pay</span><span className="text-[#0070E0]">Pal</span></span>
  }
  if (id === 'gpay') {
    return (
      <span className="flex items-center gap-1 text-[14px] font-bold">
        <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
        <span className="text-fg-soft">Pay</span>
      </span>
    )
  }
  return (
    <span className={`grid h-8 w-8 place-items-center rounded-xl ${active ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
      <Icon name={id === 'card' ? 'creditCard' : 'briefcase'} className="h-4 w-4" />
    </span>
  )
}

function formatCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExp(v) {
  const n = v.replace(/\D/g, '').slice(0, 4)
  return n.length >= 3 ? `${n.slice(0, 2)}/${n.slice(2)}` : n
}
