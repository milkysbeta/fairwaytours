import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

type Props = {
  children: ReactNode
  /**
   * Travel in pixels across the element's time on screen. Positive lags the
   * scroll, negative leads it. Keep it small — parallax reads as depth up to
   * roughly 60px and as a glitch beyond it.
   */
  distance?: number
  className?: string
}

/**
 * Wraps content in a scroll-linked vertical drift. Spring-smoothed so it settles
 * rather than tracking the wheel exactly, and disabled outright for anyone who
 * has asked for reduced motion.
 */
export function Parallax({ children, distance = 40, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const y = useSpring(raw, { stiffness: 80, damping: 26, restDelta: 0.5 })

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  )
}
