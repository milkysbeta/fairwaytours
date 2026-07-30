import { useState } from 'react'
import { SITE } from '@/data/site'
import { EMPTY_TRADE, submitTradeEnquiry, type TradeEnquiry } from '@/lib/enquiry'

const FIELD =
  'w-full rounded-xl border border-bone-100/15 bg-pine-900/40 px-4 py-3 text-bone-50 outline-none transition-colors placeholder:text-bone-400/50 focus:border-fairway-500'

/** TODO(client): confirm before this goes live. */
const TERMS = [
  ['Commission', 'Standard trade commission on the full journey value'],
  ['Rates', 'Net rates available on request for contracted partners'],
  ['Familiarisation', 'Hosted inspection trips by arrangement each shoulder season'],
  ['Collateral', 'Itinerary documents and imagery supplied under your own cover'],
]

const AUDIENCE = [
  'Luxury travel agencies and consortia',
  'Golf travel specialists',
  'Corporate incentive and event planners',
  'Destination management companies',
]

export function Trade() {
  const [t, setT] = useState<TradeEnquiry>(EMPTY_TRADE)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = <K extends keyof TradeEnquiry>(key: K, value: TradeEnquiry[K]) =>
    setT((prev) => ({ ...prev, [key]: value }))

  const ready = t.agency.trim() !== '' && t.email.trim() !== ''

  const send = async () => {
    setStatus('sending')
    try {
      await submitTradeEnquiry(t)
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
          Thank you — we will send terms through shortly.
        </h1>
        <p className="mt-6 max-w-md text-bone-400">
          {SITE.founder.name} handles trade relationships personally. Expect a reply within one
          working day.
        </p>
      </main>
    )
  }

  return (
    <main className="container-page min-h-[100svh] pt-32 pb-24">
      <p className="eyebrow">Trade &amp; advisors</p>
      <h1 className="mt-4 max-w-2xl text-4xl leading-[1.08] text-bone-50 md:text-5xl">
        For advisors placing clients in the South Island.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-400">
        We work with a small number of advisors rather than a wide network, so your clients get the
        tee times and the rooms that matter.
      </p>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-2xl text-bone-50">Who we work with</h2>
          <ul className="mt-6 space-y-3">
            {AUDIENCE.map((a) => (
              <li key={a} className="flex gap-3 text-sm text-bone-200">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fairway-500" />
                {a}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 text-2xl text-bone-50">Terms</h2>
          <dl className="mt-6 divide-y divide-bone-100/10 border-t border-bone-100/10">
            {TERMS.map(([term, detail]) => (
              <div key={term} className="py-4">
                <dt className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-500/80">
                  {term}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-bone-300">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-bone-100/10 bg-pine-900/40 p-7 md:p-9">
          <h2 className="text-2xl text-bone-50">Request terms</h2>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="agency" className="text-sm text-bone-400">
                Agency
              </label>
              <input
                id="agency"
                value={t.agency}
                onChange={(e) => set('agency', e.target.value)}
                className={`${FIELD} mt-2`}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact" className="text-sm text-bone-400">
                  Your name
                </label>
                <input
                  id="contact"
                  value={t.contact}
                  onChange={(e) => set('contact', e.target.value)}
                  className={`${FIELD} mt-2`}
                />
              </div>
              <div>
                <label htmlFor="trade-email" className="text-sm text-bone-400">
                  Email
                </label>
                <input
                  id="trade-email"
                  type="email"
                  value={t.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={`${FIELD} mt-2`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="market" className="text-sm text-bone-400">
                Primary market
              </label>
              <select
                id="market"
                value={t.market}
                onChange={(e) => set('market', e.target.value)}
                className={`${FIELD} mt-2`}
              >
                <option value="">Select</option>
                {SITE.markets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="profile" className="text-sm text-bone-400">
                Typical client
              </label>
              <input
                id="profile"
                placeholder="Couples, corporate groups, bucket-list travellers"
                value={t.clientProfile}
                onChange={(e) => set('clientProfile', e.target.value)}
                className={`${FIELD} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="trade-notes" className="text-sm text-bone-400">
                Anything else
              </label>
              <textarea
                id="trade-notes"
                rows={3}
                value={t.notes}
                onChange={(e) => set('notes', e.target.value)}
                className={`${FIELD} mt-2 resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 text-sm text-gold-400">
                That did not send. Email {SITE.email} and we will pick it up straight away.
              </p>
            )}

            <button
              type="button"
              onClick={send}
              disabled={!ready || status === 'sending'}
              className="rounded-full bg-fairway-500 px-7 py-3.5 text-sm font-medium text-pine-950 transition-all duration-300 hover:scale-[1.03] disabled:scale-100 disabled:opacity-30"
            >
              {status === 'sending' ? 'Sending…' : 'Request terms'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
