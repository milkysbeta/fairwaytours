import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SERVICES, type ServiceMode } from '@/data/services'
import { COURSES } from '@/data/courses'
import { PACKAGES } from '@/data/packages'
import { SITE } from '@/data/site'
import { useForecast } from '@/hooks/useForecast'
import { VERDICT_COPY } from '@/lib/weather'
import { EMPTY_ENQUIRY, EXTRAS, estimate, submitEnquiry, type Enquiry } from '@/lib/enquiry'

const STEPS = ['Travel', 'Golf', 'Details', 'Contact'] as const

export function Enquire() {
  const [params] = useSearchParams()
  const { days } = useForecast(14)

  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [enquiry, setEnquiry] = useState<Enquiry>(() => ({
    ...EMPTY_ENQUIRY,
    mode: (params.get('mode') as ServiceMode | null) ?? null,
    packageId: params.get('package'),
    courseIds:
      PACKAGES.find((p) => p.id === params.get('package'))?.courseIds ?? EMPTY_ENQUIRY.courseIds,
  }))

  const set = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) =>
    setEnquiry((prev) => ({ ...prev, [key]: value }))

  const toggle = (key: 'courseIds' | 'extras', value: string) =>
    setEnquiry((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))

  const price = useMemo(() => estimate(enquiry), [enquiry])

  const canAdvance = [
    enquiry.mode !== null,
    enquiry.courseIds.length > 0,
    enquiry.groupSize > 0,
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
          Thank you — Jacob will be in touch.
        </h1>
        <p className="mt-6 max-w-md text-bone-400">
          You will hear back within a day, usually much sooner. If it is urgent, call {SITE.phone}.
        </p>
      </main>
    )
  }

  return (
    <main className="container-page min-h-[100svh] pt-32 pb-24">
      <p className="eyebrow">Plan your round</p>
      <h1 className="mt-4 max-w-2xl text-4xl leading-[1.08] text-bone-50 md:text-5xl">
        Four questions and we will take it from there.
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
              <fieldset>
                <legend className="text-xl text-bone-50">Whose car are we taking?</legend>
                <div className="mt-7 grid gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => set('mode', s.id)}
                      className={`rounded-xl border p-6 text-left transition-all duration-400 ${
                        enquiry.mode === s.id
                          ? 'border-fairway-500 bg-fairway-500/[0.07]'
                          : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/25'
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg text-bone-50">{s.label}</span>
                        <span className="text-xs tracking-widest text-brass-500">
                          {s.priceSignal}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-bone-400">{s.tagline}</p>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div className="space-y-10">
                <fieldset>
                  <legend className="text-xl text-bone-50">Where would you like to play?</legend>
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
                        <p className="mt-1 text-xs text-bone-400">
                          {c.region} · {c.driveMinutesFromWanaka} min from Wanaka
                        </p>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xl text-bone-50">Which day?</legend>
                  <p className="mt-2 text-sm text-bone-400">
                    Scored for golf. Pick whichever suits — we will tell you honestly if another day
                    is better.
                  </p>
                  <div className="-mx-6 mt-6 flex gap-3 overflow-x-auto px-6 pb-3">
                    {days.slice(0, 14).map((d) => {
                      const date = new Date(`${d.date}T00:00:00`)
                      const selected = enquiry.date === d.date
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => set('date', d.date)}
                          title={VERDICT_COPY[d.verdict]}
                          className={`min-w-[6rem] rounded-xl border p-4 text-left transition-all duration-400 ${
                            selected
                              ? 'border-fairway-500 bg-fairway-500/[0.07]'
                              : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/25'
                          }`}
                        >
                          <p className="text-[0.62rem] uppercase tracking-[0.16em] text-bone-400/70">
                            {date.toLocaleDateString('en-NZ', { weekday: 'short' })}
                          </p>
                          <p className="mt-0.5 text-sm text-bone-200">
                            {date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="mt-3 text-lg text-bone-50">{d.tempMaxC}°</p>
                          <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-bone-100/10">
                            <div
                              className={`h-full rounded-full ${
                                d.score >= 82
                                  ? 'bg-fairway-400'
                                  : d.score >= 64
                                    ? 'bg-fairway-500/70'
                                    : d.score >= 42
                                      ? 'bg-brass-500/70'
                                      : 'bg-bone-400/30'
                              }`}
                              style={{ width: `${d.score}%` }}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-xs text-bone-400/70">
                    Travelling further out? Tell us the dates in the notes and we will work to them.
                  </p>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div>
                  <label htmlFor="groupSize" className="text-xl text-bone-50">
                    How many playing?
                  </label>
                  <input
                    id="groupSize"
                    type="number"
                    min={1}
                    max={40}
                    value={enquiry.groupSize}
                    onChange={(e) => set('groupSize', Number(e.target.value))}
                    className="mt-5 w-32 rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors focus:border-fairway-500"
                  />
                </div>

                <div>
                  <label htmlFor="pickup" className="text-xl text-bone-50">
                    Where are we collecting you?
                  </label>
                  <input
                    id="pickup"
                    type="text"
                    placeholder="Hotel, address, or Queenstown Airport"
                    value={enquiry.pickupLocation}
                    onChange={(e) => set('pickupLocation', e.target.value)}
                    className="mt-5 w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors placeholder:text-bone-400/50 focus:border-fairway-500"
                  />
                </div>

                <fieldset>
                  <legend className="text-xl text-bone-50">Anything else to arrange?</legend>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {EXTRAS.map((x) => (
                      <button
                        key={x}
                        type="button"
                        onClick={() => toggle('extras', x)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          enquiry.extras.includes(x)
                            ? 'border-fairway-500 bg-fairway-500/10 text-fairway-400'
                            : 'border-bone-100/15 text-bone-200 hover:border-bone-100/35'
                        }`}
                      >
                        {x}
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
                    className="mt-2 w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors focus:border-fairway-500"
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
                      className="mt-2 w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors focus:border-fairway-500"
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
                      className="mt-2 w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors focus:border-fairway-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="text-sm text-bone-400">
                    Anything we should know?
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={enquiry.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors focus:border-fairway-500"
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-xl border border-brass-500/30 bg-brass-500/5 p-4 text-sm text-brass-400">
                    That did not send. Email {SITE.email} and we will pick it up straight away.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Running summary */}
        <aside className="h-fit rounded-2xl border border-bone-100/10 bg-pine-900/40 p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Your day</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-bone-400/60">Travel</dt>
              <dd className="mt-0.5 text-bone-100">
                {SERVICES.find((s) => s.id === enquiry.mode)?.label ?? '—'}
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
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-bone-400/60">Date</dt>
              <dd className="mt-0.5 text-bone-100">
                {enquiry.date
                  ? new Date(`${enquiry.date}T00:00:00`).toLocaleDateString('en-NZ', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-bone-400/60">Group</dt>
              <dd className="mt-0.5 text-bone-100">{enquiry.groupSize}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-bone-100/10 pt-5">
            <p className="text-bone-400/60 text-sm">Indicative</p>
            <p className="mt-1 font-display text-2xl text-bone-50">
              {price ? `NZ$${price.low}–${price.high}` : 'On enquiry'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-bone-400/70">
              Green fees are not included. Jacob confirms the exact figure before anything is
              booked.
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
