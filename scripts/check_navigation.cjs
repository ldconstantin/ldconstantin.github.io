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
    const result = page.locator('pagefind-results a').first();
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
