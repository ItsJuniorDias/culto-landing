import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { voices } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

export default function Voices() {
  const reduce = useReducedMotion()

  return (
    <section id="voices" className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          eyebrow="Quem usa"
          title={
            <>
              18 mil criadores já
              <br />
              economizam horas por job.
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
          {voices.map((v) => (
            <motion.figure
              key={v.name}
              variants={fadeUp}
              className="flex flex-col gap-[18px] border border-line bg-panel p-[30px]"
            >
              <div className="text-[15px] tracking-[4px] text-blood" aria-label="5 de 5 estrelas">
                ★★★★★
              </div>
              <blockquote className="text-[15px] leading-relaxed">“{v.text}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[42px] w-[42px] flex-none border border-line"
                  style={{ background: v.av }}
                />
                <div>
                  <div className="font-display text-base font-bold">{v.name}</div>
                  <div className="font-util text-[11px] uppercase tracking-[0.1em] text-faint">
                    {v.role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
