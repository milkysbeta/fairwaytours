import { Link } from 'react-router-dom'
import { SERVICES } from '@/data/services'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

export function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Three ways to travel"
          title="However you want to arrive, we drive."
          lede="Every booking starts with one question: whose car are we taking? Everything after that — tee times, timing, lunch, the run home — is ours to handle."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.1}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-bone-100/10 bg-pine-900/40 p-8 backdrop-blur-sm transition-all duration-700 hover:border-fairway-500/30 hover:bg-pine-800/40">
                {/* Sheen that follows the card on hover. */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(111,191,115,0.10),transparent)]" />

                <div className="relative flex items-baseline justify-between">
                  <h3 className="text-2xl text-bone-50">{service.label}</h3>
                  <span className="text-xs tracking-widest text-brass-500">
                    {service.priceSignal}
                  </span>
                </div>

                <p className="relative mt-2 text-sm text-fairway-400/80">{service.tagline}</p>
                <p className="relative mt-5 text-sm leading-relaxed text-bone-400">
                  {service.description}
                </p>

                <ul className="relative mt-7 space-y-3 border-t border-bone-100/10 pt-6">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-bone-200">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fairway-500" />
                      {b}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/enquire?mode=${service.id}`}
                  className="relative mt-8 inline-flex items-center gap-2 text-sm text-bone-50 transition-colors duration-300 hover:text-fairway-400"
                >
                  Start here
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
