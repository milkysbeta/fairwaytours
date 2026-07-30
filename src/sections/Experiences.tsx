import { EXPERIENCES } from '@/data/experiences'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

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
            <Reveal key={exp.id} delay={(i % 3) * 0.06} className="bg-pine-950">
              <article className="group h-full bg-pine-900/40 p-8 transition-colors duration-700 hover:bg-pine-800/50">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-500/80">
                  {exp.category}
                </p>
                <h3 className="mt-3 text-xl text-bone-50">{exp.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-400">{exp.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
