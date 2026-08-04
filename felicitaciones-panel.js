/**
 * Panel de Felicitaciones - Centro MAC Chimbote
 * Conexión en tiempo real a Firebase Firestore (Proyecto mac-felicitaciones)
 */

(function () {
  const felicitacionesFirebaseConfig = {
    apiKey: "AIzaSyDznT5QrjMtYnx0BJK2nkyW0F5eTRBYmd8",
    authDomain: "mac-felicitaciones.firebaseapp.com",
    projectId: "mac-felicitaciones",
    storageBucket: "mac-felicitaciones.firebasestorage.app",
    messagingSenderId: "862378958457",
    appId: "1:862378958457:web:c0c49b27636a7af15efea8"
  };

  let felicitacionesApp = null;
  let dbFelicitaciones = null;
  
  let allFelicitacionesDocs = []; // Referencia global para filtros
  
  // Instancias de gráficos Chart.js
  let donutChartInstance = null;
  let horizontalChartInstance = null;
  let barModuloChartInstance = null;
  let lineChartInstance = null;

  function getChartSDK() {
    return window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  }

  function getDb() {
    if (!dbFelicitaciones) {
      if (typeof firebase !== 'undefined') {
        try {
          const existingApps = firebase.apps || [];
          const existingApp = existingApps.find(app => app.name === "felicitacionesApp");
          if (existingApp) {
            felicitacionesApp = existingApp;
          } else {
            felicitacionesApp = firebase.initializeApp(felicitacionesFirebaseConfig, "felicitacionesApp");
          }
          dbFelicitaciones = felicitacionesApp.firestore();
        } catch (err) {
          console.warn("Warning al inicializar app Firebase felicitacionesApp:", err);
        }
      } else {
        console.warn("SDK de Firebase no detectado en ventana global.");
      }
    }
    return dbFelicitaciones;
  }

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#f8fafc' : '#1e293b',
      muted: isDark ? '#94a3b8' : '#64748b',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      legendBg: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
      legendColor: isDark ? '#ffffff' : '#1e293b',
      isDark: isDark
    };
  }

  function parseTimestamp(ts) {
    if (!ts) return new Date();
    if (typeof ts.toDate === 'function') return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000);
    if (ts instanceof Date) return ts;
    const parsed = new Date(ts);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  function formatDateTime(date) {
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDayMonthKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDayMonthLabel(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  }

  async function fetchFelicitaciones() {
    const db = getDb();
    if (!db) {
      return [];
    }

    let snapshot;
    try {
      snapshot = await db.collection('felicitaciones').orderBy('timestamp', 'desc').get();
    } catch (orderErr) {
      try {
        snapshot = await db.collection('felicitaciones').get();
      } catch (e) {
        console.warn("No se pudo consultar la colección felicitaciones:", e);
        return [];
      }
    }

    const docs = [];
    if (snapshot && typeof snapshot.forEach === 'function') {
      snapshot.forEach(doc => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          tipoDocumento: data.tipoDocumento || 'DNI',
          numeroDocumento: data.numeroDocumento || '',
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          correo: data.correo || '',
          entidad: data.entidad || 'No especificada',
          modulo: data.modulo || 'Módulo Sin Asignar',
          asesor: data.asesor || 'No identificado',
          descripcion: data.descripcion || '',
          timestamp: parseTimestamp(data.timestamp),
          puntuacion: typeof data.puntuacion === 'number' ? data.puntuacion : 5,
          tipoRegistro: data.tipoRegistro || 'felicitacion'
        });
      });
    }

    docs.sort((a, b) => b.timestamp - a.timestamp);
    return docs;
  }

  function updateKPIs(docs) {
    const totalCount = docs.length;
    const now = new Date();

    const todayStr = formatDayMonthKey(now);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    let hoyCount = 0;
    let semanaCount = 0;
    let mesCount = 0;

    docs.forEach(d => {
      const dKey = formatDayMonthKey(d.timestamp);
      if (dKey === todayStr) {
        hoyCount++;
      }
      if (d.timestamp >= sevenDaysAgo && d.timestamp <= now) {
        semanaCount++;
      }
      if (d.timestamp.getMonth() === now.getMonth() && d.timestamp.getFullYear() === now.getFullYear()) {
        mesCount++;
      }
    });

    const elTotal = document.getElementById('kpiFelicitacionesTotal');
    const elHoy = document.getElementById('kpiFelicitacionesHoy');
    const elSemana = document.getElementById('kpiFelicitacionesSemana');
    const elMes = document.getElementById('kpiFelicitacionesMes');

    if (elTotal) elTotal.textContent = totalCount.toLocaleString();
    if (elHoy) elHoy.textContent = hoyCount.toLocaleString();
    if (elSemana) elSemana.textContent = semanaCount.toLocaleString();
    if (elMes) elMes.textContent = mesCount.toLocaleString();
  }

  function renderRecentMessages(docs) {
    const container = document.getElementById('felicitacionesMessagesList');
    if (!container) return;

    const recentDocs = docs.slice(0, 20);

    if (recentDocs.length === 0) {
      container.innerHTML = `
        <div class="message-card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1.5rem; background: var(--surface, #ffffff); border: 1px dashed var(--border, #cbd5e1); border-radius: 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📥</div>
          <strong style="display: block; font-size: 1.1rem; color: var(--text, #1e293b); margin-bottom: 0.5rem;">Esperando felicitaciones desde el código QR</strong>
          <p style="margin: 0; color: var(--text-muted, #64748b); font-size: 0.9rem;">Aún no se han registrado mensajes en la base de datos Firestore (colección 'felicitaciones'). Cuando los ciudadanos envíen su felicitación desde la web o escaneando el QR, aparecerán aquí automáticamente.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recentDocs.map(d => {
      const nombreCompleto = `${d.nombres || ''} ${d.apellidos || ''}`.trim() || 'Ciudadano Anónimo';
      const docInfo = d.numeroDocumento ? `(${d.tipoDocumento || 'DNI'}: ${d.numeroDocumento})` : '';

      return `
        <div class="message-card" style="background: var(--surface, #ffffff); border: 1px solid var(--border, #e2e8f0); border-radius: 12px; padding: 1.25rem;">
          <div class="message-card__header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div class="message-card__user" style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="user-avatar" aria-hidden="true" style="font-size: 1.5rem;">👏</div>
              <div>
                <strong class="user-name" style="display: block; font-size: 0.95rem; color: var(--text, #1e293b);">${escapeHtml(nombreCompleto)}</strong>
                <small class="user-doc" style="color: var(--text-muted, #64748b); font-size: 0.8rem;">${escapeHtml(docInfo)}</small>
              </div>
            </div>
            <div class="message-card__date" style="font-size: 0.78rem; color: var(--text-muted, #64748b);">${formatDateTime(d.timestamp)}</div>
          </div>
          <div class="message-card__tags" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
            <span class="tag tag--entidad" style="background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">🏛️ ${escapeHtml(d.entidad || 'Entidad')}</span>
            <span class="tag tag--modulo" style="background: #fef3c7; color: #b45309; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">📍 ${escapeHtml(d.modulo || 'Módulo')}</span>
            <span class="tag tag--asesor" style="background: #dcfce7; color: #15803d; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">👤 ${escapeHtml(d.asesor || 'Asesor')}</span>
          </div>
          <div class="message-card__body">
            <p style="margin: 0; color: var(--text, #1e293b); font-size: 0.9rem; font-style: italic;">"${escapeHtml(d.descripcion || 'Sin mensaje')}"</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // 1. Gráfico de dona — "Distribución por Entidad"
  function renderDonutChartEntidad(docs) {
    const canvas = document.getElementById('chartDonutFelicitacionesEntidad');
    const legendContainer = document.getElementById('legendDonutFelicitacionesEntidad');
    if (!canvas) return;

    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;

    const theme = getThemeColors();
    const entityCounts = {};
    let totalFelicitaciones = 0;

    docs.forEach(d => {
      const ent = (d.entidad || 'No especificada').trim();
      entityCounts[ent] = (entityCounts[ent] || 0) + 1;
      totalFelicitaciones++;
    });

    let sorted = Object.entries(entityCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      sorted = [
        ['RENIEC', 0],
        ['Migraciones', 0],
        ['SUNAT', 0],
        ['Banco de la Nación', 0]
      ];
    }

    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);

    if (donutChartInstance) {
      try { donutChartInstance.destroy(); } catch (e) {}
      donutChartInstance = null;
    }

    const palette = [
      '#0080ff', '#1a96ff', '#33a6ff', '#4db6ff', '#66c2ff',
      '#e8a000', '#f5b820', '#22a05b', '#36a372', '#b80015'
    ];

    const backgroundColors = labels.map((_, idx) => palette[idx % palette.length]);

    const ctx = canvas.getContext('2d');
    donutChartInstance = new ChartSDK(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: totalFelicitaciones === 0 ? labels.map(() => 1) : data,
          backgroundColor: totalFelicitaciones === 0 ? labels.map(() => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)') : backgroundColors,
          borderWidth: 2,
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (totalFelicitaciones === 0) return ` ${ctx.label}: 0 felicitaciones`;
                const val = data[ctx.dataIndex];
                const pct = totalFelicitaciones ? ((val / totalFelicitaciones) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    if (legendContainer) {
      if (totalFelicitaciones === 0) {
        legendContainer.innerHTML = `
          <span style="font-size: 0.82rem; color: ${theme.muted}; font-style: italic;">
            Sin datos registrados en la BD todavía
          </span>
        `;
      } else {
        legendContainer.innerHTML = sorted.map(([ent, count], idx) => {
          const color = backgroundColors[idx];
          const pct = totalFelicitaciones ? ((count / totalFelicitaciones) * 100).toFixed(1) : 0;
          return `
            <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: ${theme.legendBg}; border: 1px solid var(--border, #e2e8f0); padding: 0.35rem 0.65rem; border-radius: 999px; font-size: 0.78rem; font-weight: 500; color: ${theme.legendColor};">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; display: inline-block;"></span>
              <strong>${escapeHtml(ent)}</strong>: ${count} (${pct}%)
            </span>
          `;
        }).join('');
      }
    }
  }

  // 2. Gráfico de barras horizontales — "Personal Más Felicitado"
  function renderHorizontalBarChartAsesor(docs) {
    const canvas = document.getElementById('chartHorizontalFelicitacionesAsesor');
    if (!canvas) return;

    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;

    const theme = getThemeColors();
    const asesorCounts = {};
    docs.forEach(d => {
      const ase = (d.asesor || 'No identificado').trim();
      const mod = (d.modulo || '').trim();
      const label = mod ? `${ase} (${mod})` : ase;
      asesorCounts[label] = (asesorCounts[label] || 0) + 1;
    });

    let sorted = Object.entries(asesorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (sorted.length === 0) {
      sorted = [
        ['Esperando registros...', 0]
      ];
    }

    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);

    if (horizontalChartInstance) {
      try { horizontalChartInstance.destroy(); } catch (e) {}
      horizontalChartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    horizontalChartInstance = new ChartSDK(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Felicitaciones',
          data: data,
          backgroundColor: '#0080ff',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Felicitaciones: ${ctx.raw}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: theme.grid },
            ticks: {
              stepSize: 1,
              color: theme.text,
              font: { family: 'DM Sans', size: 12 }
            }
          },
          y: {
            grid: { color: theme.grid },
            ticks: {
              color: theme.text,
              font: { family: 'DM Sans', size: 11 }
            }
          }
        }
      }
    });
  }

  // 3. Gráfico de barras — "Felicitaciones por Módulo"
  function renderBarChartModulo(docs) {
    const canvas = document.getElementById('chartBarFelicitacionesModulo');
    if (!canvas) return;

    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;

    const theme = getThemeColors();
    const moduloCounts = {};
    docs.forEach(d => {
      const mod = (d.modulo || 'Sin Módulo').trim();
      moduloCounts[mod] = (moduloCounts[mod] || 0) + 1;
    });

    let sorted = Object.entries(moduloCounts).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      sorted = [
        ['Módulo A', 0],
        ['Módulo B', 0],
        ['Módulo C', 0],
        ['Módulo D', 0]
      ];
    }

    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);

    if (barModuloChartInstance) {
      try { barModuloChartInstance.destroy(); } catch (e) {}
      barModuloChartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    barModuloChartInstance = new ChartSDK(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Felicitaciones',
          data: data,
          backgroundColor: '#1a5dc8',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Felicitaciones: ${ctx.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: theme.text,
              font: { family: 'DM Sans', size: 12 },
              autoSkip: false
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: theme.grid },
            ticks: {
              stepSize: 1,
              color: theme.text,
              font: { family: 'DM Sans', size: 12 }
            }
          }
        }
      }
    });
  }

  // 4. Gráfico de línea — "Tendencia de Felicitaciones (últimos 30 días)"
  function renderLineChartTendencia(docs) {
    const canvas = document.getElementById('chartLineFelicitacionesTendencia');
    if (!canvas) return;

    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;

    const theme = getThemeColors();
    const daysMap = {};
    const labels = [];
    const dateKeys = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = formatDayMonthKey(d);
      const label = formatDayMonthLabel(d);
      dateKeys.push(key);
      labels.push(label);
      daysMap[key] = 0;
    }

    docs.forEach(d => {
      const key = formatDayMonthKey(d.timestamp);
      if (daysMap.hasOwnProperty(key)) {
        daysMap[key]++;
      }
    });

    const dataValues = dateKeys.map(key => daysMap[key]);

    if (lineChartInstance) {
      try { lineChartInstance.destroy(); } catch (e) {}
      lineChartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    lineChartInstance = new ChartSDK(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Felicitaciones diarias',
          data: dataValues,
          borderColor: '#0080ff',
          backgroundColor: theme.isDark ? 'rgba(0, 128, 255, 0.2)' : 'rgba(0, 128, 255, 0.12)',
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#003366',
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Felicitaciones: ${ctx.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: theme.text,
              font: { family: 'DM Sans', size: 11 },
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: theme.grid },
            ticks: {
              stepSize: 1,
              color: theme.text,
              font: { family: 'DM Sans', size: 12 }
            }
          }
        }
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showState(state) {
    const loadingEl = document.getElementById('felicitacionesLoading');
    const contentEl = document.getElementById('felicitacionesContent');
    const errorEl = document.getElementById('felicitacionesError');
    const emptyEl = document.getElementById('felicitacionesEmpty');

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = (state === 'empty') ? 'flex' : 'none';
  }

  function renderAllChartsAndKPIs(docs) {
    showState('content');
    updateKPIs(docs);
    renderRecentMessages(docs);
    renderDonutChartEntidad(docs);
    renderHorizontalBarChartAsesor(docs);
    renderBarChartModulo(docs);
    renderLineChartTendencia(docs);
  }

  // --- NUEVA LÓGICA DEL DASHBOARD DE TRABAJADORES ---
  const trabajadoresPredefinidos = [
    "Juan Pérez", "María Torres", "Carlos Gómez", "Rosa Benítez", "Ricardo Morales", "Patricia Silva",
    "Jorge Espinoza", "Carmen Vega", "Elena Castillo", "Roberto Mendoza", "Sofía Guerrero",
    "Fernando Ríos", "Gabriel Fernández", "Lucía Paredes", "Mariana Alva", "Alberto Quispe",
    "Teresa Bustamante", "Alejandro Mendoza", "Daniel Herrera", "Ana Ramírez", "Luis Vargas",
    "Valeria Gutiérrez", "Gustavo Medina", "Diana Solís", "Héctor Palacios", "Camila Navarro",
    "Oscar Reyes", "Julio Cárdenas", "Pilar Benavides", "Rodrigo Flores", "Vanessa Salazar",
    "Eduardo Huamán", "Beatriz Zavaleta", "Mateo Córdova", "Natalia Espinoza", "Javier Villegas",
    "Gonzalo Alarcón", "Milagros Paredes"
  ];

  let chartTrabVolumenInstance = null;
  let chartTrabPuntuacionInstance = null;
  let chartTrabTendenciaInstance = null;

  function initTrabajadoresDashboard(docs) {
    allFelicitacionesDocs = docs;
    
    const selectTrabajador = document.getElementById('filtroTrabajador');
    if (selectTrabajador) {
      const trabajadoresDB = new Set(docs.map(d => (d.asesor || 'No identificado').trim()));
      const todosLosTrabajadores = new Set([...trabajadoresPredefinidos]);
      trabajadoresDB.forEach(t => todosLosTrabajadores.add(t));
      
      const trabajadoresOrdenados = Array.from(todosLosTrabajadores).sort();
      
      selectTrabajador.innerHTML = '<option value="">Todos los Trabajadores</option>';
      trabajadoresOrdenados.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        selectTrabajador.appendChild(option);
      });
    }

    const filtros = ['filtroTrabajador', 'filtroFechaTrabajador'];
    filtros.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) {
        el.dataset.bound = 'true';
        el.addEventListener('change', () => renderTrabajadoresDashboard());
      }
    });

    const btnLimpiar = document.getElementById('btnLimpiarFiltrosTrab');
    if (btnLimpiar && !btnLimpiar.dataset.bound) {
      btnLimpiar.dataset.bound = 'true';
      btnLimpiar.addEventListener('click', () => {
        filtros.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = id === 'filtroFechaTrabajador' ? 'todo' : '';
        });
        renderTrabajadoresDashboard();
      });
    }

    renderTrabajadoresDashboard();
  }

  function renderTrabajadoresDashboard() {
    const trabajador = document.getElementById('filtroTrabajador')?.value || '';
    const periodo = document.getElementById('filtroFechaTrabajador')?.value || 'todo';

    let filtrados = [...allFelicitacionesDocs];
    
    if (trabajador) filtrados = filtrados.filter(d => (d.asesor || 'No identificado').trim() === trabajador);
    
    if (periodo !== 'todo') {
      const now = new Date();
      const hoyStr = formatDayMonthKey(now);
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      
      filtrados = filtrados.filter(d => {
        const dKey = formatDayMonthKey(d.timestamp);
        if (periodo === 'hoy') return dKey === hoyStr;
        if (periodo === 'semana') return d.timestamp >= sevenDaysAgo && d.timestamp <= now;
        if (periodo === 'mes') return d.timestamp.getMonth() === now.getMonth() && d.timestamp.getFullYear() === now.getFullYear();
        return true;
      });
    }

    const statsPorTrabajador = {};
    
    filtrados.forEach(d => {
      const ase = (d.asesor || 'No identificado').trim();
      if (!statsPorTrabajador[ase]) statsPorTrabajador[ase] = { count: 0 };
      statsPorTrabajador[ase].count++;
    });

    const arrStats = Object.entries(statsPorTrabajador).map(([nombre, data]) => ({
      nombre, count: data.count
    }));

    const totalRegistros = filtrados.length;
    
    let masConsultas = { nombre: '-', count: 0 };

    arrStats.forEach(s => {
      if (s.count > masConsultas.count) masConsultas = s;
    });

    const elTotal = document.getElementById('kpiTrabTotal');
    if (elTotal) elTotal.textContent = totalRegistros;
    
    const elMasConsultas = document.getElementById('kpiTrabMasConsultas');
    if (elMasConsultas) {
      elMasConsultas.textContent = masConsultas.nombre === '-' ? '-' : `${masConsultas.nombre} (${masConsultas.count})`;
      elMasConsultas.title = masConsultas.nombre === '-' ? '' : `${masConsultas.nombre} (${masConsultas.count})`;
    }
    
    const elContador = document.getElementById('contadorTablaTrab');
    if (elContador) elContador.textContent = `${totalRegistros} registro${totalRegistros !== 1 ? 's' : ''}`;

    renderChartTrabVolumen(arrStats);
    renderChartTrabTendencia(filtrados);
    renderTablaTrabajadores(filtrados);
  }

  function renderChartTrabVolumen(arrStats) {
    const canvas = document.getElementById('chartTrabVolumen');
    if (!canvas) return;
    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;
    const theme = getThemeColors();

    const sorted = [...arrStats].sort((a, b) => b.count - a.count).slice(0, 10);
    const labels = sorted.map(s => s.nombre);
    const data = sorted.map(s => s.count);

    if (chartTrabVolumenInstance) { chartTrabVolumenInstance.destroy(); chartTrabVolumenInstance = null; }

    const ctx = canvas.getContext('2d');
    chartTrabVolumenInstance = new ChartSDK(ctx, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['Sin datos'],
        datasets: [{
          label: 'Registros',
          data: data.length ? data : [0],
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: theme.text, font: { family: 'DM Sans', size: 11 } }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: theme.text, font: { family: 'DM Sans', size: 11 } }, grid: { color: theme.grid } }
        }
      }
    });
  }



  function renderChartTrabTendencia(filtrados) {
    const canvas = document.getElementById('chartTrabTendencia');
    if (!canvas) return;
    const ChartSDK = getChartSDK();
    if (!ChartSDK) return;
    const theme = getThemeColors();

    const daysMap = {};
    const labels = [];
    const dateKeys = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = formatDayMonthKey(d);
      const label = formatDayMonthLabel(d);
      dateKeys.push(key);
      labels.push(label);
      daysMap[key] = 0;
    }

    filtrados.forEach(d => {
      const key = formatDayMonthKey(d.timestamp);
      if (daysMap.hasOwnProperty(key)) daysMap[key]++;
    });

    const dataValues = dateKeys.map(key => daysMap[key]);

    if (chartTrabTendenciaInstance) { chartTrabTendenciaInstance.destroy(); chartTrabTendenciaInstance = null; }

    const ctx = canvas.getContext('2d');
    chartTrabTendenciaInstance = new ChartSDK(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Registros',
          data: dataValues,
          borderColor: '#8b5cf6',
          backgroundColor: theme.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
          borderWidth: 2, tension: 0.3, fill: true, pointRadius: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: theme.text, font: { family: 'DM Sans', size: 11 }, maxTicksLimit: 10 }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1, color: theme.text, font: { family: 'DM Sans', size: 11 } }, grid: { color: theme.grid } }
        }
      }
    });
  }

  function renderTablaTrabajadores(filtrados) {
    const tbody = document.getElementById('tablaTrabajadoresBody');
    if (!tbody) return;

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron registros para los filtros seleccionados.</td></tr>`;
      return;
    }

    const sorted = [...filtrados].sort((a, b) => b.timestamp - a.timestamp);

    tbody.innerHTML = sorted.map(d => {
      return `
        <tr>
          <td style="white-space: nowrap; font-size: 0.85rem;">${formatDateTime(d.timestamp)}</td>
          <td style="font-weight: 600;">${escapeHtml(d.asesor || 'No identificado')}</td>
          <td style="font-size: 0.85rem; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(d.descripcion)}">${escapeHtml(d.descripcion || '-')}</td>
        </tr>
      `;
    }).join('');
  }

  window.exportarTablaTrabajadoresCSV = function() {
    const trabajador = document.getElementById('filtroTrabajador')?.value || '';
    const periodo = document.getElementById('filtroFechaTrabajador')?.value || 'todo';

    let exportData = [...allFelicitacionesDocs];
    if (trabajador) exportData = exportData.filter(d => (d.asesor || 'No identificado').trim() === trabajador);
    if (periodo !== 'todo') {
      const now = new Date();
      const hoyStr = formatDayMonthKey(now);
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      exportData = exportData.filter(d => {
        const dKey = formatDayMonthKey(d.timestamp);
        if (periodo === 'hoy') return dKey === hoyStr;
        if (periodo === 'semana') return d.timestamp >= sevenDaysAgo && d.timestamp <= now;
        if (periodo === 'mes') return d.timestamp.getMonth() === now.getMonth() && d.timestamp.getFullYear() === now.getFullYear();
        return true;
      });
    }

    if (exportData.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Fecha,Trabajador,Comentario\n";
    exportData.sort((a, b) => b.timestamp - a.timestamp).forEach(d => {
      const fecha = formatDateTime(d.timestamp);
      const trab = escapeHtml(d.asesor || 'No identificado');
      const coment = escapeHtml(d.descripcion || '').replace(/"/g, '""');
      csvContent += `"${fecha}","${trab}","${coment}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_trabajadores_${formatDayMonthKey(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  async function loadFelicitacionesPanel() {
    const lastUpdateEl = document.getElementById('felicitacionesLastUpdate');
    if (lastUpdateEl) lastUpdateEl.textContent = 'Actualizando datos...';

    // 1. Mostrar de inmediato la interfaz de contenido con gráficos por defecto (0 retardo)
    renderAllChartsAndKPIs([]);
    initTrabajadoresDashboard([]);

    // 2. Consultar Firestore en segundo plano sin congelar la UI
    try {
      const docs = await fetchFelicitaciones();
      if (lastUpdateEl) {
        lastUpdateEl.textContent = `Última actualización: ${formatDateTime(new Date())}`;
      }
      renderAllChartsAndKPIs(docs);
      initTrabajadoresDashboard(docs);
    } catch (err) {
      console.warn("Conexión Firestore en espera de registros:", err);
      if (lastUpdateEl) {
        lastUpdateEl.textContent = `En espera de felicitaciones Firestore`;
      }
    }
  }

  // Exportar al objeto global window
  window.initFelicitacionesPage = function () {
    loadFelicitacionesPanel();

    const btnRefresh = document.getElementById('btnRefreshFelicitaciones');
    if (btnRefresh && !btnRefresh.dataset.bound) {
      btnRefresh.dataset.bound = "true";
      btnRefresh.addEventListener('click', () => {
        loadFelicitacionesPanel();
      });
    }
  };

  // Escuchar cambio de tema en cualquier botón
  ['themeToggleInput', 'themeToggleErp', 'themeToggleCrm'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          if (typeof window.initFelicitacionesPage === 'function') {
            window.initFelicitacionesPage();
          }
        }, 150);
      });
    }
  });

  // Inicialización inmediata al cargar el script o por hash
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.location.hash.includes('felicitaciones')) {
        window.initFelicitacionesPage();
      }
    });
  } else {
    if (window.location.hash.includes('felicitaciones')) {
      window.initFelicitacionesPage();
    }
  }

})();
