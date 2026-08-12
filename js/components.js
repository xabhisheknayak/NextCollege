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

// ── Edit Profile Modal Injection ──
function injectEditProfileModal() {
  if (document.getElementById('modal-edit-profile')) return;
  const modalHTML = `
  <div class="modal-overlay" id="modal-edit-profile">
    <div class="modal" style="max-width:500px;">
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <button class="modal-close" onclick="closeModal('modal-edit-profile')">✕</button>
      </div>
      <div class="form-group" style="text-align:center;">
        <div class="avatar avatar-xl" id="edit-profile-avatar-preview" style="margin: 0 auto var(--sp-2);">?</div>
        <input type="text" class="form-input" id="edit-profile-avatar" placeholder="Avatar URL (e.g. image link)">
      </div>
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-input" id="edit-profile-name" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">ID / Roll No.</label>
        <input type="text" class="form-input" id="edit-profile-id" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Branch / Dept</label>
        <input type="text" class="form-input" id="edit-profile-branch" disabled>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Age</label>
          <input type="number" class="form-input" id="edit-profile-age" placeholder="e.g. 20">
        </div>
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select class="form-input" id="edit-profile-gender">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <!-- Admin Specific Actions -->
      <div id="admin-moderation-actions" style="display:none; margin-top:var(--sp-4); padding-top:var(--sp-4); border-top:1px solid var(--border-color);">
        <h4 style="margin-bottom:var(--sp-2); color:var(--text-primary);">Danger Zone (Admin Only)</h4>
        <div class="flex gap-2">
          <button class="btn btn-warning flex-1" id="btn-block-account" onclick="toggleBlockAccount()">Block Account</button>
          <button class="btn btn-danger flex-1" id="btn-delete-account" onclick="deleteAccount()">Delete Account</button>
        </div>
      </div>

      <div class="modal-footer" style="margin-top:var(--sp-4);">
        <button class="btn btn-secondary" onclick="closeModal('modal-edit-profile')">Cancel</button>
        <button class="btn btn-primary" onclick="saveProfileChanges()">Save Changes</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Inject immediately on DOM load
document.addEventListener('DOMContentLoaded', injectEditProfileModal);

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

// ── Profile Editing Logic ──
let currentEditUserId = null;
let currentEditUserRole = null;

function openEditProfileModal(userId, role, isAdmin = false) {
  currentEditUserId = userId;
  currentEditUserRole = role;
  
  const storageKey = role === 'student' ? 'users_students' : 'users_professors';
  const users = getStorage(storageKey) || [];
  const user = users.find(u => (u.regNo || u.id) === userId);
  
  if (!user) return showError('User not found');
  
  // Populate Fields
  document.getElementById('edit-profile-avatar-preview').textContent = user.avatarUrl ? '' : getInitials(user.name);
  if (user.avatarUrl) {
    document.getElementById('edit-profile-avatar-preview').innerHTML = `<img src="${user.avatarUrl}" alt="avatar" style="width:100%;height:100%;border-radius:var(--radius-full);object-fit:cover;">`;
  }
  document.getElementById('edit-profile-avatar').value = user.avatarUrl || '';
  
  document.getElementById('edit-profile-name').value = user.name || '';
  document.getElementById('edit-profile-id').value = user.regNo || user.id || '';
  document.getElementById('edit-profile-branch').value = user.branch || user.department || '';
  
  const parsed = user.parsed || (user.regNo ? parseRegNumber(user.regNo) : null);
  document.getElementById('edit-profile-year').value = parsed ? \`Year \${parsed.currentYear}\` : (user.title || '');
  
  document.getElementById('edit-profile-age').value = user.age || '';
  document.getElementById('edit-profile-gender').value = user.gender || '';
  
  // Manage disabled state based on role
  const isSuperAdmin = currentUser?.role === 'admin' && isAdmin;
  ['edit-profile-name', 'edit-profile-id', 'edit-profile-branch', 'edit-profile-year'].forEach(id => {
    document.getElementById(id).disabled = !isSuperAdmin;
  });
  
  // Admin Actions
  const adminActions = document.getElementById('admin-moderation-actions');
  if (adminActions) {
    adminActions.style.display = isSuperAdmin ? 'block' : 'none';
    const blockBtn = document.getElementById('btn-block-account');
    if (blockBtn) {
      blockBtn.textContent = user.isBlocked ? 'Unblock Account' : 'Block Account';
    }
  }
  
  openModal('modal-edit-profile');
}

function saveProfileChanges() {
  if (!currentEditUserId || !currentEditUserRole) return;
  
  const storageKey = currentEditUserRole === 'student' ? 'users_students' : 'users_professors';
  let users = getStorage(storageKey) || [];
  const userIndex = users.findIndex(u => (u.regNo || u.id) === currentEditUserId);
  
  if (userIndex === -1) return showError('User not found');
  
  const isSuperAdmin = currentUser?.role === 'admin';
  
  // Editable by everyone
  users[userIndex].avatarUrl = document.getElementById('edit-profile-avatar').value.trim();
  users[userIndex].age = document.getElementById('edit-profile-age').value.trim();
  users[userIndex].gender = document.getElementById('edit-profile-gender').value.trim();
  
  // Editable by Admin only
  if (isSuperAdmin) {
    users[userIndex].name = document.getElementById('edit-profile-name').value.trim();
    if (currentEditUserRole === 'student') {
      users[userIndex].regNo = document.getElementById('edit-profile-id').value.trim();
      users[userIndex].branch = document.getElementById('edit-profile-branch').value.trim();
    } else {
      users[userIndex].id = document.getElementById('edit-profile-id').value.trim();
      users[userIndex].department = document.getElementById('edit-profile-branch').value.trim();
      users[userIndex].title = document.getElementById('edit-profile-year').value.trim();
    }
  }
  
  setStorage(storageKey, users);
  
  // If editing self, update session
  if (currentUser && (currentUser.regNo || currentUser.id) === currentEditUserId) {
    const updatedUser = { ...currentUser, ...users[userIndex] };
    setSession('currentUser', updatedUser);
    // Refresh self UI
    if (document.getElementById('profile-name')) document.getElementById('profile-name').textContent = updatedUser.name;
    if (document.getElementById('home-name')) document.getElementById('home-name').textContent = updatedUser.name;
    if (document.getElementById('nav-avatar')) document.getElementById('nav-avatar').textContent = getInitials(updatedUser.name);
    // Profile avatar updates
    const selfAvatar = document.getElementById('profile-avatar');
    if (selfAvatar) {
      selfAvatar.textContent = updatedUser.avatarUrl ? '' : getInitials(updatedUser.name);
      if (updatedUser.avatarUrl) {
        selfAvatar.innerHTML = `<img src="${updatedUser.avatarUrl}" alt="avatar" style="width:100%;height:100%;border-radius:var(--radius-full);object-fit:cover;">`;
      }
    }
  }
  
  showToast('Profile updated successfully', 'success');
  closeModal('modal-edit-profile');
  
  // If admin is on directory page, refresh directory
  if (isSuperAdmin && typeof renderAdminDirectory === 'function') {
    renderAdminDirectory();
  }
}

function toggleBlockAccount() {
  if (!currentEditUserId || !currentEditUserRole) return;
  const storageKey = currentEditUserRole === 'student' ? 'users_students' : 'users_professors';
  let users = getStorage(storageKey) || [];
  const user = users.find(u => (u.regNo || u.id) === currentEditUserId);
  if (!user) return;
  
  user.isBlocked = !user.isBlocked;
  setStorage(storageKey, users);
  
  showToast(`Account ${user.isBlocked ? 'blocked' : 'unblocked'}.`, 'warning');
  closeModal('modal-edit-profile');
  if (typeof renderAdminDirectory === 'function') renderAdminDirectory();
}

function deleteAccount() {
  if (!currentEditUserId || !currentEditUserRole) return;
  if (!confirm('Are you sure you want to completely delete this account? This cannot be undone.')) return;
  
  const storageKey = currentEditUserRole === 'student' ? 'users_students' : 'users_professors';
  let users = getStorage(storageKey) || [];
  users = users.filter(u => (u.regNo || u.id) !== currentEditUserId);
  setStorage(storageKey, users);
  
  showToast('Account deleted successfully.', 'success');
  closeModal('modal-edit-profile');
  if (typeof renderAdminDirectory === 'function') renderAdminDirectory();
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
function createProgressRing(percent, size = 80, isLight = false) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  const strokeColor = isLight ? 'rgba(255,255,255,0.9)' : 'url(#ringGradient)';
  const bgColor = isLight ? 'rgba(255,255,255,0.2)' : 'var(--clr-neutral-200)';
  const textColor = isLight ? '#ffffff' : 'var(--text-primary)';
  
  return `
    <div class="progress-ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#dc2626" />
            <stop offset="100%" style="stop-color:#ea580c" />
          </linearGradient>
        </defs>
        <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}" style="stroke: ${bgColor}" />
        <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${radius}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" style="stroke: ${strokeColor}" />
      </svg>
      <div class="ring-text" style="color: ${textColor}">${percent}%</div>
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

/* Logout */
function logout() {
  sessionStorage.clear();
  window.location.href = 'portals.html';
}

/* ── Social Feed Logic ──
   Moved to js/social.js (renderSocialFeed, createSocialPost, votePost,
   addComment, sharePost, toggleFollow, deleteSocialPost, DM system)
   ── */
