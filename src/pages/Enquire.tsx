import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { JOURNEYS, journeyById, type JourneyType } from '@/data/journeys'
import { COURSES } from '@/data/courses'
import { EXPERIENCES } from '@/data/experiences'
import { SITE } from '@/data/site'
import { ConditionsCalendar } from '@/components/ConditionsCalendar'
import {
  BUDGET_BANDS,
  EMPTY_ENQUIRY,
  formatArrival,
  indicativeFrom,
  partySize,
  submitEnquiry,
  type BudgetBand,
  type Enquiry,
} from '@/lib/enquiry'

const STEPS = ['Journey', 'Party', 'Interests', 'Contact'] as const

const nzd = (n: number) => `NZD $${n.toLocaleString('en-NZ')}`

/** Shared field styling — one place so every input matches. */
const FIELD =
  'w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors placeholder:text-bone-400/50 focus:border-fairway-500'

export function Enquire() {
  const [params] = useSearchParams()

  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [enquiry, setEnquiry] = useState<Enquiry>(() => {
    const requested = params.get('journey') as JourneyType | null
    const journey = JOURNEYS.some((j) => j.id === requested) ? requested : null
    // Deep-linked from the conditions calendar on the homepage.
    const date = params.get('date')
    const arrivalDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
    return { ...EMPTY_ENQUIRY, journey, arrivalDate }
  })

  const set = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) =>
    setEnquiry((prev) => ({ ...prev, [key]: value }))

  const toggle = (key: 'courseIds' | 'experienceIds', value: string) =>
    setEnquiry((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))

  const from = indicativeFrom(enquiry)

  const canAdvance = [
    enquiry.journey !== null && enquiry.arrivalDate !== null,
    enquiry.golfers > 0,
    true, // interests are optional — never block a lead on a nice-to-have
    enquiry.name.trim() !== '' && enquiry.email.trim() !== '',
  ][step]

  const send = async () => {
    setStatus('sending')
    try {
      await submitEnquiry(enquiry)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <main className="container-page flex min-h-[100svh] flex-col items-center justify-center text-center">
        <p className="eyebrow">Received</p>
        <h1 className="mt-5 max-w-xl text-4xl leading-tight text-bone-50 md:text-5xl">
          Thank you — we will be in touch personally.
        </h1>
        <p className="mt-6 max-w-md text-bone-400">
          You will have a considered reply within one working day, written by {SITE.founder.name}{' '}
          rather than an autoresponder. If it is urgent, call {SITE.phone}.
        </p>
      </main>
    )
  }

  return (
    <main className="container-page min-h-[100svh] pt-32 pb-24">
      <p className="eyebrow">Begin your journey</p>
      <h1 className="mt-4 max-w-2xl text-4xl leading-[1.08] text-bone-50 md:text-5xl">
        Tell us the shape of it. We will build the rest.
      </h1>

      {/* Step rail */}
      <ol className="mt-12 flex gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <div
              className={`h-px w-full transition-colors duration-500 ${
                i <= step ? 'bg-fairway-500' : 'bg-bone-100/15'
              }`}
            />
            <p
              className={`mt-3 text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-500 ${
                i <= step ? 'text-fairway-400' : 'text-bone-400/50'
              }`}
            >
              {label}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <div className="space-y-10">
                <fieldset>
                  <legend className="text-xl text-bone-50">What kind of journey?</legend>
                  <div className="mt-7 grid gap-3">
                    {JOURNEYS.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => set('journey', j.id)}
                        className={`rounded-xl border p-6 text-left transition-all duration-400 ${
                          enquiry.journey === j.id
                            ? 'border-fairway-500 bg-fairway-500/[0.07]'
                            : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/25'
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-lg text-bone-50">{j.label}</span>
                          <span className="text-xs uppercase tracking-[0.14em] text-bone-400/70">
                            {j.duration}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-bone-400">{j.tagline}</p>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xl text-bone-50">Arriving when?</legend>
                  <p className="mt-2 text-sm text-bone-400">
                    Conditions shown for every date. Approximate is fine.
                  </p>
                  <div className="mt-7">
                    <ConditionsCalendar
                      compact
                      selected={enquiry.arrivalDate}
                      onSelect={(iso) => set('arrivalDate', iso)}
                    />
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="nights" className="text-xl text-bone-50">
                    How many nights?
                  </label>
                  <input
                    id="nights"
                    type="number"
                    min={1}
                    max={21}
                    placeholder="4"
                    value={enquiry.nights ?? ''}
                    onChange={(e) => set('nights', e.target.value ? Number(e.target.value) : null)}
                    className={`${FIELD} mt-5 w-32`}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-10">
                <fieldset>
                  <legend className="text-xl text-bone-50">Who is travelling?</legend>
                  <p className="mt-2 text-sm text-bone-400">
                    Non-golfers are not an afterthought — we build them a parallel itinerary.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-6">
                    <div>
                      <label htmlFor="golfers" className="text-sm text-bone-400">
                        Golfers
                      </label>
                      <input
                        id="golfers"
                        type="number"
                        min={1}
                        max={40}
                        value={enquiry.golfers}
                        onChange={(e) => set('golfers', Number(e.target.value))}
                        className={`${FIELD} mt-2 w-28`}
                      />
                    </div>
                    <div>
                      <label htmlFor="nonGolfers" className="text-sm text-bone-400">
                        Not playing
                      </label>
                      <input
                        id="nonGolfers"
                        type="number"
                        min={0}
                        max={40}
                        value={enquiry.nonGolfers}
                        onChange={(e) => set('nonGolfers', Number(e.target.value))}
                        className={`${FIELD} mt-2 w-28`}
                      />
                    </div>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="origin" className="text-xl text-bone-50">
                    Flying from?
                  </label>
                  <p className="mt-2 text-sm text-bone-400">
                    So we call at a civilised hour in your timezone, and plan around your arrival.
                  </p>
                  <select
                    id="origin"
                    value={enquiry.origin}
                    onChange={(e) => set('origin', e.target.value)}
                    className={`${FIELD} mt-5 max-w-xs`}
                  >
                    <option value="">Select</option>
                    {SITE.markets.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset>
                  <legend className="text-xl text-bone-50">Budget per guest</legend>
                  <p className="mt-2 text-sm text-bone-400">
                    Optional, and it steers the proposal rather than filtering you out.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {BUDGET_BANDS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() =>
                          set('budgetBand', enquiry.budgetBand === b.id ? null : (b.id as BudgetBand))
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          enquiry.budgetBand === b.id
                            ? 'border-fairway-500 bg-fairway-500/10 text-fairway-400'
                            : 'border-bone-100/15 text-bone-200 hover:border-bone-100/35'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <fieldset>
                  <legend className="text-xl text-bone-50">Courses you have in mind</legend>
                  <p className="mt-2 text-sm text-bone-400">
                    Leave it blank if you would rather we chose. Access at the private clubs is
                    arranged case by case.
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {COURSES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle('courseIds', c.id)}
                        className={`rounded-xl border p-5 text-left transition-all duration-400 ${
                          enquiry.courseIds.includes(c.id)
                            ? 'border-fairway-500 bg-fairway-500/[0.07]'
                            : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/25'
                        }`}
                      >
                        <span className="text-bone-50">{c.name}</span>
                        <p className="mt-1 text-xs capitalize text-bone-400">
                          {c.region} · {c.tier}
                        </p>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xl text-bone-50">Beyond the golf</legend>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {EXPERIENCES.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        onClick={() => toggle('experienceIds', x.id)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          enquiry.experienceIds.includes(x.id)
                            ? 'border-fairway-500 bg-fairway-500/10 text-fairway-400'
                            : 'border-bone-100/15 text-bone-200 hover:border-bone-100/35'
                        }`}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-7">
                <div>
                  <label htmlFor="name" className="text-sm text-bone-400">
                    Name
                  </label>
                  <input
                    id="name"
                    value={enquiry.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={`${FIELD} mt-2`}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="text-sm text-bone-400">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={enquiry.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={`${FIELD} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm text-bone-400">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={enquiry.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className={`${FIELD} mt-2`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="text-sm text-bone-400">
                    Anything that would help us plan?
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Handicaps, an anniversary, a course you have always wanted to play, someone who would rather not be on a golf course at all."
                    value={enquiry.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    className={`${FIELD} mt-2 resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 text-sm text-gold-400">
                    That did not send. Email {SITE.email} and we will pick it up straight away.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Running summary */}
        <aside className="h-fit rounded-2xl border border-bone-100/10 bg-pine-900/40 p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Your journey</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-bone-400/60">Journey</dt>
              <dd className="mt-0.5 text-bone-100">
                {enquiry.journey ? journeyById(enquiry.journey).label : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-bone-400/60">When</dt>
              <dd className="mt-0.5 text-bone-100">
                {formatArrival(enquiry.arrivalDate)}
                {enquiry.nights ? ` · ${enquiry.nights} nights` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-bone-400/60">Party</dt>
              <dd className="mt-0.5 text-bone-100">
                {partySize(enquiry)} guest{partySize(enquiry) === 1 ? '' : 's'}
                {enquiry.nonGolfers > 0 ? ` · ${enquiry.nonGolfers} not playing` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-bone-400/60">Courses</dt>
              <dd className="mt-0.5 text-bone-100">
                {enquiry.courseIds.length
                  ? enquiry.courseIds
                      .map((id) => COURSES.find((c) => c.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')
                  : 'Our recommendation'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-bone-100/10 pt-5">
            <p className="text-sm text-bone-400/60">Indicative from</p>
            <p className="mt-1 font-display text-2xl text-bone-50">
              {from ? nzd(from) : 'On brief'}
              {from && <span className="ml-1.5 text-xs text-bone-400">per guest</span>}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-bone-400/70">
              Twin share, excluding flights. Every itinerary is costed by hand against live rates
              before anything is confirmed.
            </p>
          </div>
        </aside>
      </div>

      {/* Controls */}
      <div className="mt-14 flex items-center justify-between border-t border-bone-100/10 pt-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-bone-400 transition-colors hover:text-bone-100 disabled:opacity-30"
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="rounded-full bg-bone-50 px-7 py-3.5 text-sm font-medium text-pine-950 transition-all duration-300 hover:scale-[1.03] disabled:scale-100 disabled:opacity-30"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={!canAdvance || status === 'sending'}
            className="rounded-full bg-fairway-500 px-7 py-3.5 text-sm font-medium text-pine-950 transition-all duration-300 hover:scale-[1.03] disabled:scale-100 disabled:opacity-30"
          >
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
          </button>
        )}
      </div>
    </main>
  )
}
