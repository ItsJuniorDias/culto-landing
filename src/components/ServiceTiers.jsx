import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import ServiceCard from './ServiceCard'
import { staggerContainer, viewportOnce } from '../lib/motion'

/*
 * Grade de planos de serviço (Sites e Motion). Usa o ServiceCard existente —
 * mesma fonte de verdade de preços (siteTiers / motionTiers). `renderTop`
 * deixa a tela de motion injetar sua timeline no topo de cada card.
 *
 * Props: id, eyebrow, title, lead, tiers, foot, renderTop?(tier) => node
 */
export default function ServiceTiers({
  id = 'planos',
  eyebrow,
  title,
  lead,
  tiers,
  foot,
  renderTop,
}) {
  const reduce = useReducedMotion()

  return (
    <section id={id} className="relative border-t border-line py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead center solo eyebrow={eyebrow} title={title} lead={lead} />

        <motion.div
          className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {tiers.map((t) => (
            <ServiceCard key={t.id} tier={t} top={renderTop ? renderTop(t) : null} />
          ))}
        </motion.div>

        {foot && (
          <p className="font-util mt-8 text-center text-[11px] uppercase tracking-[0.14em] text-faint">
            {foot}
          </p>
        )}
      </div>
    </section>
  )
}
