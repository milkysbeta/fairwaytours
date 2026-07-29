import { STAYS } from '@/data/stays'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

export function Stays() {
  return (
    <section id="stays" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Where you stay"
          title="Lodges and villas, not hotel blocks."
          lede="We place guests in a small number of properties we know personally, and we hold rooms in them well ahead of the season."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STAYS.map((stay, i) => (
            <Reveal key={stay.id} delay={i * 0.07}>
              <article className="flex h-full flex-col rounded-2xl border border-bone-100/10 bg-pine-900/40 p-7 transition-colors duration-700 hover:border-bone-100/20">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-bone-400/70">
                    {stay.region}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-brass-500/70">
                    {stay.kind}
                  </p>
                </div>

                {/*
                  Unconfirmed partners render by category only. See the note in
                  data/stays.ts — naming a lodge we have no agreement with is a
                  legal and relationship risk, not a marketing win.
                */}
                <h3 className="mt-4 text-lg text-bone-50">
                  {stay.confirmed ? stay.name : `${stay.kind} partner`}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-bone-400">
                  {stay.confirmed ? stay.blurb : 'Named once the partnership is confirmed.'}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
