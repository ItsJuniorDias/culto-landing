import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal'
import Eyebrow from './Eyebrow'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'
import { screens } from '../data/screens'

/* Descrições um pouco mais "vendedoras" pra ponte entre telas. */
const pitch = {
  packs: {
    kind: 'Loja de assets',
    line: '2.300+ assets prontos: LUTs, mockups, transições, fontes e SFX. Baixe e entregue mais rápido.',
    cta: 'Ver os packs',
  },
  sites: {
    kind: 'Sob encomenda',
    line: 'Sites desenhados e codados do zero pra sua marca. Animação de estúdio e performance de verdade.',
    cta: 'Ver criação de sites',
  },
  motion: {
    kind: 'Sob encomenda',
    line: 'Vídeo e motion feitos à mão: do reels vertical ao explainer, com trilha, som e color no capricho.',
    cta: 'Ver vídeo & motion',
  },
}

/*
 * Faixa de navegação cruzada acima do rodapé. Mostra as DUAS telas que não são
 * a atual (`current`), pra o visitante pular entre loja e serviços sem caçar no
 * menu. Cada card leva à rota da oferta.
 */
export default function ServicesCrossLink({ current }) {
  const reduce = useReducedMotion()
  const others = screens.filter((s) => s.key !== current)

  return (
    <section className="relative border-t border-line py-[64px] md:py-[84px]">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal className="mb-10 text-center">
          <div className="flex justify-center">
            <Eyebrow>Explore o resto</Eyebrow>
          </div>
          <h2
            className="font-display mx-auto mt-4 max-w-[18ch] font-extrabold leading-[0.98]"
            style={{ fontSize: 'clamp(28px,4vw,44px)' }}
          >
            Tem mais de um jeito de te ajudar.
          </h2>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {others.map((s) => {
            const p = pitch[s.key]
            return (
              <motion.div key={s.key} variants={fadeUp}>
                <Link
                  to={s.to}
                  className="group relative flex h-full flex-col overflow-hidden border border-line bg-panel p-8 transition-colors hover:border-blood hover:bg-panel-2"
                >
                  {/* barra de destaque que preenche no hover (assinatura do site) */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 z-10 h-[3px] w-0 bg-blood transition-[width] duration-500 group-hover:w-full"
                  />

                  <span className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">
                    {p.kind}
                  </span>
                  <h3 className="font-display mt-2 text-[34px] font-extrabold leading-none transition-colors group-hover:text-blood-2">
                    {s.label}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-[14.5px] text-ash">{p.line}</p>

                  <span className="font-util mt-7 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-bone">
                    {p.cta}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
