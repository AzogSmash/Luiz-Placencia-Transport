'use client'

import { useState } from 'react'
import Link from 'next/link'

type ContactForm = { nombre: string; email: string; mensaje: string }

const CONTACT_ITEMS = [
  { k: 'Teléfono',  v: '+33 6 00 00 00 00',       sub: 'Disponible 24/7',            href: 'tel:+33600000000' },
  { k: 'WhatsApp',  v: '+33 6 00 00 00 00',       sub: 'Respuesta en minutos',        href: 'https://wa.me/33600000000' },
  { k: 'Email',     v: 'contacto@lp-transport.fr', sub: 'Respuesta en menos de 1 h',  href: 'mailto:contacto@lp-transport.fr' },
  { k: 'Dirección', v: 'París, Île-de-France',     sub: 'Servicio en toda Francia y Europa', href: null },
]

export default function ContactoPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState<ContactForm>({ nombre: '', email: '', mensaje: '' })
  const [newsletter, setNewsletter] = useState('')

  const upd = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <main className="page-enter">
      {/* Header */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Contacto</div>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: 0, marginBottom: 24, maxWidth: 900 }}>
            Estamos a su <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>disposición.</em>
          </h1>
          <p className="lead">
            Llámenos, escríbanos por WhatsApp o utilice el formulario. Atendemos las 24 horas, todos los días del año.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="contacto-grid">

            {/* Left — contact info + map */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--line-soft)' }}>
                {CONTACT_ITEMS.map(c => (
                  <a
                    key={c.k}
                    href={c.href ?? undefined}
                    target={c.href?.startsWith('http') ? '_blank' : undefined}
                    rel={c.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      padding: '28px 32px',
                      borderTop: '1px solid var(--line-soft)',
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: 24,
                      alignItems: 'center',
                      cursor: c.href ? 'pointer' : 'default',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => c.href && ((e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)')}
                    onMouseLeave={e => c.href && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <div className="eyebrow">{c.k}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{c.v}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{c.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Zona de servicio</div>
                <div
                  className="placeholder"
                  data-label="Mapa Île-de-France · cobertura"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&q=80&auto=format&fit=crop')",
                    aspectRatio: '16/9',
                  }}
                />
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 16, lineHeight: 1.6 }}>
                  París · Île-de-France · Disneyland · Versalles · Aeropuertos CDG, Orly, Beauvais, Le Bourget ·
                  Estaciones Gare du Nord, Lyon, Montparnasse · Toda Francia · Bélgica · Suiza · Italia · España.
                </p>
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                Envíenos un mensaje
              </h3>
              <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>
                Para reservas, utilice{' '}
                <Link href="/reserva" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
                  el formulario de reserva
                </Link>.
              </p>

              {sent ? (
                <div style={{ padding: 32, border: '1px solid var(--accent)', background: 'var(--accent-soft)' }}>
                  <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>✓ Mensaje enviado</div>
                  <p style={{ margin: 0, fontSize: 15 }}>
                    Gracias {form.nombre}. Le contestaremos a la mayor brevedad.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div className="field">
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Carmen González"
                      value={form.nombre} onChange={e => upd('nombre', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" placeholder="carmen@correo.com"
                      value={form.email} onChange={e => upd('email', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Mensaje</label>
                    <textarea rows={5} placeholder="¿Cómo podemos ayudarle?"
                      value={form.mensaje} onChange={e => upd('mensaje', e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ alignSelf: 'start' }} onClick={() => setSent(true)}>
                    Enviar mensaje
                  </button>
                </div>
              )}

              {/* Newsletter */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--line-soft)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Newsletter</div>
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }}>
                  Recomendaciones para sus visitas en París, novedades, ofertas exclusivas.
                </p>
                <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
                  <input
                    type="email"
                    placeholder="Su correo electrónico"
                    value={newsletter}
                    onChange={e => setNewsletter(e.target.value)}
                    style={{
                      flex: 1, background: 'transparent', border: 0, padding: '12px 0',
                      fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--fg)', outline: 'none',
                    }}
                  />
                  <button style={{
                    background: 'transparent', border: 0, color: 'var(--accent)',
                    padding: '12px 16px', cursor: 'pointer', fontSize: 13, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontFamily: 'var(--sans)',
                  }}>
                    Suscribirse →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
