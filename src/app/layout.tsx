import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import Providers from '@/components/Providers'
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
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Luis Plasencia Transport | Chófer Privado VTC en París · Español',
    template: '%s | Luis Plasencia Transport',
  },
  description: 'Chófer privado en París con atención en español. Traslados aeropuerto CDG, Orly, Beauvais · Disneyland · Versalles · Excursiones por Europa. Reserva online 24h.',
  keywords: [
    'chófer privado París', 'conductor español París', 'taxi español París',
    'VTC en español París', 'transfer aeropuerto París español',
    'traslado CDG español', 'transfer Orly español', 'Disneyland transfer español',
    'excursión Versalles desde París', 'chauffeur privé Paris espagnol',
    'VTC Paris hispano', 'conductor privado París',
  ],
  metadataBase: new URL('https://luisplasenciatransport.com'),
  openGraph: {
    title: 'Luis Plasencia Transport | Chófer Privado VTC en París · Español',
    description: 'Chófer privado en París con atención en español. Traslados aeropuerto, Disneyland, Versalles y excursiones por Europa.',
    url: 'https://luisplasenciatransport.com',
    siteName: 'Luis Plasencia Transport',
    locale: 'es_ES',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
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
        <Providers>
          <NavBar />
          {children}
          <Footer />
          <WhatsAppFAB />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
