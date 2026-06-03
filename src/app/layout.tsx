import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  title: 'Luis Plasencia Transport — Chófer privado VTC en París',
  description: 'Servicio de chófer privado VTC en París. Traslados aeropuerto CDG, Orly, Beauvais, Disneyland, Versalles, city tours y excursiones por Francia y Europa. Vehículos premium, reserva online.',
  keywords: [
    'VTC París', 'chófer privado París', 'traslado aeropuerto París',
    'taxi privado CDG', 'transfer Orly', 'Disneyland transfer',
    'chauffeur privé Paris', 'VTC aéroport Paris', 'location avec chauffeur Paris',
    'excursion Mont-Saint-Michel', 'visite Versailles chauffeur',
  ],
  metadataBase: new URL('https://luisplasenciatransport.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Luis Plasencia Transport — Chófer privado VTC en París',
    description: 'Traslados aeropuerto, Disneyland, Versalles, city tours y excursiones. Vehículos premium, reserva online.',
    url: 'https://luisplasenciatransport.com',
    siteName: 'Luis Plasencia Transport',
    locale: 'es_ES',
    type: 'website',
  },
  robots: { index: true, follow: true },
  authors: [{ name: 'Clément Casse', url: 'https://www.linkedin.com/in/cl%C3%A9ment-casse-629242290/' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TaxiService',
            name: 'Luis Plasencia Transport',
            url: 'https://luisplasenciatransport.com',
            telephone: '+33643272173',
            email: 'Luisplasenciatransport@gmail.com',
            areaServed: { '@type': 'City', name: 'París' },
            address: { '@type': 'PostalAddress', addressLocality: 'París', addressCountry: 'FR' },
            priceRange: '€€',
            description: 'Servicio de chófer privado VTC en París. Traslados aeropuerto, Disneyland, Versalles, city tours y excursiones por Europa.',
          }) }}
        />
        {/* Design & développement : Clément Casse — c.casse92@gmail.com — linkedin.com/in/clément-casse-629242290 */}
        <NavBar />
        {children}
        <Footer />
        <WhatsAppFAB />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
