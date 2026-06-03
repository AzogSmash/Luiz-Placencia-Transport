'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
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
  admin_id:       string | null
  admin_name?:    string
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

export async function logEvent(
  type: string,
  reservation_id: number | null,
  message: string,
  admin_id?: string,
) {
  const admin = createAdminClient()
  try { await admin.from('admin_logs').insert({ type, reservation_id, message, admin_id: admin_id ?? null }) } catch { }
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
    .select('id, nom, email, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message, stripe_payment_intent_id, user_id')
    .eq('id', id)
    .single()

  const { error } = await admin.from('reservations').update({ statut }).eq('id', id)
  if (error) return { success: false, error: error.message }

  // Remboursement automatique Stripe si paiement existant
  if (statut === 'annulée' && reservation?.stripe_payment_intent_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' as any })
      await stripe.refunds.create({ payment_intent: reservation.stripe_payment_intent_id })
      await logEvent('reembolso_emitido', id, `Reembolso emitido para reserva #${id} (${reservation.nom})`, userId)
    } catch (refundErr) {
      console.error('[refund]', refundErr)
      await logEvent('reembolso_error', id, `Error al emitir reembolso para reserva #${id}`, userId)
    }
  }

  const statusLabel: Record<string, string> = {
    'confirmée': 'Confirmada', 'annulée': 'Cancelada',
    'en cours': 'En curso', 'terminée': 'Finalizada', 'en attente': 'En espera',
  }
  await logEvent(
    `estado_${statut.replace(/ /g, '_')}`,
    id,
    `Reserva #${id} (${reservation?.nom ?? ''}) → ${statusLabel[statut] ?? statut}`,
    userId,
  )

  if (reservation?.email) {
    // Toujours envoyer au client, sauf s'il a désactivé ses notifications
    let clientWantsEmail = true
    if (reservation.user_id) {
      const { data: clientProfile } = await admin
        .from('profiles')
        .select('notif_emails')
        .eq('id', reservation.user_id)
        .maybeSingle()
      clientWantsEmail = clientProfile?.notif_emails !== false
    }

    if (clientWantsEmail) {
      resend.emails.send({
        from: FROM,
        to:   reservation.email,
        ...emailStatusUpdate({ ...reservation, statut }),
      }).catch(err => console.error('[statusEmail]', err))
    }

    // Notifier les admins selon leurs préférences individuelles
    if (statut === 'confirmée' || statut === 'annulée') {
      const { data: adminProfiles } = await admin
        .from('profiles')
        .select('id, notif_payment, notif_cancellation')
        .eq('role', 'admin')

      for (const profile of adminProfiles ?? []) {
        const shouldSend =
          (statut === 'confirmée' && profile.notif_payment) ||
          (statut === 'annulée'   && profile.notif_cancellation)
        if (!shouldSend) continue

        const { data: { user: adminUser } } = await admin.auth.admin.getUserById(profile.id)
        if (adminUser?.email) {
          resend.emails.send({
            from: FROM,
            to:   adminUser.email,
            subject: statut === 'confirmée'
              ? `✅ Pago confirmado — Reserva #${id} (${reservation.nom})`
              : `⚠️ Reserva cancelada — #${id} (${reservation.nom})`,
            html: `<p>La reserva #${id} de <strong>${reservation.nom}</strong> ha pasado al estado: <strong>${statusLabel[statut] ?? statut}</strong>.</p><p><a href="https://luisplasenciatransport.com/admin">Abrir panel admin →</a></p>`,
          }).catch(err => console.error('[adminStatusEmail]', err))
        }
      }
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

  await logEvent('reserva_eliminada', null, `Reserva #${id} (${res?.nom ?? ''}) eliminada`, userId)
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
