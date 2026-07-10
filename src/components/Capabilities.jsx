import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { Halftone } from './Decor'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/* Tique blood padrão do site. */
const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px] flex-none fill-none stroke-blood"
    strokeWidth="2.6"
  >
    <path d="M4 12l5 5L20 6" />
  </svg>
)

/*
 * Grade de capacidades/benefícios. Um item = título + descrição curta, com um
 * tique blood. Usada pra listar o que entra em todo projeto de site.
 *
 * Props: eyebrow, title, lead, items[{ t, d }], withTexture?
 */
export default function Capabilities({ eyebrow, title, lead, items, withTexture = false }) {
  const reduce = useReducedMotion()

  return (
    <section className="relative border-t border-line py-[74px] md:py-[104px]">
      {withTexture && <Halftone className="opacity-30" />}

      <div className="relative mx-auto max-w-wrap px-6">
        <SectionHead center solo eyebrow={eyebrow} title={title} lead={lead} />

        <motion.div
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3"
          variants={staggerContainer(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {items.map((it) => (
            <motion.div
              key={it.t}
              variants={fadeUp}
              className="flex gap-4 border border-line bg-panel p-6 transition-colors hover:border-blood hover:bg-panel-2"
            >
              <Check />
              <div>
                <h3 className="font-display text-[19px] font-bold leading-tight">{it.t}</h3>
                <p className="mt-1.5 text-[14px] text-ash">{it.d}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
