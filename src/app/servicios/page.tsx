import Link from 'next/link'
import CTA from '@/components/CTA'
import { bg } from '@/lib/images'

const SERVICES = [
  {
    n: '01', t: 'Traslados aeropuerto', price: 'Desde 75 €',
    d: 'Servicio completo desde y hacia los principales aeropuertos parisinos: Charles de Gaulle, Orly, Beauvais y Le Bourget.',
    f: ['Seguimiento de vuelo en tiempo real', '60 min de espera gratuitos', 'Cartel personalizado a la llegada', 'Asistencia con el equipaje'],
    img: 'Mercedes Clase E · CDG Terminal 2E',
  },
  {
    n: '02', t: 'París ↔ Disneyland', price: 'Desde 110 €',
    d: 'Traslado directo y cómodo entre cualquier dirección parisina y los parques Disneyland París.',
    f: ['Sillas infantiles bajo petición', 'Vehículos hasta 7 pasajeros', 'Espacio para equipaje y cochecitos', 'Reserva ida y vuelta con tarifa preferente'],
    img: 'Llegada Disneyland Hotel',
  },
  {
    n: '03', t: 'City tour privado', price: 'Desde 90 € / hora',
    d: 'Descubra París desde la comodidad de un vehículo premium. Itinerarios a medida, paradas libres.',
    f: ['Itinerario personalizado', 'Comentarios discretos del chófer', 'Paradas fotos sin límite', 'Recomendaciones de restaurantes'],
    img: 'Torre Eiffel desde Trocadéro',
  },
  {
    n: '04', t: 'Disposición con chófer', price: 'Desde 80 € / hora',
    d: 'Su chófer le acompaña durante el tiempo que necesite — reuniones, compras, visitas, eventos.',
    f: ['Mínimo 3 horas', 'Tarifa decreciente por jornada completa', 'Vehículo a su disposición', 'Total flexibilidad de horario'],
    img: 'Interior cabina trasera Clase S',
  },
  {
    n: '05', t: 'Excursiones privadas', price: 'Desde 450 € / día',
    d: 'Versalles, valle del Loira, Champaña, Normandía, Mont-Saint-Michel, Bélgica, Suiza, Italia.',
    f: ['Itinerarios a medida en Francia y Europa', 'Guía local opcional', 'Reservas de restaurantes', 'Vehículos adaptados a viajes largos'],
    img: 'Castillo de Chenonceau',
  },
  {
    n: '06', t: 'Eventos & bodas', price: 'Cotización a medida',
    d: 'Servicio premium para bodas, galas, premieres y eventos corporativos. Cortejos, recepciones, traslados de invitados.',
    f: ['Decoración del vehículo', 'Cortejos coordinados', 'Conductor en traje', 'Servicio de protocolo'],
    img: "Cortejo Place de l'Opéra",
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
