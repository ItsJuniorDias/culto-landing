import SiteHeader from '../components/SiteHeader'
import Hero from '../components/Hero'
import Compat from '../components/Compat'
import Inside from '../components/Inside'
import Packs from '../components/Packs'
import Steps from '../components/Steps'
import Reel from '../components/Reel'
import Voices from '../components/Voices'
import Faq from '../components/Faq'
import ServicesCrossLink from '../components/ServicesCrossLink'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'

/*
 * Tela HOME — focada nos assets (a loja de packs).
 * Só o funil da loja: herói dos assets → categorias → planos → como funciona →
 * showreel → prova social → dúvidas → ponte pros serviços → CTA do Bundle.
 * Sites e Motion agora têm telas próprias (/sites e /motion).
 */
export default function Landing() {
  return (
    <>
      <SiteHeader active="packs" cta={{ label: 'Ver packs', href: '#packs' }} />
      <main>
        <Hero />
        <Compat />
        <Inside />
        <Packs />
        <Steps />
        <Reel />
        <Voices />
        <Faq />
        <ServicesCrossLink current="packs" />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
