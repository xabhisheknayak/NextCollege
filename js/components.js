/* ============================================
   SHARED UI COMPONENTS (JS Factories)
   ============================================ */

// ── Toast Notifications ──
function showToast(message, type = 'info', title = '', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Modal System ──
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function createModal(id, title, contentHtml, footerHtml = '') {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = id;
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal('${id}')">✕</button>
      </div>
      <div class="modal-body">${contentHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(id);
  });
  
  document.body.appendChild(modal);
  return modal;
}

// ── Sidebar Navigation ──
function initSidebar() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Nav item clicks
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      switchSection(section);
      
      // Update active nav item
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Close mobile sidebar
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });
}

function switchSection(sectionId) {
  document.querySelectorAll('.dashboard-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add('active');
    // Update page title
    const titleEl = document.querySelector('.page-title');
    const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (titleEl && navItem) {
      titleEl.textContent = navItem.textContent.trim();
    }
  }
}

// ── Progress Ring ──
function createProgressRing(percent, size = 80) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  return `
    <div class="progress-ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1" />
            <stop offset="100%" style="stop-color:#a78bfa" />
          </linearGradient>
        </defs>
        <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}"/>
        <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${radius}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="ring-text">${percent}%</div>
    </div>
  `;
}

// ── Star Rating ──
function createStarRating(containerId, initialRating = 0, onChange = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  container.className = 'star-rating';
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = `star ${i <= initialRating ? 'active' : ''}`;
    star.textContent = '★';
    star.dataset.value = i;
    
    star.addEventListener('click', () => {
      container.querySelectorAll('.star').forEach((s, idx) => {
        s.classList.toggle('active', idx < i);
      });
      if (onChange) onChange(i);
    });
    
    star.addEventListener('mouseenter', () => {
      container.querySelectorAll('.star').forEach((s, idx) => {
        s.style.color = idx < i ? 'var(--clr-warning-500)' : '';
      });
    });
    
    star.addEventListener('mouseleave', () => {
      container.querySelectorAll('.star').forEach((s) => {
        s.style.color = '';
      });
    });
    
    container.appendChild(star);
  }
}

// ── Calendar Generator ──
function generateCalendar(containerId, year, month, events = []) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  let html = `
    <div class="calendar-grid">
      ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => 
        `<div class="calendar-day-header">${d}</div>`
      ).join('')}
  `;

  // Previous month padding
  const prevDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="calendar-day other-month">${prevDays - i}</div>`;
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const hasEvent = events.some(e => e.date === dateStr || (e.endDate && dateStr >= e.date && dateStr <= e.endDate));
    
    const classes = ['calendar-day'];
    if (isToday) classes.push('today');
    if (hasEvent) classes.push('has-event');
    
    html += `<div class="${classes.join(' ')}" data-date="${dateStr}">${day}</div>`;
  }

  // Next month padding
  const totalCells = firstDay + daysInMonth;
  const remaining = 7 - (totalCells % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="calendar-day other-month">${i}</div>`;
    }
  }

  html += '</div>';
  container.innerHTML = html;
}

// ── Logout ──
function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}
