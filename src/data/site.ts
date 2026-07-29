export const SITE = {
  name: 'Fairway NZ',
  tagline: 'Golf, driven properly.',
  /** TODO(client): real contact details before launch. */
  email: 'hello@fairway.nz',
  phone: '+64 00 000 0000',
  guide: {
    name: 'Jacob Matthews',
    role: 'Founder & Guide',
    /** TODO(client): confirm handicap. */
    handicap: null as number | null,
  },
  base: { label: 'Wanaka, Central Otago', lat: -44.7, lon: 169.15 },
  airbnbUrl: null as string | null,
} as const
