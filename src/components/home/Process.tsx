const STEPS = [
  { n: '01', t: 'Solicite',            d: 'Por formulario, teléfono o WhatsApp. Respuesta en menos de 30 minutos.' },
  { n: '02', t: 'Confirmación',        d: 'Presupuesto detallado, sin sorpresas. Pago seguro o a bordo.' },
  { n: '03', t: 'Su chófer le espera', d: 'Cartel personalizado, seguimiento de vuelo, asistencia con el equipaje.' },
  { n: '04', t: 'Disfrute',            d: 'Wi-Fi, agua, climatización a su gusto. Llegue a su destino en plena forma.' },
]

export default function Process() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">El método</div>
          <div>
            <h2>Sencillo, transparente,<br/>impecable.</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="process-grid">
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              padding: '32px 28px 32px 0',
              borderTop: '1px solid var(--accent)',
              marginRight: i < 3 ? 24 : 0,
            }}>
              <div className="mono" style={{ color: 'var(--accent)', marginBottom: 20 }}>{s.n}</div>
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
