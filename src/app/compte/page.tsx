'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import LogoutButton from '@/components/LogoutButton'
import PhoneInput, { parsePhone } from '@/components/PhoneInput'
import { updateClientNotifPrefs } from '@/app/actions/compte'

type Profile = {
  full_name: string
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

  // Profile
  const [profile, setProfile] = useState<Profile>({ full_name: '', address: '', preferred_language: 'es' })
  const [phonePrefix, setPhonePrefix] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profileLoading, setProfileLoading]   = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  // Email change
  const [newEmail, setNewEmail]       = useState('')
  const [emailLoading, setEmailLoading]   = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  // Password
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [pwdLoading, setPwdLoading]   = useState(false)
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  // Notifications
  const [notifEmails, setNotifEmails] = useState(true)
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifFeedback, setNotifFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUserEmail(user.email ?? null)
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, address, preferred_language, notif_emails')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({
          full_name:          data.full_name          ?? '',
          address:            data.address            ?? '',
          preferred_language: data.preferred_language ?? 'es',
        })
        const parsed = parsePhone(data.phone ?? '')
        setPhonePrefix(parsed.prefix)
        setPhoneNumber(parsed.number)
        setNotifEmails(data.notif_emails !== false)
      }
    })
  }, [router])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setProfileLoading(true)
    setProfileFeedback(null)

    const phone = `${phonePrefix} ${phoneNumber}`.trim()
    const supabase = createClient()
    const [{ error: dbErr }, { error: authErr }] = await Promise.all([
      supabase.from('profiles').update({
        full_name:          profile.full_name          || null,
        phone:              phone                      || null,
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

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setEmailLoading(true)
    setEmailFeedback(null)

    const { error } = await createClient().auth.updateUser({ email: newEmail.trim() })

    setEmailLoading(false)
    if (error) {
      setEmailFeedback({ type: 'error', msg: error.message })
    } else {
      setEmailFeedback({
        type: 'success',
        msg: `Hemos enviado un enlace de confirmación a ${newEmail}. Su email cambiará al hacer clic en el enlace.`,
      })
      setNewEmail('')
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

  async function handleNotifSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNotifLoading(true)
    setNotifFeedback(null)
    const result = await updateClientNotifPrefs(notifEmails)
    setNotifLoading(false)
    if (!result.success) {
      setNotifFeedback({ type: 'error', msg: result.error })
    } else {
      setNotifFeedback({ type: 'success', msg: 'Preferencias guardadas correctamente.' })
    }
  }

  if (!userEmail) return null

  return (
    <main className="page-enter">

      {/* ── Cabecera ── */}
      <section style={{ borderBottom: '1px solid var(--line-soft)', padding: '40px 0', background: 'var(--bg-elev)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Espacio personal</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 52px)', margin: 0, fontWeight: 400 }}>
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
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 6, fontWeight: 400 }}>
                Datos personales
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Esta información se usará para agilizar sus futuras reservas.
              </p>
              <div style={{ border: '1px solid var(--line-soft)', padding: 32 }}>
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
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
                      <PhoneInput
                        prefix={phonePrefix}
                        number={phoneNumber}
                        onPrefixChange={setPhonePrefix}
                        onNumberChange={setPhoneNumber}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Dirección
                      <span style={{ fontWeight: 400, opacity: 0.45, fontSize: 11, marginLeft: 6 }}>(opcional)</span>
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
                      <span style={{ fontWeight: 400, opacity: 0.45, fontSize: 11, marginLeft: 6 }}>(opcional)</span>
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

                  {profileFeedback && <FeedbackBox type={profileFeedback.type} msg={profileFeedback.msg} />}

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

            {/* ── Correo electrónico ── */}
            <div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 6, fontWeight: 400 }}>
                Correo electrónico
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Email actual: <strong style={{ color: 'var(--fg)' }}>{userEmail}</strong>
              </p>
              <div style={{ border: '1px solid var(--line-soft)', padding: 32 }}>
                <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="field">
                    <label>Nuevo correo electrónico</label>
                    <input
                      type="email"
                      placeholder="nuevo@correo.com"
                      value={newEmail}
                      onChange={e => { setNewEmail(e.target.value); setEmailFeedback(null) }}
                      required
                      autoComplete="email"
                    />
                  </div>

                  {emailFeedback && <FeedbackBox type={emailFeedback.type} msg={emailFeedback.msg} />}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={emailLoading || !newEmail}
                    style={{ opacity: emailLoading ? 0.7 : 1, justifyContent: 'center', alignSelf: 'flex-start' }}
                  >
                    {emailLoading ? 'Enviando…' : 'Cambiar correo'}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Contraseña ── */}
            <div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 6, fontWeight: 400 }}>
                Contraseña
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Mínimo 6 caracteres.
              </p>
              <div style={{ border: '1px solid var(--line-soft)', padding: 32 }}>
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
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

                  {pwdFeedback && <FeedbackBox type={pwdFeedback.type} msg={pwdFeedback.msg} />}

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

            {/* ── Notificaciones ── */}
            <div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, margin: 0, marginBottom: 6, fontWeight: 400 }}>
                Notificaciones
              </h2>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 28 }}>
                Gestione los correos de seguimiento que le enviamos sobre el estado de sus reservas.
              </p>
              <div style={{ border: '1px solid var(--line-soft)', padding: 32 }}>
                <form onSubmit={handleNotifSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    gap: 20, cursor: 'pointer',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                        Recibir actualizaciones de mis reservas por email
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                        Le notificaremos cuando el estado de su reserva cambie (confirmada, cancelada, etc.).
                        Siempre enviamos la confirmación inicial de su solicitud.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmails}
                      onChange={e => setNotifEmails(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
                    />
                  </label>

                  {notifFeedback && <FeedbackBox type={notifFeedback.type} msg={notifFeedback.msg} />}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={notifLoading}
                    style={{ opacity: notifLoading ? 0.7 : 1, justifyContent: 'center', alignSelf: 'flex-start' }}
                  >
                    {notifLoading ? 'Guardando…' : 'Guardar preferencias'}
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
