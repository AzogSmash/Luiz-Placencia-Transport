/* === Home page === */

const Hero = ({ setPage }) => {
  return (
    <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line-soft)" }}>
      <div className="container" style={{ paddingTop: "calc(var(--pad) * 80px)", paddingBottom: "calc(var(--pad) * 80px)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 64,
          alignItems: "center",
        }} className="hero-grid">
          <div>
            <div className="tag" style={{ marginBottom: 32 }}>
              <span className="dot"></span>
              <span>Chófer privado VTC · Disponible 24/7</span>
            </div>
            <h1 className="display" style={{
              fontSize: "clamp(54px, 7.5vw, 104px)",
              margin: 0,
              marginBottom: 28,
              fontWeight: 400,
            }}>
              París, a su<br/>
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>ritmo.</em>
            </h1>
            <p className="lead" style={{ marginBottom: 40, maxWidth: 480 }}>
              Traslados al aeropuerto, recorridos privados y excursiones por Francia y Europa.
              Discreción, puntualidad y un servicio impecable a bordo de vehículos premium.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => setPage("reserva")}>
                Reservar un trayecto
              </button>
              <button className="btn btn-ghost" onClick={() => setPage("servicios")}>
                Ver servicios
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              marginTop: 80,
              paddingTop: 40,
              borderTop: "1px solid var(--line-soft)",
            }}>
              {[
                { k: "12 +", v: "Años de experiencia" },
                { k: "3 200", v: "Trayectos al año" },
                { k: "4.9 / 5", v: "Valoración clientes" },
              ].map(s => (
                <div key={s.v}>
                  <div className="display" style={{ fontSize: 36, marginBottom: 4 }}>{s.k}</div>
                  <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="placeholder" data-label="Mercedes Clase E · Place Vendôme" style={{ ...window.bg("Mercedes Clase E · Place Vendôme"), aspectRatio: "4/5", width: "100%" }}></div>
            <div style={{
              position: "absolute",
              bottom: -24,
              left: -24,
              background: "var(--bg)",
              border: "1px solid var(--line)",
              padding: "20px 24px",
              maxWidth: 240,
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Próximo trayecto</div>
              <div style={{ fontSize: 14, color: "var(--fg)", marginBottom: 4 }}>CDG → Le Bristol</div>
              <div className="mono" style={{ color: "var(--fg-muted)" }}>14:32 · 32 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = ({ setPage }) => {
  const services = [
    { n: "01", t: "Traslados aeropuerto", d: "CDG · Orly · Beauvais · Le Bourget. Seguimiento de vuelos y tiempo de espera incluido.", img: "Mercedes en zona de embarque CDG" },
    { n: "02", t: "Disneyland París", d: "Trayecto directo París ↔ Disneyland. Sillas infantiles disponibles bajo petición.", img: "Llegada Disneyland Hotel" },
    { n: "03", t: "City tour privado", d: "Descubra París a su ritmo. Itinerario personalizado, paradas libres, comentarios discretos.", img: "Torre Eiffel desde Trocadéro" },
    { n: "04", t: "Disposición con chófer", d: "A la hora o jornada completa. Reuniones, compras, eventos — su chófer le espera.", img: "Interior cabina trasera" },
    { n: "05", t: "Excursiones", d: "Versalles, valle del Loira, Champaña, Normandía, Bélgica, Suiza. Viajes a medida.", img: "Castillo de Versalles" },
    { n: "06", t: "Eventos & bodas", d: "Cortejos privados, recepciones, galas. Vehículo decorado bajo petición.", img: "Cortejo en Place de l'Opéra" },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow label">Servicios</div>
          </div>
          <div>
            <h2>Un servicio para<br/>cada trayecto.</h2>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "var(--line-soft)",
          border: "1px solid var(--line-soft)",
        }} className="services-grid">
          {services.map(s => (
            <article key={s.n} style={{
              background: "var(--bg)",
              padding: "calc(var(--pad) * 36px) calc(var(--pad) * 32px)",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elev)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
            onClick={() => setPage("servicios")}>
              <div className="placeholder" data-label={s.img} style={{ ...window.bg(s.img), aspectRatio: "16/10", marginBottom: 24 }}></div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                <span className="mono" style={{ color: "var(--accent)" }}>{s.n}</span>
                <h3 style={{
                  fontFamily: "var(--display)",
                  fontSize: 28,
                  margin: 0,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}>{s.t}</h3>
              </div>
              <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
                {s.d}
              </p>
              <span className="btn-link">Saber más</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Fleet = () => {
  const fleet = [
    { name: "Mercedes Clase E", cat: "Berlina", pax: "1–3", bag: "3", desc: "Comodidad y discreción para trayectos urbanos y traslados." },
    { name: "Mercedes Clase V", cat: "Van premium", pax: "1–7", bag: "7", desc: "Familias, equipos y grupos. Espacio generoso, asientos en cuero." },
    { name: "Mercedes Clase S", cat: "Berlina ejecutiva", pax: "1–3", bag: "2", desc: "Para clientes ejecutivos y trayectos largos. Lo más alto de gama." },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">Flota</div>
          <div>
            <h2>Vehículos<br/>seleccionados.</h2>
            <p className="lead" style={{ marginTop: 24 }}>
              Cada vehículo es revisado, lavado y preparado antes de cada trayecto. Wi-Fi a bordo,
              agua mineral, cargadores y un trato impecable.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="fleet-grid">
          {fleet.map(v => (
            <div key={v.name} style={{
              border: "1px solid var(--line-soft)",
              background: "var(--bg)",
            }}>
              <div className="placeholder" data-label={v.name} style={{ ...window.bg(v.name), aspectRatio: "4/3" }}></div>
              <div style={{ padding: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{v.cat}</div>
                <h3 style={{
                  fontFamily: "var(--display)",
                  fontSize: 26,
                  margin: 0,
                  marginBottom: 16,
                  fontWeight: 400,
                }}>{v.name}</h3>
                <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
                  {v.desc}
                </p>
                <div style={{
                  display: "flex",
                  gap: 24,
                  paddingTop: 20,
                  borderTop: "1px solid var(--line-soft)",
                  fontSize: 12,
                }}>
                  <div>
                    <div style={{ color: "var(--fg-dim)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, marginBottom: 4 }}>Pax</div>
                    <div className="mono">{v.pax}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--fg-dim)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, marginBottom: 4 }}>Equipaje</div>
                    <div className="mono">{v.bag}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { n: "01", t: "Solicite", d: "Por formulario, teléfono o WhatsApp. Respuesta en menos de 30 minutos." },
    { n: "02", t: "Confirmación", d: "Presupuesto detallado, sin sorpresas. Pago seguro o a bordo." },
    { n: "03", t: "Su chófer le espera", d: "Cartel personalizado, seguimiento de vuelo, asistencia con el equipaje." },
    { n: "04", t: "Disfrute", d: "Wi-Fi, agua, climatización a su gusto. Llegue a su destino en plena forma." },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">El método</div>
          <div>
            <h2>Sencillo, transparente,<br/>impecable.</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }} className="process-grid">
          {steps.map((s, i) => (
            <div key={s.n} style={{
              padding: "32px 28px 32px 0",
              borderTop: "1px solid var(--accent)",
              position: "relative",
              marginRight: i < 3 ? 24 : 0,
            }}>
              <div className="mono" style={{ color: "var(--accent)", marginBottom: 20 }}>{s.n}</div>
              <h3 style={{
                fontFamily: "var(--display)",
                fontSize: 24,
                margin: 0,
                marginBottom: 12,
                fontWeight: 400,
              }}>{s.t}</h3>
              <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonios = () => {
  const items = [
    { q: "Puntualidad absoluta y un trato exquisito. Llevamos tres años llamando solo a Luiz para todos nuestros traslados.", a: "Isabel M.", r: "Hôtel Costes · Conserjería" },
    { q: "Un city tour memorable. Conoce París como nadie y respeta los silencios. Volveremos.", a: "Carlos & Ana R.", r: "Madrid" },
    { q: "Servicio impecable de París a Reims. Vehículo perfecto, conducción muy suave.", a: "Marc D.", r: "Maison de champagne" },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow label">Testimonios</div>
          <div><h2>La palabra<br/>de los clientes.</h2></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="testimonios-grid">
          {items.map((it, i) => (
            <figure key={i} style={{ margin: 0, padding: 32, border: "1px solid var(--line-soft)", background: "var(--bg)" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20, color: "var(--accent)" }}>
                {Array.from({length: 5}).map((_, k) => (
                  <span key={k}>★</span>
                ))}
              </div>
              <blockquote style={{
                margin: 0,
                marginBottom: 28,
                fontFamily: "var(--display)",
                fontSize: 22,
                lineHeight: 1.35,
                fontWeight: 400,
                fontStyle: "italic",
              }}>
                « {it.q} »
              </blockquote>
              <figcaption>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{it.a}</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }}>{it.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ setPage }) => (
  <section className="section">
    <div className="container">
      <div style={{
        position: "relative",
        padding: "calc(var(--pad) * 80px) 64px",
        border: "1px solid var(--line)",
        textAlign: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 100%, var(--accent-soft), transparent 60%)",
          opacity: 0.6,
          pointerEvents: "none",
        }}></div>
        <div className="eyebrow" style={{ marginBottom: 24, position: "relative" }}>
          ¿Preparado para su próximo trayecto?
        </div>
        <h2 className="display" style={{
          fontSize: "clamp(40px, 5vw, 72px)",
          margin: 0,
          marginBottom: 32,
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}>
          Reserve en 60 segundos.<br/>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Confirmación inmediata.</em>
        </h2>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <button className="btn btn-primary" onClick={() => setPage("reserva")}>Solicitar presupuesto</button>
          <a href="https://wa.me/33600000000" target="_blank" className="btn btn-ghost">WhatsApp directo</a>
        </div>
      </div>
    </div>
  </section>
);

const HomePage = ({ setPage }) => (
  <main className="page-enter">
    <Hero setPage={setPage} />
    <Services setPage={setPage} />
    <Fleet />
    <Process />
    <Testimonios />
    <CTA setPage={setPage} />
  </main>
);

Object.assign(window, { HomePage });
