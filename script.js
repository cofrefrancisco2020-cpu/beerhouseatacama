const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
};

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

const viewport = document.querySelector('#product-viewport');
const cards = [...document.querySelectorAll('.product-card')];
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const filter = button.dataset.filter;
    cards.forEach(card => { card.hidden = filter !== 'todos' && card.dataset.category !== filter; });
    viewport.scrollTo({ left: 0, behavior: 'smooth' });
  });
});

function slide(direction) {
  const card = cards.find(item => !item.hidden);
  if (!card) return;
  const gap = parseFloat(getComputedStyle(document.querySelector('.product-track')).gap) || 0;
  viewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
}
document.querySelector('#prev-card').addEventListener('click', () => slide(-1));
document.querySelector('#next-card').addEventListener('click', () => slide(1));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.11 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

document.querySelector('#year').textContent = new Date().getFullYear();

const instagramPopup = document.querySelector('#instagram-popup');
const instagramPopupClose = instagramPopup.querySelector('.instagram-popup-close');
const instagramPopupLink = instagramPopup.querySelector('.instagram-popup-image');
let focusBeforeInstagramPopup = null;

function closeInstagramPopup() {
  if (instagramPopup.hidden) return;
  instagramPopup.hidden = true;
  document.body.classList.remove('instagram-popup-open');
  if (focusBeforeInstagramPopup instanceof HTMLElement) focusBeforeInstagramPopup.focus({ preventScroll: true });
}

function openInstagramPopup() {
  if (!instagramPopup.hidden) return;
  focusBeforeInstagramPopup = document.activeElement;
  instagramPopup.hidden = false;
  document.body.classList.add('instagram-popup-open');
  instagramPopupClose.focus({ preventScroll: true });
}

instagramPopupClose.addEventListener('click', closeInstagramPopup);
instagramPopupLink.addEventListener('click', closeInstagramPopup);
instagramPopup.addEventListener('click', event => {
  if (event.target === instagramPopup) closeInstagramPopup();
});
document.addEventListener('keydown', event => {
  if (instagramPopup.hidden) return;
  if (event.key === 'Escape') closeInstagramPopup();
  if (event.key !== 'Tab') return;
  if (event.shiftKey && document.activeElement === instagramPopupClose) {
    event.preventDefault();
    instagramPopupLink.focus();
  } else if (!event.shiftKey && document.activeElement === instagramPopupLink) {
    event.preventDefault();
    instagramPopupClose.focus();
  }
});

if (document.readyState === 'complete') {
  window.setTimeout(openInstagramPopup, 5000);
} else {
  window.addEventListener('load', () => window.setTimeout(openInstagramPopup, 5000), { once: true });
}
