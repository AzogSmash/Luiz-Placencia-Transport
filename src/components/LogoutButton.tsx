'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      className="btn btn-ghost"
      onClick={handleLogout}
      disabled={loading}
      style={{ fontSize: 12, opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </button>
  )
}
