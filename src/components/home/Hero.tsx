import Link from 'next/link'
import { bg } from '@/lib/images'

const STATS = [
  { k: '20 +',    v: 'Años de experiencia' },
  { k: '3 000',   v: 'Trayectos realizados' },
  { k: '4.8 / 5', v: 'Valoración clientes' },
]

export default function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line-soft)' }}>
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }} className="hero-grid">

          {/* Left column */}
          <div>
            <div className="tag" style={{ marginBottom: 32 }}>
              <span className="dot" />
              <span>Chófer privado VTC · Disponible 24/7</span>
            </div>

            <h1 className="display" style={{
              fontSize: 'clamp(54px, 7.5vw, 104px)',
              margin: 0,
              marginBottom: 28,
              fontWeight: 400,
            }}>
              París, a su<br/>
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>ritmo.</em>
            </h1>

            <p className="lead" style={{ marginBottom: 40, maxWidth: 480 }}>
              Traslados al aeropuerto, recorridos privados y excursiones por Francia y Europa.
              Discreción, puntualidad y un servicio impecable a bordo de vehículos premium.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/reserva" className="btn btn-primary">
                Reservar un trayecto
              </Link>
              <Link href="/servicios" className="btn btn-ghost">
                Ver servicios
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              marginTop: 80,
              paddingTop: 40,
              borderTop: '1px solid var(--line-soft)',
            }}>
              {STATS.map(s => (
                <div key={s.v}>
                  <div className="display" style={{ fontSize: 36, marginBottom: 4 }}>{s.k}</div>
                  <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ position: 'relative' }}>
            <div
              className="placeholder"
              data-label="Mercedes Clase E · Place Vendôme"
              style={{ ...bg('Mercedes Clase E · Place Vendôme'), aspectRatio: '4/5', width: '100%' }}
            />
            <div className="hero-info-card" style={{
              position: 'absolute',
              bottom: -24,
              left: -24,
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              padding: '20px 24px',
              maxWidth: 240,
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Próximo trayecto</div>
              <div style={{ fontSize: 14, color: 'var(--fg)', marginBottom: 4 }}>CDG → Le Bristol</div>
              <div className="mono" style={{ color: 'var(--fg-muted)' }}>14:32 · 32 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
