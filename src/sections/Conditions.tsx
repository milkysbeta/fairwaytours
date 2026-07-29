import { useForecast } from '@/hooks/useForecast'
import { describeCode, VERDICT_COPY, type DayForecast, type GolfVerdict } from '@/lib/weather'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

/** Colour carries the verdict. Kept to the house palette — no traffic lights. */
const VERDICT_STYLE: Record<GolfVerdict, { bar: string; text: string }> = {
  exceptional: { bar: 'bg-fairway-400', text: 'text-fairway-400' },
  good: { bar: 'bg-fairway-500/70', text: 'text-fairway-500' },
  playable: { bar: 'bg-brass-500/70', text: 'text-brass-400' },
  marginal: { bar: 'bg-bone-400/30', text: 'text-bone-400' },
}

function DayCard({ day, isBest }: { day: DayForecast; isBest: boolean }) {
  const style = VERDICT_STYLE[day.verdict]
  const date = new Date(`${day.date}T00:00:00`)

  return (
    <div
      className={`relative flex min-w-[8.5rem] flex-col rounded-xl border p-4 transition-all duration-500 ${
        isBest
          ? 'border-fairway-500/40 bg-fairway-500/[0.07]'
          : 'border-bone-100/10 bg-pine-900/40 hover:border-bone-100/20'
      }`}
    >
      {isBest && (
        <span className="absolute -top-2 left-4 rounded-full bg-fairway-500 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-pine-950">
          Pick
        </span>
      )}

      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/70">
        {date.toLocaleDateString('en-NZ', { weekday: 'short' })}
      </p>
      <p className="mt-0.5 text-sm text-bone-200">
        {date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}
      </p>

      <p className="mt-4 text-2xl text-bone-50">{day.tempMaxC}°</p>
      <p className="text-xs text-bone-400">{describeCode(day.code)}</p>

      <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-bone-100/10">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${day.score}%` }} />
      </div>

      {/* Fixed height keeps the row of cards aligned regardless of copy length. */}
      <p className={`mt-3 h-8 text-[0.7rem] leading-snug ${style.text}`}>
        {VERDICT_COPY[day.verdict]}
      </p>

      <dl className="mt-4 space-y-1 border-t border-bone-100/10 pt-3 text-[0.68rem] text-bone-400">
        <div className="flex justify-between">
          <dt>Wind</dt>
          <dd className="text-bone-200">{day.windMaxKmh} km/h</dd>
        </div>
        <div className="flex justify-between">
          <dt>Rain</dt>
          <dd className="text-bone-200">{day.precipChance}%</dd>
        </div>
      </dl>
    </div>
  )
}

export function Conditions() {
  const { days, loading, error } = useForecast(14)

  const week = days.slice(0, 10)
  const bestScore = week.length ? Math.max(...week.map((d) => d.score)) : 0
  // Only flag a standout day — if everything is equal there is no "pick" to make.
  const bestDate = week.find((d) => d.score === bestScore && d.score >= 70)?.date

  return (
    <section id="conditions" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Conditions"
          title="We watch the weather so you can pick your day."
          lede="Central Otago changes fast. Here is the next ten days over Wanaka, scored for golf — wind first, then rain, then temperature. It is a recommendation, not a rule."
        />

        <Reveal className="mt-14">
          {loading && (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 min-w-[8.5rem] animate-pulse rounded-xl border border-bone-100/10 bg-pine-900/40"
                />
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-bone-100/10 bg-pine-900/40 p-6 text-sm text-bone-400">
              The forecast is unavailable right now — get in touch and we will talk you through
              conditions directly.
            </p>
          )}

          {!loading && !error && (
            <div className="-mx-6 flex items-stretch gap-4 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10">
              {week.map((day) => (
                <DayCard key={day.date} day={day} isBest={day.date === bestDate} />
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-bone-400">
            Booked a day that turns? We move it. Where the weather makes golf a poor use of a good
            holiday, we will suggest something better and rearrange the round.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
