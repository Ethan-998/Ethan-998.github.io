/* ── Navbar scroll effect ─────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile hamburger ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Active nav link on scroll ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Fade-in on scroll ────────────────────────────────── */
const fadeTargets = [
  '.highlight-card',
  '.skill-group',
  '.timeline-card',
  '.project-card',
  '.edu-card',
  '.contact-card',
  '.contact-form-wrap',
  '.about-text',
  '.about-highlights',
  '.hero-content',
  '.hero-visual',
  '.hero-stats .stat',
  '.contact-intro',
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 80}ms`;
  });
});

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ── Phone CAPTCHA ────────────────────────────────────── */
// Number stored split so it's not a plain string in source
const _p = '__PHONE__'.split('-');
let _captchaAnswer = null;
let _revealed = false;

function openCaptcha() {
  if (_revealed) return;
  const a = Math.floor(Math.random() * 10) + 2;
  const b = Math.floor(Math.random() * 10) + 2;
  _captchaAnswer = a + b;
  document.getElementById('captchaQuestion').textContent = `${a}  +  ${b}  = ?`;
  document.getElementById('captchaInput').value = '';
  document.getElementById('captchaError').textContent = '';
  document.getElementById('captchaOverlay').classList.add('open');
  setTimeout(() => document.getElementById('captchaInput').focus(), 120);
}

function closeCaptcha(e) {
  if (e.target === document.getElementById('captchaOverlay')) closeCaptchaBtn();
}
function closeCaptchaBtn() {
  document.getElementById('captchaOverlay').classList.remove('open');
}

function checkCaptcha() {
  const val = parseInt(document.getElementById('captchaInput').value, 10);
  if (isNaN(val)) {
    document.getElementById('captchaError').textContent = 'Please enter a number.';
    return;
  }
  if (val !== _captchaAnswer) {
    document.getElementById('captchaError').textContent = 'Incorrect — give it another try.';
    document.getElementById('captchaInput').value = '';
    document.getElementById('captchaInput').focus();
    return;
  }
  // Correct — reveal number and convert card to a tel: link
  _revealed = true;
  closeCaptchaBtn();
  const num = _p.join('-');
  const card = document.getElementById('phoneCard');
  card.onclick = null;
  card.style.cursor = 'default';
  card.outerHTML = `<a href="tel:+1${_p.join('')}" class="contact-card">
    <div class="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    </div>
    <div>
      <p class="contact-label">Phone</p>
      <p class="contact-value">${num}</p>
    </div>
  </a>`;
}

/* ── Contact form (mailto fallback) ──────────────────── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
  const message = document.getElementById('message').value.trim();

  const body = `Hi Zitong,\n\n${message}\n\n— ${name} (${email})`;
  const mailto = `mailto:wang.zt@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const a = document.createElement('a');
  a.href = mailto;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  const note = document.getElementById('formNote');
  note.textContent = 'Opening your email client...';
  setTimeout(() => { note.textContent = ''; }, 3000);
});

/* ── Smooth scroll for all anchor links ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
