// Content integrations shared across site pages.
const settings = document.getElementById('academic-media-config');
const config = JSON.parse(settings?.textContent || '{}');
for (const [name, url] of Object.entries(config)) {
  if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')) config[name] = (settings.dataset.baseurl || '') + url;
}
const english = document.documentElement.lang === 'en-US';
const loaded = new Map();
const diagrams = [];
const charts = [];
let mermaid;
let sequence = 0;
let redrawQueue = Promise.resolve();

function loadScript(url) {
  if (!loaded.has(url)) loaded.set(url, new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${url}`));
    document.head.append(script);
  }));
  return loaded.get(url);
}

function sourceBlocks(language) {
  return [...new Set(document.querySelectorAll(`pre > code.language-${language}, .language-${language} pre > code, pre.${language}, div.${language}`))];
}

function frame(code, label, description) {
  const source = code.closest('.highlighter-rouge') || code.closest('pre') || code;
  const figure = document.createElement('figure');
  figure.className = 'academic-media';
  const target = document.createElement('div');
  target.className = `media-output media-${label}`;
  const caption = document.createElement('figcaption');
  caption.textContent = description;
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = (english ? 'View the source code and data' : 'Ver o código e os dados usados');
  details.append(summary);
  if (!source.querySelector('button')) {
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn media-copy';
    copy.textContent = (english ? 'Copy code' : 'Copiar código');
    const text = code.textContent;
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(text); copy.textContent = (english ? 'Code copied' : 'Código copiado'); }
      catch { copy.textContent = (english ? 'Select the code to copy it' : 'Selecione o código para copiar'); }
    });
    details.append(copy);
  }
  source.before(figure);
  details.append(source);
  figure.append(target, caption, details);
  return {figure, target, details};
}

function failure(node, error) {
  console.error('Academic media:', error);
  const message = document.createElement('p');
  message.className = 'media-error';
  message.setAttribute('role', 'status');
  message.textContent = (english ? 'This content could not be displayed. You can still view its source code.' : 'Não foi possível mostrar este conteúdo. Você ainda pode ver o código usado.');
  if (node.figure) {
    node.details.open = true;
    if (!node.figure.querySelector('.media-error')) node.figure.append(message);
  } else node.after(message);
}

function palette() {
  const style = getComputedStyle(document.documentElement);
  const color = name => style.getPropertyValue(`--site-${name}`).trim();
  return {dark: document.documentElement.dataset.theme === 'dark', text: color('text'), background: color('background'), surface: color('surface'), rule: color('rule'), link: color('link'), font: getComputedStyle(document.body).fontFamily};
}

async function renderDiagram(record) {
  const p = palette();
  mermaid.initialize({startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true,
    theme: 'base', fontFamily: p.font, themeVariables: {
      darkMode: p.dark, background: p.background, primaryColor: p.surface,
      primaryTextColor: p.text, primaryBorderColor: p.link, lineColor: p.text,
      secondaryColor: p.surface, tertiaryColor: p.surface
    }});
  const {svg, bindFunctions} = await mermaid.render(`afm-diagram-${++sequence}`, record.source);
  record.target.innerHTML = svg;
  bindFunctions?.(record.target);
  record.figure.dataset.rendered = 'mermaid';
}

async function renderChart(record) {
  const p = palette();
  const supplied = structuredClone(record.spec.layout || {});
  // Plotly templates provide defaults while explicit author formatting wins.
  let template = {layout: {paper_bgcolor: p.background, plot_bgcolor: p.background,
      font: {color: p.text, family: p.font, size: 16},
    modebar: {bgcolor: p.background, color: p.text, activecolor: p.link},
    colorway: p.dark ? ['#9bd6bd', '#98c7ed', '#e3bd83', '#d8b5e7'] : ['#175b4c', '#255f9a', '#865113', '#744286'],
    xaxis: {gridcolor: p.rule, zerolinecolor: p.rule},
    yaxis: {gridcolor: p.rule, zerolinecolor: p.rule}}};
  const authorTemplate = supplied.template;
  if (typeof authorTemplate === 'string') template = authorTemplate;
  else if (authorTemplate) {
    Object.assign(template.layout, authorTemplate.layout || {});
    if (authorTemplate.data) template.data = authorTemplate.data;
  }
  await window.Plotly.react(record.target, structuredClone(record.spec.data), {...supplied, template, autosize: supplied.autosize ?? true},
    {responsive: true, displaylogo: false, ...record.spec.config,
      typesetMath: record.spec.config?.typesetMath !== false && /^([23])\./.test(window.MathJax?.version || '')});
  record.figure.dataset.rendered = 'plotly';
}

function redraw() {
  redrawQueue = redrawQueue.then(async () => {
    for (const record of diagrams) try { await renderDiagram(record); } catch (error) { failure(record, error); }
    for (const record of charts) try { await renderChart(record); } catch (error) { failure(record, error); }
  });
  return redrawQueue;
}

async function initMermaid() {
  const blocks = sourceBlocks('mermaid');
  if (!config.mermaid || !blocks.length) return;
  try {
    ({default: mermaid} = await import(config.mermaid));
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 5000))]);
    for (const block of blocks) diagrams.push({...frame(block, 'mermaid', (english ? 'Diagram. The source code shows how the elements relate.' : 'Diagrama. O código mostra como os elementos se relacionam.')), source: block.textContent});
    await redraw();
  } catch (error) { blocks.forEach(block => failure(block.closest('pre') || block, error)); }
}

async function initPlotly(mathReady) {
  const blocks = sourceBlocks('plotly');
  if (!config.plotly || !blocks.length) return;
  try {
    await loadScript(config.plotly);
    await mathReady;
    for (const block of blocks) {
      try {
        const spec = JSON.parse(block.textContent);
        if (!Array.isArray(spec.data)) throw new Error('Plotly requires a data array');
        const record = {...frame(block, 'plotly', spec.description || (english ? 'Interactive chart. See the source code for the values.' : 'Gráfico interativo. Consulte o código para ver os valores.')), spec};
        charts.push(record);
        new ResizeObserver(() => {if (record.target.offsetWidth && record.target.classList.contains('js-plotly-plot')) window.Plotly.Plots.resize(record.target);}).observe(record.target);
      } catch (error) { failure(block.closest('pre') || block, error); }
    }
    await redraw();
  } catch (error) { blocks.forEach(block => failure(block.closest('pre') || block, error)); }
}

async function initMath() {
  if (!config.mathjax) return;
  // Normalize legacy Kramdown math script tags for component-based MathJax.
  document.querySelectorAll('script[type^="math/tex"]').forEach(script => {
    const display = script.type.includes('mode=display');
    const replacement = document.createElement(display ? 'div' : 'span');
    replacement.textContent = (display ? '\\[' : '\\(') + script.textContent + (display ? '\\]' : '\\)');
    script.replaceWith(replacement);
  });
  const content = document.querySelector('.main-content') || document.body;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  let node, found = !!content.querySelector('math') || sourceBlocks('plotly').some(block => block.textContent.includes('$'));
  while (!found && (node = walker.nextNode())) {
    if (!node.parentElement.closest('pre, code, script, style, textarea, noscript') && /\$|\\\(|\\\[|\\begin\{/.test(node.textContent)) found = true;
  }
  if (!found) return;
  try {
    window.MathJax = {tex: {inlineMath: [['\\(', '\\)'], ['$', '$']], displayMath: [['$$', '$$'], ['\\[', '\\]']], processEscapes: true},
      options: {skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']}};
    await loadScript(config.mathjax);
    await window.MathJax.startup.promise;
    document.documentElement.dataset.mathReady = 'true';
  } catch (error) { failure(document.querySelector('.main-content'), error); }
}

async function initMaps() {
  const blocks = sourceBlocks('leaflet');
  if (!config.leaflet || !blocks.length) return;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = config.leaflet_css;
  const cssReady = new Promise((resolve, reject) => {css.onload = resolve; css.onerror = reject;});
  document.head.append(css);
  try {
    await Promise.all([loadScript(config.leaflet), cssReady]);
    for (const block of blocks) {
      let record;
      try {
        const spec = JSON.parse(block.textContent);
        record = frame(block, 'leaflet', spec.description || (english ? 'Interactive map. See the source code for the coordinates.' : 'Mapa interativo. Consulte o código para ver as coordenadas.'));
        const map = window.L.map(record.target, {scrollWheelZoom: false}).setView(spec.center || [0, 0], spec.zoom ?? 2);
        window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
        for (const marker of spec.markers || []) {
          const label = document.createElement('span'); label.textContent = marker.label || (english ? 'Example location' : 'Ponto de demonstração');
          window.L.marker([marker.lat, marker.lon], {alt: marker.label || (english ? 'Example location' : 'Ponto de demonstração')}).addTo(map).bindPopup(label);
        }
        if (spec.geojson) window.L.geoJSON(spec.geojson).addTo(map);
        new ResizeObserver(() => {if (record.target.offsetWidth) map.invalidateSize();}).observe(record.target);
        record.figure.dataset.rendered = 'leaflet';
      } catch (error) { failure(record || block.closest('pre') || block, error); }
    }
  } catch (error) { blocks.forEach(block => failure(block.closest('pre') || block, error)); }
}

new MutationObserver(() => redraw()).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
function start() {
  // Native JTD creates copy controls in its earlier DOMContentLoaded listener.
  document.querySelectorAll('.highlighter-rouge > button').forEach(button => button.setAttribute('aria-label', (english ? 'Copy code' : 'Copiar código')));
  const mathReady = initMath();
  Promise.allSettled([mathReady, initMermaid(), initPlotly(mathReady), initMaps()]);
}
if (document.readyState === 'complete') start();
else document.addEventListener('DOMContentLoaded', start, {once: true});
