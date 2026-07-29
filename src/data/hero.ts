/**
 * The opening film. Each segment is a short clip that crossfades into the next,
 * with one line of copy timed to it.
 *
 * TODO(client): real footage pending (question 5). Drop files into
 * `public/media/hero/` using these filenames and they light up automatically —
 * until then the hero falls back to its gradient poster.
 */
export type HeroSegment = {
  id: string
  src: string
  /** Shown while the clip is on screen. */
  line: string
  /** Seconds this segment holds before crossfading. */
  hold: number
}

export const HERO_SEQUENCE: HeroSegment[] = [
  { id: 'arrival', src: '/media/hero/01-arrival.mp4', line: 'You land.', hold: 4.5 },
  { id: 'course', src: '/media/hero/02-course.mp4', line: 'We drive.', hold: 4.5 },
  { id: 'play', src: '/media/hero/03-play.mp4', line: 'You play.', hold: 4.5 },
  { id: 'table', src: '/media/hero/04-table.mp4', line: 'Dinner is already booked.', hold: 5 },
]
