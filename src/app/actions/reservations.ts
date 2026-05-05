'use server'

import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/resend'
import { emailReservationConfirmation, emailNewReservationAdmin } from '@/lib/emails'

export type ReservationPayload = {
  nom:               string
  telephone:         string
  email:             string
  adresse_depart:    string
  adresse_arrivee:   string
  date_heure:        string
  nombre_passagers:  number
  message:           string | null
}

export type ActionResult =
  | { success: true;  id: number }
  | { success: false; error: string }

export async function createReservation(
  payload: ReservationPayload,
): Promise<ActionResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('reservations')
    .insert([{
      ...payload,
      statut:  'en attente',
      user_id: user?.id ?? null,
    }])
    .select('id')
    .single()

  if (error) {
    console.error('[createReservation]', error.message)
    return { success: false, error: error.message }
  }

  const reservation = { ...payload, id: data.id }

  // Emails en parallèle — une erreur d'envoi ne bloque pas la réservation
  await Promise.allSettled([
    resend.emails.send({
      from:    FROM,
      to:      payload.email,
      ...emailReservationConfirmation(reservation),
    }),
    resend.emails.send({
      from:    FROM,
      to:      ADMIN_EMAIL,
      ...emailNewReservationAdmin(reservation),
    }),
  ])

  return { success: true, id: data.id }
}
