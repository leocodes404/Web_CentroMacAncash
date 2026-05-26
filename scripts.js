// ── SPA ROUTER ──────────────────────────────────────────────
const ROUTES = {
  '': 'page-inicio',
  'inicio': 'page-inicio',
  'servicios': 'page-inicio',
  'reservar': 'page-reservar',
  'pasaporte': 'page-pasaporte',
  'noticias': 'page-noticias',
  'publicaciones': 'page-publicaciones',
  'dashboard': 'page-inicio',
};

function getRoute() {
  const hash = window.location.hash.replace('#/', '').split('?')[0];
  return hash || '';
}

function navigateTo(route) {
  window.location.hash = route ? `#/${route}` : '#/';
}

function renderRoute() {
  const route = getRoute();
  const pageId = ROUTES[route] || 'page-inicio';

  // Ocultar todas las páginas
  document.querySelectorAll('[data-page]').forEach(page => {
    page.classList.remove('page--active');
    page.setAttribute('aria-hidden', 'true');
  });

  // Mostrar la página activa
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('page--active');
    activePage.removeAttribute('aria-hidden');
    window.scrollTo(0, 0);
  }

  // Actualizar nav links activos
  document.querySelectorAll('.navbar__menu a[data-route]').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });

  // Cerrar menú móvil después de navegar
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  if (navMenu && navToggle) {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  // Ejecutar init de cada página si es necesario
  onRouteChange(route);
}

function onRouteChange(route) {
  if (route === 'dashboard') {
    initDashboardPage?.();
    setTimeout(() => {
      const dashSection = document.getElementById('dashboard');
      if (dashSection) dashSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  if (route === 'servicios') {
    // Servicios está en la página de inicio, hacer scroll a la sección
    setTimeout(() => {
      const svcSection = document.getElementById('servicios');
      if (svcSection) svcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    initHomePage?.();
  }
  if (route === '' || route === 'inicio') initHomePage?.();
  if (route === 'noticias') initNoticiasPage?.();
  if (route === 'reservar') initReservasPage?.();
  if (route === 'pasaporte') initPasaportePage?.();
  if (route === 'publicaciones') initPublicacionesPage?.();
}

// Event listeners para el router
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => {
  renderRoute();
});

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

// ── NOTICIAS ────────────────────────────────────────────
// Noticias oficiales de mac.pe/noticias-mac/
const noticiasMAC = [
  {
    id: 1,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Cochorco',
    categoria: 'MAC Express',
    fecha: '2026-01-27',
    resumen: 'Se inauguró un módulo MAC Express en la Municipalidad Distrital de Cochorco, en Jr. Sánchez Carrión S/N – Aricapampa, provincia Sánchez Carrión, La Libertad. Una nueva plataforma de atención ciudadana acercándose a más peruanos.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-cochorco/'
  },
  {
    id: 2,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de José Leonardo Ortiz',
    categoria: 'MAC Express',
    fecha: '2026-01-23',
    resumen: 'Nuevo módulo MAC Express en la Municipalidad Distrital de José Leonardo Ortiz, Av. Sáenz Peña N° 2151, provincia de Chiclayo, Lambayeque. La plataforma sigue expandiéndose a nivel nacional.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-jose-leonardo-ortiz/'
  },
  {
    id: 3,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Pacora',
    categoria: 'MAC Express',
    fecha: '2026-01-22',
    resumen: 'Inauguración de módulo MAC Express en la Municipalidad Distrital de Pacora, Calle 28 de Julio N°108, provincia de Pacora, Lambayeque. Nuevos servicios del Estado al alcance del ciudadano.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-pacora/'
  },
  {
    id: 4,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Ichuña',
    categoria: 'MAC Express',
    fecha: '2025-12-29',
    resumen: 'Nuevo módulo MAC Express inaugurado en la Municipalidad Distrital de Ichuña, Provincia General Sánchez Cerro, Moquegua. La red de atención ciudadana continúa creciendo.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-ichuna/'
  },
  {
    id: 5,
    titulo: 'Lanzamiento del aplicativo MAC Express Perú',
    categoria: 'Institucional',
    fecha: '2025-11-28',
    resumen: 'Se lanzó el Aplicativo MAC Express Perú, herramienta digital que permite realizar más de 80 procedimientos del Estado y fortalece la cobertura de la Plataforma MAC a nivel nacional.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/lanzamiento-del-aplicativo-mac-express-peru/'
  },
  {
    id: 6,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Uchumayo',
    categoria: 'MAC Express',
    fecha: '2025-11-14',
    resumen: 'Nuevo módulo MAC Express inaugurado en la Municipalidad Distrital de Uchumayo, provincia de Arequipa. La plataforma MAC sigue llegando a más distritos del país.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-uchumayo/'
  },
  {
    id: 7,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Samegua',
    categoria: 'MAC Express',
    fecha: '2025-11-06',
    resumen: 'Inauguración del módulo MAC Express en la Municipalidad Distrital de Samegua, Provincia de Mariscal Nieto, Moquegua. Nuevo paso en la expansión de servicios al ciudadano.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-samegua/'
  },
  {
    id: 8,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de Mala',
    categoria: 'MAC Express',
    fecha: '2025-10-28',
    resumen: 'Nuevo módulo MAC Express en la Municipalidad Distrital de Mala, Provincia de Cañete, Lima. La red de Centros MAC continúa acercando los servicios del Estado a la ciudadanía.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-mala/'
  },
  {
    id: 9,
    titulo: 'Inauguración MAC Express en la Municipalidad Distrital de La Esperanza',
    categoria: 'MAC Express',
    fecha: '2025-10-03',
    resumen: 'Inauguración del módulo MAC Express en la Municipalidad Distrital de La Esperanza, La Libertad. Un logro para la atención ciudadana en la región.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-distrital-de-la-esperanza/'
  },
  {
    id: 10,
    titulo: 'Inauguración MAC Express en la Municipalidad Provincial de Sánchez Carrión',
    categoria: 'MAC Express',
    fecha: '2025-10-03',
    resumen: 'Nuevo módulo MAC Express inaugurado en la Municipalidad Provincial de Sánchez Carrión, La Libertad. La plataforma MAC fortalece su presencia en el norte del país.',
    imagen: 'images/noticia-placeholder.jpg',
    url: 'https://mac.pe/inauguracion-mac-express-en-la-municipalidad-provincial-de-sanchez-carrion/'
  }
];

// ── PUBLICACIONES ─────────────────────────────────────
const publicacionesMAC = {
  boletinesAnuales: [
    {
      id: 'anual-2025',
      titulo: 'Boletín Anual MAC Chimbote 2025',
      tipo: 'Boletín Anual',
      año: '2025',
      fecha: '2025-12-31',
      descripcion: 'Resumen anual de gestión, atenciones, indicadores de calidad y logros del Centro MAC Chimbote durante el año 2025.',
      url: 'boletines/anuales/Boletin-Anual-2025.pdf'
    },
    {
      id: 'anual-2024',
      titulo: 'Boletín Anual MAC Chimbote 2024',
      tipo: 'Boletín Anual',
      año: '2024',
      fecha: '2024-12-31',
      descripcion: 'Resumen anual de gestión, atenciones, indicadores de calidad y logros del Centro MAC Chimbote durante el año 2024.',
      url: 'boletines/anuales/Boletin-Anual-2024.pdf'
    },
    {
      id: 'anual-2023',
      titulo: 'Boletín Anual MAC Chimbote 2023',
      tipo: 'Boletín Anual',
      año: '2023',
      fecha: '2023-12-31',
      descripcion: 'Resumen anual de gestión, atenciones, indicadores de calidad y logros del Centro MAC Chimbote durante el año 2023.',
      url: 'boletines/anuales/Boletin-Anual-2023.pdf'
    },
    {
      id: 'anual-2022',
      titulo: 'Boletín Anual MAC Chimbote 2022',
      tipo: 'Boletín Anual',
      año: '2022',
      fecha: '2022-12-31',
      descripcion: 'Resumen anual de gestión, atenciones, indicadores de calidad y logros del Centro MAC Chimbote durante el año 2022.',
      url: 'boletines/anuales/Boletin-Anual-2022.pdf'
    }
  ],
  boletinesMensuales: [
    {
      id: 'mensual-2025-04',
      titulo: 'Boletín Mensual — Abril 2025',
      tipo: 'Boletín Mensual',
      mes: 'Abril',
      año: '2025',
      fecha: '2025-04-30',
      descripcion: 'Estadísticas de atención, trámites procesados e indicadores de satisfacción del mes de abril de 2025 en el Centro MAC Chimbote.',
      url: 'boletines/mensuales/Boletin-Mensual-Abril-2025.pdf'
    },
    {
      id: 'mensual-2025-03',
      titulo: 'Boletín Mensual — Marzo 2025',
      tipo: 'Boletín Mensual',
      mes: 'Marzo',
      año: '2025',
      fecha: '2025-03-31',
      descripcion: 'Estadísticas de atención, trámites procesados e indicadores de satisfacción del mes de marzo de 2025 en el Centro MAC Chimbote.',
      url: 'boletines/mensuales/Boletin-Mensual-Marzo-2025.pdf'
    },
    {
      id: 'mensual-2025-02',
      titulo: 'Boletín Mensual — Febrero 2025',
      tipo: 'Boletín Mensual',
      mes: 'Febrero',
      año: '2025',
      fecha: '2025-02-28',
      descripcion: 'Estadísticas de atención, trámites procesados e indicadores de satisfacción del mes de febrero de 2025 en el Centro MAC Chimbote.',
      url: 'boletines/mensuales/Boletin-Mensual-Febrero-2025.pdf'
    },
    {
      id: 'mensual-2025-01',
      titulo: 'Boletín Mensual — Enero 2025',
      tipo: 'Boletín Mensual',
      mes: 'Enero',
      año: '2025',
      fecha: '2025-01-31',
      descripcion: 'Estadísticas de atención, trámites procesados e indicadores de satisfacción del mes de enero de 2025 en el Centro MAC Chimbote.',
      url: 'boletines/mensuales/Boletin-Mensual-Enero-2025.pdf'
    }
  ],
  manuales: [
    {
      id: 'manual-funcionamiento',
      titulo: 'Manual de Funcionamiento Centro de Mejor Atención al Ciudadano',
      tipo: 'Manual',
      fecha: '2025-01-01',
      descripcion: 'Documento oficial que establece los lineamientos, protocolos y procedimientos de funcionamiento de los Centros MAC a nivel nacional. Aprobado mediante Resolución de Secretaría General N° 006-2025-PCM/SGP.',
      url: 'https://www.gob.pe/institucion/pcm/normas-legales/6931638-006-2025-pcm-sgp',
      externo: true,
      icono: '📋'
    },
    {
      id: 'manual-mac-express',
      titulo: 'Manual MAC Express',
      tipo: 'Manual',
      fecha: '2024-01-01',
      descripcion: 'Guía completa de implementación y operación de los módulos MAC Express en municipalidades. Incluye procedimientos, requisitos técnicos y estándares de atención al ciudadano.',
      url: 'https://drive.google.com/file/d/1zcUQFum0VncJOCf9EknkF1A6gBELzsSs/view',
      externo: true,
      icono: '📘'
    }
  ]
};
// ── PASAPORTE (Timeline, Requisitos, FAQ) ──────────────────
const procesosPasaporte = [
  { paso: 1, titulo: 'Paga en el Banco de la Nación', desc: 'Realiza el pago del arancel con código 06512. Guarda el voucher original.', icono: '🏦' },
  { paso: 2, titulo: 'Reserva tu cita en línea', desc: 'Ingresa a citaspasaporte.migraciones.gob.pe y programa tu cita en MAC Chimbote.', icono: '🖥️' },
  { paso: 3, titulo: 'Preséntate en MAC Chimbote', desc: 'Acude al módulo de Migraciones en Megaplaza Nivel 2 con todos tus documentos.', icono: '🏢' },
  { paso: 4, titulo: 'Registro biométrico', desc: 'El personal tomará tus huellas digitales, fotografía y firma digital.', icono: '👆' },
  { paso: 5, titulo: 'Recibe tu pasaporte', desc: 'Tu pasaporte es emitido en el momento. ¡Listo para viajar!', icono: '✈️' }
];

const requisitosPasaporte = [
  'DNI original vigente',
  'Voucher de pago del Banco de la Nación (código 06512)',
  'Para menores: partida de nacimiento original',
  'Para menores: DNI de ambos padres',
  'Para menores: presencia física de ambos padres o tutor legal',
  'Pasaporte anterior (si ya tuviste uno)',
  'Cita previa registrada en el sistema de Migraciones'
];

const faqPasaporte = [
  { p: '¿Necesito cita previa?', r: 'Sí, es obligatorio reservar cita previa en el portal de Migraciones antes de acudir a MAC Chimbote.' },
  { p: '¿Puedo tramitar el pasaporte de mi hijo sin el otro padre?', r: 'No. Para menores de edad se requiere la presencia de ambos padres o, en casos especiales, una autorización notarial del padre ausente.' },
  { p: '¿El pasaporte se entrega en el momento?', r: 'Sí, el pasaporte electrónico biométrico se entrega inmediatamente después de completar el proceso en ventanilla.' },
  { p: '¿Qué pasa si mi DNI está vencido?', r: 'Debes renovar primero tu DNI en el módulo de RENIEC dentro de MAC Chimbote antes de tramitar el pasaporte.' },
  { p: '¿Puedo pagar con tarjeta en el Banco de la Nación?', r: 'Depende de la agencia. Se recomienda llevar efectivo. También puedes pagar en Agentes BN o plataforma web del Banco de la Nación.' }
];

const heroText = 'Tramites simples. Atencion rapida. Chimbote.';
const heroTarget = document.getElementById('heroTypewriter');

// ID del video de YouTube para la sección Sobre Nosotros
const YOUTUBE_VIDEO_ID = 'ulPsCt7tXG8';
let youTubePlayer = null;
let youTubeApiLoaded = false;

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

function initHeroBackgroundVideo() {
  const heroVideo = document.getElementById('heroBackgroundVideo');
  const heroSection = document.getElementById('inicio');
  if (!heroVideo || !heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        heroVideo.currentTime = 0;
        heroVideo.play().catch(() => {});
      } else {
        heroVideo.pause();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(heroSection);
}

function loadYouTubeIframeAPI() {
  if (youTubeApiLoaded) return;
  youTubeApiLoaded = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.async = true;
  document.head.appendChild(tag);
}

// Lógica de reproducción/pausa del video de Sobre Nosotros
window.onYouTubeIframeAPIReady = function() {
  const container = document.getElementById('sobreUsVideo');
  if (!container) return;

  youTubePlayer = new YT.Player('sobreUsVideo', {
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      disablekb: 0
    },
    events: {
      onReady() {
        const toggleButton = document.getElementById('sobreUsVideoToggle');
        if (toggleButton) {
          toggleButton.addEventListener('click', toggleYouTubeVideoPlayback);
        }
      }
    }
  });
};

function toggleYouTubeVideoPlayback() {
  if (!youTubePlayer || typeof youTubePlayer.getPlayerState !== 'function') return;

  const state = youTubePlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
    youTubePlayer.pauseVideo();
  } else {
    youTubePlayer.playVideo();
  }
}

function pauseYouTubeVideoIfHidden(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && youTubePlayer && typeof youTubePlayer.getPlayerState === 'function') {
      const state = youTubePlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        youTubePlayer.pauseVideo();
      }
    }
  });
}

function initYouTubeSection() {
  loadYouTubeIframeAPI();
  const aboutSection = document.getElementById('sobre-nosotros');
  const videoWrapper = document.getElementById('sobreUsVideoWrapper');
  if (!aboutSection || !videoWrapper) return;

  const observer = new IntersectionObserver(pauseYouTubeVideoIfHidden, {
    threshold: 0.3
  });
  observer.observe(aboutSection);
  observer.observe(videoWrapper);
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
  initStatsAnimation();
  initYouTubeSection();
  initHeroBackgroundVideo();

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


// ── NOTICIAS PAGE ─────────────────────────────────────────
const NOTICIAS_CATEGORIAS = ['Todas', 'Institucional', 'MAC Express'];

function initNoticiasPage() {
  renderFiltrosNoticias();
  renderNoticias('Todas');
}

function renderFiltrosNoticias() {
  const container = document.getElementById('noticiasFilters');
  if (!container) return;
  container.innerHTML = NOTICIAS_CATEGORIAS.map(cat => `
    <button class="filter-btn ${cat === 'Todas' ? 'active' : ''}" data-categoria="${cat}">
      ${cat}
    </button>
  `).join('');

  container.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderNoticias(btn.dataset.categoria);
  });
}

function renderNoticias(categoriaActiva) {
  const grid = document.getElementById('noticiasGrid');
  if (!grid) return;

  const filtradas = categoriaActiva === 'Todas'
    ? noticiasMAC
    : noticiasMAC.filter(n => n.categoria === categoriaActiva);

  grid.innerHTML = filtradas.map(n => `
    <article class="noticia-card card">
      <div class="noticia-card__img-wrap">
        <img src="${n.imagen}" alt="${n.titulo}" loading="lazy"
             onerror="this.src='images/noticia-placeholder.jpg'">
        <span class="noticia-card__badge">${n.categoria}</span>
      </div>
      <div class="noticia-card__body">
        <time class="noticia-card__fecha" datetime="${n.fecha}">
          ${new Date(n.fecha + 'T00:00:00').toLocaleDateString('es-PE', { day:'numeric', month:'long', year:'numeric' })}
        </time>
        <h3 class="noticia-card__titulo">${n.titulo}</h3>
        <p class="noticia-card__resumen">${n.resumen}</p>
        <a href="${n.url}" target="_blank" rel="noopener" class="btn btn--outline btn--sm">
          Leer más →
        </a>
      </div>
    </article>
  `).join('');
}

// ── PUBLICACIONES PAGE ──────────────────────────────────────
function initPublicacionesPage() {
  renderPublicaciones();
}

function renderPublicaciones() {
  const container = document.getElementById('publicacionesList');
  if (!container) return;

  const { boletinesAnuales, boletinesMensuales, manuales } = publicacionesMAC;

  container.innerHTML = `
    <!-- SECCIÓN: MANUALES -->
    <div class="pub-section">
      <div class="pub-section__header">
        <div class="pub-section__icon">📚</div>
        <div>
          <h2 class="pub-section__title">Manuales Oficiales</h2>
          <p class="pub-section__desc">Documentos normativos y guías operativas del Centro MAC</p>
        </div>
      </div>
      <div class="pub-grid pub-grid--manuales">
        ${manuales.map(m => `
          <a href="${m.url}" target="_blank" rel="noopener" class="pub-card pub-card--manual">
            <div class="pub-card__icon-wrap">${m.icono}</div>
            <div class="pub-card__body">
              <span class="pub-badge pub-badge--manual">Manual Oficial</span>
              <h3 class="pub-card__titulo">${m.titulo}</h3>
              <p class="pub-card__desc">${m.descripcion}</p>
            </div>
            <div class="pub-card__cta">Ver documento <span>→</span></div>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- SECCIÓN: BOLETINES MENSUALES -->
    <div class="pub-section">
      <div class="pub-section__header">
        <div class="pub-section__icon">📊</div>
        <div>
          <h2 class="pub-section__title">Boletines Mensuales 2025</h2>
          <p class="pub-section__desc">Estadísticas e indicadores de atención por mes</p>
        </div>
      </div>
      <div class="pub-grid pub-grid--mensual">
        ${boletinesMensuales.map(b => `
          <a href="${b.url}" target="_blank" rel="noopener" class="pub-card pub-card--mensual">
            <div class="pub-card__mes-label">${b.mes}</div>
            <div class="pub-card__body">
              <span class="pub-badge pub-badge--mensual">Boletín Mensual</span>
              <h3 class="pub-card__titulo">${b.titulo}</h3>
              <p class="pub-card__desc">${b.descripcion}</p>
            </div>
            <div class="pub-card__cta">Descargar PDF <span>↓</span></div>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- SECCIÓN: BOLETINES ANUALES -->
    <div class="pub-section">
      <div class="pub-section__header">
        <div class="pub-section__icon">📅</div>
        <div>
          <h2 class="pub-section__title">Boletines Anuales</h2>
          <p class="pub-section__desc">Memorias de gestión e informes anuales 2022 – 2025</p>
        </div>
      </div>
      <div class="pub-grid pub-grid--anual">
        ${boletinesAnuales.map(b => `
          <a href="${b.url}" target="_blank" rel="noopener" class="pub-card pub-card--anual">
            <div class="pub-card__año-label">${b.año}</div>
            <div class="pub-card__body">
              <span class="pub-badge pub-badge--anual">Boletín Anual</span>
              <h3 class="pub-card__titulo">${b.titulo}</h3>
              <p class="pub-card__desc">${b.descripcion}</p>
            </div>
            <div class="pub-card__cta">Descargar PDF <span>↓</span></div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// ── PASAPORTE PAGE ─────────────────────────────────────────
function initPasaportePage() {
  renderProcesoPasaporte();
  renderRequisitosPasaporte();
  renderFAQPasaporte();
}

function renderProcesoPasaporte() {
  const container = document.getElementById('procesoTimeline');
  if (!container) return;

  container.innerHTML = procesosPasaporte.map(proc => `
    <li class="timeline-item">
      <div class="timeline-marker">
        <div class="timeline-icon">${proc.icono}</div>
        <div class="timeline-step">${proc.paso}</div>
      </div>
      <div class="timeline-content">
        <h3>${proc.titulo}</h3>
        <p>${proc.desc}</p>
      </div>
    </li>
  `).join('');
}

function renderRequisitosPasaporte() {
  const container = document.getElementById('requisitosChecklist');
  if (!container) return;

  container.innerHTML = requisitosPasaporte.map((req, idx) => `
    <li class="checklist-item">
      <input type="checkbox" id="req${idx}" class="checklist-input">
      <label for="req${idx}" class="checklist-label">${req}</label>
    </li>
  `).join('');
}

function renderFAQPasaporte() {
  const container = document.getElementById('faqPasaporte');
  if (!container) return;

  container.innerHTML = faqPasaporte.map((item, idx) => `
    <details class="accordion-item">
      <summary class="accordion-summary">${item.p}</summary>
      <div class="accordion-content">
        <p>${item.r}</p>
      </div>
    </details>
  `).join('');
}

// ── SERVICIOS FULL PAGE ─────────────────────────────────────
function initServiciosPage() {
  renderServiciosFull();
}

function renderServiciosFull() {
  const container = document.getElementById('serviciosGridFull');
  if (!container) return;

  container.innerHTML = serviciosMAC.map(svc => `
    <div class="servicio-card card">
      <a href="${svc.pdf}" class="servicio-card__link" download>
        <div class="servicio-card__img">
          <img src="${svc.img}" alt="${svc.name}" loading="lazy"
               onerror="this.src='images/placeholder.png'">
        </div>
        <div class="servicio-card__content">
          <h3>${svc.name}</h3>
          <p>${svc.description}</p>
          <span class="servicio-card__cta">Descargar ficha PDF →</span>
        </div>
      </a>
    </div>
  `).join('');
}

// ── HOME PAGE INIT ──────────────────────────────────────────
function initHomePage() {
  initStatsAnimation();
  // Inicializar el panel de atención ciudadana (dashboard) que vive en inicio
  initDashboardPage();
}

function initStatsAnimation() {
  const statsSection = document.querySelector('.stats-strip');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsSection.classList.contains('animated')) {
        statsSection.classList.add('animated');
        // Animar solo los stat-number del strip
        const counters = statsSection.querySelectorAll('.stat-number');
        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        counters.forEach(el => {
          const target = parseInt(el.dataset.count, 10) || 0;
          const duration = 2000;
          const start = performance.now();
          const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * easeOutExpo(progress)).toLocaleString('es-PE');
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

// ── DASHBOARD PAGE INIT ─────────────────────────────────────
let dashboardInitialized = false;
function initDashboardPage() {
  if (dashboardInitialized) return;
  dashboardInitialized = true;
  animateCounters();
  initCharts();
}

// También inicializar dashboard cuando se carga la página de inicio
function initHomeDashboard() {
  initDashboardPage();
}

// ── RESERVAS PAGE INIT ──────────────────────────────────────
let reservasInitialized = false;
function initReservasPage() {
  if (reservasInitialized) return;
  reservasInitialized = true;
  initReservasSystem();
}

document.addEventListener('DOMContentLoaded', init);