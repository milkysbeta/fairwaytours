export type Course = {
  id: string
  name: string
  region: 'Wanaka' | 'Queenstown' | 'Arrowtown'
  /** Straight-line drive time from central Wanaka, in minutes. Used by the estimator. */
  driveMinutesFromWanaka: number
  par: number | null
  /** Metres off the back tees. Null until confirmed with the course. */
  lengthMetres: number | null
  /** Indicative green fee in NZD. TODO(client): confirm current season rates. */
  greenFeeNzd: number | null
  tier: 'championship' | 'classic'
  blurb: string
  signature: string
  image: string
}

/**
 * TODO(client): every `null` and every `greenFeeNzd` needs confirming with
 * Jacob before launch — these are placeholders so the UI can be built out.
 */
export const COURSES: Course[] = [
  {
    id: 'wanaka',
    name: 'Wanaka Golf Club',
    region: 'Wanaka',
    driveMinutesFromWanaka: 5,
    par: 72,
    lengthMetres: 5915,
    greenFeeNzd: null,
    tier: 'classic',
    blurb:
      'The home course. Rolling, generous fairways under the Southern Alps, and the friendliest first tee in the country.',
    signature: 'Mount Aspiring framed dead-centre on the back nine.',
    image: '/media/courses/wanaka.jpg',
  },
  {
    id: 'millbrook',
    name: 'Millbrook Resort',
    region: 'Arrowtown',
    driveMinutesFromWanaka: 60,
    par: 72,
    lengthMetres: 6106,
    greenFeeNzd: null,
    tier: 'championship',
    blurb:
      'Twenty-seven holes threaded through an old farm basin, ringed by the Remarkables. Resort golf at its most polished.',
    signature: 'The Coronet nine, with lunch at the clubhouse afterwards.',
    image: '/media/courses/millbrook.jpg',
  },
  {
    id: 'the-hills',
    name: 'The Hills',
    region: 'Arrowtown',
    driveMinutesFromWanaka: 62,
    par: 72,
    lengthMetres: 6413,
    greenFeeNzd: null,
    tier: 'championship',
    blurb:
      'Private, sculptural, and studded with monumental art. One of the most photographed golf courses in the Southern Hemisphere.',
    signature: 'Playing through a working sculpture park at golden hour.',
    image: '/media/courses/the-hills.jpg',
  },
  {
    id: 'jacks-point',
    name: 'Jacks Point',
    region: 'Queenstown',
    driveMinutesFromWanaka: 75,
    par: 72,
    lengthMetres: 6208,
    greenFeeNzd: null,
    tier: 'championship',
    blurb:
      'Cut between schist outcrops and the shoreline of Lake Wakatipu, with the Remarkables rising straight off the fairway.',
    signature: 'The lakeside stretch — bring a camera, not just a card.',
    image: '/media/courses/jacks-point.jpg',
  },
  {
    id: 'arrowtown',
    name: 'Arrowtown Golf Club',
    region: 'Arrowtown',
    driveMinutesFromWanaka: 58,
    par: 71,
    lengthMetres: 5486,
    greenFeeNzd: null,
    tier: 'classic',
    blurb:
      'Old gold-mining country turned into tight, characterful golf. Pure fun, and a short walk from the best pub lunch in the region.',
    signature: 'Autumn, when the whole valley turns copper.',
    image: '/media/courses/arrowtown.jpg',
  },
]

export const courseById = (id: string) => COURSES.find((c) => c.id === id)
