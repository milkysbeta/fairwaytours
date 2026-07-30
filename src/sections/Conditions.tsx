import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { ConditionsCalendar } from '@/components/ConditionsCalendar'

/**
 * Replaces the four season cards. Same information, one interaction, and it
 * answers the actual question — "what will it be like when I come?" — for any
 * date rather than only for the next fortnight.
 */
export function Conditions() {
  const [selected, setSelected] = useState<string | null>(null)

  const pretty = selected
    ? new Date(`${selected}T00:00:00`).toLocaleDateString('en-NZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <section id="conditions" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="When to come"
          title="Pick a date. We will tell you the truth about it."
          lede="Forecast for the next sixteen days, ten years of recorded conditions for everything after that."
        />

        <Reveal className="mt-14">
          <ConditionsCalendar selected={selected} onSelect={setSelected} />
        </Reveal>

        {selected && (
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center gap-5 border-t border-bone-100/10 pt-8">
              <p className="text-sm text-bone-200">{pretty}</p>
              <Link
                to={`/enquire?date=${selected}`}
                className="rounded-full bg-bone-50 px-6 py-3 text-sm font-medium text-pine-950 transition-transform duration-300 hover:scale-[1.03]"
              >
                Plan a journey from here
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
