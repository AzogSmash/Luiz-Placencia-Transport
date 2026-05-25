'use server'

import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore — stripe v22 uses package default version
  apiVersion: undefined,
})

type CheckoutResult = { url: string; error?: never } | { url: null; error: string }

export async function createCheckoutSession(
  reservationId: number,
  amount: number,
  serviceLabel: string,
  customerEmail: string,
): Promise<CheckoutResult> {
  try {
    const h = headers()
    const host = h.get('host') ?? 'localhost:3000'
    const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const base = `${proto}://${host}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Luis Plasencia Transport — ${serviceLabel}`,
            description: `Reserva #${reservationId}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      locale: 'es',
      success_url: `${base}/reserva/pago-exitoso?session_id={CHECKOUT_SESSION_ID}&ref=${reservationId}`,
      cancel_url: `${base}/reserva`,
      metadata: { reservation_id: String(reservationId) },
    } as Parameters<typeof stripe.checkout.sessions.create>[0])

    return { url: session.url! }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error desconocido'
    return { url: null, error: msg }
  }
}
