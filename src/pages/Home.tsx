import { Hero } from '@/sections/Hero'
import { Journeys } from '@/sections/Journeys'
import { Itinerary } from '@/sections/Itinerary'
import { Courses } from '@/sections/Courses'
import { Experiences } from '@/sections/Experiences'
import { Stays } from '@/sections/Stays'
import { Seasons } from '@/sections/Seasons'
import { About } from '@/sections/About'

/**
 * The order is the argument: what it is (journeys) → what it feels like (the
 * five days) → the access (courses) → what surrounds it (experiences, stays) →
 * when to come → who is behind it.
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
      <Seasons />
      <About />
    </main>
  )
}
