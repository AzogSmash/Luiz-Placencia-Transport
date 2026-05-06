'use client'

export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/33643272173"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 40,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'oklch(0.65 0.16 145)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.65 0.16 145 / 0.3)',
        transition: 'transform 0.18s ease',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1.1 2.8 1.2 3 .1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.3-2.9-1.3-4.5 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.3-8.3 8.3z"/>
      </svg>
    </a>
  )
}
