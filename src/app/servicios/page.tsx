import Link from 'next/link'
import CTA from '@/components/CTA'
import { bg } from '@/lib/images'

const SERVICES = [
  {
    n: '01', t: 'Traslado CDG / Orly', price: 'Desde 70 €',
    d: 'Servicio completo desde y hacia los aeropuertos de Charles de Gaulle y Orly. Tarifa fija según número de pasajeros.',
    f: ['Seguimiento de vuelo en tiempo real', '60 min de espera gratuitos', 'Cartel personalizado a la llegada', '1–3 pax: 70 € · hasta 25 pax con tarifa progresiva'],
    img: 'Mercedes Clase E · CDG Terminal 2E',
  },
  {
    n: '02', t: 'París ↔ Disneyland', price: 'Desde 70 €',
    d: 'Traslado directo y cómodo entre cualquier dirección parisina y los parques Disneyland París.',
    f: ['Sillas infantiles bajo petición', 'Vehículos hasta 8 pasajeros', 'Espacio para equipaje y cochecitos', 'Reserva ida y vuelta con tarifa preferente'],
    img: 'Llegada Disneyland Hotel',
  },
  {
    n: '03', t: 'City tour privado', price: '200 € / 4 h',
    d: 'Descubra París desde la comodidad de un vehículo premium. Itinerarios a medida, paradas libres.',
    f: ['Berlina: 200€ · 4 h (50€/h extra)', 'Van: 250€ · 4 h (60€/h extra)', 'Itinerario personalizado', 'Paradas para fotos sin límite'],
    img: 'Torre Eiffel desde Trocadéro',
  },
  {
    n: '04', t: 'Disposición con chófer', price: 'Desde 50 € / h',
    d: 'Su chófer le acompaña durante el tiempo que necesite — reuniones, compras, visitas, eventos.',
    f: ['Berlina: 50€/h · Van: 60€/h', 'Mínimo 3 horas', 'Vehículo a su disposición', 'Total flexibilidad de horario'],
    img: 'Interior cabina trasera Clase S',
  },
  {
    n: '05', t: 'Excursiones privadas', price: 'Desde 700 €',
    d: 'Versalles, Mont-Saint-Michel, Bruges y más. Un día completo con chófer privado para descubrir los tesoros de Francia y Europa.',
    f: ['Versalles · Mont-Saint-Michel · Bruges desde 700€', 'Ámsterdam · Champaña · Loire · Italia: bajo consulta', 'Guía local opcional', 'Reservas de restaurantes incluidas'],
    img: 'Castillo de Versalles',
  },
  {
    n: '06', t: 'Traslado Beauvais', price: 'Desde 160 €',
    d: 'Traslado entre París, Disneyland y el aeropuerto de Beauvais-Tillé. Tarifa fija según número de pasajeros.',
    f: ['1–3 pax: 160 € · tarifa progresiva hasta 16 pax', 'Grupos de más de 16 → presupuesto privado', 'Asistencia con el equipaje', 'Seguimiento de vuelo incluido'],
    img: 'Mercedes en zona de embarque CDG',
  },
]

export default function ServiciosPage() {
  return (
    <main className="page-enter">
      {/* Header */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Servicios · 06 prestaciones</div>
          <h1 className="display" style={{
            fontSize: 'clamp(48px, 7vw, 96px)',
            margin: 0,
            marginBottom: 32,
            maxWidth: 900,
          }}>
            Cada trayecto, una{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>experiencia</em> medida.
          </h1>
          <p className="lead" style={{ maxWidth: 640 }}>
            Nuestra propuesta cubre todas las necesidades de movilidad privada en París, Île-de-France
            y más allá. Cada servicio combina vehículos premium, conductores formados y una atención al detalle obsesiva.
          </p>
        </div>
      </section>

      {/* Service rows */}
      {SERVICES.map((s, i) => (
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
                <div className="placeholder" data-label={s.img} style={{ ...bg(s.img), aspectRatio: '5/4' }} />
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
                  {s.f.map(item => (
                    <li key={item} style={{
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
                  Reservar este servicio
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
