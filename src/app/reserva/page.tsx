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
  // extra fields
  vuelo: string
  vueloVuelta: string
  fechaVuelta: string
  horaVuelta: string
  hotel: string
  hotelVuelta: string
  edadNinos: string
  duracion: string
  mensaje: string
}

const SERVICES = [
  { id: 'aeropuerto',  t: 'Traslado CDG / Orly', d: 'Desde 70 €' },
  { id: 'beauvais',    t: 'Traslado Beauvais',    d: 'Desde 160 €' },
  { id: 'disneyland',  t: 'Disneyland París',      d: 'Ida, vuelta o ambos' },
  { id: 'citytour',    t: 'City tour privado',     d: 'Por horas' },
  { id: 'disposicion', t: 'Disposición',           d: 'A su servicio' },
  { id: 'excursion',   t: 'Excursión',             d: 'Versalles · Bruges · Saint-Michel' },
]

const SERVICE_IMGS: Record<string, string> = {
  aeropuerto:  'Mercedes Clase E · CDG Terminal 2E',
  beauvais:    'Mercedes en zona de embarque CDG',
  disneyland:  'Llegada Disneyland Hotel',
  citytour:    'Torre Eiffel desde Trocadéro',
  disposicion: 'Interior cabina trasera',
  excursion:   'Castillo de Versalles',
}

const TARIFAS_TRASLADO: Record<number, number> = {
  1: 70, 2: 70, 3: 70,
  4: 80, 5: 90, 6: 100, 7: 110, 8: 120, 9: 170,
  10: 180, 11: 190, 12: 200, 13: 210, 14: 220,
  15: 230, 16: 240, 17: 290,
  18: 300, 19: 310, 20: 320, 21: 330, 22: 340,
  23: 350, 24: 360, 25: 410,
}

const TARIFAS_BEAUVAIS: Record<number, number> = {
  1: 160, 2: 160, 3: 160,
  4: 170, 5: 180, 6: 190, 7: 200, 8: 210, 9: 350,
  10: 360, 11: 370, 12: 380, 13: 390, 14: 400, 15: 410, 16: 420,
}

type PriceInfo = { label: string; note: string; overLimit: boolean }

function getPriceDisplay(serviceType: string, pasajeros: string): PriceInfo {
  const pax = parseInt(pasajeros) || 1
  if (serviceType === 'aeropuerto' || serviceType === 'disneyland') {
    if (pax > 25) return { label: 'Contactar por WhatsApp', note: 'Grupo de más de 25 personas.', overLimit: true }
    return { label: `${TARIFAS_TRASLADO[pax]} €`, note: 'Precio fijo · IVA incluido', overLimit: false }
  }
  if (serviceType === 'beauvais') {
    if (pax > 16) return { label: 'Contactar por WhatsApp', note: 'Grupo de más de 16 personas.', overLimit: true }
    return { label: `${TARIFAS_BEAUVAIS[pax]} €`, note: 'Precio fijo · IVA incluido', overLimit: false }
  }
  return { label: 'Precio bajo consulta', note: 'Tarifa confirmada en menos de 30 min.', overLimit: false }
}

const FIXED_PRICE_SERVICES = ['aeropuerto', 'beauvais', 'disneyland']

function buildWhatsAppUrl(
  data: FormData,
  phonePrefix: string,
  phoneNumber: string,
  reservationId: number | null,
): string {
  const serviceName = SERVICES.find(s => s.id === data.serviceType)?.t ?? data.serviceType
  const lines: string[] = [
    `Hola Luis, me llamo *${data.nombre}${data.apellido ? ' ' + data.apellido : ''}* y quisiera información sobre:`,
    '',
    `*Servicio:* ${serviceName}`,
    `*Salida:* ${data.origen}`,
    `*Destino:* ${data.destino}`,
    `*Fecha:* ${data.fecha}${data.hora ? ' a las ' + data.hora : ''}`,
  ]
  if (data.fechaVuelta) lines.push(`*Vuelta:* ${data.fechaVuelta}${data.horaVuelta ? ' a las ' + data.horaVuelta : ''}`)
  lines.push(`*Pasajeros:* ${data.pasajeros}`)
  lines.push(`*Equipaje:* ${data.equipaje} maleta${data.equipaje !== '1' ? 's' : ''}`)
  if (data.duracion)    lines.push(`*Duración:* ${data.duracion}`)
  if (data.vuelo)       lines.push(`*Vuelo llegada:* ${data.vuelo}`)
  if (data.vueloVuelta) lines.push(`*Vuelo vuelta:* ${data.vueloVuelta}`)
  if (data.hotel)       lines.push(`*Hotel:* ${data.hotel}`)
  if (data.hotelVuelta) lines.push(`*Hotel vuelta:* ${data.hotelVuelta}`)
  if (data.edadNinos)   lines.push(`*Niños:* ${data.edadNinos}`)
  if (data.mensaje)     lines.push(`*Notas:* ${data.mensaje}`)
  lines.push('')
  lines.push(`*Tel:* ${phonePrefix} ${phoneNumber}`)
  lines.push(`*Email:* ${data.email}`)
  if (reservationId)    lines.push(`*Ref:* #${reservationId}`)
  return `https://wa.me/33643272173?text=${encodeURIComponent(lines.join('\n'))}`
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13 }}>
      <span style={{ color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>{k}</span>
      <span style={{ color: 'var(--fg)', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
    </div>
  )
}

const EMPTY: FormData = {
  serviceType: 'aeropuerto',
  nombre: '', apellido: '', email: '', telefono: '',
  fecha: '', hora: '',
  origen: '', destino: '',
  pasajeros: '2', equipaje: '2',
  vuelo: '', vueloVuelta: '', fechaVuelta: '', horaVuelta: '',
  hotel: '', hotelVuelta: '', edadNinos: '', duracion: '',
  mensaje: '',
}

export default function ReservaPage() {
  const [step, setStep]               = useState(1)
  const [submitted, setSubmitted]     = useState(false)
  const [reservationId, setReservationId] = useState<number | null>(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [data, setData]               = useState<FormData>(EMPTY)
  const [phonePrefix, setPhonePrefix] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')

  const upd = (k: keyof FormData, v: string) => {
    setData(d => ({ ...d, [k]: v }))
    if (fieldErrors[k]) setFieldErrors(f => { const n = { ...f }; delete n[k]; return n })
  }

  const todayStr   = new Date().toISOString().split('T')[0]
  const pax        = parseInt(data.pasajeros) || 1
  const isTransfer = ['aeropuerto', 'disneyland', 'beauvais'].includes(data.serviceType)
  const paxLimit   = data.serviceType === 'beauvais' ? 16 : 25
  const overLimit  = isTransfer && pax > paxLimit
  const isAirport  = data.serviceType === 'aeropuerto' || data.serviceType === 'beauvais'
  const hasReturn  = isAirport || data.serviceType === 'disneyland'

  function validateStep2(): boolean {
    const e: Record<string, string> = {}
    if (!data.origen.trim())  e.origen  = 'Por favor, complete este campo'
    if (!data.destino.trim()) e.destino = 'Por favor, complete este campo'
    if (!data.fecha) {
      e.fecha = 'Por favor, complete este campo'
    } else if (data.fecha < todayStr) {
      e.fecha = 'La fecha no puede ser anterior a hoy'
    } else if (data.fecha === todayStr && data.hora) {
      const now = new Date()
      const [h, m] = data.hora.split(':').map(Number)
      const sel = new Date(); sel.setHours(h, m, 0, 0)
      if (sel <= now) e.hora = 'La hora indicada ya ha pasado'
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3(): boolean {
    const e: Record<string, string> = {}
    if (!data.nombre.trim()) e.nombre = 'Por favor, complete este campo'
    if (!data.email.trim()) {
      e.email = 'Por favor, complete este campo'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      e.email = 'Dirección de email no válida'
    }
    const digits = phoneNumber.replace(/\D/g, '')
    if (!phoneNumber.trim()) {
      e.telefono = 'Por favor, complete este campo'
    } else if (digits.length < 9) {
      e.telefono = 'Mínimo 9 dígitos'
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validateStep3()) return
    setLoading(true)
    setError(null)

    const serviceName  = SERVICES.find(s => s.id === data.serviceType)?.t ?? data.serviceType
    const priceDisplay = getPriceDisplay(data.serviceType, data.pasajeros)

    const extras: string[] = []
    if (data.vuelo)       extras.push(`Vuelo ida: ${data.vuelo}`)
    if (data.vueloVuelta) extras.push(`Vuelo vuelta: ${data.vueloVuelta}`)
    if (data.fechaVuelta) extras.push(`Fecha vuelta: ${data.fechaVuelta}${data.horaVuelta ? ' ' + data.horaVuelta : ''}`)
    if (data.hotel)       extras.push(`Hotel llegada: ${data.hotel}`)
    if (data.hotelVuelta) extras.push(`Hotel vuelta: ${data.hotelVuelta}`)
    if (data.edadNinos)   extras.push(`Niños: ${data.edadNinos}`)
    if (data.duracion)    extras.push(`Duración: ${data.duracion}`)

    const messageLines = [
      data.mensaje || null,
      `Service: ${serviceName}`,
      `Prix: ${priceDisplay.label}`,
      `Equipaje: ${data.equipaje}`,
      ...extras,
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
    if (!result.success) { setError(result.error); return }
    setReservationId(result.id)
    setSubmitted(true)
  }

  if (submitted) {
    const isFixedPrice = FIXED_PRICE_SERVICES.includes(data.serviceType) && !overLimit
    const waUrl = buildWhatsAppUrl(data, phonePrefix, phoneNumber, reservationId)

    return (
      <main className="page-enter">
        <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
            <div className="tag" style={{ justifyContent: 'center', marginBottom: 32 }}>
              <span className="dot" /><span>Solicitud recibida</span>
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: 0, marginBottom: 24 }}>
              Gracias,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{data.nombre || 'estimado cliente'}.</em>
            </h1>
            {reservationId && (
              <div className="mono" style={{ color: 'var(--accent)', marginBottom: 16, fontSize: 13 }}>Reserva #{reservationId}</div>
            )}

            {isFixedPrice ? (
              /* Fixed price: email confirmation flow */
              <>
                <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                  Hemos recibido su solicitud. Le enviaremos la confirmación y los detalles de pago
                  en menos de 30 minutos al correo <strong style={{ color: 'var(--fg)' }}>{data.email}</strong>.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/" className="btn btn-primary">Volver al inicio</Link>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Contactar por WhatsApp
                  </a>
                </div>
              </>
            ) : (
              /* Variable price: WhatsApp CTA pre-filled */
              <>
                <p className="lead" style={{ marginBottom: 16, marginLeft: 'auto', marginRight: 'auto' }}>
                  Su solicitud ha sido registrada. Para obtener su presupuesto personalizado,
                  contacte directamente con Luis por WhatsApp — todos los detalles de su reserva
                  ya están incluidos en el mensaje.
                </p>
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 32 }}>
                  También recibirá un resumen en <strong style={{ color: 'var(--fg)' }}>{data.email}</strong>.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: 14 }}
                  >
                    Enviar por WhatsApp →
                  </a>
                  <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    )
  }

  const sidebarImg   = SERVICE_IMGS[data.serviceType] ?? 'Mercedes Clase E · CDG Terminal 2E'
  const priceDisplay = getPriceDisplay(data.serviceType, data.pasajeros)

  return (
    <main className="page-enter">
      <section className="section" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Reserva · Solicitud de presupuesto</div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6vw, 84px)', margin: 0, marginBottom: 24, maxWidth: 900 }}>
            Reserve su <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>trayecto.</em>
          </h1>
          <p className="lead">Respuesta en menos de 30 minutos · Sin compromiso · Pago a bordo o por enlace seguro.</p>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64 }} className="reserva-grid">
            <div>
              {/* Stepper */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 48, borderBottom: '1px solid var(--line-soft)' }}>
                {['Servicio', 'Trayecto', 'Contacto'].map((label, i) => {
                  const idx = i + 1; const active = step === idx; const done = step > idx
                  return (
                    <button key={label} onClick={() => done && setStep(idx)} style={{
                      flex: 1, padding: '20px 0', background: 'transparent', border: 0,
                      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                      color: active || done ? 'var(--fg)' : 'var(--fg-dim)',
                      cursor: done ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'var(--sans)',
                    }}>
                      <div className="mono" style={{ color: active ? 'var(--accent)' : done ? 'var(--fg-muted)' : 'var(--fg-dim)', marginBottom: 6 }}>0{idx}</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
                    </button>
                  )
                })}
              </div>

              {/* ── Step 1 ── */}
              {step === 1 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>¿Qué servicio necesita?</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>Seleccione el tipo de trayecto.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
                    {SERVICES.map(s => {
                      const sel = data.serviceType === s.id
                      return (
                        <button key={s.id} onClick={() => {
                          upd('serviceType', s.id)
                          if (s.id === 'beauvais' && parseInt(data.pasajeros) > 16) upd('pasajeros', '16')
                        }} style={{
                          textAlign: 'left', padding: '20px 24px', fontFamily: 'var(--sans)',
                          background: sel ? 'var(--accent)' : 'transparent',
                          border: `1px solid ${sel ? 'var(--accent)' : 'var(--line)'}`,
                          color: sel ? '#0a0a0a' : 'var(--fg)', cursor: 'pointer', borderRadius: 'var(--radius)',
                          transition: 'all 0.18s ease',
                        }}>
                          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, color: sel ? '#0a0a0a' : 'var(--fg)' }}>{s.t}</div>
                          <div style={{ fontSize: 12, color: sel ? '#0a0a0a99' : 'var(--fg-muted)' }}>{s.d}</div>
                        </button>
                      )
                    })}
                  </div>
                  <button className="btn btn-primary" onClick={() => setStep(2)}>Siguiente · Trayecto</button>
                </div>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>Detalles del trayecto</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>Indique el recorrido y el número de pasajeros.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Lugar de salida *</label>
                      <input type="text" placeholder="Hotel Le Bristol, 112 Rue du Faubourg…"
                        value={data.origen} onChange={e => upd('origen', e.target.value)}
                        style={fieldErrors.origen ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.origen && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.origen}</span>}
                    </div>
                    <div className="field">
                      <label>Destino *</label>
                      <input type="text" placeholder="Aeropuerto CDG, Terminal 2E…"
                        value={data.destino} onChange={e => upd('destino', e.target.value)}
                        style={fieldErrors.destino ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.destino && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.destino}</span>}
                    </div>
                    <div className="field">
                      <label>Fecha *</label>
                      <input type="date" value={data.fecha} min={todayStr} onChange={e => upd('fecha', e.target.value)}
                        style={fieldErrors.fecha ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.fecha && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.fecha}</span>}
                    </div>
                    <div className="field">
                      <label>Hora</label>
                      <input type="time" value={data.hora} onChange={e => upd('hora', e.target.value)}
                        style={fieldErrors.hora ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.hora && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.hora}</span>}
                    </div>
                    <div className="field">
                      <label>Pasajeros</label>
                      <select value={data.pasajeros} onChange={e => upd('pasajeros', e.target.value)}>
                        {Array.from({ length: paxLimit }, (_, i) => String(i + 1)).map(n => (
                          <option key={n} value={n}>{n} pasajero{n !== '1' ? 's' : ''}</option>
                        ))}
                        <option value={String(paxLimit + 1)}>Más de {paxLimit} → WhatsApp</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Equipaje</label>
                      <select value={data.equipaje} onChange={e => upd('equipaje', e.target.value)}>
                        {Array.from({ length: 7 }, (_, i) => String(i)).map(n => (
                          <option key={n} value={n}>{n} maleta{n !== '1' ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isTransfer && (
                    <div style={{ padding: '14px 18px', marginBottom: 24, background: 'var(--accent-soft)', border: '1px solid var(--accent)', fontSize: 13, color: 'var(--fg-muted)' }}>
                      <strong style={{ color: 'var(--accent)' }}>Tarifa fija:</strong>{' '}
                      {overLimit
                        ? `Para grupos de más de ${paxLimit} personas, contáctenos por WhatsApp.`
                        : `Para ${data.pasajeros} pasajero${pax > 1 ? 's' : ''}: ${priceDisplay.label} · IVA incluido.`}
                    </div>
                  )}

                  {/* ── Informaciones adicionales ── */}
                  <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 28, marginBottom: 28 }}>
                    <div className="eyebrow" style={{ marginBottom: 20 }}>Información del viaje</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                      {/* Airport: flight numbers + hotels */}
                      {isAirport && (
                        <>
                          <div className="field">
                            <label>Nº vuelo llegada</label>
                            <input type="text" placeholder="AF 1234"
                              value={data.vuelo} onChange={e => upd('vuelo', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Nº vuelo vuelta</label>
                            <input type="text" placeholder="BA 567 (si aplica)"
                              value={data.vueloVuelta} onChange={e => upd('vueloVuelta', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Hotel de llegada</label>
                            <input type="text" placeholder="Hotel Le Meurice, Marriott…"
                              value={data.hotel} onChange={e => upd('hotel', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Hotel de vuelta (si difiere)</label>
                            <input type="text" placeholder="Hotel de salida"
                              value={data.hotelVuelta} onChange={e => upd('hotelVuelta', e.target.value)} />
                          </div>
                        </>
                      )}

                      {/* Disneyland: hotel only */}
                      {data.serviceType === 'disneyland' && (
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                          <label>Hotel en Disneyland</label>
                          <input type="text" placeholder="Disney's Hotel New York, Santa Fe…"
                            value={data.hotel} onChange={e => upd('hotel', e.target.value)} />
                        </div>
                      )}

                      {/* Return date/time for airport + disney */}
                      {hasReturn && (
                        <>
                          <div className="field">
                            <label>Fecha de vuelta (si aplica)</label>
                            <input type="date" value={data.fechaVuelta} min={data.fecha || todayStr}
                              onChange={e => upd('fechaVuelta', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>Hora de vuelta</label>
                            <input type="time" value={data.horaVuelta} onChange={e => upd('horaVuelta', e.target.value)} />
                          </div>
                        </>
                      )}

                      {/* City tour: duration */}
                      {data.serviceType === 'citytour' && (
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                          <label>Duración del tour</label>
                          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                            {[
                              { v: '3h', l: '3 horas' },
                              { v: '4h', l: '4 horas' },
                            ].map(d => {
                              const sel = data.duracion === d.v
                              return (
                                <button key={d.v} type="button" onClick={() => upd('duracion', d.v)} style={{
                                  padding: '12px 24px', fontFamily: 'var(--sans)', cursor: 'pointer',
                                  background: sel ? 'var(--accent)' : 'transparent',
                                  border: `1px solid ${sel ? 'var(--accent)' : 'var(--line)'}`,
                                  color: sel ? '#0a0a0a' : 'var(--fg)', borderRadius: 'var(--radius)',
                                  transition: 'all 0.18s ease', fontSize: 14,
                                }}>{d.l}</button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Children ages — always visible */}
                      <div className="field" style={{ gridColumn: '1/-1' }}>
                        <label>Edades de los niños (si aplica)</label>
                        <input type="text" placeholder="Ej: 3 años, 7 años"
                          value={data.edadNinos} onChange={e => upd('edadNinos', e.target.value)} />
                      </div>

                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => { setFieldErrors({}); setStep(1) }}>← Anterior</button>
                    <button className="btn btn-primary" onClick={() => { if (validateStep2()) setStep(3) }}>Siguiente · Contacto</button>
                  </div>
                </div>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>Sus datos de contacto</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>Le contestaremos en menos de 30 minutos.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Nombre *</label>
                      <input type="text" placeholder="Carmen"
                        value={data.nombre} onChange={e => upd('nombre', e.target.value)}
                        style={fieldErrors.nombre ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.nombre && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.nombre}</span>}
                    </div>
                    <div className="field">
                      <label>Apellido</label>
                      <input type="text" placeholder="González" value={data.apellido} onChange={e => upd('apellido', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Email *</label>
                      <input type="email" placeholder="carmen@correo.com"
                        value={data.email} onChange={e => upd('email', e.target.value)}
                        style={fieldErrors.email ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.email && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.email}</span>}
                    </div>
                    <div className="field">
                      <label>Teléfono / WhatsApp *</label>
                      <PhoneInput
                        prefix={phonePrefix} number={phoneNumber}
                        onPrefixChange={setPhonePrefix}
                        onNumberChange={v => { setPhoneNumber(v); if (fieldErrors.telefono) setFieldErrors(f => { const n = { ...f }; delete n.telefono; return n }) }}
                        style={fieldErrors.telefono ? { borderColor: 'oklch(0.65 0.14 20)' } : undefined}
                      />
                      {fieldErrors.telefono && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.telefono}</span>}
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label>Mensaje complementario</label>
                      <textarea placeholder="Sillas infantiles, vuelo de llegada, paradas adicionales…"
                        value={data.mensaje} onChange={e => upd('mensaje', e.target.value)} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ padding: '14px 18px', marginBottom: 20, background: 'oklch(0.35 0.08 20 / 0.25)', border: '1px solid oklch(0.55 0.12 20)', fontSize: 13, color: 'oklch(0.85 0.08 20)' }}>
                      Error: {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button className="btn btn-ghost" onClick={() => { setFieldErrors({}); setStep(2) }} disabled={loading}>← Anterior</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Enviando…' : 'Enviar solicitud'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside style={{ border: '1px solid var(--line)', padding: 32, alignSelf: 'start', position: 'sticky', top: 100 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
              <div className="placeholder" data-label={sidebarImg} style={{ ...bg(sidebarImg), aspectRatio: '16/10', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SummaryRow k="Servicio"  v={SERVICES.find(s => s.id === data.serviceType)?.t ?? '—'} />
                <SummaryRow k="Salida"    v={data.origen || '—'} />
                <SummaryRow k="Destino"   v={data.destino || '—'} />
                <SummaryRow k="Fecha"     v={data.fecha ? `${data.fecha} ${data.hora}`.trim() : '—'} />
                {data.fechaVuelta && <SummaryRow k="Vuelta" v={`${data.fechaVuelta} ${data.horaVuelta}`.trim()} />}
                <SummaryRow k="Pasajeros" v={overLimit ? `+${paxLimit} · WhatsApp` : `${data.pasajeros} · ${data.equipaje} maletas`} />
                {data.vuelo      && <SummaryRow k="Vuelo ida"    v={data.vuelo} />}
                {data.vueloVuelta && <SummaryRow k="Vuelo vuelta" v={data.vueloVuelta} />}
                {data.hotel      && <SummaryRow k="Hotel"         v={data.hotel} />}
              </div>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Precio</div>
                <div className="display" style={{ fontSize: 28, fontWeight: 400, color: overLimit ? 'var(--fg-muted)' : 'var(--fg)' }}>
                  {priceDisplay.label}
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 8 }}>{priceDisplay.note}</p>
                {overLimit && (
                  <a href="https://wa.me/33643272173" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: 16, fontSize: 12 }}>
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
