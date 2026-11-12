// Language tabs for the two canonical static source files, no runtime or external API.
(() => {
  const groups = document.querySelectorAll('[data-solution-code-tabs]');
  for (const group of groups) {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (tabs.length !== 2 || panels.some(panel => !panel)) continue;

    function load(index) {
      const block = panels[index].querySelector('[data-solution-source]');
      const code = block?.querySelector('code');
      if (!block || !code || block.dataset.loaded) return;
      block.dataset.loaded = 'pending';
      fetch(block.dataset.solutionSource)
        .then(response => {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.text();
        })
        .then(source => {
          code.textContent = source;
          block.dataset.loaded = 'true';
        })
        .catch(() => {
          code.textContent = document.documentElement.lang.startsWith('pt')
            ? 'Não foi possível carregar este código. Use o link do arquivo acima.'
            : 'Could not load source code. Use the file link above.';
          block.dataset.loaded = 'error';
        });
    }
    function activate(index, focus) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      load(index);
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index, false));
      tab.addEventListener('keydown', event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home' ? 0
          : event.key === 'End' ? tabs.length - 1
          : null;
        if (next === null) return;
        event.preventDefault();
        activate(next, true);
      });
    });
    activate(0, false);
  }
})();
