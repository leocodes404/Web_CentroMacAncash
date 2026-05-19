// Logica de interaccion y animaciones para la landing page
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');
const formNotice = document.getElementById('formNotice');

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

function handleScrollReveal() {
  const sections = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
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
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const valueElement = entry.target.closest('.kpi-value') || entry.target;
        const targetCount = Number(entry.target.dataset.count) || 0;
        let current = 0;
        const step = Math.max(1, Math.round(targetCount / 60));

        const countInterval = setInterval(() => {
          current += step;
          if (current >= targetCount) {
            current = targetCount;
            clearInterval(countInterval);
          }
          valueElement.textContent = current.toLocaleString('es-PE');
        }, 22);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach((counter) => observer.observe(counter));
}

function initCharts() {
  const barCanvas = document.getElementById('chartBar');
  const donutCanvas = document.getElementById('chartDonut');

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js no está disponible');
    return;
  }

  // Configuración global de Chart.js para tema oscuro
  Chart.defaults.color = 'rgba(255, 255, 255, 0.6)';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

  // Gráfico de barras: Atenciones mensuales
  if (barCanvas) {
    const barCtx = barCanvas.getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Atenciones',
          data: [5850, 6320, 6890, 7120, 7204],
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderRadius: 12,
          borderSkipped: false,
          maxBarThickness: 45,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
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
              color: 'rgba(255, 255, 255, 0.6)',
              font: { size: 12 }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: { size: 12 }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      }
    });
  }

  // Gráfico donut: Distribución por entidad
  if (donutCanvas) {
    const donutCtx = donutCanvas.getContext('2d');
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Banco Nación', 'RENIEC', 'EsSalud', 'DRTC', 'Migraciones', 'Otros'],
        datasets: [{
          data: [28, 25, 18, 15, 12, 2],
          backgroundColor: [
            '#3B82F6',
            '#6366F1',
            '#8B5CF6',
            '#EC4899',
            '#F59E0B',
            '#6B7280'
          ],
          borderColor: 'rgba(26, 26, 46, 0.8)',
          borderWidth: 3,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 },
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  formNotice.textContent = 'Gracias por escribirnos. Pronto nos comunicaremos contigo.';
  event.target.reset();
}

function init() {
  typeWriter(heroText, heroTarget);
  handleScrollReveal();
  handleNavbarScroll();
  animateCounters();
  initCharts();

  navToggle.addEventListener('click', toggleMenu);
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', handleNavbarScroll);
  contactForm.addEventListener('submit', handleFormSubmit);
}

document.addEventListener('DOMContentLoaded', init);
