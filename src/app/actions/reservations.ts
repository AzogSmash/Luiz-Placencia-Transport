'use server'

import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { resend, FROM } from '@/lib/resend'
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

  const adminDb = createAdminClient()

  // Récupère tous les admins avec leurs préférences et emails
  const { data: adminProfiles } = await adminDb
    .from('profiles')
    .select('id, notif_new_reservation')
    .eq('role', 'admin')

  const adminEmailsToNotify: string[] = []
  for (const profile of adminProfiles ?? []) {
    if (!profile.notif_new_reservation) continue
    const { data: { user } } = await adminDb.auth.admin.getUserById(profile.id)
    if (user?.email) adminEmailsToNotify.push(user.email)
  }

  try {
    await adminDb.from('admin_logs').insert({
      type: 'nueva_reserva',
      reservation_id: data.id,
      message: `Nueva reserva #${data.id} de ${payload.nom}`,
    })
  } catch { }

  await Promise.allSettled([
    resend.emails.send({ from: FROM, to: payload.email, ...emailReservationConfirmation(reservation) }),
    ...adminEmailsToNotify.map(email =>
      resend.emails.send({ from: FROM, to: email, ...emailNewReservationAdmin(reservation) })
    ),
  ])

  return { success: true, id: data.id }
}
