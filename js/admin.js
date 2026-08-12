/* ============================================
   ADMIN DASHBOARD LOGIC
   ============================================ */

let currentUser = null;
let currentAdminComplaintFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  currentUser = requireAuth('admin');
  if (!currentUser) return;

  initSidebar();
  initAdminHome();
  initBroadcastSection();
  initAdminComplaintsSection();
  initAdminStudentsSection();
  initAdminFacultySection();
  initAdminEventsSection();
  initAdminNoticesSection();
  renderSocialFeed('social-feed-container', 'admin');
});

function switchToSection(sectionId) {
  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.click();
}

function initAdminHome() {
  document.getElementById('sidebar-name').textContent = currentUser.name;
  document.getElementById('sidebar-avatar').textContent = getInitials(currentUser.name);

  const students = DEMO_DATA.students;
  const faculty = DEMO_DATA.professors;
  const complaints = getStorage('complaints', DEMO_DATA.complaints);
  const notices = getStorage('notices', DEMO_DATA.notices);

  document.getElementById('admin-stat-students').textContent = students.length;
  document.getElementById('admin-stat-faculty').textContent = faculty.length;
  document.getElementById('admin-stat-complaints').textContent = complaints.filter(c => c.status !== 'resolved').length;
  document.getElementById('admin-stat-alerts').textContent = notices.filter(n => n.priority === 'urgent').length;

  // Recent complaints monitoring
  const container = document.getElementById('admin-recent-complaints');
  if (container) {
    container.innerHTML = complaints.slice(0, 4).map(c => `
      <div class="card card-flat flex justify-between items-center" style="margin-bottom:var(--sp-3);padding:var(--sp-4)">
        <div>
          <span class="badge badge-${c.category === 'hostel' ? 'danger' : 'primary'}" style="margin-bottom:4px">${c.category.toUpperCase()}</span>
          <h4 style="font-size:var(--fs-sm);margin:2px 0">${escapeHtml(c.title)}</h4>
          <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">Reported by: ${escapeHtml(c.author)} (${c.regNo}) • ${c.date}</p>
        </div>
        <span class="badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in-progress' ? 'warning' : 'danger'}">${c.status.toUpperCase()}</span>
      </div>
    `).join('');
  }
}

/* ── Emergency Broadcast Section ── */
function initBroadcastSection() {
  renderBroadcastHistory();
}

function sendEmergencyBroadcast() {
  const title = document.getElementById('broadcast-title')?.value.trim();
  const content = document.getElementById('broadcast-content')?.value.trim();
  const priority = document.getElementById('broadcast-priority')?.value;

  if (!title || !content) {
    showToast('Please provide headline and content for emergency alert', 'warning');
    return;
  }

  const notices = getStorage('notices', DEMO_DATA.notices);
  notices.unshift({
    id: generateId(),
    title: `🚨 EMERGENCY: ${title}`,
    content: content,
    date: new Date().toISOString().split('T')[0],
    author: 'ADMIN BROADCAST',
    priority: priority,
    category: 'emergency'
  });

  setStorage('notices', notices);
  showToast('EMERGENCY ALERT BROADCASTED CAMPUS-WIDE!', 'error', 'Campus Security');
  
  document.getElementById('broadcast-title').value = '';
  document.getElementById('broadcast-content').value = '';
  renderBroadcastHistory();
  initAdminHome();
}

function renderBroadcastHistory() {
  const notices = getStorage('notices', DEMO_DATA.notices);
  const emergency = notices.filter(n => n.category === 'emergency' || n.priority === 'urgent');

  const container = document.getElementById('broadcast-history');
  if (!container) return;

  if (emergency.length === 0) {
    container.innerHTML = '<p class="text-tertiary">No active broadcast emergency history.</p>';
    return;
  }

  container.innerHTML = emergency.map(e => `
    <div class="card card-flat" style="margin-bottom:var(--sp-3);padding:var(--sp-4);border-left:4px solid var(--clr-danger-500)">
      <div class="flex justify-between items-center" style="margin-bottom:2px">
        <strong style="font-size:var(--fs-sm);color:var(--clr-danger-500)">${escapeHtml(e.title)}</strong>
        <small class="text-tertiary">${formatDate(e.date)}</small>
      </div>
      <p style="font-size:var(--fs-xs);margin:0" class="text-secondary">${escapeHtml(e.content)}</p>
    </div>
  `).join('');
}

/* ── All Complaints Section ── */
function initAdminComplaintsSection() {
  renderAdminComplaints();
}

function filterAdminComplaints(cat) {
  currentAdminComplaintFilter = cat;
  renderAdminComplaints();
}

function renderAdminComplaints() {
  let complaints = getStorage('complaints', DEMO_DATA.complaints);
  if (currentAdminComplaintFilter !== 'all') {
    complaints = complaints.filter(c => c.category === currentAdminComplaintFilter);
  }

  const container = document.getElementById('admin-complaints-list');
  if (!container) return;

  if (complaints.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📥</div><h4>No Complaints Found</h4></div>';
    return;
  }

  container.innerHTML = complaints.map(c => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${c.category === 'hostel' ? 'danger' : 'primary'}">${c.category.toUpperCase()}</span>
        <span class="badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in-progress' ? 'warning' : 'danger'}">${c.status.toUpperCase()}</span>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(c.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-2)">${escapeHtml(c.description)}</p>
      <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-bottom:var(--sp-3)">
        Reported by: ${escapeHtml(c.author)} (${c.regNo}) • Date: ${c.date} • Assigned to: ${escapeHtml(c.assignedTo)}
      </div>
      <div class="flex gap-2" style="padding-top:var(--sp-3);border-top:1px solid var(--border-color)">
        ${c.status !== 'resolved' ? `<button class="btn btn-sm btn-accent" onclick="adminResolveComplaint('${c.id}', 'resolved')">Resolve</button>` : ''}
        ${c.status === 'pending' ? `<button class="btn btn-sm btn-secondary" onclick="adminResolveComplaint('${c.id}', 'in-progress')">In Progress</button>` : ''}
        <button class="btn btn-sm btn-danger" onclick="adminDeleteComplaint('${c.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function adminResolveComplaint(id, newStatus) {
  const complaints = getStorage('complaints', DEMO_DATA.complaints);
  const item = complaints.find(c => c.id === id);
  if (item) {
    item.status = newStatus;
    setStorage('complaints', complaints);
    showToast(`Complaint status set to ${newStatus}`, 'success');
    renderAdminComplaints();
    initAdminHome();
  }
}

function adminDeleteComplaint(id) {
  let complaints = getStorage('complaints', DEMO_DATA.complaints);
  complaints = complaints.filter(c => c.id !== id);
  setStorage('complaints', complaints);
  showToast('Complaint removed', 'info');
  renderAdminComplaints();
  initAdminHome();
}

/* ── Students Section ── */
function initAdminStudentsSection() {
  renderAdminStudentsTable();
  document.getElementById('admin-student-search')?.addEventListener('input', debounce(() => renderAdminStudentsTable(), 300));
}

function renderAdminStudentsTable() {
  const query = document.getElementById('admin-student-search')?.value || '';
  const students = filterItems(DEMO_DATA.students, query, ['name', 'regNo', 'email', 'phone']);
  
  const container = document.getElementById('admin-student-table');
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Reg Number</th>
            <th>Branch</th>
            <th>Attendance</th>
            <th>Hosteler</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(s => {
            const parsed = parseRegNumber(s.regNo);
            return `
              <tr>
                <td><strong>${escapeHtml(s.name)}</strong></td>
                <td>${s.regNo}</td>
                <td>${parsed ? parsed.branchShort : 'ME'}</td>
                <td><span class="badge badge-${s.attendance >= 85 ? 'success' : s.attendance >= 75 ? 'warning' : 'danger'}">${s.attendance}%</span></td>
                <td>${s.isHosteler ? '🏠 Yes' : '🚌 No'}</td>
                <td>${s.phone}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ── Faculty Section ── */
function initAdminFacultySection() {
  renderAdminFacultyTable();
  document.getElementById('admin-faculty-search')?.addEventListener('input', debounce(() => renderAdminFacultyTable(), 300));
}

function renderAdminFacultyTable() {
  const query = document.getElementById('admin-faculty-search')?.value || '';
  const faculty = filterItems(DEMO_DATA.professors, query, ['name', 'department', 'email', 'phone']);
  
  const container = document.getElementById('admin-faculty-table');
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>Faculty Name</th>
            <th>Title</th>
            <th>Department</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${faculty.map(f => `
            <tr>
              <td><strong>${escapeHtml(f.name)}</strong></td>
              <td>${escapeHtml(f.title)}</td>
              <td>${escapeHtml(f.department)}</td>
              <td>${f.email}</td>
              <td>${f.phone}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ── Manage Events ── */
function initAdminEventsSection() {
  renderAdminEvents();
}

function renderAdminEvents() {
  const events = getStorage('events', DEMO_DATA.events);
  const container = document.getElementById('admin-events-list');
  if (!container) return;

  container.innerHTML = events.map(e => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-accent">${e.type.toUpperCase()}</span>
        <button class="btn btn-sm btn-danger" onclick="deleteAdminEvent('${e.id}')">Delete</button>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(e.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-2)">${escapeHtml(e.description)}</p>
      <small style="color:var(--clr-primary-600);font-weight:var(--fw-semibold)">🗓️ Date: ${e.date} • 📍 ${escapeHtml(e.venue)}</small>
    </div>
  `).join('');
}

function submitAdminEvent() {
  const title = document.getElementById('evt-title')?.value.trim();
  const type = document.getElementById('evt-type')?.value;
  const date = document.getElementById('evt-date')?.value;
  const venue = document.getElementById('evt-venue')?.value.trim();
  const desc = document.getElementById('evt-desc')?.value.trim();

  if (!title || !date) {
    showToast('Please specify event title and date', 'warning');
    return;
  }

  const events = getStorage('events', DEMO_DATA.events);
  events.unshift({
    id: generateId(),
    title: title,
    type: type,
    date: date,
    venue: venue || 'Campus Ground',
    description: desc || 'College event.'
  });

  setStorage('events', events);
  closeModal('modal-create-event');
  showToast('Event created!', 'success');
  renderAdminEvents();
}

function deleteAdminEvent(id) {
  let events = getStorage('events', DEMO_DATA.events);
  events = events.filter(e => e.id !== id);
  setStorage('events', events);
  showToast('Event deleted', 'info');
  renderAdminEvents();
}

/* ── Manage Notices ── */
function initAdminNoticesSection() {
  renderAdminNotices();
}

function renderAdminNotices() {
  const notices = getStorage('notices', DEMO_DATA.notices);
  const container = document.getElementById('admin-notices-list');
  if (!container) return;

  container.innerHTML = notices.map(n => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${n.priority === 'urgent' ? 'danger' : n.priority === 'important' ? 'warning' : 'primary'}">${n.priority.toUpperCase()}</span>
        <button class="btn btn-sm btn-danger" onclick="deleteAdminNotice('${n.id}')">Delete</button>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(n.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-2)">${escapeHtml(n.content)}</p>
      <small class="text-tertiary">Published on: ${n.date} by ${escapeHtml(n.author)}</small>
    </div>
  `).join('');
}

function submitAdminNotice() {
  const title = document.getElementById('not-title')?.value.trim();
  const priority = document.getElementById('not-priority')?.value;
  const content = document.getElementById('not-content')?.value.trim();

  if (!title || !content) {
    showToast('Please provide notice headline and content', 'warning');
    return;
  }

  const notices = getStorage('notices', DEMO_DATA.notices);
  notices.unshift({
    id: generateId(),
    title: title,
    content: content,
    date: new Date().toISOString().split('T')[0],
    author: 'Campus Admin',
    priority: priority,
    category: 'general'
  });

  setStorage('notices', notices);
  closeModal('modal-create-notice');
  showToast('Notice published!', 'success');
  renderAdminNotices();
}

function deleteAdminNotice(id) {
  let notices = getStorage('notices', DEMO_DATA.notices);
  notices = notices.filter(n => n.id !== id);
  setStorage('notices', notices);
  showToast('Notice deleted', 'info');
  renderAdminNotices();
}
