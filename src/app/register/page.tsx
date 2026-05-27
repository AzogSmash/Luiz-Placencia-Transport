'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Logo from '@/components/Logo'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Email confirmation disabled — user is logged in directly
      router.push(redirectTo)
      router.refresh()
    } else {
      // Email confirmation required
      setConfirmationSent(true)
      setLoading(false)
    }
  }

  if (confirmationSent) {
    return (
      <main className="page-enter" style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
            <Link href="/"><Logo /></Link>
          </div>
          <div style={{ border: '1px solid var(--accent)', padding: '40px', background: 'var(--accent-soft)' }}>
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--accent)' }}>✓ Cuenta creada</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 16, fontWeight: 400 }}>
              Verifique su correo
            </h2>
            <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Hemos enviado un enlace de confirmación a{' '}
              <strong style={{ color: 'var(--fg)' }}>{email}</strong>.
              Haga clic en el enlace para activar su cuenta.
            </p>
          </div>
          <p style={{ marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
            <Link href="/login" style={{ color: 'var(--accent)' }}>Volver a inicio de sesión</Link>
          </p>
        </div>
      </main>
    )
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
          <h1 style={{
            fontFamily: 'var(--display)',
            fontSize: 38,
            margin: 0,
            marginBottom: 8,
            fontWeight: 400,
          }}>
            Crear cuenta
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 36 }}>
            Gestione sus reservas y acceda a su historial de trayectos.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="field">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Carmen González"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="carmen@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, justifyContent: 'center' }}
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
          ¿Ya tiene cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
