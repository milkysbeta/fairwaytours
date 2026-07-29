import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HERO_SEQUENCE } from '@/data/hero'
import { SITE } from '@/data/site'

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [hasVideo, setHasVideo] = useState(true)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The film sinks and blurs away as the page scrolls over it.
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  const segment = HERO_SEQUENCE[index]

  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % HERO_SEQUENCE.length),
      segment.hold * 1000,
    )
    return () => clearTimeout(timer)
  }, [index, segment.hold])

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y: mediaY, scale: mediaScale }} className="absolute inset-0">
        {/* Poster gradient. Always rendered — it is the fallback when footage is
            missing, and the backdrop the clips sit on while they crossfade. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,var(--color-pine-700),var(--color-pine-950)_70%)]" />

        {hasVideo && (
          <AnimatePresence mode="sync">
            <motion.video
              key={segment.id}
              src={segment.src}
              autoPlay
              muted
              playsInline
              loop
              onError={() => setHasVideo(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/60 via-pine-950/25 to-pine-950" />
      </motion.div>

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="container-page relative flex h-full flex-col justify-end pb-24 md:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow"
        >
          {SITE.base.label}
        </motion.p>

        <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] text-bone-50">
          Golf, driven
          <br />
          properly.
        </h1>

        {/* Copy line crossfades with its clip. */}
        <div className="mt-8 h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={segment.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-bone-200"
            >
              {segment.line}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/enquire"
            className="rounded-full bg-bone-50 px-7 py-3.5 text-sm font-medium text-pine-950 transition-transform duration-300 hover:scale-[1.03]"
          >
            Plan your round
          </Link>
          <a
            href="#services"
            className="rounded-full border border-bone-100/20 px-7 py-3.5 text-sm text-bone-100 transition-colors duration-300 hover:border-bone-100/50"
          >
            How it works
          </a>
        </div>
      </motion.div>

      {/* Segment progress ticks. */}
      <div className="absolute bottom-8 right-6 z-10 flex gap-2 md:right-10">
        {HERO_SEQUENCE.map((s, i) => (
          <span
            key={s.id}
            className={`h-px w-8 transition-all duration-500 ${
              i === index ? 'bg-fairway-400' : 'bg-bone-100/20'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
