/**
 * ASE APTITUDE – Production Admin Dashboard JS (admin.js)
 * Interacts directly with the Express REST API endpoints via fetch + JWT Bearer Auth.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // API Base Configuration
  const API_BASE = '/api';

  // State Management
  let authToken = localStorage.getItem('ase_jwt_token') || '';
  let currentAdmin = null;

  // DOM Elements - Auth
  const authGate = document.getElementById('authGate');
  const adminLayout = document.getElementById('adminLayout');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminEmailInput = document.getElementById('adminEmail');
  const adminPasswordInput = document.getElementById('adminPassword');
  const authAlert = document.getElementById('authAlert');
  const togglePwBtn = document.getElementById('togglePwBtn');
  const togglePwIcon = document.getElementById('togglePwIcon');
  const logoutBtn = document.getElementById('logoutBtn');
  const displayAdminName = document.getElementById('displayAdminName');
  const displayAdminEmail = document.getElementById('displayAdminEmail');

  // Helper: Toast Notifications
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

  // Helper: Authenticated Fetch
  const apiFetch = async (endpoint, options = {}) => {
    const headers = options.headers || {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (response.status === 401) {
        // Token invalid or expired
        authToken = '';
        localStorage.removeItem('ase_jwt_token');
        checkAuth();
        showToast('Your session has expired. Please sign in again.', 'error');
        throw new Error(data.message || 'Session expired');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error.message);
      throw error;
    }
  };

  // Check Authentication Status
  const checkAuth = async () => {
    if (!authToken) {
      authGate.style.display = 'flex';
      adminLayout.style.display = 'none';
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.admin) {
        currentAdmin = res.admin;
        authGate.style.display = 'none';
        adminLayout.style.display = 'flex';
        if (displayAdminName) displayAdminName.textContent = currentAdmin.name;
        if (displayAdminEmail) displayAdminEmail.textContent = currentAdmin.email;
        document.getElementById('profileName').textContent = currentAdmin.name;
        document.getElementById('profileEmail').textContent = currentAdmin.email;
        document.getElementById('profileRole').textContent = currentAdmin.role.toUpperCase();

        // Load all portal datasets
        loadDashboardStats();
        loadDemoApplications();
        loadContactMessages();
        loadCourses();
        loadReviews();
        loadGallery();
      } else {
        throw new Error('Verification failed');
      }
    } catch (e) {
      authToken = '';
      localStorage.removeItem('ase_jwt_token');
      authGate.style.display = 'flex';
      adminLayout.style.display = 'none';
    }
  };

  // Toggle Password Visibility
  if (togglePwBtn && adminPasswordInput) {
    togglePwBtn.addEventListener('click', () => {
      const isPw = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPw ? 'text' : 'password';
      togglePwIcon.className = isPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }

  // Handle Login
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = adminEmailInput.value.trim();
      const password = adminPasswordInput.value.trim();

      if (!email || !password) {
        authAlert.style.display = 'block';
        authAlert.className = 'auth-alert error';
        authAlert.textContent = 'Please enter both email and password.';
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success && data.token) {
          authToken = data.token;
          localStorage.setItem('ase_jwt_token', authToken);
          authAlert.style.display = 'none';
          adminLoginForm.reset();
          showToast('Welcome to ASE Aptitude Administration Portal!', 'success');
          checkAuth();
        } else {
          authAlert.style.display = 'block';
          authAlert.className = 'auth-alert error';
          authAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${data.message || 'Login failed'}`;
        }
      } catch (err) {
        authAlert.style.display = 'block';
        authAlert.className = 'auth-alert error';
        authAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Could not connect to backend server. Ensure backend is running.';
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await apiFetch('/auth/logout', { method: 'POST' });
      } catch (e) {
        // Proceed with local logout regardless
      }
      authToken = '';
      currentAdmin = null;
      localStorage.removeItem('ase_jwt_token');
      checkAuth();
      showToast('You have signed out successfully.', 'info');
    });
  }

  // ================================================================
  // SIDEBAR TABS & NAVIGATION
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

    if (adminSidebar) adminSidebar.classList.remove('is-open');
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  document.querySelectorAll('[data-switch-to]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-switch-to')));
  });

  if (adminHamburgerBtn && adminSidebar) {
    adminHamburgerBtn.addEventListener('click', () => adminSidebar.classList.toggle('is-open'));
  }
  if (sidebarCloseBtn && adminSidebar) {
    sidebarCloseBtn.addEventListener('click', () => adminSidebar.classList.remove('is-open'));
  }

  // ================================================================
  // MODAL CONTROLS
  // ================================================================
  const openModal = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
    }
  };

  const closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
    }
  };

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('admin-modal')) {
      e.target.classList.remove('is-open');
      e.target.setAttribute('aria-hidden', 'true');
    }
  });

  // ================================================================
  // MODULE 1: DASHBOARD STATS & RECENT ACTIVITY
  // ================================================================
  const loadDashboardStats = async () => {
    try {
      const res = await apiFetch('/stats');
      if (res.success && res.data) {
        const d = res.data;
        document.getElementById('statTotalDemos').textContent = d.totalDemoApplications || 0;
        document.getElementById('statNewDemos').textContent = d.newDemoApplications || 0;
        document.getElementById('statTotalMessages').textContent = d.totalContactMessages || 0;
        document.getElementById('statActiveCourses').textContent = d.activeCourses || 0;
        document.getElementById('statActiveReviews').textContent = d.activeReviews || 0;
        document.getElementById('statTotalGallery').textContent = d.totalGalleryImages || 0;

        document.getElementById('badgeDemoCount').textContent = d.newDemoApplications || 0;
        document.getElementById('badgeContactCount').textContent = d.newContactMessages || 0;
        document.getElementById('badgeCourseCount').textContent = d.activeCourses || 0;
        document.getElementById('badgeReviewCount').textContent = d.activeReviews || 0;
        document.getElementById('badgeGalleryCount').textContent = d.totalGalleryImages || 0;

        // Render Recent Demos
        const recentDemosBox = document.getElementById('overviewRecentDemos');
        if (recentDemosBox) {
          if (!d.recentApplications || d.recentApplications.length === 0) {
            recentDemosBox.innerHTML = '<p style="color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 1rem 0;">No applications received yet.</p>';
          } else {
            recentDemosBox.innerHTML = d.recentApplications.map(app => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <div>
                  <strong style="color: #ffffff;">${app.fullName}</strong>
                  <span style="display: block; font-size: 0.76rem; color: #38bdf8;">${app.courseInterested} &bull; ${app.phone}</span>
                </div>
                <span class="status-pill ${app.status}">${app.status}</span>
              </div>
            `).join('');
          }
        }

        // Render Recent Messages
        const recentContactsBox = document.getElementById('overviewRecentContacts');
        if (recentContactsBox) {
          if (!d.recentMessages || d.recentMessages.length === 0) {
            recentContactsBox.innerHTML = '<p style="color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 1rem 0;">No contact messages received yet.</p>';
          } else {
            recentContactsBox.innerHTML = d.recentMessages.map(msg => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <div>
                  <strong style="color: #ffffff;">${msg.name}</strong>
                  <span style="display: block; font-size: 0.76rem; color: #cbd5e1;">${msg.subject || 'Enquiry'} &bull; ${msg.phone || msg.email || ''}</span>
                </div>
                <span class="status-pill ${msg.status}">${msg.status}</span>
              </div>
            `).join('');
          }
        }
      }
    } catch (err) {
      console.warn('Could not load dashboard stats:', err.message);
    }
  };

  // ================================================================
  // MODULE 2: FREE DEMO APPLICATIONS
  // ================================================================
  const demosTableBody = document.getElementById('demosTableBody');
  const demoSearchInput = document.getElementById('demoSearchInput');
  const demoStatusFilter = document.getElementById('demoStatusFilter');
  const demoCourseFilter = document.getElementById('demoCourseFilter');
  const refreshDemosBtn = document.getElementById('refreshDemosBtn');

  let currentDemos = [];

  const loadDemoApplications = async () => {
    try {
      const status = demoStatusFilter ? demoStatusFilter.value : 'all';
      const course = demoCourseFilter ? demoCourseFilter.value : 'all';
      const search = demoSearchInput ? demoSearchInput.value.trim() : '';

      const query = new URLSearchParams();
      if (status !== 'all') query.append('status', status);
      if (course !== 'all') query.append('course', course);
      if (search) query.append('search', search);

      const res = await apiFetch(`/demo-applications?${query.toString()}`);
      if (res.success) {
        currentDemos = res.data;
        renderDemosTable();
      }
    } catch (err) {
      if (demosTableBody) {
        demosTableBody.innerHTML = '<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 2rem;">Failed to load demo applications.</td></tr>';
      }
    }
  };

  const renderDemosTable = () => {
    if (!demosTableBody) return;
    if (currentDemos.length === 0) {
      demosTableBody.innerHTML = '<tr><td colspan="7" style="color: #94a3b8; text-align: center; padding: 2.5rem;"><i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;"></i> No demo applications matching criteria.</td></tr>';
      return;
    }

    demosTableBody.innerHTML = currentDemos.map((app, index) => {
      const date = new Date(app.createdAt).toLocaleDateString('en-GB');
      const waMsg = encodeURIComponent(`Hello ${app.fullName}, regarding your demo class request for ${app.courseInterested} at ASE Aptitude...`);
      return `
        <tr>
          <td><span style="font-size: 0.82rem; color: #94a3b8;">${date}</span></td>
          <td><strong style="color: #ffffff;">${app.fullName}</strong></td>
          <td>
            <a href="tel:+91${app.phone}" style="color: #38bdf8; font-weight: 600;">+91 ${app.phone}</a>
            ${app.email ? `<span style="display:block; font-size:0.75rem; color:#94a3b8;">${app.email}</span>` : ''}
          </td>
          <td><span style="color: #fbbf24;">${app.courseInterested}</span></td>
          <td>${app.preferredTime}</td>
          <td>
            <select class="toolbar-select demo-status-select" data-id="${app._id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
              <option value="new" ${app.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${app.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="admitted" ${app.status === 'admitted' ? 'selected' : ''}>Admitted</option>
              <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action view btn-view-demo" data-index="${index}" title="View Application Details">
                <i class="fa-solid fa-eye"></i>
              </button>
              <a href="tel:+91${app.phone}" class="btn-phone-direct" title="Call Student">
                <i class="fa-solid fa-phone"></i>
              </a>
              <a href="https://wa.me/91${app.phone}?text=${waMsg}" target="_blank" class="btn-whatsapp-direct" title="Chat on WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
              <button class="btn-table-action delete btn-delete-demo" data-id="${app._id}" title="Delete Application">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Status change listener
    demosTableBody.querySelectorAll('.demo-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const id = sel.getAttribute('data-id');
        const newStatus = sel.value;
        try {
          await apiFetch(`/demo-applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
          });
          showToast(`Application status updated to ${newStatus}.`, 'success');
          loadDashboardStats();
        } catch (e) {
          showToast('Failed to update status.', 'error');
        }
      });
    });

    // View details listener
    demosTableBody.querySelectorAll('.btn-view-demo').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const app = currentDemos[idx];
        if (!app) return;

        const body = document.getElementById('viewDemoBody');
        body.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="profile-details-row"><strong>Student Name:</strong> <span>${app.fullName}</span></div>
            <div class="profile-details-row"><strong>Phone:</strong> <span><a href="tel:+91${app.phone}" style="color:#38bdf8;">+91 ${app.phone}</a></span></div>
            <div class="profile-details-row"><strong>Email:</strong> <span>${app.email || 'None provided'}</span></div>
            <div class="profile-details-row"><strong>Course:</strong> <span style="color:#fbbf24;">${app.courseInterested}</span></div>
            <div class="profile-details-row"><strong>Preferred Batch:</strong> <span>${app.preferredTime}</span></div>
            <div class="profile-details-row"><strong>Current Status:</strong> <span class="status-pill ${app.status}">${app.status}</span></div>
            <div class="profile-details-row"><strong>Date Submitted:</strong> <span>${new Date(app.createdAt).toLocaleString()}</span></div>
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
              <strong style="display:block; margin-bottom: 0.3rem; font-size: 0.85rem; color:#94a3b8;">Student Message / Goal:</strong>
              <p style="color: #ffffff;">${app.message || 'No additional message provided.'}</p>
            </div>
          </div>
        `;
        openModal('viewDemoModal');
      });
    });

    // Delete listener
    demosTableBody.querySelectorAll('.btn-delete-demo').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to permanently delete this application?')) {
          try {
            await apiFetch(`/demo-applications/${id}`, { method: 'DELETE' });
            showToast('Application deleted.', 'info');
            loadDemoApplications();
            loadDashboardStats();
          } catch (e) {
            showToast('Failed to delete application.', 'error');
          }
        }
      });
    });
  };

  if (demoSearchInput) demoSearchInput.addEventListener('input', () => loadDemoApplications());
  if (demoStatusFilter) demoStatusFilter.addEventListener('change', () => loadDemoApplications());
  if (demoCourseFilter) demoCourseFilter.addEventListener('change', () => loadDemoApplications());
  if (refreshDemosBtn) refreshDemosBtn.addEventListener('click', () => loadDemoApplications());

  // ================================================================
  // MODULE 3: CONTACT MESSAGES
  // ================================================================
  const contactsTableBody = document.getElementById('contactsTableBody');
  const contactSearchInput = document.getElementById('contactSearchInput');
  const contactStatusFilter = document.getElementById('contactStatusFilter');
  const refreshContactsBtn = document.getElementById('refreshContactsBtn');

  let currentContacts = [];

  const loadContactMessages = async () => {
    try {
      const status = contactStatusFilter ? contactStatusFilter.value : 'all';
      const search = contactSearchInput ? contactSearchInput.value.trim() : '';

      const query = new URLSearchParams();
      if (status !== 'all') query.append('status', status);
      if (search) query.append('search', search);

      const res = await apiFetch(`/contact?${query.toString()}`);
      if (res.success) {
        currentContacts = res.data;
        renderContactsTable();
      }
    } catch (err) {
      if (contactsTableBody) {
        contactsTableBody.innerHTML = '<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 2rem;">Failed to load contact messages.</td></tr>';
      }
    }
  };

  const renderContactsTable = () => {
    if (!contactsTableBody) return;
    if (currentContacts.length === 0) {
      contactsTableBody.innerHTML = '<tr><td colspan="7" style="color: #94a3b8; text-align: center; padding: 2.5rem;"><i class="fa-solid fa-envelope-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;"></i> No messages found.</td></tr>';
      return;
    }

    contactsTableBody.innerHTML = currentContacts.map((msg, index) => {
      const date = new Date(msg.createdAt).toLocaleDateString('en-GB');
      const preview = msg.message ? (msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message) : '';
      return `
        <tr>
          <td><span style="font-size: 0.82rem; color: #94a3b8;">${date}</span></td>
          <td><strong style="color: #ffffff;">${msg.name}</strong></td>
          <td>
            ${msg.phone ? `<div><a href="tel:${msg.phone}" style="color:#38bdf8;">${msg.phone}</a></div>` : ''}
            ${msg.email ? `<span style="font-size: 0.78rem; color: #94a3b8;">${msg.email}</span>` : ''}
          </td>
          <td><span style="color: #ffffff; font-weight: 500;">${msg.subject || 'Enquiry'}</span></td>
          <td><span style="color: #cbd5e1; font-size: 0.86rem;">${preview}</span></td>
          <td>
            <select class="toolbar-select contact-status-select" data-id="${msg._id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
              <option value="new" ${msg.status === 'new' ? 'selected' : ''}>New</option>
              <option value="read" ${msg.status === 'read' ? 'selected' : ''}>Read</option>
              <option value="responded" ${msg.status === 'responded' ? 'selected' : ''}>Responded</option>
              <option value="archived" ${msg.status === 'archived' ? 'selected' : ''}>Archived</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action view btn-view-contact" data-index="${index}" title="View Full Message">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-table-action delete btn-delete-contact" data-id="${msg._id}" title="Delete Message">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Status change listener
    contactsTableBody.querySelectorAll('.contact-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const id = sel.getAttribute('data-id');
        const newStatus = sel.value;
        try {
          await apiFetch(`/contact/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
          });
          showToast(`Message status updated to ${newStatus}.`, 'success');
          loadDashboardStats();
        } catch (e) {
          showToast('Failed to update status.', 'error');
        }
      });
    });

    // View message listener
    contactsTableBody.querySelectorAll('.btn-view-contact').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const msg = currentContacts[idx];
        if (!msg) return;

        const body = document.getElementById('viewContactBody');
        body.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="profile-details-row"><strong>From:</strong> <span>${msg.name}</span></div>
            <div class="profile-details-row"><strong>Phone:</strong> <span>${msg.phone || 'None provided'}</span></div>
            <div class="profile-details-row"><strong>Email:</strong> <span>${msg.email || 'None provided'}</span></div>
            <div class="profile-details-row"><strong>Subject:</strong> <span>${msg.subject || 'General Enquiry'}</span></div>
            <div class="profile-details-row"><strong>Status:</strong> <span class="status-pill ${msg.status}">${msg.status}</span></div>
            <div class="profile-details-row"><strong>Date:</strong> <span>${new Date(msg.createdAt).toLocaleString()}</span></div>
            <div style="background: rgba(0,0,0,0.3); padding: 1.25rem; border-radius: 8px; margin-top: 0.5rem;">
              <strong style="display:block; margin-bottom: 0.4rem; color: #38bdf8;">Full Message:</strong>
              <p style="color: #ffffff; white-space: pre-wrap;">${msg.message}</p>
            </div>
          </div>
        `;
        openModal('viewContactModal');
      });
    });

    // Delete listener
    contactsTableBody.querySelectorAll('.btn-delete-contact').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this message permanently?')) {
          try {
            await apiFetch(`/contact/${id}`, { method: 'DELETE' });
            showToast('Message deleted.', 'info');
            loadContactMessages();
            loadDashboardStats();
          } catch (e) {
            showToast('Failed to delete message.', 'error');
          }
        }
      });
    });
  };

  if (contactSearchInput) contactSearchInput.addEventListener('input', () => loadContactMessages());
  if (contactStatusFilter) contactStatusFilter.addEventListener('change', () => loadContactMessages());
  if (refreshContactsBtn) refreshContactsBtn.addEventListener('click', () => loadContactMessages());

  // ================================================================
  // MODULE 4: COURSE MANAGEMENT
  // ================================================================
  const coursesList = document.getElementById('coursesList');
  const courseModal = document.getElementById('courseModal');
  const courseForm = document.getElementById('courseForm');
  const openAddCourseModalBtn = document.getElementById('openAddCourseModal');
  const courseModalTitle = document.getElementById('courseModalTitle');

  const courseEditId = document.getElementById('courseEditId');
  const courseTitleInput = document.getElementById('courseTitleInput');
  const courseSlugInput = document.getElementById('courseSlugInput');
  const courseThemeInput = document.getElementById('courseThemeInput');
  const courseDurationInput = document.getElementById('courseDurationInput');
  const courseFeeInput = document.getElementById('courseFeeInput');
  const courseShortDescInput = document.getElementById('courseShortDescInput');
  const courseDetailsInput = document.getElementById('courseDetailsInput');
  const courseActiveInput = document.getElementById('courseActiveInput');

  let currentCourses = [];

  const loadCourses = async () => {
    try {
      const res = await apiFetch('/courses/all');
      if (res.success) {
        currentCourses = res.data;
        renderCourses();
      }
    } catch (err) {
      if (coursesList) {
        coursesList.innerHTML = '<p style="color: #f87171;">Failed to load courses from server.</p>';
      }
    }
  };

  const renderCourses = () => {
    if (!coursesList) return;
    if (currentCourses.length === 0) {
      coursesList.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 2rem;">No courses available. Click "Add New Course" to create one.</p>';
      return;
    }

    coursesList.innerHTML = currentCourses.map((c, index) => {
      const detailsPills = (c.courseDetails || []).map(d => `<span class="topic-pill">${d}</span>`).join('');
      return `
        <div class="course-admin-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="course-admin-badge">${c.badge || 'Course'}</span>
            <span class="status-pill ${c.isActive ? 'open' : 'rejected'}">${c.isActive ? 'Active' : 'Inactive'}</span>
          </div>
          <h3 class="course-admin-title">${c.title}</h3>
          <p class="course-admin-desc">${c.shortDescription}</p>
          <div class="course-admin-details">
            <span><i class="fa-regular fa-clock text-teal"></i> ${c.duration || 'Flexible'}</span>
            <span><i class="fa-solid fa-indian-rupee-sign text-gold"></i> ${c.fee || 'Affordable'}</span>
          </div>
          <div class="topics-pills">${detailsPills}</div>
          <div class="card-actions-row">
            <button class="btn btn-outline-light btn-sm btn-edit-course" data-index="${index}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="btn btn-outline-danger btn-sm btn-delete-course" data-id="${c._id}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    coursesList.querySelectorAll('.btn-edit-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const c = currentCourses[idx];
        if (!c) return;

        courseModalTitle.textContent = 'Edit Course';
        courseEditId.value = c._id;
        courseTitleInput.value = c.title;
        courseSlugInput.value = c.slug || '';
        courseThemeInput.value = c.theme || 'theme-blue';
        courseDurationInput.value = c.duration || '';
        courseFeeInput.value = c.fee || '';
        courseShortDescInput.value = c.shortDescription || '';
        courseDetailsInput.value = (c.courseDetails || []).join(', ');
        courseActiveInput.checked = !!c.isActive;
        openModal('courseModal');
      });
    });

    coursesList.querySelectorAll('.btn-delete-course').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to permanently delete this course?')) {
          try {
            await apiFetch(`/courses/${id}`, { method: 'DELETE' });
            showToast('Course deleted successfully.', 'info');
            loadCourses();
            loadDashboardStats();
          } catch (e) {
            showToast('Failed to delete course.', 'error');
          }
        }
      });
    });
  };

  if (openAddCourseModalBtn) {
    openAddCourseModalBtn.addEventListener('click', () => {
      courseModalTitle.textContent = 'Add New Course';
      courseForm.reset();
      courseEditId.value = '';
      courseActiveInput.checked = true;
      openModal('courseModal');
    });
  }

  if (courseForm) {
    courseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = courseEditId.value;

      const payload = {
        title: courseTitleInput.value.trim(),
        slug: courseSlugInput.value.trim() || undefined,
        theme: courseThemeInput.value,
        duration: courseDurationInput.value.trim() || '3 to 6 Months',
        fee: courseFeeInput.value.trim() || 'Affordable',
        shortDescription: courseShortDescInput.value.trim(),
        courseDetails: courseDetailsInput.value.split(',').map(s => s.trim()).filter(Boolean),
        isActive: courseActiveInput.checked
      };

      try {
        if (editId) {
          await apiFetch(`/courses/${editId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
          showToast(`Course "${payload.title}" updated!`, 'success');
        } else {
          await apiFetch('/courses', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          showToast(`New course "${payload.title}" created!`, 'success');
        }

        closeModal('courseModal');
        loadCourses();
        loadDashboardStats();
      } catch (err) {
        showToast(err.message || 'Failed to save course.', 'error');
      }
    });
  }

  // ================================================================
  // MODULE 5: REVIEW MANAGEMENT
  // ================================================================
  const reviewsList = document.getElementById('reviewsList');
  const reviewModal = document.getElementById('reviewModal');
  const reviewForm = document.getElementById('reviewForm');
  const openAddReviewModalBtn = document.getElementById('openAddReviewModal');
  const reviewModalTitle = document.getElementById('reviewModalTitle');

  const reviewEditId = document.getElementById('reviewEditId');
  const reviewStudentNameInput = document.getElementById('reviewStudentNameInput');
  const reviewRoleInput = document.getElementById('reviewRoleInput');
  const reviewRatingInput = document.getElementById('reviewRatingInput');
  const reviewTextInput = document.getElementById('reviewTextInput');
  const reviewActiveInput = document.getElementById('reviewActiveInput');
  const starRatingSelect = document.getElementById('starRatingSelect');

  let currentReviews = [];

  // Star selector logic
  if (starRatingSelect) {
    const stars = starRatingSelect.querySelectorAll('i');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating'), 10);
        reviewRatingInput.value = rating;
        stars.forEach(s => {
          const r = parseInt(s.getAttribute('data-rating'), 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  }

  const setModalStars = (rating) => {
    reviewRatingInput.value = rating;
    if (starRatingSelect) {
      starRatingSelect.querySelectorAll('i').forEach(s => {
        const r = parseInt(s.getAttribute('data-rating'), 10);
        if (r <= rating) s.classList.add('active');
        else s.classList.remove('active');
      });
    }
  };

  const loadReviews = async () => {
    try {
      const res = await apiFetch('/reviews/all');
      if (res.success) {
        currentReviews = res.data;
        renderReviews();
      }
    } catch (err) {
      if (reviewsList) {
        reviewsList.innerHTML = '<p style="color: #f87171;">Failed to load reviews from server.</p>';
      }
    }
  };

  const renderReviews = () => {
    if (!reviewsList) return;
    if (currentReviews.length === 0) {
      reviewsList.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 2rem;">No reviews found. Click "Add New Review" to create one.</p>';
      return;
    }

    reviewsList.innerHTML = currentReviews.map((rev, index) => {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="fa-solid fa-star" style="color: ${i <= rev.rating ? '#f59e0b' : '#475569'}; margin-right: 2px;"></i>`;
      }

      return `
        <div class="review-admin-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="font-size: 0.95rem;">${starsHtml}</div>
            <span class="status-pill ${rev.isActive ? 'open' : 'rejected'}">${rev.isActive ? 'Active' : 'Hidden'}</span>
          </div>
          <p style="font-style: italic; color: #ffffff; margin-bottom: 1.25rem; flex: 1;">“${rev.reviewText}”</p>
          <div>
            <strong style="color: #ffffff; display: block;">${rev.studentName}</strong>
            <span style="font-size: 0.8rem; color: #94a3b8;">${rev.role || 'Student'}</span>
          </div>
          <div class="card-actions-row">
            <button class="btn btn-outline-light btn-sm btn-edit-review" data-index="${index}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="btn btn-outline-danger btn-sm btn-delete-review" data-id="${rev._id}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    reviewsList.querySelectorAll('.btn-edit-review').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const r = currentReviews[idx];
        if (!r) return;

        reviewModalTitle.textContent = 'Edit Review';
        reviewEditId.value = r._id;
        reviewStudentNameInput.value = r.studentName;
        reviewRoleInput.value = r.role || '';
        reviewTextInput.value = r.reviewText;
        setModalStars(r.rating || 5);
        reviewActiveInput.checked = !!r.isActive;
        openModal('reviewModal');
      });
    });

    reviewsList.querySelectorAll('.btn-delete-review').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this student review permanently?')) {
          try {
            await apiFetch(`/reviews/${id}`, { method: 'DELETE' });
            showToast('Review deleted.', 'info');
            loadReviews();
            loadDashboardStats();
          } catch (e) {
            showToast('Failed to delete review.', 'error');
          }
        }
      });
    });
  };

  if (openAddReviewModalBtn) {
    openAddReviewModalBtn.addEventListener('click', () => {
      reviewModalTitle.textContent = 'Add Student Review';
      reviewForm.reset();
      reviewEditId.value = '';
      setModalStars(5);
      reviewActiveInput.checked = true;
      openModal('reviewModal');
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = reviewEditId.value;

      const payload = {
        studentName: reviewStudentNameInput.value.trim(),
        role: reviewRoleInput.value.trim() || 'Student',
        rating: Number(reviewRatingInput.value) || 5,
        reviewText: reviewTextInput.value.trim(),
        isActive: reviewActiveInput.checked
      };

      try {
        if (editId) {
          await apiFetch(`/reviews/${editId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
          showToast(`Review from ${payload.studentName} updated!`, 'success');
        } else {
          await apiFetch('/reviews', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          showToast(`New review added!`, 'success');
        }

        closeModal('reviewModal');
        loadReviews();
        loadDashboardStats();
      } catch (err) {
        showToast(err.message || 'Failed to save review.', 'error');
      }
    });
  }

  // ================================================================
  // MODULE 6: GALLERY MANAGEMENT & FILE UPLOADS
  // ================================================================
  const galleryList = document.getElementById('galleryList');
  const galleryModal = document.getElementById('galleryModal');
  const galleryForm = document.getElementById('galleryForm');
  const openUploadGalleryModalBtn = document.getElementById('openUploadGalleryModal');
  const galleryModalTitle = document.getElementById('galleryModalTitle');

  const uploadDropzone = document.getElementById('uploadDropzone');
  const galleryFileInput = document.getElementById('galleryFileInput');
  const uploadPreviewWrap = document.getElementById('uploadPreviewWrap');
  const uploadPreviewImg = document.getElementById('uploadPreviewImg');
  const btnRemovePreview = document.getElementById('btnRemovePreview');

  const galleryEditId = document.getElementById('galleryEditId');
  const galleryTitleInput = document.getElementById('galleryTitleInput');
  const galleryCategoryInput = document.getElementById('galleryCategoryInput');
  const galleryFeaturedInput = document.getElementById('galleryFeaturedInput');
  const galleryDescInput = document.getElementById('galleryDescInput');
  const galleryActiveInput = document.getElementById('galleryActiveInput');

  let currentGallery = [];

  // Dropzone click & drag handlers
  if (uploadDropzone && galleryFileInput) {
    uploadDropzone.addEventListener('click', () => galleryFileInput.click());

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = '#38bdf8';
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        galleryFileInput.files = e.dataTransfer.files;
        handlePreviewFile(e.dataTransfer.files[0]);
      }
    });

    galleryFileInput.addEventListener('change', () => {
      if (galleryFileInput.files && galleryFileInput.files[0]) {
        handlePreviewFile(galleryFileInput.files[0]);
      }
    });
  }

  const handlePreviewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreviewImg.src = e.target.result;
      uploadPreviewWrap.style.display = 'block';
      uploadDropzone.style.display = 'none';
    };
    reader.readAsDataURL(file);
  };

  if (btnRemovePreview) {
    btnRemovePreview.addEventListener('click', () => {
      galleryFileInput.value = '';
      uploadPreviewImg.src = '';
      uploadPreviewWrap.style.display = 'none';
      uploadDropzone.style.display = 'block';
    });
  }

  const loadGallery = async () => {
    try {
      const res = await apiFetch('/gallery/all');
      if (res.success) {
        currentGallery = res.data;
        renderGallery();
      }
    } catch (err) {
      if (galleryList) {
        galleryList.innerHTML = '<p style="color: #f87171;">Failed to load gallery images from server.</p>';
      }
    }
  };

  const renderGallery = () => {
    if (!galleryList) return;
    if (currentGallery.length === 0) {
      galleryList.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 2rem;">No gallery images uploaded. Click "Upload New Image" to add photos.</p>';
      return;
    }

    galleryList.innerHTML = currentGallery.map((img, index) => {
      const imgSrc = img.imageUrl.startsWith('http') ? img.imageUrl : (img.imageUrl.startsWith('/') ? img.imageUrl : `/${img.imageUrl}`);
      return `
        <div class="gallery-admin-card">
          <div class="gallery-admin-thumb">
            <img src="${imgSrc}" alt="${img.title}" onerror="this.onerror=null; this.src='../images/building.jpeg';">
            ${img.isFeatured ? '<span class="gallery-badge-featured"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
          </div>
          <div class="gallery-admin-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: #38bdf8; font-weight: 700;">${img.category}</span>
              <span class="status-pill ${img.isActive ? 'open' : 'rejected'}">${img.isActive ? 'Active' : 'Hidden'}</span>
            </div>
            <h4>${img.title}</h4>
            <p>${img.description || 'No description'}</p>
            <div class="card-actions-row" style="margin-top: auto;">
              <button class="btn btn-outline-light btn-sm btn-edit-gallery" data-index="${index}">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button class="btn btn-outline-danger btn-sm btn-delete-gallery" data-id="${img._id}">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    galleryList.querySelectorAll('.btn-edit-gallery').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const g = currentGallery[idx];
        if (!g) return;

        galleryModalTitle.textContent = 'Edit Photo Details';
        galleryEditId.value = g._id;
        galleryTitleInput.value = g.title;
        galleryCategoryInput.value = g.category || 'building';
        galleryFeaturedInput.checked = !!g.isFeatured;
        galleryDescInput.value = g.description || '';
        galleryActiveInput.checked = !!g.isActive;

        // Existing image preview
        uploadPreviewImg.src = g.imageUrl;
        uploadPreviewWrap.style.display = 'block';
        uploadDropzone.style.display = 'none';

        openModal('galleryModal');
      });
    });

    galleryList.querySelectorAll('.btn-delete-gallery').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Permanently delete this gallery photo?')) {
          try {
            await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
            showToast('Gallery image deleted.', 'info');
            loadGallery();
            loadDashboardStats();
          } catch (e) {
            showToast('Failed to delete image.', 'error');
          }
        }
      });
    });
  };

  if (openUploadGalleryModalBtn) {
    openUploadGalleryModalBtn.addEventListener('click', () => {
      galleryModalTitle.textContent = 'Upload Gallery Photo';
      galleryForm.reset();
      galleryEditId.value = '';
      uploadPreviewImg.src = '';
      uploadPreviewWrap.style.display = 'none';
      uploadDropzone.style.display = 'block';
      galleryActiveInput.checked = true;
      openModal('galleryModal');
    });
  }

  if (galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = galleryEditId.value;

      const formData = new FormData();
      formData.append('title', galleryTitleInput.value.trim());
      formData.append('category', galleryCategoryInput.value);
      formData.append('isFeatured', galleryFeaturedInput.checked);
      formData.append('description', galleryDescInput.value.trim());
      formData.append('isActive', galleryActiveInput.checked);

      if (galleryFileInput.files && galleryFileInput.files[0]) {
        formData.append('image', galleryFileInput.files[0]);
      }

      try {
        if (editId) {
          await apiFetch(`/gallery/${editId}`, {
            method: 'PUT',
            body: formData
          });
          showToast('Gallery photo updated!', 'success');
        } else {
          if (!galleryFileInput.files || !galleryFileInput.files[0]) {
            showToast('Please select an image file to upload.', 'error');
            return;
          }
          await apiFetch('/gallery', {
            method: 'POST',
            body: formData
          });
          showToast('Image uploaded successfully!', 'success');
        }

        closeModal('galleryModal');
        loadGallery();
        loadDashboardStats();
      } catch (err) {
        showToast(err.message || 'Failed to upload image.', 'error');
      }
    });
  }

  // ================================================================
  // MODULE 7: ADMIN PROFILE & PASSWORD CHANGE
  // ================================================================
  const changePasswordForm = document.getElementById('changePasswordForm');
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = currentPasswordInput.value.trim();
      const newPassword = newPasswordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();

      if (!currentPassword || !newPassword) {
        showToast('All password fields are required.', 'error');
        return;
      }

      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters long.', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
      }

      try {
        const res = await apiFetch('/auth/change-password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword, newPassword })
        });

        if (res.success) {
          showToast('Password updated successfully!', 'success');
          changePasswordForm.reset();
        }
      } catch (err) {
        showToast(err.message || 'Failed to change password.', 'error');
      }
    });
  }

  // Initial Boot Check
  checkAuth();
});
