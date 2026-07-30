import { Link } from 'react-router-dom'
import { JOURNEYS } from '@/data/journeys'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

const nzd = (n: number) => `NZD $${n.toLocaleString('en-NZ')}`

export function Journeys() {
  return (
    <section id="journeys" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="The journeys"
          title="Four ways in. All of them private."
          lede="Most guests start with the Signature Escape and change three things about it. That is the point."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {JOURNEYS.map((journey, i) => (
            <Reveal key={journey.id} delay={i * 0.08}>
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-700 md:p-10 ${
                  journey.featured
                    ? 'border-gold-500/30 bg-pine-900/60'
                    : 'border-bone-100/10 bg-pine-900/40 hover:border-fairway-500/30 hover:bg-pine-800/40'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(111,191,115,0.10),transparent)]" />

                {journey.featured && (
                  <span className="relative mb-5 w-fit rounded-full border border-gold-500/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold-400">
                    Our signature
                  </span>
                )}

                <p className="relative text-xs uppercase tracking-[0.18em] text-bone-400/70">
                  {journey.duration}
                </p>
                <h3 className="relative mt-3 text-3xl text-bone-50">{journey.label}</h3>
                <p className="relative mt-2 text-sm text-fairway-400/80">{journey.tagline}</p>

                <p className="relative mt-6 text-sm leading-relaxed text-bone-400">
                  {journey.description}
                </p>

                <ul className="relative mt-8 space-y-3 border-t border-bone-100/10 pt-7">
                  {journey.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-bone-200">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fairway-500" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto flex items-end justify-between gap-6 pt-9">
                  <div>
                    {journey.fromPerGuestNzd ? (
                      <>
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/70">
                          From
                        </p>
                        <p className="mt-1 text-xl text-bone-50">
                          {nzd(journey.fromPerGuestNzd)}
                          <span className="ml-1.5 text-xs text-bone-400">per guest</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-bone-400">Priced on brief</p>
                    )}
                  </div>

                  <Link
                    to={`/enquire?journey=${journey.id}`}
                    className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-bone-50 transition-colors duration-300 hover:text-fairway-400"
                  >
                    Begin
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-bone-400">
            Per guest, twin share. Accommodation, green fees, transport and hosting included; flights
            are not.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
