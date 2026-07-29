/**
 * The primary fork of the site and of the enquiry flow.
 *
 * This replaces the old `ServiceMode` (chauffeured / own car / hire car). That
 * was a ground-transport question, and the guest this brand is written for does
 * not choose between driving themselves and being driven — the driving is
 * assumed. What they choose is the shape and length of the journey.
 */
export type JourneyType = 'signature' | 'bespoke' | 'corporate' | 'day'

export type Journey = {
  id: JourneyType
  label: string
  duration: string
  tagline: string
  description: string
  bullets: string[]
  /**
   * Indicative per-guest price in NZD, used as a "from" anchor.
   * TODO(client): the plan gives a $6,000–$18,000 per-guest band. These are
   * placed inside that band and must be confirmed against real supplier costs
   * before launch.
   */
  fromPerGuestNzd: number | null
  featured?: boolean
}

export const JOURNEYS: Journey[] = [
  {
    id: 'signature',
    label: 'The Signature Escape',
    duration: 'Five days, four nights',
    tagline: 'The full South Island journey',
    description:
      'Four courses, two bases, and every transfer, tee time, table and helicopter arranged before you land. The complete expression of what we do.',
    bullets: [
      'Golf at Wānaka, The Hills, Millbrook and Jacks Point',
      'Luxury lodge and private villa accommodation',
      'Private vehicle and host throughout',
      'Dining, wine and helicopter experiences woven between rounds',
    ],
    fromPerGuestNzd: 11500,
    featured: true,
  },
  {
    id: 'bespoke',
    label: 'A Bespoke Journey',
    duration: 'Three to ten days',
    tagline: 'Built around what you actually want',
    description:
      'Some guests want six rounds in seven days. Others want two rounds, a helicopter to Milford, and a long lunch in a vineyard. We start from a blank page.',
    bullets: [
      'Any combination of courses and regions',
      'Non-golfing partners fully catered for',
      'Fly fishing, heli-golf, spa days, private chefs',
      'One point of contact from first enquiry to departure',
    ],
    fromPerGuestNzd: 6000,
  },
  {
    id: 'corporate',
    label: 'Corporate & Incentive',
    duration: 'Custom',
    tagline: 'Executive retreats and reward travel',
    description:
      'Boards, partner retreats, and incentive groups. Multiple vehicles, staggered tee times, private dining, and a single person accountable for all of it.',
    bullets: [
      'Groups of eight to forty',
      'Private course hire and shotgun starts by arrangement',
      'Meeting space and private dining coordination',
      'Detailed pre-trip briefing pack for your organiser',
    ],
    fromPerGuestNzd: null,
  },
  {
    id: 'day',
    label: 'A Single Day',
    duration: 'One day',
    tagline: 'For guests already in the region',
    description:
      'Staying in Queenstown or Wānaka already? A hosted day on one of the great courses, with the transfers and the table handled.',
    bullets: [
      'One championship or classic course',
      'Return transfers from your accommodation',
      'Tee time secured and lunch or dinner booked',
    ],
    fromPerGuestNzd: 1450,
  },
]

export const journeyById = (id: JourneyType) => JOURNEYS.find((j) => j.id === id)!
