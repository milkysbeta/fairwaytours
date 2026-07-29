import { SEASONS } from '@/data/seasons'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

const DEMAND_STYLE: Record<string, string> = {
  Peak: 'border-gold-500/40 text-gold-400',
  High: 'border-fairway-500/40 text-fairway-400',
  Shoulder: 'border-bone-100/20 text-bone-300',
  Quiet: 'border-bone-100/15 text-bone-400',
}

/**
 * Replaces the old live ten-day forecast on the homepage. A guest booking from
 * Singapore in March for a December trip cannot use a forecast — they need to
 * know which month to choose. See the note in data/seasons.ts.
 */
export function Seasons() {
  return (
    <section id="seasons" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="When to come"
          title="There is no bad season. There are different ones."
          lede="Most guests book six to nine months out, so the useful question is not what the weather is doing this week — it is which month suits the trip you want."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((season, i) => (
            <Reveal key={season.id} delay={i * 0.07}>
              <article className="flex h-full flex-col rounded-2xl border border-bone-100/10 bg-pine-900/40 p-7 transition-colors duration-700 hover:border-fairway-500/25">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl text-bone-50">{season.label}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.16em] ${
                      DEMAND_STYLE[season.demand]
                    }`}
                  >
                    {season.demand}
                  </span>
                </div>

                <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-bone-400/70">
                  {season.months}
                </p>

                <p className="mt-6 text-sm text-fairway-400/80">{season.headline}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone-400">{season.blurb}</p>

                <p className="mt-auto pt-7 text-xs text-bone-400">
                  Typically {season.tempC[0]}–{season.tempC[1]}°C
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-bone-400">
            Central Otago weather moves quickly whatever the month. We build slack into every
            schedule and move rounds rather than play through something miserable — that flexibility
            is the service, and it costs you nothing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
