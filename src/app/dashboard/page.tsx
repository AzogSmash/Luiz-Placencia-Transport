import { redirect } from 'next/navigation'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import DashboardClient from '@/components/DashboardClient'

type Reservation = {
  id: number
  adresse_depart: string
  adresse_arrivee: string
  date_heure: string
  nombre_passagers: number
  message: string | null
  statut: string
  created_at: string
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin'

  const { data: raw } = await supabase
    .from('reservations')
    .select('id, adresse_depart, adresse_arrivee, date_heure, nombre_passagers, message, statut, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const reservations = (raw ?? []) as Reservation[]
  const pending   = reservations.filter(r => r.statut === 'en attente').length
  const confirmed = reservations.filter(r => r.statut === 'confirmée').length
  const userName  = (user.user_metadata?.full_name as string | undefined)
    ?? user.email?.split('@')[0]
    ?? 'Cliente'

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email ?? '', name: userName }}
      reservations={reservations}
      pending={pending}
      confirmed={confirmed}
      isAdmin={isAdmin}
    />
  )
}
