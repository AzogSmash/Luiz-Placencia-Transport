'use server'

import { revalidatePath } from 'next/cache'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { resend, FROM } from '@/lib/resend'
import { emailStatusUpdate } from '@/lib/emails'

const VALID_STATUSES = [
  'en attente',
  'confirmée',
  'en cours',
  'terminée',
  'annulée',
] as const

type ValidStatus = (typeof VALID_STATUSES)[number]

export type AdminActionResult = { success: true } | { success: false; error: string }

async function assertAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role === 'admin'
}

export async function updateReservationStatus(
  id: number,
  statut: string,
): Promise<AdminActionResult> {
  if (!VALID_STATUSES.includes(statut as ValidStatus)) {
    return { success: false, error: 'Statut invalide' }
  }

  const isAdmin = await assertAdmin()
  if (!isAdmin) return { success: false, error: 'Accès refusé' }

  const admin = createAdminClient()

  // Fetch reservation details to send notification email
  const { data: reservation } = await admin
    .from('reservations')
    .select('id, nom, email, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message')
    .eq('id', id)
    .single()

  const { error } = await admin
    .from('reservations')
    .update({ statut })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  // Send status notification to client (non-blocking)
  if (reservation?.email) {
    resend.emails.send({
      from: FROM,
      to:   reservation.email,
      ...emailStatusUpdate({ ...reservation, statut }),
    }).catch(err => console.error('[statusEmail]', err))
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteReservation(id: number): Promise<AdminActionResult> {
  const isAdmin = await assertAdmin()
  if (!isAdmin) return { success: false, error: 'Accès refusé' }

  const admin = createAdminClient()
  const { error } = await admin.from('reservations').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  return { success: true }
}
