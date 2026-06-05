'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const rp = t.resetPassword
  const [ready, setReady]       = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/mot-de-passe-oublie')
      else setReady(true)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError(rp.passwordMismatch)
      return
    }
    if (password.length < 6) {
      setError(rp.passwordTooShort)
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await createClient().auth.updateUser({ password })

    setLoading(false)
    if (error) { setError(error.message); return }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (!ready) return null

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

          {done ? (
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
                {rp.doneHeading}
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>
                {rp.doneText}
              </p>
            </div>
          ) : (
            <>
              <h1 style={{
                fontFamily: 'var(--display)', fontSize: 38,
                margin: 0, marginBottom: 8, fontWeight: 400,
              }}>
                {rp.heading}
              </h1>
              <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
                {rp.sub}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="field">
                  <label>{rp.newPassword}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="field">
                  <label>{rp.confirmPassword}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                  {loading ? rp.submitting : rp.submit}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </main>
  )
}
