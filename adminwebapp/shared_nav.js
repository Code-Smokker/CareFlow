/**
 * CareFlow Admin & Patient Experience - Universal Navigation & Interactivity System
 * Refined for high-fidelity SaaS healthcare UX:
 * - Responsive non-colliding floating dock with auto-minimize on mobile (<640px)
 * - Accessible, smooth-animated modal dialog system with ESC & outside click handling
 * - Polished stackable toast notification system
 * - Universal link wiring and page switcher
 */

(function () {
  'use strict';

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
    const target = CAREFLOW_PAGES.find(p => p.id === targetPageId || p.num.toLowerCase() === String(targetPageId).toLowerCase() || p.dir.includes(targetPageId));
    if (!target) return '#';

    const currentPath = window.location.pathname;
    const isInPageDir = CAREFLOW_PAGES.some(p => currentPath.includes(p.dir));

    return isInPageDir ? `../${target.dir}/code.html` : `./${target.dir}/code.html`;
  }

  function navigateTo(targetPageId) {
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
  function showToast(message, type = 'success', duration = 3400) {
    let container = document.getElementById('careflow-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'careflow-toast-container';
      container.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 100000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
        max-width: min(420px, calc(100vw - 32px));
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const isInfo = type === 'info';
    const isWarning = type === 'warning';

    const bgColors = {
      success: 'linear-gradient(135deg, #0D6E6E 0%, #005454 100%)',
      error: 'linear-gradient(135deg, #BA1A1A 0%, #93000A 100%)',
      info: 'linear-gradient(135deg, #015362 0%, #083344 100%)',
      warning: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)'
    };

    const icons = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
      warning: 'warning'
    };

    const chosenType = isError ? 'error' : isWarning ? 'warning' : isInfo ? 'info' : 'success';

    toast.style.cssText = `
      background: ${bgColors[chosenType]};
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 14px;
      font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      box-shadow: 0 14px 30px -6px rgba(13, 110, 110, 0.25), 0 4px 12px -2px rgba(15, 23, 42, 0.12);
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: auto;
      transform: translateY(-12px) scale(0.96);
      opacity: 0;
      transition: all 0.26s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    toast.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 20px; flex-shrink: 0;">${icons[chosenType]}</span>
      <span style="flex: 1;">${message}</span>
      <button style="background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; padding: 2px; display: flex; align-items: center;" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
      </button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(-12px) scale(0.96)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  // Modal Dialog System
  function openModal(contentHtml, title = '') {
    closeModal();
    const overlay = document.createElement('div');
    overlay.id = 'careflow-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(11, 25, 44, 0.65);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.22s ease-out;
    `;

    const dialog = document.createElement('div');
    dialog.id = 'careflow-modal-dialog';
    dialog.style.cssText = `
      background: #FFFFFF;
      border-radius: 20px;
      max-width: 580px;
      width: 100%;
      max-height: min(88vh, 760px);
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 60px -12px rgba(11, 25, 44, 0.35);
      font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
      transform: translateY(16px) scale(0.97);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      border: 1px solid #E2E8F0;
      overflow: hidden;
    `;

    dialog.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #F1F5F9;background:#FAFCFB;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:30px;height:30px;border-radius:10px;background:#E6F7F2;color:#0D6E6E;display:flex;align-items:center;justify-content:center;">
            <span class="material-symbols-outlined" style="font-size:18px;">admin_panel_settings</span>
          </div>
          <h3 style="margin:0;font-size:16px;font-weight:700;color:#0B192C;letter-spacing:-0.01em;">${title}</h3>
        </div>
        <button id="careflow-modal-close-btn" aria-label="Close dialog" style="background:#F1F5F9;border:1px solid #E2E8F0;cursor:pointer;color:#64748B;padding:5px;border-radius:10px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;" onmouseover="this.style.background='#E6F7F2';this.style.color='#0D6E6E'" onmouseout="this.style.background='#F1F5F9';this.style.color='#64748B'">
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
      </div>
      <div style="padding:22px;overflow-y:auto;flex:1;-webkit-overflow-scrolling:touch;">
        ${contentHtml}
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      dialog.style.transform = 'translateY(0) scale(1)';
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
      if (dialog) dialog.style.transform = 'translateY(12px) scale(0.97)';
      setTimeout(() => overlay.remove(), 200);
    }
  }

  // Floating CareFlow Quick Navigator Dock (Responsive & Auto-minimizing on mobile)
  function injectQuickNavigatorDock(currentPage) {
    if (document.getElementById('careflow-quick-dock')) return;

    const isMobile = window.innerWidth < 768;
    const dock = document.createElement('div');
    dock.id = 'careflow-quick-dock';

    const currentIndex = CAREFLOW_PAGES.findIndex(p => p.id === currentPage.id);
    const prevPage = currentIndex > 0 ? CAREFLOW_PAGES[currentIndex - 1] : CAREFLOW_PAGES[CAREFLOW_PAGES.length - 1];
    const nextPage = currentIndex < CAREFLOW_PAGES.length - 1 ? CAREFLOW_PAGES[currentIndex + 1] : CAREFLOW_PAGES[0];

    function applyDockStyles(minimized) {
      if (minimized) {
        dock.style.cssText = `
          position: fixed;
          bottom: 84px;
          right: 16px;
          z-index: 99990;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(13, 110, 110, 0.3);
          border-radius: 9999px;
          padding: 4px;
          box-shadow: 0 10px 30px -4px rgba(13, 110, 110, 0.22), 0 4px 10px -2px rgba(15, 23, 42, 0.08);
          font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        dock.innerHTML = `
          <button id="careflow-dock-expand-btn" title="Open CareFlow Page Directory" style="background:#0D6E6E;color:#FFFFFF;border:none;border-radius:9999px;padding:7px 14px;font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;box-shadow:0 2px 6px rgba(13,110,110,0.3);">
            <span class="material-symbols-outlined" style="font-size:16px;">explore</span>
            <span>${currentPage.num} Directory</span>
          </button>
        `;
        const expandBtn = dock.querySelector('#careflow-dock-expand-btn');
        if (expandBtn) {
          expandBtn.onclick = () => {
            applyDockStyles(false);
          };
        }
      } else {
        dock.style.cssText = `
          position: fixed;
          bottom: ${isMobile ? '80px' : '20px'};
          left: 50%;
          transform: translateX(-50%);
          z-index: 99990;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(13, 110, 110, 0.25);
          border-radius: 9999px;
          padding: 5px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 14px 40px -6px rgba(13, 110, 110, 0.22), 0 4px 14px -2px rgba(15, 23, 42, 0.08);
          font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: calc(100vw - 24px);
        `;

        dock.innerHTML = `
          <a href="${getPageUrl(prevPage.id)}" title="Previous: ${prevPage.num} ${prevPage.name}" style="width:30px;height:30px;border-radius:50%;background:#F1F5F9;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;color:#0D6E6E;text-decoration:none;transition:all 0.15s;flex-shrink:0;" onmouseover="this.style.background='#E6F7F2';this.style.borderColor='#0D6E6E'" onmouseout="this.style.background='#F1F5F9';this.style.borderColor='#E2E8F0'">
            <span class="material-symbols-outlined" style="font-size:17px;">chevron_left</span>
          </a>

          <button id="careflow-dock-switcher-btn" style="background:#E6F7F2;border:1px solid rgba(13,110,110,0.3);border-radius:9999px;padding:4px 12px;display:flex;align-items:center;gap:6px;cursor:pointer;color:#0D6E6E;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#0D6E6E;box-shadow:0 0 0 2.5px rgba(13,110,110,0.2);flex-shrink:0;"></span>
            <span style="overflow:hidden;text-overflow:ellipsis;">${currentPage.num}: ${currentPage.name}</span>
            <span class="material-symbols-outlined" style="font-size:15px;flex-shrink:0;">unfold_more</span>
          </button>

          <a href="${getPageUrl(nextPage.id)}" title="Next: ${nextPage.num} ${nextPage.name}" style="width:30px;height:30px;border-radius:50%;background:#F1F5F9;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;color:#0D6E6E;text-decoration:none;transition:all 0.15s;flex-shrink:0;" onmouseover="this.style.background='#E6F7F2';this.style.borderColor='#0D6E6E'" onmouseout="this.style.background='#F1F5F9';this.style.borderColor='#E2E8F0'">
            <span class="material-symbols-outlined" style="font-size:17px;">chevron_right</span>
          </a>

          <div style="width:1px;height:18px;background:#E2E8F0;flex-shrink:0;"></div>

          <a href="${getPageUrl('admin')}" title="Admin & Operations Control Center" style="background:${currentPage.id === 'admin' ? '#005454' : '#0D6E6E'};color:#FFFFFF;border:none;border-radius:9999px;padding:4px 10px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;cursor:pointer;text-decoration:none;flex-shrink:0;" onmouseover="this.style.background='#005454'" onmouseout="this.style.background='${currentPage.id === 'admin' ? '#005454' : '#0D6E6E'}'">
            <span class="material-symbols-outlined" style="font-size:14px;">admin_panel_settings</span>
            <span class="hidden sm:inline">Admin</span>
          </a>

          <button id="careflow-dock-flows-btn" style="background:none;border:none;cursor:pointer;color:#475569;font-size:11.5px;font-weight:600;display:flex;align-items:center;gap:3px;padding:4px 6px;border-radius:8px;flex-shrink:0;" onmouseover="this.style.color='#0D6E6E'" onmouseout="this.style.color='#475569'">
            <span class="material-symbols-outlined" style="font-size:15px;">route</span>
            <span class="hidden sm:inline">Flows</span>
          </button>

          <button id="careflow-dock-minimize-btn" title="Minimize Dock" style="background:none;border:none;cursor:pointer;color:#94A3B8;padding:2px;display:flex;align-items:center;flex-shrink:0;" onmouseover="this.style.color='#0D6E6E'" onmouseout="this.style.color='#94A3B8'">
            <span class="material-symbols-outlined" style="font-size:16px;">visibility_off</span>
          </button>
        `;

        const minBtn = dock.querySelector('#careflow-dock-minimize-btn');
        if (minBtn) minBtn.onclick = () => applyDockStyles(true);

        const switcherBtn = dock.querySelector('#careflow-dock-switcher-btn');
        if (switcherBtn) switcherBtn.onclick = () => openPageSwitcherModal(currentPage);

        const flowsBtn = dock.querySelector('#careflow-dock-flows-btn');
        if (flowsBtn) flowsBtn.onclick = openFlowsModal;
      }
    }

    // Default to minimized on mobile to never obstruct content
    applyDockStyles(isMobile);
    document.body.appendChild(dock);

    // Re-evaluate on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768 && !dock.querySelector('#careflow-dock-expand-btn')) {
        applyDockStyles(true);
      }
    });
  }

  // Page Switcher Modal with Search
  function openPageSwitcherModal(currentPage) {
    const categories = {};
    CAREFLOW_PAGES.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    let html = `
      <div style="margin-bottom:14px;">
        <div style="position:relative;margin-bottom:14px;">
          <input type="text" id="careflow-dir-search" placeholder="Search pages, workflows or keywords..." style="
            width:100%;
            padding:9px 12px 9px 34px;
            border-radius:12px;
            border:1px solid #CBD5E1;
            font-size:12.5px;
            font-family:'Plus Jakarta Sans', Inter, system-ui, sans-serif;
            background:#F8FAFC;
            outline:none;
            transition:all 0.15s;
          " onfocus="this.style.borderColor='#0D6E6E';this.style.background='#FFFFFF';this.style.boxShadow='0 0 0 3px rgba(13,110,110,0.1)'" onblur="this.style.borderColor='#CBD5E1';this.style.boxShadow='none'">
          <span class="material-symbols-outlined" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:17px;color:#94A3B8;pointer-events:none;">search</span>
        </div>
        <p style="font-size:12px;color:#64748B;margin:0;">CareFlow Suite Directory (21 Live Operational Interfaces):</p>
      </div>
      <div id="careflow-dir-list" style="display:flex;flex-direction:column;gap:16px;">
    `;

    for (let [cat, pages] of Object.entries(categories)) {
      html += `
        <div class="dir-category-block">
          <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0D6E6E;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span style="width:4px;height:4px;border-radius:50%;background:#0D6E6E;"></span>
            <span>${cat}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(230px, 1fr));gap:8px;">
      `;
      for (let p of pages) {
        const isCurrent = p.id === currentPage.id;
        html += `
          <a href="${getPageUrl(p.id)}" class="dir-page-item" data-search="${p.num.toLowerCase()} ${p.name.toLowerCase()} ${p.hindi.toLowerCase()}" style="
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
            <div style="width:28px;height:28px;border-radius:8px;background:${isCurrent ? '#0D6E6E' : '#E6F7F2'};color:${isCurrent ? '#fff' : '#0D6E6E'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="material-symbols-outlined" style="font-size:16px;">${p.icon}</span>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:12px;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                <span style="color:#0D6E6E;margin-right:4px;">${p.num}</span> ${p.name}
              </div>
              <div style="font-size:10px;color:#94A3B8;margin-top:2px;">${p.hindi}</div>
            </div>
            ${isCurrent ? '<span style="font-size:9.5px;font-weight:700;background:#0D6E6E;color:#fff;padding:2px 6px;border-radius:9999px;">Current</span>' : ''}
          </a>
        `;
      }
      html += `</div></div>`;
    }
    html += `</div>`;

    openModal(html, 'CareFlow Operations Directory');

    // Wire real-time search
    setTimeout(() => {
      const searchInput = document.getElementById('careflow-dir-search');
      if (searchInput) {
        searchInput.focus();
        searchInput.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase().trim();
          document.querySelectorAll('.dir-page-item').forEach(item => {
            const match = item.getAttribute('data-search').includes(q);
            item.style.display = match ? 'flex' : 'none';
          });
          document.querySelectorAll('.dir-category-block').forEach(block => {
            const hasVisible = Array.from(block.querySelectorAll('.dir-page-item')).some(it => it.style.display !== 'none');
            block.style.display = hasVisible ? 'block' : 'none';
          });
        });
      }
    }, 50);
  }

  function openFlowsModal() {
    const flows = [
      {
        title: 'Live OPD Queue & Triage Handoff',
        desc: 'Review waiting patients, examine deterministic red flags, acknowledge clinical risks, and inspect append-only audit trail.',
        steps: [
          { num: 'ADM', name: 'Operations Control', id: 'admin' },
          { num: 'P16', name: 'Notifications', id: 'p16' },
          { num: 'P17', name: 'Care Team Chat', id: 'p17' },
          { num: 'P09', name: 'Care Summary', id: 'p09' }
        ]
      },
      {
        title: 'Patient Intake & Token Generation',
        desc: 'Patient logs symptoms, completes questionnaire, and receives official OPD check-in token.',
        steps: [
          { num: 'P01', name: 'Landing Welcome', id: 'p01' },
          { num: 'P02', name: 'Login Access', id: 'p02' },
          { num: 'P07', name: 'Health Questionnaire', id: 'p07' },
          { num: 'P10', name: 'Intake Complete', id: 'p10' }
        ]
      },
      {
        title: 'Clinical Document Extraction & Vault',
        desc: 'Upload prescription or lab report, verify OCR extraction data, and file in ABDM-linked health vault.',
        steps: [
          { num: 'P03', name: 'Dashboard', id: 'p03' },
          { num: 'P08', name: 'Documents & Vault', id: 'p08' },
          { num: 'P14', name: 'Prescriptions & Labs', id: 'p14' },
          { num: 'P15', name: 'Health Timeline', id: 'p15' }
        ]
      },
      {
        title: 'Specialist Appointments & Teleconsultation',
        desc: 'Find doctor, schedule slot, view consultation details, and enter video consultation.',
        steps: [
          { num: 'P11', name: 'Appointments Hub', id: 'p11' },
          { num: 'P13', name: 'Book Appointment', id: 'p13' },
          { num: 'P12', name: 'Appointment Video', id: 'p12' }
        ]
      }
    ];

    let html = `
      <p style="font-size:12.5px;color:#64748B;margin:0 0 16px 0;">Select an end-to-end CareFlow operational flow to navigate:</p>
      <div style="display:flex;flex-direction:column;gap:12px;">
    `;

    flows.forEach(flow => {
      html += `
        <div style="padding:14px;border-radius:14px;background:#F8FAFC;border:1px solid #E2E8F0;">
          <div style="font-size:13.5px;font-weight:700;color:#0B192C;margin-bottom:3px;">${flow.title}</div>
          <div style="font-size:11.5px;color:#64748B;margin-bottom:10px;">${flow.desc}</div>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
      `;
      flow.steps.forEach((step, idx) => {
        html += `
          <a href="${getPageUrl(step.id)}" style="
            display:inline-flex;
            align-items:center;
            gap:4px;
            padding:3px 9px;
            border-radius:9999px;
            background:#FFFFFF;
            border:1px solid #CBD5E1;
            font-size:11px;
            font-weight:700;
            color:#0D6E6E;
            text-decoration:none;
            transition:all 0.15s;
          " onmouseover="this.style.borderColor='#0D6E6E';this.style.background='#E6F7F2'" onmouseout="this.style.borderColor='#CBD5E1';this.style.background='#FFFFFF'">
            <span>${step.num}</span> <span>${step.name}</span>
          </a>
        `;
        if (idx < flow.steps.length - 1) {
          html += `<span style="color:#94A3B8;font-size:11px;">→</span>`;
        }
      });
      html += `</div></div>`;
    });
    html += `</div>`;

    openModal(html, 'CareFlow Guided Workflows');
  }

  // Universal Link and Header Wireup
  function wireUniversalLinks() {
    const currentPage = getCurrentPage();

    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      const dataPath = link.getAttribute('data-path');
      const text = (link.textContent || '').trim().toLowerCase();

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

      if (!href || href === '#' || href === 'javascript:void(0)') {
        if (link.querySelector('svg') && (link.textContent.includes('CareFlow') || link.getAttribute('aria-label')?.includes('CareFlow'))) {
          link.href = (currentPage.id === 'p01' || currentPage.id === 'p02') ? getPageUrl('p01') : getPageUrl('p03');
          return;
        }

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

  function init() {
    const currentPage = getCurrentPage();
    injectQuickNavigatorDock(currentPage);
    wireUniversalLinks();

    // Ensure document is smooth-scrolling without horizontal overflow
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.width = '100%';
    document.body.style.overflowX = 'hidden';
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
