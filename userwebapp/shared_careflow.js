/**
 * CareFlow Shared State & Navigation Manager
 * Handles persistent patient intake state, voice synthesis, toast feedback,
 * design token normalization, and page-to-page navigation with View Transitions.
 */
(function(window) {
  // Global font & ligature enforcer
  (function ensureMaterialSymbols() {
    if (!document.getElementById('careflow-symbols-style')) {
      const style = document.createElement('style');
      style.id = 'careflow-symbols-style';
      style.textContent = `
        @font-face {
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          font-weight: 100 700;
          font-display: block;
          src: url('../material-symbols-outlined.woff2') format('woff2'),
               url('/material-symbols-outlined.woff2') format('woff2'),
               url('https://fonts.gstatic.com/s/materialsymbolsoutlined/v373/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2') format('woff2');
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined' !important;
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -moz-font-feature-settings: 'liga';
          font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
          vertical-align: middle;
        }
      `;
      document.head.appendChild(style);
    }
  })();

  // Universal Responsive Layout & Design System Normalizer
  (function ensureResponsiveAdaptor() {
    if (window.location.pathname.endsWith('index.html') || (document.body && document.body.classList.contains('master-runner'))) return;
    if (!document.getElementById('careflow-responsive-style')) {
      const style = document.createElement('style');
      style.id = 'careflow-responsive-style';
      style.textContent = `
        /* Smooth full website base */
        html, body {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #FAF8FF !important;
          color: #0F1E36;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        /* Fluid Header on all devices */
        header.fixed, header.sticky {
          width: 100% !important;
          left: 0 !important;
          right: 0 !important;
          box-sizing: border-box;
        }

        /* Normal Website Responsive Content Container */
        main {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          box-sizing: border-box;
        }

        main > div, .careflow-main-container {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          box-sizing: border-box;
        }

        /* Mobile First (< 640px) */
        @media (max-width: 639px) {
          main > div > div, .px-margin-mobile, .careflow-content-bounds {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box;
          }
        }

        /* Tablet & Desktop (>= 640px) */
        @media (min-width: 640px) {
          main > div > div, .px-margin-mobile, .careflow-content-bounds {
            width: 100% !important;
            max-width: 720px !important;
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
            box-sizing: border-box;
          }
          /* 2-column options on desktop */
          #single-choice-group, .options-grid-responsive, .careflow-grid-responsive {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
          footer.fixed, div.fixed.bottom-0, .careflow-bottom-bar {
            width: 100% !important;
            max-width: 720px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }

        /* Large Desktop (>= 1024px) */
        @media (min-width: 1024px) {
          main > div > div, .px-margin-mobile, .careflow-content-bounds {
            max-width: 840px !important;
          }
          footer.fixed, div.fixed.bottom-0, .careflow-bottom-bar {
            max-width: 840px !important;
          }
        }

        /* Suppress artificial 9:41 mobile mockup status bars */
        [data-purpose="ios-status-bar"],
        .ios-status-bar,
        .fake-status-bar {
          display: none !important;
        }

        /* Safe area helpers */
        .pb-safe {
          padding-bottom: max(1rem, env(safe-area-inset-bottom, 0px));
        }
        .pt-safe {
          padding-top: max(0.5rem, env(safe-area-inset-top, 0px));
        }

        /* Normalized CareFlow interactive components */
        .careflow-card {
          background-color: #FFFFFF;
          border-radius: 1rem;
          border: 1px solid rgba(13, 110, 110, 0.08);
          box-shadow: 0 2px 8px -2px rgba(13, 110, 110, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
        }
        .careflow-card:hover {
          border-color: rgba(13, 110, 110, 0.2);
          box-shadow: 0 6px 16px -2px rgba(13, 110, 110, 0.08);
        }

        .careflow-btn-primary {
          background-color: #0D6E6E;
          color: #FFFFFF;
          border-radius: 9999px;
          height: 3rem;
          min-height: 48px;
          padding: 0 1.5rem;
          font-weight: 600;
          font-size: 0.9375rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(13, 110, 110, 0.2);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
          text-decoration: none;
        }
        .careflow-btn-primary:hover {
          background-color: #0A5656;
          box-shadow: 0 6px 18px rgba(13, 110, 110, 0.3);
          transform: translateY(-1px);
        }
        .careflow-btn-primary:active {
          transform: scale(0.98);
        }

        .careflow-btn-secondary {
          background-color: #F0FDFA;
          color: #0D6E6E;
          border-radius: 9999px;
          height: 3rem;
          min-height: 48px;
          padding: 0 1.5rem;
          font-weight: 600;
          font-size: 0.9375rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid rgba(20, 184, 166, 0.3);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .careflow-btn-secondary:hover {
          background-color: #E6F7F5;
          border-color: #14B8A6;
        }
        .careflow-btn-secondary:active {
          transform: scale(0.98);
        }

        /* Audio speak button active pulse */
        .careflow-audio-speaking {
          animation: careflow-pulse 1.4s infinite ease-in-out;
          border-color: #14B8A6 !important;
          background-color: #F0FDFA !important;
        }
        @keyframes careflow-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
          50% { transform: scale(1.03); box-shadow: 0 0 0 6px rgba(20, 184, 166, 0); }
        }
      `;
      document.head.appendChild(style);
    }
  })();

  const STORAGE_KEY = 'careflow_intake_state';

  const defaultState = {
    language: 'hi',
    languageName: 'हिन्दी',
    isAttendant: false,
    attendantName: '',
    attendantRole: 'ASHA Worker',
    consents: {
      healthInfo: true,
      voiceData: true,
      abdmShare: true
    },
    patient: {
      name: 'Ananya Sharma',
      age: 28,
      dob: '14/05/1996',
      gender: 'Female',
      phone: '98765 43210',
      abhaId: '91-2345-6789-0123'
    },
    chiefComplaint: 'Severe abdominal pain and fever since yesterday evening.',
    complaintMethod: 'voice',
    onset: '2–3 days ago',
    symptoms: ['High fever', 'Nausea/vomiting', 'Sharp pain in abdomen', 'Loss of appetite'],
    bodyArea: 'Left Mid-Chest',
    bodyAreaHindi: 'बाएं सीने में',
    painScore: 6,
    painLabel: 'Severe',
    duration: '2–3 days',
    ayushCompleted: 4,
    documents: [
      {
        name: 'Prescription_Sep2026.jpg',
        type: 'Prescription',
        doctor: 'Dr. Rajesh Mehta',
        date: '20 Sep 2026',
        medicines: ['Paracetamol 650mg', 'Pantoprazole 40mg', 'Domperidone 10mg']
      }
    ],
    redFlagAlert: false,
    tokenNumber: 'A-42',
    roomNumber: 'Room 04',
    doctorAssigned: 'Dr. Rajesh Mehta',
    estimatedWait: '12 mins'
  };

  function getState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('CareFlow: LocalStorage access error', e);
    }
    return Object.assign({}, defaultState);
  }

  function saveState(patch) {
    try {
      const current = getState();
      const updated = Object.assign({}, current, patch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch state update event for live UI synchronization
      window.dispatchEvent(new CustomEvent('careflow:state-updated', { detail: { state: updated, patch } }));
      return updated;
    } catch (e) {
      console.warn('CareFlow: Failed to save state', e);
      return getState();
    }
  }

  function resetState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return Object.assign({}, defaultState);
  }

  /**
   * Navigate to target relative URL with optional View Transition
   */
  function navigate(url, direction = 'forward') {
    if (!url) return;

    window.dispatchEvent(new CustomEvent('careflow:navigate', {
      detail: { url, direction }
    }));

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'careflow:navigating', url: url, direction: direction }, '*');
      }
    } catch(e) {}

    if (document.startViewTransition) {
      document.startViewTransition({
        update: () => {
          window.location.href = url;
        },
        types: [direction]
      });
    } else {
      window.location.href = url;
    }
  }

  /**
   * Browser Speech Synthesis Helper
   */
  let currentUtterance = null;
  function speak(text, langOrOnEnd, maybeOnEnd) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      let onEnd = null;
      const state = getState();
      let targetLang = (state && state.language === 'en') ? 'en-US' : 'hi-IN';

      if (typeof langOrOnEnd === 'string') {
        targetLang = (langOrOnEnd === 'hi') ? 'hi-IN' : (langOrOnEnd === 'en' ? 'en-US' : langOrOnEnd);
        if (typeof maybeOnEnd === 'function') onEnd = maybeOnEnd;
      } else if (typeof langOrOnEnd === 'function') {
        onEnd = langOrOnEnd;
      }

      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Update active audio buttons visually
      const audioPills = document.querySelectorAll('.careflow-audio-btn, #audioBtn, #voiceListenBtn, #hear-btn, #quickAudioBtn, #audioToggleBtn');
      audioPills.forEach(p => p.classList.add('careflow-audio-speaking'));

      utterance.onend = () => {
        audioPills.forEach(p => p.classList.remove('careflow-audio-speaking'));
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        audioPills.forEach(p => p.classList.remove('careflow-audio-speaking'));
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const audioPills = document.querySelectorAll('.careflow-audio-btn, #audioBtn, #voiceListenBtn, #hear-btn, #quickAudioBtn, #audioToggleBtn');
      audioPills.forEach(p => p.classList.remove('careflow-audio-speaking'));
    }
  }

  /**
   * Show a modern floating notification pill
   */
  function showToast(message, icon = 'info', duration = 2500) {
    let toast = document.getElementById('careflow-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'careflow-global-toast';
      toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-[#0F1E36] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none transform -translate-y-4';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="material-symbols-outlined text-[18px] text-[#2DD4BF]">${icon}</span><span>${message}</span>`;
    toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
    }, duration);
  }

  // Supported languages list
  const SUPPORTED_LANGUAGES = [
    { id: 'hi', name: 'हिन्दी', label: 'Hindi', sample: 'नमस्ते, आपको क्या तकलीफ है?' },
    { id: 'en', name: 'English', label: 'Indian English', sample: 'Hello, how can we help you today?' },
    { id: 'mr', name: 'मराठी', label: 'Marathi', sample: 'नमस्कार, तुम्हाला काय त्रास होत आहे?' },
    { id: 'gu', name: 'ગુજરાતી', label: 'Gujarati', sample: 'નમસ્તે, તમને શું તકલીફ છે?' },
    { id: 'ta', name: 'தமிழ்', label: 'Tamil', sample: 'வணக்கம், உங்களுக்கு என்ன பிரச்சனை?' },
    { id: 'te', name: 'తెలుగు', label: 'Telugu', sample: 'నమస్కారం, మీకు ఏమి ఇబ్బందిగా ఉంది?' }
  ];

  // UI Components & Standardized Renderers
  const ui = {
    SUPPORTED_LANGUAGES,

    /**
     * Standardized CareFlow Global Header
     */
    renderHeader({ backUrl = null, onBack = null, title = 'CareFlow', showLang = true, showProfile = true } = {}) {
      const state = getState();
      const currentLangName = state.languageName || 'हिन्दी';

      return `
        <header class="careflow-standard-header fixed top-0 inset-x-0 z-50 pt-safe bg-[#FAF8FF]/95 backdrop-blur-md border-b border-[#E2E8F0]/80 shadow-[0_1px_8px_rgba(13,110,110,0.04)]">
          <div class="h-16 px-4 md:px-6 max-w-4xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              ${backUrl || onBack ? `
                <button type="button" class="careflow-header-back w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F1E36] hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs cursor-pointer" aria-label="Go Back">
                  <span class="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
              ` : ''}
              <div class="flex items-center gap-2 select-none">
                <div class="w-9 h-9 rounded-xl bg-[#0D6E6E] flex items-center justify-center text-white shadow-sm">
                  <span class="material-symbols-outlined text-[20px]">volunteer_activism</span>
                </div>
                <span class="text-[19px] font-bold tracking-tight text-[#0F1E36]">Care<span class="text-[#0D6E6E]">Flow</span></span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              ${showLang ? `
                <button type="button" class="careflow-header-lang h-10 px-3 rounded-full bg-white border border-[#E2E8F0] text-[#0F1E36] text-[13px] font-medium flex items-center gap-1.5 hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs cursor-pointer" aria-label="Change Language">
                  <span class="material-symbols-outlined text-[17px] text-[#0D6E6E]">language</span>
                  <span class="careflow-lang-text font-semibold">${currentLangName}</span>
                  <span class="material-symbols-outlined text-[16px] text-[#64748B]">arrow_drop_down</span>
                </button>
              ` : ''}
              ${showProfile ? `
                <div class="w-9 h-9 rounded-full bg-[#0D6E6E] text-white flex items-center justify-center shadow-xs select-none" title="${state.patient?.name || 'Patient'}">
                  <span class="material-symbols-outlined text-[19px]">person</span>
                </div>
              ` : ''}
            </div>
          </div>
        </header>
      `;
    },

    /**
     * Standardized 5-Stage Journey Progress Stepper
     */
    renderStepper({ currentStep = 1, totalSteps = 5, stepTitle = 'Health Questions', stage = 'Basics', percent = 20 } = {}) {
      const stages = ['Basics', 'Symptoms', 'Documents', 'Review', 'Complete'];
      const stageIdx = stages.indexOf(stage) !== -1 ? stages.indexOf(stage) : (currentStep - 1);

      return `
        <div class="careflow-stepper w-full bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E8F0]/80 shadow-[0_2px_8px_-2px_rgba(13,110,110,0.04)] mb-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-[#E6F7F5] text-[#0D6E6E] text-[11px] font-bold tracking-wider uppercase border border-[#99F6E4]/50">
                Step ${currentStep} of ${totalSteps}
              </span>
              <span class="text-[12px] font-semibold text-[#0F1E36]">${stepTitle}</span>
            </div>
            <span class="text-[11px] font-bold text-[#0D6E6E]">${percent}% Complete</span>
          </div>

          <div class="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden mb-2.5">
            <div class="h-full bg-[#0D6E6E] rounded-full transition-all duration-500 ease-out" style="width: ${percent}%;"></div>
          </div>

          <div class="flex items-center justify-between text-[11px] font-medium text-[#64748B] pt-0.5 px-0.5 overflow-x-auto no-scrollbar gap-1">
            ${stages.map((st, i) => {
              if (i < stageIdx) {
                return `<span class="text-[#0D6E6E] font-semibold flex items-center gap-0.5 whitespace-nowrap"><span class="material-symbols-outlined text-[12px]">check</span>${st}</span>`;
              } else if (i === stageIdx) {
                return `<span class="text-[#0D6E6E] font-bold flex items-center gap-1 whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full bg-[#0D6E6E] inline-block"></span>${st}</span>`;
              } else {
                return `<span class="text-[#94A3B8] whitespace-nowrap">${st}</span>`;
              }
            }).join('')}
          </div>
        </div>
      `;
    },

    /**
     * Standardized Audio Speech Listen Pill
     */
    renderAudioPill({ text = '', labelEn = 'Hear', labelHi = 'सुनें', id = 'careflow-audio-btn' } = {}) {
      return `
        <button type="button" id="${id}" class="careflow-audio-btn shrink-0 h-9 px-3.5 rounded-full bg-[#F0FDFA] hover:bg-[#E6F7F5] border border-[#99F6E4]/60 text-[#0D6E6E] text-[12px] font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer select-none" data-speak-text="${text.replace(/"/g, '&quot;')}">
          <span class="material-symbols-outlined text-[17px] text-[#0D6E6E]">volume_up</span>
          <span>${labelEn} / ${labelHi}</span>
        </button>
      `;
    },

    /**
     * Standardized Bottom Action Bar (Fixed / Sticky with Safe Area)
     */
    renderBottomBar({ primaryText = 'Continue', primaryIcon = 'arrow_forward', onPrimary = null, secondaryText = null, onSecondary = null, secureText = 'Private & Secure • ABDM Compliant' } = {}) {
      return `
        <div class="careflow-bottom-bar fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-[#FAF8FF] via-[#FAF8FF]/95 to-transparent pt-3 pb-safe px-4 shadow-[0_-4px_16px_rgba(15,30,54,0.04)]">
          <div class="max-w-4xl mx-auto flex flex-col gap-2">
            <div class="flex items-center gap-3">
              ${secondaryText ? `
                <button type="button" class="careflow-bottom-secondary flex-1 careflow-btn-secondary" id="careflow-bottom-sec-btn">
                  ${secondaryText}
                </button>
              ` : ''}
              <button type="button" class="careflow-bottom-primary flex-1 careflow-btn-primary" id="careflow-bottom-pri-btn">
                <span>${primaryText}</span>
                ${primaryIcon ? `<span class="material-symbols-outlined text-[20px]">${primaryIcon}</span>` : ''}
              </button>
            </div>
            <div class="flex items-center justify-center gap-1.5 text-[#64748B] text-[11px] font-medium py-1 select-none">
              <span class="material-symbols-outlined text-[14px] text-[#0D6E6E]">lock</span>
              <span>${secureText}</span>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Interactive Language Switcher Modal
     */
    openLanguageModal() {
      let modal = document.getElementById('careflow-lang-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'careflow-lang-modal';
        modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 opacity-0 pointer-events-none';
        modal.innerHTML = `
          <div class="careflow-lang-modal-card w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 transform transition-transform duration-200 scale-95">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-[#E6F7F5] flex items-center justify-center text-[#0D6E6E]">
                  <span class="material-symbols-outlined text-[18px]">language</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#0F1E36]">Select Language</h3>
                  <p class="text-xs text-[#64748B]">अपनी पसंदीदा भाषा चुनें</p>
                </div>
              </div>
              <button type="button" class="careflow-modal-close w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-95 transition-all">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              ${SUPPORTED_LANGUAGES.map(lang => `
                <button type="button" class="careflow-lang-choice-btn p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer" data-lang-id="${lang.id}" data-lang-name="${lang.name}">
                  <div>
                    <div class="text-sm font-bold text-[#0F1E36]">${lang.name}</div>
                    <div class="text-xs text-[#64748B]">${lang.label}</div>
                  </div>
                  <span class="material-symbols-outlined text-[18px] check-icon text-[#0D6E6E] opacity-0">check_circle</span>
                </button>
              `).join('')}
            </div>

            <div class="pt-2 text-center">
              <p class="text-[11px] text-[#64748B]">Speech and transcripts automatically adapt to your chosen language.</p>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.careflow-modal-close').addEventListener('click', () => ui.closeLanguageModal());
        modal.addEventListener('click', (e) => {
          if (e.target === modal) ui.closeLanguageModal();
        });

        modal.querySelectorAll('.careflow-lang-choice-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const lId = btn.getAttribute('data-lang-id');
            const lName = btn.getAttribute('data-lang-name');
            saveState({ language: lId, languageName: lName });
            showToast(`Language set to ${lName}`, 'check_circle');
            ui.closeLanguageModal();
            // Sync all language displays on the page
            document.querySelectorAll('.careflow-lang-text').forEach(t => t.textContent = lName);
            window.dispatchEvent(new CustomEvent('careflow:language-changed', { detail: { language: lId, languageName: lName } }));
          });
        });
      }

      // Refresh checked state
      const currentLang = getState().language || 'hi';
      modal.querySelectorAll('.careflow-lang-choice-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-lang-id') === currentLang;
        btn.className = `careflow-lang-choice-btn p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${
          isMatch ? 'bg-[#F0FDFA] border-[#0D6E6E] text-[#0D6E6E]' : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
        }`;
        const check = btn.querySelector('.check-icon');
        if (check) check.style.opacity = isMatch ? '1' : '0';
      });

      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      const card = modal.querySelector('.careflow-lang-modal-card');
      if (card) {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
      }
    },

    closeLanguageModal() {
      const modal = document.getElementById('careflow-lang-modal');
      if (!modal) return;
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0', 'pointer-events-none');
      const card = modal.querySelector('.careflow-lang-modal-card');
      if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
      }
    },

    /**
     * Automatic initializer for elements on current screen
     */
    initCommon() {
      // Remove simulated 9:41 status bars
      document.querySelectorAll('[data-purpose="ios-status-bar"], .ios-status-bar, header:has(span:first-child:contains("9:41"))').forEach(el => el.remove());

      // Bind all language triggers
      document.querySelectorAll('.careflow-header-lang, button:has(span:contains("language"))').forEach(btn => {
        if (!btn._careflowBound) {
          btn._careflowBound = true;
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            ui.openLanguageModal();
          });
        }
      });

      // Bind all audio triggers
      document.querySelectorAll('.careflow-audio-btn, [data-speak-text]').forEach(btn => {
        if (!btn._careflowBound) {
          btn._careflowBound = true;
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = btn.getAttribute('data-speak-text') || btn.textContent;
            speak(text);
          });
        }
      });
    }
  };

  // Run initializer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ui.initCommon());
  } else {
    setTimeout(() => ui.initCommon(), 50);
  }

  // Backend API Client (with offline demo resilience)
  const API_BASE = 'http://localhost:4000/v1';

  const api = {
    BASE_URL: API_BASE,

    async createSession(department = 'general') {
      try {
        const res = await fetch(`${API_BASE}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        saveState({
          sessionId: data.session_id,
          resumeToken: data.resume_token,
          tokenNumber: data.token_no || ('TK-' + Math.floor(1000 + Math.random() * 9000)),
          department: data.department || department,
          expiresAt: data.expires_at
        });
        return data;
      } catch (e) {
        console.warn('CareFlow API: createSession fallback', e);
        const fallbackToken = 'TK-' + Math.floor(1000 + Math.random() * 9000);
        const fallbackSession = 'local-' + Date.now();
        saveState({
          sessionId: fallbackSession,
          tokenNumber: fallbackToken,
          department: department
        });
        return { session_id: fallbackSession, token_no: fallbackToken };
      }
    },

    async getSession(sessionId) {
      if (!sessionId || sessionId.startsWith('local-')) return null;
      try {
        const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: getSession error', e);
        return null;
      }
    },

    async setLanguage(sessionId, language) {
      saveState({ language });
      if (!sessionId || sessionId.startsWith('local-')) return;
      try {
        await fetch(`${API_BASE}/sessions/${sessionId}/language`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language })
        });
      } catch (e) {
        console.warn('CareFlow API: setLanguage error', e);
      }
    },

    async recordConsent(sessionId, scopes = ['history', 'audio_recording', 'documents', 'abha_lookup']) {
      saveState({ consents: { healthInfo: true, voiceData: true, abdmShare: true } });
      if (!sessionId || sessionId.startsWith('local-')) return;
      try {
        const validScopes = ['history', 'audio_recording', 'documents', 'abha_lookup', 'research_deidentified'];
        const filteredScopes = scopes.filter(s => validScopes.includes(s));
        const payloadScopes = filteredScopes.length > 0 ? filteredScopes : ['history', 'audio_recording', 'documents'];

        await fetch(`${API_BASE}/sessions/${sessionId}/consent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scopes: payloadScopes })
        });
      } catch (e) {
        console.warn('CareFlow API: recordConsent error', e);
      }
    },

    async identifyByQr(qrPayload) {
      try {
        const res = await fetch(`${API_BASE}/identity/abha/qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qr_payload: qrPayload })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const demo = data.demographics || {};
        saveState({
          patientId: data.patient_id,
          patient: {
            name: demo.name || 'Demo Patient',
            age: demo.age || 32,
            gender: demo.sex || 'female',
            phone: demo.phone || '98765 43210',
            abhaId: demo.abha_address || 'demo@abdm'
          },
          abhaId: demo.abha_address || 'demo@abdm'
        });
        return data;
      } catch (e) {
        console.warn('CareFlow API: identifyByQr error, using fallback demographics', e);
        const mockData = {
          patient_id: 'mock-patient-' + Date.now(),
          demographics: {
            name: 'Ananya Sharma',
            age: 28,
            sex: 'female',
            phone: '98765 43210',
            abha_address: '91-4920-8472-1029@abdm'
          }
        };
        saveState({
          patientId: mockData.patient_id,
          patient: {
            name: mockData.demographics.name,
            age: mockData.demographics.age,
            gender: mockData.demographics.sex,
            phone: mockData.demographics.phone,
            abhaId: mockData.demographics.abha_address
          },
          abhaId: mockData.demographics.abha_address
        });
        return mockData;
      }
    },

    async requestOtp(input) {
      try {
        const res = await fetch(`${API_BASE}/identity/abha/otp/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: requestOtp fallback', e);
        return { txn_id: 'mock-txn-' + Date.now() };
      }
    },

    async verifyOtp(txnId, otp = '000000') {
      try {
        const res = await fetch(`${API_BASE}/identity/abha/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txn_id: txnId, otp: otp || '000000' })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: verifyOtp fallback', e);
        return { patient_id: 'mock-patient-otp', token: 'mock-token' };
      }
    },

    async submitAnswer(sessionId, slot, value, source = 'tap') {
      const statePatch = {};
      statePatch[slot] = value;
      saveState(statePatch);

      if (!sessionId || sessionId.startsWith('local-')) return { ok: true };
      try {
        const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ('key-' + Date.now());
        const validModes = ['voice', 'tap', 'bodymap', 'proxy', 'ocr'];
        const inputMode = validModes.includes(source) ? source : 'tap';

        const res = await fetch(`${API_BASE}/sessions/${sessionId}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey
          },
          body: JSON.stringify({
            slot_id: slot,
            value: value,
            input_mode: inputMode
          })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: submitAnswer fallback', e);
        return { ok: true };
      }
    },

    async uploadDocument(sessionId, file, docTypeHint = 'prescription') {
      if (!sessionId || sessionId.startsWith('local-')) {
        return { document_id: 'mock-doc-' + Date.now(), status: 'uploaded' };
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (docTypeHint) formData.append('doc_type_hint', docTypeHint);

        const res = await fetch(`${API_BASE}/sessions/${sessionId}/documents`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: uploadDocument fallback', e);
        return { document_id: 'mock-doc-' + Date.now(), status: 'uploaded' };
      }
    },

    async completeSession(sessionId) {
      if (!sessionId || sessionId.startsWith('local-')) {
        return { status: 'completed' };
      }
      try {
        const res = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
          method: 'POST'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn('CareFlow API: completeSession fallback', e);
        return { status: 'completed' };
      }
    }
  };

  // Universal QR Scanner Engine
  const qrScanner = {
    isSupported() {
      return (typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia);
    },

    async startScanner({ videoElement, onDecode, onError }) {
      if (!videoElement) return null;
      let stream = null;
      let animId = null;
      let active = true;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        videoElement.srcObject = stream;
        videoElement.setAttribute('playsinline', 'true');
        await videoElement.play();

        let barcodeDetector = null;
        if ('BarcodeDetector' in window) {
          try {
            barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          } catch(e) {}
        }

        const scanFrame = async () => {
          if (!active) return;
          if (videoElement.readyState >= 2) {
            if (barcodeDetector) {
              try {
                const barcodes = await barcodeDetector.detect(videoElement);
                if (barcodes.length > 0 && barcodes[0].rawValue) {
                  const raw = barcodes[0].rawValue;
                  active = false;
                  stop();
                  onDecode(raw);
                  return;
                }
              } catch(e) {}
            }
          }
          if (active) {
            animId = requestAnimationFrame(scanFrame);
          }
        };
        animId = requestAnimationFrame(scanFrame);
      } catch (err) {
        console.warn('Camera access error:', err);
        if (typeof onError === 'function') onError(err);
      }

      function stop() {
        active = false;
        if (animId) cancelAnimationFrame(animId);
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
        }
        if (videoElement) {
          videoElement.srcObject = null;
        }
      }

      return { stop };
    },

    async scanImageFile(file, onDecode, onError) {
      if (!file) return;
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });

        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const codes = await detector.detect(img);
          if (codes.length > 0 && codes[0].rawValue) {
            onDecode(codes[0].rawValue);
            return;
          }
        }
        onDecode('ABHA:91-4920-8472-1029|Name:Ananya Sharma|DOB:1996-05-14|Gender:F');
      } catch (err) {
        if (typeof onError === 'function') onError(err);
      }
    }
  };

  // Expose CareFlow globally
  window.CareFlow = {
    getState,
    saveState,
    resetState,
    navigate,
    speak,
    stopSpeaking,
    showToast,
    defaultState,
    api,
    qrScanner,
    ui
  };

})(window);
