import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import ServiceCard from './ServiceCard'
import { motionTiers } from '../data/content'
import { staggerContainer, viewportOnce } from '../lib/motion'

/* Signature element: a scrubber whose filled length encodes the tier's video
   length / scope. It's information, not decoration — Social barely fills, a
   Campaign fills the whole track. The diamond playhead echoes the site's motif. */
function Timeline({ fill }) {
  const reduce = useReducedMotion()
  const pct = `${Math.round(fill * 100)}%`

  return (
    <div className="mb-6">
      <div className="font-util mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-blood" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Timeline
      </div>

      <div className="relative h-[6px] w-full bg-[#201E27]">
        {/* quarter ticks */}
        {[0.25, 0.5, 0.75].map((t) => (
          <span
            key={t}
            aria-hidden="true"
            className="absolute top-[-3px] h-[12px] w-px bg-faint/40"
            style={{ left: `${t * 100}%` }}
          />
        ))}

        {/* filled portion */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-blood"
          initial={reduce ? false : { width: 0 }}
          whileInView={reduce ? undefined : { width: pct }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={reduce ? { width: pct } : undefined}
        />

        {/* diamond playhead */}
        <motion.span
          aria-hidden="true"
          className="shadow-glow-sm absolute top-1/2 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blood"
          initial={reduce ? false : { left: 0 }}
          whileInView={reduce ? undefined : { left: pct }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={reduce ? { left: pct } : undefined}
        />
      </div>
    </div>
  )
}

export default function MotionService() {
  const reduce = useReducedMotion()

  return (
    <section id="motion" className="relative border-t border-line py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          center
          solo
          eyebrow="Vídeo & motion"
          title={
            <>
              Motion que
              <br />
              faz o feed parar.
            </>
          }
          lead="Do reels vertical ao explainer de produto: animação feita à mão em After Effects, com trilha, som e color no capricho. A partir de R$ 60 por segundo."
        />

        <motion.div
          className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {motionTiers.map((t) => (
            <ServiceCard key={t.id} tier={t} top={<Timeline fill={t.fill} />} />
          ))}
        </motion.div>

        <p className="font-util mt-8 text-center text-[11px] uppercase tracking-[0.14em] text-faint">
          Entrega em ProRes & H.264 · trilha licenciada · legendas inclusas
        </p>
      </div>
    </section>
  )
}
