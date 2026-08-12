/* Auth */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initDemoData === 'function') initDemoData();
  if (document.querySelector('.login-form')) initLoginPage();
});

function initLoginPage() {
  /* TabLogic */

  /* Student */
  document.getElementById('student-login-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const year = document.getElementById('student-reg-year').value;
    const branch = document.getElementById('student-reg-branch').value;
    const roll = document.getElementById('student-reg-roll').value.trim();
    const password = document.getElementById('student-password').value.trim();
    const isHosteler = document.getElementById('student-hosteler').checked;

    if (!roll || !password) {
      showError('Please fill in all fields');
      return;
    }

    const paddedRoll = roll.padStart(3, '0');
    const regNo = `${year}-${branch}-131-${paddedRoll}`;

    const parsed = parseRegNumber(regNo);
    if (!parsed) {
      showError('Invalid registration number format. Use: YY-BranchCode-CollegeID-RollNo (e.g., 25-105-131-003)');
      return;
    }

    const student = DEMO_DATA.students.find(s => s.regNo === regNo && s.password === password);
    if (!student) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }

    /* Session */
    setSession('currentUser', {
      ...student,
      role: 'student',
      isHosteler: isHosteler,
      parsed: parsed
    });

    showToast('Login successful!', 'success', 'Welcome Back');
    setTimeout(() => window.location.href = 'student.html', 700);
  });

  /* Professor */
  document.getElementById('professor-login-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const phone = document.getElementById('prof-phone').value.trim();
    const name = document.getElementById('prof-name').value.trim();
    const isWardenCheckbox = document.getElementById('prof-warden')?.checked || false;

    if (!phone || !name) {
      showError('Please fill in all fields');
      return;
    }

    const professor = DEMO_DATA.professors.find(p => 
      p.phone === phone && p.name.toLowerCase() === name.toLowerCase()
    );

    if (!professor) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }

    if (isWardenCheckbox && !professor.isWarden) {
      showError('You do not have Warden privileges.');
      return;
    }

    /* Session */
    setSession('currentUser', { ...professor, role: 'professor', isWarden: isWardenCheckbox });
    showToast('Login successful!', 'success', 'Welcome Professor');
    setTimeout(() => window.location.href = 'professor.html', 700);
  });

  /* Admin */
  document.getElementById('admin-login-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const phone = document.getElementById('admin-phone').value.trim();
    const email = document.getElementById('admin-email').value.trim();

    if (!phone || !email) {
      showError('Please fill in all fields');
      return;
    }

    const admin = DEMO_DATA.admins.find(a => a.phone === phone && a.email === email);
    if (!admin) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }

    setSession('currentUser', { ...admin, role: 'admin' });
    showToast('Login successful!', 'success', 'Welcome Admin');
    setTimeout(() => window.location.href = 'admin.html', 700);
  });
}

/* Toggle */
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁️';
  }
}

/* AutoFill */
function autoFillDemo(type) {
  hideError();
  if (type === 'student-hostel') {
    if (document.getElementById('student-reg-year')) {
      document.getElementById('student-reg-year').value = '25';
      document.getElementById('student-reg-branch').value = '105';
      document.getElementById('student-reg-roll').value = '003';
      document.getElementById('student-password').value = '123456';
      document.getElementById('student-hosteler').checked = true;
      showToast('Hosteler student credentials filled!', 'info', 'Auto-Fill');
    }
  } else if (type === 'student-dayscholar') {
    if (document.getElementById('student-reg-year')) {
      document.getElementById('student-reg-year').value = '25';
      document.getElementById('student-reg-branch').value = '106';
      document.getElementById('student-reg-roll').value = '007';
      document.getElementById('student-password').value = '654321';
      document.getElementById('student-hosteler').checked = false;
      showToast('Day scholar student credentials filled!', 'info', 'Auto-Fill');
    }
  } else if (type === 'professor') {
    if (document.getElementById('prof-phone')) {
      document.getElementById('prof-phone').value = '9900012345';
      document.getElementById('prof-name').value = 'Prof. Raju';
      if (document.getElementById('prof-warden')) document.getElementById('prof-warden').checked = false;
      showToast('Professor credentials filled!', 'info', 'Auto-Fill');
    }
  } else if (type === 'warden') {
    if (document.getElementById('prof-phone')) {
      document.getElementById('prof-phone').value = '9876543221';
      document.getElementById('prof-name').value = 'Dr. Sunita Rao';
      if (document.getElementById('prof-warden')) document.getElementById('prof-warden').checked = true;
      showToast('Warden credentials filled!', 'info', 'Auto-Fill');
    }
  } else if (type === 'admin') {
    if (document.getElementById('admin-phone')) {
      document.getElementById('admin-phone').value = '9999999999';
      document.getElementById('admin-email').value = 'admin@campus.edu';
      showToast('Admin credentials filled!', 'info', 'Auto-Fill');
    }
  }
}

function showError(message) {
  const el = document.querySelector('.login-error');
  if (el) {
    el.innerHTML = `⚠️ ${message}`;
    el.classList.add('show');
  }
}

function hideError() {
  const el = document.querySelector('.login-error');
  if (el) el.classList.remove('show');
}

/* Auth */
function requireAuth(role) {
  const user = getSession('currentUser');
  if (!user || user.role !== role) {
    window.location.href = 'portals.html';
    return null;
  }
  return user;
}
