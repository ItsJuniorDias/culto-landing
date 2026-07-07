import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Compat from '../components/Compat'
import Reel from '../components/Reel'
import Inside from '../components/Inside'
import Packs from '../components/Packs'
import Steps from '../components/Steps'
import SitesService from '../components/SitesService'
import MotionService from '../components/MotionService'
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
        <Reel />
        <Inside />
        <Packs />
        <Steps />
        <SitesService />
        <MotionService />
        <Voices />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
