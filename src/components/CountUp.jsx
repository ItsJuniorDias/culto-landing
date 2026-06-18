import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion'

/**
 * A number that counts up from `from` to `to` the first time it scrolls
 * into view. Built on Framer Motion's `animate()` so it shares the site's
 * signature easing curve and respects prefers-reduced-motion.
 *
 * Formatting is pt-BR aware: pass `separator="."` for thousands grouping
 * and `decimals={1}` to render a comma decimal (4.9 -> "4,9"). `prefix`
 * and `suffix` stay fixed while the digits animate, so "2.300+" counts up
 * with the "+" pinned in place.
 *
 * Updates are written straight to the DOM node (no per-frame React render),
 * which keeps a grid of counters cheap to animate.
 *
 * @param {number}  to          Target value.
 * @param {number}  from        Starting value (default 0).
 * @param {number}  decimals    Decimal places (default 0).
 * @param {string}  separator   Thousands separator, e.g. "." (default none).
 * @param {string}  prefix      Text kept before the number.
 * @param {string}  suffix      Text kept after the number.
 * @param {number}  duration    Animation length in seconds (default 1.6).
 * @param {number}  delay       Seconds to wait before counting (default 0).
 */
export default function CountUp({
  to,
  from = 0,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  duration = 1.6,
  delay = 0,
  className,
  ...rest
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()

  const render = (value) => {
    const fixed = Math.abs(value).toFixed(decimals)
    let [int, dec] = fixed.split('.')
    if (separator) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    const body = dec ? `${int},${dec}` : int
    return `${prefix}${value < 0 ? '-' : ''}${body}${suffix}`
  }

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reduce || !inView) {
      // Show the final value under reduced motion; otherwise hold the start
      // value until the element is actually in view.
      node.textContent = render(reduce ? to : from)
      return
    }

    const controls = animate(from, to, {
      duration,
      delay,
      ease: EASE,
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = render(value)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, from, reduce])

  // Initial paint matches the effect's first frame, so there's no flash
  // of an empty span before the effect runs.
  return (
    <span ref={ref} className={className} {...rest}>
      {render(reduce ? to : from)}
    </span>
  )
}
