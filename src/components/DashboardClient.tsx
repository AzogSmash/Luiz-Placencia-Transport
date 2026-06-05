'use client'

import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import { useLanguage } from '@/contexts/LanguageContext'

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

type Props = {
  user: { id: string; email: string; name: string }
  reservations: Reservation[]
  pending: number
  confirmed: number
  isAdmin: boolean
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  'en attente': { color: 'oklch(0.78 0.09 85)',  bg: 'oklch(0.78 0.09 85 / 0.12)'  },
  'confirmée':  { color: 'oklch(0.65 0.16 145)', bg: 'oklch(0.65 0.16 145 / 0.12)' },
  'en cours':   { color: 'oklch(0.62 0.10 240)', bg: 'oklch(0.62 0.10 240 / 0.12)' },
  'terminée':   { color: 'var(--fg-dim)',        bg: 'var(--bg-soft)'               },
  'annulée':    { color: 'oklch(0.65 0.14 20)',  bg: 'oklch(0.65 0.14 20 / 0.12)'  },
}

function extractUserMessage(message: string | null) {
  if (!message) return null
  const parts = message.split(' | ')
  return parts.find(p => !p.startsWith('Service:') && !p.startsWith('Véhicule:') && !p.startsWith('Bagages:')) ?? null
}

function StatusBadge({ statut, label }: { statut: string; label: string }) {
  const colors = STATUS_COLORS[statut] ?? STATUS_COLORS['en attente']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', fontSize: 10, fontWeight: 500,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      background: colors.bg, color: colors.color,
      border: `1px solid ${colors.color}`, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.color, flexShrink: 0 }} />
      {label}
    </span>
  )
}

export default function DashboardClient({ user, reservations, pending, confirmed, isAdmin }: Props) {
  const { t } = useLanguage()
  const d = t.dashboard

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(d.locale, {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <main className="page-enter">

      {/* ── Header ── */}
      <section style={{ borderBottom: '1px solid var(--line-soft)', padding: '40px 0', background: 'var(--bg-elev)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{d.eyebrow}</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 52px)', margin: 0, fontWeight: 400 }}>
                {d.welcome}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{user.name}.</em>
              </h1>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6 }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {isAdmin && (
                <Link href="/admin" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                  {d.adminPanel}
                </Link>
              )}
              <Link href="/compte" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                {d.myAccount}
              </Link>
              <Link href="/reserva" className="btn btn-primary">{d.newBooking}</Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderBottom: '1px solid var(--line-soft)', padding: '28px 0' }}>
        <div className="container">
          <div className="dashboard-stats" style={{ gap: 1, background: 'var(--line-soft)', border: '1px solid var(--line-soft)' }}>
            {[
              { k: d.totalBookings, v: reservations.length },
              { k: d.pending,       v: pending },
              { k: d.confirmed,     v: confirmed },
            ].map(s => (
              <div key={s.k} style={{ background: 'var(--bg)', padding: '20px 32px' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 40, fontWeight: 400, lineHeight: 1, marginBottom: 6 }}>
                  {s.v}
                </div>
                <div className="eyebrow">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reservations ── */}
      <section style={{ padding: '48px 0 96px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 32, fontWeight: 400 }}>
            {d.myBookings}
          </h2>

          {reservations.length === 0 ? (
            <div style={{ padding: '64px 40px', border: '1px solid var(--line-soft)', textAlign: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{d.noBookings}</div>
              <p style={{ color: 'var(--fg-muted)', marginBottom: 28 }}>{d.noBookingsText}</p>
              <Link href="/reserva" className="btn btn-primary">{d.bookNow}</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line-soft)', border: '1px solid var(--line-soft)' }}>
              {reservations.map(r => {
                const userMsg = extractUserMessage(r.message)
                const statusLabel = d.statusLabels[r.statut] ?? d.statusLabels['en attente']
                return (
                  <article key={r.id} className="dashboard-res-card" style={{ background: 'var(--bg)' }}>
                    <div>
                      <div className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>#{r.id}</div>
                      <div style={{ fontSize: 10, color: 'var(--fg-dim)', marginTop: 4, letterSpacing: '0.04em' }}>
                        {new Date(r.created_at).toLocaleDateString(d.locale)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 19, fontWeight: 400, marginBottom: 6, lineHeight: 1.2 }}>
                        {r.adresse_depart}
                        <span style={{ color: 'var(--accent)', margin: '0 8px' }}>→</span>
                        {r.adresse_arrivee}
                      </div>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{formatDate(r.date_heure)}</span>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                          {r.nombre_passagers} {r.nombre_passagers > 1 ? d.passengerPlural : d.passengerSingle}
                        </span>
                      </div>
                      {userMsg && <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginTop: 4 }}>{userMsg}</div>}
                    </div>
                    <div className="dashboard-res-status">
                      <StatusBadge statut={r.statut} label={statusLabel} />
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
