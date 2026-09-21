/**
 * CareFlow Patient Experience - Universal Navigation & Interactivity System
 * Connects all 20 pages (P01 - P20), injects the Quick Navigator Dock,
 * provides toast notifications, modal dialogs, and interactive flows.
 */

(function () {
  const CAREFLOW_PAGES = [
    { id: 'p01', num: 'P01', name: 'Patient Landing & Welcome', dir: 'careflow_patient_web_p01_patient_landing_welcome', category: 'Getting Started', icon: 'home', hindi: 'स्वागत' },
    { id: 'p02', num: 'P02', name: 'Patient Login & OTP Access', dir: 'careflow_patient_web_p02_patient_login_access', category: 'Getting Started', icon: 'lock', hindi: 'लॉग इन' },
    { id: 'p03', num: 'P03', name: 'Patient Dashboard', dir: 'careflow_patient_web_p03_patient_dashboard', category: 'Patient Hub', icon: 'dashboard', hindi: 'डैशबोर्ड' },
    { id: 'p04', num: 'P04', name: 'My Profile & ABHA Card', dir: 'careflow_patient_web_p04_my_profile', category: 'Account & Profile', icon: 'person', hindi: 'प्रोफ़ाइल' },
    { id: 'p05', num: 'P05', name: 'My Health Overview & Vitals', dir: 'careflow_patient_web_p05_my_health_overview', category: 'Health & Clinical', icon: 'favorite', hindi: 'स्वास्थ्य अवलोकन' },
    { id: 'p06', num: 'P06', name: 'My Symptoms & Health Info', dir: 'careflow_patient_web_p06_my_symptoms_health_information', category: 'Health & Clinical', icon: 'healing', hindi: 'लक्षण ट्रैकर' },
    { id: 'p07', num: 'P07', name: 'My Health Questionnaire', dir: 'careflow_patient_web_p07_my_health_questionnaire', category: 'Health & Clinical', icon: 'assignment', hindi: 'स्वास्थ्य प्रश्नावली' },
    { id: 'p08', num: 'P08', name: 'My Documents & Vault', dir: 'careflow_patient_web_p08_my_documents', category: 'Records & Vault', icon: 'folder_open', hindi: 'दस्तावेज़' },
    { id: 'p09', num: 'P09', name: 'My Care Summary', dir: 'careflow_patient_web_p09_my_care_summary', category: 'Records & Vault', icon: 'article', hindi: 'देखभाल सारांश' },
    { id: 'p10', num: 'P10', name: 'Visit Intake Complete', dir: 'careflow_patient_web_p10_visit_intake_complete', category: 'Health & Clinical', icon: 'task_alt', hindi: 'इंटेक पूर्ण' },
    { id: 'p11', num: 'P11', name: 'My Appointments Hub', dir: 'careflow_patient_web_p11_my_appointments', category: 'Appointments', icon: 'calendar_month', hindi: 'अपॉइंटमेंट' },
    { id: 'p12', num: 'P12', name: 'Appointment Details & Video', dir: 'careflow_patient_web_p12_appointment_details', category: 'Appointments', icon: 'event_note', hindi: 'अपॉइंटमेंट विवरण' },
    { id: 'p13', num: 'P13', name: 'Book an Appointment Wizard', dir: 'careflow_patient_web_p13_book_an_appointment', category: 'Appointments', icon: 'edit_calendar', hindi: 'बुक अपॉइंटमेंट' },
    { id: 'p14', num: 'P14', name: 'Prescriptions & Lab Reports', dir: 'careflow_patient_web_p14_prescriptions_lab_reports', category: 'Records & Vault', icon: 'prescriptions', hindi: 'दवाएं व जांच' },
    { id: 'p15', num: 'P15', name: 'Health Timeline & Visit History', dir: 'careflow_patient_web_p15_health_timeline_visit_history', category: 'Records & Vault', icon: 'history', hindi: 'टाइमलाइन' },
    { id: 'p16', num: 'P16', name: 'Notifications Center', dir: 'careflow_patient_web_p16_notifications', category: 'Communications', icon: 'notifications', hindi: 'सूचनाएं' },
    { id: 'p17', num: 'P17', name: 'Messages & Care Team Chat', dir: 'careflow_patient_web_p17_messages_care_team', category: 'Communications', icon: 'chat', hindi: 'संदेश व डॉक्टर' },
    { id: 'p18', num: 'P18', name: 'Privacy & ABDM Consent', dir: 'careflow_patient_web_p18_privacy_consent', category: 'Account & Profile', icon: 'security', hindi: 'गोपनीयता' },
    { id: 'p19', num: 'P19', name: 'My Settings & Security', dir: 'careflow_patient_web_p19_my_settings', category: 'Account & Profile', icon: 'settings', hindi: 'सेटिंग्स' },
    { id: 'p20', num: 'P20', name: 'Help & Support Center', dir: 'careflow_patient_web_p20_help_support', category: 'Support', icon: 'support_agent', hindi: 'सहायता व प्रश्न' },
    { id: 'admin', num: 'ADM', name: 'Admin & Operations Control Center', dir: 'careflow_admin_panel', category: 'Administration', icon: 'admin_panel_settings', hindi: 'प्रशासन नियंत्रण कक्ष' }
  ];

  // Determine current page
  function getCurrentPage() {
    const currentPath = window.location.pathname;
    for (let page of CAREFLOW_PAGES) {
      if (currentPath.includes(page.dir)) {
        return page;
      }
    }
    return CAREFLOW_PAGES[2]; // Default to P03
  }

  // Get relative path to target page
  function getPageUrl(targetPageId) {
    const target = CAREFLOW_PAGES.find(p => p.id === targetPageId || p.num.toLowerCase() === targetPageId.toLowerCase() || p.dir.includes(targetPageId));
    if (!target) return '#';

    // If inside master iframe, we can navigate smoothly or via parent router
    const currentPath = window.location.pathname;
    const isInPageDir = CAREFLOW_PAGES.some(p => currentPath.includes(p.dir));

    if (isInPageDir) {
      return `../${target.dir}/code.html`;
    } else {
      return `./${target.dir}/code.html`;
    }
  }

  function navigateTo(targetPageId) {
    // Notify parent master frame if embedded
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'CAREFLOW_NAVIGATE', pageId: targetPageId }, '*');
      } catch (e) {}
    }
    const url = getPageUrl(targetPageId);
    if (url && url !== '#') {
      window.location.href = url;
    }
  }

  // Toast Notification System
  function showToast(message, type = 'success', duration = 3200) {
    let container = document.getElementById('careflow-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'careflow-toast-container';
      container.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const isInfo = type === 'info';
    const bgColor = isError ? '#BA1A1A' : isInfo ? '#015362' : '#0D6E6E';
    
    toast.style.cssText = `
      background:${bgColor};
      color:#ffffff;
      padding:12px 18px;
      border-radius:12px;
      font-family:'Plus Jakarta Sans', system-ui, sans-serif;
      font-size:13.5px;
      font-weight:600;
      box-shadow:0 10px 25px -5px rgba(13,110,110,0.3), 0 8px 10px -6px rgba(0,0,0,0.1);
      display:flex;
      align-items:center;
      gap:10px;
      pointer-events:auto;
      transform:translateY(20px) scale(0.95);
      opacity:0;
      transition:all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255,255,255,0.2);
    `;

    const icon = isError ? 'error' : isInfo ? 'info' : 'check_circle';
    toast.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:20px;">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(-10px) scale(0.95)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // Modal Dialog System
  function openModal(contentHtml, title = '') {
    closeModal();
    const overlay = document.createElement('div');
    overlay.id = 'careflow-modal-overlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(15,23,42,0.6);
      backdrop-filter:blur(4px);
      z-index:99998;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      opacity:0;
      transition:opacity 0.2s ease;
    `;

    const dialog = document.createElement('div');
    dialog.id = 'careflow-modal-dialog';
    dialog.style.cssText = `
      background:#ffffff;
      border-radius:20px;
      max-width:540px;
      width:100%;
      max-height:85vh;
      overflow-y:auto;
      box-shadow:0 25px 50px -12px rgba(15,23,42,0.25);
      font-family:'Plus Jakarta Sans', system-ui, sans-serif;
      transform:scale(0.95);
      transition:transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position:relative;
      border:1px solid #E2E8F0;
    `;

    dialog.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #F1F5F9;">
        <h3 style="margin:0;font-size:17px;font-weight:700;color:#0F172A;flex:1;">${title}</h3>
        <button id="careflow-modal-close-btn" style="background:none;border:none;cursor:pointer;color:#64748B;padding:4px;border-radius:8px;display:flex;align-items:center;">
          <span class="material-symbols-outlined" style="font-size:22px;">close</span>
        </button>
      </div>
      <div style="padding:20px;">
        ${contentHtml}
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      dialog.style.transform = 'scale(1)';
    });

    const closeBtn = dialog.querySelector('#careflow-modal-close-btn');
    if (closeBtn) closeBtn.onclick = closeModal;

    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', handleEsc);
      }
    };
    window.addEventListener('keydown', handleEsc);
  }

  function closeModal() {
    const overlay = document.getElementById('careflow-modal-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      const dialog = overlay.querySelector('#careflow-modal-dialog');
      if (dialog) dialog.style.transform = 'scale(0.95)';
      setTimeout(() => overlay.remove(), 200);
    }
  }

  // Build the Floating CareFlow Quick Navigator Dock
  function injectQuickNavigatorDock(currentPage) {
    if (document.getElementById('careflow-quick-dock')) return;

    const dock = document.createElement('div');
    dock.id = 'careflow-quick-dock';
    dock.style.cssText = `
      position:fixed;
      bottom:20px;
      left:50%;
      transform:translateX(-50%);
      z-index:99990;
      background:rgba(255, 255, 255, 0.96);
      backdrop-filter:blur(16px);
      border:1px solid rgba(13, 110, 110, 0.25);
      border-radius:9999px;
      padding:6px 14px;
      display:flex;
      align-items:center;
      gap:10px;
      box-shadow:0 12px 36px -4px rgba(13, 110, 110, 0.2), 0 4px 12px -2px rgba(15, 23, 42, 0.08);
      font-family:'Plus Jakarta Sans', system-ui, sans-serif;
      transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const currentIndex = CAREFLOW_PAGES.findIndex(p => p.id === currentPage.id);
    const prevPage = currentIndex > 0 ? CAREFLOW_PAGES[currentIndex - 1] : CAREFLOW_PAGES[CAREFLOW_PAGES.length - 1];
    const nextPage = currentIndex < CAREFLOW_PAGES.length - 1 ? CAREFLOW_PAGES[currentIndex + 1] : CAREFLOW_PAGES[0];

    dock.innerHTML = `
      <a href="${getPageUrl(prevPage.id)}" title="Previous: ${prevPage.num} ${prevPage.name}" style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;color:#0D6E6E;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background='#E6F7F2'" onmouseout="this.style.background='#F1F5F9'">
        <span class="material-symbols-outlined" style="font-size:18px;">chevron_left</span>
      </a>

      <button id="careflow-dock-switcher-btn" style="background:#E6F7F2;border:1px solid rgba(13,110,110,0.25);border-radius:9999px;padding:5px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;color:#0D6E6E;font-size:12.5px;font-weight:700;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0D6E6E;box-shadow:0 0 0 3px rgba(13,110,110,0.2);"></span>
        <span>${currentPage.num}: ${currentPage.name}</span>
        <span class="material-symbols-outlined" style="font-size:16px;">unfold_more</span>
      </button>

      <a href="${getPageUrl(nextPage.id)}" title="Next: ${nextPage.num} ${nextPage.name}" style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;color:#0D6E6E;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background='#E6F7F2'" onmouseout="this.style.background='#F1F5F9'">
        <span class="material-symbols-outlined" style="font-size:18px;">chevron_right</span>
      </a>

      <div style="width:1px;height:20px;background:#CBD5E1;"></div>

      <a href="${getPageUrl('admin')}" title="Admin & Operations Control Center" style="background:#0D6E6E;color:#fff;border:none;border-radius:9999px;padding:4px 12px;font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:5px;cursor:pointer;text-decoration:none;" onmouseover="this.style.background='#005454'" onmouseout="this.style.background='#0D6E6E'">
        <span class="material-symbols-outlined" style="font-size:15px;">admin_panel_settings</span>
        <span>Admin</span>
      </a>

      <button id="careflow-dock-flows-btn" style="background:none;border:none;cursor:pointer;color:#475569;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:8px;" onmouseover="this.style.color='#0D6E6E'" onmouseout="this.style.color='#475569'">
        <span class="material-symbols-outlined" style="font-size:16px;">route</span>
        <span class="hidden sm:inline">Flows</span>
      </button>

      <button id="careflow-dock-minimize-btn" title="Minimize Dock" style="background:none;border:none;cursor:pointer;color:#94A3B8;padding:2px;display:flex;align-items:center;">
        <span class="material-symbols-outlined" style="font-size:16px;">visibility_off</span>
      </button>
    `;

    document.body.appendChild(dock);

    // Minimize toggle
    let isMinimized = false;
    const minimizeBtn = dock.querySelector('#careflow-dock-minimize-btn');
    minimizeBtn.onclick = () => {
      isMinimized = !isMinimized;
      if (isMinimized) {
        dock.style.padding = '4px 8px';
        dock.style.bottom = '10px';
        dock.style.left = 'auto';
        dock.style.right = '16px';
        dock.style.transform = 'none';
        dock.innerHTML = `
          <button id="careflow-dock-expand-btn" style="background:#0D6E6E;color:#fff;border:none;border-radius:9999px;padding:6px 12px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:14px;">apps</span>
            <span>${currentPage.num} Pages ▾</span>
          </button>
        `;
        dock.querySelector('#careflow-dock-expand-btn').onclick = () => {
          dock.remove();
          injectQuickNavigatorDock(currentPage);
        };
      }
    };

    // Open Page Switcher Drawer
    dock.querySelector('#careflow-dock-switcher-btn').onclick = () => {
      openPageSwitcherModal(currentPage);
    };

    // Open Flows Drawer
    dock.querySelector('#careflow-dock-flows-btn').onclick = () => {
      openFlowsModal();
    };
  }

  function openPageSwitcherModal(currentPage) {
    const categories = {};
    CAREFLOW_PAGES.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    let html = `
      <div style="margin-bottom:16px;">
        <p style="font-size:13px;color:#64748B;margin:0 0 12px 0;">Jump directly to any page across the CareFlow Patient Experience suite:</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
    `;

    for (let [cat, pages] of Object.entries(categories)) {
      html += `
        <div>
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#0D6E6E;margin-bottom:8px;">${cat}</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(230px, 1fr));gap:8px;">
      `;
      for (let p of pages) {
        const isCurrent = p.id === currentPage.id;
        html += `
          <a href="${getPageUrl(p.id)}" style="
            display:flex;
            align-items:center;
            gap:10px;
            padding:9px 12px;
            border-radius:12px;
            background:${isCurrent ? '#E6F7F2' : '#F8FAFC'};
            border:1px solid ${isCurrent ? '#0D6E6E' : '#E2E8F0'};
            text-decoration:none;
            color:${isCurrent ? '#0D6E6E' : '#1E293B'};
            transition:all 0.15s;
          " onmouseover="if(!${isCurrent}) this.style.background='#F1F5F9'" onmouseout="if(!${isCurrent}) this.style.background='#F8FAFC'">
            <span class="material-symbols-outlined" style="font-size:18px;color:${isCurrent ? '#0D6E6E' : '#64748B'};">${p.icon}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-size:12.5px;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                <span style="color:#0D6E6E;margin-right:4px;">${p.num}</span> ${p.name}
              </div>
              <div style="font-size:10.5px;color:#94A3B8;margin-top:2px;">${p.hindi}</div>
            </div>
            ${isCurrent ? '<span style="font-size:10px;font-weight:700;background:#0D6E6E;color:#fff;padding:2px 6px;border-radius:9999px;">Current</span>' : ''}
          </a>
        `;
      }
      html += `</div></div>`;
    }
    html += `</div>`;

    openModal(html, 'CareFlow Patient Portal — 20 Pages Directory');
  }

  function openFlowsModal() {
    const flows = [
      {
        title: 'Patient Sign-in & Dashboard Onboarding',
        desc: 'New/returning patient welcomes, verifies via OTP, and lands in primary care dashboard.',
        steps: [
          { num: 'P01', name: 'Landing & Welcome', id: 'p01' },
          { num: 'P02', name: 'Login & OTP Access', id: 'p02' },
          { num: 'P03', name: 'Patient Dashboard', id: 'p03' }
        ]
      },
      {
        title: 'Book an Appointment & View Details',
        desc: 'Select specialist doctor, pick clinic/teleconsult slot, confirm booking, and review appointment directions.',
        steps: [
          { num: 'P03', name: 'Dashboard', id: 'p03' },
          { num: 'P13', name: 'Book Appointment', id: 'p13' },
          { num: 'P12', name: 'Appointment Details', id: 'p12' },
          { num: 'P11', name: 'Appointments Hub', id: 'p11' }
        ]
      },
      {
        title: 'Pre-Visit Intake & Triage Flow',
        desc: 'Complete health questionnaire before consultation and receive intake confirmation check-in token.',
        steps: [
          { num: 'P12', name: 'Appointment Details', id: 'p12' },
          { num: 'P07', name: 'Health Questionnaire', id: 'p07' },
          { num: 'P10', name: 'Intake Complete', id: 'p10' },
          { num: 'P03', name: 'Back to Dashboard', id: 'p03' }
        ]
      },
      {
        title: 'Symptom Logger & Care Team Chat',
        desc: 'Patient reports acute symptoms, selects body regions, logs severity, and chats with Dr. Priya Nair.',
        steps: [
          { num: 'P03', name: 'Dashboard', id: 'p03' },
          { num: 'P05', name: 'Health Overview', id: 'p05' },
          { num: 'P06', name: 'Symptoms Logger', id: 'p06' },
          { num: 'P17', name: 'Messages & Care Team', id: 'p17' }
        ]
      },
      {
        title: 'Prescriptions, Lab Results & Vault',
        desc: 'Access verified diagnostic reports, active prescriptions, refill requests, and chronological visit history.',
        steps: [
          { num: 'P03', name: 'Dashboard', id: 'p03' },
          { num: 'P08', name: 'Documents & Vault', id: 'p08' },
          { num: 'P14', name: 'Prescriptions & Labs', id: 'p14' },
          { num: 'P09', name: 'Care Summary', id: 'p09' },
          { num: 'P15', name: 'Health Timeline', id: 'p15' }
        ]
      },
      {
        title: 'Patient Profile, ABDM Consent & Settings',
        desc: 'Review ABHA card, grant or revoke doctor data-sharing consent, update notification toggles, and help support.',
        steps: [
          { num: 'P03', name: 'Dashboard', id: 'p03' },
          { num: 'P04', name: 'My Profile & ABHA', id: 'p04' },
          { num: 'P18', name: 'Privacy & Consent', id: 'p18' },
          { num: 'P19', name: 'My Settings', id: 'p19' },
          { num: 'P20', name: 'Help & FAQs', id: 'p20' }
        ]
      }
    ];

    let html = `
      <p style="font-size:13px;color:#64748B;margin:0 0 16px 0;">Select an end-to-end patient journey to walk through:</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
    `;

    flows.forEach(flow => {
      html += `
        <div style="padding:14px;border-radius:14px;background:#F8FAFC;border:1px solid #E2E8F0;">
          <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:4px;">${flow.title}</div>
          <div style="font-size:12px;color:#64748B;margin-bottom:10px;">${flow.desc}</div>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
      `;
      flow.steps.forEach((step, idx) => {
        html += `
          <a href="${getPageUrl(step.id)}" style="
            display:inline-flex;
            align-items:center;
            gap:4px;
            padding:4px 10px;
            border-radius:9999px;
            background:#ffffff;
            border:1px solid #CBD5E1;
            font-size:11.5px;
            font-weight:600;
            color:#0D6E6E;
            text-decoration:none;
            transition:all 0.15s;
          " onmouseover="this.style.borderColor='#0D6E6E';this.style.background='#E6F7F2'" onmouseout="this.style.borderColor='#CBD5E1';this.style.background='#ffffff'">
            <span>${step.num}</span> <span>${step.name}</span>
          </a>
        `;
        if (idx < flow.steps.length - 1) {
          html += `<span style="color:#94A3B8;font-size:12px;">→</span>`;
        }
      });
      html += `</div></div>`;
    });
    html += `</div>`;

    openModal(html, 'CareFlow Guided Patient Journeys');
  }

  // Universal Link and Header Wireup
  function wireUniversalLinks() {
    const currentPage = getCurrentPage();

    // Wire all <a> tags with data-path or specific hrefs
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      const dataPath = link.getAttribute('data-path');
      const text = (link.textContent || '').trim().toLowerCase();

      // Check data-path mappings
      if (dataPath) {
        const pathMap = {
          'patient-portal-home': 'p01',
          'book-consultation': 'p13',
          'health-records-abdm': 'p08',
          'patient-care-plans': 'p09',
          'patient-sign-in': 'p02',
          'privacy-policy': 'p18',
          'patient-rights': 'p18',
          'terms-of-service': 'p18',
          'patient-support': 'p20',
          'patient-help-center': 'p20',
          'patient-notifications': 'p16',
          'patient-privacy-consent': 'p18',
          'patient-edit-profile': 'p04',
          'dashboard': 'p03',
          'appointments': 'p11',
          'documents': 'p08',
          'care-summaries': 'p09',
          'settings': 'p19',
          'help-support': 'p20',
          'analytics': 'p05',
          'alerts': 'p16',
          'patients': 'p04'
        };
        if (pathMap[dataPath]) {
          link.href = getPageUrl(pathMap[dataPath]);
          return;
        }
      }

      // If href is "#" or empty, wire by context/text
      if (!href || href === '#' || href === 'javascript:void(0)') {
        // Logo / Brand
        if (link.querySelector('svg') && (link.textContent.includes('CareFlow') || link.getAttribute('aria-label')?.includes('CareFlow'))) {
          link.href = (currentPage.id === 'p01' || currentPage.id === 'p02') ? getPageUrl('p01') : getPageUrl('p03');
          return;
        }

        // Top Navigation Links
        if (text.startsWith('home') || text.includes('गृह')) {
          link.href = (currentPage.id === 'p01' || currentPage.id === 'p02') ? getPageUrl('p01') : getPageUrl('p03');
        } else if (text.startsWith('my health') || text.includes('स्वास्थ्य') || text.startsWith('health')) {
          link.href = getPageUrl('p05');
        } else if (text.startsWith('appointments') || text.includes('अपॉइंटमेंट') || text.startsWith('visits')) {
          link.href = getPageUrl('p11');
        } else if (text.startsWith('documents') || text.includes('दस्तावेज़') || text.startsWith('vault')) {
          link.href = getPageUrl('p08');
        } else if (text.startsWith('care summary') || text.includes('सारांश')) {
          link.href = getPageUrl('p09');
        } else if (text.includes('sign in') || text.includes('get started') || text.includes('साइन इन') || text.includes('शुरू करें')) {
          link.href = getPageUrl('p02');
        } else if (text.includes('book an appointment') || text.includes('book consultation') || text.includes('book appointment') || text.includes('बुक अपॉइंटमेंट')) {
          link.href = getPageUrl('p13');
        } else if (text.includes('back to home') || text.includes('home page')) {
          link.href = getPageUrl('p01');
        } else if (text.includes('back to appointments') || text.includes('अपॉइंटमेंट पर वापस')) {
          link.href = getPageUrl('p11');
        } else if (text.includes('back to dashboard') || text.includes('go to dashboard')) {
          link.href = getPageUrl('p03');
        } else if (text.includes('privacy') || text.includes('consent') || text.includes('abdm')) {
          link.href = getPageUrl('p18');
        } else if (text.includes('settings') || text.includes('preferences')) {
          link.href = getPageUrl('p19');
        } else if (text.includes('help') || text.includes('support') || text.includes('faq')) {
          link.href = getPageUrl('p20');
        } else if (text.includes('profile') || text.includes('aarav')) {
          link.href = getPageUrl('p04');
        }
      }
    });

    // Wire Notification Bell Buttons
    document.querySelectorAll('button[aria-label*="Notification"], button[aria-label*="notification"], a[aria-label*="Notification"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        navigateTo('p16');
      };
      btn.style.cursor = 'pointer';
    });

    // Wire Profile avatar/pill
    document.querySelectorAll('header div:has(> div:contains("Aarav Sharma")), header [aria-label*="Account Settings"]').forEach(el => {
      el.style.cursor = 'pointer';
      el.onclick = () => navigateTo('p04');
    });

    // Wire Language Switcher
    document.querySelectorAll('header button').forEach(btn => {
      const text = (btn.textContent || '').trim();
      if (text === 'हिन्दी' || text === 'English') {
        btn.onclick = () => {
          showToast(`Language switched to ${text} (भाषा परिवर्तित)`, 'info');
        };
      }
    });
  }

  // Initialize once DOM is ready
  function init() {
    const currentPage = getCurrentPage();
    injectQuickNavigatorDock(currentPage);
    wireUniversalLinks();

    // Ensure document is scrollable (fix any inherited fixed sizes)
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.width = '100%';
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  const API_BASE = (function () { try { return localStorage.getItem('cfApi'); } catch (e) { return null; } })() || 'http://localhost:4000';
  async function apiCall(path, opts) {
    const res = await fetch(API_BASE + path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts));
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error((err && err.error && err.error.message) || 'HTTP ' + res.status);
    }
    return res.status === 204 ? null : res.json();
  }

  // Expose global API
  window.CareFlow = {
    pages: CAREFLOW_PAGES,
    currentPage: getCurrentPage,
    navigateTo: navigateTo,
    getPageUrl: getPageUrl,
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    api: apiCall,
    API_BASE: API_BASE
  };
})();
