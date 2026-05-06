import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import WhatsAppFAB from '@/components/WhatsAppFAB'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Luis Placencia Transport — Chófer privado VTC en París',
  description: 'Servicio de chófer privado VTC en París. Traslados aeropuerto, Disneyland, city tours y excursiones por Francia y Europa. Vehículos premium, 24/7.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${jetbrains.variable}`}
    >
      <body>
        <NavBar />
        {children}
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  )
}
