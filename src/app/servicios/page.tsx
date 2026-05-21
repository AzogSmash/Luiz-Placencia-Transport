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
    n: '02', t: 'Traslado Beauvais', price: 'Desde 160 €',
    d: 'Traslado entre París, Disneyland y el aeropuerto de Beauvais-Tillé. Tarifa fija según número de pasajeros.',
    f: ['1–3 pax: 160 € · 4 pax: 170 € · 5 pax: 180 € · 6 pax: 190 €', '7 pax: 200 € · 8 pax: 210 € · hasta 16 pax con tarifa progresiva', 'Grupos de más de 16 → presupuesto privado', 'Seguimiento de vuelo y asistencia con el equipaje incluidos'],
    img: 'Mercedes en zona de embarque CDG',
  },
  {
    n: '03', t: 'París ↔ Disneyland', price: 'Desde 70 €',
    d: 'Traslado directo y cómodo entre cualquier dirección parisina y los parques Disneyland París.',
    f: ['Sillas infantiles bajo petición', 'Vehículos hasta 8 pasajeros', 'Espacio para equipaje y cochecitos', 'Reserva ida y vuelta con tarifa preferente'],
    img: 'Llegada Disneyland Hotel',
  },
  {
    n: '04', t: 'Visita Versalles', price: 'Desde 50 €',
    d: 'Traslado privado al Palacio de Versalles y regreso. Tarifa fija según el número de pasajeros.',
    f: ['1 pax: 50 € · 2 pax: 60 € · 3 pax: 70 € · 4 pax: 80 €', '5 pax: 90 € · 6 pax: 100 € · 7 pax: 110 € · 8 pax: 120 €', '9–16 pax: de 130 € a 200 € (+10 € por pax)', 'Grupos de más de 16 → presupuesto privado'],
    img: 'Castillo de Versalles',
  },
  {
    n: '05', t: 'City tour privado', price: '200 € / 4 h',
    d: 'Descubra París desde la comodidad de un vehículo premium. Itinerarios a medida, paradas libres.',
    f: ['Berlina: 200 € · 4 h (50 €/h extra)', 'Van: 250 € · 4 h (60 €/h extra)', 'Itinerario personalizado', 'Paradas para fotos sin límite'],
    img: 'Torre Eiffel desde Trocadéro',
  },
  {
    n: '06', t: 'Disposición con chófer', price: 'Desde 50 € / h',
    d: 'Su chófer le acompaña durante el tiempo que necesite — reuniones, compras, visitas, eventos.',
    f: ['Berlina: 50 €/h · Van: 60 €/h', 'Mínimo 3 horas', 'Vehículo a su disposición en todo momento', 'Total flexibilidad de horario'],
    img: 'Interior cabina trasera Clase S',
  },
  {
    n: '07', t: 'Mont-Saint-Michel · Bruges', price: 'Desde 700 €',
    d: 'Un día completo descubriendo los grandes destinos de Francia y Bélgica. Tarifa fija según el número de pasajeros.',
    f: ['1–3 pax: 700 € · 4 pax: 800 € · 5 pax: 900 € · 6 pax: 1 000 €', '7 pax: 1 100 € · 8 pax: 1 200 € · 9 pax: 1 700 € · hasta 16 pax con tarifa progresiva', 'Guía local opcional · Reservas de restaurantes incluidas', 'Grupos de más de 17 → presupuesto privado'],
    img: 'Castillo de Chenonceau',
  },
  {
    n: '08', t: 'Excursiones a medida', price: 'Precio bajo consulta',
    d: 'Ámsterdam, châteaux de la Loire, Champaña, Italia y mucho más. Presupuesto personalizado en menos de 30 minutos.',
    f: ['Ámsterdam · Châteaux de la Loire · Champaña · Italia', 'Itinerario, vehículo y precio totalmente a medida', 'Respuesta garantizada en menos de 30 minutos', 'Reserva por WhatsApp o formulario en línea'],
    img: 'Castillo de Chenonceau',
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
