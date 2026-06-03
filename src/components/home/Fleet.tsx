'use client'

import { bg } from '@/lib/images'
import { useLanguage } from '@/contexts/LanguageContext'

const FLEET_NAMES = ['Mercedes Clase V', 'Hyundai Staria', 'Tesla Model Y', 'Mercedes Clase S']
const FLEET_PAX   = ['1–8', '1–8', '1–3', '1–3']
const FLEET_BAG   = ['6', '6', '2+3', '2+3']

export default function Fleet() {
  const { t } = useLanguage()
  const f = t.fleet

  return (
    <section className="section" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">{f.eyebrow}</div>
          <div>
            <h2>{f.heading}</h2>
            <p className="lead" style={{ marginTop: 24 }}>{f.lead}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }} className="fleet-grid">
          {f.items.map((v, i) => (
            <div key={FLEET_NAMES[i]} style={{
              border: '1px solid var(--line-soft)',
              background: 'var(--bg)',
            }}>
              <div className="placeholder" data-label={FLEET_NAMES[i]} style={{ ...bg(FLEET_NAMES[i]), aspectRatio: '4/3' }} />
              <div style={{ padding: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{v.cat}</div>
                <h3 style={{
                  fontFamily: 'var(--display)',
                  fontSize: 26,
                  margin: 0,
                  marginBottom: 16,
                  fontWeight: 400,
                }}>{FLEET_NAMES[i]}</h3>
                <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
                  {v.desc}
                </p>
                <div style={{
                  display: 'flex',
                  gap: 24,
                  paddingTop: 20,
                  borderTop: '1px solid var(--line-soft)',
                  fontSize: 12,
                }}>
                  <div>
                    <div style={{ color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 10, marginBottom: 4 }}>{f.pax}</div>
                    <div className="mono">{FLEET_PAX[i]}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 10, marginBottom: 4 }}>{f.luggage}</div>
                    <div className="mono">{FLEET_BAG[i]}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
