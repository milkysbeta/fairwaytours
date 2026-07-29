/**
 * Seasonal guidance, which is what an international guest booking six months
 * out actually needs.
 *
 * NOTE(strategy): the previous build led with a live ten-day forecast. That was
 * the right feature for a day-trip business selling to guests already in the
 * country. It is the wrong feature here — this guest books from Singapore in
 * March for a trip in December, which is far outside any forecast horizon, and
 * a card reading "100% rain" does nothing but undercut a $12,000 proposition.
 *
 * The forecast integration itself still exists and still works (`lib/weather`,
 * `hooks/useForecast`) but is no longer rendered anywhere. It is kept for the
 * single-day journey, where the guest is already in the country and the next
 * ten days are exactly what they need. Delete both files if that never ships.
 */
export type Season = {
  id: string
  label: string
  months: string
  headline: string
  blurb: string
  /** Rough daytime high range in °C. */
  tempC: [number, number]
  /** How hard it is to get tee times and beds. */
  demand: 'Peak' | 'High' | 'Shoulder' | 'Quiet'
}

export const SEASONS: Season[] = [
  {
    id: 'summer',
    label: 'Summer',
    months: 'December – February',
    headline: 'Long light, firm fairways',
    blurb:
      'Daylight until well past nine, which means a full round after a full day of something else. The busiest window by a distance — the best courses and lodges are taken six to nine months ahead.',
    tempC: [18, 28],
    demand: 'Peak',
  },
  {
    id: 'autumn',
    label: 'Autumn',
    months: 'March – May',
    headline: 'The one we would pick',
    blurb:
      'Settled weather, the poplars turning copper through Arrowtown, and courses in their best condition of the year. Fewer people on them, too.',
    tempC: [12, 22],
    demand: 'High',
  },
  {
    id: 'winter',
    label: 'Winter',
    months: 'June – August',
    headline: 'Golf and mountains in one trip',
    blurb:
      'Cold, often still, and genuinely playable on the valley courses. The reason to come is the pairing — morning on the snow, afternoon on the grass.',
    tempC: [2, 11],
    demand: 'Quiet',
  },
  {
    id: 'spring',
    label: 'Spring',
    months: 'September – November',
    headline: 'Everything opening up',
    blurb:
      'Courses coming back into condition, snow still on the tops, and lodges easier to secure than in summer. Weather moves quickly — we build flexibility into the schedule.',
    tempC: [10, 19],
    demand: 'Shoulder',
  },
]
