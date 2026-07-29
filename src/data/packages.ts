export type Package = {
  id: string
  name: string
  duration: string
  courseIds: string[]
  summary: string
  includes: string[]
  /** TODO(client): real pricing pending. Null renders as "Price on enquiry". */
  fromPriceNzd: number | null
  featured?: boolean
}

/**
 * TODO(client): package names and shapes are a first draft (question 14).
 * Confirm the line-up before we write final copy.
 */
export const PACKAGES: Package[] = [
  {
    id: 'wanaka-day',
    name: 'The Wanaka Day',
    duration: 'Half or full day',
    courseIds: ['wanaka'],
    summary:
      'The easiest possible introduction. Collected after breakfast, eighteen holes at the home club, lunch on the way back.',
    includes: ['Return transfers', 'Tee time coordination', 'Lunch recommendation and booking'],
    fromPriceNzd: null,
  },
  {
    id: 'southern-lakes',
    name: 'The Southern Lakes Trail',
    duration: 'Three days',
    courseIds: ['wanaka', 'millbrook', 'jacks-point'],
    summary:
      'The signature run. Three of the finest courses in New Zealand across three days, with the Crown Range in between.',
    includes: [
      'All transfers between Wanaka and Queenstown',
      'Tee time coordination at every course',
      'Dinner reservations each evening',
      'Weather-led scheduling — we move the days around, not you',
    ],
    fromPriceNzd: null,
    featured: true,
  },
  {
    id: 'arrival-and-play',
    name: 'Arrival & Play',
    duration: 'Day of arrival',
    courseIds: ['arrowtown'],
    summary:
      'Collected at Queenstown Airport, on a tee within the hour. The best possible first two hours in the country.',
    includes: ['Airport pickup', 'Clubs and luggage handled', 'Transfer on to your accommodation'],
    fromPriceNzd: null,
  },
  {
    id: 'group-charter',
    name: 'The Group Charter',
    duration: 'Custom',
    courseIds: ['millbrook', 'the-hills', 'jacks-point'],
    summary:
      'Corporate groups, wedding parties, and golf societies. Multiple vehicles, staggered tee times, one point of contact.',
    includes: [
      'Multi-vehicle coordination',
      'Group tee times',
      'Private dining arrangements',
      'Non-golfer itineraries for partners',
    ],
    fromPriceNzd: null,
  },
]
