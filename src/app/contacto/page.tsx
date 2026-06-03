'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendContactMessage } from '@/app/actions/contact'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import { useLanguage } from '@/contexts/LanguageContext'

const CONTACT_VALUES = [
  { v: '+33 6 43 27 21 73',                href: 'tel:+33643272173' },
  { v: '+33 6 43 27 21 73',                href: 'https://wa.me/33643272173' },
  { v: 'Luisplasenciatransport@gmail.com', href: 'mailto:Luisplasenciatransport@gmail.com' },
  { v: 'París, Île-de-France',             href: null },
]

type ContactForm = { nombre: string; email: string; mensaje: string }

export default function ContactoPage() {
  const { t } = useLanguage()
  const c = t.contacto

  const [sent, setSent]       = useState(false)
  const [form, setForm]       = useState<ContactForm>({ nombre: '', email: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [newsletter, setNewsletter] = useState('')
  const [nlLoading, setNlLoading]   = useState(false)
  const [nlStatus, setNlStatus]     = useState<'idle' | 'success' | 'error' | 'already'>('idle')

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    setNlLoading(true)
    const result = await subscribeNewsletter(newsletter)
    setNlLoading(false)
    if (result.success) {
      setNlStatus('success')
      setNewsletter('')
    } else {
      setNlStatus(result.already ? 'already' : 'error')
    }
  }

  const upd = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await sendContactMessage(form.nombre, form.email, form.mensaje)
    if (result.success) {
      setSent(true)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <main className="page-enter">
      {/* Header */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>{c.eyebrow}</div>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: 0, marginBottom: 24, maxWidth: 900 }}>
            {c.heading1} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{c.headingAccent}</em>
          </h1>
          <p className="lead">{c.lead}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="contacto-grid">

            {/* Left */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--line-soft)' }}>
                {c.items.map((item, i) => (
                  <a
                    key={i}
                    href={CONTACT_VALUES[i].href ?? undefined}
                    target={CONTACT_VALUES[i].href?.startsWith('http') ? '_blank' : undefined}
                    rel={CONTACT_VALUES[i].href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="contacto-item"
                    style={{
                      padding: '28px 32px',
                      borderTop: '1px solid var(--line-soft)',
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: 24,
                      alignItems: 'center',
                      cursor: CONTACT_VALUES[i].href ? 'pointer' : 'default',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => CONTACT_VALUES[i].href && ((e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)')}
                    onMouseLeave={e => CONTACT_VALUES[i].href && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <div className="eyebrow">{item.k}</div>
                    <div>
                      <div className="contacto-value" style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{CONTACT_VALUES[i].v}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{item.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>{c.zone}</div>
                <div
                  className="placeholder"
                  data-label="Mapa Île-de-France · cobertura"
                  style={{ backgroundImage: "url('/bg/paris.png')", aspectRatio: '16/9' }}
                />
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 16, lineHeight: 1.6 }}>
                  {c.zoneText}
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                {c.formHeading}
              </h3>
              <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>
                {c.formSub}{' '}
                <Link href="/reserva" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
                  {c.formSubLink}
                </Link>.
              </p>

              {sent ? (
                <div style={{ padding: 32, border: '1px solid var(--accent)', background: 'var(--accent-soft)' }}>
                  <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>{c.successTag}</div>
                  <p style={{ margin: 0, fontSize: 15 }}>
                    {c.successText.replace('{name}', form.nombre)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div className="field">
                    <label>{c.name}</label>
                    <input type="text" placeholder={c.namePlaceholder}
                      value={form.nombre} onChange={e => upd('nombre', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>{c.email}</label>
                    <input type="email" placeholder={c.emailPlaceholder}
                      value={form.email} onChange={e => upd('email', e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>{c.message}</label>
                    <textarea rows={5} placeholder={c.messagePlaceholder}
                      value={form.mensaje} onChange={e => upd('mensaje', e.target.value)} required />
                  </div>

                  {error && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'oklch(0.35 0.08 20 / 0.2)',
                      border: '1px solid oklch(0.55 0.12 20)',
                      fontSize: 13,
                      color: 'oklch(0.85 0.08 20)',
                    }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'start', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                    {loading ? c.sending : c.send}
                  </button>
                </form>
              )}

              {/* Newsletter */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--line-soft)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{c.newsletter}</div>
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }}>{c.newsletterSub}</p>
                {nlStatus === 'success' ? (
                  <p style={{ fontSize: 13, color: 'var(--accent)' }}>{c.newsletterSuccess}</p>
                ) : (
                  <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
                    <input
                      type="email"
                      placeholder={c.newsletterPlaceholder}
                      value={newsletter}
                      onChange={e => { setNewsletter(e.target.value); setNlStatus('idle') }}
                      required
                      style={{
                        flex: 1, background: 'transparent', border: 0, padding: '12px 0',
                        fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--fg)', outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={nlLoading}
                      style={{
                        background: 'transparent', border: 0, color: 'var(--accent)',
                        padding: '12px 16px', cursor: nlLoading ? 'wait' : 'pointer',
                        fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontFamily: 'var(--sans)', opacity: nlLoading ? 0.6 : 1,
                      }}
                    >
                      {nlLoading ? '…' : c.newsletterBtn}
                    </button>
                  </form>
                )}
                {(nlStatus === 'error' || nlStatus === 'already') && (
                  <p style={{ fontSize: 12, color: nlStatus === 'already' ? 'var(--fg-muted)' : 'oklch(0.85 0.08 20)', marginTop: 8 }}>
                    {nlStatus === 'already' ? c.newsletterAlready : c.newsletterError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
