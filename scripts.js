// Logica de interaccion y animaciones para la landing page
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');
const formNotice = document.getElementById('formNotice');
const servicioCardsGrid = document.getElementById('serviciosGrid');

const serviciosMAC = [
  {
    name: 'Banco de la Nación',
    img: 'images/LogoBN.png',
    pdf: 'pdfs_info/BANCO-DE-LA-NACION.pdf',
    description: 'Pagos, depósitos y consultas de beneficios sociales con atención confiable.',
  },
  {
    name: 'DRTC Áncash',
    img: 'images/LogoDRTC.jpg',
    pdf: 'pdfs_info/DRTC-ANCASH.pdf',
    description: 'Licencias, registro vehicular y gestión de transporte en la región.',
  },
  {
    name: 'DRTPE Áncash',
    img: 'images/LogoTRABAJO.png',
    pdf: 'pdfs_info/DRTPE-ANCASH.pdf',
    description: 'Trámites de educación superior tecnológica y servicios de titulación.',
  },
  {
    name: 'EsSalud',
    img: 'images/LogoESSALUD.png',
    pdf: 'pdfs_info/ESSALUD.pdf',
    description: 'Afiliaciones, prestaciones médicas y atención de salud pública.',
  },
  {
    name: 'INPE',
    img: 'images/LogoINP.png',
    pdf: 'pdfs_info/INPE.pdf',
    description: 'Información y asesoría sobre servicios penitenciarios y trámites internos.',
  },
  {
    name: 'Migraciones',
    img: 'images/LogoMIGRACIONES.png',
    pdf: 'pdfs_info/migraciones-ancash.pdf',
    description: 'Asesoría en pasaportes, certificados migratorios y regularización de estatus.',
  },
  {
    name: 'ONP',
    img: 'images/LogoONP.png',
    pdf: 'pdfs_info/ONP.pdf',
    description: 'Consultas de aportes, pensiones y derechos previsionales para afiliados.',
  },
  {
    name: 'Poder Judicial',
    img: 'images/LogoPODERJUDICIAL.jpg',
    pdf: 'pdfs_info/PODER-JUDICIAL.pdf',
    description: 'Información legal, seguimiento de causas y apoyo en procedimientos judiciales.',
  },
  {
    name: 'RENIEC',
    img: 'images/LogoRENIEC.png',
    pdf: 'pdfs_info/RENIEC-PROVINCIAS.pdf',
    description: 'Actualiza tu DNI, solicita certificaciones y gestiona documentos de identidad.',
  },
  {
    name: 'SUNAFIL',
    img: 'images/LogoSUNAFIL.jpg',
    pdf: 'pdfs_info/SUNAFIL-1.pdf',
    description: 'Orientación en supervisión laboral y derechos de los trabajadores.',
  },
  {
    name: 'SUNARP',
    img: 'images/LogoSUNARP.jpeg',
    pdf: 'pdfs_info/SUNARP.pdf',
    description: 'Trámites registrales de bienes inmuebles, derechos reales y anotaciones.',
  },
  {
    name: 'SUNAT',
    img: 'images/LogoSUNAT.png',
    pdf: 'pdfs_info/SUNAT.pdf',
    description: 'Información tributaria y servicios relacionados con impuestos y obligaciones fiscales.',
  }
];

const heroText = 'Tramites simples. Atencion rapida. Chimbote.';
const heroTarget = document.getElementById('heroTypewriter');

function toggleMenu() {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('show');
}

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('show');
}

function typeWriter(text, element, speed = 70) {
  let index = 0;
  element.textContent = '';

  const timer = setInterval(() => {
    element.textContent += text[index];
    index += 1;
    if (index >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function triggerDownload(fileUrl, fileName) {
  const link = document.createElement('a');
  link.href = encodeURI(fileUrl);
  link.download = fileName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function renderServiceCards() {
  if (!servicioCardsGrid) return;

  servicioCardsGrid.innerHTML = serviciosMAC.map((service) => {
    return `
      <article class="card servicio-card slider-item">
        <a class="servicio-card__link" href="${service.pdf}" target="_blank" rel="noopener noreferrer" aria-label="Descargar ${service.name}">
          <div class="servicio-card__media">
            <img src="${service.img}" alt="Logo de ${service.name}" loading="lazy" />
          </div>
          <div class="servicio-card__content">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
          </div>
        </a>
      </article>
    `;
  }).join('');

  servicioCardsGrid.addEventListener('click', (event) => {
    const cardLink = event.target.closest('.servicio-card__link');
    if (!cardLink) return;
    event.preventDefault();
    
    // Encontrar el índice del servicio basado en la posición en el grid
    const cardIndex = Array.from(servicioCardsGrid.children).indexOf(
      event.target.closest('.slider-item')
    );
    
    if (cardIndex >= 0 && cardIndex < serviciosMAC.length) {
      const service = serviciosMAC[cardIndex];
      triggerDownload(service.pdf, `${service.name}.pdf`);
    }
  });
}

function initCarouselNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!prevBtn || !nextBtn || !servicioCardsGrid) return;

  const scroll = (direction) => {
    const sliderItem = servicioCardsGrid.querySelector('.slider-item');
    if (!sliderItem) return;

    const computedStyle = window.getComputedStyle(servicioCardsGrid);
    const gap = parseFloat(computedStyle.gap) || 0;
    const itemWidth = sliderItem.offsetWidth;
    const scrollAmount = itemWidth + gap;

    const targetScroll = direction === 'next' ? scrollAmount : -scrollAmount;

    servicioCardsGrid.scrollBy({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  prevBtn.addEventListener('click', () => scroll('prev'));
  nextBtn.addEventListener('click', () => scroll('next'));
}

function animateDashboardReveal() {
  const targets = [
    document.querySelector('.dashboard__kpis'),
    document.querySelector('.dashboard__satisfaction'),
    document.querySelector('.dashboard__charts'),
    document.getElementById('tableEntidades')
  ];

  targets.forEach((element, index) => {
    if (!element) return;
    setTimeout(() => {
      element.classList.add('revealed');
    }, index * 200);
  });
}

function handleScrollReveal() {
  const sections = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (entry.target.id === 'dashboard') {
        animateDashboardReveal();
      }
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => observer.observe(section));
}

function handleNavbarScroll() {
  const offset = window.scrollY;
  if (offset > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const valueElement = entry.target.closest('.kpi-value') || entry.target;
        const targetCount = Number(entry.target.dataset.count) || 0;
        const duration = 900;
        const startTime = performance.now();

        const updateCount = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          valueElement.textContent = Math.round(targetCount * easeOutExpo(progress)).toLocaleString('es-PE');
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            valueElement.classList.add('count-pop');
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  counters.forEach((counter) => observer.observe(counter));
}

function initCharts() {
  const barCanvas = document.getElementById('chartBar');
  const donutCanvas = document.getElementById('chartDonut');
  const lineCanvas = document.getElementById('chartLine');
  const barTooltipEl = document.getElementById('chartBarTooltip');
  const donutLegendEl = document.getElementById('donutLegend');

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js no está disponible');
    return;
  }

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#0D1A3A';
  const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--color-muted').trim() || '#6B7A9E';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || 'rgba(0, 0, 0, 0.1)';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = borderColor;
  Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";

  const setLoadingState = (canvas, isLoading) => {
    if (!canvas) return;
    const container = canvas.closest('.chart-container');
    if (!container) return;
    container.classList.toggle('loading', isLoading);
  };

  const getThemeColors = () => ({
    text: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#0D1A3A',
    muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted').trim() || '#6B7A9E',
    border: getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || 'rgba(0, 0, 0, 0.1)'
  });

  const syncChartTheme = () => {
    const theme = getThemeColors();
    if (barChart) {
      barChart.options.scales.y.ticks.color = theme.muted;
      barChart.options.scales.x.ticks.color = theme.muted;
      barChart.options.plugins.tooltip.titleColor = theme.text;
      barChart.options.plugins.tooltip.bodyColor = theme.text;
      barChart.options.plugins.tooltip.borderColor = theme.border;
      barChart.update('none');
    }
    if (donutChart) {
      donutChart.options.plugins.legend.labels.color = theme.muted;
      donutChart.options.plugins.tooltip.titleColor = theme.text;
      donutChart.options.plugins.tooltip.bodyColor = theme.text;
      donutChart.options.plugins.tooltip.borderColor = theme.border;
      donutChart.update('none');
    }
    if (lineChart) {
      lineChart.options.scales.y.ticks.color = theme.muted;
      lineChart.options.scales.x.ticks.color = theme.muted;
      lineChart.options.plugins.tooltip.titleColor = theme.text;
      lineChart.options.plugins.tooltip.bodyColor = theme.text;
      lineChart.options.plugins.tooltip.borderColor = theme.border;
      lineChart.update('none');
    }
  };

  const renderDonutLegend = () => {
    if (!donutLegendEl || !donutChart) return;
    const colors = donutChart.data.datasets[0].backgroundColor;
    donutLegendEl.innerHTML = entidadesSummary.map((item, idx) => `
      <button type="button" class="donut-legend-item${dashboardState.donutSelection === idx ? ' active' : ''}" data-index="${idx}">
        <span style="background: ${colors[idx]};"></span>
        <div>
          <strong>${item.entidad}</strong>
          <div>${item.porcentaje}%</div>
        </div>
      </button>
    `).join('');
    donutLegendEl.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        selectDonutSegment(index);
      });
    });
  };

  const selectDonutSegment = (index) => {
    if (!donutChart) return;
    dashboardState.donutSelection = index;
    donutChart.data.datasets[0].borderColor = donutChart.data.labels.map((_, idx) => idx === index ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)');
    donutChart.update();
    const centerLabel = document.getElementById('donutCenterLabel');
    if (centerLabel) {
      centerLabel.querySelector('.donut-center-label__name').textContent = entidadesSummary[index].entidad;
      centerLabel.querySelector('.donut-center-label__value').textContent = `${entidadesSummary[index].porcentaje}%`;
    }
    donutLegendEl?.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
    donutLegendEl?.querySelector(`button[data-index="${index}"]`)?.classList.add('active');
  };

  const barTooltipExternal = (context) => {
    if (!barTooltipEl) return;
    const tooltip = context.tooltip;
    if (tooltip.opacity === 0) {
      barTooltipEl.classList.remove('active');
      return;
    }
    barTooltipEl.innerHTML = `
      <div class="tooltip-title">${Array.isArray(tooltip.title) ? tooltip.title.join(' ') : tooltip.title}</div>
      <div class="tooltip-body">${tooltip.body?.[0]?.lines?.[0] || ''}</div>
    `;
    const left = (tooltip.caretX || 0) - 12;
    const top = (tooltip.caretY || 0) - 16;
    barTooltipEl.style.left = `${left}px`;
    barTooltipEl.style.top = `${top}px`;
    barTooltipEl.classList.add('active');
  };

  const satisfyThemeObserver = new MutationObserver(() => {
    syncChartTheme();
  });
  satisfyThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const gradientBackground = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.04)');
    gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.16)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.28)');
    return gradient;
  };

  const chartBarDefaults = {
    type: 'bar',
    data: {
      labels: barRangeData['3M'].labels,
      datasets: [{
        label: 'Atenciones',
        data: barRangeData['3M'].values,
        backgroundColor: 'rgba(59, 130, 246, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.95)',
        borderRadius: 16,
        borderSkipped: false,
        maxBarThickness: 54
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: barTooltipExternal,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          padding: 12,
          titleColor: '#ffffff',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toLocaleString('es-PE')} atenciones`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1000,
            color: mutedColor,
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(79, 70, 229, 0.08)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: mutedColor,
            font: { size: 12 }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        }
      }
    }
  };

  if (barCanvas) setLoadingState(barCanvas, true);
  if (donutCanvas) setLoadingState(donutCanvas, true);
  if (lineCanvas) setLoadingState(lineCanvas, true);

  const barChart = barCanvas ? new Chart(barCanvas.getContext('2d'), chartBarDefaults) : null;

  const donutConfig = donutCanvas ? {
    type: 'doughnut',
    data: {
      labels: entidadesSummary.map(item => item.entidad),
      datasets: [{
        data: entidadesSummary.map(item => item.porcentaje),
        backgroundColor: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'],
        borderColor: Array(entidadesSummary.length).fill('rgba(255, 255, 255, 0.9)'),
        borderWidth: 2,
        borderRadius: 8,
        spacing: 6,
        cutout: '62%',
        hoverOffset: 14
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          padding: 12,
          titleColor: '#ffffff',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  } : null;

  const donutChart = donutCanvas ? new Chart(donutCanvas.getContext('2d'), donutConfig) : null;

  const lineConfig = lineCanvas ? {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
      datasets: [{
        label: 'Espera promedio',
        data: [18, 16, 15, 14, 14],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(59, 130, 246, 0.12)';
          return gradientBackground(ctx, chartArea);
        },
        borderColor: 'rgba(59, 130, 246, 0.95)',
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(59, 130, 246, 0.95)',
        pointRadius: 4,
        tension: 0.38,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeOutQuad' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          padding: 12,
          titleColor: '#ffffff',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} min`,
            title: () => 'Espera promedio'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} min`,
            color: mutedColor,
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(79, 70, 229, 0.08)'
          }
        },
        x: {
          ticks: {
            color: mutedColor,
            font: { size: 12 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  } : null;

  const lineChart = lineCanvas ? new Chart(lineCanvas.getContext('2d'), lineConfig) : null;

  const refreshCharts = () => {
    [barCanvas, donutCanvas, lineCanvas].forEach((canvas) => setLoadingState(canvas, true));
    setTimeout(() => {
      barChart?.update();
      donutChart?.update();
      lineChart?.update();
      [barCanvas, donutCanvas, lineCanvas].forEach((canvas) => setLoadingState(canvas, false));
    }, 420);
  };

  document.querySelectorAll('.chart-refresh').forEach((button) => {
    button.addEventListener('click', refreshCharts);
  });

  renderDonutLegend();
  selectDonutSegment(dashboardState.donutSelection ?? 0);

  setTimeout(() => {
    [barCanvas, donutCanvas, lineCanvas].forEach((canvas) => setLoadingState(canvas, false));
    syncChartTheme();
  }, 400);

  const renderSparkline = (canvasId, data, color) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.map((_, index) => index + 1),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          fill: true,
          pointRadius: 0,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  };

  renderSparkline('sparklineHoy', sparklineSeries.sparklineHoy, '#3B82F6');
  renderSparkline('sparklineSemana', sparklineSeries.sparklineSemana, '#6366F1');
  renderSparkline('sparklineMes', sparklineSeries.sparklineMes, '#8B5CF6');
  renderSparkline('sparklineEspera', sparklineSeries.sparklineEspera, '#EC4899');

  const updateBarChart = (rangeKey) => {
    const range = barRangeData[rangeKey];
    if (!barChart || !range) return;
    dashboardState.currentBarRange = rangeKey;
    const canvas = document.getElementById('chartBar');
    setLoadingState(canvas, true);
    barChart.data.labels = range.labels;
    barChart.data.datasets[0].data = range.values;
    barChart.update();
    document.getElementById('chartBarPeriod').textContent = range.period;
    setTimeout(() => setLoadingState(canvas, false), 420);
  };

  document.querySelectorAll('.chart-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.chart-btn').forEach((btn) => btn.classList.remove('chart-btn--active'));
      button.classList.add('chart-btn--active');
      const selectedRange = button.dataset.range;
      if (selectedRange === '3M') updateBarChart('3M');
      if (selectedRange === '6M') updateBarChart('6M');
      if (selectedRange === '1A') updateBarChart('1A');
    });
  });

  const buildEntitiesTable = () => {
    const tbody = document.querySelector('#tableEntidades tbody');
    if (!tbody) return;
    const sortedData = [...entidadesSummary].sort((a, b) => {
      const key = dashboardState.tableSort.key;
      const order = dashboardState.tableSort.order === 'asc' ? 1 : -1;
      if (key === 'entidad') return a.entidad.localeCompare(b.entidad) * order;
      if (key === 'tendencia') return a.tendencia.localeCompare(b.tendencia) * order;
      if (key === 'satisfaccion') return (a.satisfaccion - b.satisfaccion) * order;
      return (a[key] - b[key]) * order;
    });

    tbody.innerHTML = sortedData.map((item) => {
      const trend = item.tendencia === 'up' ? '▲' : '▼';
      const stars = '★'.repeat(Math.round(item.satisfaccion)) + '☆'.repeat(5 - Math.round(item.satisfaccion));
      return `
        <tr>
          <td>${item.entidad}</td>
          <td>${item.atenciones.toLocaleString('es-PE')}</td>
          <td>${item.porcentaje}%</td>
          <td class="table-trend ${item.tendencia}">${trend}</td>
          <td>${stars}</td>
        </tr>
      `;
    }).join('');
  };

  const tableHeaders = document.querySelectorAll('#tableEntidades th');
  tableHeaders.forEach((th) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (!key) return;
      if (dashboardState.tableSort.key === key) {
        dashboardState.tableSort.order = dashboardState.tableSort.order === 'asc' ? 'desc' : 'asc';
      } else {
        dashboardState.tableSort.key = key;
        dashboardState.tableSort.order = 'desc';
      }
      tableHeaders.forEach((header) => header.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(dashboardState.tableSort.order === 'asc' ? 'sort-asc' : 'sort-desc');
      buildEntitiesTable();
    });
  });

  buildEntitiesTable();

  if (donutCanvas && donutChart) {
    donutCanvas.addEventListener('click', (event) => {
      const points = donutChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
      if (!points.length) return;
      selectDonutSegment(points[0].index);
    });
  }

  updateBarChart('3M');
}

function handleFormSubmit(event) {
  event.preventDefault();
  formNotice.textContent = 'Gracias por escribirnos. Pronto nos comunicaremos contigo.';
  event.target.reset();
}

function init() {
  typeWriter(heroText, heroTarget);
  renderServiceCards();
  initCarouselNavigation();
  handleScrollReveal();
  handleNavbarScroll();
  animateCounters();
  initCharts();
  initReservasSystem();

  navToggle.addEventListener('click', toggleMenu);
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', handleNavbarScroll);
  contactForm.addEventListener('submit', handleFormSubmit);
}

/* ========== SISTEMA DE RESERVAS CON FIREBASE ========== */

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA43Uu_3-Oy71LkQ8_r0rpt_fJcjt3jRYg",
  authDomain: "mac-chimbote.firebaseapp.com",
  projectId: "mac-chimbote",
  storageBucket: "mac-chimbote.firebasestorage.app",
  messagingSenderId: "246175906335",
  appId: "1:246175906335:web:c202b8bf77a637d9d5b32a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Entidades disponibles (12 del Centro MAC)
const entidadesDisponibles = [
  'RENIEC',
  'Migraciones',
  'ONP',
  'EsSalud',
  'Banco de la Nación',
  'DRTC',
  'DRTPE',
  'INPE',
  'Poder Judicial',
  'SUNAFIL',
  'SUNARP',
  'SUNAT'
];

// Feriados en Perú (agrega los que sean relevantes para 2025-2026)
const feriadosPeruanos = new Set([
  '2025-01-01', // Año Nuevo
  '2025-04-09', // Miércoles Santo
  '2025-05-01', // Día del Trabajo
  '2025-06-29', // San Pedro y San Pablo
  '2025-07-28', // Fiestas Patrias
  '2025-07-29', // Fiestas Patrias
  '2025-08-30', // Santa Rosa de Lima
  '2025-10-08', // Combate del 8 de octubre
  '2025-11-01', // Todos los Santos
  '2025-12-08', // Inmaculada Concepción
  '2025-12-09', // Feriado adicional
  '2025-12-25', // Navidad
  // Agregar más feriados según sea necesario
]);

// Estado del formulario
let reservasState = {
  currentStep: 1,
  selectedEntity: null,
  selectedDate: null,
  selectedTime: null,
  nombre: '',
  dni: '',
  telefono: '',
  motivo: ''
};

// Estado del dashboard
const dashboardState = {
  currentBarRange: '3M',
  donutSelection: null,
  tableSort: { key: 'atenciones', order: 'desc' }
};

const barRangeData = {
  '3M': {
    labels: ['Mar', 'Abr', 'May'],
    values: [6890, 7120, 7204],
    period: 'Mar – May 2025'
  },
  '6M': {
    labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
    values: [6120, 5850, 6320, 6890, 7120, 7204],
    period: 'Dic 2024 – May 2025'
  },
  '1A': {
    labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
    values: [5140, 5390, 5540, 5960, 6280, 6510, 6120, 5850, 6320, 6890, 7120, 7204],
    period: 'Jun 2024 – May 2025'
  }
};

const entidadesSummary = [
  { entidad: 'Banco Nación', atenciones: 1680, porcentaje: 28, tendencia: 'up', satisfaccion: 4.9 },
  { entidad: 'RENIEC', atenciones: 1500, porcentaje: 25, tendencia: 'up', satisfaccion: 4.7 },
  { entidad: 'EsSalud', atenciones: 1080, porcentaje: 18, tendencia: 'down', satisfaccion: 4.5 },
  { entidad: 'DRTC', atenciones: 900, porcentaje: 15, tendencia: 'up', satisfaccion: 4.2 },
  { entidad: 'Migraciones', atenciones: 720, porcentaje: 12, tendencia: 'down', satisfaccion: 4.3 },
  { entidad: 'Otros', atenciones: 120, porcentaje: 2, tendencia: 'up', satisfaccion: 4.1 }
];

const sparklineSeries = {
  sparklineHoy: [42, 48, 40, 55, 52, 60, 58],
  sparklineSemana: [268, 292, 310, 315, 330, 348, 362],
  sparklineMes: [6500, 6680, 6800, 7000, 7120, 7204, 7204],
  sparklineEspera: [18, 16, 15, 14, 14, 13, 14]
};

// Funciones auxiliares para fechas
function isWeekday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6; // No domingo (0) ni sábado (6)
}

function isHoliday(dateString) {
  return feriadosPeruanos.has(dateString);
}

function getValidDateConstraints() {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30); // Máximo 30 días adelante

  return {
    min: today.toISOString().split('T')[0],
    max: maxDate.toISOString().split('T')[0]
  };
}

// Generar horarios disponibles
function generateTimeSlots() {
  const slots = [];
  const startHour = 8;
  const startMinute = 30;
  const endHour = 16;
  const endMinute = 30;

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    slots.push(timeStr);
    currentMinute += 30;
    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }
  return slots;
}

// Obtener cantidad de reservas en un horario específico
async function getSlotReservations(date, time, entity) {
  const snapshot = await db.collection('reservas')
    .where('fecha', '==', date)
    .where('hora', '==', time)
    .where('entidad', '==', entity)
    .get();
  return snapshot.size;
}

// Verificar si el DNI ya tiene reserva para esa fecha y entidad
async function checkDuplicateReservation(dni, date, entity) {
  const snapshot = await db.collection('reservas')
    .where('dni', '==', dni)
    .where('fecha', '==', date)
    .where('entidad', '==', entity)
    .get();
  return snapshot.size > 0;
}

// Generar código único MAC-ANCASH-XXXX
function generateTicketCode() {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MAC-ANCASH-${randomNum}`;
}

// Renderizar grid de entidades
function renderEntitiesGrid() {
  const grid = document.getElementById('entitiesGrid');
  if (!grid) return;

  grid.innerHTML = entidadesDisponibles.map(entity => `
    <label class="entity-card">
      <input type="radio" name="entidad" value="${entity}" required>
      <span class="entity-label">${entity}</span>
    </label>
  `).join('');

  // Event listeners para selección de entidad
  const cards = grid.querySelectorAll('label');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = card.querySelector('input');
      reservasState.selectedEntity = input.value;
      
      // Habilitar input de fecha cuando se selecciona entidad
      const dateInput = document.getElementById('reservaDate');
      if (dateInput) {
        dateInput.disabled = false;
        const constraints = getValidDateConstraints();
        dateInput.min = constraints.min;
        dateInput.max = constraints.max;
      }
    });

    const input = card.querySelector('input');
    input.addEventListener('change', () => {
      cards.forEach(c => c.classList.remove('selected'));
      if (input.checked) {
        card.classList.add('selected');
        reservasState.selectedEntity = input.value;
      }
    });
  });
}

// Manejar cambios de fecha
async function handleDateChange(event) {
  const dateStr = event.target.value;
  const errorEl = document.getElementById('formError');
  errorEl.textContent = '';

  if (!dateStr) return;

  // Verificar que el año tenga 4 dígitos antes de validar
  const parts = dateStr.split('-');
  if (!parts[0] || parts[0].length < 4) return;

  const date = new Date(dateStr + 'T00:00:00');

  // Verificar que la fecha sea válida
  if (isNaN(date.getTime())) return;

  // Validar que sea día laboral (lunes a viernes)
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    errorEl.textContent = '⚠️ Solo se permiten días laborales (lunes a viernes)';
    event.target.value = '';
    document.getElementById('timeSlotsContainer').innerHTML = '';
    return;
  }

  // Validar que no sea feriado
  if (isHoliday(dateStr)) {
    errorEl.textContent = '⚠️ Esta fecha es feriado. Por favor elige otra fecha.';
    event.target.value = '';
    document.getElementById('timeSlotsContainer').innerHTML = '';
    return;
  }

  // Validar que sea una fecha futura (no pasada)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    errorEl.textContent = '⚠️ No puedes seleccionar fechas pasadas';
    event.target.value = '';
    document.getElementById('timeSlotsContainer').innerHTML = '';
    return;
  }

  reservasState.selectedDate = dateStr;
  reservasState.selectedTime = null;
  await renderTimeSlots(dateStr);
}

// Renderizar slots de horarios
async function renderTimeSlots(date) {
  const container = document.getElementById('timeSlotsContainer');
  if (!container || !reservasState.selectedEntity) return;

  // Mostrar loading mientras consulta Firebase
  container.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;">Cargando horarios...</p>';

  const slots = generateTimeSlots();
  const entity = reservasState.selectedEntity;
  const maxReservationsPerSlot = 5;

  let html = '';
  for (const time of slots) {
    const count = await getSlotReservations(date, time, entity);
    const isAvailable = count < maxReservationsPerSlot;
    const availableSpots = maxReservationsPerSlot - count;

    // Usar ID sin dos puntos para evitar selector inválido
    const safeId = 'time_' + time.replace(':', '-');
    const disabledClass = isAvailable ? '' : 'disabled';
    const disabledAttr = isAvailable ? '' : 'disabled';

    html += `
      <div class="time-slot ${disabledClass}" data-time="${time}">
        <input type="radio" name="hora" id="${safeId}" value="${time}" ${disabledAttr}>
        <label for="${safeId}" class="time-slot-label">
          ${time}
          <small>${isAvailable ? `${availableSpots} disponibles` : 'Lleno'}</small>
        </label>
      </div>
    `;
  }

  container.innerHTML = html;

  // Event listeners — clic en el div completo para mejor UX en móvil
  const timeSlots = container.querySelectorAll('.time-slot:not(.disabled)');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      // Deseleccionar todos
      container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      // Marcar el seleccionado
      slot.classList.add('selected');
      const input = slot.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
        reservasState.selectedTime = input.value;
      }
    });
  });
}

// Cambiar de paso del formulario
async function goToStep(stepNumber) {
  const currentStep = reservasState.currentStep;
  
  // Validar paso actual antes de avanzar
  if (stepNumber > currentStep) {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;
  }

  // Actualizar estado
  reservasState.currentStep = stepNumber;

  // Actualizar visualización
  updateFormDisplay();
  updateProgressBar();

  // Habilitar input de fecha si se va al paso 2
  if (stepNumber === 2) {
    const dateInput = document.getElementById('reservaDate');
    if (dateInput) {
      dateInput.disabled = false;
      const constraints = getValidDateConstraints();
      dateInput.min = constraints.min;
      dateInput.max = constraints.max;
    }
  }
}

// Validar datos del paso actual
async function validateStep(step) {
  const errorEl = document.getElementById('formError');
  errorEl.textContent = '';

  if (step === 1) {
    if (!reservasState.selectedEntity) {
      errorEl.textContent = 'Por favor selecciona una entidad';
      return false;
    }
  } else if (step === 2) {
    if (!reservasState.selectedDate) {
      errorEl.textContent = 'Por favor selecciona una fecha';
      return false;
    }
    if (!reservasState.selectedTime) {
      errorEl.textContent = 'Por favor selecciona una hora';
      return false;
    }
  }

  return true;
}

// Actualizar visualización del formulario
function updateFormDisplay() {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach((step, index) => {
    if (index + 1 === reservasState.currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Mostrar/ocultar botones
  const prevBtn = document.getElementById('prevReservasBtn');
  const nextBtn = document.getElementById('nextReservasBtn');
  const submitBtn = document.getElementById('submitReservasBtn');

  if (reservasState.currentStep === 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  } else if (reservasState.currentStep === 2) {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  } else if (reservasState.currentStep === 3) {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  }
}

// Actualizar barra de progreso
function updateProgressBar() {
  const progressFill = document.getElementById('progressFill');
  const steps = document.querySelectorAll('.progress-step');

  const progress = (reservasState.currentStep - 1) / 2 * 100;
  progressFill.style.width = Math.max(33, progress + 33) + '%';

  steps.forEach((step, index) => {
    const stepNum = index + 1;
    if (stepNum < reservasState.currentStep) {
      step.classList.remove('active');
      step.classList.add('completed');
    } else if (stepNum === reservasState.currentStep) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
}

// Guardar en Firestore
async function saveReservation(formData) {
  try {
    const ticketCode = generateTicketCode();
    
    const reserva = {
      codigoTicket: ticketCode,
      entidad: reservasState.selectedEntity,
      nombre: formData.nombre,
      dni: formData.dni,
      telefono: formData.telefono,
      fecha: reservasState.selectedDate,
      hora: reservasState.selectedTime,
      motivo: formData.motivo,
      creadoEn: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('reservas').add(reserva);
    return { success: true, ticketCode, data: reserva };
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    return { success: false, error: error.message };
  }
}

// Generar QR con qrcode.js
function generateQRCode(ticketCode) {
  const qrContainer = document.getElementById('qrCode');
  if (!qrContainer) return;

  qrContainer.innerHTML = ''; // Limpiar QR anterior si existe
  
  new QRCode(qrContainer, {
    text: ticketCode,
    width: 200,
    height: 200,
    colorDark: '#003082',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

// Mostrar pantalla de confirmación
function showConfirmation(reservation) {
  // Ocultar formulario
  document.getElementById('reservasForm').style.display = 'none';
  document.querySelector('.reservas__header').style.display = 'none';
  document.querySelector('.reservas__progress-bar').style.display = 'none';

  // Llenar datos del ticket
  document.getElementById('ticketCode').textContent = reservation.ticketCode;
  document.getElementById('ticketEntity').textContent = reservation.data.entidad;
  document.getElementById('ticketNombre').textContent = reservation.data.nombre;
  document.getElementById('ticketDni').textContent = reservation.data.dni;
  
  // Formatear fecha
  const fecha = new Date(reservation.data.fecha + 'T00:00:00');
  const fechaFormato = fecha.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('ticketFecha').textContent = fechaFormato;
  document.getElementById('ticketHora').textContent = reservation.data.hora;
  document.getElementById('ticketMotivo').textContent = reservation.data.motivo;

  // Timestamp
  const ahora = new Date();
  const timestamp = ahora.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('ticketTimestamp').textContent = `Creado: ${timestamp}`;

  // Generar QR
  generateQRCode(reservation.ticketCode);

  // Mostrar sección de confirmación
  document.getElementById('reservasConfirmation').style.display = 'flex';
}

// Imprimir ticket
function printTicket() {
  // Recoger datos del ticket desde el DOM
  const code    = document.getElementById('ticketCode')?.textContent || '';
  const entity  = document.getElementById('ticketEntity')?.textContent || '';
  const nombre  = document.getElementById('ticketNombre')?.textContent || '';
  const dni     = document.getElementById('ticketDni')?.textContent || '';
  const fecha   = document.getElementById('ticketFecha')?.textContent || '';
  const hora    = document.getElementById('ticketHora')?.textContent || '';
  const motivo  = document.getElementById('ticketMotivo')?.textContent || '';
  const ts      = document.getElementById('ticketTimestamp')?.textContent || '';

  // Capturar el QR como imagen base64
  const qrCanvas = document.querySelector('#qrContainer canvas');
  const qrImg = qrCanvas ? qrCanvas.toDataURL('image/png') : '';

  const printWin = window.open('', '_blank', 'width=650,height=800');
  if (!printWin) {
    alert('Por favor, permite las ventanas emergentes para imprimir el ticket.');
    return;
  }

  printWin.document.write(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ticket MAC — ${code}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: white;
      color: #0D1A3A;
      padding: 24px;
      font-size: 14px;
      line-height: 1.5;
    }
    .ticket {
      max-width: 560px;
      margin: 0 auto;
      border: 2px solid #003082;
      border-radius: 14px;
      overflow: hidden;
    }
    /* Cabecera azul */
    .ticket__head {
      background: #003082;
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ticket__badge {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ticket__head-info h1 { font-size: 17px; font-weight: 700; margin-bottom: 3px; }
    .ticket__head-info p  { font-size: 12px; opacity: 0.85; }
    .ticket__code {
      background: rgba(255,255,255,0.12);
      display: inline-block;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      margin-top: 6px;
      letter-spacing: 0.05em;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* Franja roja decorativa */
    .ticket__stripe {
      height: 4px;
      background: #E8001C;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* Detalles */
    .ticket__body {
      padding: 20px 24px;
      display: grid;
      gap: 10px;
    }
    .ticket__row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      border-bottom: 1px solid #E4EAFF;
      padding-bottom: 10px;
    }
    .ticket__row:last-child { border-bottom: none; padding-bottom: 0; }
    .ticket__row .lbl {
      font-size: 11.5px;
      font-weight: 600;
      color: #6B7A9E;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      min-width: 90px;
    }
    .ticket__row .val {
      font-size: 13.5px;
      font-weight: 700;
      color: #0D1A3A;
      text-align: right;
    }
    /* QR */
    .ticket__qr {
      background: #F5F7FC;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #E4EAFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ticket__qr img {
      width: 130px;
      height: 130px;
      border: 2px solid #D4DAF0;
      border-radius: 8px;
      background: white;
      padding: 6px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ticket__qr p {
      margin-top: 8px;
      font-size: 11px;
      color: #6B7A9E;
    }
    /* Footer */
    .ticket__foot {
      background: #EEF3FF;
      border-top: 1px solid #D4DAF0;
      padding: 12px 24px;
      text-align: center;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .ticket__foot p     { font-weight: 600; font-size: 12px; color: #0D1A3A; }
    .ticket__foot small { font-size: 10.5px; color: #6B7A9E; }
    .ticket__ts {
      text-align: center;
      margin-top: 16px;
      font-size: 10px;
      color: #9AA8C8;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 1cm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket__head">
      <div class="ticket__badge">MAC</div>
      <div class="ticket__head-info">
        <h1>Centro MAC Chimbote</h1>
        <p>Mejor Atención al Ciudadano · Megaplaza Nivel 2</p>
        <span class="ticket__code"># ${code}</span>
      </div>
    </div>
    <div class="ticket__stripe"></div>
    <div class="ticket__body">
      <div class="ticket__row">
        <span class="lbl">Entidad</span>
        <span class="val">${entity}</span>
      </div>
      <div class="ticket__row">
        <span class="lbl">Nombre</span>
        <span class="val">${nombre}</span>
      </div>
      <div class="ticket__row">
        <span class="lbl">DNI</span>
        <span class="val">${dni}</span>
      </div>
      <div class="ticket__row">
        <span class="lbl">Fecha</span>
        <span class="val">${fecha}</span>
      </div>
      <div class="ticket__row">
        <span class="lbl">Hora</span>
        <span class="val">${hora}</span>
      </div>
      <div class="ticket__row">
        <span class="lbl">Motivo</span>
        <span class="val">${motivo}</span>
      </div>
    </div>
    ${qrImg ? `
    <div class="ticket__qr">
      <img src="${qrImg}" alt="Código QR del turno">
      <p>Presenta este código QR al llegar al Centro MAC</p>
    </div>` : ''}
    <div class="ticket__foot">
      <p>Llega 10 minutos antes de tu turno</p>
      <small>Megaplaza Chimbote, Av. Víctor Raúl Haya de la Torre 2964, Nivel 2</small>
    </div>
  </div>
  <p class="ticket__ts">${ts}</p>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  <\/script>
</body>
</html>
  `);
  printWin.document.close();
}

// Reiniciar reserva
function resetReservation() {
  reservasState = {
    currentStep: 1,
    selectedEntity: null,
    selectedDate: null,
    selectedTime: null,
    nombre: '',
    dni: '',
    telefono: '',
    motivo: ''
  };

  document.getElementById('reservasForm').reset();
  document.getElementById('reservasForm').style.display = 'flex';
  document.querySelector('.reservas__header').style.display = 'block';
  document.querySelector('.reservas__progress-bar').style.display = 'block';
  document.getElementById('reservasConfirmation').style.display = 'none';
  
  updateFormDisplay();
  updateProgressBar();
  renderEntitiesGrid();
  
  goToStep(1);
}

// Inicializar sistema de reservas
function initReservasSystem() {
  const form = document.getElementById('reservasForm');
  if (!form) return;

  // Forzar estado inicial en paso 1
  reservasState.currentStep = 1;
  reservasState.selectedEntity = null;
  reservasState.selectedDate = null;
  reservasState.selectedTime = null;

  // Renderizar entidades primero
  renderEntitiesGrid();

  // Actualizar visualización DESPUÉS de renderizar
  updateProgressBar();
  updateFormDisplay();

  // Botones de navegación
  const prevBtn = document.getElementById('prevReservasBtn');
  const nextBtn = document.getElementById('nextReservasBtn');
  const submitBtn = document.getElementById('submitReservasBtn');

  prevBtn.addEventListener('click', () => goToStep(reservasState.currentStep - 1));
  nextBtn.addEventListener('click', () => goToStep(reservasState.currentStep + 1));

  // Manejar cambio de fecha
  const dateInput = document.getElementById('reservaDate');
  if (dateInput) {
    // Establecer restricciones de fecha desde el inicio
    const constraints = getValidDateConstraints();
    dateInput.min = constraints.min;
    dateInput.max = constraints.max;
    dateInput.addEventListener('change', handleDateChange);
  }

  // Manejar envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recolectar datos del paso 3
    reservasState.nombre = document.getElementById('reservaNombre').value;
    reservasState.dni = document.getElementById('reservaDni').value;
    reservasState.telefono = document.getElementById('reservaTelefono').value;
    reservasState.motivo = document.getElementById('reservaMotivo').value;

    const errorEl = document.getElementById('formError');
    errorEl.textContent = '';

    // Validar DNI
    if (reservasState.dni.length !== 8 || !/^\d{8}$/.test(reservasState.dni)) {
      errorEl.textContent = '❌ El DNI debe tener exactamente 8 dígitos';
      return;
    }

    // Validar datos completos
    if (!reservasState.nombre || !reservasState.telefono || !reservasState.motivo) {
      errorEl.textContent = 'Por favor completa todos los campos';
      return;
    }

    // Verificar DNI duplicado
    const isDuplicate = await checkDuplicateReservation(
      reservasState.dni,
      reservasState.selectedDate,
      reservasState.selectedEntity
    );

    if (isDuplicate) {
      errorEl.textContent = 'Este DNI ya tiene una reserva para esta fecha y entidad';
      return;
    }

    // Guardar en Firestore
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const result = await saveReservation({
      nombre: reservasState.nombre,
      dni: reservasState.dni,
      telefono: reservasState.telefono,
      motivo: reservasState.motivo
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar Reserva';

    if (result.success) {
      showConfirmation(result);
    } else {
      errorEl.textContent = `Error al guardar la reserva: ${result.error}`;
    }
  });

  // Botones de confirmación
  document.getElementById('printBtn').addEventListener('click', printTicket);
  document.getElementById('newReservationBtn').addEventListener('click', resetReservation);
  document.getElementById('backHomeBtn').addEventListener('click', () => {
    location.hash = '#inicio';
    resetReservation();
  });
}

document.addEventListener('DOMContentLoaded', init);