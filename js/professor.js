/* ============================================
   PROFESSOR DASHBOARD LOGIC
   ============================================ */

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  currentUser = requireAuth('professor');
  if (!currentUser) return;

  initSidebar();
  initProfessorProfile();
  initProfessorHome();
  initAssignmentsSection();
  initAlertsSection();
  initComplaintsSection();
  initDirectorySection();
  renderSocialFeed('social-feed-container', 'professor');

  const avatar = document.getElementById('social-avatar');
  if (avatar) avatar.textContent = getInitials(currentUser.name);
});

function switchToSection(sectionId) {
  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.click();
}

function initProfessorProfile() {
  document.getElementById('sidebar-name').textContent = currentUser.name;
  document.getElementById('sidebar-avatar').textContent = getInitials(currentUser.name);
  document.getElementById('greeting-text').textContent = `Welcome, ${currentUser.name}!`;
  document.getElementById('greeting-dept').textContent = `${currentUser.title} • ${currentUser.department}`;
}

/* ── Home Stats & Time-Bound Alerts ── */
function initProfessorHome() {
  const assignments = getStorage('assignments', DEMO_DATA.assignments);
  const notices = getStorage('notices', DEMO_DATA.notices);
  const complaints = getStorage('complaints', DEMO_DATA.complaints);

  document.getElementById('stat-active-assignments').textContent = assignments.length;
  document.getElementById('stat-total-alerts').textContent = notices.length;
  document.getElementById('stat-pending-complaints').textContent = complaints.filter(c => c.status === 'pending').length;

  // Render Time-Bound Alerts (Assignments expiring soon / within 24h)
  const timeboundContainer = document.getElementById('timebound-alerts');
  if (timeboundContainer) {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = assignments.filter(a => a.deadline >= today);

    if (upcoming.length === 0) {
      timeboundContainer.innerHTML = '<p class="text-tertiary">No immediate deadline reminders.</p>';
    } else {
      timeboundContainer.innerHTML = upcoming.map(a => `
        <div class="schedule-card" style="margin-bottom:var(--sp-2)">
          <div class="schedule-time-bar warning"></div>
          <div class="schedule-info">
            <div class="schedule-subject">${escapeHtml(a.title)}</div>
            <div class="schedule-details">Target: Year ${a.targetYear} • Deadline: ${a.deadline}</div>
          </div>
          <span class="badge badge-warning">⏰ Auto-Reminder Active</span>
        </div>
      `).join('');
    }
  }

  // Recent Assignments
  const recentContainer = document.getElementById('recent-assignments');
  if (recentContainer) {
    recentContainer.innerHTML = assignments.slice(0, 3).map(a => `
      <div class="card card-flat flex justify-between items-center" style="margin-bottom:var(--sp-3);padding:var(--sp-4)">
        <div>
          <h4 style="font-size:var(--fs-sm);margin-bottom:2px">${escapeHtml(a.title)}</h4>
          <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${escapeHtml(a.subject)} • Deadline: ${a.deadline}</p>
        </div>
        <span class="badge badge-primary">Published</span>
      </div>
    `).join('');
  }
}

/* ── Assignments Section ── */
function initAssignmentsSection() {
  renderAssignments();
}

function renderAssignments() {
  const assignments = getStorage('assignments', DEMO_DATA.assignments);
  const container = document.getElementById('assignments-list');
  if (!container) return;

  if (assignments.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><h4>No Assignments</h4></div>';
    return;
  }

  container.innerHTML = assignments.map(a => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-primary">${escapeHtml(a.subject)}</span>
        <span class="badge badge-${a.status === 'active' ? 'accent' : 'danger'}">Deadline: ${a.deadline}</span>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(a.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-3)">${escapeHtml(a.description)}</p>
      <div class="flex justify-between items-center" style="padding-top:var(--sp-3);border-top:1px solid var(--border-color)">
        <small class="text-tertiary">Target: Year ${a.targetYear} (${a.targetBranch === 'all' ? 'All Branches' : 'Branch ' + a.targetBranch})</small>
        <button class="btn btn-sm btn-danger" onclick="deleteAssignment('${a.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function submitAssignment() {
  const title = document.getElementById('asg-title')?.value.trim();
  const subject = document.getElementById('asg-subject')?.value.trim();
  const deadline = document.getElementById('asg-deadline')?.value;
  const branch = document.getElementById('asg-branch')?.value;
  const year = document.getElementById('asg-year')?.value;
  const desc = document.getElementById('asg-desc')?.value.trim();

  if (!title || !deadline) {
    showToast('Please specify title and deadline date', 'warning');
    return;
  }

  const assignments = getStorage('assignments', DEMO_DATA.assignments);
  assignments.unshift({
    id: generateId(),
    title: title,
    subject: subject || 'General',
    faculty: currentUser.name,
    deadline: deadline,
    targetBranch: branch,
    targetYear: parseInt(year),
    description: desc || 'Complete and submit on time.',
    status: 'active'
  });

  setStorage('assignments', assignments);
  closeModal('modal-create-assignment');
  showToast('Assignment published! Students notified.', 'success', 'Assignment Notifier');
  renderAssignments();
  initProfessorHome();
}

function deleteAssignment(id) {
  let assignments = getStorage('assignments', DEMO_DATA.assignments);
  assignments = assignments.filter(a => a.id !== id);
  setStorage('assignments', assignments);
  showToast('Assignment deleted', 'info');
  renderAssignments();
  initProfessorHome();
}

/* ── Batch Alerts Section ── */
function initAlertsSection() {
  renderBatchAlerts();
}

function sendBatchAlert() {
  const branch = document.getElementById('alert-branch')?.value;
  const year = document.getElementById('alert-year')?.value;
  const title = document.getElementById('alert-title')?.value.trim();
  const content = document.getElementById('alert-content')?.value.trim();

  if (!title || !content) {
    showToast('Please provide both title and content for the alert', 'warning');
    return;
  }

  const notices = getStorage('notices', DEMO_DATA.notices);
  notices.unshift({
    id: generateId(),
    title: `[Batch Alert] ${title}`,
    content: content,
    date: new Date().toISOString().split('T')[0],
    author: currentUser.name,
    priority: 'important',
    category: 'academic',
    targetBranch: branch,
    targetYear: year
  });

  setStorage('notices', notices);
  showToast(`Broadcast sent to ${branch === 'all' ? 'All Branches' : 'Branch ' + branch}!`, 'success', 'Batch Alerts');
  
  document.getElementById('alert-title').value = '';
  document.getElementById('alert-content').value = '';
  renderBatchAlerts();
}

function renderBatchAlerts() {
  const notices = getStorage('notices', DEMO_DATA.notices);
  const container = document.getElementById('sent-alerts-list');
  if (!container) return;

  container.innerHTML = notices.slice(0, 5).map(n => `
    <div class="card card-flat" style="margin-bottom:var(--sp-3);padding:var(--sp-4)">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-1)">
        <strong style="font-size:var(--fs-sm)">${escapeHtml(n.title)}</strong>
        <small class="text-tertiary">${formatDate(n.date)}</small>
      </div>
      <p style="font-size:var(--fs-xs);margin:0" class="text-secondary">${escapeHtml(n.content)}</p>
    </div>
  `).join('');
}

/* ── Smart Complaints Inbox ── */
function initComplaintsSection() {
  renderComplaints();
}

function renderComplaints() {
  const complaints = getStorage('complaints', DEMO_DATA.complaints);
  const container = document.getElementById('complaints-inbox');
  if (!container) return;

  if (complaints.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📥</div><h4>Inbox Empty</h4></div>';
    return;
  }

  container.innerHTML = complaints.map(c => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in-progress' ? 'warning' : 'danger'}">${c.status.toUpperCase()}</span>
        <small class="text-tertiary">From: ${escapeHtml(c.author)} (${c.regNo})</small>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(c.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-3)">${escapeHtml(c.description)}</p>
      <div class="flex gap-2" style="padding-top:var(--sp-3);border-top:1px solid var(--border-color)">
        ${c.status !== 'resolved' ? `<button class="btn btn-sm btn-accent" onclick="updateComplaintStatus('${c.id}', 'resolved')">Mark Resolved</button>` : ''}
        ${c.status === 'pending' ? `<button class="btn btn-sm btn-secondary" onclick="updateComplaintStatus('${c.id}', 'in-progress')">Mark In-Progress</button>` : ''}
      </div>
    </div>
  `).join('');
}

function updateComplaintStatus(id, newStatus) {
  const complaints = getStorage('complaints', DEMO_DATA.complaints);
  const item = complaints.find(c => c.id === id);
  if (item) {
    item.status = newStatus;
    setStorage('complaints', complaints);
    showToast(`Complaint status updated to ${newStatus}`, 'success');
    renderComplaints();
    initProfessorHome();
  }
}

/* ── Student Directory ── */
function initDirectorySection() {
  renderStudentList();
  document.getElementById('prof-student-search')?.addEventListener('input', debounce(() => renderStudentList(), 300));
}

function renderStudentList() {
  const query = document.getElementById('prof-student-search')?.value || '';
  const students = filterItems(DEMO_DATA.students, query, ['name', 'regNo', 'email', 'phone']);
  
  const container = document.getElementById('prof-student-list');
  if (!container) return;

  container.innerHTML = `
    <div class="grid-2">
      ${students.map(s => {
        const parsed = parseRegNumber(s.regNo);
        return `
          <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4)">
            <div class="flex items-center gap-3">
              <div class="avatar avatar-md">${getInitials(s.name)}</div>
              <div>
                <h4 style="font-size:var(--fs-sm);margin-bottom:2px">${escapeHtml(s.name)}</h4>
                <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${s.regNo} • ${parsed ? parsed.branchShort : 'ME'} • Attn: ${s.attendance}%</p>
              </div>
            </div>
            <a href="tel:${s.phone}" class="btn btn-sm btn-secondary">📞 Call</a>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
function simulateAIUpload(type) {
  const fileInput = document.getElementById(`upload-${type}-file`);
  if (!fileInput.files || fileInput.files.length === 0) {
    showError('Please select a file to upload first.');
    return;
  }

  // Show loading toast
  showToast(`AI is analyzing your ${type} document...`, 'info', 'Processing');
  fileInput.value = ''; // clear input

  // Simulate AI parsing delay
  setTimeout(() => {
    // Set flag in localStorage
    localStorage.setItem(`ai_uploaded_${type}`, 'true');
    showToast(`Successfully parsed and synced ${type} data!`, 'success', 'AI Complete');
  }, 2000);
}
