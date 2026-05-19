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
  const counters = document.querySelectorAll('.kpi-card');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const valueElement = entry.target.querySelector('.kpi-card__value');
        const targetCount = Number(entry.target.dataset.count) || 0;
        let current = 0;
        const step = Math.max(1, Math.round(targetCount / 60));

        const countInterval = setInterval(() => {
          current += step;
          if (current >= targetCount) {
            current = targetCount;
            clearInterval(countInterval);
          }
          valueElement.textContent = current;
        }, 22);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach((counter) => observer.observe(counter));
}

function initCharts() {
  const barCanvas = document.getElementById('chartBar');
  const lineCanvas = document.getElementById('chartLine');

  if (!barCanvas || !lineCanvas || typeof Chart === 'undefined') {
    return;
  }

  new Chart(barCanvas, {
    type: 'bar',
    data: {
      labels: ['Banco de la Nacion', 'DRTC', 'DRTPE', 'EsSalud', 'Reniec', 'ONP', 'Migraciones', 'Poder Judicial', 'Sunafil'],
      datasets: [{
        label: 'Atenciones',
        data: [145, 120, 95, 110, 90, 80, 75, 65, 55],
        backgroundColor: 'rgba(0, 48, 130, 0.75)',
        borderRadius: 12,
        maxBarThickness: 32,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} atenciones` } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 30 }
        }
      }
    }
  });

  new Chart(lineCanvas, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6', 'Semana 7', 'Semana 8'],
      datasets: [{
        label: 'Tendencia',
        data: [1120, 1180, 1250, 1320, 1390, 1440, 1485, 1530],
        borderColor: '#E8001C',
        backgroundColor: 'rgba(232, 0, 28, 0.18)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#E8001C'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: 1000,
          suggestedMax: 1600
        }
      }
    }
  });
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
