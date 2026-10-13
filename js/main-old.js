document.getElementById('year').textContent = new Date().getFullYear();

const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const audienceBtns = document.querySelectorAll('.toggle-btn');
audienceBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const audience = btn.dataset.audience;
    audienceBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-audience-text]').forEach((el) => {
      el.hidden = el.dataset.audienceText !== audience;
    });
    document.querySelectorAll('[data-audience-cta]').forEach((el) => {
      el.hidden = el.dataset.audienceCta !== audience;
    });
  });
});

// Load the YouTube player only when clicked, so three iframes don't slow the first page load.
document.querySelectorAll('.yt').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const frame = document.createElement('div');
    frame.className = 'yt-frame';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.yt}?autoplay=1`;
    iframe.title = link.getAttribute('aria-label').replace(/^Play: /, '');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    link.replaceWith(frame);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
