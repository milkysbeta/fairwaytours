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
import { SITE } from '@/data/site'
import { useForecast } from '@/hooks/useForecast'
import {
  FORECAST_PROVIDER,
  outlookFromForecast,
  outlookFromNormal,
  VERDICT_COPY,
  describeCode,
  type DayOutlook,
} from '@/lib/weather'

const ISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Monday-first, as New Zealand reads a calendar. */
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** How many months ahead a guest can look. Beyond two years is fantasy. */
const HORIZON_MONTHS = 23

/**
 * The gold ring marks a day at the top verdict band — the same threshold the
 * rest of the site calls "exceptional", rather than a second invented number.
 *
 * Only forecast days can earn it. A monthly normal peaks at 74 (March), so no
 * typical day ever rings, which is correct: you cannot know a specific date six
 * months out is perfect, and pretending otherwise is the one thing this feature
 * must not do.
 */
const ringed = (o: DayOutlook) => o.source === 'forecast' && o.verdict === 'exceptional'

export type Overlay = 'golf' | 'rain' | 'off'

const OVERLAYS: { id: Overlay; label: string }[] = [
  { id: 'golf', label: 'Playing conditions' },
  { id: 'rain', label: 'Rain' },
  { id: 'off', label: 'Off' },
]

const DEMAND_STYLE: Record<string, string> = {
  Peak: 'border-gold-500/50 text-gold-600',
  High: 'border-turf-600/40 text-turf-700',
  Shoulder: 'border-pine-950/15 text-pine-950/60',
  Quiet: 'border-pine-950/10 text-pine-950/45',
}

/**
 * Tint for one cell. Green carries how good the golf is, blue carries how wet —
 * both over white, so the calendar reads as paper with weather laid on top
 * rather than as a dark chart.
 */
function tintFor(outlook: DayOutlook, overlay: Overlay): string {
  if (overlay === 'off') return 'transparent'

  if (overlay === 'rain') {
    // Forecast days know their probability; typical days fall back to the
    // month's wet-day share, which is the same quantity averaged.
    const wet =
      outlook.precipChance ?? normalFor(Number(outlook.date.slice(5, 7))).wetDayPct
    const a = Math.min(0.5, (wet / 100) * 0.55)
    return `rgba(56, 122, 173, ${a.toFixed(3)})`
  }

  // Below ~45 there is nothing worth colouring in; above that, ramp up.
  const t = Math.max(0, (outlook.score - 45) / 55)
  const a = Math.min(0.46, t * 0.5)
  return `rgba(27, 101, 53, ${a.toFixed(3)})`
}

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
  const [overlay, setOverlay] = useState<Overlay>('golf')
  const [hovered, setHovered] = useState<string | null>(null)

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
  const forecastDays = cells.filter((c) => c && !c.past && c.outlook.source === 'forecast').length
  const hoveredCell = cells.find((c) => c && c.iso === hovered) || null

  return (
    <div className={compact ? '' : 'grid gap-10 lg:grid-cols-[1fr_18rem]'}>
      {/* The calendar sits on paper. */}
      <div className="rounded-2xl border border-pine-950/10 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(4,20,15,0.45)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              aria-label="Previous month"
              className="rounded-full border border-pine-950/15 px-3 py-1.5 text-sm text-pine-950/70 transition-colors hover:border-pine-950/40 hover:text-pine-950 disabled:opacity-25"
            >
              ←
            </button>
            <p className="font-display text-xl text-pine-950">{monthLabel}</p>
            <button
              type="button"
              onClick={() => setOffset((o) => Math.min(HORIZON_MONTHS, o + 1))}
              disabled={offset === HORIZON_MONTHS}
              aria-label="Next month"
              className="rounded-full border border-pine-950/15 px-3 py-1.5 text-sm text-pine-950/70 transition-colors hover:border-pine-950/40 hover:text-pine-950 disabled:opacity-25"
            >
              →
            </button>
          </div>

          {/* Overlay switch. */}
          <div
            role="group"
            aria-label="Weather overlay"
            className="flex rounded-full border border-pine-950/12 p-1"
          >
            {OVERLAYS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOverlay(o.id)}
                aria-pressed={overlay === o.id}
                className={`rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                  overlay === o.id
                    ? 'bg-pine-950 text-bone-50'
                    : 'text-pine-950/55 hover:text-pine-950'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d, i) => (
            <p
              key={i}
              className="pb-2 text-center text-[0.6rem] uppercase tracking-[0.16em] text-pine-950/35"
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
                onMouseEnter={() => setHovered(cell.iso)}
                onMouseLeave={() => setHovered((h) => (h === cell.iso ? null : h))}
                onFocus={() => setHovered(cell.iso)}
                aria-pressed={selected === cell.iso}
                className={`group relative flex aspect-square flex-col items-center justify-center rounded-lg border transition-all duration-300 ${
                  cell.past
                    ? 'cursor-default border-transparent text-pine-950/15'
                    : selected === cell.iso
                      ? 'border-turf-600 text-pine-950 ring-2 ring-turf-600/30'
                      : 'border-pine-950/8 text-pine-950/80 hover:border-pine-950/25'
                }`}
                style={
                  cell.past ? undefined : { backgroundColor: tintFor(cell.outlook, overlay) }
                }
              >
                {/* Gold ring: only the days that are genuinely perfect. */}
                {!cell.past && ringed(cell.outlook) && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[3px] rounded-md ring-2 ring-gold-500/85"
                  />
                )}

                <span className="relative text-sm tabular-nums">{cell.day}</span>

                {!cell.past && (
                  <>
                    <span className="relative mt-0.5 text-[0.6rem] tabular-nums text-pine-950/55">
                      {cell.outlook.tempMaxC}°
                    </span>
                    {/* A forecast day is a real prediction; mark it as one. */}
                    {cell.outlook.source === 'forecast' && (
                      <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-pine-950/40" />
                    )}
                  </>
                )}
              </button>
            ),
          )}
        </div>

        {/* Hover readout, so the overlay can be interrogated without clicking. */}
        <div className="mt-6 flex min-h-[2.75rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-pine-950/8 pt-4">
          {hoveredCell && !hoveredCell.past ? (
            <motion.p
              key={hoveredCell.iso}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-pine-950/80"
            >
              <span className="font-medium">
                {new Date(`${hoveredCell.iso}T00:00:00`).toLocaleDateString('en-NZ', {
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              {' — '}
              {VERDICT_COPY[hoveredCell.outlook.verdict].toLowerCase()}, {hoveredCell.outlook.tempMaxC}°
              {hoveredCell.outlook.precipChance !== undefined &&
                `, ${hoveredCell.outlook.precipChance}% rain`}
              , {hoveredCell.outlook.windMaxKmh} km/h
              {hoveredCell.outlook.code !== undefined &&
                ` · ${describeCode(hoveredCell.outlook.code).toLowerCase()}`}
              <span className="ml-2 text-pine-950/40">
                {hoveredCell.outlook.source === 'forecast' ? 'forecast' : 'typical'}
              </span>
            </motion.p>
          ) : (
            <p className="text-[0.7rem] text-pine-950/45">
              Hover a date for detail. A gold ring marks a day that is as good as it gets here.
            </p>
          )}

          <p className="text-[0.65rem] text-pine-950/40">
            {forecastDays > 0 ? `${forecastDays} forecast days · ` : ''}
            {SITE.region.label} · {FORECAST_PROVIDER}
          </p>
        </div>

        {error && (
          <p className="mt-3 text-[0.68rem] text-copper-500">
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
          className="h-fit rounded-2xl border border-pine-950/10 bg-bone-100 p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-turf-600/80">
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

          <p className="mt-4 text-sm leading-relaxed text-pine-950/80">{MONTH_NOTE[month]}</p>

          <dl className="mt-6 space-y-2.5 border-t border-pine-950/10 pt-5 text-sm">
            {[
              ['Typical high', `${normal.tempMaxC}°C`],
              ['Overnight low', `${normal.tempMinC}°C`],
              ['Days with rain', `${normal.wetDayPct}%`],
              ['Peak wind', `${normal.windMaxKmh} km/h`],
              ['Daylight', `${DAYLIGHT_HOURS[month]} hrs`],
              ['Ranked for golf', `${rankFor(month)} of 12`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-pine-950/50">{k}</dt>
                <dd className="tabular-nums text-pine-950">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[0.62rem] leading-relaxed text-pine-950/40">
            Typical figures from {CLIMATE_REFERENCE}.
          </p>
        </motion.aside>
      )}
    </div>
  )
}
