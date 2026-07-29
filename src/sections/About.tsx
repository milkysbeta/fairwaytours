import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SITE } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" ref={ref} className="relative py-28 md:py-40">
      <div className="container-page grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-bone-100/10">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_30%,var(--color-pine-700),var(--color-pine-950))]" />
            {/* TODO(client): portrait of Jacob — /media/jacob.jpg */}
            <motion.img
              src="/media/jacob.jpg"
              alt={SITE.guide.name}
              style={{ y: portraitY }}
              loading="lazy"
              className="absolute inset-0 h-[116%] w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-display text-2xl text-bone-50">{SITE.guide.name}</p>
              <p className="mt-1 text-sm text-fairway-400/80">{SITE.guide.role}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">Your guide</p>
            <h2 className="mt-4 text-4xl leading-[1.08] text-bone-50 md:text-5xl">
              The difference is who is driving.
            </h2>
          </Reveal>

          {/* TODO(client): final bio copy pending Jacob's own words. */}
          <Reveal delay={0.1}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-bone-400">
              <p>
                Jacob has spent years on these courses and the roads between them. He knows which
                tee to take when the nor'wester gets up, which table has the view, and how long the
                Crown Range really takes on a Sunday.
              </p>
              <p>
                What guests tend to mention afterwards is not the logistics. It is that the day
                worked — that a group of people who had never played together came off the
                eighteenth still talking.
              </p>
              <p>
                Every booking is handled personally. One number, one person, from the first message
                to the drop-off.
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
                  {SITE.guide.handicap ?? '—'}
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
