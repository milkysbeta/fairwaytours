import { SITE } from '@/data/site'

/**
 * Open-Meteo — free, keyless, good NZ coverage.
 * https://open-meteo.com/en/docs
 */
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

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

export async function fetchForecast(days = 14, signal?: AbortSignal): Promise<DayForecast[]> {
  const params = new URLSearchParams({
    latitude: String(SITE.base.lat),
    longitude: String(SITE.base.lon),
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'Pacific/Auckland',
    forecast_days: String(days),
  })

  const res = await fetch(`${ENDPOINT}?${params}`, { signal })
  if (!res.ok) throw new Error(`Forecast unavailable (${res.status})`)

  const { daily } = (await res.json()) as OpenMeteoResponse

  return daily.time.map((date, i) => {
    const base = {
      date,
      code: daily.weather_code[i],
      tempMaxC: Math.round(daily.temperature_2m_max[i]),
      tempMinC: Math.round(daily.temperature_2m_min[i]),
      precipMm: daily.precipitation_sum[i] ?? 0,
      precipChance: daily.precipitation_probability_max[i] ?? 0,
      windMaxKmh: Math.round(daily.wind_speed_10m_max[i]),
    }
    const score = scoreDay(base)
    return { ...base, score, verdict: verdictFor(score) }
  })
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
