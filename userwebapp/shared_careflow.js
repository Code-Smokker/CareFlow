/**
 * CareFlow Shared State & Navigation Manager
 * Handles persistent patient intake state, voice synthesis, toast feedback,
 * and page-to-page navigation with View Transitions.
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

  // Universal Responsive Layout Adaptor for Website & Phone App
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
        }

        /* Fluid Header on all devices */
        header.fixed {
          width: 100% !important;
          left: 0 !important;
          right: 0 !important;
          transform: none !important;
        }

        /* Normal Website Responsive Content Container */
        main {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        main > div {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        /* Mobile First (< 640px) */
        @media (max-width: 639px) {
          main > div > div, .px-margin-mobile {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }

        /* Tablet & Desktop (>= 640px) */
        @media (min-width: 640px) {
          main > div > div, .px-margin-mobile {
            width: 100% !important;
            max-width: 768px !important;
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
          /* 2-column options on desktop */
          #single-choice-group, .options-grid-responsive {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
          footer.fixed, div.fixed.bottom-0 {
            width: 100% !important;
            max-width: 768px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }

        /* Large Desktop (>= 1024px) */
        @media (min-width: 1024px) {
          main > div > div, .px-margin-mobile {
            max-width: 880px !important;
          }
          footer.fixed, div.fixed.bottom-0 {
            max-width: 880px !important;
          }
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

    // Dispatch custom event for embedders (like index.html container)
    window.dispatchEvent(new CustomEvent('careflow:navigate', {
      detail: { url, direction }
    }));

    // If running inside iframe in master runner, notify parent
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'careflow:navigating', url: url, direction: direction }, '*');
      }
    } catch(e) {}

    // Direct standalone page navigation
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
      if (typeof langOrOnEnd === 'string') {
        utterance.lang = (langOrOnEnd === 'hi') ? 'hi-IN' : 'en-US';
        if (typeof maybeOnEnd === 'function') onEnd = maybeOnEnd;
      } else if (typeof langOrOnEnd === 'function') {
        onEnd = langOrOnEnd;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (onEnd) utterance.onend = onEnd;
      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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

  // Backend API Client
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
    qrScanner
  };

})(window);
