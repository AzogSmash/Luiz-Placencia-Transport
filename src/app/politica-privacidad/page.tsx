export const metadata = { title: 'Política de privacidad — Luis Plasencia Transport' }

export default function PoliticaPrivacidadPage() {
  return (
    <main className="page-enter" style={{ padding: '64px 0 96px' }}>
      <div className="container" style={{ maxWidth: 760 }}>

        <div className="eyebrow" style={{ marginBottom: 16 }}>Protección de datos</div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, margin: '0 0 8px' }}>
          Política de privacidad
        </h1>
        <p style={{ color: 'var(--fg-dim)', fontSize: 13, marginBottom: 48 }}>
          Última actualización: [À compléter — ex: mayo de 2026]
        </p>

        <Section title="Responsable del tratamiento">
          <p>
            <strong style={{ color: 'var(--fg)' }}>Luis Plasencia Transport</strong><br />
            [À compléter — dirección postal]<br />
            Email: Luisplasenciatransport@gmail.com<br />
            Teléfono: +33 6 43 27 21 73
          </p>
        </Section>

        <Section title="Datos recogidos">
          <p>Al utilizar nuestros servicios, podemos recopilar los siguientes datos personales:</p>
          <ul style={{ paddingLeft: 20, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}><strong style={{ color: 'var(--fg)' }}>Formulario de reserva:</strong> nombre, email, teléfono, dirección de recogida y destino, fecha y hora, número de pasajeros, mensaje.</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: 'var(--fg)' }}>Creación de cuenta:</strong> nombre, email, contraseña (cifrada).</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: 'var(--fg)' }}>Formulario de contacto:</strong> nombre, email, mensaje.</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: 'var(--fg)' }}>Newsletter:</strong> email.</li>
          </ul>
        </Section>

        <Section title="Finalidad del tratamiento">
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Gestión y seguimiento de sus reservas de transporte.</li>
            <li style={{ marginBottom: 8 }}>Comunicaciones relativas a su reserva (confirmación, cambio de estado).</li>
            <li style={{ marginBottom: 8 }}>Respuesta a sus solicitudes de contacto.</li>
            <li style={{ marginBottom: 8 }}>Envío de la newsletter (únicamente si se ha suscrito).</li>
          </ul>
        </Section>

        <Section title="Base legal">
          <p>
            El tratamiento de sus datos se basa en la ejecución del contrato de transporte (reservas),
            el consentimiento (newsletter) y el interés legítimo (gestión de contactos).
          </p>
        </Section>

        <Section title="Conservación de datos">
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Datos de reservas: 3 años a partir de la fecha del trayecto.</li>
            <li style={{ marginBottom: 8 }}>Cuenta de usuario: hasta la eliminación de la cuenta.</li>
            <li style={{ marginBottom: 8 }}>Newsletter: hasta la baja de la suscripción.</li>
          </ul>
        </Section>

        <Section title="Destinatarios">
          <p>
            Sus datos son tratados exclusivamente por Luis Plasencia Transport y no se ceden a terceros,
            salvo a los proveedores técnicos necesarios para el funcionamiento del servicio
            (alojamiento: Vercel; base de datos: Supabase; emails: [À compléter — Resend / Gmail…]).
            Todos estos proveedores ofrecen garantías de cumplimiento del RGPD.
          </p>
        </Section>

        <Section title="Sus derechos">
          <p style={{ marginBottom: 12 }}>
            De conformidad con el RGPD, usted dispone de los siguientes derechos sobre sus datos personales:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Derecho de acceso, rectificación y supresión.</li>
            <li style={{ marginBottom: 8 }}>Derecho a la limitación y a la oposición del tratamiento.</li>
            <li style={{ marginBottom: 8 }}>Derecho a la portabilidad de sus datos.</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Para ejercer estos derechos, envíe un email a:{' '}
            <strong style={{ color: 'var(--fg)' }}>Luisplasenciatransport@gmail.com</strong>
          </p>
          <p style={{ marginTop: 8 }}>
            Si considera que sus derechos no han sido respetados, puede presentar una reclamación
            ante la CNIL (Commission Nationale de l'Informatique et des Libertés) en{' '}
            <strong style={{ color: 'var(--fg)' }}>cnil.fr</strong>.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Este sitio utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento
            de la autenticación (sesión de usuario). No se utilizan cookies de rastreo ni publicitarias.
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
