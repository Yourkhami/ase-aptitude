/**
 * ASE APTITUDE – Admin & Teacher Portal Master JavaScript (admin.js)
 * Complete management system for courses, timetables, fees, notices & student leads.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ================================================================
  // 1. DEFAULT DATA DEFINITIONS
  // ================================================================
  const DEFAULT_ADMIN_CREDS = {
    username: 'admin',
    password: 'ase@admin2026'
  };

  const DEFAULT_COURSES = [
    {
      id: 'c-spoken-english',
      name: 'Spoken English',
      theme: 'theme-blue',
      badge: 'High Demand',
      duration: '3 to 6 Months',
      fee: '₹3,500',
      desc: 'Overcome hesitation and speak fluent, articulate English with natural pronunciation, grammar mastery, and professional vocabulary.',
      topics: ['Basic to Advanced', 'Grammar', 'Speaking Practice', 'Interview Skills']
    },
    {
      id: 'c-computer-courses',
      name: 'Computer Courses',
      theme: 'theme-orange',
      badge: 'Most Popular',
      duration: '6 to 12 Months',
      fee: '₹5,500',
      desc: 'Master essential computer applications, office productivity suites, digital literacy, and professional publishing tools.',
      topics: ['DCA (Diploma in Computer App.)', 'ADCA (Adv. Diploma in Comp. App.)', 'DTP (Desktop Publishing)', 'DIT & DFA', 'MS Office (Word, Excel, PowerPoint)', 'Internet & Digital Literacy']
    },
    {
      id: 'c-professional-skills',
      name: 'Professional Skills',
      theme: 'theme-teal',
      badge: 'Career Track',
      duration: '2 to 4 Months',
      fee: '₹4,000',
      desc: 'Gain job-ready financial accounting and data calculation skills tailored for modern corporate, banking, and retail commercial roles.',
      topics: ['Tally Prime (with GST & Invoicing)', 'Advanced Excel (VLOOKUP, Pivot, Dashboards)', 'Job-Oriented Training', 'Bilingual Typing (English + Hindi)']
    }
  ];

  const DEFAULT_BATCHES = [
    {
      id: 'b-1',
      course: 'Spoken English',
      name: 'Morning Fluency Batch',
      time: '8:00 AM - 9:30 AM',
      days: 'Mon - Sat',
      faculty: 'Dir. Sajid Raja',
      lab: 'Main Speech Hall',
      status: 'Admission Open'
    },
    {
      id: 'b-2',
      course: 'Computer Courses (DCA / ADCA)',
      name: 'Morning Lab Batch A',
      time: '9:30 AM - 11:30 AM',
      days: 'Mon - Sat',
      faculty: 'Senior Lab Faculty',
      lab: 'Computer Lab 1',
      status: 'Admission Open'
    },
    {
      id: 'b-3',
      course: 'Professional Skills (Tally Prime / Excel)',
      name: 'Noon Accounting Track',
      time: '12:00 PM - 1:30 PM',
      days: 'Mon - Sat',
      faculty: 'Faculty In-Charge',
      lab: 'Computer Lab 2',
      status: 'Few Seats Left'
    },
    {
      id: 'b-4',
      course: 'Spoken English',
      name: 'Evening Executive Batch',
      time: '4:00 PM - 5:30 PM',
      days: 'Mon - Sat',
      faculty: 'Dir. Sajid Raja',
      lab: 'Main Speech Hall',
      status: 'Few Seats Left'
    },
    {
      id: 'b-5',
      course: 'Computer Courses (DCA / ADCA)',
      name: 'Evening Lab Batch B',
      time: '5:30 PM - 7:00 PM',
      days: 'Mon - Sat',
      faculty: 'Senior Lab Faculty',
      lab: 'Computer Lab 1',
      status: 'Batch Starting Soon'
    }
  ];

  const DEFAULT_FEES = [
    {
      id: 'f-1',
      course: 'Spoken English (Basic to Advanced)',
      duration: '3 to 6 Months',
      fee: '₹3,500',
      installment: '₹2,000 at admission + ₹1,500 (Month 2)',
      offer: '10% discount for one-time full payment'
    },
    {
      id: 'f-2',
      course: 'DCA (Diploma in Computer Applications)',
      duration: '6 Months',
      fee: '₹4,500',
      installment: '₹2,000 at admission + ₹1,250/mo (2 months)',
      offer: 'Free comprehensive study kit & practice sets'
    },
    {
      id: 'f-3',
      course: 'ADCA (Advance Diploma in Comp. App.)',
      duration: '12 Months',
      fee: '₹7,500',
      installment: '₹2,500 at admission + ₹1,000/mo (5 months)',
      offer: 'Free Hindi + English typing course & certificate'
    },
    {
      id: 'f-4',
      course: 'Tally Prime with GST Certification',
      duration: '3 Months',
      fee: '₹3,800',
      installment: '₹2,000 at admission + ₹1,800 (Month 2)',
      offer: 'Includes live GST ledger & taxation projects'
    },
    {
      id: 'f-5',
      course: 'Advanced Excel & Data Analytics',
      duration: '2 Months',
      fee: '₹2,500',
      installment: 'One-time payment',
      offer: 'Includes MIS reporting & corporate dashboards'
    }
  ];

  const DEFAULT_NOTICES = [
    {
      id: 'n-1',
      badge: 'New Batches Starting This Week!',
      text: 'ISO Certified Training • 100% Practical Lab Sessions • Small Batches',
      live: true,
      date: new Date().toLocaleDateString('en-GB')
    }
  ];

  // ================================================================
  // 2. DATA STORE HELPER (localStorage)
  // ================================================================
  const getStore = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  };

  const setStore = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  };

  // Initialize defaults if not present
  if (!localStorage.getItem('ase_admin_creds')) setStore('ase_admin_creds', DEFAULT_ADMIN_CREDS);
  if (!localStorage.getItem('ase_courses')) setStore('ase_courses', DEFAULT_COURSES);
  if (!localStorage.getItem('ase_batches')) setStore('ase_batches', DEFAULT_BATCHES);
  if (!localStorage.getItem('ase_fees')) setStore('ase_fees', DEFAULT_FEES);
  if (!localStorage.getItem('ase_announcements')) setStore('ase_announcements', DEFAULT_NOTICES);
  if (!localStorage.getItem('ase_registrations')) setStore('ase_registrations', []);

  // ================================================================
  // 3. AUTHENTICATION SYSTEM
  // ================================================================
  const authGate = document.getElementById('authGate');
  const adminLayout = document.getElementById('adminLayout');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminUsernameInput = document.getElementById('adminUsername');
  const adminPasswordInput = document.getElementById('adminPassword');
  const authAlert = document.getElementById('authAlert');
  const togglePwBtn = document.getElementById('togglePwBtn');
  const togglePwIcon = document.getElementById('togglePwIcon');
  const logoutBtn = document.getElementById('logoutBtn');
  const displayAdminName = document.getElementById('displayAdminName');

  const checkAuth = () => {
    const isAuthed = sessionStorage.getItem('ase_admin_auth') === 'true';
    if (isAuthed) {
      authGate.style.display = 'none';
      adminLayout.style.display = 'flex';
      const creds = getStore('ase_admin_creds', DEFAULT_ADMIN_CREDS);
      if (displayAdminName) displayAdminName.textContent = creds.username.toUpperCase();
      renderAll();
    } else {
      authGate.style.display = 'flex';
      adminLayout.style.display = 'none';
    }
  };

  if (togglePwBtn && adminPasswordInput) {
    togglePwBtn.addEventListener('click', () => {
      const isPw = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPw ? 'text' : 'password';
      togglePwIcon.className = isPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredUser = adminUsernameInput.value.trim();
      const enteredPass = adminPasswordInput.value.trim();
      const creds = getStore('ase_admin_creds', DEFAULT_ADMIN_CREDS);

      if (enteredUser === creds.username && enteredPass === creds.password) {
        sessionStorage.setItem('ase_admin_auth', 'true');
        authAlert.style.display = 'none';
        adminLoginForm.reset();
        checkAuth();
        showToast('Welcome to ASE Aptitude Teacher Portal!', 'success');
      } else {
        authAlert.style.display = 'block';
        authAlert.className = 'auth-alert error';
        authAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Invalid credentials. Please verify username and password.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ase_admin_auth');
      checkAuth();
      showToast('You have signed out successfully.', 'info');
    });
  }

  // ================================================================
  // 4. TOAST NOTIFICATION UTILITY
  // ================================================================
  const toastContainer = document.getElementById('toastContainer');
  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info');
    const color = type === 'success' ? '#4ade80' : (type === 'error' ? '#f87171' : '#38bdf8');
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.1rem;"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ================================================================
  // 5. SIDEBAR NAVIGATION & TABS
  // ================================================================
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const pageTitle = document.getElementById('pageTitle');
  const adminSidebar = document.getElementById('adminSidebar');
  const adminHamburgerBtn = document.getElementById('adminHamburgerBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  const switchTab = (tabId) => {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
        if (pageTitle) pageTitle.textContent = btn.querySelector('span').textContent;
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    if (adminSidebar) adminSidebar.classList.remove('is-open');
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  document.querySelectorAll('[data-target-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-target-tab');
      switchTab(tab);
    });
  });

  if (adminHamburgerBtn && adminSidebar) {
    adminHamburgerBtn.addEventListener('click', () => {
      adminSidebar.classList.toggle('is-open');
    });
  }

  if (sidebarCloseBtn && adminSidebar) {
    sidebarCloseBtn.addEventListener('click', () => {
      adminSidebar.classList.remove('is-open');
    });
  }

  // Quick Action buttons on Overview tab
  document.getElementById('quickAddCourseBtn')?.addEventListener('click', () => {
    switchTab('tab-courses');
    openCourseModal();
  });
  document.getElementById('quickAddBatchBtn')?.addEventListener('click', () => {
    switchTab('tab-batches');
    openBatchModal();
  });
  document.getElementById('quickAddNoticeBtn')?.addEventListener('click', () => {
    switchTab('tab-notices');
    openNoticeModal();
  });

  // ================================================================
  // 6. MODAL UTILITY (OPEN / CLOSE)
  // ================================================================
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('admin-modal')) {
      e.target.classList.remove('is-open');
      e.target.setAttribute('aria-hidden', 'true');
    }
  });

  // ================================================================
  // 7. MODULE: COURSES MANAGEMENT
  // ================================================================
  const coursesAdminList = document.getElementById('coursesAdminList');
  const courseModal = document.getElementById('courseModal');
  const courseForm = document.getElementById('courseForm');
  const openAddCourseModalBtn = document.getElementById('openAddCourseModal');
  const courseModalTitle = document.getElementById('courseModalTitle');

  const courseEditId = document.getElementById('courseEditId');
  const courseNameInput = document.getElementById('courseNameInput');
  const courseThemeInput = document.getElementById('courseThemeInput');
  const courseBadgeInput = document.getElementById('courseBadgeInput');
  const courseDurationInput = document.getElementById('courseDurationInput');
  const courseFeeInput = document.getElementById('courseFeeInput');
  const courseDescInput = document.getElementById('courseDescInput');
  const courseTopicsInput = document.getElementById('courseTopicsInput');

  const openCourseModal = (courseToEdit = null) => {
    if (courseToEdit) {
      courseModalTitle.textContent = 'Edit Course';
      courseEditId.value = courseToEdit.id;
      courseNameInput.value = courseToEdit.name;
      courseThemeInput.value = courseToEdit.theme || 'theme-blue';
      courseBadgeInput.value = courseToEdit.badge || '';
      courseDurationInput.value = courseToEdit.duration || '';
      courseFeeInput.value = courseToEdit.fee || '';
      courseDescInput.value = courseToEdit.desc || '';
      courseTopicsInput.value = (courseToEdit.topics || []).join(', ');
    } else {
      courseModalTitle.textContent = 'Add New Course';
      courseForm.reset();
      courseEditId.value = '';
    }
    openModal('courseModal');
  };

  if (openAddCourseModalBtn) {
    openAddCourseModalBtn.addEventListener('click', () => openCourseModal());
  }

  const renderCourses = () => {
    const courses = getStore('ase_courses', DEFAULT_COURSES);
    document.getElementById('countCourses').textContent = courses.length;
    document.getElementById('statTotalCourses').textContent = courses.length;

    if (!coursesAdminList) return;
    coursesAdminList.innerHTML = '';

    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-admin-card';
      const topicsHtml = (course.topics || []).map(t => `<span class="topic-pill">${t.trim()}</span>`).join('');

      card.innerHTML = `
        <div class="course-admin-badge">${course.badge || 'Active Course'}</div>
        <h3 class="course-admin-title">${course.name}</h3>
        <p class="course-admin-desc">${course.desc}</p>
        <div class="course-admin-details">
          <span><i class="fa-regular fa-clock text-teal"></i> ${course.duration}</span>
          <span><i class="fa-solid fa-indian-rupee-sign text-gold"></i> ${course.fee || 'Affordable'}</span>
        </div>
        <div class="course-admin-topics">
          <strong>Topics Covered:</strong>
          <div class="topics-pills">${topicsHtml}</div>
        </div>
        <div class="course-admin-actions">
          <button class="btn btn-outline-light btn-sm btn-edit-course" data-id="${course.id}">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn btn-outline-danger btn-sm btn-del-course" data-id="${course.id}">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      `;

      coursesAdminList.appendChild(card);
    });

    // Attach Action Listeners
    coursesAdminList.querySelectorAll('.btn-edit-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const c = courses.find(item => item.id === id);
        if (c) openCourseModal(c);
      });
    });

    coursesAdminList.querySelectorAll('.btn-del-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this course?')) {
          const updated = courses.filter(item => item.id !== id);
          setStore('ase_courses', updated);
          renderCourses();
          updateBatchCourseOptions();
          showToast('Course removed successfully.', 'info');
        }
      });
    });

    updateBatchCourseOptions();
  };

  if (courseForm) {
    courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const courses = getStore('ase_courses', DEFAULT_COURSES);
      const editId = courseEditId.value;

      const topicsArray = courseTopicsInput.value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const courseObj = {
        id: editId || `c-${Date.now()}`,
        name: courseNameInput.value.trim(),
        theme: courseThemeInput.value,
        badge: courseBadgeInput.value.trim() || 'Active',
        duration: courseDurationInput.value.trim() || '3 Months',
        fee: courseFeeInput.value.trim() || 'Contact for fee',
        desc: courseDescInput.value.trim(),
        topics: topicsArray
      };

      if (editId) {
        const idx = courses.findIndex(c => c.id === editId);
        if (idx !== -1) courses[idx] = courseObj;
        showToast(`Course "${courseObj.name}" updated!`, 'success');
      } else {
        courses.push(courseObj);
        showToast(`New course "${courseObj.name}" added!`, 'success');
      }

      setStore('ase_courses', courses);
      closeModal('courseModal');
      renderCourses();
    });
  }

  // ================================================================
  // 8. MODULE: BATCH TIMETABLE
  // ================================================================
  const batchesTableBody = document.getElementById('batchesTableBody');
  const batchModal = document.getElementById('batchModal');
  const batchForm = document.getElementById('batchForm');
  const openAddBatchModalBtn = document.getElementById('openAddBatchModal');
  const batchModalTitle = document.getElementById('batchModalTitle');
  const batchCourseSelect = document.getElementById('batchCourseSelect');

  const batchEditId = document.getElementById('batchEditId');
  const batchNameInput = document.getElementById('batchNameInput');
  const batchTimeInput = document.getElementById('batchTimeInput');
  const batchDaysInput = document.getElementById('batchDaysInput');
  const batchFacultyInput = document.getElementById('batchFacultyInput');
  const batchSeatsInput = document.getElementById('batchSeatsInput');
  const batchLabInput = document.getElementById('batchLabInput');

  const updateBatchCourseOptions = () => {
    if (!batchCourseSelect) return;
    const courses = getStore('ase_courses', DEFAULT_COURSES);
    batchCourseSelect.innerHTML = courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  };

  const openBatchModal = (batchToEdit = null) => {
    updateBatchCourseOptions();
    if (batchToEdit) {
      batchModalTitle.textContent = 'Edit Batch Schedule';
      batchEditId.value = batchToEdit.id;
      batchCourseSelect.value = batchToEdit.course;
      batchNameInput.value = batchToEdit.name;
      batchTimeInput.value = batchToEdit.time;
      batchDaysInput.value = batchToEdit.days;
      batchFacultyInput.value = batchToEdit.faculty;
      batchSeatsInput.value = batchToEdit.status;
      batchLabInput.value = batchToEdit.lab || '';
    } else {
      batchModalTitle.textContent = 'Add Class Batch';
      batchForm.reset();
      batchEditId.value = '';
    }
    openModal('batchModal');
  };

  if (openAddBatchModalBtn) {
    openAddBatchModalBtn.addEventListener('click', () => openBatchModal());
  }

  const renderBatches = () => {
    const batches = getStore('ase_batches', DEFAULT_BATCHES);
    document.getElementById('countBatches').textContent = batches.length;
    document.getElementById('statTotalBatches').textContent = batches.length;

    // Overview snapshot
    const overviewSnapshot = document.getElementById('overviewBatchesSnapshot');
    if (overviewSnapshot) {
      overviewSnapshot.innerHTML = batches.slice(0, 4).map(b => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <div>
            <strong style="color: #ffffff; font-size: 0.92rem;">${b.name}</strong>
            <span style="display: block; font-size: 0.76rem; color: #94a3b8;"><i class="fa-solid fa-clock text-teal"></i> ${b.time} &bull; ${b.faculty}</span>
          </div>
          <span class="status-pill ${getStatusClass(b.status)}">${b.status}</span>
        </div>
      `).join('');
    }

    if (!batchesTableBody) return;
    batchesTableBody.innerHTML = '';

    batches.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong style="color: #ffffff;">${b.name}</strong>
          <span style="display: block; font-size: 0.78rem; color: #38bdf8;">${b.course}</span>
        </td>
        <td><i class="fa-regular fa-clock text-teal"></i> ${b.time}</td>
        <td>${b.days}</td>
        <td>${b.faculty}</td>
        <td>${b.lab || 'Main Lab'}</td>
        <td><span class="status-pill ${getStatusClass(b.status)}">${b.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action edit btn-edit-batch" data-id="${b.id}" title="Edit Batch">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-table-action delete btn-del-batch" data-id="${b.id}" title="Delete Batch">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      batchesTableBody.appendChild(tr);
    });

    batchesTableBody.querySelectorAll('.btn-edit-batch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const b = batches.find(item => item.id === id);
        if (b) openBatchModal(b);
      });
    });

    batchesTableBody.querySelectorAll('.btn-del-batch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this batch timetable?')) {
          const updated = batches.filter(item => item.id !== id);
          setStore('ase_batches', updated);
          renderBatches();
          showToast('Batch removed from timetable.', 'info');
        }
      });
    });
  };

  const getStatusClass = (status) => {
    if (status === 'Admission Open') return 'open';
    if (status === 'Few Seats Left') return 'few';
    if (status === 'Batch Starting Soon') return 'soon';
    return 'full';
  };

  if (batchForm) {
    batchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const batches = getStore('ase_batches', DEFAULT_BATCHES);
      const editId = batchEditId.value;

      const batchObj = {
        id: editId || `b-${Date.now()}`,
        course: batchCourseSelect.value,
        name: batchNameInput.value.trim(),
        time: batchTimeInput.value.trim(),
        days: batchDaysInput.value.trim(),
        faculty: batchFacultyInput.value.trim() || 'Senior Faculty',
        lab: batchLabInput.value.trim() || 'Main Campus',
        status: batchSeatsInput.value
      };

      if (editId) {
        const idx = batches.findIndex(b => b.id === editId);
        if (idx !== -1) batches[idx] = batchObj;
        showToast('Batch timetable updated!', 'success');
      } else {
        batches.push(batchObj);
        showToast('New class batch added!', 'success');
      }

      setStore('ase_batches', batches);
      closeModal('batchModal');
      renderBatches();
    });
  }

  // ================================================================
  // 9. MODULE: FEE STRUCTURE
  // ================================================================
  const feesTableBody = document.getElementById('feesTableBody');
  const feeModal = document.getElementById('feeModal');
  const feeForm = document.getElementById('feeForm');
  const openAddFeeModalBtn = document.getElementById('openAddFeeModal');
  const feeModalTitle = document.getElementById('feeModalTitle');

  const feeEditId = document.getElementById('feeEditId');
  const feeCourseNameInput = document.getElementById('feeCourseNameInput');
  const feeDurationInput = document.getElementById('feeDurationInput');
  const feeStandardAmountInput = document.getElementById('feeStandardAmountInput');
  const feeInstallmentInput = document.getElementById('feeInstallmentInput');
  const feeDiscountInput = document.getElementById('feeDiscountInput');

  const openFeeModal = (feeToEdit = null) => {
    if (feeToEdit) {
      feeModalTitle.textContent = 'Edit Fee Structure';
      feeEditId.value = feeToEdit.id;
      feeCourseNameInput.value = feeToEdit.course;
      feeDurationInput.value = feeToEdit.duration;
      feeStandardAmountInput.value = feeToEdit.fee;
      feeInstallmentInput.value = feeToEdit.installment || '';
      feeDiscountInput.value = feeToEdit.offer || '';
    } else {
      feeModalTitle.textContent = 'Set Course Fee Plan';
      feeForm.reset();
      feeEditId.value = '';
    }
    openModal('feeModal');
  };

  if (openAddFeeModalBtn) {
    openAddFeeModalBtn.addEventListener('click', () => openFeeModal());
  }

  const renderFees = () => {
    const fees = getStore('ase_fees', DEFAULT_FEES);
    if (!feesTableBody) return;
    feesTableBody.innerHTML = '';

    fees.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: #ffffff;">${f.course}</strong></td>
        <td>${f.duration}</td>
        <td><strong style="color: #fbbf24; font-size: 1.05rem;">${f.fee}</strong></td>
        <td>${f.installment || 'Available on request'}</td>
        <td><span style="color: #86efac; font-size: 0.84rem;">${f.offer || 'N/A'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action edit btn-edit-fee" data-id="${f.id}" title="Edit Fee">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-table-action delete btn-del-fee" data-id="${f.id}" title="Delete Fee">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      feesTableBody.appendChild(tr);
    });

    feesTableBody.querySelectorAll('.btn-edit-fee').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const f = fees.find(item => item.id === id);
        if (f) openFeeModal(f);
      });
    });

    feesTableBody.querySelectorAll('.btn-del-fee').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this fee plan?')) {
          const updated = fees.filter(item => item.id !== id);
          setStore('ase_fees', updated);
          renderFees();
          showToast('Fee plan removed.', 'info');
        }
      });
    });
  };

  if (feeForm) {
    feeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fees = getStore('ase_fees', DEFAULT_FEES);
      const editId = feeEditId.value;

      const feeObj = {
        id: editId || `f-${Date.now()}`,
        course: feeCourseNameInput.value.trim(),
        duration: feeDurationInput.value.trim() || 'Ongoing',
        fee: feeStandardAmountInput.value.trim(),
        installment: feeInstallmentInput.value.trim(),
        offer: feeDiscountInput.value.trim()
      };

      if (editId) {
        const idx = fees.findIndex(f => f.id === editId);
        if (idx !== -1) fees[idx] = feeObj;
        showToast('Fee plan updated!', 'success');
      } else {
        fees.push(feeObj);
        showToast('New fee plan added!', 'success');
      }

      setStore('ase_fees', fees);
      closeModal('feeModal');
      renderFees();
    });
  }

  // ================================================================
  // 10. MODULE: ANNOUNCEMENTS & NOTICES
  // ================================================================
  const noticesList = document.getElementById('noticesList');
  const noticeModal = document.getElementById('noticeModal');
  const noticeForm = document.getElementById('noticeForm');
  const openAddNoticeModalBtn = document.getElementById('openAddNoticeModal');
  const noticeModalTitle = document.getElementById('noticeModalTitle');

  const noticeEditId = document.getElementById('noticeEditId');
  const noticeBadgeInput = document.getElementById('noticeBadgeInput');
  const noticeTextInput = document.getElementById('noticeTextInput');
  const noticeLiveCheckbox = document.getElementById('noticeLiveCheckbox');

  const openNoticeModal = (noticeToEdit = null) => {
    if (noticeToEdit) {
      noticeModalTitle.textContent = 'Edit Announcement';
      noticeEditId.value = noticeToEdit.id;
      noticeBadgeInput.value = noticeToEdit.badge;
      noticeTextInput.value = noticeToEdit.text;
      noticeLiveCheckbox.checked = !!noticeToEdit.live;
    } else {
      noticeModalTitle.textContent = 'Post New Announcement';
      noticeForm.reset();
      noticeEditId.value = '';
      noticeLiveCheckbox.checked = true;
    }
    openModal('noticeModal');
  };

  if (openAddNoticeModalBtn) {
    openAddNoticeModalBtn.addEventListener('click', () => openNoticeModal());
  }

  const renderNotices = () => {
    const notices = getStore('ase_announcements', DEFAULT_NOTICES);
    const activeCount = notices.filter(n => n.live).length;
    document.getElementById('countNotices').textContent = notices.length;
    document.getElementById('statActiveNotices').textContent = activeCount;

    if (!noticesList) return;
    noticesList.innerHTML = '';

    notices.forEach(n => {
      const card = document.createElement('div');
      card.className = 'notice-admin-card';
      card.innerHTML = `
        <div class="notice-card-content">
          <span class="notice-card-badge"><i class="fa-solid fa-bell"></i> ${n.badge}</span>
          <p class="notice-card-text">${n.text}</p>
          <div class="notice-card-meta">
            <span>Posted: ${n.date || 'Active'}</span> &bull; 
            <span style="color: ${n.live ? '#4ade80' : '#94a3b8'}; font-weight: 600;">
              ${n.live ? '● Visible on live website' : '○ Draft'}
            </span>
          </div>
        </div>
        <div class="table-actions">
          <button class="btn btn-outline-light btn-sm btn-toggle-notice" data-id="${n.id}">
            ${n.live ? '<i class="fa-solid fa-eye-slash"></i> Hide' : '<i class="fa-solid fa-eye"></i> Show'}
          </button>
          <button class="btn-table-action edit btn-edit-notice" data-id="${n.id}" title="Edit Notice">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-table-action delete btn-del-notice" data-id="${n.id}" title="Delete Notice">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      noticesList.appendChild(card);
    });

    noticesList.querySelectorAll('.btn-toggle-notice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = notices.find(n => n.id === id);
        if (item) {
          item.live = !item.live;
          setStore('ase_announcements', notices);
          renderNotices();
          showToast(item.live ? 'Announcement is now live on website!' : 'Announcement hidden from website.', 'info');
        }
      });
    });

    noticesList.querySelectorAll('.btn-edit-notice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = notices.find(n => n.id === id);
        if (item) openNoticeModal(item);
      });
    });

    noticesList.querySelectorAll('.btn-del-notice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this announcement?')) {
          const updated = notices.filter(n => n.id !== id);
          setStore('ase_announcements', updated);
          renderNotices();
          showToast('Announcement deleted.', 'info');
        }
      });
    });
  };

  if (noticeForm) {
    noticeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const notices = getStore('ase_announcements', DEFAULT_NOTICES);
      const editId = noticeEditId.value;

      const noticeObj = {
        id: editId || `n-${Date.now()}`,
        badge: noticeBadgeInput.value.trim() || 'Announcement',
        text: noticeTextInput.value.trim(),
        live: noticeLiveCheckbox.checked,
        date: new Date().toLocaleDateString('en-GB')
      };

      if (editId) {
        const idx = notices.findIndex(n => n.id === editId);
        if (idx !== -1) notices[idx] = noticeObj;
        showToast('Announcement updated!', 'success');
      } else {
        notices.unshift(noticeObj);
        showToast('Announcement published to website!', 'success');
      }

      setStore('ase_announcements', notices);
      closeModal('noticeModal');
      renderNotices();
    });
  }

  // ================================================================
  // 11. MODULE: STUDENT DEMO INQUIRIES
  // ================================================================
  const inquiriesTableBody = document.getElementById('inquiriesTableBody');
  const overviewRecentInquiries = document.getElementById('overviewRecentInquiries');
  const exportLeadsBtn = document.getElementById('exportLeadsBtn');
  const clearLeadsBtn = document.getElementById('clearLeadsBtn');

  const renderInquiries = () => {
    const leads = getStore('ase_registrations', []);
    document.getElementById('countInquiries').textContent = leads.length;
    document.getElementById('statTotalLeads').textContent = leads.length;

    // Overview recent bookings
    if (overviewRecentInquiries) {
      if (leads.length === 0) {
        overviewRecentInquiries.innerHTML = `
          <p style="color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 1.5rem 0;">
            <i class="fa-regular fa-folder-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;"></i>
            No student demo bookings received yet. Submissions from the website will automatically appear here.
          </p>
        `;
      } else {
        overviewRecentInquiries.innerHTML = leads.slice(0, 4).map(l => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <strong style="color: #ffffff; font-size: 0.92rem;">${l.name}</strong>
              <span style="display: block; font-size: 0.76rem; color: #38bdf8;">${l.course} &bull; ${l.phone}</span>
            </div>
            <a href="https://wa.me/91${l.phone.replace(/\D/g, '')}" target="_blank" class="btn-whatsapp-direct" title="Message on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> Chat
            </a>
          </div>
        `).join('');
      }
    }

    if (!inquiriesTableBody) return;
    inquiriesTableBody.innerHTML = '';

    if (leads.length === 0) {
      inquiriesTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: #94a3b8;">
            <i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;"></i>
            No demo registrations submitted yet. As prospective students sign up on the website, their details appear here in real time.
          </td>
        </tr>
      `;
      return;
    }

    leads.forEach((l, index) => {
      const cleanPhone = l.phone.replace(/\D/g, '');
      const waMsg = encodeURIComponent(`Hello ${l.name}, thank you for registering for a free demo class in ${l.course} at ASE Aptitude. We have confirmed your slot.`);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="font-size: 0.8rem; color: #94a3b8;">${l.date || 'Recent'}</span></td>
        <td><strong style="color: #ffffff;">${l.name}</strong></td>
        <td><a href="tel:+91${cleanPhone}" style="color: #38bdf8; font-weight: 600;">+91 ${cleanPhone}</a></td>
        <td><span style="color: #fbbf24;">${l.course}</span></td>
        <td>${l.time || 'Flexible'}</td>
        <td><span style="font-size: 0.82rem; color: #cbd5e1;">${l.message || 'None'}</span></td>
        <td>
          <div class="table-actions">
            <a href="tel:+91${cleanPhone}" class="btn-phone-direct" title="Call Student">
              <i class="fa-solid fa-phone"></i> Call
            </a>
            <a href="https://wa.me/91${cleanPhone}?text=${waMsg}" target="_blank" class="btn-whatsapp-direct" title="Chat on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <button class="btn-table-action delete btn-del-lead" data-index="${index}" title="Delete Lead">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      inquiriesTableBody.appendChild(tr);
    });

    inquiriesTableBody.querySelectorAll('.btn-del-lead').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (confirm('Delete this inquiry?')) {
          leads.splice(idx, 1);
          setStore('ase_registrations', leads);
          renderInquiries();
          showToast('Inquiry deleted.', 'info');
        }
      });
    });
  };

  // Export CSV
  if (exportLeadsBtn) {
    exportLeadsBtn.addEventListener('click', () => {
      const leads = getStore('ase_registrations', []);
      if (leads.length === 0) {
        showToast('No registrations to export.', 'info');
        return;
      }
      let csv = 'Date,Student Name,Phone,Course,Preferred Time,Message\n';
      leads.forEach(l => {
        csv += `"${l.date || ''}","${l.name || ''}","${l.phone || ''}","${l.course || ''}","${l.time || ''}","${(l.message || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ASE_Aptitude_Leads_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Leads exported to CSV successfully.', 'success');
    });
  }

  // Clear All Leads
  if (clearLeadsBtn) {
    clearLeadsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all student inquiry records? This cannot be undone.')) {
        setStore('ase_registrations', []);
        renderInquiries();
        showToast('All student inquiries cleared.', 'info');
      }
    });
  }

  // ================================================================
  // 12. MODULE: ADMIN SETTINGS & SECURITY
  // ================================================================
  const changePasswordForm = document.getElementById('changePasswordForm');
  const newAdminUsername = document.getElementById('newAdminUsername');
  const newAdminPassword = document.getElementById('newAdminPassword');
  const confirmAdminPassword = document.getElementById('confirmAdminPassword');
  const backupDataBtn = document.getElementById('backupDataBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  // Load current admin username
  const currentCreds = getStore('ase_admin_creds', DEFAULT_ADMIN_CREDS);
  if (newAdminUsername) newAdminUsername.value = currentCreds.username;

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = newAdminUsername.value.trim();
      const pass = newAdminPassword.value.trim();
      const conf = confirmAdminPassword.value.trim();

      if (!user || !pass) {
        showToast('Username and password are required.', 'error');
        return;
      }

      if (pass.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }

      if (pass !== conf) {
        showToast('Passwords do not match!', 'error');
        return;
      }

      setStore('ase_admin_creds', { username: user, password: pass });
      changePasswordForm.reset();
      newAdminUsername.value = user;
      if (displayAdminName) displayAdminName.textContent = user.toUpperCase();
      showToast('Admin credentials updated successfully!', 'success');
    });
  }

  // Backup Data as JSON
  if (backupDataBtn) {
    backupDataBtn.addEventListener('click', () => {
      const exportData = {
        courses: getStore('ase_courses', DEFAULT_COURSES),
        batches: getStore('ase_batches', DEFAULT_BATCHES),
        fees: getStore('ase_fees', DEFAULT_FEES),
        announcements: getStore('ase_announcements', DEFAULT_NOTICES),
        registrations: getStore('ase_registrations', []),
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ASE_Aptitude_Data_Backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Portal backup downloaded!', 'success');
    });
  }

  // Reset to Defaults
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Reset all portal data back to initial institute defaults? This will restore original courses, batches, and fees.')) {
        setStore('ase_courses', DEFAULT_COURSES);
        setStore('ase_batches', DEFAULT_BATCHES);
        setStore('ase_fees', DEFAULT_FEES);
        setStore('ase_announcements', DEFAULT_NOTICES);
        renderAll();
        showToast('System reset to institute defaults.', 'info');
      }
    });
  }

  // ================================================================
  // 13. MASTER RENDER ALL
  // ================================================================
  const renderAll = () => {
    renderCourses();
    renderBatches();
    renderFees();
    renderNotices();
    renderInquiries();
  };

  // Check login on load
  checkAuth();
});
