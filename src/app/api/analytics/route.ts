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

  const base = 'https://vercel.com/api/web-analytics'
  const candidates = [
    `${base}/timeseries?projectId=${PROJECT}&from=${from}&to=${to}&env=production&granularity=day`,
    `${base}/timeseries?projectId=${PROJECT}&from=${from}&to=${to}&environment=production`,
    `${base}/timeseries?projectId=${PROJECT}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    `${base}/summary?projectId=${PROJECT}&from=${from}&to=${to}&env=production`,
    `${base}/pages?projectId=${PROJECT}&from=${from}&to=${to}&env=production`,
  ]

  const results: Record<string, unknown> = {}
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
      const text = await res.text()
      results[url.replace(`projectId=${PROJECT}`, 'projectId=HIDDEN')] = { status: res.status, body: text.slice(0, 800) }
    } catch (e) {
      results[url] = { error: String(e) }
    }
  }

  return NextResponse.json(results)
}
