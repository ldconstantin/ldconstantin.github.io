// Keep the theme's keyboard-selected result visible in its result panel.
(() => {
  'use strict';
  const results = document.getElementById('search-results');
  if (!results) return;

  new MutationObserver(() => {
    const empty = results.querySelector('.search-no-result');
    if (empty && empty.textContent === 'No results found') {
      empty.textContent = 'Não encontrei resultados. Tente outra palavra.';
    }

    const active = results.querySelector('.search-result.active');
    if (!active) return;
    const item = active.getBoundingClientRect();
    const top = results.getBoundingClientRect().top + results.clientTop;
    const bottom = top + results.clientHeight;
    if (item.top < top) results.scrollTop += item.top - top;
    else if (item.bottom > bottom) results.scrollTop += item.bottom - bottom;
  }).observe(results, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
})();
