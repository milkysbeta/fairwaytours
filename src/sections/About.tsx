import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SITE } from '@/data/site'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/asset'

export function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" ref={ref} className="relative py-24 md:py-32">
      <div className="container-page grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-bone-100/10">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_30%,var(--color-pine-700),var(--color-pine-950))]" />
            {/* TODO(client): portrait of Jacob — /media/jacob.jpg */}
            <motion.img
              src={asset("/media/jacob.jpg")}
              alt={SITE.founder.name}
              style={{ y: portraitY }}
              loading="lazy"
              className="absolute inset-0 h-[116%] w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-display text-2xl text-bone-50">{SITE.founder.name}</p>
              <p className="mt-1 text-sm text-fairway-400/80">{SITE.founder.role}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">Your host</p>
            <h2 className="mt-4 text-4xl leading-[1.08] text-bone-50 md:text-5xl">
              Anyone can book a tee time.
            </h2>
          </Reveal>

          {/* TODO(client): final bio copy pending Jacob's own words. */}
          <Reveal delay={0.1}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-bone-400">
              <p>
                Very few can get you onto The Hills at short notice, hold a table in Arrowtown in
                February, or find a helicopter on a Sunday morning. That is not a booking system. It
                is years of living here and knowing the people who say yes.
              </p>
              <p>
                Jacob hosts every journey himself. One person, one number, from the first enquiry to
                the moment your clubs are checked in for the flight home.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-bone-100/10 pt-8">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                  Handicap
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-bone-50">
                  {SITE.founder.handicap ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                  Based in
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-bone-50">Wanaka</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-bone-400/60">
                  Courses
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-bone-50">5+</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
