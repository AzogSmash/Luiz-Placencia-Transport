import { NextRequest, NextResponse } from 'next/server'
import { createClient }      from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

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
  const days = searchParams.get('days') === '30' ? 30 : 7
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const admin = createAdminClient()
  const { data: views, error } = await admin
    .from('page_views')
    .select('path, country, device, referrer, created_at')
    .gte('created_at', from)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const byPath:     Record<string, number> = {}
  const byCountry:  Record<string, number> = {}
  const byDevice:   Record<string, number> = {}
  const byReferrer: Record<string, number> = {}

  // Track unique sessions (country+device+day) as approximate visitor count
  const sessions = new Set<string>()

  for (const v of views ?? []) {
    const day = (v.created_at as string).slice(0, 10)

    sessions.add(`${v.country ?? '?'}-${v.device ?? '?'}-${day}`)
    byPath[v.path]    = (byPath[v.path] ?? 0) + 1

    if (v.country) byCountry[v.country] = (byCountry[v.country] ?? 0) + 1
    if (v.device)  byDevice[v.device]   = (byDevice[v.device]   ?? 0) + 1

    if (v.referrer) {
      try {
        const hostname = new URL(v.referrer).hostname.replace(/^www\./, '')
        // Filter out self-referrers
        if (hostname && !hostname.includes('luisplasenciatransport.com')) {
          byReferrer[hostname] = (byReferrer[hostname] ?? 0) + 1
        }
      } catch { /* invalid URL */ }
    }
  }

  const total     = views?.length ?? 0
  const visitors  = sessions.size

  // Generate full date range so graph always shows all days (even 0s)
  const timeseries: { x: string; y: number }[] = []
  const byDay: Record<string, number> = {}
  for (const v of views ?? []) {
    const day = (v.created_at as string).slice(0, 10)
    byDay[day] = (byDay[day] ?? 0) + 1
  }
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    timeseries.push({ x: key, y: byDay[key] ?? 0 })
  }

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])

  // Resolve country codes to full Spanish names
  const countryNames = new Intl.DisplayNames(['es'], { type: 'region' })
  const countriesArr = sortDesc(byCountry)
  const devicesArr   = sortDesc(byDevice)

  return NextResponse.json({
    visitors,
    pageviews: total,
    timeseries,
    pages:     sortDesc(byPath).slice(0, 10).map(([path, pageviews]) => ({ path, visitors: pageviews })),
    countries: countriesArr.slice(0, 8).map(([code, v]) => ({
      country: countryNames.of(code) ?? code,
      code,
      visitors: v,
      pct: total > 0 ? Math.round((v / total) * 100) : 0,
    })),
    referrers: sortDesc(byReferrer).slice(0, 8).map(([referrer, v]) => ({ referrer, visitors: v })),
    devices:   devicesArr.slice(0, 4).map(([device, v]) => ({
      device,
      visitors: v,
      pct: total > 0 ? Math.round((v / total) * 100) : 0,
    })),
  })
}
