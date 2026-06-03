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
    .select('path, country, device, browser, os, referrer, created_at, ip_hash')
    .gte('created_at', from)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const byPath:     Record<string, number> = {}
  const byCountry:  Record<string, number> = {}
  const byDevice:   Record<string, number> = {}
  const byBrowser:  Record<string, number> = {}
  const byOS:       Record<string, number> = {}
  const byReferrer: Record<string, number> = {}

  const sessions = new Set<string>()
  const sessionsByDay:      Record<string, Set<string>> = {}
  const sessionsByCountry:  Record<string, Set<string>> = {}
  const sessionsByDevice:   Record<string, Set<string>> = {}
  const sessionsByBrowser:  Record<string, Set<string>> = {}
  const sessionsByOS:       Record<string, Set<string>> = {}
  const sessionsByReferrer: Record<string, Set<string>> = {}

  for (const v of views ?? []) {
    const day = (v.created_at as string).slice(0, 10)
    // ip_hash+day = precise unique visitor; fallback to country+device+day for old rows
    const sessionKey = v.ip_hash
      ? `ip:${v.ip_hash}-${day}`
      : `${v.country ?? '?'}-${v.device ?? '?'}-${day}`

    sessions.add(sessionKey)
    byPath[v.path] = (byPath[v.path] ?? 0) + 1  // pages = page views

    if (!sessionsByDay[day]) sessionsByDay[day] = new Set()
    sessionsByDay[day].add(sessionKey)

    if (v.country) {
      if (!sessionsByCountry[v.country]) sessionsByCountry[v.country] = new Set()
      sessionsByCountry[v.country].add(sessionKey)
    }
    if (v.device) {
      if (!sessionsByDevice[v.device]) sessionsByDevice[v.device] = new Set()
      sessionsByDevice[v.device].add(sessionKey)
    }
    if (v.browser) {
      if (!sessionsByBrowser[v.browser]) sessionsByBrowser[v.browser] = new Set()
      sessionsByBrowser[v.browser].add(sessionKey)
    }
    if (v.os) {
      if (!sessionsByOS[v.os]) sessionsByOS[v.os] = new Set()
      sessionsByOS[v.os].add(sessionKey)
    }
    if (v.referrer) {
      try {
        const hostname = new URL(v.referrer).hostname.replace(/^www\./, '')
        if (hostname && !hostname.includes('luisplasenciatransport.com')) {
          if (!sessionsByReferrer[hostname]) sessionsByReferrer[hostname] = new Set()
          sessionsByReferrer[hostname].add(sessionKey)
        }
      } catch { /* invalid URL */ }
    }
  }

  // All dimensions use unique session counts (consistent with visitors KPI)
  for (const [c, s] of Object.entries(sessionsByCountry))  byCountry[c]  = s.size
  for (const [d, s] of Object.entries(sessionsByDevice))   byDevice[d]   = s.size
  for (const [b, s] of Object.entries(sessionsByBrowser))  byBrowser[b]  = s.size
  for (const [o, s] of Object.entries(sessionsByOS))       byOS[o]       = s.size
  for (const [r, s] of Object.entries(sessionsByReferrer)) byReferrer[r] = s.size

  const total    = views?.length ?? 0
  const visitors = sessions.size

  // Per-category totals so percentages always sum to 100% within each category
  const countryTotal = Object.values(byCountry).reduce((s, v) => s + v, 0)
  const deviceTotal  = Object.values(byDevice).reduce((s, v) => s + v, 0)
  const browserTotal = Object.values(byBrowser).reduce((s, v) => s + v, 0)
  const osTotal      = Object.values(byOS).reduce((s, v) => s + v, 0)

  const pctOf = (v: number, cat: number) => cat > 0 ? Math.round((v / cat) * 100) : 0

  // Full date range — unique visitors (sessions) per day
  const timeseries: { x: string; y: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    timeseries.push({ x: key, y: sessionsByDay[key]?.size ?? 0 })
  }

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])

  const countryNames = new Intl.DisplayNames(['es'], { type: 'region' })

  return NextResponse.json({
    visitors,
    pageviews: total,
    timeseries,
    pages:     sortDesc(byPath).slice(0, 10).map(([path, v]) => ({ path, visitors: v })),
    countries: sortDesc(byCountry).slice(0, 8).map(([code, v]) => ({
      country: countryNames.of(code) ?? code,
      code,
      visitors: v,
      pct: pctOf(v, countryTotal),
    })),
    referrers: sortDesc(byReferrer).slice(0, 8).map(([referrer, v]) => ({ referrer, visitors: v })),
    devices:   sortDesc(byDevice).slice(0, 4).map(([device, v])   => ({ device,   visitors: v, pct: pctOf(v, deviceTotal)  })),
    browsers:  sortDesc(byBrowser).slice(0, 6).map(([browser, v]) => ({ browser,  visitors: v, pct: pctOf(v, browserTotal) })),
    os:        sortDesc(byOS).slice(0, 6).map(([os, v])           => ({ os,       visitors: v, pct: pctOf(v, osTotal)      })),
  })
}
