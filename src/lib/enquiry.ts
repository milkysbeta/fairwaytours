import { journeyById, type JourneyType } from '@/data/journeys'

/**
 * What we need to know to price and plan a journey.
 *
 * The old shape asked for a pickup location and a car preference. At $6k–$18k
 * per guest, the questions that matter are who is travelling, when, how long
 * for, and what they want besides golf.
 */
export type Enquiry = {
  journey: JourneyType | null
  /** ISO arrival date, chosen on the conditions calendar. */
  arrivalDate: string | null
  nights: number | null
  golfers: number
  nonGolfers: number
  /** Where the party is flying from, for timezone-aware follow-up. */
  origin: string
  courseIds: string[]
  experienceIds: string[]
  /** Self-declared, and used to steer the proposal rather than to qualify out. */
  budgetBand: BudgetBand | null
  name: string
  email: string
  phone: string
  notes: string
}

export type BudgetBand = 'exploring' | '6-10' | '10-18' | '18-plus'

export const BUDGET_BANDS: { id: BudgetBand; label: string; hint: string }[] = [
  { id: 'exploring', label: 'Still exploring', hint: 'Tell us what it costs' },
  { id: '6-10', label: '$6,000 – $10,000', hint: 'per guest' },
  { id: '10-18', label: '$10,000 – $18,000', hint: 'per guest' },
  { id: '18-plus', label: '$18,000+', hint: 'per guest' },
]

export const EMPTY_ENQUIRY: Enquiry = {
  journey: null,
  arrivalDate: null,
  nights: null,
  golfers: 2,
  nonGolfers: 0,
  origin: '',
  courseIds: [],
  experienceIds: [],
  budgetBand: null,
  name: '',
  email: '',
  phone: '',
  notes: '',
}

/**
 * The "from" anchor for whichever journey is selected. Deliberately not a
 * calculated quote — at this price point every itinerary is costed by hand
 * against live supplier rates, and a made-up number on screen is worse than no
 * number at all.
 *
 * TODO(client): confirm the per-guest anchors in `data/journeys.ts`.
 */
export function indicativeFrom(e: Enquiry): number | null {
  if (!e.journey) return null
  return journeyById(e.journey).fromPerGuestNzd
}

export function partySize(e: Enquiry): number {
  return e.golfers + e.nonGolfers
}

export function formatArrival(iso: string | null): string {
  if (!iso) return '—'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Trade enquiries from luxury travel advisors, golf specialists and incentive
 * planners. Kept separate from guest enquiries because the qualifying questions
 * and the reply are different — an advisor wants commission terms and a rate
 * sheet, not an itinerary.
 */
export type TradeEnquiry = {
  agency: string
  contact: string
  email: string
  market: string
  clientProfile: string
  notes: string
}

export const EMPTY_TRADE: TradeEnquiry = {
  agency: '',
  contact: '',
  email: '',
  market: '',
  clientProfile: '',
  notes: '',
}

export async function submitTradeEnquiry(t: TradeEnquiry): Promise<void> {
  // TODO(backend): same unwired endpoint as guest enquiries, tagged so the two
  // can be routed to different inboxes.
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: 'trade', ...t }),
  })
  if (!res.ok) throw new Error('Submission failed')
}

export async function submitEnquiry(e: Enquiry): Promise<void> {
  // TODO(backend): still unwired. Needs a host decision (Netlify/Vercel/
  // Cloudflare function) plus an email forward and a CRM hand-off — the plan
  // names HubSpot. Fails loudly rather than silently losing a lead worth five
  // figures.
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(e),
  })
  if (!res.ok) throw new Error('Submission failed')
}
