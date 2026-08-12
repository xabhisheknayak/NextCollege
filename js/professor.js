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
  initClassScheduleSection();

  // Social feed, home preview, and DM system
  if (typeof initSocialPage === 'function') initSocialPage();
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
          <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4); cursor:pointer;" onclick="openDirectoryProfile('${escapeHtml(s.name)}', 'student', '${s.regNo}', '${parsed ? parsed.branchShort : 'ME'}')">
            <div class="flex items-center gap-3">
              <div class="avatar avatar-md">${getInitials(s.name)}</div>
              <div>
                <h4 style="font-size:var(--fs-sm);margin-bottom:2px">${escapeHtml(s.name)}</h4>
                <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${s.regNo} • ${parsed ? parsed.branchShort : 'ME'} • Attn: ${s.attendance}%</p>
              </div>
            </div>
            <a href="tel:${s.phone}" class="btn btn-sm btn-secondary" onclick="event.stopPropagation()">📞 Call</a>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
function simulateAIUpload(type) {
  const fileInput = document.getElementById(`upload-${type}-file`);
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showError('Please select a file to upload first.');
    return;
  }

  showToast(`AI is reading your ${type} document...`, 'info', 'Processing');
  fileInput.value = '';

  setTimeout(() => {
    localStorage.setItem(`ai_uploaded_${type}`, 'true');
    if (type === 'attendance') {
      showToast('AI parsed biometric data. Mark attendance below.', 'success', 'AI Complete');
      renderBiometricAttendancePanel();
    } else {
      showToast(`Successfully parsed and synced ${type} data!`, 'success', 'AI Complete');
    }
  }, 2000);
}

function renderBiometricAttendancePanel() {
  const container = document.getElementById('biometric-attendance-panel');
  if (!container) return;

  const students = DEMO_DATA.students || [];
  container.style.display = 'block';
  container.innerHTML = `
    <div class="card card-flat" style="padding:var(--sp-5); margin-top:var(--sp-4);">
      <h4 style="margin-bottom:var(--sp-4);">🧬 Biometric Attendance — Mark Students</h4>
      <p class="text-tertiary" style="font-size:var(--fs-sm); margin-bottom:var(--sp-4);">AI read your upload. Check each student who was present.</p>
      <div class="flex flex-col gap-3" id="biometric-student-list">
        ${students.map(s => `
          <label class="flex items-center gap-3" style="cursor:pointer; padding:var(--sp-3); border:1px solid var(--border-color); border-radius:var(--radius-lg); transition: background 0.2s;">
            <input type="checkbox" data-regno="${escapeHtml(s.regNo)}" data-name="${escapeHtml(s.name)}" style="width:18px;height:18px;cursor:pointer;" onchange="updateSubjectAttendance(this)">
            <div class="avatar avatar-sm">${getInitials(s.name)}</div>
            <div>
              <strong style="font-size:var(--fs-sm)">${escapeHtml(s.name)}</strong>
              <p style="margin:0;font-size:var(--fs-xs);" class="text-tertiary">${escapeHtml(s.regNo)}</p>
            </div>
          </label>
        `).join('')}
      </div>
      <button class="btn btn-primary" style="margin-top:var(--sp-4); width:100%;" onclick="saveBiometricAttendance()">✅ Save Attendance</button>
    </div>
  `;
}

function updateSubjectAttendance(checkbox) {
  const label = checkbox.closest('label');
  if (label) {
    label.style.background = checkbox.checked ? 'rgba(34,197,94,0.08)' : '';
    label.style.borderColor = checkbox.checked ? 'var(--clr-success)' : 'var(--border-color)';
  }
}

function saveBiometricAttendance() {
  const checkboxes = document.querySelectorAll('#biometric-student-list input[type="checkbox"]');
  const today = new Date().toISOString().split('T')[0];
  const saved = JSON.parse(localStorage.getItem('cc_biometric_attendance') || '{}');
  saved[today] = saved[today] || {};
  
  let presentCount = 0;
  checkboxes.forEach(cb => {
    const regNo = cb.dataset.regno;
    const isPresent = cb.checked;
    saved[today][regNo] = isPresent ? 'present' : 'absent';
    if (isPresent) presentCount++;
    
    // Calculate total percentage for this student based on history
    let daysPresent = 0;
    let daysTotal = 0;
    Object.keys(saved).forEach(dateKey => {
      if (saved[dateKey][regNo]) {
        daysTotal++;
        if (saved[dateKey][regNo] === 'present') daysPresent++;
      }
    });
    const pct = daysTotal > 0 ? Math.round((daysPresent / daysTotal) * 100) : 0;
    localStorage.setItem(`biometric_attend_${regNo}`, pct);
  });
  
  localStorage.setItem('cc_biometric_attendance', JSON.stringify(saved));
  showToast(`Attendance saved: ${presentCount} present, ${checkboxes.length - presentCount} absent.`, 'success', 'Saved');
  const panel = document.getElementById('biometric-attendance-panel');
  if (panel) panel.style.display = 'none';
}

/* ── Manage Class Schedule ── */
function initClassScheduleSection() {
  renderProfTodaysClasses();
}

function renderProfTodaysClasses() {
  const container = document.getElementById('prof-todays-classes');
  if (!container) return;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[new Date().getDay()];
  
  // Get today's classes for the professor's branch. For demo, we use the main schedule.
  let classes = DEMO_DATA.schedule[currentDay] || [];
  
  // Fallback to Monday if today has no classes for demo purposes
  if (classes.length === 0) {
    classes = DEMO_DATA.schedule['Monday'] || [];
  }

  if (classes.length === 0) {
    container.innerHTML = `<p class="text-tertiary">No classes scheduled for today.</p>`;
    return;
  }

  container.innerHTML = classes.map((item, index) => {
    // Generate a unique ID for this class slot to track cancellation
    const cancelKey = `cancel_${currentDay}_${index}`;
    const isCancelled = localStorage.getItem(cancelKey) === 'true';

    return `
      <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4);">
        <div class="flex items-center gap-3">
          <div class="card-icon ${item.color}" style="font-size:1.2rem;width:40px;height:40px;">📖</div>
          <div>
            <h4 style="font-size:var(--fs-sm);margin-bottom:2px" class="${isCancelled ? 'text-tertiary' : ''}">
              ${isCancelled ? '<s>' : ''}${escapeHtml(item.subject)}${isCancelled ? '</s>' : ''}
            </h4>
            <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">
              ${escapeHtml(item.time)} - ${escapeHtml(item.endTime)} • Room ${escapeHtml(item.room)}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label style="font-size:var(--fs-xs); display:flex; align-items:center; gap:var(--sp-2); cursor:pointer;">
            <input type="checkbox" onchange="toggleCancelClass('${currentDay}', ${index}, this.checked)" ${isCancelled ? 'checked' : ''}>
            Cancel Class
          </label>
        </div>
      </div>
    `;
  }).join('');
}

function toggleCancelClass(day, index, isCancelled) {
  const cancelKey = `cancel_${day}_${index}`;
  localStorage.setItem(cancelKey, isCancelled.toString());
  showToast(isCancelled ? 'Class marked as Cancelled.' : 'Class cancellation reverted.', isCancelled ? 'warning' : 'success');
  // Update visual in-place to avoid re-render (fixes double-click bug)
  const card = document.querySelector(`input[onchange*="'${day}', ${index},"]`)?.closest('.card');
  if (card) {
    const h4 = card.querySelector('h4');
    if (h4) {
      h4.className = isCancelled ? 'text-tertiary' : '';
      h4.innerHTML = isCancelled ? `<s>${h4.textContent.trim()}</s>` : h4.textContent.trim();
    }
  }
}
