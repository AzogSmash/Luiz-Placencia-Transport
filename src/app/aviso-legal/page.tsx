export const metadata = { title: 'Aviso legal — Luiz Placencia Transport' }

export default function AvisoLegalPage() {
  return (
    <main className="page-enter" style={{ padding: '64px 0 96px' }}>
      <div className="container" style={{ maxWidth: 760 }}>

        <div className="eyebrow" style={{ marginBottom: 16 }}>Información legal</div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, margin: '0 0 48px' }}>
          Aviso legal
        </h1>

        <Section title="Editor del sitio">
          <Row label="Razón social">Luiz Placencia Transport</Row>
          <Row label="Forma jurídica">[À compléter — ex: Auto-entrepreneur, SARL…]</Row>
          <Row label="SIRET">[À compléter — ex: 000 000 000 00000]</Row>
          <Row label="Domicilio">[À compléter — dirección completa]</Row>
          <Row label="Teléfono">[À compléter — +33 6 XX XX XX XX]</Row>
          <Row label="Email">contacto@lp-transport.fr</Row>
          <Row label="Responsable de publicación">Luiz Placencia</Row>
        </Section>

        <Section title="Alojamiento del sitio">
          <Row label="Proveedor">Vercel Inc.</Row>
          <Row label="Dirección">340 Pine Street, Suite 701, San Francisco, CA 94104, EE.UU.</Row>
          <Row label="Sitio web">vercel.com</Row>
        </Section>

        <Section title="Propiedad intelectual">
          <p>
            El contenido de este sitio web (textos, imágenes, logotipos, diseño) es propiedad exclusiva de
            Luiz Placencia Transport, salvo indicación contraria. Queda prohibida cualquier reproducción,
            distribución o uso sin autorización previa por escrito.
          </p>
        </Section>

        <Section title="Responsabilidad">
          <p>
            Luiz Placencia Transport no podrá ser considerado responsable de los daños de cualquier naturaleza
            que pudieran derivarse del uso del sitio o de la imposibilidad de acceder al mismo.
            Nos reservamos el derecho de modificar el contenido del sitio en cualquier momento y sin previo aviso.
          </p>
        </Section>

        <Section title="Ley aplicable">
          <p>
            El presente sitio web está sujeto a la legislación francesa, en particular a la Ley n.° 2004-575
            del 21 de junio de 2004 para la confianza en la economía digital (LCEN).
            Cualquier litigio relativo al uso del sitio estará sometido a la jurisdicción de los tribunales franceses.
          </p>
        </Section>

      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: 'var(--display)',
        fontSize: 22,
        fontWeight: 400,
        margin: '0 0 20px',
        paddingBottom: 12,
        borderBottom: '1px solid var(--line-soft)',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, paddingBottom: 8 }}>
      <span style={{ color: 'var(--fg-dim)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', paddingTop: 2 }}>
        {label}
      </span>
      <span>{children}</span>
    </div>
  )
}
