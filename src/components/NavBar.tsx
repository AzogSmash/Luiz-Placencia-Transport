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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
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
          <Link href="/" onClick={() => setMobileOpen(false)}><Logo /></Link>

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
            <a href="tel:+33643272173" className="mono nav-phone" style={{
              color: 'var(--fg-muted)',
              fontSize: 12,
              letterSpacing: '0.06em',
            }}>
              +33 6 43 27 21 73
            </a>

            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost nav-auth" style={{ fontSize: 12, padding: '10px 16px' }}>
                  Mi cuenta
                </Link>
                <button className="btn btn-ghost nav-auth" onClick={handleLogout} disabled={loggingOut} style={{ fontSize: 12, padding: '10px 16px', opacity: loggingOut ? 0.6 : 1, cursor: loggingOut ? 'wait' : 'pointer' }}>
                  {loggingOut ? '…' : 'Salir'}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost nav-auth" style={{ fontSize: 12, padding: '10px 16px' }}>
                  Iniciar sesión
                </Link>
                <Link href="/reserva" className="btn btn-primary">
                  Reservar
                </Link>
              </>
            )}

            {/* Hamburger — shown only on mobile via CSS */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              style={{
                background: 'transparent',
                border: `1px solid ${mobileOpen ? 'var(--accent)' : 'var(--line)'}`,
                cursor: 'pointer',
                padding: '9px 11px',
                borderRadius: 'var(--radius)',
                flexDirection: 'column',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.18s ease',
              }}
            >
              <span style={{ display: 'block', width: 20, height: 1.5, background: mobileOpen ? 'var(--accent)' : 'var(--fg)' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: mobileOpen ? 'var(--accent)' : 'var(--fg)' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: mobileOpen ? 'var(--accent)' : 'var(--fg)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 48 }}
          aria-hidden
        />
      )}
      {mobileOpen && (
        <nav style={{
          position: 'fixed',
          top: 76,
          left: 0,
          right: 0,
          background: 'oklch(0.16 0.005 240 / 0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--line-soft)',
          zIndex: 49,
        }}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '18px 24px',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--accent)' : 'var(--fg-muted)',
                  borderBottom: '1px solid var(--line-soft)',
                  transition: 'color 0.18s ease',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-ghost" style={{ textAlign: 'center', fontSize: 13 }}>
                  Mi cuenta
                </Link>
                <button onClick={() => { setMobileOpen(false); handleLogout() }} disabled={loggingOut} className="btn btn-ghost" style={{ fontSize: 13, opacity: loggingOut ? 0.6 : 1 }}>
                  {loggingOut ? 'Cerrando sesión…' : 'Salir'}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost" style={{ textAlign: 'center', fontSize: 13 }}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  )
}
