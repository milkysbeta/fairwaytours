import { EXPERIENCES } from '@/data/experiences'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

export function Experiences() {
  return (
    <section id="experiences" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Between the rounds"
          title="The golf is the anchor, not the itinerary."
          lede="What guests remember is rarely the card. It is the helicopter that landed on a tee no one else can reach, or the table that appeared at the end of a very long day."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-bone-100/10 bg-bone-100/10 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.id} delay={(i % 3) * 0.06} className="bg-pine-950">
              <article className="group h-full bg-pine-900/40 p-8 transition-colors duration-700 hover:bg-pine-800/50">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-brass-500/80">
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
