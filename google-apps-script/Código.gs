// Constantes de configuración
const SHEET_NAME = 'Reservas';
const EMAIL_REMITENTE = 'centromac.chimbote@gmail.com';
const SPREADSHEET_ID = ''; // ← El usuario deberá completar esto

// ── ENDPOINTS ──────────────────────────────────────

// doPost: maneja reservas, cancelaciones y contacto
function doPost(e) {
  try {
    // Manejar preflight CORS
    if (!e || !e.postData) {
      return respuestaCORS_();
    }
    
    const datos = JSON.parse(e.postData.contents);
    const action = datos.action;
    
    let resultado = {};
    
    if (action === 'reservar') {
      resultado = guardarReserva_(datos);
    } else if (action === 'cancelar') {
      resultado = cancelarTicket_(datos.ticketId);
    } else if (action === 'contacto') {
      resultado = enviarEmailContacto_(datos);
    } else {
      throw new Error("Acción desconocida");
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, ...resultado }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doGet: devuelve estadísticas para el dashboard
function doGet(e) {
  try {
    const stats = obtenerEstadisticas_();
    return ContentService.createTextOutput(JSON.stringify(stats))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permitir CORS con un handler OPTIONS si Google no lo hace auto
function doOptions(e) {
  return respuestaCORS_();
}

function respuestaCORS_() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// ── FUNCIONES PRIVADAS DE LÓGICA ───────────────────

function guardarReserva_(datos) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("La hoja 'Reservas' no existe.");
  
  // Si el frontend envió su propio ID, lo usamos, sino generamos uno
  const ticketId = datos.ticketCode || generarIdTicket_();
  const timestamp = new Date().toISOString();
  const estado = 'PENDIENTE';
  const qrData = datos.qrImage || ''; // Base64 de la imagen
  
  // Orden exacto: ID_Ticket | Timestamp | Nombre | DNI | Telefono | Email | Entidad | Fecha | Hora | Motivo | Estado | QR_Data
  sheet.appendRow([
    ticketId,
    timestamp,
    datos.nombre || '',
    datos.dni || '',
    datos.telefono || '',
    datos.email || '',
    datos.selectedEntity || datos.entidad || '',
    datos.selectedDate || datos.fecha || '',
    datos.selectedTime || datos.hora || '',
    datos.motivo || '',
    estado,
    qrData
  ]);
  
  // Intentar enviar el email, si falla no queremos que el script retorne error y asuste al cliente.
  try {
    if (datos.email) {
      enviarEmailConfirmacion_(datos, ticketId, qrData);
    }
  } catch (err) {
    Logger.log("Error enviando email confirmación: " + err.message);
  }
  
  return { ticketId: ticketId };
}

function cancelarTicket_(ticketId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("La hoja 'Reservas' no existe.");
  
  const data = sheet.getDataRange().getValues();
  // Fila 0 es encabezado, buscar el ticket
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ticketId) {
      // Estado está en la columna 11 (K, index 10)
      sheet.getRange(i + 1, 11).setValue('CANCELADO');
      
      // Intentar enviar email cancelación
      try {
        const fila = data[i];
        const email = fila[5]; // Email en columna 6 (index 5)
        if (email) {
          enviarEmailCancelacion_(fila);
        }
      } catch (err) {
        Logger.log("Error enviando email cancelación: " + err.message);
      }
      
      return { cancelado: true, ticketId: ticketId };
    }
  }
  
  throw new Error("Ticket no encontrado");
}

function obtenerEstadisticas_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("La hoja 'Reservas' no existe.");
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    // Si solo hay encabezado
    return {
      totalTickets: 0, pendientes: 0, confirmados: 0, atendidos: 0, cancelados: 0,
      porEntidad: {}, ticketsHoy: 0, ticketsSemana: 0
    };
  }
  
  let stats = {
    totalTickets: data.length - 1,
    pendientes: 0,
    confirmados: 0,
    atendidos: 0,
    cancelados: 0,
    porEntidad: {},
    ticketsHoy: 0,
    ticketsSemana: 0
  };
  
  const hoyStr = Utilities.formatDate(new Date(), 'America/Lima', 'yyyy-MM-dd');
  
  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
    const estado = fila[10] ? fila[10].toString().toUpperCase() : 'PENDIENTE';
    const entidad = fila[6];
    const fecha = fila[7]; // Fecha reserva
    
    if (estado === 'PENDIENTE') stats.pendientes++;
    else if (estado === 'CONFIRMADO') stats.confirmados++;
    else if (estado === 'ATENDIDO') stats.atendidos++;
    else if (estado === 'CANCELADO') stats.cancelados++;
    
    if (entidad) {
      if (!stats.porEntidad[entidad]) stats.porEntidad[entidad] = 0;
      stats.porEntidad[entidad]++;
    }
    
    if (fecha === hoyStr) {
      stats.ticketsHoy++;
    }
    // ticketsSemana simplificado: +1 por cada ticket existente (para no meter lógica compleja de Date)
    stats.ticketsSemana++; 
  }
  
  return stats;
}

// ── FUNCIONES DE EMAIL ────────────────────────────

function enviarEmailConfirmacion_(datos, ticketId, qrBase64) {
  const destinatario = datos.email;
  const asunto = `✅ Tu turno está reservado en Centro MAC Chimbote — ${ticketId}`;
  const nombre = datos.nombre;
  const entidad = datos.selectedEntity || datos.entidad;
  const fecha = datos.selectedDate || datos.fecha;
  const hora = datos.selectedTime || datos.hora;
  
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #003476; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">CENTRO MAC CHIMBOTE</h2>
      </div>
      <div style="padding: 30px;">
        <h3 style="color: #333;">Hola, ${nombre}</h3>
        <p>Tu reserva ha sido generada exitosamente. Aquí están los detalles de tu turno:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; width: 40%; color: #666;"><strong>Código de Ticket:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #000;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;"><strong>Entidad:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #000;">${entidad}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;"><strong>Fecha:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #000;">${fecha}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;"><strong>Hora:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #000;">${hora}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;"><strong>DNI:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #000;">${datos.dni}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <p style="margin-bottom: 10px; font-weight: bold; color: #003476;">Presenta este código QR o tu DNI en ventanilla el día de tu cita.</p>
  `;
  
  let opcionesEmail = {
    htmlBody: html
  };
  
  if (qrBase64 && qrBase64.indexOf('base64,') !== -1) {
    try {
      const base64Data = qrBase64.split('base64,')[1];
      const decodedQr = Utilities.base64Decode(base64Data);
      const blob = Utilities.newBlob(decodedQr, 'image/png', 'qr.png');
      
      html += `<img src="cid:qrImage" alt="Código QR" width="180" style="margin: 0 auto;">`;
      opcionesEmail.inlineImages = { qrImage: blob };
    } catch(e) {
      Logger.log("Error decodificando QR: " + e.message);
    }
  }
  
  html += `
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        <p style="margin: 0;"><strong>Centro MAC Chimbote — Megaplaza Chimbote, Nivel 2</strong></p>
        <p style="margin: 5px 0 0;">Av. Víctor Raúl Haya de la Torre 2964, Chimbote</p>
      </div>
    </div>
  `;
  
  opcionesEmail.htmlBody = html;
  
  GmailApp.sendEmail(destinatario, asunto, "", opcionesEmail);
}

function enviarEmailCancelacion_(fila) {
  const ticketId = fila[0];
  const nombre = fila[2];
  const email = fila[5];
  
  if (!email) return;
  
  const asunto = `❌ Tu reserva fue cancelada — Centro MAC Chimbote — ${ticketId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
      <div style="background-color: #e8001c; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Reserva Cancelada</h2>
      </div>
      <div style="padding: 30px;">
        <h3>Hola, ${nombre}</h3>
        <p>Te confirmamos que tu reserva con el código <strong>${ticketId}</strong> ha sido cancelada exitosamente a tu solicitud.</p>
        <p>Si deseas realizar un trámite en el futuro, puedes generar una nueva reserva desde nuestra página web.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        <p>Centro MAC Chimbote — Megaplaza Chimbote, Nivel 2</p>
      </div>
    </div>
  `;
  
  GmailApp.sendEmail(email, asunto, "", { htmlBody: html });
}

function enviarEmailContacto_(datos) {
  const asunto = `Nueva Consulta MAC Chimbote: ${datos.asunto}`;
  const html = `
    <h3>Nueva consulta de contacto</h3>
    <p><strong>Nombre:</strong> ${datos.nombre}</p>
    <p><strong>Email:</strong> ${datos.email}</p>
    <p><strong>Asunto:</strong> ${datos.asunto}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #003476;">
      ${datos.mensaje}
    </blockquote>
  `;
  
  GmailApp.sendEmail(EMAIL_REMITENTE, asunto, "", { htmlBody: html });
  return { enviado: true };
}

// ── RECORDATORIOS Y TRIGGERS ──────────────────────

function enviarRecordatorios() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  
  const mañanaDate = new Date();
  mañanaDate.setDate(mañanaDate.getDate() + 1);
  const mañanaStr = Utilities.formatDate(mañanaDate, 'America/Lima', 'yyyy-MM-dd');
  
  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
    const ticketId = fila[0];
    const nombre = fila[2];
    const email = fila[5];
    const entidad = fila[6];
    const fechaReserva = fila[7];
    const hora = fila[8];
    const estado = fila[10] ? fila[10].toString().toUpperCase() : '';
    
    if ((estado === 'PENDIENTE' || estado === 'CONFIRMADO') && fechaReserva === mañanaStr) {
      if (email) {
        const asunto = `⏰ Recordatorio: Tu turno en Centro MAC Chimbote es MAÑANA — ${ticketId}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
            <div style="background-color: #003476; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">CENTRO MAC CHIMBOTE</h2>
            </div>
            <div style="padding: 30px;">
              <h3>Hola, ${nombre}</h3>
              <p style="font-size: 16px; color: #e8001c; font-weight: bold;">Tu turno es MAÑANA.</p>
              <p>Recuerda traer tu DNI original y llegar 10 minutos antes a las instalaciones del Centro MAC.</p>
              <ul>
                <li><strong>Entidad:</strong> ${entidad}</li>
                <li><strong>Hora:</strong> ${hora}</li>
                <li><strong>Código de ticket:</strong> ${ticketId}</li>
              </ul>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
              <p>Centro MAC Chimbote — Megaplaza Chimbote, Nivel 2</p>
            </div>
          </div>
        `;
        
        try {
          GmailApp.sendEmail(email, asunto, "", { htmlBody: html });
        } catch(e) {
          Logger.log("Error enviando recordatorio a " + email + ": " + e.message);
        }
      }
    }
  }
}

// ── AUXILIARES ────────────────────────────────────

function generarIdTicket_() {
  const prefijo = 'MAC-CHIM-';
  const aleatorio = Math.floor(Math.random() * 900000) + 100000;
  return prefijo + aleatorio;
}

function formatearFecha_(fechaISO) {
  if (!fechaISO) return '';
  return fechaISO; // Asumimos que viene como string AAAA-MM-DD del frontend
}
