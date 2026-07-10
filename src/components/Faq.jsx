import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import { faqs } from '../data/content'
import { EASE } from '../lib/motion'

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const reduce = useReducedMotion()

  return (
    <Reveal as="div" className="mb-3 border border-line bg-panel">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-[26px] py-6 text-left"
      >
        <span className="font-display text-[21px] font-semibold">{q}</span>
        <motion.span
          aria-hidden="true"
          animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="font-util flex-none text-[26px] leading-none text-blood"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-[26px] pb-6 text-[15px] text-ash">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  )
}

/*
 * Acordeão de dúvidas. Reusável entre as telas: cada uma passa seus próprios
 * `items` e cabeçalho. Sem props, cai no FAQ da loja (retrocompatível).
 */
export default function Faq({
  items = faqs,
  eyebrow = 'Dúvidas frequentes',
  title = (
    <>
      O que saber antes
      <br />
      de comprar.
    </>
  ),
  center = false,
}) {
  return (
    <section id="faq" className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead center={center} eyebrow={eyebrow} title={title} />
        <div className={`max-w-[800px] ${center ? 'mx-auto' : ''}`}>
          {items.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
