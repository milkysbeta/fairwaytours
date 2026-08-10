import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EXPERIENCES, type Experience } from '@/data/experiences'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Drifts against the scroll, so the photograph feels set back from the card.
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%'])

  return (
    <Reveal delay={(index % 3) * 0.06} className="bg-pine-950">
      <article
        ref={ref}
        className="group relative h-full overflow-hidden bg-pine-900/40 p-8 transition-colors duration-700 hover:bg-pine-800/50"
      >
        {/* Imagery on a handful of cards only — every card carrying a photograph
            turns the grid into a stock-photo wall. */}
        {exp.image && (
          <>
            <motion.img
              src={asset(exp.image)}
              alt=""
              loading="lazy"
              style={{ y: imageY }}
              className="absolute inset-0 h-[122%] w-full object-cover opacity-25 transition-opacity duration-1000 group-hover:opacity-40"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/70 to-pine-950/30" />
          </>
        )}

        <p className="relative text-[0.6rem] uppercase tracking-[0.2em] text-gold-500/80">
          {exp.category}
        </p>
        <h3 className="relative mt-3 text-xl text-bone-50">{exp.label}</h3>
        <p className="relative mt-3 text-sm leading-relaxed text-bone-400">{exp.blurb}</p>
      </article>
    </Reveal>
  )
}

export function Experiences() {
  return (
    <section id="experiences" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Between the rounds"
          title="The golf is the anchor, not the itinerary."
          lede="What guests remember is rarely the card."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-bone-100/10 bg-bone-100/10 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
