/**
 * CareFlow Universal Navigation & Interactive Flow Controller
 * Connects all 19 clinical pages, provides a persistent Quick Flow HUD,
 * universal sidebar linking, active search palette (Cmd+K), interactive language selector,
 * doctor profile navigation, logo branding, and toasts.
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
    { id: 5, key: 'w05', title: 'Patient Profile', hindi: 'मरीज प्रोफ़ाइल', folder: 'careflow_website_w05_patient_profile', file: 'code.html', group: 'intake' },
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
    { id: 18, key: 'w18', title: 'Settings & Profile', hindi: 'सेटिंग्स एवं डॉक्टर प्रोफ़ाइल', folder: 'careflow_website_w18_settings', file: 'code.html', group: 'hub' },
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

  // Automatic Logo Replacer: Replaces placeholder icons with logo.png
  function replaceLogos() {
    const logoSrc = isSubdir ? '../logo.png' : './logo.png';
    const homeUrl = getPageUrl(PAGES.find(p => p.id === 3)); // Dashboard

    // 1. Target all icon boxes with volunteer_activism, favorite, etc. in aside/header
    document.querySelectorAll('aside, header, footer').forEach(container => {
      const isAside = container.tagName.toLowerCase() === 'aside';
      const logoClass = isAside
        ? 'h-14 sm:h-16 w-auto object-contain max-w-[220px] hover:opacity-95 transition-all'
        : 'h-10 sm:h-12 w-auto object-contain max-w-[190px] hover:opacity-95 transition-all';

      const iconBoxes = container.querySelectorAll('.w-10, .w-9, .w-8');
      iconBoxes.forEach(box => {
        const icon = box.querySelector('.material-symbols-outlined');
        if (icon && (icon.textContent.includes('volunteer_activism') || icon.textContent.includes('favorite'))) {
          const parentLink = box.closest('a') || box.parentElement;
          if (parentLink && parentLink.textContent.includes('CareFlow')) {
            // Replace the link content with the branded logo image
            parentLink.innerHTML = `
              <img src="${logoSrc}" alt="CareFlow Logo" class="${logoClass}" />
            `;
            parentLink.setAttribute('href', homeUrl);
            return;
          }
          // Otherwise replace the inner content of the box
          box.classList.remove('bg-[#0D6E6E]', 'bg-primary', 'bg-primary-container', 'bg-surface-mint-subtle');
          box.classList.add('bg-transparent');
          box.innerHTML = `<img src="${logoSrc}" alt="CareFlow" class="w-full h-full object-contain" />`;
        }
      });
    });

    // 2. Also enlarge existing logo img tags in aside or header
    document.querySelectorAll('aside img[src*="logo.png"], aside img[alt*="CareFlow"]').forEach(img => {
      img.className = 'h-14 sm:h-16 w-auto object-contain max-w-[220px] hover:opacity-95 transition-all';
    });
    document.querySelectorAll('header img[src*="logo.png"], header img[alt*="CareFlow"]').forEach(img => {
      img.className = 'h-10 sm:h-12 w-auto object-contain max-w-[190px] hover:opacity-95 transition-all';
    });

    // 3. Replace any standalone brand anchors
    document.querySelectorAll('a[data-path="home"], a[href*="w01_landing"]').forEach(a => {
      const icon = a.querySelector('.material-symbols-outlined');
      if (icon && (icon.textContent.includes('volunteer_activism') || icon.textContent.includes('favorite'))) {
        a.innerHTML = `<img src="${logoSrc}" alt="CareFlow Logo" class="h-10 sm:h-12 w-auto object-contain max-w-[200px]" />`;
      }
    });

    // 4. Header branding on pages without aside
    document.querySelectorAll('header .font-headline-md, header .font-title-md').forEach(span => {
      if (span.textContent.trim() === 'CareFlow') {
        const parent = span.closest('a') || span.parentElement;
        if (parent && parent.querySelector('.material-symbols-outlined')) {
          parent.innerHTML = `<img src="${logoSrc}" alt="CareFlow Logo" class="h-10 sm:h-12 w-auto object-contain max-w-[200px]" />`;
        }
      }
    });
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

    // Active Language Selector
    setLanguage: function (lang) {
      localStorage.setItem('careflow_lang', lang);
      
      // Update all header language buttons/labels
      document.querySelectorAll('header button, header div').forEach(el => {
        const text = el.textContent || '';
        if (text.includes('English') || text.includes('हिन्दी') || text.includes('Language')) {
          const span = el.querySelector('span:not(.material-symbols-outlined)');
          if (span && (span.textContent.includes('English') || span.textContent.includes('हिन्दी'))) {
            if (lang === 'hi') {
              span.textContent = 'हिन्दी (Hindi) ▼';
            } else if (lang === 'en') {
              span.textContent = 'English Only ▼';
            } else {
              span.textContent = 'English (हिन्दी) ▼';
            }
          }
        }
      });

      // Update segmented pill buttons if present
      document.querySelectorAll('header .rounded-full.p-1, header .rounded-full.p-0.5').forEach(group => {
        const btns = group.querySelectorAll('button');
        if (btns.length === 2) {
          const [enBtn, hiBtn] = btns;
          if (enBtn.textContent.includes('English') && hiBtn.textContent.includes('हिन्दी')) {
            if (lang === 'en') {
              enBtn.className = 'px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold bg-surface-card text-navy-dark shadow-sm';
              hiBtn.className = 'px-2 py-0.5 rounded-full font-label-sm text-label-sm text-secondary hover:text-navy-dark transition-colors';
            } else if (lang === 'hi') {
              hiBtn.className = 'px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold bg-surface-card text-navy-dark shadow-sm';
              enBtn.className = 'px-2 py-0.5 rounded-full font-label-sm text-label-sm text-secondary hover:text-navy-dark transition-colors';
            } else {
              enBtn.className = 'px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold text-navy-dark';
              hiBtn.className = 'px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold text-[#0D6E6E]';
            }
          }
        }
      });

      if (lang === 'hi') {
        this.showToast('भाषा: हिन्दी सक्रिय (Hindi Clinical Mode Active)', 'info');
      } else if (lang === 'en') {
        this.showToast('Language: English Active (English Clinical Mode)', 'info');
      } else {
        this.showToast('द्विभाषी मोड सक्रिय (Bilingual English + Hindi Active)', 'success');
      }
    },

    openLanguageMenu: function (anchorBtn) {
      let menu = document.getElementById('careflow-language-menu');
      if (menu) {
        menu.remove();
        return;
      }

      const current = localStorage.getItem('careflow_lang') || 'bilingual';
      menu = document.createElement('div');
      menu.id = 'careflow-language-menu';
      menu.className = 'fixed z-[100010] bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 w-64 text-xs animate-fadeIn';

      if (anchorBtn) {
        const rect = anchorBtn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.right = `${Math.max(16, window.innerWidth - rect.right)}px`;
      } else {
        menu.style.top = '70px';
        menu.style.right = '80px';
      }

      menu.innerHTML = `
        <div class="px-3.5 py-1.5 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
          Clinical Language • भाषा चयन
        </div>
        <button type="button" onclick="CareFlow.setLanguage('bilingual'); document.getElementById('careflow-language-menu').remove();" class="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 text-slate-800 ${current === 'bilingual' ? 'bg-[#E6F7F2] text-[#0D6E6E] font-bold' : ''}">
          <div class="flex items-center gap-2.5">
            <span class="text-base">🌐</span>
            <div>
              <div class="font-bold text-slate-900">Bilingual (English + हिन्दी)</div>
              <div class="text-[10px] text-slate-500">Default ABDM clinical workflow</div>
            </div>
          </div>
          ${current === 'bilingual' ? '<span class="material-symbols-outlined text-[#0D6E6E] text-[18px]">check</span>' : ''}
        </button>
        <button type="button" onclick="CareFlow.setLanguage('en'); document.getElementById('careflow-language-menu').remove();" class="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 text-slate-800 ${current === 'en' ? 'bg-[#E6F7F2] text-[#0D6E6E] font-bold' : ''}">
          <div class="flex items-center gap-2.5">
            <span class="text-base">🇬🇧</span>
            <div>
              <div class="font-bold text-slate-900">English Only</div>
              <div class="text-[10px] text-slate-500">Standard English medical terms</div>
            </div>
          </div>
          ${current === 'en' ? '<span class="material-symbols-outlined text-[#0D6E6E] text-[18px]">check</span>' : ''}
        </button>
        <button type="button" onclick="CareFlow.setLanguage('hi'); document.getElementById('careflow-language-menu').remove();" class="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 text-slate-800 ${current === 'hi' ? 'bg-[#E6F7F2] text-[#0D6E6E] font-bold' : ''}">
          <div class="flex items-center gap-2.5">
            <span class="text-base">🇮🇳</span>
            <div>
              <div class="font-bold text-slate-900">हिन्दी (Hindi Mode)</div>
              <div class="text-[10px] text-slate-500">Devanagari clinical labels</div>
            </div>
          </div>
          ${current === 'hi' ? '<span class="material-symbols-outlined text-[#0D6E6E] text-[18px]">check</span>' : ''}
        </button>
      `;

      document.body.appendChild(menu);

      const closeMenu = (e) => {
        if (!menu.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      setTimeout(() => document.addEventListener('click', closeMenu), 50);
    },

    toggleLanguage: function () {
      const currentLang = localStorage.getItem('careflow_lang') || 'bilingual';
      let nextLang = 'bilingual';
      if (currentLang === 'bilingual') nextLang = 'en';
      else if (currentLang === 'en') nextLang = 'hi';
      else nextLang = 'bilingual';
      this.setLanguage(nextLang);
    },

    // Active Search Bar & Clinical Command Palette
    openSearchModal: function () {
      let existing = document.getElementById('careflow-search-modal');
      if (existing) {
        existing.classList.remove('hidden');
        const input = existing.querySelector('input');
        if (input) {
          input.focus();
          input.select();
        }
        return;
      }

      // Search data is live: patients come from the OPD queue, terminology from the gateway's
      // /v1/terminology/search (NAMASTE). Nothing here is hardcoded sample data.
      let PATIENTS = [];
      let TERMINOLOGY = [];
      const live = () => window.CareFlowLive;

      const modal = document.createElement('div');
      modal.id = 'careflow-search-modal';
      modal.className = 'fixed inset-0 z-[100000] bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-16 px-4 animate-fadeIn';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
          <!-- Search Input Header -->
          <div class="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
            <span class="material-symbols-outlined text-[#0D6E6E] text-[24px]">search</span>
            <input type="text" id="careflow-search-input" placeholder="Search patients by name or token, screens, or NAMASTE diagnoses..." 
              class="w-full text-base font-medium text-slate-900 focus:outline-none placeholder-slate-400 bg-transparent">
            <button type="button" onclick="document.getElementById('careflow-search-modal').classList.add('hidden')" class="px-2.5 py-1 text-xs font-mono font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/80 rounded-lg">ESC</button>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-white text-xs font-semibold overflow-x-auto">
            <button type="button" data-filter="all" class="cf-search-tab px-3 py-1 rounded-full bg-[#0D6E6E] text-white transition-colors">All (सभी)</button>
            <button type="button" data-filter="patients" class="cf-search-tab px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Patients (मरीज)</button>
            <button type="button" data-filter="screens" class="cf-search-tab px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Screens (स्क्रीन • ${PAGES.length})</button>
            <button type="button" data-filter="terminology" class="cf-search-tab px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Terminology (शब्दावली)</button>
          </div>

          <!-- Results Scroll Container -->
          <div id="careflow-search-results" class="overflow-y-auto p-3 space-y-2 text-xs flex-1 divide-y divide-slate-50">
          </div>

          <!-- Footer -->
          <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span class="flex items-center gap-1.5">
              <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono shadow-2xs">↑</kbd>
              <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono shadow-2xs">↓</kbd> to navigate,
              <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono shadow-2xs">↵</kbd> to select,
              <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono shadow-2xs">ESC</kbd> to exit
            </span>
            <span class="text-[#0D6E6E] font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> CareFlow Clinical Search
            </span>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      const input = document.getElementById('careflow-search-input');
      const resultsDiv = document.getElementById('careflow-search-results');
      const tabButtons = modal.querySelectorAll('.cf-search-tab');
      let activeFilter = 'all';

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });

      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => {
            b.classList.remove('bg-[#0D6E6E]', 'text-white');
            b.classList.add('bg-slate-100', 'text-slate-600');
          });
          btn.classList.remove('bg-slate-100', 'text-slate-600');
          btn.classList.add('bg-[#0D6E6E]', 'text-white');
          activeFilter = btn.dataset.filter;
          renderResults();
        });
      });

      function renderResults() {
        const query = (input.value || '').toLowerCase().trim();
        let html = '';

        // 1. Patients
        if (activeFilter === 'all' || activeFilter === 'patients') {
          const matchedPatients = PATIENTS.filter(p =>
            !query ||
            p.name.toLowerCase().includes(query) ||
            p.uhid.toLowerCase().includes(query) ||
            p.abha.toLowerCase().includes(query) ||
            p.complaint.toLowerCase().includes(query) ||
            p.status.toLowerCase().includes(query)
          );

          if (matchedPatients.length > 0) {
            html += `
              <div class="pt-2 pb-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Patients in Queue (मरीज)</span>
              </div>
            `;
            html += matchedPatients.map(p => `
              <div onclick="CareFlowLive.goto('w05', '${p.visit}')" class="flex items-center justify-between p-3 rounded-xl hover:bg-[#E6F7F2] text-slate-800 hover:text-[#0D6E6E] transition-all cursor-pointer group border border-transparent hover:border-[#0D6E6E]/20 bg-white">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-full bg-[#0D6E6E]/10 text-[#0D6E6E] group-hover:bg-[#0D6E6E] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                    ${p.initials}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm text-slate-900 group-hover:text-[#0D6E6E]">${p.name}</span>
                      <span class="text-[11px] text-slate-500 font-medium">${p.demo}</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${p.uhid}</span>
                    </div>
                    <div class="text-[11px] text-slate-500 truncate mt-0.5">${p.complaint}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 shrink-0 pl-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === 'Ready for review' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${p.status}</span>
                  <span class="text-[10px] text-slate-400">${p.desk}</span>
                </div>
              </div>
            `).join('');
          }
        }

        // 2. Screens
        if (activeFilter === 'all' || activeFilter === 'screens') {
          const matchedScreens = PAGES.filter(p =>
            !query ||
            p.title.toLowerCase().includes(query) ||
            p.hindi.toLowerCase().includes(query) ||
            p.key.toLowerCase().includes(query) ||
            String(p.id) === query
          );

          if (matchedScreens.length > 0) {
            html += `
              <div class="pt-3 pb-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Clinical Screens & Workflows (स्क्रीन)</span>
              </div>
            `;
            html += matchedScreens.map(p => `
              <a href="${getPageUrl(p)}" class="flex items-center justify-between p-3 rounded-xl hover:bg-[#E6F7F2] text-slate-800 hover:text-[#0D6E6E] transition-all group border border-transparent hover:border-[#0D6E6E]/20 bg-white">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg ${p.id === currentPage.id ? 'bg-[#0D6E6E] text-white' : 'bg-slate-100 text-slate-600'} group-hover:bg-[#0D6E6E] group-hover:text-white flex items-center justify-center font-bold text-[11px] shrink-0 transition-colors">
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
          }
        }

        // 3. Terminology & Diagnoses
        if (activeFilter === 'all' || activeFilter === 'terminology') {
          const matchedTerms = query.length >= 3 ? TERMINOLOGY : [];

          if (matchedTerms.length > 0) {
            html += `
              <div class="pt-3 pb-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Clinical Terminology & Diagnoses (शब्दावली)</span>
              </div>
            `;
            html += matchedTerms.map(t => `
              <div onclick="CareFlow.navigate(${t.pageId})" class="flex items-center justify-between p-3 rounded-xl hover:bg-[#E6F7F2] text-slate-800 hover:text-[#0D6E6E] transition-all cursor-pointer group border border-transparent hover:border-[#0D6E6E]/20 bg-white">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-teal-50 text-[#0D6E6E] group-hover:bg-[#0D6E6E] group-hover:text-white flex items-center justify-center font-bold text-[12px] shrink-0 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">medical_services</span>
                  </span>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 group-hover:text-[#0D6E6E]">${t.name}</span>
                      
                    </div>
                    <span class="text-slate-400 text-[11px] block">${t.desc}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] font-bold text-[#0D6E6E] bg-emerald-50 px-2 py-0.5 rounded border border-[#0D6E6E]/20">${t.code}</span>
                  <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">${t.system}</span>
                </div>
              </div>
            `).join('');
          }
        }

        if (!html) {
          html = `
            <div class="p-8 text-center text-slate-400">
              <span class="material-symbols-outlined text-[36px] text-slate-300 block mb-2">search_off</span>
              <p class="font-semibold text-sm text-slate-600">No results found for "${query}"</p>
              <p class="text-xs mt-1">Try a patient’s name or token number, a screen name, or a NAMASTE term (type at least 3 letters).</p>
            </div>
          `;
        }

        resultsDiv.innerHTML = html;
      }

      const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      // Patients: the real OPD queue.
      const loadPatients = async () => {
        if (!live()) return;
        try {
          const q = await live().u.queue();
          PATIENTS = q.map((t) => { const w = live().u.who(t); return { visit: t.visit_id, name: esc(w.name), initials: esc(w.initials), demo: esc(w.demo), uhid: esc(t.token_no), abha: '', complaint: esc(t.department), status: esc(live().u.statusOf(t)), desk: esc(t.department) }; });
        } catch (e) { PATIENTS = []; }
        renderResults();
      };
      // Terminology: the real NAMASTE service, listed alphabetically (CareFlow never ranks a diagnosis).
      let termTimer = null;
      const loadTerms = () => {
        clearTimeout(termTimer);
        const q = (input.value || '').trim();
        if (q.length < 3 || !live()) { TERMINOLOGY = []; return; }
        termTimer = setTimeout(async () => {
          try {
            const r = await live().u.api('/v1/terminology/search?q=' + encodeURIComponent(q) + '&system=namaste');
            TERMINOLOGY = r.slice().sort((a, b) => a.display.localeCompare(b.display)).slice(0, 12).map((c) => ({ name: esc(c.display), code: esc(c.code), system: 'NAMASTE', desc: '', pageId: 19 }));
          } catch (e) { TERMINOLOGY = []; }
          renderResults();
        }, 250);
      };
      input.addEventListener('input', () => { renderResults(); loadTerms(); });
      renderResults();
      loadPatients();
      input.focus();
    },

    // The register-patient modal and token slip live in careflow-live.js (they call the gateway).
    openAddPatientModal: function () {
      this.showToast('Connecting to the CareFlow gateway…', 'info');
      setTimeout(() => { if (window.CareFlow.openAddPatientModal !== this.openAddPatientModal) window.CareFlow.openAddPatientModal(); }, 600);
    },
    handlePatientRegister: function () { this.openAddPatientModal(); }
  };

  // Keyboard Navigation: [ for Prev, ] for Next, Cmd+K for search
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') {
        const searchModal = document.getElementById('careflow-search-modal');
        if (searchModal) searchModal.classList.add('hidden');
        const patModal = document.getElementById('careflow-patient-modal');
        if (patModal) patModal.classList.add('hidden');
        const langMenu = document.getElementById('careflow-language-menu');
        if (langMenu) langMenu.remove();
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
      const langMenu = document.getElementById('careflow-language-menu');
      if (langMenu) langMenu.remove();
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

    // 1. Wire notifications bell to Alerts screen
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

    // 2. Wire doctor profile avatar in header/sidebar to Settings (w18)
    document.querySelectorAll('header button, header div, header a').forEach(el => {
      const text = (el.textContent || '').trim();
      const hasPersonIcon = el.querySelector('.material-symbols-outlined') && el.querySelector('.material-symbols-outlined').textContent.trim() === 'person';
      if (text === 'AI' || hasPersonIcon || el.getAttribute('title')?.includes('Account') || el.getAttribute('title')?.includes('Profile') || el.getAttribute('title')?.includes('Settings')) {
        el.classList.add('cursor-pointer');
        el.setAttribute('title', 'Doctor Profile & Settings (Dr. Ananya Iyer)');
        el.addEventListener('click', (e) => {
          e.preventDefault();
          CareFlow.navigate(18); // Settings
        });
      }
    });

    document.querySelectorAll('aside div, aside a, aside button').forEach(el => {
      const text = (el.textContent || '');
      if ((text.includes('Dr. Ananya Iyer') || text.includes('Desk 4') || text.includes('Dr. Priya')) && !el.closest('form')) {
        el.classList.add('cursor-pointer', 'hover:border-primary-container', 'transition-colors');
        el.setAttribute('title', 'Doctor Profile & Settings (Dr. Ananya Iyer)');
        el.addEventListener('click', (e) => {
          e.preventDefault();
          CareFlow.navigate(18); // Settings
        });
      }
    });

    // 3. Wire header search inputs and wrappers to search modal
    document.querySelectorAll('header input[placeholder*="Search"], header div[onclick*="openSearchModal"]').forEach(el => {
      el.classList.add('cursor-pointer');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        CareFlow.openSearchModal();
      });
      if (el.tagName === 'INPUT') {
        el.addEventListener('focus', (e) => {
          e.target.blur();
          CareFlow.openSearchModal();
        });
      }
    });

    // Also wire kbd ⌘K badges in header
    document.querySelectorAll('header kbd, header .relative:has(input[placeholder*="Search"])').forEach(el => {
      el.classList.add('cursor-pointer');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        CareFlow.openSearchModal();
      });
    });

    // 4. Wire language selector button to language menu / toggle
    document.querySelectorAll('header button, header div').forEach(el => {
      const text = (el.textContent || '').trim();
      const hasLangIcon = el.querySelector('.material-symbols-outlined') && el.querySelector('.material-symbols-outlined').textContent.trim() === 'language';
      if (hasLangIcon || text.includes('English (हिन्दी)') || text.includes('English / हिन्दी') || text.includes('English ▾')) {
        const subButtons = el.querySelectorAll('button');
        if (subButtons.length === 2 && subButtons[0].textContent.includes('English') && subButtons[1].textContent.includes('हिन्दी')) {
          subButtons[0].onclick = (e) => {
            e.stopPropagation();
            CareFlow.setLanguage('en');
          };
          subButtons[1].onclick = (e) => {
            e.stopPropagation();
            CareFlow.setLanguage('hi');
          };
        } else {
          el.classList.add('cursor-pointer');
          el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            CareFlow.openLanguageMenu(el);
          };
        }
      }
    });
  }

  function init() {
    replaceLogos();
    injectFlowHUD();
    wireUniversalLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Backend binding layer — fills the static pages with live gateway data (see careflow-live.js).
  if (SELF_SRC) {
    const live = document.createElement('script');
    live.src = new URL('careflow-live.js', SELF_SRC).href;
    document.head.appendChild(live);
  }
})();
