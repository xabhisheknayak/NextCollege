/* ============================================
   STUDENT DASHBOARD LOGIC
   ============================================ */

let currentUser = null;
let currentChatTab = 'branch';
let selectedRating = 0;
let currentCalendarDate = new Date();
let currentLibraryFilter = 'all';
let currentDirectoryFilter = 'all';
let currentLFFilter = 'all';
let userAnonHandle = '';

document.addEventListener('DOMContentLoaded', () => {
  currentUser = requireAuth('student');
  if (!currentUser) return;

  initSidebar();
  initStudentProfile();
  initHomeSection();
  initScheduleSection();
  initAttendanceSection();
  initLibrarySection();
  initCopilotSection();
  initFeedbackSection();
  initChatSection();
  initAnonChatSection();
  initDirectorySection();
  initEventsSection();
  initNoticesSection();
  initLostFoundSection();
  initCampusMap();
  initEmergencySection();
  initHospitalSection();

  if (currentUser.isHosteler) {
    document.getElementById('hostel-nav').style.display = 'block';
    const qaHostel = document.getElementById('qa-hostel');
    if (qaHostel) qaHostel.style.display = 'flex';
    initHostelSection();
  }

  // Social feed, home preview, and DM system
  if (typeof initSocialPage === 'function') initSocialPage();

  // Social feed is initialized by social.js (initSocialPage called on DOMContentLoaded)
});


// Helper to switch section from quick actions or buttons
function switchToSection(sectionId) {
  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.click();
}

/* ── 1. Init Profile & Header Data ── */
function initStudentProfile() {
  const avatarText = getInitials(currentUser.name);

  // Set avatars
  ['sidebar-avatar', 'home-avatar', 'id-avatar', 'profile-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = avatarText;
  });

  // Sidebar
  const sbName = document.getElementById('sidebar-name');
  if (sbName) sbName.textContent = currentUser.name;

  // Header badges & greeting
  document.getElementById('greeting-text').textContent = `${getGreeting()}, ${currentUser.name.split(' ')[0]}!`;
  document.getElementById('greeting-name').textContent = `Reg: ${currentUser.regNo} • ${currentUser.isHosteler ? 'Hosteler 🏠' : 'Day Scholar 🚌'}`;

  const parsed = currentUser.parsed || parseRegNumber(currentUser.regNo);
  if (parsed) {
    document.getElementById('user-branch-badge').textContent = parsed.branchShort;
    document.getElementById('user-year-badge').textContent = `Year ${parsed.currentYear}`;
  }

  // Profile Section
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-reg').textContent = `Registration No: ${currentUser.regNo}`;
  document.getElementById('profile-branch-full').textContent = `${parsed ? parsed.branchName : 'Engineering'} (Year ${parsed ? parsed.currentYear : 1}, Sem ${parsed ? parsed.semester : 1})`;
  document.getElementById('profile-followers').textContent = currentUser.followers || 0;
  document.getElementById('profile-following').textContent = currentUser.following || 0;

  const badgesContainer = document.getElementById('profile-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = (currentUser.badges || ['🎓 Active Student']).map(badge => `
      <div class="card card-flat flex items-center gap-3" style="padding:var(--sp-3) var(--sp-4)">
        <span style="font-size:1.25rem">${badge.split(' ')[0]}</span>
        <span style="font-weight:var(--fw-medium);font-size:var(--fs-sm)">${badge.split(' ').slice(1).join(' ')}</span>
      </div>
    `).join('');
  }
}

/* ── 2. Home Section ── */
function initHomeSection() {
  document.getElementById('home-name').textContent = currentUser.name;
  document.getElementById('home-reg').textContent = currentUser.regNo;
  document.getElementById('home-attend-text').textContent = `${currentUser.attendance}%`;

  const parsed = currentUser.parsed || parseRegNumber(currentUser.regNo);
  document.getElementById('home-branch').textContent = parsed ? parsed.branchShort : 'ME';
  document.getElementById('home-yearsem').textContent = parsed ? `Year ${parsed.currentYear} / Sem ${parsed.semester}` : 'Yr 1';

  // Attendance ring
  const ringContainer = document.getElementById('home-attendance-ring');
  if (ringContainer) {
    ringContainer.innerHTML = createProgressRing(currentUser.attendance, 76, true);
  }

  // Today's schedule
  const todayDayName = getDayName(new Date().getDay());
  document.getElementById('today-day').textContent = todayDayName;

  const todayClasses = DEMO_DATA.schedule[todayDayName] || DEMO_DATA.schedule['Monday'];
  const todayContainer = document.getElementById('today-schedule');

  if (todayContainer) {
    if (!todayClasses || todayClasses.length === 0) {
      todayContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <h4>No Classes Today</h4>
          <p>Enjoy your off day!</p>
        </div>
      `;
    } else {
      const dateKey = getTodayKey();
      todayContainer.innerHTML = todayClasses
        .filter(item => item.type !== 'Break')
        .map((item, idx) => {
          const storageKey = `attend_${dateKey}_${todayDayName}_${idx}`;
          const status = localStorage.getItem(storageKey) || 'unmarked';
          return `
          <div class="today-class-row" id="tcr-${idx}">
            <div class="tcr-left">
              <div class="tcr-dot ${item.color}"></div>
              <div>
                <div class="tcr-subject">${escapeHtml(item.subject)}</div>
                <div class="tcr-meta">${escapeHtml(item.time)} &ndash; ${escapeHtml(item.endTime)} &bull; Room ${escapeHtml(item.room)}</div>
              </div>
            </div>
            <div class="tcr-right">
              <label class="attend-checkbox-wrap ${status === 'present' ? 'is-present' : ''}" title="Present">
                <input type="checkbox" class="attend-cb" data-day="${todayDayName}" data-idx="${idx}" data-status="present" ${status === 'present' ? 'checked' : ''} onchange="markTodayAttend('${todayDayName}', ${idx}, 'present', this)">
                <span class="attend-cb-label">✅ Present</span>
              </label>
              <label class="attend-checkbox-wrap ${status === 'absent' ? 'is-absent' : ''}" title="Absent">
                <input type="checkbox" class="attend-cb" data-day="${todayDayName}" data-idx="${idx}" data-status="absent" ${status === 'absent' ? 'checked' : ''} onchange="markTodayAttend('${todayDayName}', ${idx}, 'absent', this)">
                <span class="attend-cb-label">❌ Absent</span>
              </label>
            </div>
          </div>`;
        }).join('');
    }
  }

  // Biometric Attendance
  const isAttendanceUploaded = localStorage.getItem('ai_uploaded_attendance') === 'true';
  const attendanceCard = document.getElementById('biometric-attendance-card');
  const attendanceContent = document.getElementById('biometric-attendance-content');
  if (attendanceCard && attendanceContent) {
    if (isAttendanceUploaded) {
      attendanceCard.style.display = 'block';
      const userBranchClasses = todayClasses.filter(c => true); // Show all today's classes for simplicity
      attendanceContent.innerHTML = userBranchClasses.map(item => `
        <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-3);">
          <div>
            <div style="font-weight:var(--fw-medium); font-size:var(--fs-sm);">${escapeHtml(item.subject)}</div>
            <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${escapeHtml(item.time)}</div>
          </div>
          <span class="badge badge-success">Present</span>
        </div>
      `).join('');
    } else {
      attendanceCard.style.display = 'none';
    }
  }

  // Digital ID card section
  document.getElementById('id-name').textContent = currentUser.name;
  document.getElementById('id-reg').textContent = currentUser.regNo;
  document.getElementById('id-email').textContent = currentUser.email;
  document.getElementById('id-branch').textContent = parsed ? parsed.branchName : 'Mechanical';
  document.getElementById('id-year').textContent = `Year ${parsed ? parsed.currentYear : 1}`;
  document.getElementById('id-attendance').textContent = `${currentUser.attendance}%`;
}

/* ── 3. Schedule Section ── */
function initScheduleSection() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = getDayName(new Date().getDay());
  const activeDay = days.includes(currentDay) ? currentDay : 'Monday';

  const tabsContainer = document.getElementById('schedule-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = days.map(d => `
      <button class="tab-btn ${d === activeDay ? 'active' : ''}" onclick="renderScheduleForDay('${d}')">${d}</button>
    `).join('');
  }

  renderScheduleForDay(activeDay);
}

function renderScheduleForDay(day) {
  document.querySelectorAll('#schedule-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === day);
  });

  const classes = DEMO_DATA.schedule[day] || [];
  const container = document.getElementById('schedule-content');
  if (!container) return;

  const badge = document.getElementById('schedule-ai-badge');
  if (badge) badge.style.display = 'none';

  if (classes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎉</div>
        <h4>No Classes Scheduled</h4>
        <p>Enjoy your off day!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="flex flex-col gap-4">
      ${classes.map((item, index) => {
    const attendanceState = localStorage.getItem(`self_attend_${day}_${index}`) || 'unmarked';
    return `
        <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-5);">
          <div class="flex items-center gap-4">
            <div class="card-icon ${item.color}">📖</div>
            <div>
              <h4 style="margin-bottom:2px">${escapeHtml(item.subject)}</h4>
              <p style="margin:0;font-size:var(--fs-xs)" class="text-tertiary">
                👨‍🏫 ${escapeHtml(item.faculty)} • 📍 Room ${escapeHtml(item.room)} • <span class="badge badge-neutral">${item.type}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div style="font-weight:var(--fw-semibold);color:var(--clr-primary-600);font-size:var(--fs-sm)">
              ${escapeHtml(item.time)} - ${escapeHtml(item.endTime)}
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm ${attendanceState === 'present' ? 'btn-primary' : 'btn-secondary'}" onclick="markSelfAttendance('${day}', ${index}, 'present')" aria-label="Mark Present">✅</button>
              <button class="btn btn-sm ${attendanceState === 'absent' ? 'btn-danger' : 'btn-secondary'}" onclick="markSelfAttendance('${day}', ${index}, 'absent')" aria-label="Mark Absent">❌</button>
            </div>
          </div>
        </div>
        `;
  }).join('')}
    </div>
  `;
}

function markSelfAttendance(day, index, status) {
  localStorage.setItem(`self_attend_${day}_${index}`, status);
  renderScheduleForDay(day);
}

/* ── 4. Digital Library ── */
function initLibrarySection() {
  renderLibrary();
  document.getElementById('library-search')?.addEventListener('input', debounce(() => renderLibrary(), 300));
}

function filterLibrary(type) {
  currentLibraryFilter = type;
  document.querySelectorAll('#section-library .tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(type === 'question-paper' ? 'paper' : type));
  });
  renderLibrary();
}

function renderLibrary() {
  const search = document.getElementById('library-search')?.value || '';
  let items = DEMO_DATA.library;

  if (currentLibraryFilter !== 'all') {
    items = items.filter(i => i.type === currentLibraryFilter);
  }

  items = filterItems(items, search, ['title', 'author', 'subject']);

  const container = document.getElementById('library-grid');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📖</div><h4>No Resources Found</h4></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-3)">
        <span class="badge badge-primary">${escapeHtml(item.subject)}</span>
        <span class="badge badge-neutral">Sem ${item.semester}</span>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(item.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-4)">By ${escapeHtml(item.author)} • ${item.pages} Pages</p>
      <div class="flex justify-between items-center" style="padding-top:var(--sp-3);border-top:1px solid var(--border-color)">
        <small class="text-tertiary">📥 ${item.downloads} downloads</small>
        <button class="btn btn-sm btn-primary" onclick="downloadResource('${escapeHtml(item.title)}')">⬇️ Download ${item.format}</button>
      </div>
    </div>
  `).join('');
}

function downloadResource(title) {
  showToast(`Downloading "${title}"...`, 'success', 'Library');
}

/* ── 5. AI Copilot Section ── */
function initCopilotSection() {
  const container = document.getElementById('copilot-chat');
  if (!container) return;

  container.innerHTML = `
    <div class="chat-bubble received">
      <div class="chat-sender">🤖 AI Study Copilot</div>
      Hello ${escapeHtml(currentUser.name)}! I am your AI campus study assistant. How can I help you today?
    </div>
  `;
}

function sendCopilotMessage() {
  const input = document.getElementById('copilot-input');
  const query = input?.value.trim();
  if (!query) return;

  const container = document.getElementById('copilot-chat');

  // Render user message
  container.innerHTML += `
    <div class="chat-bubble sent">
      ${escapeHtml(query)}
    </div>
  `;

  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Bot response lookup
  setTimeout(() => {
    let reply = DEMO_DATA.aiResponses.default;
    const lower = query.toLowerCase();

    for (const [key, text] of Object.entries(DEMO_DATA.aiResponses)) {
      if (lower.includes(key)) {
        reply = text;
        break;
      }
    }

    container.innerHTML += `
      <div class="chat-bubble received">
        <div class="chat-sender">🤖 AI Study Copilot</div>
        ${reply.replace(/\n/g, '<br>')}
      </div>
    `;
    container.scrollTop = container.scrollHeight;
  }, 600);
}

/* ── 6. Feedback Section ── */
function initFeedbackSection() {
  createStarRating('feedback-stars', 0, (val) => { selectedRating = val; });
  renderFeedbackList();
}

function submitFeedback() {
  const subject = document.getElementById('feedback-subject')?.value;
  const comment = document.getElementById('feedback-comment')?.value.trim();

  if (!subject || selectedRating === 0) {
    showToast('Please select subject and rating', 'warning', 'Feedback');
    return;
  }

  const feedbacks = getStorage('feedback', DEMO_DATA.feedback);
  feedbacks.unshift({
    id: generateId(),
    subject: subject,
    faculty: 'Faculty',
    rating: selectedRating,
    comment: comment || 'No comments provided',
    date: new Date().toISOString().split('T')[0],
    anonymous: true
  });

  setStorage('feedback', feedbacks);
  showToast('Anonymous feedback submitted!', 'success');

  document.getElementById('feedback-subject').value = '';
  document.getElementById('feedback-comment').value = '';
  createStarRating('feedback-stars', 0, (val) => { selectedRating = val; });

  renderFeedbackList();
}

function renderFeedbackList() {
  const feedbacks = getStorage('feedback', DEMO_DATA.feedback);
  const container = document.getElementById('feedback-list');
  if (!container) return;

  container.innerHTML = feedbacks.slice(0, 5).map(fb => `
    <div class="card card-flat" style="margin-bottom:var(--sp-3);padding:var(--sp-4)">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <strong style="font-size:var(--fs-sm)">${escapeHtml(fb.subject)}</strong>
        <span style="color:var(--clr-warning-500)">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</span>
      </div>
      <p style="font-size:var(--fs-xs);margin:0;color:var(--text-secondary)">"${escapeHtml(fb.comment)}"</p>
      <small class="text-tertiary" style="font-size:0.65rem">Submitted anonymously on ${fb.date}</small>
    </div>
  `).join('');
}

/* ── 7. Branch Chat Section ── */
function initChatSection() {
  const parsed = currentUser.parsed || parseRegNumber(currentUser.regNo);
  const branchKey = `branch-${parsed ? parsed.branchCode : '105'}`;
  renderChatMessages(branchKey);
}

function switchChatTab(tab) {
  currentChatTab = tab;
  document.getElementById('chat-tab-branch').classList.toggle('active', tab === 'branch');
  document.getElementById('chat-tab-all').classList.toggle('active', tab === 'all');

  const parsed = currentUser.parsed || parseRegNumber(currentUser.regNo);
  const key = tab === 'branch' ? `branch-${parsed ? parsed.branchCode : '105'}` : 'all-campus';
  renderChatMessages(key);
}

function renderChatMessages(key) {
  const allChats = getStorage('chatMessages', DEMO_DATA.chatMessages);
  const msgs = allChats[key] || [];
  const container = document.getElementById('chat-messages');
  if (!container) return;

  if (msgs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No messages yet. Start the conversation!</p></div>';
    return;
  }

  container.innerHTML = msgs.map(m => {
    const isMe = m.regNo === currentUser.regNo;
    return `
      <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
        <div class="chat-sender">${isMe ? 'You' : escapeHtml(m.sender)}</div>
        ${escapeHtml(m.text)}
        <div class="chat-time">${formatTime(m.time)}</div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input?.value.trim();
  if (!text) return;

  const parsed = currentUser.parsed || parseRegNumber(currentUser.regNo);
  const key = currentChatTab === 'branch' ? `branch-${parsed ? parsed.branchCode : '105'}` : 'all-campus';

  const allChats = getStorage('chatMessages', DEMO_DATA.chatMessages);
  if (!allChats[key]) allChats[key] = [];

  allChats[key].push({
    id: generateId(),
    sender: currentUser.name,
    regNo: currentUser.regNo,
    text: text,
    time: new Date().toISOString()
  });

  setStorage('chatMessages', allChats);
  input.value = '';
  renderChatMessages(key);
}

/* ── 8. Anonymous Chat Section ── */
function initAnonChatSection() {
  userAnonHandle = getSession('anonHandle') || generateAnonHandle();
  setSession('anonHandle', userAnonHandle);

  const badge = document.getElementById('anon-handle');
  if (badge) badge.textContent = `Handle: ${userAnonHandle}`;

  renderAnonMessages();
}

function renderAnonMessages() {
  const allChats = getStorage('chatMessages', DEMO_DATA.chatMessages);
  const msgs = allChats['anonymous'] || [];
  const container = document.getElementById('anon-messages');
  if (!container) return;

  container.innerHTML = msgs.map(m => {
    const isMe = m.sender === userAnonHandle;
    return `
      <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
        <div class="chat-sender">${isMe ? 'You (' + userAnonHandle + ')' : escapeHtml(m.sender)}</div>
        ${escapeHtml(m.text)}
        <div class="chat-time">${formatTime(m.time)}</div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function sendAnonMessage() {
  const input = document.getElementById('anon-input');
  const text = input?.value.trim();
  if (!text) return;

  const allChats = getStorage('chatMessages', DEMO_DATA.chatMessages);
  if (!allChats['anonymous']) allChats['anonymous'] = [];

  allChats['anonymous'].push({
    id: generateId(),
    sender: userAnonHandle,
    text: text,
    time: new Date().toISOString()
  });

  setStorage('chatMessages', allChats);
  input.value = '';
  renderAnonMessages();
}

/* ── 9. Directory Section ── */
function initDirectorySection() {
  renderDirectory();
  document.getElementById('directory-search')?.addEventListener('input', debounce(() => renderDirectory(), 300));
}

function filterDirectory(type) {
  currentDirectoryFilter = type;
  document.querySelectorAll('#section-directory .tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(type));
  });
  renderDirectory();
}

function renderDirectory() {
  const search = document.getElementById('directory-search')?.value || '';
  let students = DEMO_DATA.students;
  let faculty = DEMO_DATA.professors;

  if (currentDirectoryFilter === 'students') faculty = [];
  if (currentDirectoryFilter === 'faculty') students = [];

  students = filterItems(students, search, ['name', 'regNo', 'email']);
  faculty = filterItems(faculty, search, ['name', 'department', 'email']);

  const container = document.getElementById('directory-list');
  if (!container) return;

  let html = '<div class="grid-2">';

  students.forEach(s => {
    const parsed = parseRegNumber(s.regNo);
    html += `
      <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4)">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-md">${getInitials(s.name)}</div>
          <div>
            <h4 style="font-size:var(--fs-sm);margin-bottom:2px">${escapeHtml(s.name)}</h4>
            <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${s.regNo} • ${parsed ? parsed.branchShort : 'ME'}</p>
          </div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="toggleFollow(this)">Follow</button>
      </div>
    `;
  });

  faculty.forEach(f => {
    html += `
      <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4)">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-md" style="background:var(--grad-accent)">${getInitials(f.name)}</div>
          <div>
            <h4 style="font-size:var(--fs-sm);margin-bottom:2px">${escapeHtml(f.name)}</h4>
            <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${escapeHtml(f.title)} • ${escapeHtml(f.department)}</p>
          </div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="toggleFollow(this)">Follow</button>
      </div>
    `;
  });

  html += '</div>';

  if (students.length === 0 && faculty.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><h4>No Users Found</h4></div>';
    return;
  }

  container.innerHTML = html;
}

function toggleFollow(btn) {
  if (btn.textContent === 'Follow') {
    btn.textContent = 'Following';
    btn.className = 'btn btn-sm btn-primary';
    showToast('User followed', 'success');
  } else {
    btn.textContent = 'Follow';
    btn.className = 'btn btn-sm btn-secondary';
  }
}

/* ── 10. Events Section ── */
function initEventsSection() {
  renderEvents();
}

function changeCalendarMonth(delta) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
  renderEvents();
}

function renderEvents() {
  const events = getStorage('events', DEMO_DATA.events);
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const titleEl = document.getElementById('calendar-title');
  if (titleEl) titleEl.textContent = `${getMonthName(month)} ${year}`;

  generateCalendar('calendar-container', year, month, events);

  const listContainer = document.getElementById('events-list');
  if (!listContainer) return;

  listContainer.innerHTML = events.slice(0, 4).map(e => `
    <div class="card card-flat" style="padding:var(--sp-4)">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-accent">${e.type.toUpperCase()}</span>
        <small class="text-tertiary">📍 ${escapeHtml(e.venue)}</small>
      </div>
      <h4 style="font-size:var(--fs-sm);margin-bottom:var(--sp-1)">${escapeHtml(e.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-2)">${escapeHtml(e.description)}</p>
      <small style="color:var(--clr-primary-600);font-weight:var(--fw-semibold)">🗓️ ${e.date} ${e.endDate ? ' to ' + e.endDate : ''}</small>
    </div>
  `).join('');
}

/* ── 11. Notices Section ── */
function initNoticesSection() {
  const notices = getStorage('notices', DEMO_DATA.notices);
  const container = document.getElementById('notices-list');
  if (!container) return;

  container.innerHTML = notices.map(n => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${n.priority === 'urgent' ? 'danger' : n.priority === 'important' ? 'warning' : 'primary'}">
          ${n.priority.toUpperCase()}
        </span>
        <small class="text-tertiary">${formatDate(n.date)}</small>
      </div>
      <h4 style="margin-bottom:var(--sp-2)">${escapeHtml(n.title)}</h4>
      <p style="font-size:var(--fs-sm);margin-bottom:var(--sp-3)">${escapeHtml(n.content)}</p>
      <small style="font-weight:var(--fw-medium)">— ${escapeHtml(n.author)}</small>
    </div>
  `).join('');
}

/* ── 12. Lost & Found Section ── */
function initLostFoundSection() {
  renderLostFound();
}

function filterLostFound(type) {
  currentLFFilter = type;
  document.querySelectorAll('#section-lostfound .tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(type));
  });
  renderLostFound();
}

function renderLostFound() {
  let items = getStorage('lostFound', DEMO_DATA.lostFound);
  if (currentLFFilter !== 'all') {
    items = items.filter(i => i.type === currentLFFilter);
  }

  const container = document.getElementById('lostfound-list');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔎</div><h4>No Items Reported</h4></div>';
    return;
  }

  container.innerHTML = items.map(i => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${i.type === 'lost' ? 'danger' : 'success'}">${i.type.toUpperCase()}</span>
        <span class="badge badge-neutral">${i.status.toUpperCase()}</span>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(i.title)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-2)">${escapeHtml(i.description)}</p>
      <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-bottom:var(--sp-3)">
        📍 ${escapeHtml(i.location)} • 📅 ${i.date} • 👤 ${escapeHtml(i.author)}
      </div>
      ${i.status === 'open' ? `<button class="btn btn-sm btn-secondary" onclick="claimLFItem('${i.id}')">Contact Finder/Owner</button>` : '<span class="badge badge-neutral">Claimed</span>'}
    </div>
  `).join('');
}

function submitLostFound() {
  const title = document.getElementById('lf-title')?.value.trim();
  const category = document.getElementById('lf-category')?.value;
  const type = document.getElementById('lf-type')?.value;
  const location = document.getElementById('lf-location')?.value.trim();
  const desc = document.getElementById('lf-description')?.value.trim();

  if (!title || !location) {
    showToast('Please provide item title and location', 'warning');
    return;
  }

  const items = getStorage('lostFound', DEMO_DATA.lostFound);
  items.unshift({
    id: generateId(),
    title: title,
    type: type,
    category: category,
    location: location,
    date: new Date().toISOString().split('T')[0],
    description: desc || 'No description',
    author: currentUser.name,
    contact: currentUser.phone,
    status: 'open'
  });

  setStorage('lostFound', items);
  closeModal('modal-lostfound');
  showToast('Item report submitted!', 'success');
  renderLostFound();
}

function claimLFItem(id) {
  showToast('Contact details copied to clipboard!', 'info', 'Lost & Found');
}

/* ── 13. Campus Map ── */
function initCampusMap() {
  const container = document.getElementById('campus-map');
  if (!container) return;

  const buildings = DEMO_DATA.campusBuildings;

  // Interactive SVG Map
  let svgHtml = `
    <svg width="100%" height="100%" viewBox="0 0 800 500" style="background:var(--bg-surface-alt)">
      <!-- Campus Roads -->
      <path d="M 100 200 L 700 200 M 350 100 L 350 450 M 500 150 L 500 450" stroke="var(--border-color)" stroke-width="20" stroke-linecap="round" fill="none" />
      <path d="M 100 200 L 700 200 M 350 100 L 350 450 M 500 150 L 500 450" stroke="var(--clr-neutral-300)" stroke-width="2" stroke-dasharray="8,8" fill="none" />
  `;

  // Draw building nodes
  buildings.forEach(b => {
    const isAcademic = b.type === 'academic' || b.type === 'library' || b.type === 'lab';
    const color = isAcademic ? '#6366f1' : b.type === 'food' ? '#f59e0b' : b.type === 'hostel' ? '#8b5cf6' : '#f43f5e';

    svgHtml += `
      <g class="map-node" style="cursor:pointer" onclick="showBuildingDetails('${b.id}')">
        <rect x="${b.x - 45}" y="${b.y - 30}" width="90" height="60" rx="12" fill="${color}" opacity="0.85" />
        <text x="${b.x}" y="${b.y - 5}" font-size="11" font-weight="bold" fill="white" text-anchor="middle">${escapeHtml(b.name.split(' ')[0])}</text>
        <text x="${b.x}" y="${b.y + 12}" font-size="9" fill="rgba(255,255,255,0.8)" text-anchor="middle">${escapeHtml(b.name.split(' ').slice(1).join(' '))}</text>
      </g>
    `;
  });

  svgHtml += '</svg>';
  container.innerHTML = svgHtml;

  // Map legend
  const legend = document.getElementById('map-legend');
  if (legend) {
    legend.innerHTML = buildings.slice(0, 6).map(b => `
      <div class="card card-flat flex items-center gap-3" style="padding:var(--sp-3);cursor:pointer" onclick="showBuildingDetails('${b.id}')">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--clr-primary-500)"></div>
        <div>
          <strong style="font-size:var(--fs-xs)">${escapeHtml(b.name)}</strong>
          <p style="font-size:0.65rem;margin:0" class="text-tertiary">${escapeHtml(b.description)}</p>
        </div>
      </div>
    `).join('');
  }
}

function showBuildingDetails(id) {
  const b = DEMO_DATA.campusBuildings.find(item => item.id === id);
  if (b) {
    showToast(`📍 ${b.name}: ${b.description}`, 'info', 'Campus Navigator');
  }
}

/* ── 14. Emergency SOS & Hospital ── */
function initEmergencySection() {
  const container = document.getElementById('emergency-contacts');
  if (!container) return;

  container.innerHTML = DEMO_DATA.emergencyContacts.map(c => `
    <div class="card card-flat flex items-center justify-between" style="padding:var(--sp-4)">
      <div class="flex items-center gap-3">
        <span style="font-size:1.75rem">${c.icon}</span>
        <div>
          <strong style="font-size:var(--fs-sm)">${escapeHtml(c.name)}</strong>
          <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">Available 24/7</p>
        </div>
      </div>
      <a href="tel:${c.phone}" class="btn btn-sm btn-danger">📞 ${c.phone}</a>
    </div>
  `).join('');
}

function triggerSOS() {
  openModal('modal-sos');
}

function initHospitalSection() {
  const container = document.getElementById('hospital-list');
  if (!container) return;

  container.innerHTML = DEMO_DATA.hospitals.map(h => `
    <div class="card">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-accent">${h.type}</span>
        <span class="badge badge-success">Available</span>
      </div>
      <h4 style="margin-bottom:var(--sp-1)">${escapeHtml(h.name)}</h4>
      <p style="font-size:var(--fs-xs);margin-bottom:var(--sp-3)">📍 ${escapeHtml(h.address)} (${h.distance})</p>
      <a href="tel:${h.phone}" class="btn btn-sm btn-primary w-full">📞 Call Emergency: ${h.phone}</a>
    </div>
  `).join('');
}

/* ── 15. Hostel Section ── */
function initHostelSection() {
  const rulesContainer = document.getElementById('hostel-rules');
  if (rulesContainer) {
    rulesContainer.innerHTML = DEMO_DATA.hostelRules.map((rule, idx) => `
      <div class="flex items-start gap-3" style="font-size:var(--fs-sm)">
        <span class="badge badge-primary" style="flex-shrink:0;margin-top:2px">${idx + 1}</span>
        <span>${escapeHtml(rule)}</span>
      </div>
    `).join('');
  }

  renderHostelComplaints();
}

function submitHostelComplaint() {
  const title = document.getElementById('hc-title')?.value.trim();
  const category = document.getElementById('hc-category')?.value;
  const desc = document.getElementById('hc-description')?.value.trim();

  if (!title) {
    showToast('Please provide a complaint title', 'warning');
    return;
  }

  const complaints = getStorage('complaints', DEMO_DATA.complaints);
  complaints.unshift({
    id: generateId(),
    title: title,
    category: 'hostel',
    status: 'pending',
    author: currentUser.name,
    regNo: currentUser.regNo,
    date: new Date().toISOString().split('T')[0],
    description: desc || category,
    assignedTo: 'Hostel Warden'
  });

  setStorage('complaints', complaints);
  closeModal('modal-hostel-complaint');
  showToast('Hostel complaint submitted to Warden!', 'success');
  renderHostelComplaints();
}

function submitOutpass() {
  const reason = document.getElementById('op-reason')?.value.trim();
  closeModal('modal-outpass');
  showToast('Out-Pass request submitted to Warden!', 'success');
}

function renderHostelComplaints() {
  const allComplaints = getStorage('complaints', DEMO_DATA.complaints);
  const myComplaints = allComplaints.filter(c => c.regNo === currentUser.regNo || c.category === 'hostel');

  const container = document.getElementById('hostel-complaints');
  if (!container) return;

  if (myComplaints.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No complaints submitted yet.</p></div>';
    return;
  }

  container.innerHTML = myComplaints.map(c => `
    <div class="card card-flat" style="margin-bottom:var(--sp-3);padding:var(--sp-4)">
      <div class="flex justify-between items-center" style="margin-bottom:var(--sp-2)">
        <span class="badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in-progress' ? 'warning' : 'danger'}">
          ${c.status.toUpperCase()}
        </span>
        <small class="text-tertiary">${c.date}</small>
      </div>
      <h4 style="font-size:var(--fs-sm);margin-bottom:var(--sp-1)">${escapeHtml(c.title)}</h4>
      <p style="font-size:var(--fs-xs);margin:0" class="text-tertiary">${escapeHtml(c.description)}</p>
    </div>
  `).join('');
}

/* ── 15. Home People Search & User Profiles ── */
let currentViewedUser = null;

function handleHomeSearch(query) {
  const resultsContainer = document.getElementById('home-search-results');
  if (!query || query.trim().length < 2) {
    resultsContainer.style.display = 'none';
    return;
  }

  query = query.toLowerCase().trim();

  const studentResults = DEMO_DATA.students.filter(s => s.name.toLowerCase().includes(query) || s.regNo.toLowerCase().includes(query));
  const profResults = DEMO_DATA.professors.filter(p => p.name.toLowerCase().includes(query) || (p.department && p.department.toLowerCase().includes(query)));

  const allResults = [...studentResults, ...profResults];

  if (allResults.length === 0) {
    resultsContainer.innerHTML = '<div style="padding:var(--sp-2) var(--sp-4); color:var(--text-tertiary);">No people found.</div>';
    resultsContainer.style.display = 'block';
    return;
  }

  resultsContainer.innerHTML = allResults.map(user => {
    const isProf = user.hasOwnProperty('department');
    const roleText = isProf ? user.title || 'Professor' : `Student • ${user.regNo}`;
    const id = isProf ? user.id : user.regNo;
    return `
      <div class="search-result-item flex items-center gap-3" style="padding:var(--sp-2) var(--sp-4); cursor:pointer; border-bottom:1px solid var(--border-light); transition: background var(--transition-base);" onmouseover="this.style.background='var(--bg-surface-alt)'" onmouseout="this.style.background='transparent'" onclick="showUserProfile('${id}', ${isProf})">
        <div class="avatar avatar-sm">${getInitials(user.name)}</div>
        <div>
          <div style="font-weight:var(--fw-medium); font-size:var(--fs-sm);">${escapeHtml(user.name)}</div>
          <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${escapeHtml(roleText)}</div>
        </div>
      </div>
    `;
  }).join('');

  resultsContainer.style.display = 'block';
}

function showUserProfile(id, isProf) {
  document.getElementById('home-search-results').style.display = 'none';
  document.getElementById('home-people-search').value = '';

  let user = null;
  if (isProf) {
    user = DEMO_DATA.professors.find(p => p.id === id);
  } else {
    user = DEMO_DATA.students.find(s => s.regNo === id);
  }

  if (!user) return;
  currentViewedUser = user;
  currentViewedUser.isProf = isProf;

  document.getElementById('up-avatar').textContent = getInitials(user.name);
  document.getElementById('up-name').textContent = user.name;

  if (isProf) {
    document.getElementById('up-role').textContent = `${user.title || 'Professor'} • ${user.department}`;
  } else {
    const parsed = parseRegNumber(user.regNo);
    document.getElementById('up-role').textContent = `Student • ${parsed ? parsed.branchShort : ''} • ${user.regNo}`;
  }

  document.getElementById('up-followers').textContent = user.followers || 0;
  document.getElementById('up-following').textContent = user.following || 0;

  const followBtn = document.getElementById('up-follow-btn');
  const isFollowing = currentUser.followingList && currentUser.followingList.includes(id);

  if (isFollowing) {
    followBtn.textContent = 'Following';
    followBtn.className = 'btn btn-secondary';
  } else {
    followBtn.textContent = 'Follow';
    followBtn.className = 'btn btn-primary';
  }

  openModal('modal-user-profile');
}

function toggleFollowUser() {
  if (!currentViewedUser) return;

  const followBtn = document.getElementById('up-follow-btn');
  const id = currentViewedUser.isProf ? currentViewedUser.id : currentViewedUser.regNo;

  if (!currentUser.followingList) currentUser.followingList = [];

  const index = currentUser.followingList.indexOf(id);
  if (index > -1) {
    currentUser.followingList.splice(index, 1);
    currentViewedUser.followers = Math.max(0, (currentViewedUser.followers || 1) - 1);
    followBtn.textContent = 'Follow';
    followBtn.className = 'btn btn-primary';
  } else {
    currentUser.followingList.push(id);
    currentViewedUser.followers = (currentViewedUser.followers || 0) + 1;
    followBtn.textContent = 'Following';
    followBtn.className = 'btn btn-secondary';
  }

  document.getElementById('up-followers').textContent = currentViewedUser.followers;
}

function messageUser() {
  if (!currentViewedUser) return;
  closeModal('modal-user-profile');

  switchToSection('messages');

  if (typeof showToast === 'function') {
    showToast(`Started chat with ${currentViewedUser.name}`, 'success', 'Messages');
  }
}

/* ── ATTENDANCE HELPER FUNCTIONS ── */
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function markTodayAttend(day, idx, status, checkbox) {
  const dateKey = getTodayKey();
  const storageKey = `attend_${dateKey}_${day}_${idx}`;
  const currentStatus = localStorage.getItem(storageKey) || 'unmarked';

  // Toggle: if clicking same status again, unmark it
  if (currentStatus === status) {
    localStorage.removeItem(storageKey);
    checkbox.checked = false;
  } else {
    localStorage.setItem(storageKey, status);
    // Uncheck the other checkbox in same row
    const row = document.getElementById(`tcr-${idx}`);
    if (row) {
      row.querySelectorAll('.attend-cb').forEach(cb => {
        if (cb.dataset.status !== status) cb.checked = false;
      });
    }
  }

  // Refresh row styles
  const row = document.getElementById(`tcr-${idx}`);
  if (row) {
    const newStatus = localStorage.getItem(storageKey) || 'unmarked';
    row.querySelectorAll('.attend-checkbox-wrap').forEach(wrap => {
      wrap.classList.remove('is-present', 'is-absent');
      if (newStatus === 'present') wrap.querySelector('.attend-cb').dataset.status === 'present' && wrap.classList.add('is-present');
      if (newStatus === 'absent') wrap.querySelector('.attend-cb').dataset.status === 'absent' && wrap.classList.add('is-absent');
    });
  }

  // Refresh attendance section if visible
  if (document.getElementById('section-attendance')?.classList.contains('active')) {
    renderAttendanceSection();
  }

  showToast(`${status === 'present' ? 'Marked Present ✅' : 'Marked Absent ❌'} for ${DEMO_DATA.schedule[day]?.filter(i => i.type !== 'Break')[idx]?.subject || 'class'}`, 'success', 'Attendance');
}

/* ── 16. Attendance Tracker Section ── */
function initAttendanceSection() {
  // Render when section becomes active
  const navBtn = document.querySelector('.nav-item[data-section="attendance"]');
  if (navBtn) {
    navBtn.addEventListener('click', () => setTimeout(renderAttendanceSection, 50));
  }
}

function getSubjectAttendanceData() {
  const subjects = {};
  const log = [];

  // Gather all days
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  allDays.forEach(day => {
    const classes = (DEMO_DATA.schedule[day] || []).filter(i => i.type !== 'Break');
    classes.forEach((item, idx) => {
      const subj = item.subject;
      if (!subjects[subj]) subjects[subj] = { present: 0, absent: 0, total: 0, color: item.color };

      // Scan last 30 days worth of keys in localStorage
      for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
        if (dayName !== day) continue;
        const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        const storageKey = `attend_${dateKey}_${day}_${idx}`;
        const status = localStorage.getItem(storageKey);
        if (status) {
          subjects[subj].total++;
          if (status === 'present') subjects[subj].present++;
          else subjects[subj].absent++;
          log.push({ date: `${d.getDate()}/${d.getMonth() + 1}`, day, subject: subj, status, time: item.time });
        }
      }
    });
  });

  log.sort((a, b) => b.date.localeCompare(a.date));
  return { subjects, log };
}

function renderAttendanceSection() {
  const { subjects, log } = getSubjectAttendanceData();

  // Overall
  let totalPresent = 0, totalClasses = 0;
  Object.values(subjects).forEach(s => { totalPresent += s.present; totalClasses += s.total; });
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const pctBadge = document.getElementById('overall-pct-badge');
  if (pctBadge) {
    pctBadge.textContent = `${overallPct}%`;
    pctBadge.className = `badge ${overallPct >= 75 ? 'badge-success' : overallPct >= 60 ? 'badge-warning' : 'badge-danger'}`;
  }

  const barEl = document.getElementById('overall-attendance-bar');
  if (barEl) {
    const barColor = overallPct >= 75 ? 'var(--clr-success-500)' : overallPct >= 60 ? '#f59e0b' : 'var(--clr-danger-500)';
    barEl.innerHTML = `
      <div style="display:flex; align-items:center; gap:var(--sp-3);">
        <div style="flex:1; height:12px; border-radius:99px; background:var(--border-color); overflow:hidden;">
          <div style="height:100%; width:${overallPct}%; background:${barColor}; border-radius:99px; transition:width 0.6s ease;"></div>
        </div>
        <span style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:${barColor};">${overallPct}%</span>
      </div>
      <div style="margin-top:var(--sp-2); font-size:var(--fs-xs); color:var(--text-tertiary);">${totalPresent} present out of ${totalClasses} tracked classes &bull; ${totalClasses === 0 ? 'Mark attendance from Today\'s Schedule on Home page' : (overallPct < 75 ? '⚠️ Below 75% threshold — attend more classes!' : '🙌 Great attendance!')}</div>
    `;
  }

  // Subject cards
  const grid = document.getElementById('subject-attendance-grid');
  if (grid) {
    const subjectKeys = Object.keys(subjects);
    if (subjectKeys.length === 0) {
      grid.innerHTML = `<div class="card" style="grid-column:1/-1;"><div class="empty-state"><div class="empty-state-icon">📝</div><h4>No Attendance Marked Yet</h4><p>Go to Home and mark your attendance using the checkboxes in Today's Schedule.</p></div></div>`;
    } else {
      grid.innerHTML = subjectKeys.map(subj => {
        const s = subjects[subj];
        const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
        const barColor = pct >= 75 ? 'var(--clr-success-500)' : pct >= 60 ? '#f59e0b' : 'var(--clr-danger-500)';
        const statusEmoji = pct >= 75 ? '🙌' : pct >= 60 ? '⚠️' : '🚨';
        return `
        <div class="card card-flat" style="padding:var(--sp-5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--sp-3);">
            <div style="display:flex; align-items:center; gap:var(--sp-2);">
              <div class="card-icon ${s.color}" style="width:32px;height:32px;font-size:0.9rem;">📖</div>
              <div>
                <div style="font-weight:var(--fw-semibold); font-size:var(--fs-sm);">${escapeHtml(subj)}</div>
                <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${s.present}/${s.total} classes</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:var(--fw-bold); font-size:var(--fs-lg); color:${barColor};">${pct}%</div>
              <div style="font-size:0.7rem;">${statusEmoji}</div>
            </div>
          </div>
          <div style="height:8px; border-radius:99px; background:var(--border-color); overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:${barColor}; border-radius:99px; transition:width 0.6s ease;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:var(--sp-2); font-size:var(--fs-xs); color:var(--text-tertiary);">
            <span>🟢 ${s.present} Present</span>
            <span>🔴 ${s.absent} Absent</span>
          </div>
        </div>`;
      }).join('');
    }
  }

  // Log
  const logList = document.getElementById('attendance-log-list');
  const logBadge = document.getElementById('log-count-badge');
  if (logBadge) logBadge.textContent = `${log.length} entries`;
  if (logList) {
    if (log.length === 0) {
      logList.innerHTML = `<div style="text-align:center; padding:var(--sp-6); color:var(--text-tertiary); font-size:var(--fs-sm);">📝 No attendance records yet.</div>`;
    } else {
      logList.innerHTML = log.slice(0, 20).map(entry => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--sp-3) var(--sp-4); border-radius:var(--radius-lg); background:var(--bg-surface); border:1px solid var(--border-color);">
          <div style="display:flex; align-items:center; gap:var(--sp-3);">
            <span style="font-size:1.1rem;">${entry.status === 'present' ? '✅' : '❌'}</span>
            <div>
              <div style="font-weight:var(--fw-medium); font-size:var(--fs-sm);">${escapeHtml(entry.subject)}</div>
              <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${entry.day} &bull; ${entry.time}</div>
            </div>
          </div>
          <span class="badge ${entry.status === 'present' ? 'badge-success' : 'badge-danger'}">${entry.status === 'present' ? 'Present' : 'Absent'}</span>
        </div>
      `).join('');
    }
  }
}

function resetAllAttendance() {
  if (!confirm('Reset all attendance data? This cannot be undone.')) return;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('attend_')) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  renderAttendanceSection();
  // Also re-render today's schedule
  initHomeSection();
  showToast('All attendance data has been reset.', 'info', 'Reset');
}
