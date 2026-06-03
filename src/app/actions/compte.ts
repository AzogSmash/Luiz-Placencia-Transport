'use server'

import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export type AccountActionResult = { success: true } | { success: false; error: string }

export async function updateClientNotifPrefs(notif_emails: boolean): Promise<AccountActionResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ notif_emails }).eq('id', user.id)
  if (error) return { success: false, error: error.message }

  return { success: true }
}
