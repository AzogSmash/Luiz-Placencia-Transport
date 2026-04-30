'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import Logo from '@/components/Logo'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <main className="page-enter" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
          <Link href="/"><Logo /></Link>
        </div>

        <div style={{ border: '1px solid var(--line-soft)', padding: '40px 40px 36px' }}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'oklch(0.65 0.16 145 / 0.12)',
                border: '1px solid oklch(0.65 0.16 145)',
                color: 'oklch(0.65 0.16 145)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: 22,
              }}>✓</div>
              <h1 style={{
                fontFamily: 'var(--display)', fontSize: 32,
                margin: 0, marginBottom: 12, fontWeight: 400,
              }}>
                Correo enviado
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                Hemos enviado un enlace de restablecimiento a{' '}
                <strong style={{ color: 'var(--fg)' }}>{email}</strong>.
                Revise también su carpeta de spam.
              </p>
              <Link href="/login" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{
                fontFamily: 'var(--display)', fontSize: 38,
                margin: 0, marginBottom: 8, fontWeight: 400,
              }}>
                ¿Olvidó su<br />contraseña?
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
                Introduzca su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="field">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="carmen@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'oklch(0.35 0.08 20 / 0.2)',
                    border: '1px solid oklch(0.55 0.12 20)',
                    fontSize: 13, color: 'oklch(0.85 0.08 20)',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1, justifyContent: 'center' }}
                >
                  {loading ? 'Enviando…' : 'Enviar enlace'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
          <Link href="/login" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
            Volver al inicio de sesión
          </Link>
        </p>

      </div>
    </main>
  )
}
