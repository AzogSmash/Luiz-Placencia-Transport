'use client'

import Link from 'next/link'
import CTA from '@/components/CTA'
import { bg } from '@/lib/images'
import { useLanguage } from '@/contexts/LanguageContext'

const SERVICE_IMGS = [
  'Avión llegando al tarmac',
  'Ryanair despegando en Beauvais',
  'Llegada Disneyland Hotel',
  'Castillo de Versalles',
  'Torre Eiffel desde Trocadéro',
  'Interior cabina trasera Clase S',
  'Mont-Saint-Michel',
  'Canales de Ámsterdam',
]

export default function ServiciosPage() {
  const { t } = useLanguage()
  const sp = t.serviciosPage

  return (
    <main className="page-enter">
      {/* Header */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 32 }}>{sp.eyebrow}</div>
          <h1 className="display" style={{
            fontSize: 'clamp(48px, 7vw, 96px)',
            margin: 0,
            marginBottom: 32,
            maxWidth: 900,
          }}>
            {sp.headingPre}{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{sp.headingAccent}</em>{' '}
            {sp.headingPost}
          </h1>
          <p className="lead" style={{ maxWidth: 640 }}>{sp.lead}</p>
        </div>
      </section>

      {/* Service rows */}
      {sp.items.map((s, i) => (
        <section key={s.n} style={{
          padding: '64px 0',
          borderTop: '1px solid var(--line-soft)',
          background: i % 2 === 1 ? 'var(--bg-elev)' : 'var(--bg)',
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 1.1fr' : '1.1fr 1fr',
              gap: 64,
              alignItems: 'center',
            }} className="service-row">

              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <div className="placeholder" data-label={SERVICE_IMGS[i]} style={{ ...bg(SERVICE_IMGS[i]), aspectRatio: '5/4' }} />
              </div>

              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
                  <span className="mono" style={{ color: 'var(--accent)' }}>{s.n}</span>
                  <span className="eyebrow">{s.price}</span>
                </div>
                <h2 className="display" style={{
                  fontSize: 'clamp(36px, 4.5vw, 56px)',
                  margin: 0,
                  marginBottom: 24,
                  fontWeight: 400,
                }}>{s.t}</h2>
                <p className="lead" style={{ marginBottom: 32 }}>{s.d}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 32 }}>
                  {s.f.map((item, j) => (
                    <li key={j} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 0',
                      borderTop: '1px solid var(--line-soft)',
                      fontSize: 14,
                    }}>
                      <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/reserva" className="btn btn-primary">
                  {sp.bookBtn}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTA />
    </main>
  )
}
