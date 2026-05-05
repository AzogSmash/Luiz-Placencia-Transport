// ─── Shared layout ────────────────────────────────────────────────────────────

const ACCENT = '#b8956a'

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e8e4de;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:0 0 32px 0;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};">
              Luiz Placencia Transport
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 0;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0 0;border-top:1px solid #2a2a2a;">
            <p style="margin:0;font-size:11px;color:#555;line-height:1.6;">
              Luiz Placencia Transport · París, Île-de-France<br/>
              <a href="https://lp-transport.fr" style="color:${ACCENT};text-decoration:none;">lp-transport.fr</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function label(text: string) {
  return `<p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#666;">${text}</p>`
}

function value(text: string) {
  return `<p style="margin:0 0 20px 0;font-size:15px;color:#e8e4de;">${text}</p>`
}

function divider() {
  return `<div style="height:1px;background:#2a2a2a;margin:24px 0;"></div>`
}

function badge(text: string, color: string) {
  return `<span style="display:inline-block;padding:4px 12px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;border:1px solid ${color};color:${color};font-weight:600;">${text}</span>`
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_INFO: Record<string, { label: string; color: string; message: string }> = {
  'en attente': {
    label: 'En espera',
    color: '#b8956a',
    message: 'Su solicitud ha sido recibida y está pendiente de confirmación.',
  },
  'confirmée': {
    label: 'Confirmada',
    color: '#4a9968',
    message: '¡Su reserva ha sido confirmada! Le esperamos a la hora indicada.',
  },
  'en cours': {
    label: 'En curso',
    color: '#5a8fb8',
    message: 'Su trayecto está en curso.',
  },
  'terminée': {
    label: 'Finalizada',
    color: '#888',
    message: 'Su trayecto ha finalizado. Gracias por confiar en nosotros.',
  },
  'annulée': {
    label: 'Cancelada',
    color: '#b85a5a',
    message: 'Su reserva ha sido cancelada. Contáctenos si tiene alguna pregunta.',
  },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Templates ────────────────────────────────────────────────────────────────

export type ReservationData = {
  id: number
  nom: string
  email: string
  adresse_depart: string
  adresse_arrivee: string
  date_heure: string
  nombre_passagers: number
  message: string | null
}

/** Envoyé au client juste après sa réservation */
export function emailReservationConfirmation(r: ReservationData) {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:300;color:#e8e4de;line-height:1.2;">
      Reserva recibida
    </h1>
    <p style="margin:0 0 32px 0;font-size:14px;color:#888;">Referencia #${r.id}</p>

    <p style="margin:0 0 28px 0;font-size:15px;color:#ccc;line-height:1.7;">
      Gracias, <strong style="color:#e8e4de;">${r.nom}</strong>. Hemos recibido su solicitud
      y le enviaremos una confirmación en breve.
    </p>

    ${divider()}

    ${label('Trayecto')}
    <p style="margin:0 0 20px 0;font-size:16px;color:#e8e4de;">
      ${r.adresse_depart} <span style="color:${ACCENT};margin:0 8px;">→</span> ${r.adresse_arrivee}
    </p>

    ${label('Fecha y hora')}
    ${value(fmtDate(r.date_heure))}

    ${label('Pasajeros')}
    ${value(String(r.nombre_passagers))}

    ${r.message ? `${label('Notas')}${value(r.message)}` : ''}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#666;line-height:1.7;">
      ¿Alguna pregunta? Escríbanos por WhatsApp o responda a este correo.
    </p>
  `
  return {
    subject: `Reserva recibida — #${r.id} · Luiz Placencia Transport`,
    html: layout('Reserva recibida', body),
  }
}

/** Envoyé à l'admin quand une nouvelle réservation arrive */
export function emailNewReservationAdmin(r: ReservationData) {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:300;color:#e8e4de;">
      Nueva reserva #${r.id}
    </h1>
    <p style="margin:0 0 32px 0;font-size:13px;color:#888;">
      Recibida el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </p>

    ${label('Cliente')}
    ${value(`${r.nom} · <a href="mailto:${r.email}" style="color:${ACCENT};text-decoration:none;">${r.email}</a>`)}

    ${label('Trayecto')}
    <p style="margin:0 0 20px 0;font-size:15px;color:#e8e4de;">
      ${r.adresse_depart} <span style="color:${ACCENT};margin:0 6px;">→</span> ${r.adresse_arrivee}
    </p>

    ${label('Fecha y hora')}
    ${value(fmtDate(r.date_heure))}

    ${label('Pasajeros')}
    ${value(String(r.nombre_passagers))}

    ${r.message ? `${label('Mensaje del cliente')}${value(r.message)}` : ''}

    ${divider()}

    <a href="https://lp-transport.fr/admin" style="display:inline-block;padding:12px 24px;background:${ACCENT};color:#0d0d0d;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">
      Ver en el panel →
    </a>
  `
  return {
    subject: `Nueva reserva #${r.id} — ${r.nom}`,
    html: layout('Nueva reserva', body),
  }
}

/** Envoyé au client quand l'admin change le statut */
export function emailStatusUpdate(r: ReservationData & { statut: string }) {
  const info = STATUS_INFO[r.statut] ?? STATUS_INFO['en attente']
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:300;color:#e8e4de;line-height:1.2;">
      Estado actualizado
    </h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:#888;">Referencia #${r.id}</p>

    <div style="margin:0 0 28px 0;">
      ${badge(info.label, info.color)}
    </div>

    <p style="margin:0 0 28px 0;font-size:15px;color:#ccc;line-height:1.7;">
      ${info.message}
    </p>

    ${divider()}

    ${label('Trayecto')}
    <p style="margin:0 0 20px 0;font-size:15px;color:#e8e4de;">
      ${r.adresse_depart} <span style="color:${ACCENT};margin:0 8px;">→</span> ${r.adresse_arrivee}
    </p>

    ${label('Fecha y hora')}
    ${value(fmtDate(r.date_heure))}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#666;line-height:1.7;">
      ¿Alguna pregunta? No dude en contactarnos por WhatsApp o respondiendo a este correo.
    </p>
  `
  return {
    subject: `Su reserva #${r.id} — ${info.label} · Luiz Placencia Transport`,
    html: layout('Estado actualizado', body),
  }
}

/** Envoyé à l'admin quand quelqu'un remplit le formulaire de contact */
export function emailContactAdmin(nombre: string, email: string, mensaje: string) {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:300;color:#e8e4de;">
      Nuevo mensaje de contacto
    </h1>
    <p style="margin:0 0 32px 0;font-size:13px;color:#888;">
      ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </p>

    ${label('Nombre')}
    ${value(nombre)}

    ${label('Email')}
    ${value(`<a href="mailto:${email}" style="color:${ACCENT};text-decoration:none;">${email}</a>`)}

    ${label('Mensaje')}
    <p style="margin:0 0 20px 0;font-size:15px;color:#e8e4de;line-height:1.7;white-space:pre-wrap;">${mensaje}</p>

    ${divider()}

    <a href="mailto:${email}" style="display:inline-block;padding:12px 24px;background:${ACCENT};color:#0d0d0d;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">
      Responder →
    </a>
  `
  return {
    subject: `Nuevo mensaje — ${nombre}`,
    html: layout('Nuevo mensaje de contacto', body),
  }
}
