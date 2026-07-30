import { Hero } from '@/sections/Hero'
import { Journeys } from '@/sections/Journeys'
import { Itinerary } from '@/sections/Itinerary'
import { Courses } from '@/sections/Courses'
import { Experiences } from '@/sections/Experiences'
import { Stays } from '@/sections/Stays'
import { Conditions } from '@/sections/Conditions'
import { About } from '@/sections/About'
import { GrassDivider } from '@/components/GrassDivider'

/**
 * The order is the argument: what it is (journeys) → what it feels like (the
 * five days) → the access (courses) → what surrounds it (experiences, stays) →
 * when to come → who is behind it.
 *
 * The grass dividers bracket the white calendar spread — turf cutting down into
 * paper on the way in, and back up out of it on the way out.
 */
export function Home() {
  return (
    <main>
      <Hero />
      <Journeys />
      <Itinerary />
      <Courses />
      <Experiences />
      <Stays />
      <GrassDivider below="#ffffff" />
      <Conditions />
      <GrassDivider below="#ffffff" flip />
      <About />
    </main>
  )
}
