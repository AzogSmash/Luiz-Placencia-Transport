import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios VTC París | Traslados Aeropuerto, Disneyland, Versalles',
  description: 'Traslados privados desde/hacia CDG, Orly y Beauvais. Excursiones a Disneyland, Versalles, Mont-Saint-Michel, Brujas y más. Conductor español, vehículo premium, precio fijo sin sorpresas.',
  alternates: { canonical: 'https://luisplasenciatransport.com/servicios' },
  openGraph: {
    title: 'Servicios VTC París | Traslados & Excursiones · Luis Plasencia',
    description: 'Traslados aeropuerto CDG, Orly, Beauvais. Excursiones Disneyland, Versalles, Mont-Saint-Michel. Conductor español, precio fijo.',
    url: 'https://luisplasenciatransport.com/servicios',
  },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
