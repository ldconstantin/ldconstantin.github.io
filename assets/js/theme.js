// Academic Pages' system preference and saved light/dark selection pattern.
(() => {
  'use strict';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try {
    preference = localStorage.getItem('theme');
  } catch (_) {
    // Theme switching also works when browser storage is unavailable.
  }
  if (preference !== 'light' && preference !== 'dark') preference = null;

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // Keep the selection for this page when storage is unavailable.
    }
  }

  function applyTheme() {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro';
      button.setAttribute('aria-label', button.title);
    }
  }

  // Run in the head so the first rendered frame uses the active theme.
  applyTheme();
  system.addEventListener('change', () => {
    if (!preference) applyTheme();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    applyTheme();
    if (button) {
      button.hidden = false;
      button.addEventListener('click', () => {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        save('theme', preference);
        applyTheme();
      });
    }
  });
})();
