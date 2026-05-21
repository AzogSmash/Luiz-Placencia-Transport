'use client'

import Link from 'next/link'
import { bg } from '@/lib/images'

const SERVICES = [
  { n: '01', t: 'Traslados aeropuerto',           d: 'CDG · Orly · Beauvais · Le Bourget. Seguimiento de vuelos y tiempo de espera incluido.', img: 'Mercedes en zona de embarque CDG' },
  { n: '02', t: 'Disneyland París',               d: 'Trayecto directo París ↔ Disneyland. Sillas infantiles disponibles bajo petición.',      img: 'Llegada Disneyland Hotel' },
  { n: '03', t: 'City tour privado',              d: 'Descubra París a su ritmo. Itinerario personalizado, paradas libres, comentarios discretos.', img: 'Torre Eiffel desde Trocadéro' },
  { n: '04', t: 'Disposición con chófer',         d: 'A la hora o jornada completa. Reuniones, compras, eventos — su chófer le espera.',     img: 'Interior cabina trasera' },
  { n: '05', t: 'Versalles · St-Michel · Bruges', d: 'Excursiones de un día con tarifa fija. Versalles, Mont-Saint-Michel y Brujas desde 700 €.', img: 'Castillo de Versalles' },
  { n: '06', t: 'Excursiones a medida',           d: 'Ámsterdam, Loire, Champaña, Italia y más. Presupuesto personalizado en 30 minutos.',   img: 'Castillo de Chenonceau' },
]

export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow label">Servicios</div>
          </div>
          <div>
            <h2>Un servicio para<br/>cada trayecto.</h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--line-soft)',
          border: '1px solid var(--line-soft)',
        }} className="services-grid">
          {SERVICES.map(s => (
            <Link
              key={s.n}
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
                <div className="placeholder" data-label={s.img} style={{ ...bg(s.img), aspectRatio: '16/10', marginBottom: 24 }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                  <span className="mono" style={{ color: 'var(--accent)' }}>{s.n}</span>
                  <h3 style={{
                    fontFamily: 'var(--display)',
                    fontSize: 28,
                    margin: 0,
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                  }}>{s.t}</h3>
                </div>
                <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
                  {s.d}
                </p>
                <span className="btn-link">Saber más</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
