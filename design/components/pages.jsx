/* === Servicios, Reserva, Contacto pages === */

const ServiciosPage = ({ setPage }) => {
  const services = [
    {
      n: "01", t: "Traslados aeropuerto", price: "Desde 75 €",
      d: "Servicio completo desde y hacia los principales aeropuertos parisinos: Charles de Gaulle, Orly, Beauvais y Le Bourget.",
      f: ["Seguimiento de vuelo en tiempo real", "60 min de espera gratuitos", "Cartel personalizado a la llegada", "Asistencia con el equipaje"],
      img: "Mercedes Clase E · CDG Terminal 2E",
    },
    {
      n: "02", t: "París ↔ Disneyland", price: "Desde 110 €",
      d: "Traslado directo y cómodo entre cualquier dirección parisina y los parques Disneyland París.",
      f: ["Sillas infantiles bajo petición", "Vehículos hasta 7 pasajeros", "Espacio para equipaje y cochecitos", "Reserva ida y vuelta con tarifa preferente"],
      img: "Llegada Disneyland Hotel",
    },
    {
      n: "03", t: "City tour privado", price: "Desde 90 € / hora",
      d: "Descubra París desde la comodidad de un vehículo premium. Itinerarios a medida, paradas libres.",
      f: ["Itinerario personalizado", "Comentarios discretos del chófer", "Paradas fotos sin límite", "Recomendaciones de restaurantes"],
      img: "Torre Eiffel desde Trocadéro",
    },
    {
      n: "04", t: "Disposición con chófer", price: "Desde 80 € / hora",
      d: "Su chófer le acompaña durante el tiempo que necesite — reuniones, compras, visitas, eventos.",
      f: ["Mínimo 3 horas", "Tarifa decreciente por jornada completa", "Vehículo a su disposición", "Total flexibilidad de horario"],
      img: "Interior cabina trasera Clase S",
    },
    {
      n: "05", t: "Excursiones privadas", price: "Desde 450 € / día",
      d: "Versalles, valle del Loira, Champaña, Normandía, Mont-Saint-Michel, Bélgica, Suiza, Italia.",
      f: ["Itinerarios a medida en Francia y Europa", "Guía local opcional", "Reservas de restaurantes", "Vehículos adaptados a viajes largos"],
      img: "Castillo de Chenonceau",
    },
    {
      n: "06", t: "Eventos & bodas", price: "Cotización a medida",
      d: "Servicio premium para bodas, galas, premieres y eventos corporativos. Cortejos, recepciones, traslados de invitados.",
      f: ["Decoración del vehículo", "Cortejos coordinados", "Conductor en traje", "Servicio de protocolo"],
      img: "Cortejo Place de l'Opéra",
    },
  ];

  return (
    <main className="page-enter">
      <section className="section" style={{ paddingTop: "calc(var(--pad) * 64px)" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Servicios · 06 prestaciones</div>
          <h1 className="display" style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            margin: 0,
            marginBottom: 32,
            maxWidth: 900,
          }}>
            Cada trayecto, una <em style={{ fontStyle: "italic", color: "var(--accent)" }}>experiencia</em> medida.
          </h1>
          <p className="lead" style={{ maxWidth: 640 }}>
            Nuestra propuesta cubre todas las necesidades de movilidad privada en París, Île-de-France
            y más allá. Cada servicio combina vehículos premium, conductores formados y una atención al detalle obsesiva.
          </p>
        </div>
      </section>

      {services.map((s, i) => (
        <section key={s.n} style={{
          padding: "calc(var(--pad) * 64px) 0",
          borderTop: "1px solid var(--line-soft)",
          background: i % 2 === 1 ? "var(--bg-elev)" : "var(--bg)",
        }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: i % 2 === 0 ? "1fr 1.1fr" : "1.1fr 1fr",
              gap: 64,
              alignItems: "center",
            }} className="service-row">
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <div className="placeholder" data-label={s.img} style={{ ...window.bg(s.img), aspectRatio: "5/4" }}></div>
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
                  <span className="mono" style={{ color: "var(--accent)" }}>{s.n}</span>
                  <span className="eyebrow">{s.price}</span>
                </div>
                <h2 className="display" style={{
                  fontSize: "clamp(36px, 4.5vw, 56px)",
                  margin: 0,
                  marginBottom: 24,
                  fontWeight: 400,
                }}>{s.t}</h2>
                <p className="lead" style={{ marginBottom: 32 }}>{s.d}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 32 }}>
                  {s.f.map(item => (
                    <li key={item} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "12px 0",
                      borderTop: "1px solid var(--line-soft)",
                      fontSize: 14,
                    }}>
                      <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", flexShrink: 0 }}></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary" onClick={() => setPage("reserva")}>
                  Reservar este servicio
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTA setPage={setPage} />
    </main>
  );
};

/* ============ RESERVA ============ */

const ReservaPage = ({ setPage }) => {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    serviceType: "aeropuerto",
    nombre: "", apellido: "", email: "", telefono: "",
    fecha: "", hora: "",
    origen: "", destino: "",
    pasajeros: "2", equipaje: "2",
    vehiculo: "berlina",
    mensaje: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));

  const services = [
    { id: "aeropuerto", t: "Traslado aeropuerto", d: "CDG · Orly · Beauvais" },
    { id: "disneyland", t: "Disneyland París", d: "Ida, vuelta o ambos" },
    { id: "citytour", t: "City tour privado", d: "Por horas" },
    { id: "disposicion", t: "Disposición", d: "A su servicio" },
    { id: "excursion", t: "Excursión", d: "Francia · Europa" },
    { id: "evento", t: "Evento / boda", d: "A medida" },
  ];

  const vehiculos = [
    { id: "berlina", t: "Berlina", d: "Mercedes Clase E", pax: "1–3", price: "Desde 75 €" },
    { id: "executive", t: "Ejecutiva", d: "Mercedes Clase S", pax: "1–3", price: "Desde 110 €" },
    { id: "van", t: "Van premium", d: "Mercedes Clase V", pax: "1–7", price: "Desde 95 €" },
  ];

  if (submitted) {
    return (
      <main className="page-enter">
        <section className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: 700 }}>
            <div className="tag" style={{ justifyContent: "center", marginBottom: 32 }}>
              <span className="dot"></span>
              <span>Solicitud recibida</span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: 0, marginBottom: 24 }}>
              Gracias, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{data.nombre || "estimado cliente"}.</em>
            </h1>
            <p className="lead" style={{ marginBottom: 40, marginLeft: "auto", marginRight: "auto" }}>
              Hemos recibido su solicitud. Le enviaremos un presupuesto detallado y la confirmación
              en menos de 30 minutos al correo <strong style={{ color: "var(--fg)" }}>{data.email || "indicado"}</strong>.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep(1); setPage("home"); }}>
                Volver al inicio
              </button>
              <a href="https://wa.me/33600000000" target="_blank" className="btn btn-ghost">
                Continuar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-enter">
      <section className="section" style={{ paddingTop: "calc(var(--pad) * 56px)", paddingBottom: "calc(var(--pad) * 32px)" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Reserva · Solicitud de presupuesto</div>
          <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 84px)", margin: 0, marginBottom: 24, maxWidth: 900 }}>
            Reserve su <em style={{ fontStyle: "italic", color: "var(--accent)" }}>trayecto.</em>
          </h1>
          <p className="lead">Respuesta en menos de 30 minutos · Sin compromiso · Pago a bordo o por enlace seguro.</p>
        </div>
      </section>

      <section style={{ paddingBottom: "calc(var(--pad) * 96px)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 64 }} className="reserva-grid">
            <div>
              {/* Stepper */}
              <div style={{ display: "flex", gap: 0, marginBottom: 48, borderBottom: "1px solid var(--line-soft)" }}>
                {["Servicio", "Trayecto", "Contacto"].map((label, i) => {
                  const idx = i + 1;
                  const active = step === idx;
                  const done = step > idx;
                  return (
                    <button key={label}
                      onClick={() => done && setStep(idx)}
                      style={{
                        flex: 1,
                        padding: "20px 0",
                        background: "transparent",
                        border: 0,
                        borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                        color: active || done ? "var(--fg)" : "var(--fg-dim)",
                        cursor: done ? "pointer" : "default",
                        textAlign: "left",
                        fontFamily: "var(--sans)",
                      }}>
                      <div className="mono" style={{ color: active ? "var(--accent)" : done ? "var(--fg-muted)" : "var(--fg-dim)", marginBottom: 6 }}>
                        0{idx}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Step 1: service */}
              {step === 1 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    ¿Qué servicio necesita?
                  </h3>
                  <p style={{ color: "var(--fg-muted)", marginBottom: 32, fontSize: 14 }}>
                    Seleccione el tipo de trayecto. Podrá precisar los detalles a continuación.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
                    {services.map(s => (
                      <button key={s.id} onClick={() => upd("serviceType", s.id)}
                        style={{
                          textAlign: "left",
                          padding: "20px 24px",
                          background: data.serviceType === s.id ? "var(--accent-soft)" : "transparent",
                          border: `1px solid ${data.serviceType === s.id ? "var(--accent)" : "var(--line)"}`,
                          color: "var(--fg)",
                          cursor: "pointer",
                          fontFamily: "var(--sans)",
                          borderRadius: "var(--radius)",
                          transition: "all 0.18s ease",
                        }}>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{s.t}</div>
                        <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{s.d}</div>
                      </button>
                    ))}
                  </div>

                  <h3 style={{ fontFamily: "var(--display)", fontSize: 24, margin: 0, marginBottom: 16, marginTop: 40, fontWeight: 400 }}>
                    Categoría de vehículo
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
                    {vehiculos.map(v => (
                      <button key={v.id} onClick={() => upd("vehiculo", v.id)}
                        style={{
                          textAlign: "left",
                          padding: 20,
                          background: data.vehiculo === v.id ? "var(--accent-soft)" : "transparent",
                          border: `1px solid ${data.vehiculo === v.id ? "var(--accent)" : "var(--line)"}`,
                          color: "var(--fg)",
                          cursor: "pointer",
                          fontFamily: "var(--sans)",
                          borderRadius: "var(--radius)",
                        }}>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{v.t}</div>
                        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 12 }}>{v.d} · {v.pax} pax</div>
                        <div className="mono" style={{ color: "var(--accent)", fontSize: 11 }}>{v.price}</div>
                      </button>
                    ))}
                  </div>

                  <button className="btn btn-primary" onClick={() => setStep(2)}>Siguiente · Trayecto</button>
                </div>
              )}

              {/* Step 2: route */}
              {step === 2 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    Detalles del trayecto
                  </h3>
                  <p style={{ color: "var(--fg-muted)", marginBottom: 32, fontSize: 14 }}>
                    Indique los puntos del recorrido y el número de pasajeros.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Lugar de salida</label>
                      <input type="text" placeholder="Hotel Le Bristol, 112 Rue du Faubourg…"
                        value={data.origen} onChange={e => upd("origen", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Destino</label>
                      <input type="text" placeholder="Aeropuerto CDG, Terminal 2E…"
                        value={data.destino} onChange={e => upd("destino", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Fecha</label>
                      <input type="date" value={data.fecha} onChange={e => upd("fecha", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hora</label>
                      <input type="time" value={data.hora} onChange={e => upd("hora", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Pasajeros</label>
                      <select value={data.pasajeros} onChange={e => upd("pasajeros", e.target.value)}>
                        {["1","2","3","4","5","6","7","8+"].map(n => <option key={n} value={n}>{n} pasajero{n !== "1" ? "s" : ""}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Equipaje</label>
                      <select value={data.equipaje} onChange={e => upd("equipaje", e.target.value)}>
                        {["0","1","2","3","4","5+"].map(n => <option key={n} value={n}>{n} maleta{n !== "1" ? "s" : ""}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setStep(1)}>← Anterior</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)}>Siguiente · Contacto</button>
                  </div>
                </div>
              )}

              {/* Step 3: contact */}
              {step === 3 && (
                <div className="page-enter">
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                    Sus datos de contacto
                  </h3>
                  <p style={{ color: "var(--fg-muted)", marginBottom: 32, fontSize: 14 }}>
                    Le contestaremos en menos de 30 minutos con un presupuesto detallado.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div className="field">
                      <label>Nombre</label>
                      <input type="text" placeholder="Carmen" value={data.nombre} onChange={e => upd("nombre", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Apellido</label>
                      <input type="text" placeholder="González" value={data.apellido} onChange={e => upd("apellido", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" placeholder="carmen@correo.com" value={data.email} onChange={e => upd("email", e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Teléfono / WhatsApp</label>
                      <input type="tel" placeholder="+34 600 000 000" value={data.telefono} onChange={e => upd("telefono", e.target.value)} />
                    </div>
                    <div className="field" style={{ gridColumn: "1 / -1" }}>
                      <label>Mensaje complementario</label>
                      <textarea placeholder="Sillas infantiles, vuelo de llegada, paradas adicionales…"
                        value={data.mensaje} onChange={e => upd("mensaje", e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>← Anterior</button>
                    <button className="btn btn-primary" onClick={() => setSubmitted(true)}>
                      Enviar solicitud
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar summary */}
            <aside style={{
              border: "1px solid var(--line)",
              padding: 32,
              alignSelf: "start",
              position: "sticky",
              top: 100,
            }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
              <div className="placeholder" data-label={data.vehiculo === "van" ? "Mercedes Clase V" : data.vehiculo === "executive" ? "Mercedes Clase S" : "Mercedes Clase E"}
                style={{ ...window.bg(data.vehiculo === "van" ? "Mercedes Clase V" : data.vehiculo === "executive" ? "Mercedes Clase S" : "Mercedes Clase E"), aspectRatio: "16/10", marginBottom: 24 }}></div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Row k="Servicio" v={services.find(s => s.id === data.serviceType)?.t || "—"} />
                <Row k="Vehículo" v={vehiculos.find(v => v.id === data.vehiculo)?.t || "—"} />
                <Row k="Salida" v={data.origen || "—"} />
                <Row k="Destino" v={data.destino || "—"} />
                <Row k="Fecha" v={data.fecha ? `${data.fecha} ${data.hora || ""}` : "—"} />
                <Row k="Pasajeros" v={`${data.pasajeros} · ${data.equipaje} maletas`} />
              </div>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line-soft)" }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Estimación</div>
                <div className="display" style={{ fontSize: 36, fontWeight: 400 }}>
                  Desde {data.vehiculo === "executive" ? "110" : data.vehiculo === "van" ? "95" : "75"} €
                </div>
                <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>
                  Tarifa final confirmada por correo antes de la reserva.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

const Row = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
    <span style={{ color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 10 }}>{k}</span>
    <span style={{ color: "var(--fg)", textAlign: "right", maxWidth: "60%" }}>{v}</span>
  </div>
);

/* ============ CONTACTO ============ */

const ContactoPage = ({ setPage }) => {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ nombre: "", email: "", mensaje: "" });

  return (
    <main className="page-enter">
      <section className="section" style={{ paddingTop: "calc(var(--pad) * 56px)" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Contacto</div>
          <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 96px)", margin: 0, marginBottom: 24, maxWidth: 900 }}>
            Estamos a su <em style={{ fontStyle: "italic", color: "var(--accent)" }}>disposición.</em>
          </h1>
          <p className="lead">Llámenos, escríbanos por WhatsApp o utilice el formulario. Atendemos las 24 horas, todos los días del año.</p>
        </div>
      </section>

      <section style={{ paddingBottom: "calc(var(--pad) * 96px)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="contacto-grid">
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--line-soft)" }}>
                {[
                  { k: "Teléfono", v: "+33 6 00 00 00 00", sub: "Disponible 24/7", href: "tel:+33600000000" },
                  { k: "WhatsApp", v: "+33 6 00 00 00 00", sub: "Respuesta en minutos", href: "https://wa.me/33600000000" },
                  { k: "Email", v: "contacto@lp-transport.fr", sub: "Respuesta en menos de 1 h", href: "mailto:contacto@lp-transport.fr" },
                  { k: "Dirección", v: "París, Île-de-France", sub: "Servicio en toda Francia y Europa", href: null },
                ].map(c => (
                  <a key={c.k} href={c.href || undefined} target={c.href?.startsWith("http") ? "_blank" : undefined}
                     style={{
                       padding: "28px 32px",
                       borderTop: "1px solid var(--line-soft)",
                       display: "grid",
                       gridTemplateColumns: "120px 1fr",
                       gap: 24,
                       alignItems: "center",
                       cursor: c.href ? "pointer" : "default",
                       transition: "background 0.2s ease",
                     }}
                     onMouseEnter={e => c.href && (e.currentTarget.style.background = "var(--bg-elev)")}
                     onMouseLeave={e => c.href && (e.currentTarget.style.background = "transparent")}>
                    <div className="eyebrow">{c.k}</div>
                    <div>
                      <div style={{ fontFamily: "var(--display)", fontSize: 22 }}>{c.v}</div>
                      <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }}>{c.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Zona de servicio</div>
                <div className="placeholder" data-label="Mapa Île-de-France · cobertura" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&q=80&auto=format&fit=crop')", aspectRatio: "16/9" }}></div>
                <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 16, lineHeight: 1.6 }}>
                  París · Île-de-France · Disneyland · Versalles · Aeropuertos CDG, Orly, Beauvais, Le Bourget · Estaciones Gare du Nord, Lyon, Montparnasse · Toda Francia · Bélgica · Suiza · Italia · España.
                </p>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 32, margin: 0, marginBottom: 8, fontWeight: 400 }}>
                Envíenos un mensaje
              </h3>
              <p style={{ color: "var(--fg-muted)", marginBottom: 32, fontSize: 14 }}>
                Para reservas, utilice <a onClick={() => setPage("reserva")} style={{ color: "var(--accent)", cursor: "pointer", borderBottom: "1px solid var(--accent)" }}>el formulario de reserva</a>.
              </p>
              {sent ? (
                <div style={{ padding: 32, border: "1px solid var(--accent)", background: "var(--accent-soft)" }}>
                  <div className="eyebrow" style={{ marginBottom: 12, color: "var(--accent)" }}>✓ Mensaje enviado</div>
                  <p style={{ margin: 0, fontSize: 15 }}>Gracias {form.nombre}. Le contestaremos a la mayor brevedad.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  <div className="field">
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Carmen González"
                      value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" placeholder="carmen@correo.com"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>Mensaje</label>
                    <textarea rows="5" placeholder="¿Cómo podemos ayudarle?"
                      value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" style={{ alignSelf: "start" }} onClick={() => setSent(true)}>
                    Enviar mensaje
                  </button>
                </div>
              )}

              <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--line-soft)" }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Newsletter</div>
                <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
                  Recomendaciones para sus visitas en París, novedades, ofertas exclusivas.
                </p>
                <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line)" }}>
                  <input type="email" placeholder="Su correo electrónico" style={{
                    flex: 1, background: "transparent", border: 0, padding: "12px 0",
                    fontFamily: "var(--sans)", fontSize: 14, color: "var(--fg)", outline: "none",
                  }} />
                  <button style={{
                    background: "transparent", border: 0, color: "var(--accent)",
                    padding: "12px 16px", cursor: "pointer", fontSize: 13, letterSpacing: "0.1em",
                    textTransform: "uppercase", fontFamily: "var(--sans)",
                  }}>Suscribirse →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

Object.assign(window, { ServiciosPage, ReservaPage, ContactoPage });
