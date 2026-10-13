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

const tileSetters = new Map();
document.querySelectorAll('.tile-toggle').forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const label = btn.querySelector('.tile-toggle-label');
  const setOpen = (open) => {
    panel.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Hide details' : 'Show details';
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  tileSetters.set(btn.closest('article').id, setOpen);
});

// A link to a case card (e.g. from the impact row) opens that card.
const openCase = (id) => tileSetters.get(id)?.(true);
document.querySelectorAll('a[href^="#case-"]').forEach((a) => {
  a.addEventListener('click', () => openCase(a.getAttribute('href').slice(1)));
});
if (location.hash.startsWith('#case-')) openCase(location.hash.slice(1));

// Load the YouTube player only when clicked, so the iframe doesn't slow the first page load.
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
