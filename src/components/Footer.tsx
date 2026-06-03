'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 20, maxWidth: 320, lineHeight: 1.6 }}>
              {f.description}
            </p>
          </div>

          <div className="footer-col-nav">
            <div className="eyebrow" style={{ marginBottom: 18 }}>{f.navTitle}</div>
            {f.navLinks.map(link => (
              <div key={link.href} style={{ marginBottom: 8 }}>
                <Link href={link.href} style={{ fontSize: 14, color: 'var(--fg-muted)' }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="footer-col-nav">
            <div className="eyebrow" style={{ marginBottom: 18 }}>{f.servicesTitle}</div>
            {f.servicesList.map(s => (
              <div key={s} style={{ marginBottom: 8, fontSize: 14, color: 'var(--fg-muted)' }}>{s}</div>
            ))}
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{f.contactTitle}</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 8 }}>+33 6 43 27 21 73</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 8 }}>Luisplasenciatransport@gmail.com</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>París · Île-de-France</div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Luis Plasencia Transport · SIRET 101 300 291 000 16</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/aviso-legal" style={{ color: 'var(--fg-dim)' }}>{f.legal}</Link>
            <Link href="/politica-privacidad" style={{ color: 'var(--fg-dim)' }}>{f.privacy}</Link>
            <Link href="/cgv" style={{ color: 'var(--fg-dim)' }}>{f.cgv}</Link>
            <span style={{ color: 'var(--line-soft)' }}>·</span>
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-casse-629242290/"
              target="_blank" rel="noopener noreferrer"
              title="Site réalisé par Clément Casse — c.casse92@gmail.com"
              className="credit-link"
            >
              {f.design}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
