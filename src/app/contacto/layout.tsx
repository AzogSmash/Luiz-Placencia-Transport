import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | VTC París en Español · Luis Plasencia Transport',
  description: 'Contacte con su chófer privado en París. Atención personalizada en español vía WhatsApp, teléfono o email. Disponible 24h para consultas y reservas a medida.',
  alternates: { canonical: 'https://luisplasenciatransport.com/contacto' },
  openGraph: {
    title: 'Contacto | Luis Plasencia Transport · VTC París',
    description: 'Contacte con su conductor español en París. WhatsApp, teléfono o email. Disponible 24h.',
    url: 'https://luisplasenciatransport.com/contacto',
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
