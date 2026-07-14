import Reveal from './Reveal'
import QuoteForm from './QuoteForm'
import { Halftone, Rays, Burst } from './Decor'

/*
 * Bloco de conversão das telas de serviço (Sites e Motion). Mantém a energia de
 * pôster do FinalCta da loja, mas o miolo agora é o FORMULÁRIO de orçamento
 * (QuoteForm): o visitante monta um briefing curto e o submit abre o WhatsApp
 * com a mensagem pronta, disparando o evento Lead. Antes era um botão decorativo
 * só — agora é uma unidade de captação de verdade.
 *
 * `config` vem de screens.js (serviceCta.sites / serviceCta.motion).
 * `service` decide número de WhatsApp, faixas de orçamento e cópia ('sites'|'motion').
 */
export default function ServiceCta({ config, service = 'sites', id = 'orcamento' }) {
  const [line1, line2] = config.title.split('\n')

  return (
    <section id={id} className="relative py-[74px] md:py-[104px]">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal className="relative overflow-hidden border border-line bg-[radial-gradient(110%_130%_at_50%_0%,#1b0a0c_0%,#08080A_60%)] px-6 py-[64px] text-center sm:px-8 md:py-[84px]">
          <Halftone />
          <Rays />
          <Burst pos="tl" full={false} />
          <Burst pos="br" full={false} />

          <p className="font-util relative z-[2] text-[11px] uppercase tracking-[0.2em] text-blood">
            {config.kicker}
          </p>

          <h2
            className="font-display relative z-[2] mt-4 font-black leading-[0.92]"
            style={{ fontSize: 'clamp(32px,5.5vw,68px)' }}
          >
            <span className="block">{line1}</span>
            {line2 && <span className="block">{line2}</span>}
          </h2>

          <p className="relative z-[2] mx-auto mb-2 mt-6 max-w-[48ch] text-[17px] text-ash">
            {config.lead}
          </p>

          {/* formulário de orçamento — o coração da conversão */}
          <div className="relative z-[2]">
            <QuoteForm service={service} phone={config.phone} />
          </div>

          <div className="font-util relative z-[2] mt-8 text-xs uppercase tracking-[0.14em] text-faint">
            {config.foot}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
