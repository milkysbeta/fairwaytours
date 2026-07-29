import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { SIGNATURE_ITINERARY } from '@/data/itinerary'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

/**
 * The five days, as a vertical timeline. The rule down the left fills as you
 * scroll — the journey drawing itself.
 */
export function Itinerary() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 })

  return (
    <section id="itinerary" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="The Signature Escape"
          title="Five days, arranged down to the table."
          lede="Two bases rather than one, so the drives happen while you are playing rather than while you are waiting. Everything below moves if you want it to."
        />

        <div ref={ref} className="relative mt-16 pl-8 md:pl-14">
          {/* Track and its scroll-linked fill. */}
          <div className="absolute left-0 top-2 h-full w-px bg-bone-100/10 md:left-1.5" />
          <motion.div
            style={{ scaleY: fill }}
            className="absolute left-0 top-2 h-full w-px origin-top bg-gradient-to-b from-fairway-500 via-fairway-500/60 to-transparent md:left-1.5"
          />

          <ol className="space-y-16 md:space-y-24">
            {SIGNATURE_ITINERARY.map((day, i) => (
              <li key={day.day} className="relative">
                <span className="absolute -left-8 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-fairway-500 ring-4 ring-pine-950 md:-left-[3.125rem]" />

                <Reveal delay={i * 0.04}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-brass-500">
                      Day {day.day}
                    </p>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                      {day.base}
                    </p>
                  </div>

                  <h3 className="mt-3 text-3xl text-bone-50 md:text-4xl">{day.title}</h3>
                  <p className="mt-2 text-sm text-fairway-400/80">{day.anchor}</p>

                  <ul className="mt-7 max-w-xl space-y-3">
                    {day.moments.map((m) => (
                      <li key={m} className="flex gap-3.5 text-sm leading-relaxed text-bone-200">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bone-100/30" />
                        {m}
                      </li>
                    ))}
                  </ul>

                  {day.options && (
                    <div className="mt-7 max-w-xl rounded-xl border border-bone-100/10 bg-pine-900/40 p-5">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-bone-400/70">
                        Or, if you would rather
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {day.options.map((o) => (
                          <li
                            key={o}
                            className="rounded-full border border-bone-100/10 px-3 py-1.5 text-xs text-bone-300"
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
