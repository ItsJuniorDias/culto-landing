import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import Button from './Button'
import { Halftone, Rays, Burst } from './Decor'
import { EASE } from '../lib/motion'

const stats = [
  { num: '2.300+', lbl: 'Assets prontos' },
  { num: '18 mil', lbl: 'Criadores' },
  { num: '4,9★', lbl: 'Nota média' },
]

export default function Hero() {
  const reduce = useReducedMotion()

  // On-mount rise with a staggered delay. Returns {} under reduced motion.
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        }

  return (
    <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_18%,#19181d_0%,#08080A_62%)]">
      <Halftone />
      <Rays />
      <Burst pos="tl" />
      <Burst pos="tr" />
      <Burst pos="bl" />
      <Burst pos="br" />

      <div className="relative z-[2] mx-auto max-w-[920px] px-6 pb-[84px] pt-[96px] text-center">
        {/* Oversized outline word behind the title */}
        <span
          aria-hidden="true"
          className="font-display absolute left-1/2 top-[4%] z-0 -translate-x-1/2 select-none whitespace-nowrap font-bold leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(236,232,224,0.07)]"
          style={{ fontSize: 'clamp(60px,16vw,190px)' }}
        >
          assets
        </span>

        <motion.div {...rise(0.1)} className="mb-[26px]">
          <Eyebrow solo>2.300+ assets · licença comercial</Eyebrow>
        </motion.div>

        <h1
          className="font-display relative z-[2] font-black leading-[0.86]"
          style={{ fontSize: 'clamp(58px,14vw,150px)' }}
        >
          <motion.span {...rise(0.2)} className="block">
            Baixe
          </motion.span>
          <motion.span {...rise(0.32)} className="block">
            <span className="relative inline-block px-[0.12em] text-bone">
              <motion.span
                aria-hidden="true"
                className="shadow-glow absolute inset-y-[14%] -inset-x-[2%] -z-10 bg-blood"
                style={{ originX: 0, rotate: -1.5 }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
              />
              &amp;
            </span>{' '}
            Crie
          </motion.span>
        </h1>

        <motion.p
          {...rise(0.45)}
          className="relative z-[2] mx-auto mb-9 mt-[30px] max-w-[50ch] text-[18px] text-ash"
        >
          Packs prontos de design, vídeo e motion: LUTs, transições, mockups, fontes, SFX e
          templates de After Effects. Você baixa, arrasta e entrega — sem perder horas garimpando
          arquivo solto.
        </motion.p>

        <motion.div
          {...rise(0.55)}
          className="relative z-[2] flex flex-wrap justify-center gap-3.5"
        >
          <Button href="#packs">Comprar agora ↗</Button>
          <Button href="#inside" variant="ghost">
            Ver o catálogo
          </Button>
        </motion.div>

        <motion.div
          {...rise(0.7)}
          className="relative z-[2] mt-[54px] flex flex-wrap justify-center gap-x-12 gap-y-8 border-t border-line pt-[34px]"
        >
          {stats.map((s) => (
            <div key={s.lbl}>
              <div className="font-display text-[40px] font-extrabold leading-none">{s.num}</div>
              <div className="font-util mt-2 text-[11px] uppercase tracking-[0.2em] text-faint">
                {s.lbl}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
