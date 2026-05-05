'use client'

import { useState } from 'react'
import Link from 'next/link'
import { bg } from '@/lib/images'
import { createReservation } from '@/app/actions/reservations'
import PhoneInput from '@/components/PhoneInput'

type FormData = {
  serviceType: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  fecha: string
  hora: string
  origen: string
  destino: string
  pasajeros: string
  equipaje: string
  vehiculo: string
  mensaje: string
}

const SERVICES = [
  { id: 'aeropuerto',  t: 'Traslado aeropuerto', d: 'CDG · Orly · Beauvais' },
  { id: 'disneyland',  t: 'Disneyland París',     d: 'Ida, vuelta o ambos' },
  { id: 'citytour',    t: 'City tour privado',    d: 'Por horas' },
  { id: 'disposicion', t: 'Disposición',          d: 'A su servicio' },
  { id: 'excursion',   t: 'Excursión',            d: 'Francia · Europa' },
  { id: 'evento',      t: 'Evento / boda',        d: 'A medida' },
]

const VEHICULOS = [
  { id: 'berlina',   t: 'Berlina',     d: 'Mercedes Clase E', pax: '1–3', price: 'Desde 75 €' },
  { id: 'executive', t: 'Ejecutiva',   d: 'Mercedes Clase S', pax: '1–3', price: 'Desde 110 €' },
  { id: 'van',       t: 'Van premium', d: 'Mercedes Clase V', pax: '1–7', price: 'Desde 95 €' },
]

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13 }}>
      <span style={{ color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>{k}</span>
      <span style={{ color: 'var(--fg)', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
    </div>
  )
}

export default function ReservaPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [reservationId, setReservationId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<FormData>({
    serviceType: 'aeropuerto',
    nombre: '', apellido: '', email: '', telefono: '',
    fecha: '', hora: '',
    origen: '', destino: '',
    pasajeros: '2', equipaje: '2',
    vehiculo: 'berlina',
    mensaje: '',
  })
  const [phonePrefix, setPhonePrefix] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')

  const upd = (k: keyof FormData, v: string) => setData(d => ({ ...d, [k]: v }))

  const vehiculoImg =
    data.vehiculo === 'van'       ? 'Mercedes Clase V' :
    data.vehiculo === 'executive' ? 'Mercedes Clase S' : 'Mercedes Clase E'

  const basePrice =
    data.vehiculo === 'executive' ? '110' :
    data.vehiculo === 'van'       ? '95'  : '75'

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const serviceName = SERVICES.find(s => s.id === data.serviceType)?.t ?? data.serviceType
    const vehiculoName = VEHICULOS.find(v => v.id === data.vehiculo)?.t ?? data.vehiculo

    const messageLines = [
      data.mensaje,
      `Service: ${serviceName}`,
      `Véhicule: ${vehiculoName}`,
      `Bagages: ${data.equipaje}`,
    ].filter(Boolean)

    const result = await createReservation({
      nom:              `${data.nombre} ${data.apellido}`.trim(),
      telephone:        `${phonePrefix} ${phoneNumber}`.trim(),
      email:            data.email,
      adresse_depart:   data.origen,
      adresse_arrivee:  data.destino,
      date_heure:       `${data.fecha}T${data.hora || '00:00'}:00`,
      nombre_passagers: parseInt(data.pasajeros) || 1,
      message:          messageLines.join(' | ') || null,
    })

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setReservationId(result.id)
    setSubmitted(true)
  }

  /* ── Confirmation screen ── */
  if (submitted) {
    return (
      <main className="page-enter">
        <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
            <div className="tag" style={{ justifyContent: 'center', marginBottom: 32 }}>
              <span className="dot" />
              <span>Solicitud recibida</span>
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: 0, marginBottom: 24 }}>
              Gracias,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                {data.nombre || 'estimado cliente'}.
              </em>
            </h1>
            {reservationId && (
              <div className="mono" style={{ color: 'var(--accent)', marginBottom: 16, fontSize: 13 }}>
                Reserva #{reservationId}
              </div>
            )}
            <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
              Hemos recibido su solicitud. Le enviaremos un presupuesto detallado y la confirmación
              en menos de 30 minutos al correo{' '}
              <strong style={{ color: 'var(--fg)' }}>{data.email}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary">Volver al inicio</Link>
              <a href="https://wa.me/33600000000" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Continuar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  /* ── Main form ── */
  return (
    <main className="page-enter">
      {/* Page header */}
      <section className="section" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Reserva · Solicitud de presupuesto</div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6vw, 84px)', margin: 0, marginBottom: 24, maxWidth: 900 }}>
            Reserve su <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>trayecto.</em>
          </h1>
          <p className="lead">
            Respuesta en menos de 30 minutos · Sin compromiso · Pago a bordo o por enlace seguro.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64 }} className="reserva-grid">

            {/* ── Form ── */}
            <div>
              {/* Stepper */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 48, borderBottom: '1px solid var(--line-soft)' }}>
                {['Servicio', 'Trayecto', 'Contacto'].map((label, i) => {
                  const idx = i + 1
                  const active = step === idx
                  const done = step > idx
                  return (
                    <button key={label}
                      onClick={() => done && setStep(idx)}
                      style={{
                        flex: 1, padding: '20px 0', background: 'transparent', border: 0,
                        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                        color: active || done ? 'var(--fg)' : 'var(--fg-dim)',
                        cursor: done ? 'pointer' : 'default',
                        textAlign: 'left', fontFamily: 'var(--sans)',
                      }}>
                      <div className="mono" style={{
                        color: active ? 'var(--accent)' : done ? 'var(--fg-muted)' : 'var(--fg-dim)',
                        marginBottom: 6,
                      }}>0{idx}</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
                    </button>
                  )
                })}
              </div>

              {/* ── Step 1: service ── */}
              {step === 1 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    ¿Qué servicio necesita?
                  </h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>
                    Seleccione el tipo de trayecto. Podrá precisar los detalles a continuación.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
                    {SERVICES.map(s => (
                      <button key={s.id} onClick={() => upd('serviceType', s.id)} style={{
                        textAlign: 'left', padding: '20px 24px', fontFamily: 'var(--sans)',
                        background: data.serviceType === s.id ? 'var(--accent-soft)' : 'transparent',
                        border: `1px solid ${data.serviceType === s.id ? 'var(--accent)' : 'var(--line)'}`,
                        color: 'var(--fg)', cursor: 'pointer', borderRadius: 'var(--radius)',
                        transition: 'all 0.18s ease',
                      }}>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{s.t}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.d}</div>
                      </button>
                    ))}
                  </div>

                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, margin: '40px 0 16px', fontWeight: 400 }}>
                    Categoría de vehículo
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
                    {VEHICULOS.map(v => (
                      <button key={v.id} onClick={() => upd('vehiculo', v.id)} style={{
                        textAlign: 'left', padding: 20, fontFamily: 'var(--sans)',
                        background: data.vehiculo === v.id ? 'var(--accent-soft)' : 'transparent',
                        border: `1px solid ${data.vehiculo === v.id ? 'var(--accent)' : 'var(--line)'}`,
                        color: 'var(--fg)', cursor: 'pointer', borderRadius: 'var(--radius)',
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{v.t}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 12 }}>{v.d} · {v.pax} pax</div>
                        <div className="mono" style={{ color: 'var(--accent)', fontSize: 11 }}>{v.price}</div>
                      </button>
                    ))}
                  </div>

                  <button className="btn btn-primary" onClick={() => setStep(2)}>
                    Siguiente · Trayecto
                  </button>
                </div>
              )}

              {/* ── Step 2: route ── */}
              {step === 2 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    Detalles del trayecto
                  </h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>
                    Indique los puntos del recorrido y el número de pasajeros.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Lugar de salida *</label>
                      <input type="text" placeholder="Hotel Le Bristol, 112 Rue du Faubourg…"
                        value={data.origen} onChange={e => upd('origen', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Destino *</label>
                      <input type="text" placeholder="Aeropuerto CDG, Terminal 2E…"
                        value={data.destino} onChange={e => upd('destino', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Fecha *</label>
                      <input type="date" value={data.fecha} onChange={e => upd('fecha', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hora</label>
                      <input type="time" value={data.hora} onChange={e => upd('hora', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Pasajeros</label>
                      <select value={data.pasajeros} onChange={e => upd('pasajeros', e.target.value)}>
                        {['1','2','3','4','5','6','7','8+'].map(n => (
                          <option key={n} value={n}>{n} pasajero{n !== '1' ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Equipaje</label>
                      <select value={data.equipaje} onChange={e => upd('equipaje', e.target.value)}>
                        {['0','1','2','3','4','5+'].map(n => (
                          <option key={n} value={n}>{n} maleta{n !== '1' ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setStep(1)}>← Anterior</button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setStep(3)}
                      disabled={!data.origen || !data.destino || !data.fecha}
                    >
                      Siguiente · Contacto
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: contact ── */}
              {step === 3 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    Sus datos de contacto
                  </h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>
                    Le contestaremos en menos de 30 minutos con un presupuesto detallado.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Nombre *</label>
                      <input type="text" placeholder="Carmen"
                        value={data.nombre} onChange={e => upd('nombre', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Apellido</label>
                      <input type="text" placeholder="González"
                        value={data.apellido} onChange={e => upd('apellido', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Email *</label>
                      <input type="email" placeholder="carmen@correo.com"
                        value={data.email} onChange={e => upd('email', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Teléfono / WhatsApp *</label>
                      <PhoneInput
                        prefix={phonePrefix}
                        number={phoneNumber}
                        onPrefixChange={setPhonePrefix}
                        onNumberChange={setPhoneNumber}
                      />
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label>Mensaje complementario</label>
                      <textarea
                        placeholder="Sillas infantiles, vuelo de llegada, paradas adicionales…"
                        value={data.mensaje} onChange={e => upd('mensaje', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Error banner */}
                  {error && (
                    <div style={{
                      padding: '14px 18px',
                      marginBottom: 20,
                      background: 'oklch(0.35 0.08 20 / 0.25)',
                      border: '1px solid oklch(0.55 0.12 20)',
                      fontSize: 13,
                      color: 'oklch(0.85 0.08 20)',
                    }}>
                      Error: {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={loading}>
                      ← Anterior
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={loading || !data.nombre || !data.email || !phoneNumber}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? 'Enviando…' : 'Enviar solicitud'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar summary ── */}
            <aside style={{
              border: '1px solid var(--line)',
              padding: 32,
              alignSelf: 'start',
              position: 'sticky',
              top: 100,
            }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
              <div
                className="placeholder"
                data-label={vehiculoImg}
                style={{ ...bg(vehiculoImg), aspectRatio: '16/10', marginBottom: 24 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SummaryRow k="Servicio"   v={SERVICES.find(s => s.id === data.serviceType)?.t ?? '—'} />
                <SummaryRow k="Vehículo"  v={VEHICULOS.find(v => v.id === data.vehiculo)?.t ?? '—'} />
                <SummaryRow k="Salida"    v={data.origen || '—'} />
                <SummaryRow k="Destino"   v={data.destino || '—'} />
                <SummaryRow k="Fecha"     v={data.fecha ? `${data.fecha} ${data.hora}`.trim() : '—'} />
                <SummaryRow k="Pasajeros" v={`${data.pasajeros} · ${data.equipaje} maletas`} />
              </div>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Estimación</div>
                <div className="display" style={{ fontSize: 36, fontWeight: 400 }}>
                  Desde {basePrice} €
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 8 }}>
                  Tarifa final confirmada por correo antes de la reserva.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
