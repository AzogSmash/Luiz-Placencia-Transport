'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

type Props = {
  paid: boolean
  customerEmail: string
  bookingRef: string | undefined
}

export default function PagoExitosoClient({ paid, customerEmail, bookingRef }: Props) {
  const { t } = useLanguage()
  const p = t.pagoExitoso

  return (
    <main className="page-enter">
      <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>

          {paid ? (
            <>
              <div className="tag" style={{ justifyContent: 'center', marginBottom: 32 }}>
                <span className="dot" /><span>{p.paidTag}</span>
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: 0, marginBottom: 24 }}>
                {p.paidHeading1}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{p.paidHeadingAccent}</em>
              </h1>
              {bookingRef && (
                <div className="mono" style={{ color: 'var(--accent)', marginBottom: 16, fontSize: 13 }}>
                  {p.bookingRef}{bookingRef}
                </div>
              )}
              <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                {p.paidLead1}{' '}
                {customerEmail
                  ? <>{p.confirmEmail} <strong style={{ color: 'var(--fg)' }}>{customerEmail}</strong>.</>
                  : p.confirmEmailFallback}
                {' '}{p.chauffeurText}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="btn btn-primary">{p.backHome}</Link>
                <a
                  href="https://wa.me/33643272173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  {p.contactWhatsApp}
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', margin: 0, marginBottom: 24 }}>
                {p.unpaidHeading}
              </h1>
              <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                {p.unpaidLead}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/reserva" className="btn btn-primary">{p.tryAgain}</Link>
                <a
                  href="https://wa.me/33643272173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  {p.whatsapp}
                </a>
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  )
}
