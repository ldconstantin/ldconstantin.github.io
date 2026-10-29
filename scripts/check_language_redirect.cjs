// Run with node scripts/check_language_redirect.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync('assets/js/language-redirect.js', 'utf8');
function redirect(languages, pathname = '/', errorPage = false, baseurl = '', query = '', hash = '', saved = null, options = {}) {
  let target;
  const suffix = errorPage ? '/404.html' : '/';
  const href = 'https://example.test' + pathname + query + hash;
  vm.runInNewContext(source, {
    URL, URLSearchParams, navigator: {languages},
    localStorage: {getItem() {if (options.blocked) throw Error('Storage blocked'); return saved;}},
    document: {
      currentScript: {dataset: {
        enUrl: baseurl + '/en' + suffix, ptUrl: baseurl + suffix,
        baseurl, errorPage: String(errorPage), ...options.dataset,
      }},
      getElementById() {return {textContent: JSON.stringify(options.sections || {})};},
    },
    window: {location: {href, origin: 'https://example.test', pathname, search: query, hash, replace(url) {target = url;}}},
  });
  return target;
}

test('root selection honors saved choices, then supported browser languages', () => {
  assert.equal(redirect(['en-US', 'pt-BR']), '/en/');
  assert.equal(redirect(['pt-BR', 'en-US']), undefined);
  assert.equal(redirect(['fr-FR']), '/en/');
  assert.equal(redirect([]), '/en/');
  assert.equal(redirect(['fr', 'pt-PT']), undefined);
  assert.equal(redirect(['en'], '/', false, '', '', '', 'pt'), undefined);
  assert.equal(redirect(['pt'], '/', false, '', '', '', 'en'), '/en/');
  assert.equal(redirect(['pt'], '/', false, '', '', '', 'invalid'), undefined);
  assert.equal(redirect(['en'], '/en/'), undefined);
  assert.equal(redirect(['pt'], '/', false, '', '?q=a%20b', '#foo%2Fbar'), undefined);
});
test('explicit Portuguese choice survives unavailable storage and conflicting preferences', () => {
  assert.equal(redirect(['en'], '/', false, '', '?lang=pt', '', 'en', {blocked: true}), undefined);
  assert.equal(redirect(['pt'], '/', false, '', '?lang=en', '', 'pt'), '/en/?lang=en');
  assert.equal(redirect(['pt'], '/', false, '', '?lang=invalid'), undefined);
});
test('Portuguese aliases carry explicit intent to the homepage', () => {
  assert.equal(redirect(['en'], '/pt/', false, '', '', '', 'en', {
    dataset: {locale: 'pt', ptUrl: '/?lang=pt', enUrl: '/?lang=pt'},
  }), '/?lang=pt');
});
test('legacy redirects translate fragments and preserve query parameters', () => {
  const sections = {'data-structures-iii': 'estruturas-de-dados-iii'};
  assert.equal(redirect(['en'], '/teaching/', false, '', '?q=test', '#estruturas-de-dados-iii', null, {
    dataset: {enUrl: '/en/teaching/', ptUrl: '/ensino/'}, sections,
  }), '/en/teaching/?q=test#data-structures-iii');
  assert.equal(redirect(['pt'], '/teaching/', false, '/project', '?q=test', '#data-structures-iii', null, {
    dataset: {enUrl: '/project/en/teaching/', ptUrl: '/project/ensino/'}, sections,
  }), '/project/ensino/?q=test#estruturas-de-dados-iii');
  assert.equal(redirect(['en'], '/', false, '', '', '#forma%C3%A7%C3%A3o-acad%C3%AAmica', null, {
    sections: {education: 'formação-acadêmica'},
  }), '/en/#education');
  assert.equal(redirect(['en'], '/', false, '', '', '#unknown'), '/en/#unknown');
  assert.equal(redirect(['en'], '/', false, '', '', '#bad%'), '/en/#bad%');
});
test('redirect destination intent wins without dropping unrelated or repeated query parameters', () => {
  assert.equal(redirect(['en'], '/curriculo/', false, '', '?lang=en&q=one&q=two', '#education', null, {
    dataset: {locale: 'pt', ptUrl: '/?lang=pt', enUrl: '/?lang=pt'},
    sections: {education: 'formação-acadêmica'},
  }), '/?lang=pt&q=one&q=two#forma%C3%A7%C3%A3o-acad%C3%AAmica');
});
test('404 language follows the requested path and supports baseurl', () => {
  assert.equal(redirect(['en'], '/pt/missing', true), undefined);
  assert.equal(redirect(['pt'], '/en/missing', true), '/en/404.html');
  assert.equal(redirect(['en'], '/missing', true), undefined);
  assert.equal(redirect(['pt'], '/project/en/missing', true, '/project'), '/project/en/404.html');
  assert.equal(redirect(['pt'], '/en/missing', true, '', '', '', 'pt'), '/en/404.html');
  assert.equal(redirect(['pt'], '/', false, '/project', '?q=test', '#section'), '/project/?q=test#section');
});
