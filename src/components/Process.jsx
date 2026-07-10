import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/*
 * Processo em passos ordenados. A numeração 01→04 é informação (é uma
 * sequência real de entrega), não enfeite. Uma linha conecta os nós losango
 * no desktop pra reforçar a ideia de fluxo. Vertical no mobile.
 *
 * Props: eyebrow, title, lead, steps[{ n, title, text, meta }]
 */
export default function Process({ eyebrow, title, lead, steps }) {
  const reduce = useReducedMotion()

  return (
    <section className="relative border-t border-line py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead center solo eyebrow={eyebrow} title={title} lead={lead} />

        <motion.ol
          className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {/* espinha conectora (só no desktop) */}
          <span
            aria-hidden="true"
            className="absolute left-8 right-8 top-[30px] hidden h-px bg-line lg:block"
          />

          {steps.map((step) => (
            <motion.li
              key={step.n}
              variants={fadeUp}
              className="relative flex flex-col border border-line bg-panel p-7"
            >
              {/* nó losango + número */}
              <div className="mb-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="shadow-glow-sm h-[14px] w-[14px] flex-none rotate-45 border border-blood bg-ink"
                />
                <span className="font-display text-[40px] font-black leading-[0.7] text-transparent [-webkit-text-stroke:1.2px_#E10600]">
                  {step.n}
                </span>
              </div>

              <h3 className="font-display mb-2 text-[22px] font-bold leading-tight">{step.title}</h3>
              <p className="text-[14px] text-ash">{step.text}</p>

              {step.meta && (
                <span className="font-util mt-5 inline-block border-t border-line pt-4 text-[11px] uppercase tracking-[0.14em] text-faint">
                  {step.meta}
                </span>
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
