/**
 * Highlights the most relevant class row in course tables.
 * Priority:
 * 1. Class scheduled for today
 * 2. Most recent class already taught
 * 3. First class, if the semester has not started yet
 *
 * Supports Portuguese month abbreviations (Fev, Mar, Abr, etc.)
 * and numeric format (dd/mm).
 */
document.addEventListener('DOMContentLoaded', function () {
  const monthMap = {
    'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
    'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const metaTime = document.querySelector('meta[property="article:published_time"]');
  let currentYear = today.getFullYear();
  if (metaTime && metaTime.content) {
    const yearMatch = metaTime.content.substring(0, 4);
    if (!isNaN(parseInt(yearMatch, 10))) {
      currentYear = parseInt(yearMatch, 10);
    }
  }

  const datedRows = [];

  document.querySelectorAll('.page__content table tbody tr').forEach(function (row, index) {
    const dateCell = row.querySelector('td:first-child');
    if (!dateCell) return;

    const text = dateCell.textContent.trim();
    // Match "dd/Mon" (e.g. 10/Fev) or "dd/mm" (e.g. 10/02)
    const match = text.match(/^(\d{1,2})\/(\w+)$/);
    if (!match) return;

    const day = parseInt(match[1], 10);
    const monthStr = match[2].toLowerCase();
    let month;

    if (monthMap.hasOwnProperty(monthStr)) {
      month = monthMap[monthStr];
    } else {
      const num = parseInt(monthStr, 10);
      if (!isNaN(num) && num >= 1 && num <= 12) {
        month = num - 1;
      } else {
        return;
      }
    }

    const rowDate = new Date(currentYear, month, day);
    rowDate.setHours(0, 0, 0, 0);
    datedRows.push({ row, rowDate, index });
  });

  if (datedRows.length === 0) return;

  let highlight = datedRows.find(function (item) {
    return item.rowDate.getTime() === today.getTime();
  });

  if (!highlight) {
    const pastOrToday = datedRows.filter(function (item) {
      return item.rowDate < today;
    });

    if (pastOrToday.length > 0) {
      highlight = pastOrToday[pastOrToday.length - 1];
    } else {
      highlight = datedRows[0];
    }
  }

  if (highlight) {
    highlight.row.classList.add('upcoming-class');
  }
});
