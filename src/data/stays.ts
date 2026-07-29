/**
 * Accommodation partners named in the business plan.
 *
 * TODO(client): NONE of these are contracted. Do not publish this section with
 * real names attached until each property has agreed to be listed — using a
 * luxury lodge's name as a selling point without a relationship is the fastest
 * way to lose the relationship. `confirmed: false` renders the property without
 * its name until you flip it.
 */
export type Stay = {
  id: string
  name: string
  region: 'Wānaka' | 'Queenstown' | 'Glenorchy'
  kind: 'Hotel' | 'Lodge' | 'Villa'
  blurb: string
  confirmed: boolean
}

export const STAYS: Stay[] = [
  {
    id: 'eichardts',
    name: "Eichardt's Private Hotel",
    region: 'Queenstown',
    kind: 'Hotel',
    blurb: 'Lakefront suites, and the best position in Queenstown.',
    confirmed: false,
  },
  {
    id: 'blanket-bay',
    name: 'Blanket Bay',
    region: 'Glenorchy',
    kind: 'Lodge',
    blurb: 'The benchmark New Zealand lodge, at the head of Lake Wakatipu.',
    confirmed: false,
  },
  {
    id: 'edgewater',
    name: 'Edgewater',
    region: 'Wānaka',
    kind: 'Hotel',
    blurb: 'On the lake edge, minutes from the first tee at Wānaka.',
    confirmed: false,
  },
  {
    id: 'villas',
    name: 'Private villas',
    region: 'Wānaka',
    kind: 'Villa',
    blurb: 'Whole-house lodges for groups who would rather not share a lobby.',
    confirmed: true,
  },
]
