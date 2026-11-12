// Render the canonical published source inside a solution page; do not duplicate code in HTML.
(() => {
  const blocks = document.querySelectorAll('pre[data-solution-source]');
  for (const block of blocks) {
    const code = block.querySelector('code');
    if (!code) continue;
    fetch(block.dataset.solutionSource)
      .then(response => {
        if (!response.ok) throw new Error('Source request failed: ' + response.status);
        return response.text();
      })
      .then(source => { code.textContent = source; })
      .catch(() => { block.hidden = true; }); // The regular source link stays available.
  }
})();
