'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Process() {
  const { t } = useLanguage()
  const p = t.process

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">{p.eyebrow}</div>
          <div>
            <h2>{p.heading}</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="process-grid">
          {p.steps.map((s, i) => (
            <div key={i} style={{
              padding: '32px 28px 32px 0',
              borderTop: '1px solid var(--accent)',
              marginRight: i < 3 ? 24 : 0,
            }}>
              <div className="mono" style={{ color: 'var(--accent)', marginBottom: 20 }}>0{i + 1}</div>
              <h3 style={{
                fontFamily: 'var(--display)',
                fontSize: 24,
                margin: 0,
                marginBottom: 12,
                fontWeight: 400,
              }}>{s.t}</h3>
              <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
