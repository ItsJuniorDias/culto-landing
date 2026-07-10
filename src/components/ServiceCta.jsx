import Reveal from './Reveal'
import Button from './Button'
import { Halftone, Rays, Burst } from './Decor'
import { waLink } from '../data/content'

/*
 * Bloco de conversão das telas de serviço (Sites e Motion). Espelha a energia
 * do FinalCta da loja, mas o CTA abre um orçamento no WhatsApp já preenchido em
 * vez de levar ao checkout. `config` vem de screens.js (serviceCta.sites/motion).
 */
export default function ServiceCta({ config, id = 'orcamento' }) {
  const [line1, line2] = config.title.split('\n')

  return (
    <section id={id} className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal className="relative overflow-hidden border border-line bg-[radial-gradient(110%_130%_at_50%_0%,#1b0a0c_0%,#08080A_60%)] px-8 py-[80px] text-center md:py-[96px]">
          <Halftone />
          <Rays />
          <Burst pos="tl" full={false} />
          <Burst pos="br" full={false} />

          <p className="font-util relative z-[2] text-[11px] uppercase tracking-[0.2em] text-blood">
            {config.kicker}
          </p>

          <h2
            className="font-display relative z-[2] mt-4 font-black leading-[0.92]"
            style={{ fontSize: 'clamp(36px,6vw,80px)' }}
          >
            <span className="block">{line1}</span>
            {line2 && <span className="block">{line2}</span>}
          </h2>

          <p className="relative z-[2] mx-auto mb-9 mt-6 max-w-[52ch] text-[17px] text-ash">
            {config.lead}
          </p>

          <div className="relative z-[2] flex flex-wrap justify-center gap-3.5">
            <Button href={waLink(config.quote)} target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp ↗
            </Button>
            <Button to="/" variant="ghost">
              Ver os packs
            </Button>
          </div>

          <div className="font-util relative z-[2] mt-[26px] text-xs uppercase tracking-[0.14em] text-faint">
            {config.foot}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
