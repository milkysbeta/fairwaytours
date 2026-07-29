/**
 * TODO(client): `name` is the plan's recommended positioning name. Every piece
 * of copy reads from this constant, so changing it here changes it everywhere.
 * Alternates shortlisted in the plan: Alpine Links NZ, Aoraki Golf & Touring.
 */
export const SITE = {
  name: 'Southern Fairways',
  tagline: 'The South Island, played properly.',
  /** One line, used in the meta description and the footer. */
  positioning:
    'Private golf journeys through Wānaka, Arrowtown and Queenstown — elite course access, luxury lodges, and a host who handles everything in between.',
  /** TODO(client): real contact details before launch. */
  email: 'enquiries@southernfairways.co.nz',
  phone: '+64 00 000 0000',
  founder: {
    name: 'Jacob Matthews',
    role: 'Founder & Host',
    /** TODO(client): confirm handicap. */
    handicap: null as number | null,
  },
  base: { label: 'Wānaka & Queenstown, Central Otago', lat: -44.7, lon: 169.15 },
  /** Source markets the itineraries and enquiry flow are written for. */
  markets: [
    'Australia',
    'United States',
    'Singapore',
    'United Kingdom',
    'Japan',
    'Korea',
    'Elsewhere',
  ],
} as const
