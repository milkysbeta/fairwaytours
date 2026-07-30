import { SITE } from '@/data/site'
import type { MonthNormal } from '@/data/climate'

/**
 * Open-Meteo — free, keyless, good NZ coverage.
 * https://open-meteo.com/en/docs
 */
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

/** Only reached when VITE_OPENWEATHER_KEY is set. See fetchOpenWeather below. */
const OPENWEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast'

export type DayForecast = {
  /** ISO date, e.g. 2026-08-03 */
  date: string
  tempMaxC: number
  tempMinC: number
  windMaxKmh: number
  precipMm: number
  precipChance: number
  /** WMO weather code. */
  code: number
  /** 0–100. How good this day looks for golf. */
  score: number
  verdict: GolfVerdict
}

export type GolfVerdict = 'exceptional' | 'good' | 'playable' | 'marginal'

/**
 * A deliberately transparent score. We surface the reasoning to the guest
 * rather than an opaque number — the point is to inform the choice of day,
 * not to make it for them.
 */
export function scoreDay(d: Omit<DayForecast, 'score' | 'verdict'>): number {
  let score = 100

  // Rain is the dominant factor.
  score -= Math.min(45, d.precipChance * 0.45)
  score -= Math.min(20, d.precipMm * 4)

  // Wind above ~20km/h starts to bite; above 45 it is unpleasant.
  score -= Math.min(30, Math.max(0, d.windMaxKmh - 18) * 1.1)

  // Comfortable playing temperature sits roughly 14–26°C.
  if (d.tempMaxC < 14) score -= (14 - d.tempMaxC) * 2.5
  if (d.tempMaxC > 26) score -= (d.tempMaxC - 26) * 1.5

  return Math.round(Math.max(0, Math.min(100, score)))
}

export function verdictFor(score: number): GolfVerdict {
  if (score >= 82) return 'exceptional'
  if (score >= 64) return 'good'
  if (score >= 42) return 'playable'
  return 'marginal'
}

/** Kept short and level-headed — these sit in a narrow card, and overselling a
 *  10°C overcast winter day costs more trust than it wins bookings. */
export const VERDICT_COPY: Record<GolfVerdict, string> = {
  exceptional: 'Prime conditions',
  good: 'Good for golf',
  playable: 'Playable — pack a layer',
  marginal: 'Consider another day',
}

type OpenMeteoResponse = {
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
  }
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

/**
 * Open-Meteo, both towns in one request. Passing several coordinates returns an
 * array of location objects, which we average — Wānaka and Queenstown sit 70km
 * apart and routinely differ by a degree or two.
 */
async function fetchOpenMeteo(days: number, signal?: AbortSignal): Promise<DayForecast[]> {
  const { points } = SITE.region
  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(','),
    longitude: points.map((p) => p.lon).join(','),
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'Pacific/Auckland',
    forecast_days: String(days),
  })

  const res = await fetch(`${ENDPOINT}?${params}`, { signal })
  if (!res.ok) throw new Error(`Forecast unavailable (${res.status})`)

  const body = (await res.json()) as OpenMeteoResponse | OpenMeteoResponse[]
  // A single coordinate returns an object; several return an array.
  const locations = Array.isArray(body) ? body : [body]

  return locations[0].daily.time.map((date, i) => {
    const at = (pick: (d: OpenMeteoResponse['daily']) => (number | null)[]) =>
      locations.map((l) => pick(l.daily)[i] ?? 0)

    const base = {
      date,
      // The worse of the two codes carries more information than an average.
      code: Math.max(...at((d) => d.weather_code)),
      tempMaxC: Math.round(mean(at((d) => d.temperature_2m_max))),
      tempMinC: Math.round(mean(at((d) => d.temperature_2m_min))),
      precipMm: +mean(at((d) => d.precipitation_sum)).toFixed(1),
      precipChance: Math.round(mean(at((d) => d.precipitation_probability_max))),
      windMaxKmh: Math.round(mean(at((d) => d.wind_speed_10m_max))),
    }
    const score = scoreDay(base)
    return { ...base, score, verdict: verdictFor(score) }
  })
}

type OpenWeatherResponse = {
  list: {
    dt: number
    main: { temp_max: number; temp_min: number }
    wind: { speed: number }
    pop?: number
    rain?: { '3h'?: number }
    weather: { id: number }[]
  }[]
}

/**
 * OpenWeather, used only when VITE_OPENWEATHER_KEY is set.
 *
 * The free tier has no keyless access and no daily endpoint — /forecast returns
 * 5 days of 3-hourly readings, which we fold into days. That is why Open-Meteo
 * remains the default: it needs no key and reaches 16 days, and this calendar
 * spans two years.
 */
async function fetchOpenWeather(key: string, signal?: AbortSignal): Promise<DayForecast[]> {
  const { points } = SITE.region

  const perPoint = await Promise.all(
    points.map(async (p) => {
      const params = new URLSearchParams({
        lat: String(p.lat),
        lon: String(p.lon),
        units: 'metric',
        appid: key,
      })
      const res = await fetch(`${OPENWEATHER_ENDPOINT}?${params}`, { signal })
      if (!res.ok) throw new Error(`Forecast unavailable (${res.status})`)
      return (await res.json()) as OpenWeatherResponse
    }),
  )

  /** Fold 3-hourly readings into one bucket per local calendar day. */
  const buckets = new Map<string, { t: number[]; tn: number[]; w: number[]; pop: number[]; mm: number[]; id: number[] }>()
  for (const body of perPoint) {
    for (const row of body.list) {
      const date = new Date(row.dt * 1000).toLocaleDateString('en-CA', {
        timeZone: 'Pacific/Auckland',
      })
      const b =
        buckets.get(date) ?? { t: [], tn: [], w: [], pop: [], mm: [], id: [] }
      b.t.push(row.main.temp_max)
      b.tn.push(row.main.temp_min)
      b.w.push(row.wind.speed * 3.6) // m/s → km/h
      b.pop.push((row.pop ?? 0) * 100)
      b.mm.push(row.rain?.['3h'] ?? 0)
      b.id.push(row.weather[0]?.id ?? 800)
      buckets.set(date, b)
    }
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, b]) => {
      const base = {
        date,
        code: owCodeToWmo(Math.max(...b.id)),
        tempMaxC: Math.round(Math.max(...b.t)),
        tempMinC: Math.round(Math.min(...b.tn)),
        precipMm: +b.mm.reduce((x, y) => x + y, 0).toFixed(1),
        precipChance: Math.round(Math.max(...b.pop)),
        windMaxKmh: Math.round(Math.max(...b.w)),
      }
      const score = scoreDay(base)
      return { ...base, score, verdict: verdictFor(score) }
    })
}

/** Coarse mapping so describeCode() keeps working across both providers. */
function owCodeToWmo(id: number): number {
  if (id >= 200 && id < 300) return 95
  if (id >= 300 && id < 400) return 51
  if (id >= 500 && id < 600) return 63
  if (id >= 600 && id < 700) return 73
  if (id >= 700 && id < 800) return 45
  if (id === 800) return 0
  if (id === 801 || id === 802) return 2
  return 3
}

/** Which provider is live, for the UI's attribution line. */
export const FORECAST_PROVIDER = import.meta.env.VITE_OPENWEATHER_KEY
  ? 'OpenWeather'
  : 'Open-Meteo'

export function fetchForecast(days = 14, signal?: AbortSignal): Promise<DayForecast[]> {
  const key = import.meta.env.VITE_OPENWEATHER_KEY
  return key ? fetchOpenWeather(key, signal) : fetchOpenMeteo(days, signal)
}

/**
 * A day in the calendar, from whichever source can actually speak to it.
 *
 * `forecast` days come from Open-Meteo and are real predictions. `typical` days
 * are the ERA5 monthly normals — an honest statement of what that date usually
 * looks like, which is the only truthful thing to show a guest booking nine
 * months out. The distinction is surfaced in the UI rather than blurred.
 */
export type DayOutlook = {
  date: string
  source: 'forecast' | 'typical'
  tempMaxC: number
  windMaxKmh: number
  score: number
  verdict: GolfVerdict
  /** Forecast only. */
  code?: number
  precipChance?: number
}

export function outlookFromForecast(d: DayForecast): DayOutlook {
  return {
    date: d.date,
    source: 'forecast',
    tempMaxC: d.tempMaxC,
    windMaxKmh: d.windMaxKmh,
    score: d.score,
    verdict: d.verdict,
    code: d.code,
    precipChance: d.precipChance,
  }
}

export function outlookFromNormal(date: string, n: MonthNormal): DayOutlook {
  return {
    date,
    source: 'typical',
    tempMaxC: Math.round(n.tempMaxC),
    windMaxKmh: n.windMaxKmh,
    score: n.score,
    verdict: verdictFor(n.score),
  }
}

/** WMO weather code → short human label. */
export function describeCode(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 2) return 'Mostly sunny'
  if (code === 3) return 'Overcast'
  if (code <= 48) return 'Fog'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow showers'
  return 'Storms'
}
