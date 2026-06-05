'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { bg } from '@/lib/images'
import { createReservation } from '@/app/actions/reservations'
import { createCheckoutSession } from '@/app/actions/checkout'
import PhoneInput from '@/components/PhoneInput'
import { createClient } from '@/lib/supabase-browser'
import { useLanguage } from '@/contexts/LanguageContext'

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
  equipajePequeno: string
  equipajeGrande: string
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

const SERVICE_IDS = ['aeropuerto', 'beauvais', 'disneyland', 'versailles', 'citytour', 'disposicion', 'excursion', 'excursion_devis']

const SERVICE_IMGS: Record<string, string> = {
  aeropuerto:      'Avión llegando al tarmac',
  beauvais:        'Ryanair despegando en Beauvais',
  disneyland:      'Llegada Disneyland Hotel',
  versailles:      'Castillo de Versalles',
  citytour:        'Torre Eiffel desde Trocadéro',
  disposicion:     'Interior cabina trasera',
  excursion:       'Mont-Saint-Michel',
  excursion_devis: 'Canales de Ámsterdam',
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

const TARIFAS_VERSAILLES: Record<number, number> = {
  1: 50, 2: 60, 3: 70, 4: 80, 5: 90, 6: 100, 7: 110, 8: 120,
  9: 130, 10: 140, 11: 150, 12: 160, 13: 170, 14: 180, 15: 190, 16: 200,
}

const TARIFAS_EXCURSION: Record<number, number> = {
  1: 700, 2: 700, 3: 700,
  4: 800, 5: 900, 6: 1000, 7: 1100, 8: 1200, 9: 1700,
  10: 1800, 11: 1900, 12: 2000, 13: 2100, 14: 2200,
  15: 2300, 16: 2400,
}

function getAmount(serviceType: string, pax: number): number | null {
  if (serviceType === 'aeropuerto' || serviceType === 'disneyland') return TARIFAS_TRASLADO[pax] ?? null
  if (serviceType === 'beauvais')   return TARIFAS_BEAUVAIS[pax]   ?? null
  if (serviceType === 'versailles') return TARIFAS_VERSAILLES[pax] ?? null
  if (serviceType === 'excursion')  return TARIFAS_EXCURSION[pax]  ?? null
  return null
}

const FIXED_PRICE_SERVICES = ['aeropuerto', 'beauvais', 'disneyland', 'versailles', 'excursion']

// Spanish service names — always used in WhatsApp messages to Luis
const ES_SERVICE_NAMES: Record<string, string> = {
  aeropuerto:      'Traslado CDG / Orly',
  beauvais:        'Traslado Beauvais',
  disneyland:      'Disneyland París',
  versailles:      'Visita Versalles',
  citytour:        'City tour privado',
  disposicion:     'Disposición con chófer',
  excursion:       'St-Michel · Bruges',
  excursion_devis: 'Excursión a medida',
}

function buildWhatsAppUrl(
  data: FormData,
  phonePrefix: string,
  phoneNumber: string,
  reservationId: number | null,
): string {
  const serviceName = ES_SERVICE_NAMES[data.serviceType] ?? data.serviceType
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
  const grande = parseInt(data.equipajeGrande || '0')
  const pequeno = parseInt(data.equipajePequeno || '0')
  const totalEq = grande * 2 + pequeno
  lines.push(`*Equipaje:* ${grande} grande${grande !== 1 ? 's' : ''} + ${pequeno} pequeña${pequeno !== 1 ? 's' : ''} (= ${totalEq} unidades)`)
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
  pasajeros: '2', equipajePequeno: '0', equipajeGrande: '1',
  vuelo: '', vueloVuelta: '', fechaVuelta: '', horaVuelta: '',
  hotel: '', hotelVuelta: '', edadNinos: '', duracion: '',
  mensaje: '',
}

export default function ReservaPage() {
  const { t } = useLanguage()
  const r = t.reserva

  const [step, setStep]               = useState(1)
  const [submitted, setSubmitted]     = useState(false)
  const [reservationId, setReservationId] = useState<number | null>(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [data, setData]               = useState<FormData>(EMPTY)
  const [phonePrefix, setPhonePrefix] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [user, setUser]               = useState<User | null>(null)
  const [showAuthNudge, setShowAuthNudge] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: d }) => setUser(d.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    try {
      const raw = localStorage.getItem('reserva_draft')
      if (raw) {
        const draft = JSON.parse(raw)
        setData(draft.data)
        setPhonePrefix(draft.phonePrefix ?? '+33')
        setPhoneNumber(draft.phoneNumber ?? '')
        setStep(3)
        localStorage.removeItem('reserva_draft')
      }
    } catch {}
    return () => subscription.unsubscribe()
  }, [])

  function saveDraftAndRedirect(path: string) {
    localStorage.setItem('reserva_draft', JSON.stringify({ data, phonePrefix, phoneNumber }))
    router.push(`${path}?redirect=/reserva`)
  }

  const upd = (k: keyof FormData, v: string) => {
    setData(d => ({ ...d, [k]: v }))
    if (fieldErrors[k]) setFieldErrors(f => { const n = { ...f }; delete n[k]; return n })
  }

  const todayStr   = new Date().toISOString().split('T')[0]
  const pax        = parseInt(data.pasajeros) || 1
  const isTransfer     = ['aeropuerto', 'disneyland', 'beauvais'].includes(data.serviceType)
  const showPriceBanner = FIXED_PRICE_SERVICES.includes(data.serviceType)
  const paxLimit   = ['beauvais', 'versailles', 'excursion'].includes(data.serviceType) ? 16 : 25
  const overLimit  = FIXED_PRICE_SERVICES.includes(data.serviceType) && pax > paxLimit
  const isAirport  = data.serviceType === 'aeropuerto' || data.serviceType === 'beauvais'
  const hasReturn  = isAirport || data.serviceType === 'disneyland'
  const amount     = getAmount(data.serviceType, pax)

  // Price display using translated strings
  function getPriceLabel(): string {
    if (overLimit || (FIXED_PRICE_SERVICES.includes(data.serviceType) && amount === null)) {
      return r.price.contactWhatsApp
    }
    if (FIXED_PRICE_SERVICES.includes(data.serviceType) && amount !== null) {
      return `${amount} €`
    }
    return r.price.onRequest
  }

  function getPriceNote(): string {
    if (overLimit || (FIXED_PRICE_SERVICES.includes(data.serviceType) && amount === null)) {
      return r.price.overLimitNote.replace('{n}', String(paxLimit))
    }
    if (FIXED_PRICE_SERVICES.includes(data.serviceType)) {
      return r.price.vatIncluded
    }
    return r.price.onRequestNote
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {}
    if (!data.origen.trim())  e.origen  = r.validation.required
    if (!data.destino.trim()) e.destino = r.validation.required
    if (!data.fecha) {
      e.fecha = r.validation.required
    } else if (data.fecha < todayStr) {
      e.fecha = r.validation.pastDate
    } else if (data.fecha === todayStr && data.hora) {
      const now = new Date()
      const [h, m] = data.hora.split(':').map(Number)
      const sel = new Date(); sel.setHours(h, m, 0, 0)
      if (sel <= now) e.hora = r.validation.pastTime
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3(): boolean {
    const e: Record<string, string> = {}
    if (!data.nombre.trim()) e.nombre = r.validation.required
    if (!data.email.trim()) {
      e.email = r.validation.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      e.email = r.validation.invalidEmail
    }
    const digits = phoneNumber.replace(/\D/g, '')
    if (!phoneNumber.trim()) {
      e.telefono = r.validation.required
    } else if (digits.length < 9) {
      e.telefono = r.validation.minDigits
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validateStep3()) return
    if (!user) { setShowAuthNudge(true); return }
    await doSubmit()
  }

  async function doSubmit() {
    setShowAuthNudge(false)
    setLoading(true)
    setError(null)

    const serviceName  = ES_SERVICE_NAMES[data.serviceType] ?? data.serviceType
    const priceLabel   = FIXED_PRICE_SERVICES.includes(data.serviceType) && !overLimit && amount
      ? `${amount} €`
      : 'Precio bajo consulta'

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
      `Prix: ${priceLabel}`,
      `Equipaje: ${data.equipajeGrande}G + ${data.equipajePequeno}P (= ${parseInt(data.equipajeGrande||'0')*2 + parseInt(data.equipajePequeno||'0')}u)`,
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

    if (!result.success) { setLoading(false); setError(result.error); return }

    const isFixedPrice = FIXED_PRICE_SERVICES.includes(data.serviceType) && !overLimit
    if (isFixedPrice) {
      if (!amount) { setLoading(false); setError('Error al calcular el importe.'); return }
      const checkout = await createCheckoutSession(result.id, amount, serviceName, data.email)
      if (checkout.url) {
        window.location.href = checkout.url
        return
      }
      setLoading(false)
      setError(checkout.error ?? 'Error al iniciar el pago. Inténtelo de nuevo.')
      return
    }

    setLoading(false)
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
              <span className="dot" /><span>{r.submitted.tag}</span>
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: 0, marginBottom: 24 }}>
              {r.submitted.heading}{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{data.nombre || r.submitted.fallbackName}.</em>
            </h1>
            {reservationId && (
              <div className="mono" style={{ color: 'var(--accent)', marginBottom: 16, fontSize: 13 }}>{r.submitted.reservationRef}{reservationId}</div>
            )}

            {isFixedPrice ? (
              <>
                <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                  {r.submitted.fixed.lead}{' '}
                  <strong style={{ color: 'var(--fg)' }}>{data.email}</strong>.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/" className="btn btn-primary">{r.submitted.fixed.back}</Link>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    {r.submitted.fixed.whatsapp}
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="lead" style={{ marginBottom: 16, marginLeft: 'auto', marginRight: 'auto' }}>
                  {r.submitted.variable.lead}
                </p>
                <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 32 }}>
                  {r.submitted.variable.note}{' '}
                  <strong style={{ color: 'var(--fg)' }}>{data.email}</strong>.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 14 }}>
                    {r.submitted.variable.send}
                  </a>
                  <Link href="/" className="btn btn-ghost">{r.submitted.variable.back}</Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    )
  }

  const sidebarImg = SERVICE_IMGS[data.serviceType] ?? 'Mercedes Clase E · CDG Terminal 2E'

  return (
    <main className="page-enter">
      <section className="section" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>{r.eyebrow}</div>
          <h1 className="display" style={{ fontSize: 'clamp(44px, 6vw, 84px)', margin: 0, marginBottom: 24, maxWidth: 900 }}>
            {r.heading1} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{r.headingAccent}</em>
          </h1>
          <p className="lead">{r.lead}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64 }} className="reserva-grid">
            <div>
              {/* Stepper */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 48, borderBottom: '1px solid var(--line-soft)' }}>
                {r.stepper.map((label, i) => {
                  const idx = i + 1; const active = step === idx; const done = step > idx
                  return (
                    <button key={label} onClick={() => done && setStep(idx)} style={{
                      flex: 1, padding: '20px 0', background: 'transparent', border: 0,
                      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                      color: active || done ? 'var(--fg)' : 'var(--fg-dim)',
                      cursor: done ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'var(--sans)',
                    }}>
                      <div className="mono" style={{ color: active ? 'var(--accent)' : done ? 'var(--fg-muted)' : 'var(--fg-dim)', marginBottom: 6 }}>0{idx}</div>
                      <div className="reserva-stepper-label" style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
                    </button>
                  )
                })}
              </div>

              {/* ── Step 1 ── */}
              {step === 1 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>{r.step1.heading}</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>{r.step1.sub}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
                    {r.services.map((s, i) => {
                      const id = SERVICE_IDS[i]
                      const sel = data.serviceType === id
                      return (
                        <button key={id} onClick={() => {
                          upd('serviceType', id)
                          if (id === 'beauvais' && parseInt(data.pasajeros) > 16) upd('pasajeros', '16')
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
                  <button className="btn btn-primary" onClick={() => setStep(2)}>{r.step1.next}</button>
                </div>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>{r.step2.heading}</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>{r.step2.sub}</p>

                  <div className="form-grid" style={{ marginBottom: 24 }}>
                    <div className="field">
                      <label>{r.step2.origin}</label>
                      <input type="text" placeholder={r.step2.originPlaceholder}
                        value={data.origen} onChange={e => upd('origen', e.target.value)}
                        style={fieldErrors.origen ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.origen && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.origen}</span>}
                    </div>
                    <div className="field">
                      <label>{r.step2.destination}</label>
                      <input type="text" placeholder={r.step2.destinationPlaceholder}
                        value={data.destino} onChange={e => upd('destino', e.target.value)}
                        style={fieldErrors.destino ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.destino && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.destino}</span>}
                    </div>
                    <div className="field">
                      <label>{r.step2.date}</label>
                      <input type="date" value={data.fecha} min={todayStr} onChange={e => upd('fecha', e.target.value)}
                        style={fieldErrors.fecha ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.fecha && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.fecha}</span>}
                    </div>
                    <div className="field">
                      <label>{r.step2.time}</label>
                      <input type="time" value={data.hora} onChange={e => upd('hora', e.target.value)}
                        style={fieldErrors.hora ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.hora && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.hora}</span>}
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end' }}>
                      <div className="field" style={{ margin: 0 }}>
                        <label>{r.step2.pax}</label>
                        <select value={data.pasajeros} onChange={e => upd('pasajeros', e.target.value)}>
                          {Array.from({ length: paxLimit }, (_, i) => String(i + 1)).map(n => (
                            <option key={n} value={n}>{n} {n === '1' ? r.step2.paxSingle : r.step2.paxPlural}</option>
                          ))}
                          <option value={String(paxLimit + 1)}>{r.step2.paxOver.replace('{n}', String(paxLimit))}</option>
                        </select>
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>{r.step2.luggage}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{r.step2.luggageSmall}</div>
                          <select value={data.equipajePequeno} onChange={e => upd('equipajePequeno', e.target.value)}>
                            {Array.from({ length: 7 }, (_, i) => String(i)).map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{r.step2.luggageLarge}</div>
                          <select value={data.equipajeGrande} onChange={e => upd('equipajeGrande', e.target.value)}>
                            {Array.from({ length: 7 }, (_, i) => String(i)).map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {(parseInt(data.equipajePequeno||'0') + parseInt(data.equipajeGrande||'0') * 2) > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>
                          = {parseInt(data.equipajePequeno||'0') + parseInt(data.equipajeGrande||'0') * 2} {r.step2.luggageUnits}
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {showPriceBanner && (
                    <div style={{ padding: '14px 18px', marginBottom: 24, background: 'var(--accent-soft)', border: '1px solid var(--accent)', fontSize: 13, color: 'var(--fg-muted)' }}>
                      <strong style={{ color: 'var(--accent)' }}>{r.step2.fixedPriceLabel}</strong>{' '}
                      {overLimit
                        ? r.step2.fixedPriceGroup.replace('{n}', String(paxLimit))
                        : r.step2.fixedPricePax
                            .replace('{pax}', data.pasajeros)
                            .replace('{paxWord}', pax === 1 ? r.step2.paxSingle : r.step2.paxPlural)
                            .replace('{price}', `${amount} €`)}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 28, marginBottom: 28 }}>
                    <div className="eyebrow" style={{ marginBottom: 20 }}>{r.step2.extraSection}</div>
                    <div className="form-grid">
                      {isAirport && (
                        <>
                          <div className="field">
                            <label>{r.step2.flightIn}</label>
                            <input type="text" placeholder={r.step2.flightInPlaceholder}
                              value={data.vuelo} onChange={e => upd('vuelo', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>{r.step2.flightOut}</label>
                            <input type="text" placeholder={r.step2.flightOutPlaceholder}
                              value={data.vueloVuelta} onChange={e => upd('vueloVuelta', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>{r.step2.hotelIn}</label>
                            <input type="text" placeholder={r.step2.hotelInPlaceholder}
                              value={data.hotel} onChange={e => upd('hotel', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>{r.step2.hotelOut}</label>
                            <input type="text" placeholder={r.step2.hotelOutPlaceholder}
                              value={data.hotelVuelta} onChange={e => upd('hotelVuelta', e.target.value)} />
                          </div>
                        </>
                      )}
                      {data.serviceType === 'disneyland' && (
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                          <label>{r.step2.disneyHotel}</label>
                          <input type="text" placeholder={r.step2.disneyHotelPlaceholder}
                            value={data.hotel} onChange={e => upd('hotel', e.target.value)} />
                        </div>
                      )}
                      {hasReturn && (
                        <>
                          <div className="field">
                            <label>{r.step2.returnDate}</label>
                            <input type="date" value={data.fechaVuelta} min={data.fecha || todayStr}
                              onChange={e => upd('fechaVuelta', e.target.value)} />
                          </div>
                          <div className="field">
                            <label>{r.step2.returnTime}</label>
                            <input type="time" value={data.horaVuelta} onChange={e => upd('horaVuelta', e.target.value)} />
                          </div>
                        </>
                      )}
                      {data.serviceType === 'citytour' && (
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                          <label>{r.step2.duration}</label>
                          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                            {[
                              { v: '3h', l: r.step2.dur3h },
                              { v: '4h', l: r.step2.dur4h },
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
                      <div className="field" style={{ gridColumn: '1/-1' }}>
                        <label>{r.step2.children}</label>
                        <input type="text" placeholder={r.step2.childrenPlaceholder}
                          value={data.edadNinos} onChange={e => upd('edadNinos', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => { setFieldErrors({}); setStep(1) }}>{r.step2.prev}</button>
                    <button className="btn btn-primary" onClick={() => { if (validateStep2()) setStep(3) }}>{r.step2.next}</button>
                  </div>
                </div>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>{r.step3.heading}</h3>
                  <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>{r.step3.sub}</p>

                  <div className="form-grid" style={{ marginBottom: 24 }}>
                    <div className="field">
                      <label>{r.step3.firstName}</label>
                      <input type="text" placeholder={r.step3.firstNamePlaceholder}
                        value={data.nombre} onChange={e => upd('nombre', e.target.value)}
                        style={fieldErrors.nombre ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.nombre && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.nombre}</span>}
                    </div>
                    <div className="field">
                      <label>{r.step3.lastName}</label>
                      <input type="text" placeholder={r.step3.lastNamePlaceholder} value={data.apellido} onChange={e => upd('apellido', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>{r.step3.email}</label>
                      <input type="email" placeholder={r.step3.emailPlaceholder}
                        value={data.email} onChange={e => upd('email', e.target.value)}
                        style={fieldErrors.email ? { borderColor: 'oklch(0.65 0.14 20)' } : {}} />
                      {fieldErrors.email && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.email}</span>}
                    </div>
                    <div className="field">
                      <label>{r.step3.phone}</label>
                      <PhoneInput
                        prefix={phonePrefix} number={phoneNumber}
                        onPrefixChange={setPhonePrefix}
                        onNumberChange={v => { setPhoneNumber(v); if (fieldErrors.telefono) setFieldErrors(f => { const n = { ...f }; delete n.telefono; return n }) }}
                        style={fieldErrors.telefono ? { borderColor: 'oklch(0.65 0.14 20)' } : undefined}
                      />
                      {fieldErrors.telefono && <span style={{ fontSize: 11, color: 'oklch(0.75 0.12 20)', marginTop: 4, display: 'block' }}>{fieldErrors.telefono}</span>}
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label>{r.step3.message}</label>
                      <textarea placeholder={r.step3.messagePlaceholder}
                        value={data.mensaje} onChange={e => upd('mensaje', e.target.value)} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ padding: '14px 18px', marginBottom: 20, background: 'oklch(0.35 0.08 20 / 0.25)', border: '1px solid oklch(0.55 0.12 20)', fontSize: 13, color: 'oklch(0.85 0.08 20)' }}>
                      Error: {error}
                    </div>
                  )}

                  {showAuthNudge ? (
                    <div style={{ padding: '24px', border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 400, marginBottom: 8 }}>
                        {r.step3.authNudge.heading}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                        {r.step3.authNudge.sub}
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                        <button className="btn btn-primary" onClick={() => saveDraftAndRedirect('/login')}>
                          {r.step3.authNudge.signIn}
                        </button>
                        <button className="btn btn-ghost" onClick={() => saveDraftAndRedirect('/register')}>
                          {r.step3.authNudge.register}
                        </button>
                      </div>
                      <button
                        onClick={doSubmit}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: 13, padding: 0 }}
                      >
                        {r.step3.authNudge.continueWithout}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button className="btn btn-ghost" onClick={() => { setFieldErrors({}); setStep(2) }} disabled={loading}>{r.step3.prev}</button>
                      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                        {loading ? r.step3.submitting : r.step3.submit}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside style={{ border: '1px solid var(--line)', padding: 32, alignSelf: 'start', position: 'sticky', top: 100 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>{r.sidebar.eyebrow}</div>
              <div className="placeholder" data-label={sidebarImg} style={{ ...bg(sidebarImg), aspectRatio: '16/10', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SummaryRow k={r.sidebar.service}     v={r.services[SERVICE_IDS.indexOf(data.serviceType)]?.t ?? '—'} />
                <SummaryRow k={r.sidebar.departure}   v={data.origen || '—'} />
                <SummaryRow k={r.sidebar.destination} v={data.destino || '—'} />
                <SummaryRow k={r.sidebar.date}        v={data.fecha ? `${data.fecha} ${data.hora}`.trim() : '—'} />
                {data.fechaVuelta && <SummaryRow k={r.sidebar.return} v={`${data.fechaVuelta} ${data.horaVuelta}`.trim()} />}
                <SummaryRow k={r.sidebar.passengers}  v={overLimit ? `+${paxLimit} · WhatsApp` : data.pasajeros} />
                {!overLimit && <SummaryRow k={r.step2.luggage} v={`${data.equipajeGrande} ${r.step2.luggageLarge.split(' ')[0].toLowerCase()} · ${data.equipajePequeno} ${r.step2.luggageSmall.split(' ')[0].toLowerCase()} (${parseInt(data.equipajeGrande||'0')*2 + parseInt(data.equipajePequeno||'0')}u)`} />}
                {data.vuelo       && <SummaryRow k={r.sidebar.flightIn}  v={data.vuelo} />}
                {data.vueloVuelta && <SummaryRow k={r.sidebar.flightOut} v={data.vueloVuelta} />}
                {data.hotel       && <SummaryRow k={r.sidebar.hotel}     v={data.hotel} />}
              </div>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{r.sidebar.priceLabel}</div>
                <div className="display" style={{ fontSize: 28, fontWeight: 400, color: overLimit ? 'var(--fg-muted)' : 'var(--fg)' }}>
                  {getPriceLabel()}
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 8 }}>{getPriceNote()}</p>
                {overLimit && (
                  <a href="https://wa.me/33643272173" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: 16, fontSize: 12 }}>
                    {r.price.contactWhatsApp}
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
