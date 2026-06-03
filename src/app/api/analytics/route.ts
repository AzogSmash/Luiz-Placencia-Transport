import { NextRequest, NextResponse } from 'next/server'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

const BASE    = 'https://vercel.com/api/web-analytics'
const TOKEN   = process.env.VERCEL_API_TOKEN
const PROJECT = process.env.VERCEL_PROJECT_ID

async function isAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const admin = createAdminClient()
  const { data } = await admin.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const metric = searchParams.get('metric') ?? 'timeseries'

  const now  = Date.now()
  const from = searchParams.get('from') ?? new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
  const to   = searchParams.get('to')   ?? new Date(now).toISOString()

  const params = new URLSearchParams({ projectId: PROJECT!, from, to, limit: '10' })

  const res = await fetch(`${BASE}/${metric}?${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next: { revalidate: 300 },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}
