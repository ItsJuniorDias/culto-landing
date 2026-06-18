import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

/*
 * Poster-style button. Renders as:
 *  - <Link>   when given `to`     (client-side navigation)
 *  - <button> when given `type` or as="button"
 *  - <a>      otherwise (in-page anchors, file downloads)
 */
const MotionLink = motion(Link)

const base =
  'font-util inline-flex items-center justify-center gap-2.5 whitespace-nowrap border px-[30px] py-[15px] text-sm font-semibold uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const styles = {
  primary: 'border-transparent bg-blood text-bone hover:bg-blood-2 hover:shadow-glow',
  ghost: 'border-line bg-transparent text-bone hover:border-blood hover:text-blood',
}

export default function Button({
  children,
  href,
  to,
  type,
  as,
  variant = 'primary',
  className = '',
  full = false,
  ...rest
}) {
  const reduce = useReducedMotion()
  const cls = `${base} ${styles[variant]} ${full ? 'w-full' : ''} ${className}`
  const motionProps = {
    className: cls,
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { y: 0, scale: 0.98 },
    transition: { duration: 0.15, ease: 'easeOut' },
    ...rest,
  }

  if (to) {
    return (
      <MotionLink to={to} {...motionProps}>
        {children}
      </MotionLink>
    )
  }

  if (as === 'button' || type) {
    return (
      <motion.button type={type || 'button'} {...motionProps}>
        {children}
      </motion.button>
    )
  }

  return (
    <motion.a href={href || '#'} {...motionProps}>
      {children}
    </motion.a>
  )
}
