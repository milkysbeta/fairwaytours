import { Hero } from '@/sections/Hero'
import { Services } from '@/sections/Services'
import { Courses } from '@/sections/Courses'
import { Packages } from '@/sections/Packages'
import { Conditions } from '@/sections/Conditions'
import { About } from '@/sections/About'

export function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Courses />
      <Packages />
      <Conditions />
      <About />
    </main>
  )
}
