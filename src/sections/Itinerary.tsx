import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { SIGNATURE_ITINERARY } from '@/data/itinerary'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

/**
 * The five days, as a vertical timeline. The rule down the left fills as you
 * scroll — the journey drawing itself.
 *
 * This is the site's one cream spread. The moodboard's editorial pins (the
 * Masters layout, Regal Crest, the Fore Golf Club poster) all alternate cream
 * against green rather than running dark throughout, and the itinerary is the
 * right place to break: it is the longest read on the page, and cream carries
 * long-form text far better than a dark ground does.
 */
export function Itinerary() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 })

  return (
    <section id="itinerary" className="relative bg-bone-100 py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          tone="light"
          eyebrow="The Signature Escape"
          title="Five days, arranged down to the table."
          lede="Two bases rather than one, so the drives happen while you are playing rather than while you are waiting. Everything below moves if you want it to."
        />

        <div ref={ref} className="relative mt-16 pl-8 md:pl-14">
          {/* Track and its scroll-linked fill. */}
          <div className="absolute left-0 top-2 h-full w-px bg-pine-950/12 md:left-1.5" />
          <motion.div
            style={{ scaleY: fill }}
            className="absolute left-0 top-2 h-full w-px origin-top bg-gradient-to-b from-turf-600 via-turf-600/50 to-transparent md:left-1.5"
          />

          <ol className="space-y-16 md:space-y-24">
            {SIGNATURE_ITINERARY.map((day, i) => (
              <li key={day.day} className="relative">
                <span className="absolute -left-8 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-turf-600 ring-4 ring-bone-100 md:-left-[3.125rem]" />

                <Reveal delay={i * 0.04}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-copper-500">
                      Day {day.day}
                    </p>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-pine-950/40">
                      {day.base}
                    </p>
                  </div>

                  <h3 className="mt-3 text-3xl text-pine-950 md:text-4xl">{day.title}</h3>
                  <p className="mt-2 text-sm text-turf-600">{day.anchor}</p>

                  <ul className="mt-7 max-w-xl space-y-3">
                    {day.moments.map((m) => (
                      <li key={m} className="flex gap-3.5 text-sm leading-relaxed text-pine-950/75">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine-950/25" />
                        {m}
                      </li>
                    ))}
                  </ul>

                  {day.options && (
                    <div className="mt-7 max-w-xl rounded-xl border border-pine-950/10 bg-bone-200/40 p-5">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-pine-950/40">
                        Or, if you would rather
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {day.options.map((o) => (
                          <li
                            key={o}
                            className="rounded-full border border-pine-950/12 bg-bone-50 px-3 py-1.5 text-xs text-pine-950/70"
                          >
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
