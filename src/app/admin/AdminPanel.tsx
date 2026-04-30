'use client'

import { useState } from 'react'
import { updateReservationStatus } from '@/app/actions/admin'

export type Reservation = {
  id: number
  nom: string
  email: string
  telephone: string
  adresse_depart: string
  adresse_arrivee: string
  date_heure: string
  nombre_passagers: number
  message: string | null
  statut: string
  created_at: string
}

const STATUSES = ['en attente', 'confirmée', 'en cours', 'terminée', 'annulée'] as const

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  'en attente': { color: 'oklch(0.78 0.09 85)',  bg: 'oklch(0.78 0.09 85 / 0.15)',  label: 'En espera'  },
  'confirmée':  { color: 'oklch(0.65 0.16 145)', bg: 'oklch(0.65 0.16 145 / 0.15)', label: 'Confirmada' },
  'en cours':   { color: 'oklch(0.62 0.10 240)', bg: 'oklch(0.62 0.10 240 / 0.15)', label: 'En curso'   },
  'terminée':   { color: 'var(--fg-muted)',       bg: 'var(--bg-soft)',               label: 'Finalizada' },
  'annulée':    { color: 'oklch(0.65 0.14 20)',   bg: 'oklch(0.65 0.14 20 / 0.15)',  label: 'Cancelada'  },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function truncate(s: string, n = 28) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export default function AdminPanel({ reservations: initial }: { reservations: Reservation[] }) {
  const [filter, setFilter]   = useState('todos')
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(initial.map(r => [r.id, r.statut])),
  )
  const [updating, setUpdating] = useState<Set<number>>(new Set())
  const [errors, setErrors]     = useState<Record<number, string>>({})

  const filtered = filter === 'todos'
    ? initial
    : initial.filter(r => r.statut === filter)

  const counts: Record<string, number> = { todos: initial.length }
  STATUSES.forEach(s => { counts[s] = initial.filter(r => r.statut === s).length })

  async function handleStatusChange(id: number, newStatut: string) {
    const prev = statuses[id]
    setStatuses(s => ({ ...s, [id]: newStatut }))
    setUpdating(u => new Set(u).add(id))
    setErrors(e => { const n = { ...e }; delete n[id]; return n })

    const result = await updateReservationStatus(id, newStatut)

    setUpdating(u => { const n = new Set(u); n.delete(id); return n })
    if (!result.success) {
      setStatuses(s => ({ ...s, [id]: prev }))
      setErrors(e => ({ ...e, [id]: result.error }))
    }
  }

  const FILTER_TABS = [
    { id: 'todos', label: 'Todos' },
    ...STATUSES.map(s => ({ id: s, label: STATUS_STYLE[s].label })),
  ]

  return (
    <div>
      {/* ── Stats ── */}
      <div style={{
        display: 'flex',
        gap: 1,
        background: 'var(--line-soft)',
        border: '1px solid var(--line-soft)',
        marginBottom: 32,
        flexWrap: 'wrap',
      }}>
        {FILTER_TABS.map(t => {
          const st = STATUS_STYLE[t.id]
          return (
            <div key={t.id} style={{ background: 'var(--bg)', padding: '16px 24px', minWidth: 100 }}>
              <div style={{
                fontFamily: 'var(--display)',
                fontSize: 32,
                fontWeight: 400,
                color: st?.color ?? 'var(--fg)',
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {counts[t.id] ?? 0}
              </div>
              <div className="eyebrow">{t.label}</div>
            </div>
          )
        })}
      </div>

      {/* ── Filter tabs ── */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--line-soft)',
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {FILTER_TABS.map(t => {
          const active = filter === t.id
          const st = STATUS_STYLE[t.id]
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 0,
                borderBottom: active
                  ? `2px solid ${st?.color ?? 'var(--accent)'}`
                  : '2px solid transparent',
                color: active ? (st?.color ?? 'var(--fg)') : 'var(--fg-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}{' '}
              <span style={{ opacity: 0.6 }}>({counts[t.id] ?? 0})</span>
            </button>
          )
        })}
      </div>

      {/* ── Table header ── */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '48px 32px',
          border: '1px solid var(--line-soft)',
          textAlign: 'center',
          color: 'var(--fg-muted)',
          fontSize: 14,
        }}>
          No hay reservas para este filtro.
        </div>
      ) : (
        <div style={{ border: '1px solid var(--line-soft)', overflowX: 'auto' }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 120px 1.4fr 110px 50px 160px',
            gap: 0,
            background: 'var(--bg-soft)',
            borderBottom: '1px solid var(--line-soft)',
            padding: '10px 16px',
            minWidth: 820,
          }}>
            {['#', 'Cliente', 'Teléfono', 'Trayecto', 'Fecha', 'Pax', 'Estado'].map(h => (
              <div key={h} className="eyebrow" style={{ paddingRight: 12 }}>{h}</div>
            ))}
          </div>

          {/* Data rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line-soft)', minWidth: 820 }}>
            {filtered.map(r => {
              const currentStatut = statuses[r.id] ?? r.statut
              const isUpdating    = updating.has(r.id)
              const errorMsg      = errors[r.id]
              const st            = STATUS_STYLE[currentStatut] ?? STATUS_STYLE['en attente']

              return (
                <div
                  key={r.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 1.4fr 110px 50px 160px',
                    gap: 0,
                    background: isUpdating ? 'var(--bg-soft)' : 'var(--bg)',
                    padding: '14px 16px',
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {/* ID */}
                  <div className="mono" style={{ color: 'var(--accent)', fontSize: 12, paddingRight: 12 }}>
                    #{r.id}
                  </div>

                  {/* Client */}
                  <div style={{ paddingRight: 12, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{r.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.email}
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)', paddingRight: 12 }}>
                    {r.telephone}
                  </div>

                  {/* Trayecto */}
                  <div style={{ paddingRight: 12, minWidth: 0 }}>
                    <div style={{ fontSize: 12, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {truncate(r.adresse_depart)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--accent)', marginRight: 4 }}>→</span>
                      {truncate(r.adresse_arrivee)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)', paddingRight: 12, lineHeight: 1.5 }}>
                    {fmt(r.date_heure)}
                  </div>

                  {/* Passagers */}
                  <div style={{ fontSize: 13, textAlign: 'center', paddingRight: 12 }}>
                    {r.nombre_passagers}
                  </div>

                  {/* Statut — select */}
                  <div>
                    <select
                      value={currentStatut}
                      disabled={isUpdating}
                      onChange={e => handleStatusChange(r.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: st.bg,
                        color: st.color,
                        border: `1px solid ${st.color}`,
                        borderRadius: 'var(--radius)',
                        padding: '5px 8px',
                        fontFamily: 'var(--sans)',
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: isUpdating ? 'wait' : 'pointer',
                        outline: 'none',
                        opacity: isUpdating ? 0.6 : 1,
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23999' fill='none' stroke-width='1.2'/></svg>")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 6px center',
                        paddingRight: 20,
                      }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_STYLE[s].label}</option>
                      ))}
                    </select>
                    {errorMsg && (
                      <div style={{ fontSize: 10, color: 'oklch(0.65 0.14 20)', marginTop: 4 }}>
                        {errorMsg}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
