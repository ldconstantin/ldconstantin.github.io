// A simpler, bilingual summary of existing academic content.
// The complete page remains the default and works without JavaScript.
(() => {
  const init = () => {
    const toggle = document.getElementById('easy-reading-toggle');
    const panel = document.getElementById('easy-reading-panel');
    const full = document.getElementById('full-reading-content');
    if (!toggle || !panel || !full) return;
    const controls = document.querySelector('[data-easy-reading-controls]');
    if (controls) controls.hidden = false;

    const preferenceKey = 'academic-easy-reading';
    const helper = document.getElementById('easy-reading-helper');

    function readPreference() {
      try { return window.localStorage.getItem(preferenceKey) === 'easy'; }
      catch (_) { return false; }
    }
    function storePreference(enabled) {
      try { window.localStorage.setItem(preferenceKey, enabled ? 'easy' : 'full'); }
      catch (_) { /* The control still works for this page. */ }
    }
    function setMode(enabled, moveFocus) {
      panel.hidden = !enabled;
      full.hidden = enabled;
      toggle.setAttribute('aria-pressed', String(enabled));
      if (helper) helper.textContent = enabled ? helper.dataset.active : helper.dataset.default;
      document.body.classList.toggle('easy-reading-active', enabled);
      if (moveFocus) {
        const heading = (enabled ? panel : full).querySelector('h1');
        if (heading) {
          if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
          heading.focus({preventScroll: true});
          heading.scrollIntoView({block: 'start', behavior: 'instant'});
        }
      }
    }
    toggle.addEventListener('click', () => {
      const enabled = toggle.getAttribute('aria-pressed') !== 'true';
      storePreference(enabled);
      setMode(enabled, true);
    });
    panel.querySelector('[data-easy-reading-full]')?.addEventListener('click', () => {
      storePreference(false);
      setMode(false, true);
    });
    setMode(readPreference(), false);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
