const whatsapp = 'https://wa.me/353831110323?text=';
document.querySelectorAll('[data-order], [data-product]').forEach(link => {
  const message = link.dataset.product ? `Hi Dona Gulla! I'd like to order ${link.dataset.product}. Could you let me know today's availability and the order details?` : "Hi Dona Gulla! I'd like to place an order. Could you help me with today's menu and availability?";
  link.href = whatsapp + encodeURIComponent(message); link.target = '_blank'; link.rel = 'noopener noreferrer';
});
const filters = document.querySelectorAll('[data-filter]');
const products = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => { const selected = filter === button; filter.classList.toggle('active', selected); filter.setAttribute('aria-pressed', String(selected)); });
  let count = 0;
  products.forEach(product => { product.hidden = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter; if (!product.hidden) { count++; product.classList.add('is-visible'); } });
  document.querySelector('#menu-count').textContent = `${count} choices`;
}));
const menuDialog = document.querySelector('#menu-dialog');
const openMenu = document.querySelector('#open-menu');
openMenu.addEventListener('click', () => { menuDialog.showModal(); document.body.classList.add('modal-open'); });
document.querySelector('#close-menu').addEventListener('click', () => menuDialog.close());
menuDialog.addEventListener('click', event => { const rect = menuDialog.getBoundingClientRect(); if (event.target === menuDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) menuDialog.close(); });
menuDialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); openMenu.focus(); });
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeNav() { mobileNav.hidden = true; navToggle.setAttribute('aria-expanded', 'false'); }
navToggle.addEventListener('click', () => { const expanded = navToggle.getAttribute('aria-expanded') === 'true'; mobileNav.hidden = expanded; navToggle.setAttribute('aria-expanded', String(!expanded)); });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeNav(); navToggle.focus(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
// The font supplies the drawn shapes; small offsets loosen the headline's baseline.
document.querySelectorAll('[data-letters]').forEach(heading => {
  const text = heading.textContent; heading.setAttribute('aria-label', text);
  const fragment = document.createDocumentFragment();
  [...text].forEach((character, index) => { const span = document.createElement('span'); span.className = 'letter'; span.textContent = character === ' ' ? '\u00a0' : character; span.setAttribute('aria-hidden', 'true'); span.style.setProperty('--i', index); span.style.setProperty('--letter-r', `${[-2,1,-1,2,0,-2,1][index % 7]}deg`); span.style.setProperty('--letter-y', `${[0,2,-1,1,-2][index % 5]}px`); fragment.appendChild(span); });
  heading.replaceChildren(fragment);
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } }); }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach((element, index) => { element.classList.add('reveal-ready'); element.style.setProperty('--delay', element.classList.contains('product') ? `${index % 4 * 65}ms` : '0ms'); reveal.observe(element); });
  const floating = [...document.querySelectorAll('[data-parallax]')]; let scheduled = false;
  function renderScroll() { floating.forEach(element => { const rect = element.closest('section').getBoundingClientRect(); const distance = window.innerHeight / 2 - (rect.top + rect.height / 2); const offset = reducedMotion.matches ? 0 : Math.max(-35, Math.min(35, distance * Number(element.dataset.parallax))); element.style.setProperty('--parallax', `${offset}px`); }); scheduled = false; }
  function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(renderScroll); } }
  window.addEventListener('scroll', scheduleScroll, { passive: true }); window.addEventListener('resize', scheduleScroll);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('is-visible')); scheduleScroll(); });
  renderScroll();
}
