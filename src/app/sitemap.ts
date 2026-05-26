import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://luisplasenciatransport.com'
  return [
    { url: base,               lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/servicios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/reserva`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contacto`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
