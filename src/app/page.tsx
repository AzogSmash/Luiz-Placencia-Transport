import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'

export const metadata: Metadata = {
  title: 'Chófer Privado VTC en París con Atención en Español',
  description: 'Chófer privado en París con atención en español. Traslados aeropuerto CDG, Orly y Beauvais · Disneyland · Versalles · Excursiones por Francia y Europa. Vehículo premium, precio fijo, reserva online 24h.',
  alternates: { canonical: 'https://luisplasenciatransport.com' },
  openGraph: {
    title: 'Luis Plasencia Transport | Chófer Privado en París · Español',
    description: 'Traslados aeropuerto, Disneyland, Versalles y excursiones por Europa. Conductor español, precio fijo, reserva online.',
    url: 'https://luisplasenciatransport.com',
  },
}
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
