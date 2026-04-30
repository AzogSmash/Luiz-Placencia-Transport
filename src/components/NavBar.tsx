'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Logo from './Logo'
import { createClient } from '@/lib/supabase-browser'

const NAV_ITEMS = [
  { href: '/',          label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/reserva',   label: 'Reserva' },
  { href: '/contacto',  label: 'Contacto' },
]

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'oklch(0.16 0.005 240 / 0.82)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--line-soft)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 76,
      }}>
        <Link href="/"><Logo /></Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-links">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: active ? 'var(--fg)' : 'var(--fg-muted)',
                fontWeight: 500,
                paddingBottom: 4,
                borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
                transition: 'all 0.18s ease',
              }}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="tel:+33600000000" className="mono nav-phone" style={{
            color: 'var(--fg-muted)',
            fontSize: 12,
            letterSpacing: '0.06em',
          }}>
            +33 6 00 00 00 00
          </a>

          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                Mi cuenta
              </Link>
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{ fontSize: 12, padding: '10px 16px' }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 16px' }}>
                Iniciar sesión
              </Link>
              <Link href="/reserva" className="btn btn-primary">
                Reservar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
