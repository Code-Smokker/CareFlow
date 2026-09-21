/**
 * CareFlow Universal Navigation & Interactive Flow Controller
 * Connects all 19 clinical pages, provides a persistent Quick Flow HUD,
 * universal sidebar linking, search palette (Cmd+K), interactive modals, and toasts.
 */
(function () {
  // Captured now: document.currentScript is only set while this script runs. Used at the bottom
  // to load careflow-live.js (the backend binding layer) from the same folder.
  const SELF_SRC = document.currentScript && document.currentScript.src;
  const PAGES = [
    { id: 1, key: 'w01', title: 'Landing / Home', hindi: 'मुख्य पृष्ठ', folder: 'careflow_website_w01_landing_home_page', file: 'code.html', group: 'public' },
    { id: 2, key: 'w02', title: 'Clinician Login', hindi: 'लॉग इन', folder: 'careflow_website_w02_login', file: 'code.html', group: 'auth' },
    { id: 3, key: 'w03', title: 'Care Team Dashboard', hindi: 'केयर टीम डैशबोर्ड', folder: 'careflow_website_w03_care_team_dashboard', file: 'code.html', group: 'hub' },
    { id: 4, key: 'w04', title: 'Patient Directory', hindi: 'मरीज सूची', folder: 'careflow_website_w04_patient_list', file: 'code.html', group: 'hub' },
    { id: 5, key: 'w05', title: 'Patient Profile (Aarav Sharma)', hindi: 'मरीज प्रोफ़ाइल', folder: 'careflow_website_w05_patient_profile', file: 'code.html', group: 'intake' },
    { id: 6, key: 'w06', title: 'Intake Overview', hindi: 'इनटेक अवलोकन', folder: 'careflow_website_w06_patient_intake_overview', file: 'code.html', group: 'intake' },
    { id: 7, key: 'w07', title: 'Symptoms & Complaint', hindi: 'लक्षण एवं समस्या', folder: 'careflow_website_w07_symptoms_chief_complaint', file: 'code.html', group: 'intake' },
    { id: 8, key: 'w08', title: 'Health Questionnaire', hindi: 'स्वास्थ्य प्रश्नावली', folder: 'careflow_website_w08_health_questionnaire', file: 'code.html', group: 'intake' },
    { id: 9, key: 'w09', title: 'Clinical Documents', hindi: 'दस्तावेज़', folder: 'careflow_website_w09_documents', file: 'code.html', group: 'intake' },
    { id: 10, key: 'w10', title: 'Document Review & OCR', hindi: 'दस्तावेज़ समीक्षा', folder: 'careflow_website_w10_document_review', file: 'code.html', group: 'intake' },
    { id: 11, key: 'w11', title: 'Care Summary', hindi: 'केयर सारांश', folder: 'careflow_website_w11_care_summary', file: 'code.html', group: 'intake' },
    { id: 12, key: 'w12', title: 'Read-Back Summary', hindi: 'रीड-बैक समीक्षा', folder: 'careflow_website_w12_read_back_summary_review', file: 'code.html', group: 'intake' },
    { id: 13, key: 'w13', title: 'Red Flag Alerts', hindi: 'रेड फ्लैग अलर्ट', folder: 'careflow_website_w13_red_flag_alerts', file: 'code.html', group: 'intake' },
    { id: 14, key: 'w14', title: 'Care Team Handoff', hindi: 'केयर टीम हैंडऑफ', folder: 'careflow_website_w14_care_team_handoff', file: 'code.html', group: 'intake' },
    { id: 15, key: 'w15', title: 'Session Complete', hindi: 'सत्र पूर्ण', folder: 'careflow_website_w15_session_complete', file: 'code.html', group: 'intake' },
    { id: 16, key: 'w16', title: 'Appointments', hindi: 'अपॉइंटमेंट', folder: 'careflow_website_w16_appointments', file: 'code.html', group: 'hub' },
    { id: 17, key: 'w17', title: 'Analytics & Insights', hindi: 'एनालिटिक्स', folder: 'careflow_website_w17_analytics', file: 'code.html', group: 'hub' },
    { id: 18, key: 'w18', title: 'Settings & Profile', hindi: 'सेटिंग्स', folder: 'careflow_website_w18_settings', file: 'code.html', group: 'hub' },
    { id: 19, key: 'a01', title: 'Ayurvedic Case Record', hindi: 'आयुर्वेदिक रुग्ण परीक्षा', folder: 'careflow_website_a01_ayurvedic_case_record', file: 'code.html', group: 'intake' }
  ];

  // Detect current page
  function getCurrentPageInfo() {
    const path = window.location.pathname;
    for (const p of PAGES) {
      if (path.includes(p.folder)) {
        return { page: p, isSubdir: true };
      }
    }
    return { page: PAGES[0], isSubdir: false };
  }

  const { page: currentPage, isSubdir } = getCurrentPageInfo();

  function getPageUrl(targetPage) {
    if (isSubdir) {
      return `../${targetPage.folder}/${targetPage.file}`;
    } else {
      return `./${targetPage.folder}/${targetPage.file}`;
    }
  }

  // CareFlow Global API
  window.CareFlow = {
    pages: PAGES,
    currentPage: currentPage,

    navigate: function (target) {
      let page = null;
      if (typeof target === 'number') {
        page = PAGES.find(p => p.id === target);
      } else if (typeof target === 'string') {
        page = PAGES.find(p => p.key === target || p.folder.includes(target));
      }
      if (page) {
        window.location.href = getPageUrl(page);
      }
    },

    nextPage: function () {
      const nextId = currentPage.id >= PAGES.length ? 1 : currentPage.id + 1;
      this.navigate(nextId);
    },

    prevPage: function () {
      const prevId = currentPage.id <= 1 ? PAGES.length : currentPage.id - 1;
      this.navigate(prevId);
    },

    showToast: function (message, type = 'info', duration = 3200) {
      let container = document.getElementById('careflow-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'careflow-toast-container';
        container.className = 'fixed bottom-20 right-6 z-[99999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-semibold transform transition-all duration-300 translate-y-3 opacity-0';
      
      if (type === 'success') {
        toast.className += ' bg-[#0D6E6E] text-white border-[#005454]';
        toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span><span>${message}</span>`;
      } else if (type === 'warning') {
        toast.className += ' bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]';
        toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">warning</span><span>${message}</span>`;
      } else {
        toast.className += ' bg-[#0B192C] text-white border-slate-700';
        toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">info</span><span>${message}</span>`;
      }

      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-3', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    toggleLanguage: function () {
      const currentLang = localStorage.getItem('careflow_lang') || 'en';
      const newLang = currentLang === 'en' ? 'hi' : 'en';
      localStorage.setItem('careflow_lang', newLang);
      this.showToast(newLang === 'hi' ? 'भाषा: हिन्दी सक्रिय (Hindi Mode Active)' : 'Language: English Active', 'info');
      document.querySelectorAll('[data-lang-label]').forEach(el => {
        el.classList.toggle('font-bold', el.dataset.langLabel === newLang);
      });
    },

    openSearchModal: function () {
      let existing = document.getElementById('careflow-search-modal');
      if (existing) {
        existing.classList.remove('hidden');
        const input = existing.querySelector('input');
        if (input) input.focus();
        return;
      }

      const modal = document.createElement('div');
      modal.id = 'careflow-search-modal';
      modal.className = 'fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fadeIn';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col">
          <div class="p-4 border-b border-slate-100 flex items-center gap-3">
            <span class="material-symbols-outlined text-slate-400 text-[22px]">search</span>
            <input type="text" id="careflow-search-input" placeholder="Search screen, patient, UHID (e.g., Aarav, Symptoms, W07, 1-18)..." 
              class="w-full text-sm font-medium text-slate-800 focus:outline-none placeholder-slate-400">
            <button type="button" onclick="document.getElementById('careflow-search-modal').classList.add('hidden')" class="px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-slate-700 bg-slate-100 rounded">ESC</button>
          </div>
          <div id="careflow-search-results" class="max-h-96 overflow-y-auto p-2 divide-y divide-slate-50 text-xs">
            ${PAGES.map(p => `
              <a href="${getPageUrl(p)}" class="flex items-center justify-between p-3 rounded-xl hover:bg-[#E6F7F2] text-slate-700 hover:text-[#0D6E6E] transition-colors group">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg ${p.id === currentPage.id ? 'bg-[#0D6E6E] text-white' : 'bg-slate-100 text-slate-600'} group-hover:bg-[#0D6E6E] group-hover:text-white flex items-center justify-center font-bold text-[10px]">
                    ${p.id}
                  </span>
                  <div>
                    <span class="font-bold text-slate-900 group-hover:text-[#0D6E6E]">${p.title}</span>
                    <span class="text-slate-400 text-[11px] block">${p.hindi}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  ${p.id === currentPage.id ? '<span class="text-[10px] font-bold text-[#0D6E6E] bg-emerald-50 px-2 py-0.5 rounded">Current</span>' : ''}
                  <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">${p.group}</span>
                </div>
              </a>
            `).join('')}
          </div>
          <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Press <kbd class="px-1 bg-white border border-slate-200 rounded text-[10px]">ESC</kbd> to exit, <kbd class="px-1 bg-white border border-slate-200 rounded text-[10px]">[</kbd> or <kbd class="px-1 bg-white border border-slate-200 rounded text-[10px]">]</kbd> to flip pages</span>
            <span class="text-[#0D6E6E] font-semibold">CareFlow Workstation</span>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      const input = document.getElementById('careflow-search-input');
      const resultsDiv = document.getElementById('careflow-search-results');

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });

      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = PAGES.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.hindi.toLowerCase().includes(query) || 
          p.key.includes(query) ||
          String(p.id) === query
        );
        resultsDiv.innerHTML = filtered.map(p => `
          <a href="${getPageUrl(p)}" class="flex items-center justify-between p-3 rounded-xl hover:bg-[#E6F7F2] text-slate-700 hover:text-[#0D6E6E] transition-colors group">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-lg ${p.id === currentPage.id ? 'bg-[#0D6E6E] text-white' : 'bg-slate-100 text-slate-600'} group-hover:bg-[#0D6E6E] group-hover:text-white flex items-center justify-center font-bold text-[10px]">
                ${p.id}
              </span>
              <div>
                <span class="font-bold text-slate-900 group-hover:text-[#0D6E6E]">${p.title}</span>
                <span class="text-slate-400 text-[11px] block">${p.hindi}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              ${p.id === currentPage.id ? '<span class="text-[10px] font-bold text-[#0D6E6E] bg-emerald-50 px-2 py-0.5 rounded">Current</span>' : ''}
              <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">${p.group}</span>
            </div>
          </a>
        `).join('');
      });

      input.focus();
    },

    openAddPatientModal: function () {
      let modal = document.getElementById('careflow-patient-modal');
      if (modal) {
        modal.classList.remove('hidden');
        return;
      }

      modal = document.createElement('div');
      modal.id = 'careflow-patient-modal';
      modal.className = 'fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#E6F7F2] text-[#0D6E6E] flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">person_add</span>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Quick Register Patient</h3>
                <p class="text-xs text-slate-500">नया मरीज पंजीकृत करें • ABDM Fast Intake</p>
              </div>
            </div>
            <button type="button" class="p-1 text-slate-400 hover:text-slate-700" onclick="document.getElementById('careflow-patient-modal').classList.add('hidden')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form class="space-y-3" onsubmit="event.preventDefault(); CareFlow.handlePatientRegister();">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name • पूरा नाम</label>
              <input id="new-patient-name" type="text" value="Aarav Sharma" required class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Age & Gender • आयु व लिंग</label>
                <input id="new-patient-age" type="text" value="28 Y / Male" required class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">ABHA / UHID</label>
                <input id="new-patient-uhid" type="text" value="CF-1024" required class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Chief Complaint • प्राथमिक लक्षण</label>
              <input id="new-patient-complaint" type="text" value="Fever & cough (3 days)" required class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]">
            </div>
            <div class="pt-3 flex items-center justify-end gap-2.5">
              <button type="button" class="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50" onclick="document.getElementById('careflow-patient-modal').classList.add('hidden')">
                Cancel (रद्द करें)
              </button>
              <button type="submit" class="px-5 py-2 rounded-full bg-[#0D6E6E] hover:bg-[#005454] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                <span>Start Intake →</span>
              </button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);
    },

    handlePatientRegister: function () {
      const modal = document.getElementById('careflow-patient-modal');
      if (modal) modal.classList.add('hidden');
      this.showToast('Patient registered! Opening intake workflow...', 'success');
      setTimeout(() => {
        this.navigate(5); // Go to patient profile
      }, 700);
    }
  };

  // Keyboard Navigation: [ for Prev, ] for Next, Cmd+K for search
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') {
        const searchModal = document.getElementById('careflow-search-modal');
        if (searchModal) searchModal.classList.add('hidden');
        const patModal = document.getElementById('careflow-patient-modal');
        if (patModal) patModal.classList.add('hidden');
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      CareFlow.openSearchModal();
    } else if (e.key === '[') {
      CareFlow.prevPage();
    } else if (e.key === ']') {
      CareFlow.nextPage();
    } else if (e.key === 'Escape') {
      const searchModal = document.getElementById('careflow-search-modal');
      if (searchModal) searchModal.classList.add('hidden');
    }
  });

  // Inject Floating Quick-Flow HUD
  function injectFlowHUD() {
    const prevPageObj = PAGES.find(p => p.id === (currentPage.id > 1 ? currentPage.id - 1 : PAGES.length));
    const nextPageObj = PAGES.find(p => p.id === (currentPage.id < PAGES.length ? currentPage.id + 1 : 1));

    const hud = document.createElement('div');
    hud.id = 'careflow-global-hud';
    hud.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[99990] flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0B192C]/92 text-white shadow-2xl border border-white/20 backdrop-blur-xl text-xs select-none transition-all duration-300';
    hud.innerHTML = `
      <div class="flex items-center gap-2 pl-1 pr-2 border-r border-white/15">
        <span class="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
        <span class="font-bold font-mono tracking-tight text-emerald-300 text-[11px]">${String(currentPage.id).padStart(2, '0')}/${PAGES.length}</span>
        <span class="font-semibold text-white/90 truncate max-w-[140px] sm:max-w-[200px] hidden sm:inline" title="${currentPage.title}">${currentPage.title}</span>
      </div>

      <!-- Prev button -->
      <button id="hud-prev-btn" title="Previous screen: ${prevPageObj.title} (Key: [)" class="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors">
        <span class="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>

      <!-- Flow select dropdown trigger -->
      <button id="hud-jump-btn" title="Jump to any of ${PAGES.length} screens (Cmd+K)" class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors font-medium text-[11px]">
        <span>All Screens</span>
        <span class="material-symbols-outlined text-[14px]">expand_more</span>
      </button>

      <!-- Next button -->
      <button id="hud-next-btn" title="Next screen: ${nextPageObj.title} (Key: ])" class="flex items-center justify-center w-7 h-7 rounded-full bg-[#0D6E6E] hover:bg-[#005454] text-white transition-colors shadow-sm">
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>

      <div class="h-4 w-px bg-white/15 mx-0.5"></div>

      <!-- Search quick trigger -->
      <button id="hud-search-btn" title="Quick search (Cmd+K)" class="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors">
        <span class="material-symbols-outlined text-[15px]">search</span>
      </button>

      <!-- Minimize toggle -->
      <button id="hud-toggle-btn" title="Minimize HUD" class="flex items-center justify-center w-6 h-6 rounded-full text-white/50 hover:text-white transition-colors">
        <span class="material-symbols-outlined text-[14px]">close</span>
      </button>
    `;

    document.body.appendChild(hud);

    // Wire HUD clicks
    document.getElementById('hud-prev-btn').addEventListener('click', () => CareFlow.prevPage());
    document.getElementById('hud-next-btn').addEventListener('click', () => CareFlow.nextPage());
    document.getElementById('hud-jump-btn').addEventListener('click', () => CareFlow.openSearchModal());
    document.getElementById('hud-search-btn').addEventListener('click', () => CareFlow.openSearchModal());
    
    // Toggle HUD to minimized dot
    const toggleBtn = document.getElementById('hud-toggle-btn');
    toggleBtn.addEventListener('click', () => {
      hud.classList.add('hidden');
      let restoreBtn = document.getElementById('careflow-restore-hud-btn');
      if (!restoreBtn) {
        restoreBtn = document.createElement('button');
        restoreBtn.id = 'careflow-restore-hud-btn';
        restoreBtn.className = 'fixed bottom-4 right-4 z-[99990] w-10 h-10 rounded-full bg-[#0D6E6E] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform';
        restoreBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">alt_route</span>';
        restoreBtn.title = 'Open CareFlow Flow Navigator';
        restoreBtn.onclick = () => {
          hud.classList.remove('hidden');
          restoreBtn.remove();
        };
        document.body.appendChild(restoreBtn);
      }
    });
  }

  // Universal Link Interceptor & Auto-Connector
  function wireUniversalLinks() {
    const pathMappings = {
      'home': 1,
      'dashboard': 3,
      'patients': 4,
      'patient-profile': 5,
      'appointments': 16,
      'documents': 9,
      'care-summaries': 11,
      'ayurvedic-case-record': 19,
      'summaries': 11,
      'alerts': 13,
      'analytics': 17,
      'settings': 18,
      'sign-in': 2,
      'get-started': 2,
      'for-care-teams': 3,
      'for-patients': 6
    };

    document.querySelectorAll('[data-path]').forEach(el => {
      const target = el.getAttribute('data-path');
      if (pathMappings[target]) {
        el.setAttribute('href', getPageUrl(PAGES.find(p => p.id === pathMappings[target])));
      }
    });

    // Wire notifications bell to Alerts screen
    document.querySelectorAll('header button').forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon && icon.textContent.trim() === 'notifications') {
        btn.classList.add('cursor-pointer');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          CareFlow.navigate(13); // Red Flag Alerts
        });
      }
    });

    // Wire doctor profile avatar in header/sidebar to Settings
    document.querySelectorAll('aside .p-space-sm, header .w-8.h-8').forEach(el => {
      el.classList.add('cursor-pointer');
      el.addEventListener('click', () => {
        CareFlow.navigate(18); // Settings
      });
    });

    // Wire header search inputs to search modal
    document.querySelectorAll('header input[placeholder*="Search"]').forEach(input => {
      input.classList.add('cursor-pointer');
      input.addEventListener('focus', (e) => {
        e.target.blur();
        CareFlow.openSearchModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectFlowHUD();
      wireUniversalLinks();
    });
  } else {
    injectFlowHUD();
    wireUniversalLinks();
  }

  // Backend binding layer — fills the static pages with live gateway data (see careflow-live.js).
  if (SELF_SRC) {
    const live = document.createElement('script');
    live.src = new URL('careflow-live.js', SELF_SRC).href;
    document.head.appendChild(live);
  }
})();
