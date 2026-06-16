// ────────── CENTRAL DATA SERVICE (MOCK DATABASE) ──────────

function getUsuarios() {
    return JSON.parse(localStorage.getItem('mac_usuarios')) || [];
}

function setUsuarios(arr) {
    localStorage.setItem('mac_usuarios', JSON.stringify(arr));
}

function getReservas() {
    return JSON.parse(localStorage.getItem('mac_reservas')) || [];
}

function setReservas(arr) {
    localStorage.setItem('mac_reservas', JSON.stringify(arr));
}

function getMensajes() {
    return JSON.parse(localStorage.getItem('mac_mensajes')) || [];
}

function setMensajes(arr) {
    localStorage.setItem('mac_mensajes', JSON.stringify(arr));
}

function getSesion() {
    return JSON.parse(localStorage.getItem('mac_sesion'));
}

function setSesion(usuario) {
    localStorage.setItem('mac_sesion', JSON.stringify(usuario));
}

function cerrarSesion() {
    localStorage.removeItem('mac_sesion');
    localStorage.removeItem('mac_current_section');
    window.location.href = 'login.html';
}

function getNotificaciones() {
    return JSON.parse(localStorage.getItem('mac_notificaciones')) || [];
}

function setNotificaciones(arr) {
    localStorage.setItem('mac_notificaciones', JSON.stringify(arr));
}

function getEntidades() {
    let entities = localStorage.getItem('mac_entidades');
    if (entities) {
        try {
            const parsed = JSON.parse(entities);
            if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].hasOwnProperty('responsable')) {
                localStorage.removeItem('mac_entidades');
                entities = null;
            }
        } catch(e) {
            localStorage.removeItem('mac_entidades');
            entities = null;
        }
    }
    if (!entities) {
        const iniciales = [
            { nombre: 'RENIEC', responsable: 'Juan García', horario: '08:30 - 17:00', cupo: 40, tramitesHoy: 28, activo: true },
            { nombre: 'Migraciones', responsable: 'María Pérez', horario: '08:30 - 17:00', cupo: 35, tramitesHoy: 32, activo: true },
            { nombre: 'EsSalud', responsable: 'Carlos López', horario: '09:00 - 16:00', cupo: 50, tramitesHoy: 41, activo: true },
            { nombre: 'Banco de la Nación', responsable: 'Ana Sánchez', horario: '09:00 - 17:00', cupo: 30, tramitesHoy: 25, activo: true },
            { nombre: 'ONP', responsable: 'Luis Torres', horario: '08:30 - 17:00', cupo: 20, tramitesHoy: 12, activo: true },
            { nombre: 'SUNARP', responsable: 'Elena Díaz', horario: '09:00 - 16:30', cupo: 25, tramitesHoy: 18, activo: true }
        ];
        localStorage.setItem('mac_entidades', JSON.stringify(iniciales));
        entities = JSON.stringify(iniciales);
    }
    return JSON.parse(entities);
}

function setEntidades(arr) {
    localStorage.setItem('mac_entidades', JSON.stringify(arr));
}

function inicializarDatos() {
    if (!localStorage.getItem('mac_usuarios')) {
        setUsuarios([
            { uid: '001', nombre: 'Admin MAC', dni: '00000001', email: 'admin@mac.gob.pe', telefono: '981317379', role: 'admin', activo: true, creadoEn: '2025-01-01', password: 'admin2025' },
            { uid: '002', nombre: 'María López Torres', dni: '12345678', email: 'maria@gmail.com', telefono: '987654321', role: 'user', activo: true, creadoEn: '2025-03-10', password: 'mac2025' },
            { uid: '003', nombre: 'Carlos Ruiz Sánchez', dni: '87654321', email: 'carlos@gmail.com', telefono: '912345678', role: 'user', activo: true, creadoEn: '2025-04-05', password: 'mac2025' },
            { uid: '004', nombre: 'Ana Flores Pérez', dni: '11223344', email: 'ana@gmail.com', telefono: '945678901', role: 'user', activo: false, creadoEn: '2025-05-20', password: 'mac2025' }
        ]);
    }

    if (!localStorage.getItem('mac_reservas')) {
        setReservas([
            { id:'MAC-ANCASH-0001', uid:'002', nombre:'María López Torres', dni:'12345678', entidad:'RENIEC', fecha:'2025-06-20', hora:'09:00', motivo:'Renovación de DNI', estado:'pendiente', creadoEn:'2025-06-15' },
            { id:'MAC-ANCASH-0002', uid:'003', nombre:'Carlos Ruiz Sánchez', dni:'87654321', entidad:'Migraciones', fecha:'2025-06-18', hora:'10:30', motivo:'Pasaporte por primera vez', estado:'atendido', creadoEn:'2025-06-10' },
            { id:'MAC-ANCASH-0003', uid:'002', nombre:'María López Torres', dni:'12345678', entidad:'Banco de la Nación', fecha:'2025-06-22', hora:'11:00', motivo:'Apertura de cuenta', estado:'pendiente', creadoEn:'2025-06-14' },
            { id:'MAC-ANCASH-0004', uid:'004', nombre:'Ana Flores Pérez', dni:'11223344', entidad:'EsSalud', fecha:'2025-06-10', hora:'08:30', motivo:'Afiliación', estado:'cancelado', creadoEn:'2025-06-01' },
            { id:'MAC-ANCASH-0005', uid:'003', nombre:'Carlos Ruiz Sánchez', dni:'87654321', entidad:'RENIEC', fecha:'2025-06-25', hora:'14:00', motivo:'Partida de nacimiento', estado:'pendiente', creadoEn:'2025-06-16' }
        ]);
    }

    if (!localStorage.getItem('mac_mensajes')) {
        setMensajes([
            { id:'MSG-001', uid:'002', nombre:'María López Torres', asunto:'Confirmación de turno RENIEC', mensaje:'Su turno MAC-ANCASH-0001 ha sido confirmado para el 20 de junio a las 09:00. Preséntese con su DNI original.', fecha:'2025-06-15', leido:false },
            { id:'MSG-002', uid:'002', nombre:'María López Torres', asunto:'Recordatorio de cita', mensaje:'Le recordamos que mañana tiene una cita en Banco de la Nación a las 11:00. No olvide llevar los documentos requeridos.', fecha:'2025-06-21', leido:true },
            { id:'MSG-003', uid:'003', nombre:'Carlos Ruiz Sánchez', asunto:'Turno atendido exitosamente', mensaje:'Su trámite en Migraciones ha sido completado exitosamente. Gracias por usar el Centro MAC Chimbote.', fecha:'2025-06-18', leido:false }
        ]);
    }

    if (!localStorage.getItem('mac_calificaciones')) {
        setCalificaciones([
            { id: 'CAL-001', nombreCiudadano: 'María López Torres', entidad: 'RENIEC', estrellas: 5, comentario: 'Excelente atención, muy rápido y el personal muy amable.', fecha: '2025-06-15' },
            { id: 'CAL-002', nombreCiudadano: 'Carlos Ruiz Sánchez', entidad: 'Migraciones', estrellas: 4, comentario: 'Buena atención pero tuve que esperar un poco más de lo indicado.', fecha: '2025-06-16' },
            { id: 'CAL-003', nombreCiudadano: 'Ana Flores Pérez', entidad: 'EsSalud', estrellas: 5, comentario: 'Todo perfecto, me resolvieron todas mis dudas.', fecha: '2025-06-16' },
            { id: 'CAL-004', nombreCiudadano: 'Luis Torres', entidad: 'Banco de la Nación', estrellas: 3, comentario: 'El trámite fue lento, faltan más ventanillas.', fecha: '2025-06-17' },
            { id: 'CAL-005', nombreCiudadano: 'Elena Díaz', entidad: 'SUNARP', estrellas: 5, comentario: 'Muy eficientes, gran mejora en el servicio.', fecha: '2025-06-18' }
        ]);
    }

    getEntidades();
}

function setCalificaciones(arr) {
    localStorage.setItem('mac_calificaciones', JSON.stringify(arr));
}

function escaparHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
const inputTelefono = document.getElementById('registerTelefono');
const inputDni = document.getElementById('registerDNI');

inputTelefono.addEventListener('keypress', (evento) => {
    const codigoTecla = evento.which || evento.keyCode;
    if (codigoTecla < 48 || codigoTecla > 57) {
        evento.preventDefault();
    }
});
//para evitar pegar texto no numérico
inputTelefono.addEventListener('input', () => {
    inputTelefono.value = inputTelefono.value.replace(/\D/g, '');
});

inputDni.addEventListener('keypress', (evento) => {
    const codigoTecla = evento.which || evento.keyCode;
    if (codigoTecla < 48 || codigoTecla > 57) {
        evento.preventDefault();
    }
});
//para evitar pegar texto no numérico
inputDni.addEventListener('input', () => {
    inputDni.value = inputDni.value.replace(/\D/g, '');
});
