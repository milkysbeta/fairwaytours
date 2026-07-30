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
              <article className="group relative h-full overflow-hidden bg-pine-900/40 p-8 transition-colors duration-700 hover:bg-pine-800/50">
                {/* Imagery on a handful of cards only — every card carrying a
                    photograph turns the grid into a stock-photo wall. */}
                {exp.image && (
                  <>
                    <img
                      src={exp.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full scale-105 object-cover opacity-25 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40"
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
          ))}
        </div>
      </div>
    </section>
  )
}
