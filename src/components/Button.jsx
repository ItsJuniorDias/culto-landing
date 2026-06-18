import { motion, useReducedMotion } from 'framer-motion'

/*
 * Poster-style button rendered as an <a>. Square corners, tracked-out caps.
 * Hover lifts + glows (primary) or shifts to red (ghost); tap settles down.
 */
const base =
  'font-util inline-flex items-center justify-center gap-2.5 whitespace-nowrap border px-[30px] py-[15px] text-sm font-semibold uppercase tracking-[0.14em] transition-colors'

const variants = {
  primary:
    'border-transparent bg-blood text-bone hover:bg-blood-2 hover:shadow-glow',
  ghost:
    'border-line bg-transparent text-bone hover:border-blood hover:text-blood',
}

export default function Button({
  children,
  href = '#',
  variant = 'primary',
  className = '',
  full = false,
  ...rest
}) {
  const reduce = useReducedMotion()

  return (
    <motion.a
      href={href}
      className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { y: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
