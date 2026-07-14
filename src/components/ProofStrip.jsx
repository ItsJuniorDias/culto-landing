import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/*
 * Faixa de quebra de objeção (risk reversal) das telas de serviço.
 *
 * POR QUE EXISTE: serviço de encomenda vende por CONFIANÇA. Como você é estúdio
 * solo (sem centenas de reviews), a alavanca honesta não é encher de depoimento
 * falso — é remover o medo de pedir orçamento com garantias REAIS: nota fiscal,
 * pagamento em duas partes, você dono de tudo, resposta direta. Cada item aqui é
 * verdadeiro e some com um motivo pra pessoa não te chamar.
 *
 * Props: items → [{ t, d }]
 */
export default function ProofStrip({ items }) {
  const reduce = useReducedMotion()

  return (
    <section className="relative border-t border-line py-[54px] md:py-[68px]">
      <div className="mx-auto max-w-wrap px-6">
        <motion.ul
          className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4"
          variants={staggerContainer(0.08)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {items.map((it) => (
            <motion.li
              key={it.t}
              variants={fadeUp}
              className="flex flex-col gap-2 bg-ink p-6"
            >
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] rotate-45 bg-blood"
              />
              <div className="font-display mt-1 text-[19px] font-extrabold leading-tight text-bone">
                {it.t}
              </div>
              <div className="text-[13px] leading-snug text-ash">{it.d}</div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
