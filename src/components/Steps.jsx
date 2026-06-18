import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { steps } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

export default function Steps() {
  const reduce = useReducedMotion()

  return (
    <section className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          eyebrow="Como funciona"
          title={
            <>
              Do pagamento ao render
              <br />
              em três passos.
            </>
          }
        />

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {steps.map((s) => (
            <motion.div key={s.n} variants={fadeUp} className="border border-line bg-panel px-7 py-8">
              <span className="font-display mb-3.5 block text-[54px] font-black leading-[0.8] text-transparent [-webkit-text-stroke:1.3px_#E10600]">
                {s.n}
              </span>
              <h3 className="font-display mb-2.5 text-2xl font-bold">{s.title}</h3>
              <p className="text-[14.5px] text-ash">{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
