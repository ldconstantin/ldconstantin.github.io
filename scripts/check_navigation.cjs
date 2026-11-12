// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
const assert = require('node:assert/strict');
const {test, before, after} = require('node:test');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = (process.env.SITE_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
let browser;
before(async () => {
  const deadline = Date.now() + 30000;
  let ready = false;
  while (!ready && Date.now() < deadline) {
    try {ready = (await fetch(base + '/', {signal: AbortSignal.timeout(1000)})).ok;} catch (_) { /* Preview is starting. */ }
    if (!ready) await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert.ok(ready, 'Local preview did not become ready within 30 seconds');
  browser = await chromium.launch({headless: true,
    ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}),
    args: ['--no-sandbox'],
  });
});
after(async () => {await browser?.close();});
async function open(t, locale = 'en-US', blocked = false, width = 1280) {
  const context = await browser.newContext({locale, viewport: {width, height: 900}, reducedMotion: 'reduce'});
  t.after(() => context.close());
  if (blocked) await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {get() {throw new DOMException('Blocked', 'SecurityError');}});
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  return page;
}
async function visit(page, path) {await page.goto(base + path, {waitUntil: 'domcontentloaded'});}

test('Portuguese home, CV and legacy entries retain their language without browser storage', async t => {
  const page = await open(t, 'en-US', true);
  for (const path of ['/?lang=pt', '/curriculo/', '/pt/', '/pt/cv/']) {
    await visit(page, path);
    await page.waitForURL(base + '/?lang=pt');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  }
  await visit(page, '/en/');
  await page.locator('.language-option[data-locale="pt"]').click();
  await page.waitForURL(base + '/?lang=pt');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
});
test('Portuguese internal anchors and translated legacy bookmarks reach existing headings', async t => {
  const page = await open(t);
  await visit(page, '/extensao/');
  await page.getByRole('link', {name: 'experiência profissional', exact: true}).click();
  await page.waitForURL(base + '/?lang=pt#experiencia-profissional');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  assert.equal(await page.locator('#experiencia-profissional').count(), 1);
  await visit(page, '/teaching/#estruturas-de-dados-iii');
  await page.waitForURL(base + '/en/teaching/#data-structures-iii');
  assert.equal(await page.locator('#data-structures-iii').count(), 1);
});
test('sidebar headings navigate and course links remain nested under their semester', async t => {
  const page = await open(t, 'pt-BR');
  await visit(page, '/ensino/');
  await page.locator('#site-nav a[href="#disciplinas-atuais-titulo"]').click();
  await page.waitForURL(base + '/ensino/#disciplinas-atuais-titulo');
  await page.locator('#site-nav button[aria-controls="local-subnav-disciplinas-anteriores"]').click();
  const semester = page.locator('#site-nav li').filter({has: page.locator(':scope > a[href="#20261"]')}).first();
  assert.equal(await semester.locator(':scope > ul a[href="#introducao-a-linguagem-de-programacao-cpp"]').count(), 1);
  await semester.locator(':scope > button').click();
  await semester.locator('a[href="#introducao-a-linguagem-de-programacao-cpp"]').click();
  await page.waitForURL(base + '/ensino/#introducao-a-linguagem-de-programacao-cpp');
  await page.locator('#site-nav a[href="#introducao-a-linguagem-de-programacao-cpp"][aria-current="location"]').waitFor();
});
test('search finds visible course descriptions in each language', async t => {
  const page = await open(t);
  for (const [path, query, target] of [['/ensino/', 'sincronização', '/ensino/'], ['/en/teaching/', 'synchronization', '/en/teaching/']]) {
    await visit(page, path);
    await page.locator('pagefind-modal-trigger button:not([disabled])').click();
    await page.locator('pagefind-input input').fill(query);
    await page.locator(`pagefind-results a[href$="${target}"]`).waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('pagefind-modal-trigger button')?.getAttribute('aria-expanded') === 'false');
  }
});
test('homepage assets stay on the site and the portrait decodes', async t => {
  const page = await open(t);
  const externalRequests = [];
  page.on('request', r => {if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== new URL(base).origin) externalRequests.push(r.url());});
  await visit(page, '/en/');
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  const image = page.locator('.home-profile__photo');
  const data = await image.evaluate(async el => {await el.decode(); return {src: el.currentSrc, width: el.naturalWidth};});
  assert.equal(new URL(data.src).origin, new URL(base).origin);
  assert.ok(data.width >= 316);
  assert.deepEqual(externalRequests, []);
});
test('Portuguese search results retain homepage language with blocked storage', async t => {
  const page = await open(t, 'en-US', true);
  for (const input of ['mouse', 'keyboard']) {
    await visit(page, '/ensino/');
    await page.locator('pagefind-modal-trigger button:not([disabled])').click();
    await page.locator('pagefind-input input').fill('bacharel');
    const result = page.locator('pagefind-results a[href*="?lang=pt"]').first();
    await result.waitFor();
    if (input === 'mouse') await result.click();
    else await result.press('Enter');
    await page.waitForURL(base + '/?lang=pt');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  }
});
test('mobile menus, language controls and search fit in both themes', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  for (const theme of ['light', 'dark']) {
    await visit(page, '/ensino/');
    await page.evaluate(t => localStorage.setItem('theme', t), theme);
    await page.reload({waitUntil: 'domcontentloaded'});
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const headingStyles = await page.evaluate(() => ['h3', 'h4'].map(tag => {
      const style = getComputedStyle(document.querySelector('.home-course-list ' + tag));
      return {size: style.fontSize, color: style.color, margin: style.margin,
        lineHeight: style.lineHeight, weight: style.fontWeight, font: style.fontFamily};
    }));
    assert.deepEqual(headingStyles[0], headingStyles[1], 'Current and previous course headings should share their appearance');
    await page.locator('#menu-button').hover();
    const menuContrast = await page.locator('#menu-button').evaluate(button => {
      const style = getComputedStyle(button);
      const luminance = color => {
        const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(c => {
          c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      };
      const background = style.backgroundImage.match(/rgba?\([^)]+\)/)?.[0] || style.backgroundColor;
      const a = luminance(style.color), b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    assert.ok(menuContrast >= 3, `Menu icon contrast is ${menuContrast.toFixed(2)} in ${theme} mode`);
    await page.locator('#menu-button').click();
    await page.locator('#site-nav a[href="#disciplinas-atuais-titulo"]').click();
    assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'false');
    await page.locator('pagefind-modal-trigger button:not([disabled])').click();
    await page.locator('pagefind-input input').fill('algoritmos');
    await page.locator('pagefind-results a').first().waitFor();
    const box = await page.locator('pagefind-input input').boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= 375);
    await page.keyboard.press('Escape');
  }
});
test('missing URLs display the language selected by their path', async t => {
  const page = await open(t);
  await visit(page, '/missing-navigation-check/');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  await visit(page, '/en/missing-navigation-check/');
  await page.waitForURL(base + '/en/404.html');
  assert.equal(await page.locator('html').getAttribute('lang'), 'en-US');
});
test('language links and Portuguese CV fallbacks work without JavaScript', async t => {
  const context = await browser.newContext({locale: 'en-US', javaScriptEnabled: false});
  t.after(() => context.close());
  const page = await context.newPage();
  await visit(page, '/en/');
  await page.locator('.language-option[data-locale="pt"]').click();
  await page.waitForURL(base + '/?lang=pt');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  await visit(page, '/curriculo/');
  await page.waitForURL(base + '/?lang=pt');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
});

test('academic typography shrinks 10% while preserving the layout scale', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  await visit(page, '/ensino/');
  const sizes = await page.evaluate(() => {
    const reference = document.createElement('span');
    reference.style.fontSize = 'medium';
    document.body.append(reference);
    const browserDefault = Number.parseFloat(getComputedStyle(reference).fontSize);
    reference.remove();
    return {
      browserDefault,
      root: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
      body: Number.parseFloat(getComputedStyle(document.body).fontSize),
      content: Number.parseFloat(getComputedStyle(document.querySelector('.main-content')).fontSize),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  assert.ok(Math.abs(sizes.root / sizes.browserDefault - 1) < 0.01, JSON.stringify(sizes));
  assert.ok(Math.abs(sizes.content / sizes.root - 1.0125) < 0.01, JSON.stringify(sizes));
  assert.equal(sizes.overflow, false);
});

test('solution pages explain source in two languages and original problems open new tabs', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  await visit(page, '/codigos/');
  await page.locator('a.solution-title[href="/codigos/bee1500/"]').first().click();
  await page.waitForURL(base + '/codigos/bee1500/');
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  assert.match(await page.locator('h1').first().innerText(), /Consultas/);
  await page.waitForFunction(() => document.querySelector('pre.solution-source code')?.textContent?.includes('class SegmentTree'));
  const problem = page.locator('a[href="https://judge.beecrowd.com/pt/problems/view/1500"]').last();
  assert.equal(await problem.getAttribute('target'), '_blank');
  assert.match(await problem.getAttribute('rel'), /noopener/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.locator('.language-option[data-locale="en"]').click();
  await page.waitForURL(base + '/en/solutions/bee1500/');
  assert.equal(await page.locator('html').getAttribute('lang'), 'en-US');
  assert.match(await page.locator('h1').first().innerText(), /Lazy/);
  await page.waitForFunction(() => document.querySelector('pre.solution-source code')?.textContent?.includes('class SegmentTree'));
});

test('C++ / Python tabs switch source, retain keyboard support and source provenance', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  await visit(page, '/codigos/bee1500/');
  const cpp = page.getByRole('tab', {name: 'C++'});
  const py = page.getByRole('tab', {name: 'Python'});
  assert.equal(await cpp.getAttribute('aria-selected'), 'true');
  await page.waitForFunction(() => document.querySelector('[id$="-cpp-panel"] pre code')?.textContent?.includes('class SegmentTree'));
  await py.click();
  assert.equal(await py.getAttribute('aria-selected'), 'true');
  await page.waitForFunction(() => document.querySelector('[id$="-python-panel"] pre code')?.textContent?.includes('import sys'));
  assert.equal(await page.locator('[id$="-cpp-panel"]').isVisible(), false);
  assert.equal(await page.locator('[id$="-python-panel"]').isVisible(), true);
  await py.press('ArrowLeft');
  assert.equal(await cpp.getAttribute('aria-selected'), 'true');
  await cpp.press('End');
  assert.equal(await py.getAttribute('aria-selected'), 'true');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

  await page.locator('.language-option[data-locale="en"]').click();
  await page.waitForURL(base + '/en/solutions/bee1500/');
  assert.equal(await page.getByRole('tab', {name: 'C++'}).getAttribute('aria-selected'), 'true');
  await page.getByRole('tab', {name: 'Python'}).click();
  await page.waitForFunction(() => document.querySelector('[id$="-python-panel"] pre code')?.textContent?.includes('import sys'));
  assert.match(await page.locator('.solution-attribution').first().innerText(), /AI/);
});

test('two source files remain accessible without JavaScript', async t => {
  const context = await browser.newContext({locale: 'pt-BR', javaScriptEnabled: false});
  t.after(() => context.close());
  const page = await context.newPage();
  await visit(page, '/codigos/bee1103/');
  assert.ok((await page.locator('a[href="/assets/coding/icpc-solutions/beecrowd/bee1103.cpp"]').count()) >= 1);
  assert.ok((await page.locator('a[href="/assets/coding/icpc-solutions/beecrowd/bee1103.py"]').count()) >= 1);
});


test('Prism syntax highlighting works in both tabs and Mint themes', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['light', 'dark']) {
    await visit(page, '/codigos/bee1301/');
    await page.evaluate(value => localStorage.setItem('theme', value), theme);
    await page.reload({waitUntil: 'domcontentloaded'});
    const cpp = page.getByRole('tab', {name: 'C++'});
    const py = page.getByRole('tab', {name: 'Python'});
    assert.equal(await cpp.getAttribute('aria-selected'), 'true');
    await page.waitForFunction(() => document.querySelector('[id$="-cpp-panel"] .token.keyword'));
    assert.ok((await page.locator('[id$="-cpp-panel"] span.token').count()) > 5);
    assert.ok((await page.locator('a[href$="/revised/bee1301.cpp"]').count()) >= 1);
    assert.ok((await page.locator('a[href$="/beecrowd/bee1301.cpp"]').count()) >= 1);
    await py.click();
    await page.waitForFunction(() => document.querySelector('[id$="-python-panel"] .token.keyword'));
    assert.ok((await page.locator('[id$="-python-panel"] span.token').count()) > 5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator('[id$="-cpp-panel"]').isVisible(), false);
    assert.equal(await page.locator('[id$="-python-panel"]').isVisible(), true);
  }
  assert.deepEqual(errors, [], errors.join('\n'));
});

test('solution guide remains navigable at narrow viewport and enlarged text', async t => {
  const page = await open(t, 'pt-BR', false, 320);
  await visit(page, '/codigos/bee1500/');
  await page.waitForFunction(() => document.querySelector('[id$="-cpp-panel"] .token.keyword'));
  const layout = await page.evaluate(() => {
    const pre = document.querySelector('.solution-source');
    return {viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
      preViewport: pre.getBoundingClientRect().width, preScrollWidth: pre.scrollWidth};
  });
  if (layout.pageWidth > layout.viewport + 1) {
    layout.offenders = await page.evaluate(() => [...document.querySelectorAll('body *')]
      .map(el => ({tag: el.tagName, cls: String(el.className || '').slice(0, 75),
        right: Math.round(el.getBoundingClientRect().right), left: Math.round(el.getBoundingClientRect().left),
        width: Math.round(el.getBoundingClientRect().width),
        overflowX: getComputedStyle(el).overflowX}))
      .filter(el => el.right > innerWidth + 1).slice(0, 30));
  }
  assert.ok(layout.pageWidth <= layout.viewport + 1, JSON.stringify(layout));
  assert.ok(layout.preViewport <= layout.viewport, JSON.stringify(layout));
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const scaled = await page.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth, viewport: innerWidth
  }));
  assert.ok(scaled.pageWidth <= scaled.viewport + 1, JSON.stringify(scaled));
});

test('catalogue lists each solution once and omits empty subject groups', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  await visit(page, '/codigos/');
  assert.equal(await page.locator('a.solution-title').count(), 18);
  assert.equal(await page.locator('section.solutions-category').count(), 7);
  assert.equal(await page.locator('.solution-topic-nav a').count(), 7);
  assert.equal(await page.locator('#solutions-pesquisa').count(), 0);
  assert.equal(await page.locator('#solutions-avancados').count(), 0);
  assert.equal(await page.locator('a.solution-title[href="/codigos/kruskal/"]').count(), 1);
  await page.locator('.solution-topic-nav a[href="#solutions-grafos"]').click();
  await page.waitForURL(base + '/codigos/#solutions-grafos');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.getByRole('link', {name: /Kruskal/}).first().click();
  await page.waitForURL(base + '/codigos/kruskal/');
  assert.equal(await page.locator('.solution-related a').count(), 3);
  assert.ok((await page.locator('.solution-related a[href="/codigos/prim/"]').count()) >= 1);
});

test('copying the selected source preserves the original text and announces success', async t => {
  const page = await open(t, 'pt-BR', false, 375);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true, value: {writeText: async text => { window.__copiedSource = text; }}
    });
  });
  await visit(page, '/codigos/bee1500/');
  const cppButton = page.getByRole('button', {name: 'Copiar código C++'});
  await page.waitForFunction(() => document.querySelector('[id$="-cpp-panel"] [data-copy-code]')?.disabled === false);
  await cppButton.press('Enter');
  await page.waitForFunction(() => window.__copiedSource?.includes('class SegmentTree'));
  assert.match(await page.locator('[id$="-cpp-panel"] [role="status"]').innerText(), /Copiado/);
  assert.match(await page.evaluate(() => window.__copiedSource), /#include/);
  await page.getByRole('tab', {name: 'Python'}).click();
  const pyButton = page.getByRole('button', {name: 'Copiar código Python'});
  await page.waitForFunction(() => document.querySelector('[id$="-python-panel"] [data-copy-code]')?.disabled === false);
  await pyButton.click();
  await page.waitForFunction(() => window.__copiedSource?.includes('import sys'));
  assert.match(await page.locator('[id$="-python-panel"] [role="status"]').innerText(), /Copiado/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
});

test('academic specialization and proposed learning activity are consistent in PT and EN', async t => {
  const page = await open(t, 'pt-BR');
  await visit(page, '/?lang=pt');
  assert.match(await page.locator('main').innerText(), /Metodologias Ativas para Desenvolvimento no Ensino Superior/);
  await visit(page, '/en/');
  assert.match(await page.locator('main').innerText(), /Metodologias Ativas para Desenvolvimento no Ensino Superior/);
  await visit(page, '/ensino/');
  const ptText = await page.locator('main').innerText();
  assert.match(ptText, /Atividade didática demonstrativa/);
  assert.match(ptText, /não um relato de atividade aplicada em turma/);
  assert.match(ptText, /custo total 5/);
  await visit(page, '/en/teaching/');
  const enText = await page.locator('main').innerText();
  assert.match(enText, /Demonstration learning activity/);
  assert.match(enText, /not a report of an activity already taught/);
});
