/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Branch code mapping
const BRANCH_MAP = {
  '101': 'Computer Science',
  '102': 'Information Technology',
  '103': 'Electronics & Communication',
  '104': 'Electrical Engineering',
  '105': 'Computer Science',
  '106': 'Civil Engineering',
  '107': 'Chemical Engineering',
  '108': 'Biotechnology',
  '109': 'Aerospace Engineering',
  '110': 'Data Science & AI'
};

const BRANCH_SHORT = {
  '101': 'CSE',
  '102': 'IT',
  '103': 'ECE',
  '104': 'EE',
  '105': 'CSE',
  '106': 'CE',
  '107': 'CHE',
  '108': 'BT',
  '109': 'AE',
  '110': 'DSAI'
};

// Parse registration number: YY-BranchCode-CollegeID-RollNo
function parseRegNumber(regNo) {
  const parts = regNo.split('-');
  if (parts.length !== 4) return null;
  
  return {
    year: parseInt(parts[0]),
    branchCode: parts[1],
    collegeId: parts[2],
    rollNo: parts[3],
    branchName: BRANCH_MAP[parts[1]] || 'Unknown Branch',
    branchShort: BRANCH_SHORT[parts[1]] || 'UNK',
    fullYear: 2000 + parseInt(parts[0]),
    currentYear: Math.min(4, new Date().getFullYear() - (2000 + parseInt(parts[0])) + 1),
    semester: Math.min(8, (new Date().getFullYear() - (2000 + parseInt(parts[0]))) * 2 + (new Date().getMonth() >= 6 ? 2 : 1))
  };
}

// Format date
function formatDate(date, format = 'short') {
  const d = new Date(date);
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', hour12: true },
    datetime: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true },
    relative: null
  };
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', options.short);
  }
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Generate random ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Random anonymous handles
const ADJECTIVES = ['Silent', 'Swift', 'Brave', 'Clever', 'Mystic', 'Cosmic', 'Golden', 'Shadow', 'Storm', 'Crystal', 'Lunar', 'Solar', 'Thunder', 'Frost', 'Phoenix', 'Nova'];
const NOUNS = ['Fox', 'Eagle', 'Wolf', 'Hawk', 'Tiger', 'Panda', 'Falcon', 'Dragon', 'Lion', 'Owl', 'Bear', 'Deer', 'Raven', 'Phoenix', 'Lynx', 'Cobra'];

function generateAnonHandle() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

// Get initials from name
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Search filter utility
function filterItems(items, query, keys) {
  if (!query) return items;
  const q = query.toLowerCase().trim();
  return items.filter(item => 
    keys.some(key => {
      const val = item[key];
      return val && val.toString().toLowerCase().includes(q);
    })
  );
}

// Debounce utility
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Get day name
function getDayName(dayIndex) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
}

function getDayShort(dayIndex) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
}

// Get month name
function getMonthName(monthIndex) {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex];
}

// Calendar helpers
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Color for branch
function getBranchColor(branchCode) {
  const colors = {
    '101': '#6366f1',
    '102': '#14b8a6',
    '103': '#f59e0b',
    '104': '#f43f5e',
    '105': '#10b981',
    '106': '#8b5cf6',
    '107': '#06b6d4',
    '108': '#ec4899',
    '109': '#f97316',
    '110': '#3b82f6'
  };
  return colors[branchCode] || '#6366f1';
}

// Safely get/set localStorage
function getStorage(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage error:', e);
  }
}

// Session storage helpers
function getSession(key, defaultValue = null) {
  try {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Session storage error:', e);
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Truncate text
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
