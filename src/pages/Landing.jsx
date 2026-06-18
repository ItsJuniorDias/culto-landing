import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Compat from '../components/Compat'
import Inside from '../components/Inside'
import Packs from '../components/Packs'
import Steps from '../components/Steps'
import Voices from '../components/Voices'
import Faq from '../components/Faq'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Compat />
        <Inside />
        <Packs />
        <Steps />
        <Voices />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
