'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/resend'
import { emailContactAdmin } from '@/lib/emails'

export type ContactResult = { success: true } | { success: false; error: string }

export async function sendContactMessage(
  nombre: string,
  email: string,
  mensaje: string,
): Promise<ContactResult> {
  if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
    return { success: false, error: 'Todos los campos son obligatorios.' }
  }

  // Save to DB for record-keeping
  const admin = createAdminClient()
  await admin.from('contact_messages').insert([{ nombre, email, mensaje }])
    .then(({ error }) => {
      if (error) console.error('[contact insert]', error.message)
    })

  // Notify admin by email
  const { error } = await resend.emails.send({
    from:    FROM,
    to:      ADMIN_EMAIL,
    replyTo: email,
    ...emailContactAdmin(nombre, email, mensaje),
  })

  if (error) {
    console.error('[contactEmail]', error)
    return { success: false, error: 'Error al enviar el mensaje. Inténtelo de nuevo.' }
  }

  return { success: true }
}
