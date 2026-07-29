/**
 * The margin layer. Golf is the anchor; these are what turn a golf trip into a
 * journey — and, per the plan, where the concierge upsell actually lives.
 *
 * TODO(client): every one of these needs a named supplier and a trade rate
 * before it can be sold. Listed here because the enquiry flow uses them to read
 * intent, not because they are contracted yet.
 */
export type Experience = {
  id: string
  label: string
  category: 'Air' | 'Table' | 'Water' | 'Land' | 'Stillness'
  blurb: string
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'heli-golf',
    label: 'Heli-golf',
    category: 'Air',
    blurb: 'Lift off the course and onto a tee no one else can reach. The day people talk about.',
  },
  {
    id: 'milford',
    label: 'Milford Sound by air',
    category: 'Air',
    blurb: 'Over the Southern Alps, landing on the sound, back in time for dinner.',
  },
  {
    id: 'wine',
    label: 'Central Otago cellar doors',
    category: 'Table',
    blurb: 'Pinot noir at the source, hosted by the people who make it.',
  },
  {
    id: 'private-chef',
    label: 'Private chef',
    category: 'Table',
    blurb: 'A long table at the villa, and nowhere to be afterwards.',
  },
  {
    id: 'whisky',
    label: 'Whisky tasting',
    category: 'Table',
    blurb: 'A private flight of rare New Zealand and Scottish bottlings.',
  },
  {
    id: 'fly-fishing',
    label: 'Fly fishing',
    category: 'Water',
    blurb: 'Sight-fishing gin-clear back-country rivers with a guide who knows every pool.',
  },
  {
    id: 'lake-cruise',
    label: 'Private lake charter',
    category: 'Water',
    blurb: 'Wakatipu or Wānaka from the water, with the boat to yourselves.',
  },
  {
    id: 'hunting',
    label: 'High-country hunting',
    category: 'Land',
    blurb: 'Guided stalks on private stations. Arranged by season and by request.',
  },
  {
    id: 'spa',
    label: 'Spa & recovery',
    category: 'Stillness',
    blurb: 'Booked for the afternoon of the round that took something out of you.',
  },
]

export const experienceById = (id: string) => EXPERIENCES.find((e) => e.id === id)
