import { motion, useReducedMotion } from 'framer-motion'
import { compat } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

export default function Compat() {
  const reduce = useReducedMotion()

  return (
    <div className="border-b border-line bg-pit py-7">
      <motion.div
        className="mx-auto flex max-w-wrap flex-wrap items-center justify-center gap-x-[30px] gap-y-3 px-6"
        variants={reduce ? undefined : staggerContainer(0.06)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="font-util text-[11px] uppercase tracking-widest2 text-faint"
        >
          Compatível com
        </motion.span>
        {compat.map((app) => (
          <motion.span
            key={app}
            variants={reduce ? undefined : fadeUp}
            className="font-util text-[15px] font-semibold uppercase tracking-[0.04em] text-ash transition-colors hover:text-blood"
          >
            {app}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
