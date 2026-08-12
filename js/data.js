/* ============================================
   DEMO DATA STORE
   ============================================ */

const DEMO_DATA = {
  // ── Student Accounts ──
  students: [
    { regNo: '24-105-131-053', name: 'Sanjana Kumari', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 73, email: 'sanjana@campus.edu', followers: 24, following: 18, badges: [] },
    { regNo: '25-105-131-029', name: 'Lakshya Raj', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 55, email: 'lakshya@campus.edu', followers: 12, following: 5, badges: [] },
    { regNo: '25-105-131-017', name: 'Harsh Raj', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 55, email: 'harsh@campus.edu', followers: 8, following: 10, badges: [] },
    { regNo: '25-105-131-009', name: 'Vivek Kumar', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 55, email: 'vivek@campus.edu', followers: 15, following: 20, badges: [] },
    { regNo: '25-105-131-042', name: 'Mausam Kumari', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 82, email: 'mausam@campus.edu', followers: 30, following: 25, badges: [] },
    { regNo: '25-105-131-030', name: 'Anish Kumar Jha', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 100, email: 'anish@campus.edu', followers: 45, following: 30, badges: ['🌟 Perfect Attendance'] },
    { regNo: '25-105-131-013', name: 'Aadya Kumari', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 82, email: 'aadya@campus.edu', followers: 22, following: 18, badges: [] },
    { regNo: '25-105-131-047', name: 'Sudhanshu Kumar', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 73, email: 'sudhanshu@campus.edu', followers: 19, following: 15, badges: [] },
    { regNo: '25-105-131-020', name: 'Akanksha Roy', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 64, email: 'akanksha@campus.edu', followers: 28, following: 20, badges: [] },
    { regNo: '25-105-131-059', name: 'Ankit Kumar', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 91, email: 'ankit@campus.edu', followers: 52, following: 35, badges: [] },
    { regNo: '25-105-131-039', name: 'Anuska Ranjan', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 100, email: 'anuska@campus.edu', followers: 33, following: 25, badges: ['🌟 Perfect Attendance'] },
    { regNo: '25-105-131-019', name: 'Swati Kumari', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 82, email: 'swati@campus.edu', followers: 15, following: 12, badges: [] },
    { regNo: '25-105-131-025', name: 'Shruti Kumari', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 73, email: 'shruti@campus.edu', followers: 22, following: 16, badges: [] },
    { regNo: '25-105-131-003', name: 'Abhishek Nayak', phone: '9812345678', password: '123', isHosteler: true, branch: '105', attendance: 82, email: 'abhishek.n@campus.edu', followers: 18, following: 14, badges: ['🎯 Consistent Learner', '💻 Hackfest Presenter'] },
    { regNo: '25-105-131-057', name: 'Wadyant Giri', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 82, email: 'wadyant.g@campus.edu', followers: 45, following: 30, badges: ['💻 Open Source Contributor'] },
    { regNo: '25-105-131-050', name: 'Kundan Kumar Sahu', phone: '9876543210', password: '123', isHosteler: true, branch: '105', attendance: 100, email: 'kundan@campus.edu', followers: 50, following: 20, badges: ['🌟 Perfect Attendance'] },
    { regNo: '25-105-131-010', name: 'Danish Ansari', phone: '9876543210', password: '123', isHosteler: false, branch: '105', attendance: 100, email: 'danish@campus.edu', followers: 40, following: 15, badges: ['🌟 Perfect Attendance'] }
  ],

  // ── Professor Accounts ──
  professors: [
    { id: 'prof-001', name: 'Dr. Sharma', phone: '9876543210', department: 'Mechanical Engineering', branchCode: '105', email: 'sharma@campus.edu', title: 'Professor & HOD', isWarden: false, followers: 120, following: 15, badges: ['🎓 15+ Years Teaching', '📝 50+ Publications'] },
    { id: 'prof-002', name: 'Dr. Anil Kapoor', phone: '9876543220', department: 'Computer Science', branchCode: '101', email: 'anil.k@campus.edu', title: 'Associate Professor', isWarden: false, followers: 89, following: 20, badges: ['🏆 Best Teacher Award'] },
    { id: 'prof-003', name: 'Dr. Sunita Rao', phone: '9876543221', department: 'Civil Engineering', branchCode: '106', email: 'sunita.r@campus.edu', title: 'Assistant Professor', isWarden: true, followers: 65, following: 30, badges: ['📐 Structural Expert'] },
    { id: 'prof-004', name: 'Dr. Rajesh Verma', phone: '9876543222', department: 'Data Science & AI', branchCode: '110', email: 'rajesh.v@campus.edu', title: 'Professor', isWarden: false, followers: 150, following: 10, badges: ['🤖 AI Research Lead'] },
    { id: 'prof-005', name: 'Prof. Raju', phone: '9900012345', department: 'Computer Science', branchCode: '105', email: 'raju@campus.edu', title: 'HOD & Professor', isWarden: false, followers: 210, following: 8, badges: ['🎓 HOD CSE', '🏅 25 Years Experience', '💡 Innovation Award'] }
  ],

  // ── Admin Account ──
  admins: [
    { id: 'admin-001', name: 'Campus Admin', phone: '9999999999', email: 'admin@campus.edu', role: 'Super Admin' }
  ],

  // ── Class Schedule (for CSE branch, Group 1) ──
  schedule: {
    'Monday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Digital Electronics (DE)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Object Oriented Programming (OOP)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'accent' },
      { time: '11:40 AM', endTime: '12:30 PM', subject: 'Operating System (OS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'warning' },
      { time: '12:30 PM', endTime: '01:20 PM', subject: 'Data Structures & Algorithms (DSA)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'danger' },
      { time: '02:00 PM', endTime: '04:00 PM', subject: 'GATE', faculty: 'Prof R Yezdhani', room: 'Classroom', type: 'Special', color: 'primary' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Indian Knowledge System (IKS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'accent' }
    ],
    'Tuesday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Object Oriented Programming (OOP)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'accent' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Operating System (OS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'warning' },
      { time: '11:40 AM', endTime: '12:30 PM', subject: 'Discrete Mathematics & Graph Theory (DM & GT)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' },
      { time: '12:30 PM', endTime: '01:20 PM', subject: 'Library (LIB)', faculty: 'TBD', room: 'Library', type: 'Activity', color: 'danger' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Spoken Tutorial', faculty: 'TBD', room: 'Classroom', type: 'Activity', color: 'accent' }
    ],
    'Wednesday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Universal Human Values (UHV)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Discrete Mathematics & Graph Theory (DM & GT)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'accent' },
      { time: '11:40 AM', endTime: '01:20 PM', subject: 'OOP LAB', faculty: 'TBD', room: 'Lab', type: 'Lab', color: 'warning' },
      { time: '02:00 PM', endTime: '04:00 PM', subject: 'DSA LAB', faculty: 'TBD', room: 'Lab', type: 'Lab', color: 'danger' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Indian Knowledge System (IKS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' }
    ],
    'Thursday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Operating System (OS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'warning' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Object Oriented Programming (OOP)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'accent' },
      { time: '11:40 AM', endTime: '12:30 PM', subject: 'Discrete Mathematics & Graph Theory (DM & GT)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' },
      { time: '12:30 PM', endTime: '01:20 PM', subject: 'Universal Human Values (UHV)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'danger' },
      { time: '02:00 PM', endTime: '04:00 PM', subject: 'GATE', faculty: 'TBD', room: 'Classroom', type: 'Special', color: 'primary' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Spoken Tutorial', faculty: 'TBD', room: 'Classroom', type: 'Activity', color: 'warning' }
    ],
    'Friday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Universal Human Values (UHV)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'primary' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Data Structures & Algorithms (DSA)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'danger' },
      { time: '11:40 AM', endTime: '12:30 PM', subject: 'Digital Electronics (DE)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'warning' },
      { time: '12:30 PM', endTime: '01:20 PM', subject: 'DM & GT (T)', faculty: 'TBD', room: 'Classroom', type: 'Tutorial', color: 'accent' },
      { time: '02:00 PM', endTime: '04:00 PM', subject: 'GATE', faculty: 'TBD', room: 'Classroom', type: 'Special', color: 'primary' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Indian Knowledge System (IKS)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'danger' }
    ],
    'Saturday': [
      { time: '10:00 AM', endTime: '10:50 AM', subject: 'Digital Electronics (DE)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'warning' },
      { time: '10:50 AM', endTime: '11:40 AM', subject: 'Data Structures & Algorithms (DSA)', faculty: 'TBD', room: 'Classroom', type: 'Lecture', color: 'danger' },
      { time: '11:40 AM', endTime: '01:20 PM', subject: 'DE LAB', faculty: 'TBD', room: 'Lab', type: 'Lab', color: 'primary' },
      { time: '02:00 PM', endTime: '04:00 PM', subject: 'OS LAB', faculty: 'TBD', room: 'Lab', type: 'Lab', color: 'accent' },
      { time: '04:00 PM', endTime: '04:50 PM', subject: 'Library', faculty: 'TBD', room: 'Library', type: 'Activity', color: 'warning' }
    ]
  },

  // ── Events ──
  events: [
    { id: 'evt-1', title: 'TechFest 2025', date: '2025-09-15', endDate: '2025-09-17', type: 'fest', description: 'Annual technical festival with coding competitions, robotics, and hackathons.', venue: 'Main Auditorium' },
    { id: 'evt-2', title: 'Mid-Semester Exam', date: '2025-09-25', endDate: '2025-10-02', type: 'exam', description: 'Mid-semester examinations for all branches.', venue: 'Exam Halls' },
    { id: 'evt-3', title: 'Cultural Night', date: '2025-10-10', type: 'cultural', description: 'Annual cultural event with music, dance, and drama performances.', venue: 'Open Air Theatre' },
    { id: 'evt-4', title: 'Sports Week', date: '2025-10-20', endDate: '2025-10-25', type: 'sports', description: 'Inter-department sports tournament.', venue: 'Sports Complex' },
    { id: 'evt-5', title: 'Industry Visit', date: '2025-11-05', type: 'academic', description: 'Industrial visit to Tata Motors plant.', venue: 'Off Campus' },
    { id: 'evt-6', title: 'End-Semester Exam', date: '2025-12-01', endDate: '2025-12-15', type: 'exam', description: 'End-semester final examinations.', venue: 'Exam Halls' },
    { id: 'evt-7', title: 'Workshop: IoT & Smart Systems', date: '2025-08-20', type: 'workshop', description: '2-day hands-on workshop on IoT development.', venue: 'Lab Block C' },
    { id: 'evt-8', title: 'Guest Lecture: AI in Engineering', date: '2025-08-25', type: 'academic', description: 'Guest lecture by Dr. Andrew Ng.', venue: 'Seminar Hall' }
  ],

  // ── Notices ──
  notices: [
    { id: 'not-1', title: 'Library Timing Change', content: 'Library will remain open from 8 AM to 10 PM starting next week. Weekend hours: 9 AM to 6 PM.', date: '2025-08-10', author: 'Librarian', priority: 'normal', category: 'general' },
    { id: 'not-2', title: 'Scholarship Application Deadline', content: 'Last date to apply for merit scholarships is September 30, 2025. Submit applications to the Dean\'s office.', date: '2025-08-08', author: 'Dean Office', priority: 'important', category: 'academic' },
    { id: 'not-3', title: 'Wi-Fi Network Maintenance', content: 'Campus Wi-Fi will be under maintenance on August 15 from 2 AM to 6 AM. Please plan accordingly.', date: '2025-08-07', author: 'IT Department', priority: 'normal', category: 'general' },
    { id: 'not-4', title: 'Hostel Fee Payment Reminder', content: 'Hostel fee for the current semester must be paid by August 20, 2025. Late fee of ₹500 per week will apply.', date: '2025-08-05', author: 'Hostel Office', priority: 'urgent', category: 'hostel' },
    { id: 'not-5', title: 'Placement Drive: Infosys', content: 'Infosys campus placement drive on September 10, 2025. Eligible branches: CSE, IT, ECE. Register on the placement portal.', date: '2025-08-04', author: 'Placement Cell', priority: 'important', category: 'placement' },
    { id: 'not-6', title: 'Independence Day Celebration', content: 'Flag hoisting ceremony at 8 AM on August 15 at the main ground. All students and faculty are requested to attend.', date: '2025-08-03', author: 'Administration', priority: 'normal', category: 'general' }
  ],

  // ── Library Resources ──
  library: [
    { id: 'lib-1', title: 'Engineering Mathematics Vol. 1', author: 'B.S. Grewal', subject: 'Mathematics', semester: 1, type: 'textbook', format: 'PDF', pages: 450, downloads: 1234 },
    { id: 'lib-2', title: 'Physics for Engineers', author: 'H.K. Malik', subject: 'Physics', semester: 1, type: 'textbook', format: 'PDF', pages: 380, downloads: 987 },
    { id: 'lib-3', title: 'Data Structures & Algorithms', author: 'Cormen et al.', subject: 'Computer Science', semester: 3, type: 'textbook', format: 'PDF', pages: 1312, downloads: 2456 },
    { id: 'lib-4', title: 'Thermodynamics Lecture Notes', author: 'Dr. Sharma', subject: 'Mechanical', semester: 3, type: 'notes', format: 'PDF', pages: 85, downloads: 567 },
    { id: 'lib-5', title: 'Circuit Analysis Lab Manual', author: 'ECE Dept.', subject: 'Electronics', semester: 2, type: 'manual', format: 'PDF', pages: 120, downloads: 345 },
    { id: 'lib-6', title: 'Environmental Science Handbook', author: 'Dr. Jain', subject: 'Environmental', semester: 1, type: 'reference', format: 'PDF', pages: 200, downloads: 789 },
    { id: 'lib-7', title: 'Machine Learning Fundamentals', author: 'Andrew Ng', subject: 'Data Science', semester: 5, type: 'textbook', format: 'PDF', pages: 520, downloads: 3210 },
    { id: 'lib-8', title: 'Strength of Materials', author: 'R.K. Rajput', subject: 'Mechanical', semester: 3, type: 'textbook', format: 'PDF', pages: 680, downloads: 1543 },
    { id: 'lib-9', title: 'Organic Chemistry Notes', author: 'Dr. Rao', subject: 'Chemistry', semester: 1, type: 'notes', format: 'PDF', pages: 95, downloads: 432 },
    { id: 'lib-10', title: 'Previous Year Question Papers - Mathematics', author: 'Exam Cell', subject: 'Mathematics', semester: 1, type: 'question-paper', format: 'PDF', pages: 50, downloads: 5678 }
  ],

  // ── Assignments ──
  assignments: [
    { id: 'asg-1', title: 'Differential Equations Problem Set', subject: 'Engineering Mathematics', faculty: 'Dr. Sharma', deadline: '2025-08-20', targetBranch: 'all', targetYear: 1, description: 'Solve problems 1-20 from Chapter 5. Show all working steps.', status: 'active' },
    { id: 'asg-2', title: 'Physics Lab Report: Optics', subject: 'Engineering Physics', faculty: 'Dr. Gupta', deadline: '2025-08-18', targetBranch: 'all', targetYear: 1, description: 'Submit lab report for the optics experiment conducted last week.', status: 'active' },
    { id: 'asg-3', title: 'Technical Drawing: Isometric Projections', subject: 'Technical Drawing', faculty: 'Dr. Patil', deadline: '2025-08-22', targetBranch: '105', targetYear: 1, description: 'Complete the isometric projection sheets distributed in class.', status: 'active' },
    { id: 'asg-4', title: 'Environmental Impact Report', subject: 'Environmental Science', faculty: 'Dr. Jain', deadline: '2025-08-15', targetBranch: 'all', targetYear: 1, description: 'Write a 2000-word report on environmental impact of industrialization.', status: 'overdue' }
  ],

  // ── Complaints ──
  complaints: [
    { id: 'cmp-1', title: 'Water supply issue in Hostel Block A', category: 'hostel', status: 'pending', author: 'Arjun Mehta', regNo: '25-105-131-003', date: '2025-08-09', description: 'No water supply on 3rd floor since yesterday evening.', assignedTo: 'Warden' },
    { id: 'cmp-2', title: 'Projector not working in LH-201', category: 'academic', status: 'in-progress', author: 'Sneha Patel', regNo: '25-101-131-002', date: '2025-08-08', description: 'The projector in Lecture Hall 201 has been malfunctioning for the past week.', assignedTo: 'IT Department' },
    { id: 'cmp-3', title: 'Food quality in mess', category: 'hostel', status: 'pending', author: 'Vikram Singh', regNo: '24-103-131-005', date: '2025-08-07', description: 'Food quality has deteriorated significantly. Found insects in dal yesterday.', assignedTo: 'Warden' },
    { id: 'cmp-4', title: 'Broken bench in classroom', category: 'campus', status: 'resolved', author: 'Ananya Gupta', regNo: '24-102-131-004', date: '2025-08-01', description: 'Multiple broken benches in Room 305.', assignedTo: 'Maintenance' }
  ],

  // ── Lost & Found ──
  lostFound: [
    { id: 'lf-1', title: 'Blue Backpack', type: 'lost', category: 'bag', location: 'Library', date: '2025-08-09', description: 'Blue JanSport backpack with laptop inside. Lost near the reading section.', author: 'Rahul Kumar', contact: '9876543212', status: 'open' },
    { id: 'lf-2', title: 'Student ID Card', type: 'found', category: 'id-card', location: 'Canteen', date: '2025-08-08', description: 'Found a student ID card near the canteen billing counter.', author: 'Priya Sharma', contact: '9876543211', status: 'open' },
    { id: 'lf-3', title: 'Casio Calculator', type: 'lost', category: 'electronics', location: 'Exam Hall 2', date: '2025-08-06', description: 'Casio fx-991ES scientific calculator. Name written on back.', author: 'Amit Joshi', contact: '9876543218', status: 'open' },
    { id: 'lf-4', title: 'Umbrella (Black)', type: 'found', category: 'accessory', location: 'Bus Stop', date: '2025-08-05', description: 'Black automatic umbrella found at the campus bus stop.', author: 'Divya Nair', contact: '9876543217', status: 'claimed' }
  ],

  // ── Chat Messages (demo) ──
  chatMessages: {
    'branch-105': [
      { id: 'msg-1', sender: 'Arjun Mehta', text: 'Anyone has the mechanics assignment questions?', time: '2025-08-11T10:30:00', regNo: '25-105-131-003' },
      { id: 'msg-2', sender: 'Meera Iyer', text: 'I have them! Will share after class.', time: '2025-08-11T10:32:00', regNo: '24-105-131-009' },
      { id: 'msg-3', sender: 'Arjun Mehta', text: 'Thanks Meera! Also, did anyone understand the thermodynamics derivation?', time: '2025-08-11T10:35:00', regNo: '25-105-131-003' }
    ],
    'all-campus': [
      { id: 'msg-4', sender: 'Sneha Patel', text: 'TechFest registrations are open! Sign up at the CS lab.', time: '2025-08-11T09:00:00', regNo: '25-101-131-002' },
      { id: 'msg-5', sender: 'Karan Reddy', text: 'Who\'s forming a team for the hackathon? Need 2 more members.', time: '2025-08-11T09:15:00', regNo: '25-110-131-010' },
      { id: 'msg-6', sender: 'Ananya Gupta', text: 'Library extended hours this week! Open till 10 PM.', time: '2025-08-11T09:30:00', regNo: '24-102-131-004' }
    ],
    'anonymous': [
      { id: 'amsg-1', sender: 'CosmicEagle42', text: 'Anyone else think the cafeteria needs better vegan options?', time: '2025-08-11T11:00:00' },
      { id: 'amsg-2', sender: 'SilentWolf17', text: 'The parking situation near Block C is terrible.', time: '2025-08-11T11:05:00' },
      { id: 'amsg-3', sender: 'ThunderFox88', text: 'Shoutout to Dr. Sharma for the extra revision class!', time: '2025-08-11T11:10:00' }
    ]
  },

  // ── Emergency Contacts ──
  emergencyContacts: [
    { name: 'Campus Security', phone: '1800-CAMPUS', icon: '🛡️', type: 'security' },
    { name: 'Police (100)', phone: '100', icon: '👮', type: 'police' },
    { name: 'Ambulance (108)', phone: '108', icon: '🚑', type: 'ambulance' },
    { name: 'Fire Brigade (101)', phone: '101', icon: '🚒', type: 'fire' },
    { name: 'Campus Hospital', phone: '1800-234-5678', icon: '🏥', type: 'hospital' },
    { name: 'Women Helpline', phone: '1091', icon: '📞', type: 'helpline' },
    { name: 'Hostel Warden', phone: '9876500001', icon: '🏠', type: 'hostel' },
    { name: 'Anti-Ragging Cell', phone: '1800-180-5522', icon: '🚫', type: 'anti-ragging' }
  ],

  // ── Hospital Info ──
  hospitals: [
    { name: 'Campus Health Center', distance: 'On Campus', phone: '1800-234-5678', type: 'Campus', address: 'Block H, Ground Floor', available: true },
    { name: 'City General Hospital', distance: '3.2 km', phone: '0123-456-7890', type: 'Government', address: '45 MG Road', available: true },
    { name: 'Apollo Hospital', distance: '5.8 km', phone: '0123-789-0123', type: 'Private', address: '12 Health Street', available: true },
    { name: 'Emergency Ambulance', distance: 'Mobile', phone: '108', type: 'Ambulance', address: 'Nearest dispatch', available: true }
  ],

  // ── Hostel Rules ──
  hostelRules: [
    'All hostelers must return to hostel by 9:00 PM on weekdays and 10:00 PM on weekends.',
    'Guests are allowed only between 4:00 PM - 7:00 PM with prior permission.',
    'Ragging in any form is strictly prohibited and punishable by expulsion.',
    'Use of alcohol, tobacco, and drugs is strictly prohibited on hostel premises.',
    'Students must maintain cleanliness in their rooms and common areas.',
    'Electrical appliances like heaters, irons must be used only in designated areas.',
    'Night out/home leave requires prior written permission from warden.',
    'Damage to hostel property will result in fine and disciplinary action.',
    'Students must carry their hostel ID at all times within the premises.',
    'Noise levels must be kept to minimum, especially after 10:00 PM (quiet hours).',
    'Visitors of opposite gender are allowed only in common rooms during designated hours.',
    'Any medical emergency must be reported to the warden immediately.'
  ],

  // ── Campus Map Buildings ──
  campusBuildings: [
    { id: 'main-block', name: 'Main Academic Block', type: 'academic', x: 300, y: 200, description: 'Lecture Halls LH-101 to LH-401' },
    { id: 'library', name: 'Central Library', type: 'library', x: 500, y: 150, description: '3 floors, 50,000+ books' },
    { id: 'lab-block', name: 'Lab Block A', type: 'lab', x: 200, y: 350, description: 'Physics, Chemistry, Biology Labs' },
    { id: 'lab-block-b', name: 'Lab Block B', type: 'lab', x: 400, y: 350, description: 'CS, IT, Electronics Labs' },
    { id: 'admin', name: 'Administration', type: 'admin', x: 350, y: 100, description: 'Dean Office, Accounts, Admission' },
    { id: 'canteen', name: 'Central Canteen', type: 'food', x: 600, y: 300, description: 'Main dining, food court' },
    { id: 'hostel-boys', name: 'Boys Hostel', type: 'hostel', x: 100, y: 450, description: '4 blocks, 800 rooms' },
    { id: 'hostel-girls', name: 'Girls Hostel', type: 'hostel', x: 700, y: 450, description: '3 blocks, 600 rooms' },
    { id: 'sports', name: 'Sports Complex', type: 'sports', x: 150, y: 150, description: 'Ground, Gym, Indoor Stadium' },
    { id: 'hospital', name: 'Health Center', type: 'hospital', x: 650, y: 200, description: 'OPD, Pharmacy, Emergency' },
    { id: 'workshop', name: 'Workshop', type: 'lab', x: 300, y: 450, description: 'Mechanical, Civil workshops' },
    { id: 'auditorium', name: 'Auditorium', type: 'cultural', x: 500, y: 400, description: 'Capacity: 2000' }
  ],

  // ── Feedback (demo) ──
  feedback: [
    { id: 'fb-1', subject: 'Engineering Mathematics', faculty: 'Dr. Sharma', rating: 4, comment: 'Excellent teaching methodology', date: '2025-08-10', anonymous: true },
    { id: 'fb-2', subject: 'Engineering Physics', faculty: 'Dr. Gupta', rating: 3, comment: 'Could use more practical examples', date: '2025-08-09', anonymous: true },
    { id: 'fb-3', subject: 'Workshop Practice', faculty: 'Mr. Kumar', rating: 5, comment: 'Very hands-on and engaging', date: '2025-08-08', anonymous: true }
  ],

  // ── AI Copilot Responses ──
  aiResponses: {
    'study tips': 'Here are some effective study tips:\n\n📚 **Active Recall**: Test yourself instead of re-reading notes\n⏰ **Pomodoro Technique**: Study 25 min, break 5 min\n📝 **Spaced Repetition**: Review material at increasing intervals\n🧠 **Mind Maps**: Visualize connections between concepts\n👥 **Group Study**: Teach concepts to peers',
    'exam preparation': '🎯 **Exam Prep Strategy**:\n\n1. Start 2 weeks before the exam\n2. Create a topic-wise study plan\n3. Solve previous year papers\n4. Focus on high-weightage topics\n5. Take mock tests\n6. Get 7-8 hours sleep before exam day',
    'time management': '⏱️ **Time Management Tips**:\n\n1. Use a planner or digital calendar\n2. Prioritize tasks using Eisenhower Matrix\n3. Set specific study goals daily\n4. Avoid multitasking\n5. Use the 2-minute rule for quick tasks\n6. Review your day each evening',
    'stress': '🧘 **Stress Management**:\n\n1. Practice deep breathing exercises\n2. Take regular breaks during study\n3. Exercise for 30 min daily\n4. Maintain a healthy sleep schedule\n5. Talk to friends, family, or counselor\n6. Limit social media before exams',
    'default': '👋 I\'m your AI Study Copilot! Try asking about:\n\n• Study tips & techniques\n• Exam preparation strategies\n• Time management\n• Stress management\n• Note-taking methods\n• Any academic topic!'
  },

  // ── Social Posts ──
  socialPosts: [
    {
      id: 'post-new-1',
      authorName: 'Abhishek Nayak',
      authorRole: 'Student • CSE',
      authorAvatar: 'AN',
      image: 'images/hackfest.jpeg',
      caption: 'Had an amazing time presenting at Hackfest! Thrilled to showcase our project to the judges. A big shoutout to Synapse Society for organizing such a brilliant event! 💻✨ #Hackfest #Avishkar',
      likes: 85,
      likedByMe: false,
      timestamp: 'Just now',
      comments: []
    },
    {
      id: 'post-new-2',
      authorName: 'Abhishek Nayak',
      authorRole: 'Student • CSE',
      authorAvatar: 'AN',
      image: 'images/avishkar.jpeg',
      caption: 'Avishkar is here! Synapse Society brings the best tech minds together. Let the innovation begin! 🔥',
      likes: 120,
      likedByMe: false,
      timestamp: '1 hour ago',
      comments: []
    },
    {
      id: 'post-001',
      authorName: 'Sneha Patel',
      authorRole: 'Student • CSE',
      authorAvatar: 'SP',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
      caption: 'Incredible time at the Annual Tech Symposium! The AI workshop was mind-blowing. 🚀🤖 #TechFest #CampusLife',
      likes: 124,
      likedByMe: false,
      timestamp: '2 hours ago',
      comments: [
        { name: 'Karan Reddy', text: 'Totally agree, the ML segment was top notch!' }
      ]
    },
    {
      id: 'post-002',
      authorName: 'Prof. Raju',
      authorRole: 'HOD • CSE',
      authorAvatar: 'PR',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
      caption: 'Proud of our 3rd-year students for presenting their innovative startup ideas today. Keep pushing boundaries! 💡👏',
      likes: 342,
      likedByMe: true,
      timestamp: '5 hours ago',
      comments: [
        { name: 'Abhishek Nayak', text: 'Thank you sir for the guidance!' },
        { name: 'Rahul Kumar', text: 'Great presentations everyone!' }
      ]
    },
    {
      id: 'post-003',
      authorName: 'Campus Admin',
      authorRole: 'Administration',
      authorAvatar: 'CA',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      caption: 'REMINDER: The main library will be closed this weekend for renovations. Please plan your study sessions accordingly. 📚🏢',
      likes: 89,
      likedByMe: false,
      timestamp: '1 day ago',
      comments: []
    }
  ]
};

// Initialize demo data in localStorage if not exists
function initDemoData() {
  if (!getStorage('dataInitialized')) {
    setStorage('assignments', DEMO_DATA.assignments);
    setStorage('complaints', DEMO_DATA.complaints);
    setStorage('lostFound', DEMO_DATA.lostFound);
    setStorage('notices', DEMO_DATA.notices);
    setStorage('events', DEMO_DATA.events);
    setStorage('feedback', DEMO_DATA.feedback);
    setStorage('chatMessages', DEMO_DATA.chatMessages);
    setStorage('dataInitialized', true);
  }
}
