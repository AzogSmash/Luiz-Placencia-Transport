import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec la clé service_role.
 * Bypass total du RLS — à n'utiliser que dans des Server Actions
 * ou Route Handlers. Ne jamais importer dans un Client Component.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
