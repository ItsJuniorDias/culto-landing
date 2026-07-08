import { motion, useReducedMotion } from 'framer-motion'
import Button from './Button'
import { fadeUp } from '../lib/motion'
import { waLink } from '../data/content'

/* Small check used across the feature lists (same language as the Packs card). */
const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="mt-[3px] h-[16px] w-[16px] flex-none fill-none stroke-blood"
    strokeWidth="2.6"
  >
    <path d="M4 12l5 5L20 6" />
  </svg>
)

/*
 * Bespoke-service tier card. Deliberately different from the product PackCard:
 *  - price is an "a partir de" figure (or plain text like "Sob consulta"),
 *    never a struck-through discount — these are custom quotes, not products.
 *  - a delivery/scope meta line sits under the price.
 *  - the CTA opens a pre-filled WhatsApp quote instead of a checkout.
 * `top` lets a section slot in its own signature (e.g. the motion timeline bar).
 */
export default function ServiceCard({ tier, top = null }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      variants={fadeUp}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative flex h-full flex-col border p-8 ${
        tier.featured
          ? 'shadow-featured order-first border-blood bg-[linear-gradient(180deg,#181014,#121116)] md:order-none'
          : 'border-line bg-panel'
      }`}
    >
      {tier.tag && (
        <span className="font-util absolute -right-px -top-px bg-blood px-3.5 py-[7px] text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
          {tier.tag}
        </span>
      )}

      {top}

      <span className="font-util text-xs uppercase tracking-[0.2em] text-blood">{tier.kind}</span>
      <h3 className="font-display mb-4 mt-2.5 text-[32px] font-extrabold leading-none">
        {tier.name}
      </h3>

      {/* Price block — "a partir de R$ X" or a text figure like "Sob consulta".
         The value sits in a fixed-height, bottom-aligned box so numeric and
         text prices leave the rows beneath them on the same baseline — that's
         what keeps a whole row of cards lined up. */}
      <div className="font-util mb-[3px] text-[11px] uppercase tracking-[0.16em] text-faint">
        {tier.from}
      </div>
      <div className="mb-1 flex min-h-[46px] items-end">
        {tier.isText ? (
          <span className="font-display text-[38px] font-black leading-[0.85]">{tier.price}</span>
        ) : (
          <span className="flex items-end gap-2">
            <span className="font-util mb-2 text-base text-ash">R$</span>
            <span className="font-display text-[52px] font-black leading-[0.8]">{tier.price}</span>
          </span>
        )}
      </div>

      {/* Delivery / scope line, marked with a small blood tick. min-height keeps
         a one- vs two-line scope from shifting the feature list out of step. */}
      <div className="font-util mb-[26px] mt-1 flex min-h-[30px] items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-faint">
        <span aria-hidden="true" className="h-[6px] w-[6px] flex-none rotate-45 bg-blood" />
        {tier.meta}
      </div>

      <ul className="mb-[30px] flex flex-col gap-[13px]">
        {tier.feats.map((f) => (
          <li key={f.t} className="flex gap-[11px] text-[14.5px]">
            <Check />
            {f.strong ? <strong>{f.t}</strong> : f.t}
          </li>
        ))}
      </ul>

      <Button
        href={waLink(tier.quote)}
        target="_blank"
        rel="noopener noreferrer"
        full
        variant={tier.ctaVariant}
        className="mt-auto"
      >
        Pedir orçamento ↗
      </Button>
    </motion.div>
  )
}
