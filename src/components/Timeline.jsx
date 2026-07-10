import { motion, useReducedMotion } from 'framer-motion'
import { viewportOnce } from '../lib/motion'

/*
 * Barra de timeline com playhead em losango. O comprimento preenchido codifica
 * a duração/porte do plano — é informação, não enfeite: Social mal preenche,
 * Campanha preenche a trilha inteira. O losango ecoa o motivo do site.
 * Extraído pra ser reusado entre os cards de plano e a tela de motion.
 */
export default function Timeline({ fill = 0.5, label = 'Timeline' }) {
  const reduce = useReducedMotion()
  const pct = `${Math.round(fill * 100)}%`

  return (
    <div className="mb-6">
      <div className="font-util mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-blood" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        {label}
      </div>

      <div className="relative h-[6px] w-full bg-[#201E27]">
        {/* marcas de 1/4 */}
        {[0.25, 0.5, 0.75].map((t) => (
          <span
            key={t}
            aria-hidden="true"
            className="absolute top-[-3px] h-[12px] w-px bg-faint/40"
            style={{ left: `${t * 100}%` }}
          />
        ))}

        {/* trecho preenchido */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-blood"
          initial={reduce ? false : { width: 0 }}
          whileInView={reduce ? undefined : { width: pct }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={reduce ? { width: pct } : undefined}
        />

        {/* playhead losango */}
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
