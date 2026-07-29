/**
 * The Signature Escape, day by day.
 *
 * NOTE(strategy): the business plan's draft itinerary bases all four nights in
 * Wānaka while playing The Hills on day 3 and Jacks Point on day 4 — both
 * Queenstown-side. That is two return crossings of the Crown Range, roughly an
 * hour each way, on the two days the guest is paying the most for. The version
 * below splits the base: two nights Wānaka, two nights Arrowtown/Queenstown,
 * with the move happening on a golf morning so it costs no holiday time.
 * TODO(client): confirm this shape before we commit it to print.
 */
export type ItineraryDay = {
  day: number
  title: string
  base: 'Wānaka' | 'Arrowtown' | 'Queenstown'
  /** The anchor experience of the day — golf, or arrival/departure. */
  anchor: string
  moments: string[]
  /** Optional upgrades offered at the point of booking. */
  options?: string[]
}

export const SIGNATURE_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    title: 'Arrival',
    base: 'Wānaka',
    anchor: 'Queenstown Airport to the lake',
    moments: [
      'Met airside and walked to a private vehicle',
      'The Crown Range at altitude, stopping where the view earns it',
      'Check in to a lakefront suite or private villa',
      'Welcome dinner, with wines chosen to introduce the region',
    ],
    options: ['Helicopter transfer from the airport in place of the road'],
  },
  {
    day: 2,
    title: 'The Home Course',
    base: 'Wānaka',
    anchor: 'Wānaka Golf Club',
    moments: [
      'A relaxed first round with Mount Aspiring over your shoulder',
      'Lunch at the club, or lakeside in town',
      'The afternoon left open — deliberately',
    ],
    options: ['Cellar-door tasting through the Gibbston valley', 'Lake cruise', 'Spa afternoon'],
  },
  {
    day: 3,
    title: 'The Hills',
    base: 'Arrowtown',
    anchor: 'The Hills',
    moments: [
      'Bags collected and moved to Arrowtown while you play',
      'A hosted round through the sculpture park',
      'Check in to your second base, unpacked and waiting',
      'Dinner in Arrowtown, on a table we hold year-round',
    ],
  },
  {
    day: 4,
    title: 'Jacks Point',
    base: 'Queenstown',
    anchor: 'Jacks Point',
    moments: [
      'The lakeside stretch under the Remarkables',
      'Long lunch at the clubhouse',
      'The last evening, however you want it',
    ],
    options: [
      'Heli-golf onto a remote high-country tee',
      'Milford Sound by air',
      'Private whisky tasting',
      'Fly fishing on the Mataura',
    ],
  },
  {
    day: 5,
    title: 'Departure',
    base: 'Queenstown',
    anchor: 'Queenstown Airport',
    moments: [
      'An unhurried morning — late checkout arranged as standard',
      'Private transfer timed to your flight, not to a schedule',
      'Clubs cleaned, boxed and checked in for you',
    ],
    options: ['A final nine at Millbrook before the airport'],
  },
]
