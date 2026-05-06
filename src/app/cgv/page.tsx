export const metadata = { title: 'Condiciones generales de venta — Luiz Placencia Transport' }

export default function CgvPage() {
  return (
    <main className="page-enter" style={{ padding: '64px 0 96px' }}>
      <div className="container" style={{ maxWidth: 760 }}>

        <div className="eyebrow" style={{ marginBottom: 16 }}>Condiciones</div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, margin: '0 0 8px' }}>
          Condiciones generales de venta
        </h1>
        <p style={{ color: 'var(--fg-dim)', fontSize: 13, marginBottom: 48 }}>
          Última actualización: [À compléter — ex: mayo de 2026]
        </p>

        <Section title="Identificación del prestador">
          <p>
            <strong style={{ color: 'var(--fg)' }}>Luiz Placencia Transport</strong><br />
            [À compléter — dirección postal]<br />
            SIRET: 101 300 291 000 16<br />
            Email: Luisplasenciatransport@gmail.com — Teléfono: +33 6 43 27 21 73
          </p>
        </Section>

        <Section title="Servicios ofrecidos">
          <p>
            Luiz Placencia Transport presta servicios de transporte privado con conductor (VTC) en París,
            Île-de-France y destinos europeos, incluyendo:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>Traslados aeropuerto (CDG, Orly, Beauvais, Le Bourget).</li>
            <li style={{ marginBottom: 8 }}>Traslados a estaciones de tren (Gare du Nord, Lyon, Montparnasse…).</li>
            <li style={{ marginBottom: 8 }}>Excursiones (Disneyland, Versalles, Mont-Saint-Michel…).</li>
            <li style={{ marginBottom: 8 }}>City tour por París.</li>
            <li style={{ marginBottom: 8 }}>Servicio a disposición (por hora o día).</li>
            <li style={{ marginBottom: 8 }}>Traslados internacionales.</li>
          </ul>
        </Section>

        <Section title="Tarifas">
          <p>
            [À compléter — indiquez ici votre politique tarifaire : tarif fixe, sur devis, grille de prix…]
          </p>
          <p style={{ marginTop: 12 }}>
            Los precios se expresan en euros, impuestos incluidos. Luiz Placencia Transport se reserva el
            derecho a modificar sus tarifas en cualquier momento. El precio aplicable es el vigente en el
            momento de la confirmación de la reserva.
          </p>
        </Section>

        <Section title="Reserva y confirmación">
          <p>
            La reserva puede realizarse a través del formulario en línea, por teléfono o por WhatsApp.
            Una reserva sólo se considera firme tras la confirmación expresa por parte de Luiz Placencia Transport
            (email o mensaje de confirmación).
          </p>
          <p style={{ marginTop: 12 }}>
            [À compléter — précisez si un acompte est requis, et dans quel délai]
          </p>
        </Section>

        <Section title="Cancelación y modificación">
          <p>[À compléter — indiquez vos conditions d'annulation, ex:]</p>
          <ul style={{ paddingLeft: 20, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>Cancelación gratuita hasta [X] horas antes del trayecto.</li>
            <li style={{ marginBottom: 8 }}>Cancelación entre [X] y [Y] horas: [% de penalización].</li>
            <li style={{ marginBottom: 8 }}>No presentación o cancelación tardía: facturación del 100% del importe.</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Cualquier solicitud de modificación debe comunicarse con la mayor antelación posible
            por teléfono o WhatsApp.
          </p>
        </Section>

        <Section title="Responsabilidad">
          <p>
            Luiz Placencia Transport se compromete a realizar el trayecto en las condiciones acordadas.
            En caso de retraso imputable al prestador, se estudiarán soluciones alternativas.
          </p>
          <p style={{ marginTop: 12 }}>
            Luiz Placencia Transport no podrá ser considerado responsable de retrasos debidos a
            circunstancias ajenas a su control (tráfico, condiciones meteorológicas, huelgas, etc.).
          </p>
          <p style={{ marginTop: 12 }}>
            [À compléter — mentionnez votre assurance RC professionnelle et numéro de licence VTC]
          </p>
        </Section>

        <Section title="Protección de datos">
          <p>
            Los datos personales recogidos durante la reserva se tratan conforme a nuestra{' '}
            <a href="/politica-privacidad" style={{ color: 'var(--accent)' }}>Política de privacidad</a>.
          </p>
        </Section>

        <Section title="Ley aplicable y litigios">
          <p>
            Las presentes condiciones se rigen por la legislación francesa. En caso de litigio,
            las partes tratarán de llegar a un acuerdo amistoso. En su defecto, el asunto se someterá
            a los tribunales competentes de París.
          </p>
          <p style={{ marginTop: 12 }}>
            De conformidad con el artículo L.612-1 del Código de Consumo francés, el cliente puede
            recurrir gratuitamente a un mediador de consumo: [À compléter — médiateur agréé].
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
