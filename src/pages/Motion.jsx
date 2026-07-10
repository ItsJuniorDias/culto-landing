import { motion, useReducedMotion } from 'framer-motion'
import SiteHeader from '../components/SiteHeader'
import MotionHero from '../components/MotionHero'
import Reel from '../components/Reel'
import ServiceTiers from '../components/ServiceTiers'
import Timeline from '../components/Timeline'
import Process from '../components/Process'
import SectionHead from '../components/SectionHead'
import Faq from '../components/Faq'
import ServiceCta from '../components/ServiceCta'
import ServicesCrossLink from '../components/ServicesCrossLink'
import Footer from '../components/Footer'
import { motionTiers, waLink } from '../data/content'
import { motionProcess, motionDeliverables, motionFaqs, serviceCta } from '../data/screens'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/* Faixa de formatos de entrega — chips numa moldura escura. */
function Deliverables() {
  const reduce = useReducedMotion()
  return (
    <section className="relative border-t border-line py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          center
          solo
          eyebrow="Formatos de entrega"
          title={
            <>
              Um render,
              <br />
              todos os cortes.
            </>
          }
          lead="Você recebe a peça pronta pra cada canal — proporção, codec e legenda no jeito de cada plataforma."
        />

        <motion.ul
          className="mx-auto flex max-w-[820px] flex-wrap justify-center gap-3"
          variants={staggerContainer(0.06)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {motionDeliverables.map((d) => (
            <motion.li
              key={d}
              variants={fadeUp}
              className="font-util flex items-center gap-2.5 border border-line bg-panel px-4 py-2.5 text-[12px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-blood"
            >
              <span aria-hidden="true" className="h-[7px] w-[7px] flex-none rotate-45 bg-blood" />
              {d}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/*
 * Tela MOTION — focada na construção de vídeo & motion.
 * Herói com timeline de editor → showreel rodando → planos (com a barra de
 * timeline em cada card) → processo → formatos de entrega → dúvidas → CTA.
 */
export default function Motion() {
  return (
    <>
      <SiteHeader
        active="motion"
        cta={{ label: 'Pedir orçamento', href: waLink('Oi! Quero um orçamento de vídeo/motion.'), external: true }}
      />
      <main>
        <MotionHero />

        {/* showreel — a peça rodando de verdade (sem o CTA do Bundle) */}
        <Reel id="showreel" showCta={false} />

        <ServiceTiers
          id="planos"
          eyebrow="Planos"
          title={
            <>
              Do reels
              <br />
              ao filme de campanha.
            </>
          }
          lead="A barra mostra o porte de cada plano. Todos com animação à mão, som e color — muda a duração e a complexidade."
          tiers={motionTiers}
          foot="Entrega em ProRes & H.264 · trilha licenciada · legendas inclusas"
          renderTop={(t) => <Timeline fill={t.fill} />}
        />

        <Process
          eyebrow="Como a peça nasce"
          title={
            <>
              Do roteiro
              <br />
              ao render final.
            </>
          }
          lead="Cada etapa tem um ponto de aprovação seu, pra a peça sair do jeito que você imaginou — sem retrabalho."
          steps={motionProcess}
        />

        <Deliverables />

        <Faq
          items={motionFaqs}
          eyebrow="Dúvidas de vídeo"
          title={
            <>
              O que saber antes
              <br />
              de pedir orçamento.
            </>
          }
        />

        <ServiceCta config={serviceCta.motion} />
        <ServicesCrossLink current="motion" />
      </main>
      <Footer />
    </>
  )
}
