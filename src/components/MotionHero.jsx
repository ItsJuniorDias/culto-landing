import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import Button from './Button'
import { Halftone } from './Decor'
import { EASE } from '../lib/motion'
import { motionHero } from '../data/screens'
import { waLink } from '../data/content'
import { fireLead } from '../lib/leads'

/* Barrinhas de waveform pra trilha de áudio — alturas pseudo-aleatórias mas
   estáveis (memo) pra não "tremer" a cada render. */
function Waveform() {
  const bars = useMemo(
    () => Array.from({ length: 72 }, (_, i) => 24 + Math.abs(Math.sin(i * 1.7)) * 62),
    [],
  )
  return (
    <div className="flex h-full w-full items-center gap-[2px] px-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[2px] flex-1 bg-blood/60"
          style={{ height: `${h}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/* Assinatura da tela de motion: uma timeline de editor com trilhas empilhadas
   (vídeo, texto, áudio) e um playhead em losango varrendo em loop. Sob
   prefers-reduced-motion o playhead fica parado no meio. */
function EditorTimeline() {
  const reduce = useReducedMotion()

  return (
    <div className="relative overflow-hidden border border-line bg-panel shadow-featured">
      {/* régua de tempo */}
      <div className="relative flex items-center justify-between border-b border-line bg-panel-2 px-4 py-2.5">
        <span className="font-util text-[10px] uppercase tracking-[0.16em] text-faint">
          Timeline · 00:00
        </span>
        <span className="font-util flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-blood">
          <span aria-hidden="true" className="h-[6px] w-[6px] animate-pulse bg-blood" />
          Render 4K · 60fps
        </span>
      </div>

      <div className="relative px-4 py-5">
        {/* ticks da régua */}
        <div aria-hidden="true" className="mb-3 flex justify-between px-[2px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-[7px] w-px bg-faint/40" />
          ))}
        </div>

        {/* trilhas */}
        <div className="space-y-2.5">
          {motionHero.tracks.map((track, ti) => (
            <div key={track.label} className="flex items-center gap-3">
              <span className="font-util w-[74px] flex-none text-[9.5px] uppercase tracking-[0.1em] text-faint">
                {track.label}
              </span>
              <div className="relative h-[30px] flex-1 overflow-hidden border border-line bg-ink/60">
                {track.kind === 'wave' ? (
                  <Waveform />
                ) : (
                  track.segs.map(([start, end], si) => (
                    <motion.span
                      key={si}
                      className={`absolute inset-y-[3px] border ${
                        (ti + si) % 2 === 0
                          ? 'border-blood/50 bg-blood/25'
                          : 'border-line bg-panel-2'
                      }`}
                      style={{ left: `${start}%`, width: `${end - start}%`, originX: 0 }}
                      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                      animate={reduce ? undefined : { scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                        delay: 0.4 + ti * 0.12 + si * 0.08,
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* playhead varrendo (losango + linha) */}
        <Playhead reduce={reduce} />
      </div>
    </div>
  )
}

/* Playhead posicionado sobre a área das trilhas. Anima `left` de ~0 a 100%
   da área útil, em loop suave. */
function Playhead({ reduce }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 top-[46px] z-20"
      initial={reduce ? false : { left: '90px' }}
      animate={reduce ? { left: '52%' } : { left: ['90px', 'calc(100% - 22px)'] }}
      transition={
        reduce
          ? undefined
          : { duration: 4.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
      }
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-blood/80" />
      <span className="shadow-glow-sm absolute -top-[6px] left-1/2 h-[11px] w-[11px] -translate-x-1/2 rotate-45 bg-blood" />
    </motion.div>
  )
}

export default function MotionHero() {
  const reduce = useReducedMotion()
  const s = motionHero

  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        }

  return (
    <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(120%_90%_at_50%_14%,#17141b_0%,#08080A_62%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Halftone />
      </div>

      <div className="relative z-[2] mx-auto max-w-[880px] px-6 pb-[70px] pt-[76px] text-center md:pb-[92px] md:pt-[100px]">
        <motion.div {...rise(0.1)} className="flex justify-center">
          <Eyebrow>{s.eyebrow}</Eyebrow>
        </motion.div>

        <h1
          className="font-display mt-[22px] font-black leading-[0.88]"
          style={{ fontSize: 'clamp(48px,9vw,120px)' }}
        >
          {s.titleLines.map((line, i) => (
            <motion.span key={line} {...rise(0.2 + i * 0.1)} className="block">
              {i === 1 ? (
                <span className="relative inline-block px-[0.1em]">
                  <motion.span
                    aria-hidden="true"
                    className="shadow-glow absolute inset-y-[14%] -inset-x-[2%] -z-10 bg-blood"
                    style={{ originX: 0, rotate: -1.5 }}
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={reduce ? undefined : { scaleX: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
                  />
                  {line}
                </span>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p {...rise(0.44)} className="mx-auto mt-7 max-w-[52ch] text-[18px] text-ash">
          {s.lead}
        </motion.p>

        <motion.div {...rise(0.54)} className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Button href={waLink(s.primary.quote, s.whatsapp)} target="_blank" rel="noopener noreferrer" onClick={() => fireLead({ service: 'motion' })}>
            {s.primary.label} ↗
          </Button>
          <Button href={s.secondary.href} variant="ghost">
            {s.secondary.label}
          </Button>
        </motion.div>
      </div>

      {/* timeline (assinatura) — full-width, logo abaixo do título */}
      <motion.div
        className="relative z-[2] mx-auto max-w-[1000px] px-6 pb-[76px] md:pb-[104px]"
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
      >
        <EditorTimeline />
      </motion.div>
    </section>
  )
}
