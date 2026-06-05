'use client'

import Link from 'next/link'
import { bg } from '@/lib/images'
import { useLanguage } from '@/contexts/LanguageContext'

const IMGS = [
  'Avión llegando al tarmac',
  'Llegada Disneyland Hotel',
  'Torre Eiffel desde Trocadéro',
  'Interior cabina trasera',
  'Castillo de Versalles',
  'Canales de Ámsterdam',
]

export default function Services() {
  const { t } = useLanguage()
  const s = t.services

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow label">{s.eyebrow}</div>
          </div>
          <div>
            <h2>{s.heading}</h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--line-soft)',
          border: '1px solid var(--line-soft)',
        }} className="services-grid">
          {s.items.map((item, i) => (
            <Link
              key={i}
              href="/servicios"
              style={{ textDecoration: 'none' }}
            >
              <article style={{
                background: 'var(--bg)',
                padding: '36px 32px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                height: '100%',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
              >
                <div className="placeholder" data-label={IMGS[i]} style={{ ...bg(IMGS[i]), aspectRatio: '16/10', marginBottom: 24 }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                  <span className="mono" style={{ color: 'var(--accent)' }}>0{i + 1}</span>
                  <h3 style={{
                    fontFamily: 'var(--display)',
                    fontSize: 28,
                    margin: 0,
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                  }}>{item.t}</h3>
                </div>
                <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
                  {item.d}
                </p>
                <span className="btn-link">{s.cta}</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
