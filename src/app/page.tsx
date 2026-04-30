import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import Fleet from '@/components/home/Fleet'
import Process from '@/components/home/Process'
import Testimonios from '@/components/home/Testimonios'
import CTA from '@/components/CTA'

export default function HomePage() {
  return (
    <main className="page-enter">
      <Hero />
      <Services />
      <Fleet />
      <Process />
      <Testimonios />
      <CTA />
    </main>
  )
}
