'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'
  const { t } = useLanguage()
  const a = t.auth.login

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? a.invalidCredentials
          : error.message,
      )
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <label style={{ marginBottom: 0 }}>{a.password}</label>
          <Link
            href="/mot-de-passe-oublie"
            style={{ fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.04em' }}
          >
            {a.forgotPassword}
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
  )
}

function LoginPageInner() {
  const { t } = useLanguage()
  const a = t.auth.login

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

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--fg-muted)' }}>
          {a.noAccount}{' '}
          <Link href="/register" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
            {a.createAccount}
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
