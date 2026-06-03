'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LANGUAGES } from '@/lib/translations'

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {LANGUAGES.map(l => {
        const active = lang === l.code
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            title={l.label}
            style={{
              background: active ? 'var(--accent-soft)' : 'transparent',
              border: active ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              padding: compact ? '4px 5px' : '4px 7px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              opacity: active ? 1 : 0.45,
              transition: 'all 0.15s ease',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/20x15/${l.flag}.png`}
              width={20}
              height={15}
              alt={l.label}
              style={{ display: 'block', borderRadius: 1 }}
            />
            {!compact && (
              <span style={{
                fontSize: 10, letterSpacing: '0.1em', fontWeight: 600,
                color: active ? 'var(--accent)' : 'var(--fg-muted)',
                fontFamily: 'var(--mono)',
              }}>
                {l.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
