'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import LogoutButton from '@/components/LogoutButton'

type Profile = {
  full_name: string
  phone: string
  address: string
  preferred_language: string
}

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'it', label: 'Italiano' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ar', label: 'العربية' },
  { value: 'zh', label: '中文' },
]

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--bg)',
  color: 'var(--fg)',
  border: '1px solid var(--line-soft)',
  padding: '10px 28px 10px 12px',
  fontFamily: 'var(--sans)',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23999' fill='none' stroke-width='1.2'/></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
}

function FeedbackBox({ type, msg }: { type: 'error' | 'success'; msg: string }) {
  const isErr = type === 'error'
  return (
    <div style={{
      padding: '12px 16px',
      background: isErr ? 'oklch(0.35 0.08 20 / 0.2)'    : 'oklch(0.65 0.16 145 / 0.12)',
      border:     `1px solid ${isErr ? 'oklch(0.55 0.12 20)' : 'oklch(0.65 0.16 145)'}`,
      fontSize: 13,
      color:      isErr ? 'oklch(0.85 0.08 20)'           : 'oklch(0.65 0.16 145)',
    }}>
      {msg}
    </div>
  )
}

export default function ComptePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId]       = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile>({
    full_name: '', phone: '', address: '', preferred_language: 'es',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUserEmail(user.email ?? null)
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, address, preferred_language')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({
          full_name:          data.full_name          ?? '',
          phone:              data.phone              ?? '',
          address:            data.address            ?? '',
          preferred_language: data.preferred_language ?? 'es',
        })
      }
    })
  }, [router])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setProfileLoading(true)
    setProfileFeedback(null)

    const supabase = createClient()
    const [{ error: dbErr }, { error: authErr }] = await Promise.all([
      supabase.from('profiles').update({
        full_name:          profile.full_name          || null,
        phone:              profile.phone              || null,
        address:            profile.address            || null,
        preferred_language: profile.preferred_language || null,
      }).eq('id', userId),
      supabase.auth.updateUser({ data: { full_name: profile.full_name } }),
    ])

    setProfileLoading(false)
    if (dbErr || authErr) {
      setProfileFeedback({ type: 'error', msg: (dbErr ?? authErr)?.message ?? 'Error al guardar.' })
    } else {
      setProfileFeedback({ type: 'success', msg: 'Datos guardados correctamente.' })
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setPwdFeedback({ type: 'error', msg: 'Las contraseñas no coinciden.' })
      return
    }
    if (password.length < 6) {
      setPwdFeedback({ type: 'error', msg: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }
    setPwdLoading(true)
    setPwdFeedback(null)

    const { error } = await createClient().auth.updateUser({ password })

    setPwdLoading(false)
    if (error) {
      setPwdFeedback({ type: 'error', msg: error.message })
    } else {
      setPassword('')
      setConfirm('')
      setPwdFeedback({ type: 'success', msg: 'Contraseña actualizada correctamente.' })
    }
  }

  if (!userEmail) return null

  return (
    <main className="page-enter">

      {/* ── Cabecera ── */}
      <section style={{
        borderBottom: '1px solid var(--line-soft)',
        padding: '40px 0',
        background: 'var(--bg-elev)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Espacio personal</div>
              <h1 style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(28px, 4vw, 52px)',
                margin: 0, fontWeight: 400,
              }}>
                Mi cuenta
              </h1>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6 }}>{userEmail}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                Panel de control
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section style={{ padding: '48px 0 96px' }}>
        <div className="container">
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 56 }}>

            {/* ── Datos personales ── */}
            <div>
              <h2 style={{
                fontFamily: 'var(--display)', fontSize: 28,
                margin: 0, marginBottom: 6, fontWeight: 400,
              }}>
                Datos personales
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Esta información se usará para agilizar sus futuras reservas.
              </p>

              <div style={{ border: '1px solid var(--line-soft)', padding: '32px' }}>
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 24,
                  }}>
                    <div className="field">
                      <label>Nombre completo</label>
                      <input
                        type="text"
                        placeholder="Carmen González"
                        value={profile.full_name}
                        onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                        autoComplete="name"
                      />
                    </div>
                    <div className="field">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Dirección
                      <span style={{ fontWeight: 400, opacity: 0.45, fontSize: 11, marginLeft: 6 }}>
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="15 rue de la Paix, 75001 París"
                      value={profile.address}
                      onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="field">
                    <label>
                      Idioma preferido
                      <span style={{ fontWeight: 400, opacity: 0.45, fontSize: 11, marginLeft: 6 }}>
                        (opcional)
                      </span>
                    </label>
                    <select
                      value={profile.preferred_language}
                      onChange={e => setProfile(p => ({ ...p, preferred_language: e.target.value }))}
                      style={SELECT_STYLE}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  {profileFeedback && (
                    <FeedbackBox type={profileFeedback.type} msg={profileFeedback.msg} />
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileLoading}
                    style={{ opacity: profileLoading ? 0.7 : 1, justifyContent: 'center', alignSelf: 'flex-start' }}
                  >
                    {profileLoading ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Contraseña ── */}
            <div>
              <h2 style={{
                fontFamily: 'var(--display)', fontSize: 28,
                margin: 0, marginBottom: 6, fontWeight: 400,
              }}>
                Contraseña
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Mínimo 6 caracteres. Deje los campos en blanco para no cambiarla.
              </p>

              <div style={{ border: '1px solid var(--line-soft)', padding: '32px' }}>
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 24,
                  }}>
                    <div className="field">
                      <label>Nueva contraseña</label>
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
                      <label>Confirmar contraseña</label>
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
                  </div>

                  {pwdFeedback && (
                    <FeedbackBox type={pwdFeedback.type} msg={pwdFeedback.msg} />
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={pwdLoading}
                    style={{ opacity: pwdLoading ? 0.7 : 1, justifyContent: 'center', alignSelf: 'flex-start' }}
                  >
                    {pwdLoading ? 'Actualizando…' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
