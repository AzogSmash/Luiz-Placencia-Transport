/* === Shared UI components === */

const Logo = ({ small }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <svg width={small ? 22 : 28} height={small ? 22 : 28} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M9 9 L9 23 M9 23 L19 23" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M16 9 L23 16 L16 23" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 3 }}>
      <span style={{
        fontFamily: "var(--display)",
        fontSize: small ? 17 : 20,
        letterSpacing: "0.01em",
        fontWeight: 500,
      }}>
        Luiz Placencia
      </span>
      <span style={{
        fontFamily: "var(--sans)",
        fontSize: 9,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: "var(--fg-muted)",
        fontWeight: 500,
      }}>
        Transport · Paris
      </span>
    </div>
  </div>
);

const NavBar = ({ page, setPage }) => {
  const items = [
    { id: "home", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "reserva", label: "Reserva" },
    { id: "contacto", label: "Contacto" },
  ];
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "oklch(0.16 0.005 240 / 0.82)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--line-soft)",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 76,
      }}>
        <a onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          <Logo />
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-links">
          {items.map(it => (
            <a key={it.id}
               onClick={() => setPage(it.id)}
               style={{
                 cursor: "pointer",
                 fontSize: 13,
                 letterSpacing: "0.12em",
                 textTransform: "uppercase",
                 color: page === it.id ? "var(--fg)" : "var(--fg-muted)",
                 fontWeight: 500,
                 paddingBottom: 4,
                 borderBottom: page === it.id ? "1px solid var(--accent)" : "1px solid transparent",
                 transition: "all 0.18s ease",
               }}>
              {it.label}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="tel:+33600000000" className="mono" style={{
            color: "var(--fg-muted)",
            fontSize: 12,
            letterSpacing: "0.06em",
          }} className="nav-phone">
            +33 6 00 00 00 00
          </a>
          <button className="btn btn-primary" onClick={() => setPage("reserva")}>
            Reservar
          </button>
        </div>
      </div>
    </header>
  );
};

const WhatsAppFAB = () => (
  <a href="https://wa.me/33600000000" target="_blank" rel="noopener"
     style={{
       position: "fixed",
       bottom: 28,
       right: 28,
       zIndex: 40,
       width: 56,
       height: 56,
       borderRadius: "50%",
       background: "oklch(0.65 0.16 145)",
       color: "white",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       boxShadow: "0 12px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.65 0.16 145 / 0.3)",
       transition: "transform 0.18s ease",
     }}
     onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
     onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
     title="WhatsApp">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1.1 2.8 1.2 3 .1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.3-2.9-1.3-4.5 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.3-8.3 8.3z"/>
    </svg>
  </a>
);

const Footer = ({ setPage }) => (
  <footer style={{
    borderTop: "1px solid var(--line-soft)",
    padding: "64px 0 32px",
    background: "var(--bg)",
  }}>
    <div className="container">
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 48,
        marginBottom: 48,
      }} className="footer-grid">
        <div>
          <Logo />
          <p style={{ color: "var(--fg-muted)", fontSize: 14, marginTop: 20, maxWidth: 320, lineHeight: 1.6 }}>
            Chófer privado en París. Traslados, city tours y excursiones por Francia y Europa.
          </p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Navegación</div>
          {["home","servicios","reserva","contacto"].map(p => (
            <div key={p} style={{ marginBottom: 8 }}>
              <a onClick={() => setPage(p)} style={{ cursor: "pointer", fontSize: 14, color: "var(--fg-muted)" }}>
                {p === "home" ? "Inicio" : p.charAt(0).toUpperCase() + p.slice(1)}
              </a>
            </div>
          ))}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Servicios</div>
          {["Aeropuertos","Disneyland","City tour París","Excursiones","Disposición"].map(s => (
            <div key={s} style={{ marginBottom: 8, fontSize: 14, color: "var(--fg-muted)" }}>{s}</div>
          ))}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Contacto</div>
          <div style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 8 }}>+33 6 00 00 00 00</div>
          <div style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 8 }}>contacto@lp-transport.fr</div>
          <div style={{ fontSize: 14, color: "var(--fg-muted)" }}>París · Île-de-France</div>
        </div>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: "1px solid var(--line-soft)",
        fontSize: 12,
        color: "var(--fg-dim)",
        letterSpacing: "0.04em",
      }}>
        <div>© 2026 Luiz Placencia Transport · SIRET 000 000 000 00000</div>
        <div style={{ display: "flex", gap: 24 }}>
          <span>Aviso legal</span>
          <span>Política de privacidad</span>
          <span>CGV</span>
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Logo, NavBar, WhatsAppFAB, Footer });
