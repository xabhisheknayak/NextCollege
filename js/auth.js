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

    const students = getStorage('users_students') || DEMO_DATA.students;
    const student = students.find(s => s.regNo === regNo && s.password === password);
    if (!student) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }
    
    if (student.isBlocked) {
      showError('Your account has been temporarily blocked by an Administrator.');
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

    const professors = getStorage('users_professors') || DEMO_DATA.professors;
    const professor = professors.find(p => 
      p.phone === phone && p.name.toLowerCase() === name.toLowerCase()
    );

    if (!professor) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }
    
    if (professor.isBlocked) {
      showError('Your account has been temporarily blocked by an Administrator.');
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

    const admins = getStorage('users_admins') || DEMO_DATA.admins;
    const admin = admins.find(a => a.phone === phone && a.email === email);
    if (!admin) {
      showError('Invalid credentials. Try demo chip below!');
      return;
    }
    
    if (admin.isBlocked) {
      showError('Your account has been blocked.');
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
      document.getElementById('student-password').value = '123';
      document.getElementById('student-hosteler').checked = true;
      showToast('Logging in as Hosteler Student...', 'info', 'Auto-Login');
      setTimeout(() => document.getElementById('form-student')?.dispatchEvent(new Event('submit')), 300);
    }
  } else if (type === 'student-dayscholar') {
    if (document.getElementById('student-reg-year')) {
      document.getElementById('student-reg-year').value = '25';
      document.getElementById('student-reg-branch').value = '105';
      document.getElementById('student-reg-roll').value = '057';
      document.getElementById('student-password').value = '123';
      document.getElementById('student-hosteler').checked = false;
      showToast('Logging in as Day Scholar...', 'info', 'Auto-Login');
      setTimeout(() => document.getElementById('form-student')?.dispatchEvent(new Event('submit')), 300);
    }
  } else if (type === 'professor') {
    if (document.getElementById('prof-phone')) {
      document.getElementById('prof-phone').value = '9900012345';
      document.getElementById('prof-name').value = 'Prof. Raju';
      if (document.getElementById('prof-warden')) document.getElementById('prof-warden').checked = false;
      showToast('Logging in as Professor...', 'info', 'Auto-Login');
      setTimeout(() => document.getElementById('form-professor')?.dispatchEvent(new Event('submit')), 300);
    }
  } else if (type === 'warden') {
    if (document.getElementById('prof-phone')) {
      document.getElementById('prof-phone').value = '9876543221';
      document.getElementById('prof-name').value = 'Dr. Sunita Rao';
      if (document.getElementById('prof-warden')) document.getElementById('prof-warden').checked = true;
      showToast('Logging in as Warden...', 'info', 'Auto-Login');
      setTimeout(() => document.getElementById('form-professor')?.dispatchEvent(new Event('submit')), 300);
    }
  } else if (type === 'admin') {
    if (document.getElementById('admin-phone')) {
      document.getElementById('admin-phone').value = '9999999999';
      document.getElementById('admin-email').value = 'admin@campus.edu';
      showToast('Logging in as Admin...', 'info', 'Auto-Login');
      setTimeout(() => document.getElementById('form-admin')?.dispatchEvent(new Event('submit')), 300);
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
