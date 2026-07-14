import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import Button from './Button'
import { Halftone, Rays } from './Decor'
import { EASE } from '../lib/motion'
import { sitesHero } from '../data/screens'
import { waLink } from '../data/content'
import { fireLead } from '../lib/leads'

/* Assinatura da tela de sites: um navegador escuro, na identidade do Culto,
   cujos blocos "se montam" no load — um site construindo um site. Sob
   prefers-reduced-motion tudo aparece estático. */
function BrowserMock() {
  const reduce = useReducedMotion()

  // Sequência de montagem dos blocos internos.
  const block = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: EASE, delay },
        }

  return (
    <div className="relative overflow-hidden border border-line bg-panel shadow-featured">
      {/* barra que corre no topo (assinatura do site) */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 z-20 h-[3px] bg-blood"
        initial={reduce ? false : { width: 0 }}
        animate={reduce ? undefined : { width: '100%' }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        style={reduce ? { width: '100%' } : undefined}
      />

      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-panel-2 px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-faint/70" />
          <span className="h-[9px] w-[9px] rounded-full bg-faint/50" />
          <span className="h-[9px] w-[9px] rounded-full bg-faint/30" />
        </span>
        <span className="font-util ml-2 inline-flex items-center gap-2 rounded-sm border border-line bg-ink/60 px-3 py-1 text-[11px] tracking-[0.08em] text-ash">
          <span aria-hidden="true" className="h-[6px] w-[6px] bg-blood" />
          {sitesHero.mockUrl}
        </span>
      </div>

      {/* viewport = mini-site na cara do Culto */}
      <div className="relative aspect-[16/12] overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-10%,#17141b_0%,#0b0a0d_70%)] px-7 py-8">
        <Halftone className="opacity-30" />

        <div className="relative flex h-full flex-col">
          {/* nav fake */}
          <motion.div {...block(0.35)} className="mb-7 flex items-center justify-between">
            <span className="h-[9px] w-[64px] bg-bone/80" />
            <span className="flex gap-2">
              <span className="h-[7px] w-[26px] bg-ash/40" />
              <span className="h-[7px] w-[26px] bg-ash/40" />
              <span className="h-[7px] w-[34px] bg-blood" />
            </span>
          </motion.div>

          {/* headline com box-wipe (assinatura do Culto) */}
          <motion.div {...block(0.55)} className="mb-3">
            <div className="relative inline-block">
              <motion.span
                aria-hidden="true"
                className="shadow-glow absolute inset-y-[10%] -inset-x-[3%] -z-10 bg-blood"
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 1 }}
                style={{ originX: 0, rotate: -1.5, ...(reduce ? { scaleX: 1 } : {}) }}
              />
              <span className="font-display block text-[26px] font-black leading-[0.9] text-bone sm:text-[30px]">
                Sua marca
              </span>
            </div>
            <span className="font-display mt-1 block text-[26px] font-black leading-[0.9] text-bone sm:text-[30px]">
              no ar.
            </span>
          </motion.div>

          {/* linhas de texto */}
          <motion.div {...block(0.7)} className="mb-6 space-y-2">
            <span className="block h-[7px] w-[78%] bg-ash/25" />
            <span className="block h-[7px] w-[62%] bg-ash/20" />
          </motion.div>

          {/* botões fake */}
          <motion.div {...block(0.82)} className="mb-auto flex gap-2.5">
            <span className="h-[26px] w-[104px] bg-blood shadow-glow-sm" />
            <span className="h-[26px] w-[92px] border border-line" />
          </motion.div>

          {/* faixa de cards */}
          <motion.div {...block(0.95)} className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-[46px] border border-line bg-panel-2"
                style={{ borderTopColor: i === 1 ? '#E10600' : undefined }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SitesHero() {
  const reduce = useReducedMotion()
  const s = sitesHero

  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        }

  return (
    <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_16%,#17141b_0%,#08080A_60%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Halftone />
        <Rays frozen />
      </div>

      <div className="relative z-[2] mx-auto grid max-w-wrap items-center gap-12 px-6 pb-[80px] pt-[72px] md:grid-cols-[1fr_1.05fr] md:pb-[104px] md:pt-[96px]">
        {/* copy */}
        <div>
          <motion.div {...rise(0.1)}>
            <Eyebrow solo>{s.eyebrow}</Eyebrow>
          </motion.div>

          <h1
            className="font-display mt-[22px] font-black leading-[0.9]"
            style={{ fontSize: 'clamp(46px,7vw,88px)' }}
          >
            {s.titleLines.map((line, i) => (
              <motion.span key={line} {...rise(0.2 + i * 0.1)} className="block">
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p {...rise(0.42)} className="mt-6 max-w-[46ch] text-[17px] text-ash">
            {s.lead}
          </motion.p>

          <motion.div {...rise(0.54)} className="mt-8 flex flex-wrap gap-3.5">
            <Button href={waLink(s.primary.quote)} target="_blank" rel="noopener noreferrer" onClick={() => fireLead({ service: 'sites' })}>
              {s.primary.label} ↗
            </Button>
            <Button href={s.secondary.href} variant="ghost">
              {s.secondary.label}
            </Button>
          </motion.div>

          <motion.ul
            {...rise(0.64)}
            className="font-util mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-faint"
          >
            {s.trust.map((t, i) => (
              <li key={t} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden="true" className="h-[3px] w-[3px] bg-blood" />}
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* mock (assinatura) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        >
          <BrowserMock />
        </motion.div>
      </div>
    </section>
  )
}
