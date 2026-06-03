import Stripe from 'stripe'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'

export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: { session_id?: string; ref?: string }
}) {
  const { session_id, ref } = searchParams
  let paid = false
  let customerEmail = ''

  if (session_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        // @ts-ignore
        apiVersion: undefined,
      })
      const session = await stripe.checkout.sessions.retrieve(session_id)
      paid = session.payment_status === 'paid'
      customerEmail = session.customer_details?.email ?? ''

      if (paid && ref) {
        const admin = createAdminClient()
        await admin
          .from('reservations')
          .update({
            statut: 'confirmée',
            stripe_session_id: session_id,
            stripe_payment_intent_id: (session.payment_intent as string) ?? null,
          })
          .eq('id', parseInt(ref))
      }
    } catch {
      // session_id invalide ou expiré
    }
  }

  return (
    <main className="page-enter">
      <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>

          {paid ? (
            <>
              <div className="tag" style={{ justifyContent: 'center', marginBottom: 32 }}>
                <span className="dot" /><span>Pago recibido</span>
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: 0, marginBottom: 24 }}>
                Reserva{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>confirmada.</em>
              </h1>
              {ref && (
                <div className="mono" style={{ color: 'var(--accent)', marginBottom: 16, fontSize: 13 }}>
                  Reserva #{ref}
                </div>
              )}
              <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                Pago procesado correctamente.{' '}
                {customerEmail
                  ? <>Recibirá la confirmación en <strong style={{ color: 'var(--fg)' }}>{customerEmail}</strong>.</>
                  : 'Le enviaremos los detalles por correo.'}
                {' '}Su chófer le estará esperando a la hora indicada.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="btn btn-primary">Volver al inicio</Link>
                <a
                  href="https://wa.me/33643272173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', margin: 0, marginBottom: 24 }}>
                Pago no confirmado
              </h1>
              <p className="lead" style={{ marginBottom: 40, marginLeft: 'auto', marginRight: 'auto' }}>
                No hemos podido verificar su pago. Si realizó el pago, contacte con nosotros
                y le confirmaremos su reserva de inmediato.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/reserva" className="btn btn-primary">Intentar de nuevo</Link>
                <a
                  href="https://wa.me/33643272173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  WhatsApp
                </a>
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  )
}
