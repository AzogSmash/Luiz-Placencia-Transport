import { NextRequest, NextResponse } from 'next/server'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

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

// Route de debug — retourne la réponse brute de l'API Vercel pour identifier les bons endpoints
export async function GET(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const now  = Date.now()
  const from = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
  const to   = new Date(now).toISOString()

  const candidates = [
    `https://vercel.com/api/web-analytics/timeseries?projectId=${PROJECT}&from=${from}&to=${to}`,
    `https://api.vercel.com/v1/web/analytics/timeseries?projectId=${PROJECT}&from=${from}&to=${to}`,
    `https://api.vercel.com/v6/analytics?projectId=${PROJECT}&from=${from}&to=${to}`,
  ]

  const results: Record<string, unknown> = {}
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
      const text = await res.text()
      results[url] = { status: res.status, body: text.slice(0, 500) }
    } catch (e) {
      results[url] = { error: String(e) }
    }
  }

  return NextResponse.json(results)
}
