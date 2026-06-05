'use client'

import Link from 'next/link'
import { bg } from '@/lib/images'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line-soft)' }}>
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          <div>
            <div className="tag" style={{ marginBottom: 32 }}>
              <span className="dot" />
              <span>{h.tag}</span>
            </div>

            <h1 className="display" style={{ fontSize: 'clamp(54px, 7.5vw, 104px)', margin: 0, marginBottom: 28, fontWeight: 400 }}>
              {h.heading1}<br/>
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{h.heading2}</em>
            </h1>

            <p className="lead" style={{ marginBottom: 40, maxWidth: 480 }}>
              {h.description}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserva" className="btn btn-primary">{h.cta1}</Link>
              <Link href="/servicios" className="btn btn-ghost">{h.cta2}</Link>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
              marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--line-soft)',
            }}>
              {h.stats.map(s => (
                <div key={s.v}>
                  <div className="display" style={{ fontSize: 36, marginBottom: 4 }}>{s.k}</div>
                  <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="placeholder"
              style={{ ...bg('Mercedes Clase E · Place Vendôme'), aspectRatio: '4/5', width: '100%' }}
            />
            <div className="hero-info-card" style={{
              position: 'absolute', bottom: -24, left: -24,
              background: 'var(--bg)', border: '1px solid var(--line)', padding: '20px 24px', maxWidth: 240,
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{h.nextRide}</div>
              <div style={{ fontSize: 14, color: 'var(--fg)', marginBottom: 4 }}>CDG → Le Bristol</div>
              <div className="mono" style={{ color: 'var(--fg-muted)' }}>14:32 · 32 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
