'use server'

import { createAdminClient } from '@/lib/supabase-admin'

export type NewsletterResult =
  | { success: true }
  | { success: false; error: string; already: boolean }

export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
  if (!email.trim()) {
    return { success: false, error: 'Introduzca un correo válido.', already: false }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('newsletter_subscribers')
    .insert([{ email: email.trim().toLowerCase() }])

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Este correo ya está suscrito.', already: true }
    }
    console.error('[newsletter]', error.message)
    return { success: false, error: 'Error al suscribirse. Inténtelo de nuevo.', already: false }
  }

  return { success: true }
}
