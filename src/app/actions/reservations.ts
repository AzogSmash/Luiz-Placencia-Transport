'use server'

import { createClient }      from '@/lib/supabase-server' // session utilisateur
import { createAdminClient } from '@/lib/supabase-admin'  // insert sans RLS

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
  // Récupérer l'utilisateur connecté via ses cookies (clé anon + session)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Insérer avec la clé service_role pour bypasser le RLS
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

  return { success: true, id: data.id }
}
