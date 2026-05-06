document.addEventListener('DOMContentLoaded', function () {
  const rows = Array.from(document.querySelectorAll('[data-lppc-meetings] tbody tr[data-date]'));
  if (rows.length === 0) return;

  const style = document.createElement('style');
  style.textContent = [
    '.lppc-meeting-past { opacity: 0.55; }',
    '.lppc-meeting-current { font-weight: 700; background: rgba(255, 230, 128, 0.22); }'
  ].join('\n');
  document.head.appendChild(style);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsed = rows
    .map(function (row, index) {
      const date = new Date(row.getAttribute('data-date') + 'T00:00:00');
      if (Number.isNaN(date.getTime())) return null;
      date.setHours(0, 0, 0, 0);
      return { row: row, date: date, index: index };
    })
    .filter(Boolean)
    .sort(function (a, b) {
      return a.date - b.date || a.index - b.index;
    });

  if (parsed.length === 0) return;

  parsed.forEach(function (item) {
    if (item.date < today) item.row.classList.add('lppc-meeting-past');
  });

  const next = parsed.find(function (item) {
    return item.date >= today;
  }) || parsed[parsed.length - 1];

  next.row.classList.add('lppc-meeting-current');
});
