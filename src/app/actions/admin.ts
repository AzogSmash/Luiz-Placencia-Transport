'use server'

import { revalidatePath } from 'next/cache'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { resend, FROM } from '@/lib/resend'
import { emailStatusUpdate } from '@/lib/emails'

const VALID_STATUSES = ['en attente', 'confirmée', 'en cours', 'terminée', 'annulée'] as const
type ValidStatus = (typeof VALID_STATUSES)[number]

export type AdminActionResult = { success: true } | { success: false; error: string }

export type NotifPrefs = {
  notif_new_reservation: boolean
  notif_payment:         boolean
  notif_cancellation:    boolean
}

export type AdminLog = {
  id:             number
  type:           string
  reservation_id: number | null
  message:        string
  created_at:     string
}

// Returns user id if admin, null otherwise
async function assertAdmin(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data } = await admin.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin' ? user.id : null
}

async function getAdminNotifPrefs(): Promise<NotifPrefs> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('notif_new_reservation, notif_payment, notif_cancellation')
    .eq('role', 'admin')
    .limit(1)
    .single()
  return {
    notif_new_reservation: data?.notif_new_reservation ?? true,
    notif_payment:         data?.notif_payment         ?? true,
    notif_cancellation:    data?.notif_cancellation    ?? true,
  }
}

export async function logEvent(
  type: string,
  reservation_id: number | null,
  message: string,
) {
  const admin = createAdminClient()
  try { await admin.from('admin_logs').insert({ type, reservation_id, message }) } catch { }
}

export async function updateReservationStatus(
  id: number,
  statut: string,
): Promise<AdminActionResult> {
  if (!VALID_STATUSES.includes(statut as ValidStatus)) return { success: false, error: 'Statut invalide' }
  const userId = await assertAdmin()
  if (!userId) return { success: false, error: 'Accès refusé' }

  const admin = createAdminClient()
  const { data: reservation } = await admin
    .from('reservations')
    .select('id, nom, email, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message')
    .eq('id', id)
    .single()

  const { error } = await admin.from('reservations').update({ statut }).eq('id', id)
  if (error) return { success: false, error: error.message }

  const statusLabel: Record<string, string> = {
    'confirmée': 'Confirmada', 'annulée': 'Cancelada',
    'en cours': 'En curso', 'terminée': 'Finalizada', 'en attente': 'En espera',
  }
  await logEvent(
    `estado_${statut.replace(/ /g, '_')}`,
    id,
    `Reserva #${id} (${reservation?.nom ?? ''}) → ${statusLabel[statut] ?? statut}`,
  )

  if (reservation?.email) {
    const prefs = await getAdminNotifPrefs()
    const notify =
      (statut === 'confirmée' && prefs.notif_payment) ||
      (statut === 'annulée'   && prefs.notif_cancellation) ||
      (statut !== 'confirmée' && statut !== 'annulée')

    if (notify) {
      resend.emails.send({
        from: FROM,
        to:   reservation.email,
        ...emailStatusUpdate({ ...reservation, statut }),
      }).catch(err => console.error('[statusEmail]', err))
    }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteReservation(id: number): Promise<AdminActionResult> {
  const userId = await assertAdmin()
  if (!userId) return { success: false, error: 'Accès refusé' }

  const admin = createAdminClient()
  const { data: res } = await admin.from('reservations').select('nom').eq('id', id).single()
  const { error } = await admin.from('reservations').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  await logEvent('reserva_eliminada', null, `Reserva #${id} (${res?.nom ?? ''}) eliminada`)
  revalidatePath('/admin')
  return { success: true }
}

export async function updateNotifPreferences(prefs: NotifPrefs): Promise<AdminActionResult> {
  const userId = await assertAdmin()
  if (!userId) return { success: false, error: 'Accès refusé' }

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update(prefs).eq('id', userId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  return { success: true }
}
