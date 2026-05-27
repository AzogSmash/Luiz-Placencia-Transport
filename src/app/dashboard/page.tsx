import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import LogoutButton from '@/components/LogoutButton'

type Reservation = {
  id: number
  adresse_depart: string
  adresse_arrivee: string
  date_heure: string
  nombre_passagers: number
  message: string | null
  statut: string
  created_at: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'en attente': { label: 'En espera',   color: 'oklch(0.78 0.09 85)',  bg: 'oklch(0.78 0.09 85 / 0.12)'  },
  'confirmée':  { label: 'Confirmada',  color: 'oklch(0.65 0.16 145)', bg: 'oklch(0.65 0.16 145 / 0.12)' },
  'en cours':   { label: 'En curso',    color: 'oklch(0.62 0.10 240)', bg: 'oklch(0.62 0.10 240 / 0.12)' },
  'terminée':   { label: 'Finalizada',  color: 'var(--fg-dim)',        bg: 'var(--bg-soft)'               },
  'annulée':    { label: 'Cancelada',   color: 'oklch(0.65 0.14 20)',  bg: 'oklch(0.65 0.14 20 / 0.12)'  },
}

function StatusBadge({ statut }: { statut: string }) {
  const s = STATUS_MAP[statut] ?? STATUS_MAP['en attente']
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.color}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function extractUserMessage(message: string | null) {
  if (!message) return null
  const parts = message.split(' | ')
  return parts.find(p => !p.startsWith('Service:') && !p.startsWith('Véhicule:') && !p.startsWith('Bagages:')) ?? null
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check admin role (non-blocking — null if profiles table not ready)
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin'

  const { data: raw } = await supabase
    .from('reservations')
    .select('id, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message, statut, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const reservations = (raw ?? []) as Reservation[]
  const pending   = reservations.filter(r => r.statut === 'en attente').length
  const confirmed = reservations.filter(r => r.statut === 'confirmée').length
  const userName  = (user.user_metadata?.full_name as string | undefined)
    ?? user.email?.split('@')[0]
    ?? 'Cliente'

  return (
    <main className="page-enter">

      {/* ── Header ── */}
      <section style={{
        borderBottom: '1px solid var(--line-soft)',
        padding: '40px 0',
        background: 'var(--bg-elev)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Espacio personal</div>
              <h1 style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(28px, 4vw, 52px)',
                margin: 0,
                fontWeight: 400,
              }}>
                Bienvenido,{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{userName}.</em>
              </h1>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6 }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {isAdmin && (
                <Link href="/admin" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                  Panel Admin
                </Link>
              )}
              <Link href="/compte" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                Mi cuenta
              </Link>
              <Link href="/reserva" className="btn btn-primary">Nueva reserva</Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderBottom: '1px solid var(--line-soft)', padding: '28px 0' }}>
        <div className="container">
          <div className="dashboard-stats" style={{
            gap: 1,
            background: 'var(--line-soft)',
            border: '1px solid var(--line-soft)',
          }}>
            {[
              { k: 'Reservas totales', v: reservations.length },
              { k: 'En espera',        v: pending },
              { k: 'Confirmadas',      v: confirmed },
            ].map(s => (
              <div key={s.k} style={{ background: 'var(--bg)', padding: '20px 32px' }}>
                <div style={{
                  fontFamily: 'var(--display)',
                  fontSize: 40,
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: 6,
                }}>{s.v}</div>
                <div className="eyebrow">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reservations list ── */}
      <section style={{ padding: '48px 0 96px' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--display)',
            fontSize: 32,
            margin: 0,
            marginBottom: 32,
            fontWeight: 400,
          }}>
            Mis reservas
          </h2>

          {reservations.length === 0 ? (
            <div style={{
              padding: '64px 40px',
              border: '1px solid var(--line-soft)',
              textAlign: 'center',
            }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Sin reservas</div>
              <p style={{ color: 'var(--fg-muted)', marginBottom: 28 }}>
                No tiene ninguna reserva registrada con esta cuenta.
              </p>
              <Link href="/reserva" className="btn btn-primary">Reservar ahora</Link>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              background: 'var(--line-soft)',
              border: '1px solid var(--line-soft)',
            }}>
              {reservations.map(r => {
                const userMsg = extractUserMessage(r.message)
                return (
                  <article key={r.id} className="dashboard-res-card" style={{ background: 'var(--bg)' }}>
                    {/* ID + date created */}
                    <div>
                      <div className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>
                        #{r.id}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--fg-dim)', marginTop: 4, letterSpacing: '0.04em' }}>
                        {new Date(r.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    {/* Route + details */}
                    <div>
                      <div style={{
                        fontFamily: 'var(--display)',
                        fontSize: 19,
                        fontWeight: 400,
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}>
                        {r.adresse_depart}
                        <span style={{ color: 'var(--accent)', margin: '0 8px' }}>→</span>
                        {r.adresse_arrivee}
                      </div>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                          {formatDate(r.date_heure)}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                          {r.nombre_passagers} pasajero{r.nombre_passagers > 1 ? 's' : ''}
                        </span>
                      </div>
                      {userMsg && (
                        <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginTop: 4 }}>
                          {userMsg}
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="dashboard-res-status">
                      <StatusBadge statut={r.statut} />
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
