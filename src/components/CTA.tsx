import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section">
      <div className="container">
        <div style={{
          position: 'relative',
          padding: '80px 64px',
          border: '1px solid var(--line)',
          textAlign: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 100%, var(--accent-soft), transparent 60%)',
            opacity: 0.6,
            pointerEvents: 'none',
          }} />
          <div className="eyebrow" style={{ marginBottom: 24, position: 'relative' }}>
            ¿Preparado para su próximo trayecto?
          </div>
          <h2 className="display" style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            margin: 0,
            marginBottom: 32,
            maxWidth: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative',
          }}>
            Reserve en 60 segundos.<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Confirmación inmediata.</em>
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/reserva" className="btn btn-primary">Solicitar presupuesto</Link>
            <a href="https://wa.me/33643272173" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              WhatsApp directo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
