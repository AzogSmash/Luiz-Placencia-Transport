import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import PagoExitosoClient from '@/components/PagoExitosoClient'

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

  return <PagoExitosoClient paid={paid} customerEmail={customerEmail} bookingRef={ref} />
}
