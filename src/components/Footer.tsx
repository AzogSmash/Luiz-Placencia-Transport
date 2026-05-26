import Link from 'next/link'
import Logo from './Logo'

const NAV_LINKS = [
  { href: '/',          label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/reserva',   label: 'Reserva' },
  { href: '/contacto',  label: 'Contacto' },
]

const SERVICES = ['Aeropuertos', 'Disneyland', 'City tour París', 'Excursiones', 'Disposición']

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line-soft)',
      padding: '64px 0 32px',
      background: 'var(--bg)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }} className="footer-grid">
          <div>
            <Logo />
            <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 20, maxWidth: 320, lineHeight: 1.6 }}>
              Chófer privado en París. Traslados, city tours y excursiones por Francia y Europa.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Navegación</div>
            {NAV_LINKS.map(link => (
              <div key={link.href} style={{ marginBottom: 8 }}>
                <Link href={link.href} style={{ fontSize: 14, color: 'var(--fg-muted)' }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Servicios</div>
            {SERVICES.map(s => (
              <div key={s} style={{ marginBottom: 8, fontSize: 14, color: 'var(--fg-muted)' }}>{s}</div>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Contacto</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 8 }}>+33 6 43 27 21 73</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 8 }}>Luisplasenciatransport@gmail.com</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>París · Île-de-France</div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid var(--line-soft)',
          fontSize: 12,
          color: 'var(--fg-dim)',
          letterSpacing: '0.04em',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>© 2026 Luis Plasencia Transport · SIRET 101 300 291 000 16</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/aviso-legal" style={{ color: 'var(--fg-dim)' }}>Aviso legal</Link>
            <Link href="/politica-privacidad" style={{ color: 'var(--fg-dim)' }}>Política de privacidad</Link>
            <Link href="/cgv" style={{ color: 'var(--fg-dim)' }}>CGV</Link>
            <span style={{ color: 'var(--line-soft)' }}>·</span>
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-casse-629242290/"
              target="_blank"
              rel="noopener noreferrer"
              title="Site réalisé par Clément Casse — c.casse92@gmail.com"
              className="credit-link"
            >
              Diseño & desarrollo
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
