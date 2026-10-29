// Keep the page-section navigation in sync with fragment navigation.
(() => {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  function markSection() {
    for (const link of nav.querySelectorAll('a[href^="#"]')) {
      const current = link.hash === window.location.hash;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      if (!current) continue;
      for (let parent = link.parentElement; parent && parent !== nav; parent = parent.parentElement) {
        if (!parent.classList.contains('local-nav-parent')) continue;
        parent.classList.add('active');
        parent.querySelector(':scope > .nav-list-expander').setAttribute('aria-expanded', 'true');
      }
    }
  }
  nav.addEventListener('click', event => {
    if (!event.target.closest('a[href^="#"]')) return;
    const menu = document.getElementById('menu-button');
    if (menu?.getAttribute('aria-expanded') === 'true') menu.click();
  });
  window.addEventListener('hashchange', markSection);
  markSection();
})();
