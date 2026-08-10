/**
 * Every piece of copy reads `name` from here, so changing it here changes it
 * everywhere.
 *
 * The registered domain is fairwaytours.co.nz — confirmed live on Porkbun
 * nameservers. The singular fairwaytour.co.nz does not resolve and is not
 * registered, despite appearing in the project folder name.
 */
export const SITE = {
  name: 'Fairway Tours',
  tagline: 'The South Island, played properly.',
  /** One line, used in the meta description and the footer. */
  positioning:
    'Private golf journeys through Wānaka, Arrowtown and Queenstown — elite course access, luxury lodges, and a host who handles everything in between.',
  /** TODO(client): real contact details before launch. */
  email: 'enquiries@fairwaytours.co.nz',
  phone: '+64 00 000 0000',
  founder: {
    name: 'Jacob Matthews',
    role: 'Founder & Host',
    /** TODO(client): confirm handicap. */
    handicap: null as number | null,
  },
  base: { label: 'Wānaka & Queenstown, Central Otago', lat: -44.7, lon: 169.15 },

  /**
   * The forecast area. Both towns are sampled and averaged — they sit 70km
   * apart over the Crown Range and routinely differ by a degree or two, so one
   * point would misrepresent the other.
   *
   * NOTE: the baked climate normals in data/climate.ts are Wānaka-only. Rerun
   * the archive query for both points if the region ever needs its own normals.
   */
  region: {
    label: 'Queenstown & Wānaka',
    points: [
      { name: 'Wānaka', lat: -44.7, lon: 169.15 },
      { name: 'Queenstown', lat: -45.03, lon: 168.66 },
    ],
  },
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
