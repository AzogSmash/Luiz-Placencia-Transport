'use client'

import { useState } from 'react'
import { updateReservationStatus, deleteReservation, updateNotifPreferences } from '@/app/actions/admin'
import type { AdminLog, NotifPrefs } from '@/app/actions/admin'

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

const LOG_STYLE: Record<string, { color: string; label: string }> = {
  'nueva_reserva':       { color: 'oklch(0.78 0.09 85)',  label: 'Nueva reserva'  },
  'estado_confirmée':    { color: 'oklch(0.65 0.16 145)', label: 'Confirmada'     },
  'estado_annulée':      { color: 'oklch(0.65 0.14 20)',  label: 'Cancelada'      },
  'estado_en_cours':     { color: 'oklch(0.62 0.10 240)', label: 'En curso'       },
  'estado_terminée':     { color: 'var(--fg-muted)',       label: 'Finalizada'     },
  'estado_en_attente':   { color: 'oklch(0.78 0.09 85)',  label: 'En espera'      },
  'reserva_eliminada':   { color: 'oklch(0.65 0.14 20)',  label: 'Eliminada'      },
  'reembolso_emitido':   { color: 'oklch(0.65 0.16 145)', label: 'Reembolso'      },
  'reembolso_error':     { color: 'oklch(0.65 0.14 20)',  label: 'Error reembolso' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function truncate(s: string, n = 28) { return s.length > n ? s.slice(0, n) + '…' : s }

type ParsedMessage = { notes: string; fields: Record<string, string> }

function parseMessage(raw: string | null): ParsedMessage {
  if (!raw) return { notes: '', fields: {} }
  const parts = raw.split(' | ')
  const fields: Record<string, string> = {}
  const noteParts: string[] = []
  for (const part of parts) {
    const idx = part.indexOf(': ')
    if (idx !== -1) fields[part.slice(0, idx)] = part.slice(idx + 2)
    else if (part.trim()) noteParts.push(part.trim())
  }
  return { notes: noteParts.join(' / '), fields }
}

const DETAIL_LABELS: { key: string; label: string }[] = [
  { key: 'Service',       label: 'Servicio'      },
  { key: 'Prix',          label: 'Precio'        },
  { key: 'Equipaje',      label: 'Equipaje'      },
  { key: 'Bagages',       label: 'Equipaje'      },
  { key: 'Vuelo ida',     label: 'Vuelo ida'     },
  { key: 'Vuelo vuelta',  label: 'Vuelo vuelta'  },
  { key: 'Fecha vuelta',  label: 'Fecha vuelta'  },
  { key: 'Hotel llegada', label: 'Hotel llegada' },
  { key: 'Hotel vuelta',  label: 'Hotel vuelta'  },
  { key: 'Niños',         label: 'Edad niños'    },
  { key: 'Duración',      label: 'Duración'      },
]

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 14px', background: 'var(--bg-soft)', border: '1px solid var(--line-soft)', borderRadius: 6, minWidth: 0 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-dim)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

function ActionBtn({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
      border: `1px solid ${color}`, color, borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap',
    }}>
      {label}
    </a>
  )
}

type TimeFilter = 'proximas' | 'pasadas' | 'todas'
type Tab = 'reservas' | 'actividad' | 'configuracion'

export default function AdminPanel({
  reservations: initial,
  logs: initialLogs,
  notifPrefs: initialPrefs,
}: {
  reservations: Reservation[]
  logs: AdminLog[]
  notifPrefs: NotifPrefs
}) {
  const [tab, setTab]               = useState<Tab>('reservas')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('proximas')
  const [sortAsc, setSortAsc]       = useState(true)
  const [statuses, setStatuses]     = useState<Record<number, string>>(
    Object.fromEntries(initial.map(r => [r.id, r.statut])),
  )
  const [items, setItems]           = useState<Reservation[]>(initial)
  const [updating, setUpdating]     = useState<Set<number>>(new Set())
  const [deleting, setDeleting]     = useState<Set<number>>(new Set())
  const [errors, setErrors]         = useState<Record<number, string>>({})
  const [expanded, setExpanded]     = useState<Set<number>>(new Set())

  // Notif prefs
  const [prefs, setPrefs]           = useState<NotifPrefs>(initialPrefs)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)

  const now = new Date()
  const timeFiltered = items.filter(r => {
    const d = new Date(r.date_heure)
    if (timeFilter === 'proximas') return d >= now
    if (timeFilter === 'pasadas')  return d < now
    return true
  })
  const statusFiltered = statusFilter === 'todos'
    ? timeFiltered
    : timeFiltered.filter(r => (statuses[r.id] ?? r.statut) === statusFilter)
  const sorted = [...statusFiltered].sort((a, b) => {
    const diff = new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime()
    return sortAsc ? diff : -diff
  })

  const counts: Record<string, number> = { todos: items.length }
  STATUSES.forEach(s => { counts[s] = items.filter(r => (statuses[r.id] ?? r.statut) === s).length })

  function toggleExpand(id: number) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

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

  async function handleDelete(id: number) {
    if (!confirm(`¿Eliminar la reserva #${id}? Esta acción no se puede deshacer.`)) return
    setDeleting(d => new Set(d).add(id))
    const result = await deleteReservation(id)
    if (result.success) setItems(prev => prev.filter(r => r.id !== id))
    else {
      setErrors(e => ({ ...e, [id]: result.error }))
      setDeleting(d => { const n = new Set(d); n.delete(id); return n })
    }
  }

  async function handleSavePrefs() {
    setSavingPrefs(true)
    await updateNotifPreferences(prefs)
    setSavingPrefs(false)
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 3000)
  }

  const FILTER_TABS = [
    { id: 'todos', label: 'Todos' },
    ...STATUSES.map(s => ({ id: s, label: STATUS_STYLE[s].label })),
  ]
  const TIME_TABS: { id: TimeFilter; label: string }[] = [
    { id: 'proximas', label: 'Próximas' },
    { id: 'pasadas',  label: 'Pasadas'  },
    { id: 'todas',    label: 'Todas'    },
  ]
  const MAIN_TABS: { id: Tab; label: string }[] = [
    { id: 'reservas',      label: `Reservas (${items.length})`  },
    { id: 'actividad',     label: 'Actividad'                   },
    { id: 'configuracion', label: 'Configuración'               },
  ]

  return (
    <div>
      {/* ── Stats ── */}
      <div style={{ display: 'flex', gap: 1, background: 'var(--line-soft)', border: '1px solid var(--line-soft)', marginBottom: 32, flexWrap: 'wrap' }}>
        {FILTER_TABS.map(t => {
          const st = STATUS_STYLE[t.id]
          return (
            <div key={t.id} style={{ background: 'var(--bg)', padding: '16px 24px', minWidth: 100 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 400, color: st?.color ?? 'var(--fg)', lineHeight: 1, marginBottom: 4 }}>
                {counts[t.id] ?? 0}
              </div>
              <div className="eyebrow">{t.label}</div>
            </div>
          )
        })}
      </div>

      {/* ── Main tabs ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line-soft)', marginBottom: 28 }}>
        {MAIN_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 24px', background: 'transparent', border: 0,
            borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === t.id ? 'var(--accent)' : 'var(--fg-muted)',
            cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
            letterSpacing: '0.06em', transition: 'all 0.18s ease', whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: RESERVAS ══ */}
      {tab === 'reservas' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {TIME_TABS.map(t => (
                <button key={t.id} onClick={() => setTimeFilter(t.id)} style={{
                  padding: '7px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: '1px solid var(--line-soft)',
                  background: timeFilter === t.id ? 'var(--accent)' : 'transparent',
                  color: timeFilter === t.id ? '#0d0d0d' : 'var(--fg-muted)',
                  borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s ease',
                }}>{t.label}</button>
              ))}
            </div>
            <button onClick={() => setSortAsc(a => !a)} style={{
              padding: '7px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              border: '1px solid var(--line-soft)', background: 'transparent', color: 'var(--fg-muted)',
              borderRadius: 4, cursor: 'pointer',
            }}>
              Fecha {sortAsc ? '↑' : '↓'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line-soft)', marginBottom: 24, flexWrap: 'wrap' }}>
            {FILTER_TABS.map(t => {
              const active = statusFilter === t.id
              const st = STATUS_STYLE[t.id]
              return (
                <button key={t.id} onClick={() => setStatusFilter(t.id)} style={{
                  padding: '12px 20px', background: 'transparent', border: 0,
                  borderBottom: active ? `2px solid ${st?.color ?? 'var(--accent)'}` : '2px solid transparent',
                  color: active ? (st?.color ?? 'var(--fg)') : 'var(--fg-muted)',
                  cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.18s ease', whiteSpace: 'nowrap',
                }}>
                  {t.label} <span style={{ opacity: 0.6 }}>({counts[t.id] ?? 0})</span>
                </button>
              )
            })}
          </div>

          {sorted.length === 0 ? (
            <div style={{ padding: '48px 32px', border: '1px solid var(--line-soft)', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 14 }}>
              No hay reservas para este filtro.
            </div>
          ) : (
            <div style={{ border: '1px solid var(--line-soft)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 130px 1.4fr 110px 46px 170px 40px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--line-soft)', padding: '10px 16px', minWidth: 860 }}>
                {['#', 'Cliente', 'Teléfono', 'Trayecto', 'Fecha', 'Pax', 'Estado', ''].map(h => (
                  <div key={h} className="eyebrow" style={{ paddingRight: 10 }}>{h}</div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line-soft)', minWidth: 860 }}>
                {sorted.map(r => {
                  const currentStatut = statuses[r.id] ?? r.statut
                  const isUpdating = updating.has(r.id)
                  const isDeleting = deleting.has(r.id)
                  const st = STATUS_STYLE[currentStatut] ?? STATUS_STYLE['en attente']
                  const isOpen = expanded.has(r.id)
                  const parsed = parseMessage(r.message)
                  const phoneClean = r.telephone.replace(/\s/g, '')
                  const waPhone = phoneClean.startsWith('+') ? phoneClean.slice(1) : phoneClean

                  const visibleDetails = DETAIL_LABELS
                    .filter(d => parsed.fields[d.key])
                    .filter((d, i, arr) => {
                      if (d.key === 'Bagages' && arr.some(x => x.key === 'Equipaje' && parsed.fields['Equipaje'])) return false
                      return true
                    })

                  return (
                    <div key={r.id} style={{ background: isOpen ? 'var(--bg-elev)' : 'var(--bg)', transition: 'background 0.2s ease', opacity: isDeleting ? 0.4 : 1 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 130px 1.4fr 110px 46px 170px 40px', padding: '14px 16px', alignItems: 'center', opacity: isUpdating ? 0.7 : 1, transition: 'opacity 0.2s ease' }}>
                        <div className="mono" style={{ color: 'var(--accent)', fontSize: 12, paddingRight: 10 }}>#{r.id}</div>
                        <div style={{ paddingRight: 10, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{r.nom}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</div>
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--fg-muted)', paddingRight: 10 }}>{r.telephone}</div>
                        <div style={{ paddingRight: 10, minWidth: 0 }}>
                          <div style={{ fontSize: 12, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncate(r.adresse_depart)}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ color: 'var(--accent)', marginRight: 4 }}>→</span>{truncate(r.adresse_arrivee)}
                          </div>
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)', paddingRight: 10, lineHeight: 1.5 }}>{fmt(r.date_heure)}</div>
                        <div style={{ fontSize: 13, textAlign: 'center', paddingRight: 10 }}>{r.nombre_passagers}</div>
                        <div>
                          <select value={currentStatut} disabled={isUpdating} onChange={e => handleStatusChange(r.id, e.target.value)} style={{
                            width: '100%', background: st.bg, color: st.color, border: `1px solid ${st.color}`, borderRadius: 'var(--radius)',
                            padding: '5px 8px', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                            cursor: isUpdating ? 'wait' : 'pointer', outline: 'none', appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23999' fill='none' stroke-width='1.2'/></svg>")`,
                            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', paddingRight: 20,
                          }}>
                            {STATUSES.map(s => <option key={s} value={s}>{STATUS_STYLE[s].label}</option>)}
                          </select>
                          {errors[r.id] && <div style={{ fontSize: 10, color: 'oklch(0.65 0.14 20)', marginTop: 4 }}>{errors[r.id]}</div>}
                        </div>
                        <button onClick={() => toggleExpand(r.id)} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: isOpen ? 'var(--accent)' : 'var(--fg-dim)', fontSize: 16, padding: 4, lineHeight: 1, transition: 'color 0.18s ease' }}>
                          {isOpen ? '▲' : '▼'}
                        </button>
                      </div>

                      {isOpen && (
                        <div style={{ padding: '0 16px 20px 72px', borderTop: '1px solid var(--line-soft)' }}>
                          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <ActionBtn href={`tel:${phoneClean}`}        label="Llamar"   color="oklch(0.65 0.16 145)" />
                              <ActionBtn href={`https://wa.me/${waPhone}`} label="WhatsApp" color="oklch(0.72 0.18 145)" />
                              <ActionBtn href={`mailto:${r.email}`}        label="Email"    color="var(--accent)"        />
                              <ActionBtn href={`sms:${phoneClean}`}        label="SMS"      color="oklch(0.62 0.10 240)" />
                            </div>
                            {visibleDetails.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {visibleDetails.map(d => <DetailChip key={d.key} label={d.label} value={parsed.fields[d.key]} />)}
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <DetailChip label="Salida completa"  value={r.adresse_depart} />
                              <DetailChip label="Destino completo" value={r.adresse_arrivee} />
                              <DetailChip label="Fecha reserva"    value={fmt(r.created_at)} />
                            </div>
                            {parsed.notes && (
                              <div style={{ padding: '12px 16px', background: 'var(--bg-soft)', border: '1px solid var(--line-soft)', borderRadius: 6, fontSize: 13, color: 'var(--fg-muted)' }}>
                                <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-dim)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Notas del cliente</span>
                                {parsed.notes}
                              </div>
                            )}
                            <div style={{ paddingTop: 4, borderTop: '1px solid var(--line-soft)' }}>
                              <button onClick={() => handleDelete(r.id)} disabled={isDeleting} style={{
                                background: 'transparent', border: '1px solid oklch(0.65 0.14 20)',
                                color: 'oklch(0.65 0.14 20)', padding: '6px 14px', fontSize: 11,
                                fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                                borderRadius: 4, cursor: isDeleting ? 'wait' : 'pointer', opacity: isDeleting ? 0.5 : 1,
                              }}>
                                {isDeleting ? 'Eliminando…' : 'Eliminar reserva'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ TAB: ACTIVIDAD ══ */}
      {tab === 'actividad' && (
        <div style={{ border: '1px solid var(--line-soft)' }}>
          {initialLogs.length === 0 ? (
            <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 14 }}>
              No hay actividad registrada todavía.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {initialLogs.map((log, i) => {
                const style = LOG_STYLE[log.type] ?? { color: 'var(--fg-muted)', label: log.type }
                return (
                  <div key={log.id} style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr auto 100px',
                    padding: '14px 20px', alignItems: 'center', gap: 16,
                    borderBottom: i < initialLogs.length - 1 ? '1px solid var(--line-soft)' : undefined,
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-soft)',
                  }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      border: `1px solid ${style.color}`, color: style.color, borderRadius: 3,
                    }}>
                      {style.label}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{log.message}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-dim)', whiteSpace: 'nowrap' }}>
                      {log.admin_name ?? '—'}
                    </span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)', textAlign: 'right' }}>
                      {fmt(log.created_at)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ TAB: CONFIGURACIÓN ══ */}
      {tab === 'configuracion' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Section admin */}
          <div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>
              Mis notificaciones (administrador)
            </h3>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Elija qué eventos le generan un email de alerta a usted como administrador.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--line-soft)' }}>
              {([
                { key: 'notif_new_reservation', label: 'Nueva reserva recibida',   desc: 'Un cliente completa el formulario de reserva' },
                { key: 'notif_payment',         label: 'Pago confirmado',          desc: 'Una reserva con pago Stripe pasa a "Confirmada"' },
                { key: 'notif_cancellation',    label: 'Reserva cancelada',        desc: 'Una reserva pasa a estado "Cancelada"'           },
              ] as { key: keyof NotifPrefs; label: string; desc: string }[]).map((item, i, arr) => (
                <label key={item.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 24px', cursor: 'pointer', gap: 16,
                  borderBottom: i < arr.length - 1 ? '1px solid var(--line-soft)' : undefined,
                  background: 'var(--bg)',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={e => setPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                  />
                </label>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={handleSavePrefs} disabled={savingPrefs} style={{
                background: 'var(--accent)', color: '#0d0d0d', border: 'none',
                padding: '10px 24px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: savingPrefs ? 'wait' : 'pointer',
                opacity: savingPrefs ? 0.7 : 1,
              }}>
                {savingPrefs ? 'Guardando…' : 'Guardar'}
              </button>
              {prefsSaved && (
                <span style={{ fontSize: 13, color: 'oklch(0.65 0.16 145)' }}>✓ Guardado</span>
              )}
            </div>
          </div>

          {/* Section client emails */}
          <div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>
              Emails a los clientes
            </h3>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Los clientes reciben siempre sus emails de seguimiento (confirmación de solicitud,
              cambios de estado, etc.). Esta es una decisión de servicio — no se puede desactivar
              desde el panel.
            </p>
            <div style={{
              padding: '20px 24px', background: 'var(--bg-soft)', border: '1px solid var(--line-soft)',
              fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7,
            }}>
              Cada cliente puede gestionar sus propias preferencias de notificación desde su{' '}
              <strong style={{ color: 'var(--fg)' }}>espacio personal → Mi cuenta → Notificaciones</strong>.
              Si un cliente ha desactivado los emails de seguimiento, respetamos su elección incluso
              cuando el estado de su reserva cambia.
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
