import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead'
import Button from './Button'
import { packs } from '../data/content'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

const Check = () => (
  <svg viewBox="0 0 24 24" className="mt-[3px] h-[17px] w-[17px] flex-none fill-none stroke-blood" strokeWidth="2.6">
    <path d="M4 12l5 5L20 6" />
  </svg>
)

const Cross = () => (
  <svg viewBox="0 0 24 24" className="mt-[3px] h-[17px] w-[17px] flex-none fill-none stroke-faint" strokeWidth="2.2">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export default function Packs() {
  const reduce = useReducedMotion()

  return (
    <section id="packs" className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <SectionHead
          center
          solo
          eyebrow="Escolha seu pack"
          title={
            <>
              Pague uma vez.
              <br />
              Use pra sempre.
            </>
          }
          lead="Sem assinatura escondida. Você compra, baixa e fica com tudo — incluindo as atualizações. Licença comercial em todos os packs."
        />

        <motion.div
          className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={viewportOnce}
        >
          {packs.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -5 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`relative flex h-full flex-col border p-8 ${
                p.featured
                  ? 'shadow-featured order-first border-blood bg-[linear-gradient(180deg,#181014,#121116)] md:order-none'
                  : 'border-line bg-panel'
              }`}
            >
              {p.tag && (
                <span className="font-util absolute -right-px -top-px bg-blood px-3.5 py-[7px] text-[11px] font-bold uppercase tracking-[0.16em] text-bone">
                  {p.tag}
                </span>
              )}

              <span className="font-util text-xs uppercase tracking-[0.2em] text-blood">{p.kind}</span>
              <h3 className="font-display mb-1 mt-2.5 text-[32px] font-extrabold leading-none">{p.name}</h3>
              <p className="min-h-[42px] text-sm text-ash">{p.desc}</p>

              <div className="mb-1 mt-6 flex items-end gap-2.5">
                <span className="font-util mb-2 text-base text-ash">R$</span>
                <span className="font-display text-[56px] font-black leading-[0.8]">{p.price}</span>
                <span className="font-util mb-2.5 text-sm text-faint line-through">{p.old}</span>
              </div>
              <div className="font-util mb-[26px] text-[11px] uppercase tracking-[0.12em] text-faint">
                pagamento único · acesso vitalício
              </div>

              <ul className="mb-[30px] flex flex-col gap-[13px]">
                {p.feats.map((f) => (
                  <li
                    key={f.t}
                    className={`flex gap-[11px] text-[14.5px] ${f.on ? '' : 'text-faint'}`}
                  >
                    {f.on ? <Check /> : <Cross />}
                    {f.strong ? <strong>{f.t}</strong> : f.t}
                  </li>
                ))}
              </ul>

              <Button to={`/pack/${p.id}`} full variant={p.ctaVariant} className="mt-auto">
                {p.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
