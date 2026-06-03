import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import AdminPanel, { type Reservation } from './AdminPanel'
import LogoutButton from '@/components/LogoutButton'
import { type AdminLog, type NotifPrefs } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Verify admin role
  const { data: profile } = await admin
    .from('profiles')
    .select('role, full_name, notif_new_reservation, notif_payment, notif_cancellation')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const [{ data: raw }, { data: rawLogs }] = await Promise.all([
    admin
      .from('reservations')
      .select('id, nom, email, telephone, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message, statut, created_at')
      .order('created_at', { ascending: false }),
    admin
      .from('admin_logs')
      .select('id, type, reservation_id, message, created_at, admin_id')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const reservations = (raw ?? []) as Reservation[]

  // Résoudre les noms des admins pour l'affichage dans les logs
  const adminIds = Array.from(new Set((rawLogs ?? []).map(l => l.admin_id).filter(Boolean))) as string[]
  const adminNameMap: Record<string, string> = {}
  await Promise.all(adminIds.map(async (aid) => {
    const [{ data: p }, { data: { user: u } }] = await Promise.all([
      admin.from('profiles').select('full_name').eq('id', aid).single(),
      admin.auth.admin.getUserById(aid),
    ])
    adminNameMap[aid] = (p?.full_name as string | null) || u?.email || 'Admin'
  }))

  const logs = ((rawLogs ?? []) as AdminLog[]).map(l => ({
    ...l,
    admin_name: l.admin_id ? (adminNameMap[l.admin_id] ?? 'Admin') : undefined,
  }))
  const notifPrefs: NotifPrefs = {
    notif_new_reservation: profile?.notif_new_reservation ?? true,
    notif_payment:         profile?.notif_payment         ?? true,
    notif_cancellation:    profile?.notif_cancellation    ?? true,
  }
  const adminName = (profile?.full_name as string | undefined) ?? user.email ?? 'Admin'

  return (
    <main className="page-enter">

      {/* ── Header ── */}
      <section style={{
        borderBottom: '1px solid var(--line-soft)',
        padding: '32px 0',
        background: 'var(--bg-elev)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div className="eyebrow">Administración</div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 10px',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
                  Admin
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(24px, 3.5vw, 44px)',
                margin: 0,
                fontWeight: 400,
              }}>
                Luis Plasencia Transport
              </h1>
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>
                {adminName} · {user.email}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                Área cliente
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Panel ── */}
      <section style={{ padding: '40px 0 96px' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <h2 style={{
              fontFamily: 'var(--display)',
              fontSize: 28,
              margin: 0,
              fontWeight: 400,
            }}>
              Reservas
            </h2>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              {reservations.length} en total · actualización en tiempo real
            </span>
          </div>

          <AdminPanel reservations={reservations} logs={logs} notifPrefs={notifPrefs} />
        </div>
      </section>
    </main>
  )
}
