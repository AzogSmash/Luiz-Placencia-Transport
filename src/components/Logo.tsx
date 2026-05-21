export default function Logo({ small }: { small?: boolean }) {
  const size = small ? 22 : 28
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M9 9 L9 23 M9 23 L19 23" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M16 9 L23 16 L16 23" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
        <span style={{
          fontFamily: 'var(--display)',
          fontSize: small ? 17 : 20,
          letterSpacing: '0.01em',
          fontWeight: 500,
        }}>
          Luis Plasencia
        </span>
        <span style={{
          fontFamily: 'var(--sans)',
          fontSize: 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
          fontWeight: 500,
        }}>
          Transport · Paris
        </span>
      </div>
    </div>
  )
}
