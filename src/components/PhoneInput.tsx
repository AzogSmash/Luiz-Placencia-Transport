'use client'

import { CSSProperties } from 'react'

const COUNTRIES = [
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+34',  flag: '🇪🇸', name: 'España' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
  { code: '+41',  flag: '🇨🇭', name: 'Suisse' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+49',  flag: '🇩🇪', name: 'Deutschland' },
  { code: '+39',  flag: '🇮🇹', name: 'Italia' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+1',   flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+86',  flag: '🇨🇳', name: '中国' },
]

type Props = {
  prefix: string
  number: string
  onPrefixChange: (v: string) => void
  onNumberChange: (v: string) => void
  placeholder?: string
  style?: CSSProperties
}

export default function PhoneInput({ prefix, number, onPrefixChange, onNumberChange, placeholder = '6 12 34 56 78', style }: Props) {
  return (
    <div style={{ display: 'flex', gap: 0, width: '100%', ...style }}>
      <select
        value={prefix}
        onChange={e => onPrefixChange(e.target.value)}
        style={{
          background: 'var(--bg)',
          color: 'var(--fg)',
          border: '1px solid var(--line-soft)',
          borderRight: 0,
          padding: '10px 6px',
          fontFamily: 'var(--sans)',
          fontSize: 13,
          outline: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          width: 80,
        }}
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        placeholder={placeholder}
        value={number}
        onChange={e => onNumberChange(e.target.value)}
        style={{ flex: 1, minWidth: 0 }}
      />
    </div>
  )
}

/** Parse un numéro stocké (ex: "+33 6 12 34 56 78") en { prefix, number } */
export function parsePhone(stored: string): { prefix: string; number: string } {
  if (!stored) return { prefix: '+33', number: '' }
  const known = COUNTRIES.map(c => c.code).sort((a, b) => b.length - a.length)
  for (const code of known) {
    if (stored.startsWith(code)) {
      return { prefix: code, number: stored.slice(code.length).trim() }
    }
  }
  return { prefix: '+33', number: stored }
}
