# Despliegue de Google Apps Script para Centro MAC Chimbote

Sigue estos pasos para poner en marcha el backend usando Google Apps Script y Google Sheets, y conectarlo con la página web.

## Paso 1: Configurar el Google Sheets
1. Abre tu navegador e inicia sesión con la cuenta **centromac.chimbote@gmail.com**.
2. Ve a [Google Sheets](https://docs.google.com/spreadsheets).
3. Crea una nueva hoja de cálculo en blanco y nómbrala **"Reservas_CentroMAC"**.
4. Cambia el nombre de la hoja inferior (pestaña) de "Hoja 1" a **"Reservas"**.
5. En la primera fila (encabezados), copia y pega exactamente estas columnas (desde la columna A hasta la L):
   - `ID_Ticket`
   - `Timestamp`
   - `Nombre`
   - `DNI`
   - `Telefono`
   - `Email`
   - `Entidad`
   - `Fecha`
   - `Hora`
   - `Motivo`
   - `Estado`
   - `QR_Data`
6. **Importante:** Copia el **ID de la hoja de cálculo** que se encuentra en la URL.
   - Ejemplo URL: `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit`
   - El ID sería: `1A2B3C4D5E6F7G8H9I0J`

## Paso 2: Configurar Google Apps Script
1. Ve a [Google Apps Script](https://script.google.com/) asegurándote de usar la misma cuenta de Gmail.
2. Haz clic en **"Nuevo proyecto"**.
3. En la parte superior izquierda, haz clic en "Proyecto sin título" y cámbialo a **"CentroMAC-Reservas"**.
4. Borra el código que viene por defecto en el editor.
5. Abre el archivo `Código.gs` de este repositorio, copia todo su contenido y pégalo en el editor de Apps Script.
6. En la parte superior del código, busca la constante `SPREADSHEET_ID` y pega el ID de tu hoja de cálculo:
   ```javascript
   const SPREADSHEET_ID = 'PEGAR_TU_ID_AQUI'; 
   ```
7. Haz clic en el ícono del **Disquete (Guardar)**.

## Paso 3: Desplegar como Aplicación Web
1. En la esquina superior derecha, haz clic en el botón azul **Implementar** y selecciona **"Nueva implementación"**.
2. En el cuadro que aparece, haz clic en el ícono de **engranaje (Seleccionar tipo)** junto a "Seleccionar tipo" y elige **"Aplicación web"**.
3. Rellena los campos así:
   - **Descripción:** "v1 - Reservas MAC"
   - **Ejecutar como:** "Yo (centromac.chimbote@gmail.com)"
   - **Quién tiene acceso:** "Cualquier persona" (¡Muy importante!)
4. Haz clic en **Implementar**.
5. Te pedirá **Autorizar acceso**. Haz clic en el botón.
   - Selecciona tu cuenta de Google.
   - Te aparecerá un aviso de seguridad que dice "Google hasn't verified this app". Haz clic en **Advanced (Avanzado)** y luego en **Go to CentroMAC-Reservas (unsafe) / Ir a CentroMAC-Reservas (inseguro)**.
   - Haz clic en **Allow (Permitir)** para darle permisos a Gmail, Sheets y conexión externa.
6. Al finalizar, te mostrará una **URL de la aplicación web**. Copia esa URL larga que termina en `/exec`.

## Paso 4: Conectar con el Frontend
1. Abre el archivo `scripts.js` de tu proyecto web.
2. En la línea 2, busca la constante `APPS_SCRIPT_URL`:
   ```javascript
   const APPS_SCRIPT_URL = 'URL_REAL_DEL_SCRIPT_AQUI';
   ```
3. Reemplaza el texto `'URL_REAL_DEL_SCRIPT_AQUI'` con la URL que copiaste en el paso anterior.
   - Ejemplo: `const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';`
4. Guarda el archivo. ¡Listo! La web ya está conectada al backend.

## Paso 5: Activar Recordatorios Automáticos
Para que los correos de recordatorio se envíen solos 24 horas antes:
1. Vuelve a tu editor de **Google Apps Script**.
2. En el menú lateral izquierdo, haz clic en el ícono de **Reloj (Activadores / Triggers)**.
3. Haz clic en el botón azul en la esquina inferior derecha **"+ Agregar activador"**.
4. Configúralo de esta forma:
   - **Elige la función que se ejecutará:** `enviarRecordatorios`
   - **Elige qué implementación debería ejecutarse:** `Principal / Head`
   - **Selecciona la fuente del evento:** `Basado en el tiempo (Time-driven)`
   - **Selecciona el tipo de activador basado en el tiempo:** `Temporizador por día (Day timer)`
   - **Selecciona la hora:** `8:00 a. m. a 9:00 a. m.`
5. Haz clic en **Guardar**.

## Paso 6: Prueba Final
- Abre tu `index.html` en el navegador.
- Realiza una reserva completa llenando todos los campos (asegúrate de poner un correo electrónico válido).
- Revisa el archivo de Google Sheets. Debería aparecer la nueva fila instantáneamente.
- Revisa la bandeja de entrada del correo ingresado. Debería llegar el ticket de confirmación con el QR adjunto.
- Entra a la sección **"Dashboard"** en la web; deberías ver el badge `"📡 Datos en tiempo real"` indicando que cargó las estadísticas correctamente.
