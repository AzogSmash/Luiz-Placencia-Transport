import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservar Transfer VTC París | Precio Fijo, Conductor Español',
  description: 'Reserve su traslado privado en París en pocos minutos. Conductor español, precio fijo garantizado, vehículo de lujo. Aeropuerto CDG, Orly, Beauvais, Disneyland, Versalles y más.',
  alternates: { canonical: 'https://luisplasenciatransport.com/reserva' },
  openGraph: {
    title: 'Reservar VTC París | Luis Plasencia Transport',
    description: 'Reserve su traslado privado en París. Conductor español, precio fijo, vehículo premium. Disponible 24h.',
    url: 'https://luisplasenciatransport.com/reserva',
  },
}

export default function ReservaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
