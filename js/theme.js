/* ============================================
   THEME TOGGLE
   ============================================ */

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme) {
  const toggles = document.querySelectorAll('.theme-toggle .toggle-thumb');
  toggles.forEach(thumb => {
    thumb.textContent = theme === 'dark' ? '🌙' : '☀️';
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initTheme);
