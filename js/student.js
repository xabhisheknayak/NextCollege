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
    ringContainer.innerHTML = createProgressRing(currentUser.attendance, 76);
  }

  // Today's schedule
  const todayDayName = getDayName(new Date().getDay());
  document.getElementById('today-day').textContent = todayDayName;

  const isScheduleUploaded = localStorage.getItem('ai_uploaded_schedule') === 'true';
  const todayClasses = DEMO_DATA.schedule[todayDayName] || DEMO_DATA.schedule['Monday'];
  const todayContainer = document.getElementById('today-schedule');
  
  if (todayContainer) {
    if (!isScheduleUploaded) {
      todayContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <h4>Schedule Not Uploaded</h4>
          <p>Professors have not uploaded the timetable yet.</p>
        </div>
      `;
    } else {
      todayContainer.innerHTML = todayClasses.map(item => `
        <div class="schedule-card">
          <div class="schedule-time-bar ${item.color}"></div>
          <div class="schedule-info">
            <div class="schedule-subject">${escapeHtml(item.subject)}</div>
            <div class="schedule-details">👨‍🏫 ${escapeHtml(item.faculty)} • 📍 ${escapeHtml(item.room)}</div>
          </div>
          <div class="schedule-time">${escapeHtml(item.time)}</div>
        </div>
      `).join('');
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

  const isScheduleUploaded = localStorage.getItem('ai_uploaded_schedule') === 'true';
  const badge = document.getElementById('schedule-ai-badge');
  if (badge) badge.style.display = isScheduleUploaded ? 'inline-block' : 'none';

  if (!isScheduleUploaded) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <h4>Schedule Not Uploaded</h4>
        <p>Your faculty hasn't uploaded the timetable yet.</p>
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
