// Use browser language preferences only at URLs without an explicit locale.
(() => {
  const script = document.currentScript;
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  let locale = preferences.map(language => language.toLowerCase().split('-')[0])
    .find(language => language === 'pt' || language === 'en') || 'en';
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'pt' || saved === 'en') locale = saved;
  } catch (_) {
    // Fall back to browser preferences when storage is blocked.
  }
  const explicit = new URLSearchParams(window.location.search).get('lang');
  if (explicit === 'pt' || explicit === 'en') locale = explicit;
  if (script.dataset.locale) locale = script.dataset.locale;
  if (script.dataset.errorPage === 'true') {
    const path = window.location.pathname.slice((script.dataset.baseurl || '').length);
    const prefix = path.split('/')[1];
    locale = prefix === 'en' ? 'en' : 'pt';
    if (locale === 'pt') return;
  }
  const target = new URL(script.dataset[locale === 'pt' ? 'ptUrl' : 'enUrl'], window.location.href);
  if (target.search) {
    const query = new URLSearchParams(window.location.search);
    for (const [name, value] of target.searchParams) query.set(name, value);
    target.search = query.toString();
  } else target.search = window.location.search;
  let fragment = window.location.hash.slice(1);
  try { fragment = decodeURIComponent(fragment); } catch (_) { /* Keep malformed fragments unchanged. */ }
  const sections = JSON.parse(document.getElementById('language-section-map')?.textContent || '{}') || {};
  const translated = locale === 'pt' ? sections[fragment] || fragment
    : Object.keys(sections).find(key => sections[key] === fragment) || fragment;
  target.hash = translated === fragment ? window.location.hash : translated;
  const destination = target.pathname + target.search + target.hash;
  if (destination !== window.location.pathname + window.location.search + window.location.hash) {
    window.location.replace(destination);
  }
})();
