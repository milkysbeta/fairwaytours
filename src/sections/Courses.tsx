import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { COURSES, type Course } from '@/data/courses'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

function CourseCard({ course, index }: { course: Course; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Image drifts against the scroll — the parallax that carries this section.
  const imageY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <article
        ref={ref}
        className="group relative overflow-hidden rounded-2xl border border-bone-100/10 bg-pine-900/40"
      >
        <div className="relative h-72 overflow-hidden">
          <motion.img
            src={course.image}
            alt={course.name}
            loading="lazy"
            style={{ y: imageY }}
            className="absolute inset-0 h-[124%] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={(e) => {
              // No photography yet — hide the broken frame, keep the gradient.
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,var(--color-pine-950))]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_20%,var(--color-pine-700),var(--color-pine-950))]" />

          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="eyebrow">{course.region}</p>
            <h3 className="mt-2 text-3xl text-bone-50">{course.name}</h3>
          </div>

          {course.tier === 'championship' && (
            <span className="absolute right-6 top-6 rounded-full border border-brass-500/40 bg-pine-950/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-brass-400 backdrop-blur">
              Championship
            </span>
          )}
        </div>

        <div className="p-7 pt-6">
          <p className="text-sm leading-relaxed text-bone-400">{course.blurb}</p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-bone-100/10 pt-5 text-sm">
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">Par</dt>
              <dd className="mt-1 text-bone-100">{course.par ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                Length
              </dt>
              <dd className="mt-1 text-bone-100">
                {course.lengthMetres ? `${course.lengthMetres.toLocaleString()} m` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                From Wanaka
              </dt>
              <dd className="mt-1 text-bone-100">{course.driveMinutesFromWanaka} min</dd>
            </div>
          </dl>

          <p className="mt-5 text-sm italic text-fairway-400/80">{course.signature}</p>
        </div>
      </article>
    </Reveal>
  )
}

export function Courses() {
  return (
    <section id="courses" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="The access"
          title="Five courses. Two you cannot simply book."
          lede="Wānaka to Arrowtown to the shores of Wakatipu. The Hills is private and Jacks Point rations its visitor times — getting you onto them takes a relationship, not a booking form."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
