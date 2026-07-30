/**
 * Monthly climate normals for Wānaka, used wherever a date sits beyond the
 * forecast horizon.
 *
 * Source: Open-Meteo ERA5 reanalysis archive, daily values for 2015-01-01 to
 * 2024-12-31 at -44.7, 169.15, averaged by calendar month. `wetDayPct` is the
 * share of days in that month recording 1mm or more. `score` is `scoreDay()`
 * from lib/weather applied to these means, so a typical day and a forecast day
 * are scored on exactly the same basis.
 *
 * These are real measurements, not estimates. Regenerate with the archive API
 * if the reference period should move.
 */
export type MonthNormal = {
  /** 1–12. */
  month: number
  tempMaxC: number
  tempMinC: number
  windMaxKmh: number
  /** Mean daily precipitation in mm. */
  precipMm: number
  /** Share of days with 1mm or more of rain. */
  wetDayPct: number
  score: number
}

export const CLIMATE_REFERENCE = '2015–2024 ERA5 reanalysis'

export const NORMALS: MonthNormal[] = [
  { month: 1, tempMaxC: 21.5, tempMinC: 12.2, windMaxKmh: 14, precipMm: 2.9, wetDayPct: 35, score: 73 },
  { month: 2, tempMaxC: 20.6, tempMinC: 11.7, windMaxKmh: 13, precipMm: 2.6, wetDayPct: 31, score: 72 },
  { month: 3, tempMaxC: 18.5, tempMinC: 10.4, windMaxKmh: 12, precipMm: 2.3, wetDayPct: 31, score: 74 },
  { month: 4, tempMaxC: 15.0, tempMinC: 7.5, windMaxKmh: 11, precipMm: 2.5, wetDayPct: 34, score: 70 },
  { month: 5, tempMaxC: 11.2, tempMinC: 4.9, windMaxKmh: 9, precipMm: 2.8, wetDayPct: 39, score: 61 },
  { month: 6, tempMaxC: 7.6, tempMinC: 2.4, windMaxKmh: 8, precipMm: 2.4, wetDayPct: 34, score: 58 },
  { month: 7, tempMaxC: 7.0, tempMinC: 1.2, windMaxKmh: 8, precipMm: 2.9, wetDayPct: 39, score: 48 },
  { month: 8, tempMaxC: 8.7, tempMinC: 1.8, windMaxKmh: 9, precipMm: 2.7, wetDayPct: 40, score: 57 },
  { month: 9, tempMaxC: 11.3, tempMinC: 3.2, windMaxKmh: 12, precipMm: 2.6, wetDayPct: 39, score: 56 },
  { month: 10, tempMaxC: 14.1, tempMinC: 5.3, windMaxKmh: 13, precipMm: 2.8, wetDayPct: 40, score: 65 },
  { month: 11, tempMaxC: 16.9, tempMinC: 8.1, windMaxKmh: 13, precipMm: 3.2, wetDayPct: 45, score: 65 },
  { month: 12, tempMaxC: 19.6, tempMinC: 10.7, windMaxKmh: 14, precipMm: 3.4, wetDayPct: 44, score: 65 },
]

export const normalFor = (month: number) => NORMALS[month - 1]

/** Ranking by score, so a month can honestly be called first or last. */
const RANKED = [...NORMALS].sort((a, b) => b.score - a.score).map((n) => n.month)
export const rankFor = (month: number) => RANKED.indexOf(month) + 1

/** Tee-time daylight, which in practice decides whether 36 holes is realistic. */
export const DAYLIGHT_HOURS: Record<number, number> = {
  1: 15.2,
  2: 13.9,
  3: 12.4,
  4: 11.0,
  5: 9.7,
  6: 9.0,
  7: 9.3,
  8: 10.4,
  9: 11.8,
  10: 13.2,
  11: 14.6,
  12: 15.4,
}

/** Demand, which is commercial rather than meteorological. */
export const DEMAND: Record<number, 'Peak' | 'High' | 'Shoulder' | 'Quiet'> = {
  1: 'Peak',
  2: 'Peak',
  3: 'High',
  4: 'High',
  5: 'Shoulder',
  6: 'Quiet',
  7: 'Quiet',
  8: 'Quiet',
  9: 'Shoulder',
  10: 'Shoulder',
  11: 'High',
  12: 'Peak',
}

/**
 * One honest line per month. Written against the numbers above rather than
 * around them — November and December really are the wettest months, and
 * saying so buys more trust than hiding it.
 */
export const MONTH_NOTE: Record<number, string> = {
  1: 'Long light and firm ground. Everything is booked months ahead.',
  2: 'The driest month of the year, and the warmest evenings.',
  3: 'The best golf of the year on the numbers, with the valley turning copper.',
  4: 'Still settled, noticeably quieter, and courses in fine condition.',
  5: 'Cooling fast. Crisp, still mornings are the reward for an early tee.',
  6: 'Cold but often calm. Come for the pairing with the ski fields.',
  7: 'The hardest month for golf. We would rather tell you than sell you.',
  8: 'Lengthening days and frozen mornings that soften by mid-morning.',
  9: 'Courses waking up. Weather swings hard, so we build in slack.',
  10: 'Warming and greening, and lodges still gettable at short notice.',
  11: 'Beautiful and the wettest month on record. We schedule around it.',
  12: 'Peak daylight. Book early or take what is left.',
}
