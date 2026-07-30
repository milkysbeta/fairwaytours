import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * The transition between a dark section and a light one.
 *
 * `cut-grass.png` is turf whose lower edge breaks into blades and then into
 * transparency, so the light section beneath shows through the cut. Two copies
 * drift at different rates on scroll, which gives the edge depth — the near
 * layer travels further than the far one, the way real ground does.
 *
 * TODO(client): the current PNG is a generated stand-in. Replace it with
 * cut-grass.png from the project image folder; same alpha shape, same filename.
 */
const GRASS = '/media/cut-grass.png'

type Props = {
  /** Colour of the section beneath, which the cut reveals. */
  below?: string
  /** Flip for a light-to-dark transition. */
  flip?: boolean
  className?: string
}

export function GrassDivider({ below = '#ffffff', flip = false, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Far layer barely moves; near layer travels, and scales a touch as it goes.
  const farY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])
  const nearY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-18%', '14%'])
  const nearScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1.14])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none relative h-40 w-full overflow-hidden select-none md:h-56 ${className}`}
      style={{ backgroundColor: below, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <motion.img
        src={GRASS}
        alt=""
        style={{ y: farY }}
        className="absolute inset-x-0 top-0 h-full w-full scale-105 object-cover opacity-55"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <motion.img
        src={GRASS}
        alt=""
        style={{ y: nearY, scale: nearScale }}
        className="absolute inset-x-0 top-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />

      {/* Seals the join with the dark section above. The parallax layers travel,
          so without this a hairline of the section colour shows through. */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-pine-950 to-transparent" />
    </div>
  )
}
