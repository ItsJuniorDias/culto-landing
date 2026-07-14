import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import { guarantees } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/*
 * Seção de confiança da home (id="voices" mantido pra não quebrar âncoras).
 * Era uma parede de depoimentos nominais; virou faixa de GARANTIAS reais —
 * cada card é uma promessa verificável que também aparece no FAQ. Mesma lógica
 * do ProofStrip dos serviços: em estúdio solo, garantia honesta converte mais
 * (e é mais segura) do que review que a pessoa desconfia.
 */
export default function Voices() {
  const reduce = useReducedMotion()

  return (
    <section id="voices" className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          eyebrow="Sem pegadinha"
          title={
            <>
              Comprou, é seu.
              <br />
              Sem letra miúda.
            </>
          }
          lead="Nada de mensalidade, marca d'água ou surpresa no checkout. As regras são estas três — e valem pra todo pack."
        />

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {guarantees.map((g) => (
            <motion.article
              key={g.title}
              variants={fadeUp}
              className="group relative flex flex-col gap-[18px] overflow-hidden border border-line bg-panel p-[30px] transition-colors hover:border-blood hover:bg-panel-2"
            >
              {/* barra de destaque que preenche no hover (assinatura do site) */}
              <span className="absolute left-0 top-0 h-[3px] w-0 bg-blood transition-[width] duration-500 group-hover:w-full" />

              <div className="flex items-center justify-between gap-3">
                {/* selo tipo checkmark */}
                <span
                  aria-hidden="true"
                  className="grid h-[38px] w-[38px] flex-none place-items-center border border-blood/40 bg-blood/10"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-blood" strokeWidth={2}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-util border border-line bg-ink/60 px-2.5 py-[5px] text-[10px] uppercase tracking-[0.12em] text-blood">
                  {g.tag}
                </span>
              </div>

              <h3 className="font-display text-[23px] font-bold leading-tight">{g.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-ash">{g.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
