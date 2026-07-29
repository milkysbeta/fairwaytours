import type { ServiceMode } from '@/data/services'

export type Enquiry = {
  mode: ServiceMode | null
  packageId: string | null
  courseIds: string[]
  date: string | null
  groupSize: number
  pickupLocation: string
  extras: string[]
  name: string
  email: string
  phone: string
  notes: string
}

export const EMPTY_ENQUIRY: Enquiry = {
  mode: null,
  packageId: null,
  courseIds: [],
  date: null,
  groupSize: 2,
  pickupLocation: '',
  extras: [],
  name: '',
  email: '',
  phone: '',
  notes: '',
}

export const EXTRAS = [
  'Dinner reservation',
  'Airport pickup',
  'Club hire',
  'Non-golfer itinerary',
  'Multi-day trip',
] as const

/**
 * Indicative estimate only — deliberately coarse, and always presented as a
 * range with a caveat. Real rates land once the client confirms pricing.
 *
 * TODO(client): replace these constants with the agreed rate card (question 5).
 */
const RATE = {
  baseHalfDay: 0,
  perCourse: 0,
  perExtraGuest: 0,
  modeMultiplier: { 'own-car': 1, chauffeured: 1, 'hire-car': 1 } satisfies Record<
    ServiceMode,
    number
  >,
}

export function estimate(e: Enquiry): { low: number; high: number } | null {
  if (!e.mode || e.courseIds.length === 0) return null
  if (RATE.baseHalfDay === 0) return null // no rate card yet — show "on enquiry"

  const base =
    (RATE.baseHalfDay +
      RATE.perCourse * e.courseIds.length +
      RATE.perExtraGuest * Math.max(0, e.groupSize - 2)) *
    RATE.modeMultiplier[e.mode]

  return { low: Math.round(base * 0.9), high: Math.round(base * 1.25) }
}

export async function submitEnquiry(e: Enquiry): Promise<void> {
  // TODO(backend): wire to the enquiries endpoint + email notification
  // (project questions 12 & 13). Until then this fails loudly rather than
  // silently swallowing a lead.
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(e),
  })
  if (!res.ok) throw new Error('Submission failed')
}
