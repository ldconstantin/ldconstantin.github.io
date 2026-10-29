// Remember an explicit language choice; links still work without browser storage.
document.addEventListener('click', event => {
  const link = event.target.closest('.language-option[data-locale]');
  if (!link) return;
  try {
    localStorage.setItem('language', link.dataset.locale);
  } catch (_) {
    // Navigation remains available when storage is blocked.
  }
});
