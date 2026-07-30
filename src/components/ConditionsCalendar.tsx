import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CLIMATE_REFERENCE,
  DAYLIGHT_HOURS,
  DEMAND,
  MONTH_NOTE,
  normalFor,
  rankFor,
} from '@/data/climate'
import { useForecast } from '@/hooks/useForecast'
import {
  outlookFromForecast,
  outlookFromNormal,
  VERDICT_COPY,
  type DayOutlook,
  type GolfVerdict,
} from '@/lib/weather'

const ISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Monday-first, as New Zealand reads a calendar. */
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const VERDICT_DOT: Record<GolfVerdict, string> = {
  exceptional: 'bg-fairway-400',
  good: 'bg-fairway-500/80',
  playable: 'bg-gold-500/80',
  marginal: 'bg-bone-400/40',
}

const DEMAND_STYLE: Record<string, string> = {
  Peak: 'border-gold-500/40 text-gold-400',
  High: 'border-fairway-500/40 text-fairway-400',
  Shoulder: 'border-bone-100/20 text-bone-300',
  Quiet: 'border-bone-100/15 text-bone-400',
}

/** How many months ahead a guest can look. Beyond two years is fantasy. */
const HORIZON_MONTHS = 23

type Props = {
  selected: string | null
  onSelect: (iso: string) => void
  /** Compact drops the month summary panel, for use inside the enquiry flow. */
  compact?: boolean
}

export function ConditionsCalendar({ selected, onSelect, compact = false }: Props) {
  const { days: forecast, error } = useForecast(16)
  const today = useMemo(() => new Date(new Date().toDateString()), [])
  const [offset, setOffset] = useState(0)

  // Kept as primitives so the grid memo below has stable dependencies.
  const year = today.getFullYear() + Math.floor((today.getMonth() + offset) / 12)
  const monthIndex = (today.getMonth() + offset) % 12
  const month = monthIndex + 1
  const normal = normalFor(month)
  const cursor = useMemo(() => new Date(year, monthIndex, 1), [year, monthIndex])

  /** Forecast wins where it exists; normals fill the rest. */
  const byDate = useMemo(() => {
    const map = new Map<string, DayOutlook>()
    forecast.forEach((d) => map.set(d.date, outlookFromForecast(d)))
    return map
  }, [forecast])

  const cells = useMemo(() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    // getDay() is Sunday-first; shift so Monday leads.
    const lead = (new Date(year, monthIndex, 1).getDay() + 6) % 7

    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, monthIndex, i + 1)
        const iso = ISO(date)
        return {
          iso,
          day: i + 1,
          past: date < today,
          outlook: byDate.get(iso) ?? outlookFromNormal(iso, normal),
        }
      }),
    ]
  }, [year, monthIndex, byDate, normal, today])

  const monthLabel = cursor.toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })
  const forecastDaysThisMonth = cells.filter(
    (c) => c && !c.past && c.outlook.source === 'forecast',
  ).length

  return (
    <div className={compact ? '' : 'grid gap-10 lg:grid-cols-[1fr_18rem]'}>
      <div>
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="rounded-full border border-bone-100/15 px-3 py-1.5 text-sm text-bone-300 transition-colors hover:border-bone-100/40 hover:text-bone-50 disabled:opacity-25"
          >
            ←
          </button>

          <p className="font-display text-xl text-bone-50">{monthLabel}</p>

          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(HORIZON_MONTHS, o + 1))}
            disabled={offset === HORIZON_MONTHS}
            aria-label="Next month"
            className="rounded-full border border-bone-100/15 px-3 py-1.5 text-sm text-bone-300 transition-colors hover:border-bone-100/40 hover:text-bone-50 disabled:opacity-25"
          >
            →
          </button>
        </div>

        <div className="mt-7 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d, i) => (
            <p
              key={i}
              className="pb-2 text-center text-[0.6rem] uppercase tracking-[0.16em] text-bone-400/50"
            >
              {d}
            </p>
          ))}

          {cells.map((cell, i) =>
            cell === null ? (
              <div key={`pad-${i}`} />
            ) : (
              <button
                key={cell.iso}
                type="button"
                disabled={cell.past}
                onClick={() => onSelect(cell.iso)}
                aria-pressed={selected === cell.iso}
                title={`${VERDICT_COPY[cell.outlook.verdict]} · ${
                  cell.outlook.source === 'forecast' ? 'forecast' : 'typical for the month'
                }`}
                className={`group relative flex aspect-square flex-col items-center justify-center rounded-lg border transition-all duration-300 ${
                  cell.past
                    ? 'cursor-default border-transparent text-bone-400/20'
                    : selected === cell.iso
                      ? 'border-fairway-500 bg-fairway-500/15 text-bone-50'
                      : 'border-bone-100/10 bg-pine-900/40 text-bone-200 hover:border-bone-100/30'
                }`}
              >
                <span className="text-sm tabular-nums">{cell.day}</span>

                {!cell.past && (
                  <>
                    <span className="mt-1 text-[0.6rem] tabular-nums text-bone-400">
                      {cell.outlook.tempMaxC}°
                    </span>
                    <span
                      className={`mt-1 h-1 w-1 rounded-full ${VERDICT_DOT[cell.outlook.verdict]}`}
                    />
                    {/* A forecast day is a real prediction; mark it as one. */}
                    {cell.outlook.source === 'forecast' && (
                      <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-bone-100/50" />
                    )}
                  </>
                )}
              </button>
            ),
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.68rem] text-bone-400">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-bone-100/50" />
            Forecast
            {forecastDaysThisMonth > 0 && ` (next ${forecastDaysThisMonth} days)`}
          </span>
          <span>Unmarked days show typical conditions for the month</span>
        </div>

        {error && (
          <p className="mt-4 text-[0.68rem] text-gold-400">
            Live forecast unavailable — every day is showing typical conditions.
          </p>
        )}
      </div>

      {!compact && (
        <motion.aside
          key={month}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-fit rounded-2xl border border-bone-100/10 bg-pine-900/40 p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow">
              {cursor.toLocaleDateString('en-NZ', { month: 'long' })} in Wānaka
            </p>
            <span
              className={`rounded-full border px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.16em] ${
                DEMAND_STYLE[DEMAND[month]]
              }`}
            >
              {DEMAND[month]}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-bone-200">{MONTH_NOTE[month]}</p>

          <dl className="mt-6 space-y-2.5 border-t border-bone-100/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Typical high</dt>
              <dd className="tabular-nums text-bone-100">{normal.tempMaxC}°C</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Overnight low</dt>
              <dd className="tabular-nums text-bone-100">{normal.tempMinC}°C</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Days with rain</dt>
              <dd className="tabular-nums text-bone-100">{normal.wetDayPct}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Peak wind</dt>
              <dd className="tabular-nums text-bone-100">{normal.windMaxKmh} km/h</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Daylight</dt>
              <dd className="tabular-nums text-bone-100">{DAYLIGHT_HOURS[month]} hrs</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone-400/70">Ranked for golf</dt>
              <dd className="tabular-nums text-bone-100">{rankFor(month)} of 12</dd>
            </div>
          </dl>

          <p className="mt-5 text-[0.62rem] leading-relaxed text-bone-400/60">
            Typical figures from {CLIMATE_REFERENCE}.
          </p>
        </motion.aside>
      )}
    </div>
  )
}
