import { useEffect } from 'react'
import SiteHeader from '../components/SiteHeader'
import SitesHero from '../components/SitesHero'
import SectionHead from '../components/SectionHead'
import SitesShowcase from '../components/SitesShowcase'
import Process from '../components/Process'
import Capabilities from '../components/Capabilities'
import ServiceTiers from '../components/ServiceTiers'
import ProofStrip from '../components/ProofStrip'
import Faq from '../components/Faq'
import ServiceCta from '../components/ServiceCta'
import ServicesCrossLink from '../components/ServicesCrossLink'
import MobileCtaBar from '../components/MobileCtaBar'
import Footer from '../components/Footer'
import { Halftone } from '../components/Decor'
import { siteTiers, waLink } from '../data/content'
import { sitesProcess, sitesCapabilities, sitesFaqs, sitesProof, serviceCta, pageMeta } from '../data/screens'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { viewContent } from '../lib/pixel'

/*
 * Tela SITES — focada na construção de sites sob medida.
 * Herói com mock de navegador → prova real (Pedagogy) → processo → o que vem
 * incluso → garantias (quebra de objeção) → planos → dúvidas → CTA de orçamento
 * (formulário) → ponte pras outras telas. Barra fixa de WhatsApp no mobile.
 */
export default function Sites() {
  useDocumentMeta(pageMeta.sites)

  // ViewContent da página de serviço → alimenta público e otimização da campanha.
  useEffect(() => {
    viewContent({
      content_name: 'Criação de sites',
      content_category: 'sites',
      content_type: 'service',
    })
  }, [])

  return (
    <>
      <SiteHeader
        active="sites"
        cta={{ label: 'Pedir orçamento', href: waLink('Oi! Quero um orçamento de site.'), external: true }}
      />
      <main>
        <SitesHero />

        {/* prova social: projeto real no ar */}
        <section className="relative border-t border-line bg-[radial-gradient(120%_80%_at_50%_-10%,#141118_0%,#08080A_60%)] py-[74px] md:py-[104px]">
          <Halftone className="opacity-30" />
          <div className="relative mx-auto max-w-wrap px-6">
            <SectionHead
              eyebrow="Projeto no ar"
              title={
                <>
                  Da ideia ao ar,
                  <br />
                  ponta a ponta.
                </>
              }
              lead="Não é portfólio de tela bonita parada. É um produto no ar, com funil, atribuição e performance funcionando de verdade."
            />
            <SitesShowcase />
          </div>
        </section>

        <Process
          eyebrow="Como a gente trabalha"
          title={
            <>
              Do briefing ao deploy,
              <br />
              sem etapa pulada.
            </>
          }
          lead="Um caminho claro, com você aprovando a cada passo. Sem sumiço, sem surpresa no prazo."
          steps={sitesProcess}
        />

        <Capabilities
          withTexture
          eyebrow="O que vem incluso"
          title={
            <>
              Tudo que um site precisa,
              <br />
              sem custo extra.
            </>
          }
          lead="Você não paga separado por publicar no ar, por deixar rápido ou por aparecer no Google. Já está tudo no pacote."
          items={sitesCapabilities}
        />

        {/* quebra de objeção logo antes do preço */}
        <ProofStrip items={sitesProof} />

        <ServiceTiers
          id="planos"
          eyebrow="Planos"
          title={
            <>
              Escolha o tamanho
              <br />
              do projeto.
            </>
          }
          lead="Da landing única ao sistema completo. Todos com design exclusivo, deploy e nota fiscal — muda só o escopo."
          tiers={siteTiers}
          foot="Orçamento em até 24h · 50% pra começar, 50% na entrega · Nota fiscal"
        />

        <Faq
          items={sitesFaqs}
          eyebrow="Dúvidas de site"
          title={
            <>
              O que saber antes
              <br />
              de pedir orçamento.
            </>
          }
        />

        <ServiceCta config={serviceCta.sites} service="sites" />
        <ServicesCrossLink current="sites" />
      </main>
      <Footer />
      <MobileCtaBar variant="sites" />
    </>
  )
}
