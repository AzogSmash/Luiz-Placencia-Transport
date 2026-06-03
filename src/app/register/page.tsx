'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'
  const { t } = useLanguage()
  const a = t.auth.register

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
      setError(a.passwordTooShort)
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
      router.push(redirectTo)
      router.refresh()
    } else {
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
            <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--accent)' }}>{a.confirmationTag}</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 16, fontWeight: 400 }}>
              {a.confirmationHeading}
            </h2>
            <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6 }}>
              {a.confirmationText}{' '}
              <strong style={{ color: 'var(--fg)' }}>{email}</strong>.{' '}
              {a.confirmationText2}
            </p>
          </div>
          <p style={{ marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
            <Link href="/login" style={{ color: 'var(--accent)' }}>{a.backToLogin}</Link>
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
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 38, margin: 0, marginBottom: 8, fontWeight: 400 }}>
            {a.heading}
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 36 }}>
            {a.sub}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="field">
              <label>{a.name}</label>
              <input
                type="text"
                placeholder={a.namePlaceholder}
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="field">
              <label>{a.email}</label>
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
              <label>{a.password}</label>
              <input
                type="password"
                placeholder={a.passwordPlaceholder}
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
              {loading ? a.submitting : a.submit}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
          {a.hasAccount}{' '}
          <Link href="/login" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
            {a.signIn}
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
