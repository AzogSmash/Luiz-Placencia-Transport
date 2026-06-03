'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LANGUAGES } from '@/lib/translations'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)

  const current = LANGUAGES.find(l => l.code === lang)!
  const others   = LANGUAGES.filter(l => l.code !== lang)

  return (
    <>
      {/* Backdrop — closes dropdown on outside click / tap */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setOpen(false)}
        />
      )}

      <div style={{ position: 'relative', zIndex: 151 }}>
        <button
          onClick={() => setOpen(o => !o)}
          title={current.label}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: open ? 'var(--accent-soft)' : 'transparent',
            border: `1px solid ${open ? 'var(--accent)' : 'var(--line)'}`,
            cursor: 'pointer', padding: '5px 8px', borderRadius: 4,
            transition: 'all 0.15s ease',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://flagcdn.com/20x15/${current.flag}.png`}
            width={20} height={15}
            alt={current.label}
            style={{ display: 'block', borderRadius: 1 }}
          />
          <span style={{
            fontSize: 10, letterSpacing: '0.1em', fontWeight: 600,
            color: open ? 'var(--accent)' : 'var(--fg-muted)',
            fontFamily: 'var(--mono)',
          }}>
            {current.label}
          </span>
          <span style={{
            fontSize: 8, color: 'var(--fg-dim)',
            transition: 'transform 0.15s ease',
            display: 'block',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            ▾
          </span>
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: 'oklch(0.20 0.005 240)',
            border: '1px solid var(--line)',
            borderRadius: 6, padding: '4px',
            minWidth: 90,
            boxShadow: '0 8px 24px oklch(0 0 0 / 0.4)',
          }}>
            {others.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  background: 'transparent', border: 0, cursor: 'pointer',
                  padding: '8px 10px', borderRadius: 4,
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/20x15/${l.flag}.png`}
                  width={20} height={15}
                  alt={l.label}
                  style={{ display: 'block', borderRadius: 1 }}
                />
                <span style={{
                  fontSize: 11, color: 'var(--fg-muted)',
                  fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontWeight: 600,
                }}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
