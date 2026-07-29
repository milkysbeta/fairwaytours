/** The three ways a guest can travel. This drives the booking flow's first fork. */
export type ServiceMode = 'chauffeured' | 'own-car' | 'hire-car'

export type Service = {
  id: ServiceMode
  label: string
  tagline: string
  description: string
  bullets: string[]
  /** Relative price signal shown as $ / $$ / $$$ until real rates land. */
  priceSignal: '$' | '$$' | '$$$'
}

export const SERVICES: Service[] = [
  {
    id: 'chauffeured',
    label: "Jacob's Car",
    tagline: 'Door to door, nothing to think about',
    description:
      'We collect you from your accommodation, load the clubs, and drive. You play, we handle the rest — tee times, timing between courses, lunch, and the run home.',
    bullets: [
      'Pickup and drop-off at your door',
      'Clubs and luggage handled',
      'Local knowledge on every hole and every restaurant',
    ],
    priceSignal: '$$',
  },
  {
    id: 'own-car',
    label: 'Your Car',
    tagline: 'Your vehicle, our driver',
    description:
      'Already have a car in the driveway? Jacob drives it. You arrive relaxed, you leave relaxed, and nobody draws the short straw at dinner.',
    bullets: [
      'The most affordable way to travel',
      'Fully licensed and insured driver',
      'Ideal for guests already renting for their stay',
    ],
    priceSignal: '$',
  },
  {
    id: 'hire-car',
    label: 'Hire Car',
    tagline: 'Choose the drive',
    description:
      'Something with a bit more presence for the trip. We arrange the vehicle through our local partners and it is waiting when you are.',
    bullets: [
      'Vehicle matched to your group and your taste',
      'Arranged and delivered — no rental desks',
      'Partner rates on multi-day bookings',
    ],
    priceSignal: '$$$',
  },
]

export const serviceById = (id: ServiceMode) => SERVICES.find((s) => s.id === id)!
