import { bg } from '@/lib/images'

const FLEET = [
  { name: 'Mercedes Clase E', cat: 'Berlina',           pax: '1–3', bag: '3', desc: 'Comodidad y discreción para trayectos urbanos y traslados.' },
  { name: 'Mercedes Clase V', cat: 'Van premium',       pax: '1–7', bag: '7', desc: 'Familias, equipos y grupos. Espacio generoso, asientos en cuero.' },
  { name: 'Mercedes Clase S', cat: 'Berlina ejecutiva', pax: '1–3', bag: '2', desc: 'Para clientes ejecutivos y trayectos largos. Lo más alto de gama.' },
]

export default function Fleet() {
  return (
    <section className="section" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">Flota</div>
          <div>
            <h2>Vehículos<br/>seleccionados.</h2>
            <p className="lead" style={{ marginTop: 24 }}>
              Cada vehículo es revisado, lavado y preparado antes de cada trayecto. Wi-Fi a bordo,
              agua mineral, cargadores y un trato impecable.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="fleet-grid">
          {FLEET.map(v => (
            <div key={v.name} style={{
              border: '1px solid var(--line-soft)',
              background: 'var(--bg)',
            }}>
              <div className="placeholder" data-label={v.name} style={{ ...bg(v.name), aspectRatio: '4/3' }} />
              <div style={{ padding: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{v.cat}</div>
                <h3 style={{
                  fontFamily: 'var(--display)',
                  fontSize: 26,
                  margin: 0,
                  marginBottom: 16,
                  fontWeight: 400,
                }}>{v.name}</h3>
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
                    <div style={{ color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 10, marginBottom: 4 }}>Pax</div>
                    <div className="mono">{v.pax}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 10, marginBottom: 4 }}>Equipaje</div>
                    <div className="mono">{v.bag}</div>
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
