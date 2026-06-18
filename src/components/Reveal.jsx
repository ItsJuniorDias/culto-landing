import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../lib/motion'

/**
 * Scroll-triggered reveal built on Framer Motion's `whileInView`.
 * - Respects prefers-reduced-motion (renders a plain element, no transform).
 * - `delay` feeds the variant's `custom` so timing stays in the variant.
 * - `as` picks the motion element ("div", "section", "li", ...).
 *
 * For grids, prefer wrapping the container in a motion element with
 * `staggerContainer` and giving each child `variants={fadeUp}` instead.
 */
export default function Reveal({
  children,
  as = 'div',
  variants = fadeUp,
  delay = 0,
  className,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduce) {
    const Plain = as
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Tag>
  )
}
