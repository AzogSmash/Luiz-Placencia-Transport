'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Testimonios() {
  const { t } = useLanguage()
  const t2 = t.testimonios

  return (
    <section className="section" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">{t2.eyebrow}</div>
          <div><h2>{t2.heading1}<br/>{t2.heading2}</h2></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="testimonios-grid">
          {t2.items.map((it, i) => (
            <figure key={i} style={{ margin: 0, padding: 32, border: '1px solid var(--line-soft)', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, color: 'var(--accent)' }}>
                {Array.from({ length: 5 }).map((_, k) => <span key={k}>★</span>)}
              </div>
              <blockquote style={{
                margin: 0,
                marginBottom: 28,
                fontFamily: 'var(--display)',
                fontSize: 22,
                lineHeight: 1.35,
                fontWeight: 400,
                fontStyle: 'italic',
              }}>
                « {it.q} »
              </blockquote>
              <figcaption>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{it.a}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{it.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
