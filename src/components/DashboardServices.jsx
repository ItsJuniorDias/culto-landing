import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import Button from './Button'
import { siteTiers, motionTiers, waLink } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/*
 * Bespoke-service cross-sell, shown inside the customer dashboard.
 * Someone who already bought a pack is a warm lead for a full site or a motion
 * video, so we surface both service tracks here — "as options" — right below
 * their library. Plans and prices come from the SAME source of truth
 * (siteTiers / motionTiers) that feeds the landing sections, so nothing drifts.
 *
 * Layout: the two service cards stack one below the other (never side by side),
 * and each card flows top-to-bottom in a single column — header, pitch, the
 * options as a full-width inset list, then the actions.
 */

const SiteIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-blood" strokeWidth="1.8">
    <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
    <path d="M3 9h18" />
    <circle cx="5.7" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="7.6" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

const MotionIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-blood" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none" />
  </svg>
)

const services = [
  {
    id: 'sites',
    icon: <SiteIcon />,
    kind: 'Criação de site',
    title: 'Site sob medida',
    pitch:
      'Landing, institucional ou web app — código do zero, animação de estúdio e deploy no capricho. Nada de template.',
    tiers: siteTiers,
    href: '/#sites',
    quote: 'Oi! Sou cliente do Culto e quero um orçamento de criação de site.',
  },
  {
    id: 'motion',
    icon: <MotionIcon />,
    kind: 'Vídeo & motion',
    title: 'Motion pro feed',
    pitch:
      'Do reels vertical ao explainer de produto: animação feita à mão em After Effects, com trilha, som e color no capricho.',
    tiers: motionTiers,
    href: '/#motion',
    quote: 'Oi! Sou cliente do Culto e quero um orçamento de vídeo/motion.',
  },
]

export default function DashboardServices() {
  const reduce = useReducedMotion()

  return (
    <section className="mt-16">
      <Eyebrow>Serviços sob encomenda</Eyebrow>
      <h2 className="font-display mt-3 text-[30px] font-extrabold leading-none sm:text-[36px]">
        Precisa de algo sob medida?
      </h2>
      <p className="mt-3 max-w-[56ch] text-[15px] text-ash">
        Além dos packs, a gente também cria o site e o vídeo da sua marca. Escolha o serviço,
        peça o orçamento e a gente fecha o escopo com você no WhatsApp.
      </p>

      {/* one card below the other — vertical stack, full width */}
      <motion.div
        className="mt-8 flex flex-col gap-5"
        variants={staggerContainer(0.12)}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {services.map((s) => (
          <motion.article
            key={s.id}
            variants={fadeUp}
            whileHover={reduce ? undefined : { y: -3 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="group flex flex-col border border-line bg-panel p-7 transition-colors hover:border-blood sm:p-8"
          >
            {/* header: icon + label + title */}
            <div className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 flex-none place-items-center border border-line bg-ink transition-colors group-hover:border-blood">
                {s.icon}
              </span>
              <div>
                <div className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">
                  {s.kind}
                </div>
                <h3 className="font-display text-[25px] font-extrabold leading-none">{s.title}</h3>
              </div>
            </div>

            <p className="mt-4 max-w-[64ch] text-[14px] text-ash">{s.pitch}</p>

            {/* the options / plans — full-width inset list, name left / price right */}
            <div className="mt-6 border border-line bg-ink/40 px-5 sm:px-6">
              <ul className="flex flex-col divide-y divide-line">
                {s.tiers.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-[13px]">
                    <span className="flex min-w-0 items-center gap-2.5 text-[14.5px] text-bone">
                      <span
                        aria-hidden="true"
                        className="h-[6px] w-[6px] flex-none rotate-45 bg-blood"
                      />
                      <span className="truncate">{t.name}</span>
                      {t.featured && (
                        <span className="font-util flex-none rounded-sm bg-blood/15 px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.12em] text-blood-2">
                          Popular
                        </span>
                      )}
                    </span>
                    <span className="font-util whitespace-nowrap text-[12.5px] uppercase tracking-[0.08em] text-faint">
                      {t.isText ? 'sob consulta' : `a partir de R$ ${t.price}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* actions */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button href={waLink(s.quote)} target="_blank" rel="noopener noreferrer">
                Pedir orçamento ↗
              </Button>
              <a
                href={s.href}
                className="font-util text-[12px] font-semibold uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
              >
                Ver todos os planos →
              </a>
              <span className="font-util ml-auto hidden text-[10px] uppercase tracking-[0.12em] text-faint sm:block">
                Preços iniciais · orçamento conforme o escopo
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
