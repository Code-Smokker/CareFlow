/**
 * CareFlow patient app — live binding layer.
 *
 * The screens in this folder are the design. This file makes them real without changing how they look: it takes the
 * session the token-slip QR opened, asks the GATEWAY what to ask next (question order, completeness and red flags are
 * server-side — this file never decides them), fills the existing markup with that question, and posts the answer back.
 *
 *   /s/<id>?token=…  →  landing (adopts the session)  →  language  →  consent  →  ABHA (optional)  →  who answers
 *   →  chief complaint  →  one screen per question kind (single · multi · body map · face scale · duration)
 *   →  red flag (only if a rule fires)  →  documents  →  read-back  →  done
 *
 * Every question has a voice path AND a tap path (CLAUDE.md rule 6). Voice = record → gateway (Sarvam ASR) → ai
 * /fill-slot → the matching option is SELECTED for the patient to confirm; a spoken answer is never submitted silently.
 * The microphone needs HTTPS or localhost — on plain http the tap options are simply all there is.
 *
 * No key of any kind lives in this folder: the browser only ever talks to its own origin (/api/v1 → gateway).
 */
(function () {
  'use strict';

  var BASE = '/api/v1';
  var KEY = 'cfl.session.v1';
  var PAGE = (location.pathname.match(/careflow_([a-z0-9_]+)\//) || [])[1] || '';
  var FILES = {
    landing: 'qr_welcome_landing', language: 'language_selection', consent: 'patient_consent',
    abha: 'abha_qr_identity', abhaOtp: 'abha_otp_identity', attendant: 'attendant_mode_standardized',
    complaint: 'chief_complaint_standardized', single: 'question_09_single_choice',
    multi: 'question_10_multi_select_standardized', body: 'question_11_body_map',
    face: 'question_12_face_scale_pain_severity', duration: 'question_13_duration',
    redflag: 'red_flag_instruction', docs: 'document_capture', tray: 'document_tray_processing',
    review: 'document_review_extraction', readback: 'read_back_summary', done: 'session_complete',
  };
  var PAGE_KEY = Object.keys(FILES).filter(function (k) { return FILES[k] === PAGE; })[0] || '';
  var GATES = ['language', 'consent', 'abha', 'attendant'];
  var LANG_TAG = { hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', gu: 'gu-IN', ta: 'ta-IN', te: 'te-IN' };
  var BODY_REGIONS = [
    { id: 'jaw', en: 'Jaw', hi: 'जबड़ा', x: 30, y: 16 },
    { id: 'neck', en: 'Neck', hi: 'गला', x: 30, y: 21 },
    { id: 'right_chest', en: 'Right chest', hi: 'दायाँ सीना', x: 25, y: 29 },
    { id: 'central_chest', en: 'Centre of chest', hi: 'सीने के बीच', x: 30, y: 29 },
    { id: 'left_chest', en: 'Left chest', hi: 'बायाँ सीना', x: 35, y: 29 },
    { id: 'right_arm', en: 'Right arm', hi: 'दायाँ हाथ', x: 18, y: 37 },
    { id: 'left_arm', en: 'Left arm', hi: 'बायाँ हाथ', x: 42, y: 37 },
    { id: 'epigastric', en: 'Upper stomach', hi: 'पेट का ऊपरी हिस्सा', x: 30, y: 38 },
    { id: 'right_upper_quadrant', en: 'Right side, upper stomach', hi: 'दायाँ ऊपरी पेट', x: 24, y: 42 },
    { id: 'left_upper_quadrant', en: 'Left side, upper stomach', hi: 'बायाँ ऊपरी पेट', x: 36, y: 42 },
    { id: 'generalised', en: 'All over the stomach', hi: 'पूरा पेट', x: 30, y: 47 },
    { id: 'lower_back', en: 'Lower back', hi: 'कमर', x: 70, y: 44 },
    { id: 'hands', en: 'Hands', hi: 'हाथ', x: 18, y: 55 },
    { id: 'knees', en: 'Knees', hi: 'घुटने', x: 30, y: 72 },
    { id: 'right_knee', en: 'Right knee', hi: 'दायाँ घुटना', x: 26, y: 72 },
    { id: 'left_ankle', en: 'Left ankle', hi: 'बायाँ टखना', x: 34, y: 92 },
  ];
  // "Does it spread?" needs an answer for "no", and the rules read `both_arms` — neither is a place on the figure.
  var RADIATION_EXTRAS = [
    { id: 'both_arms', en: 'Both arms', hi: 'दोनों हाथ', x: null, y: null },
    { id: 'none', en: 'Nowhere — it stays in one place', hi: 'कहीं नहीं — एक ही जगह रहता है', x: null, y: null },
  ];
  var DURATIONS = [
    { value: 'today', en: 'Today', hi: 'आज', icon: 'wb_twilight' },
    { value: '2_days', en: '2 days', hi: '2 दिन', icon: 'today' },
    { value: '1_week', en: 'A week', hi: 'एक सप्ताह', icon: 'date_range' },
    { value: '1_month', en: 'A month', hi: 'एक महीना', icon: 'calendar_month' },
    { value: 'longer', en: 'Longer', hi: 'इससे अधिक', icon: 'update' },
  ];
  // The chief-complaint question is the one the gateway does not send (it starts the interview). Options are the modules.
  var COMPLAINT = {
    slot_id: 'chief_complaint',
    text: { en: 'What brings you in today?', hi: 'आज आप किस तकलीफ़ के लिए आए हैं?' },
    options: [
      { value: 'chest_pain', en: 'Chest pain', hi: 'सीने में दर्द', icon: 'cardiology' },
      { value: 'fever', en: 'Fever', hi: 'बुखार', icon: 'thermostat' },
      { value: 'cough_breathlessness', en: 'Cough or breathlessness', hi: 'खाँसी या साँस फूलना', icon: 'pulmonology' },
      { value: 'abdominal_pain', en: 'Stomach pain', hi: 'पेट दर्द', icon: 'sick' },
      { value: 'joint_pain', en: 'Joint pain', hi: 'जोड़ों का दर्द', icon: 'orthopedics' },
      { value: 'generic', en: 'Something else', hi: 'कुछ और', icon: 'help' },
    ],
  };

  var TEXT = {
    en: {
      withdraw: 'Withdraw my consent', withdrawTitle: 'Delete everything you told us?',
      withdrawBody: 'This stops the check-in and deletes your answers and any recording. You can start again at the desk.',
      withdrawYes: 'Yes, delete it', withdrawNo: 'No, keep going',
      expired: ['This token has expired', 'Please ask the desk for a new one — it only takes a moment.'],
      withdrawn: ['Your information has been deleted', 'You can leave now. If you would like to start again, the desk can help.'],
      finished: ['You have already finished', 'Please wait to be called. Your doctor already has everything you told us.'],
      noSession: ['Please scan the QR code on your token slip', 'That is how we know which visit is yours. The desk can print a new slip.'],
      notSlip: 'That QR code is not a CareFlow token slip. Please scan the one printed on your slip.',
      listening: 'Listening… speak now', thinking: 'Understanding you…', unclear: 'I did not catch that. Please tap an answer, or try speaking again.',
      unavailable: 'The microphone is not available here. Please tap an answer instead.', heard: 'You said',
      choose: 'Please choose an answer to continue.', edit: 'Changing your answer', cancelEdit: 'Cancel',
      answers: 'Your answers — tap one to change it', question: 'Question', done: 'complete',
      none: 'None of these', skipAbha: 'Skip — I do not have ABHA', tapBody: 'Tap the body, or choose below',
      tapFace: 'Tap a face', mockAbha: 'ABDM sandbox is not connected — this uses the local mock registry.',
      voiceShare: 'Share my voice recording with the doctor',
      voiceShareBody: 'So the doctor can hear your own words. Off unless you turn it on. Deleted after the doctor signs, or within 24 hours.',
      voiceShareTag: 'Optional', tapWhat: 'Or tap what fits best',
    },
    hi: {
      withdraw: 'मेरी सहमति वापस लें', withdrawTitle: 'आपने जो बताया, वह सब मिटा दें?',
      withdrawBody: 'इससे चेक-इन रुक जाएगा और आपके उत्तर तथा कोई भी रिकॉर्डिंग मिट जाएगी। आप डेस्क पर दोबारा शुरू कर सकते हैं।',
      withdrawYes: 'हाँ, मिटा दें', withdrawNo: 'नहीं, जारी रखें',
      expired: ['इस टोकन की अवधि समाप्त हो गई है', 'कृपया डेस्क से नया टोकन माँग लें — इसमें बस एक पल लगेगा।'],
      withdrawn: ['आपकी जानकारी मिटा दी गई है', 'अब आप जा सकते हैं। दोबारा शुरू करना चाहें तो डेस्क आपकी मदद करेगा।'],
      finished: ['आप पहले ही पूरा कर चुके हैं', 'कृपया बुलाए जाने का इंतज़ार करें। आपने जो बताया वह डॉक्टर के पास है।'],
      noSession: ['कृपया अपनी टोकन पर्ची का QR स्कैन करें', 'इसी से हमें पता चलता है कि आपकी विज़िट कौन-सी है। डेस्क नई पर्ची छाप देगा।'],
      notSlip: 'यह QR कोड CareFlow की टोकन पर्ची का नहीं है। कृपया पर्ची पर छपा QR स्कैन करें।',
      listening: 'सुन रहे हैं… बोलिए', thinking: 'समझ रहे हैं…', unclear: 'मैं समझ नहीं पाया। कृपया कोई उत्तर चुनें, या दोबारा बोलें।',
      unavailable: 'यहाँ माइक्रोफ़ोन उपलब्ध नहीं है। कृपया कोई उत्तर चुनें।', heard: 'आपने कहा',
      choose: 'आगे बढ़ने के लिए कृपया एक उत्तर चुनें।', edit: 'उत्तर बदल रहे हैं', cancelEdit: 'रद्द करें',
      answers: 'आपके उत्तर — बदलने के लिए किसी पर टैप करें', question: 'प्रश्न', done: 'पूरा',
      none: 'इनमें से कोई नहीं', skipAbha: 'छोड़ें — मेरे पास ABHA नहीं है', tapBody: 'शरीर पर टैप करें, या नीचे चुनें',
      tapFace: 'कोई चेहरा चुनें', mockAbha: 'ABDM सैंडबॉक्स जुड़ा नहीं है — यह स्थानीय मॉक रजिस्ट्री का उपयोग करता है।',
      voiceShare: 'मेरी आवाज़ की रिकॉर्डिंग डॉक्टर के साथ साझा करें',
      voiceShareBody: 'ताकि डॉक्टर आपके अपने शब्द सुन सकें। जब तक आप चालू न करें, बंद रहता है। डॉक्टर के हस्ताक्षर के बाद, या 24 घंटे में, मिटा दी जाती है।',
      voiceShareTag: 'वैकल्पिक', tapWhat: 'या जो सबसे ठीक बैठे, उस पर टैप करें',
    },
  };

  // The shared responsive stylesheet forces `display:flex` on anything with `justify-between`, which defeats `.hidden` on this banner.
  (function () { var st = document.createElement('style'); st.textContent = '#scan-toast.hidden{display:none!important}'; (document.head || document.documentElement).appendChild(st); })();

  // ── small helpers ────────────────────────────────────────────────────────────────────────────────────────────────
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pick(o) { return o[ctx.lang === 'hi' ? 'hi' : 'en'] || o.en; }
  function t(k) { return (TEXT[ctx.lang === 'hi' ? 'hi' : 'en'] || TEXT.en)[k]; }
  function toast(msg, icon) { if (window.CareFlow && CareFlow.showToast) CareFlow.showToast(msg, icon || 'info', 3200); }
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  function delegate(type, sel, fn) {
    // Capture-phase on document: runs before the screen's own (mock) handler, which we then stop.
    document.addEventListener(type, function (e) {
      var target = e.target && e.target.closest ? e.target.closest(sel) : null;
      if (target) { e.stopImmediatePropagation(); e.preventDefault(); fn(target, e); }
    }, true);
  }

  // ── session context (per tab; a shared kiosk forgets the patient when the tab closes) ────────────────────────────
  var ctx = { sid: null, token: null, lang: 'hi', next: null, answered: [], progress: 0, redFlags: [], gates: {}, editing: null, tokenNo: null, hospital: 'CareFlow OPD', status: null, isProxy: false, docs: [] };
  try { var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (saved && saved.sid) ctx = Object.assign(ctx, saved); } catch (e) { /* private mode: state lives for this page only */ }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(ctx)); } catch (e) { /* ignore */ } }

  // The screens still carry the design's sample patient. Blank it so nothing on screen is invented.
  if (window.CareFlow && CareFlow.defaultState) {
    Object.assign(CareFlow.defaultState, {
      patient: { name: '', age: '', dob: '', gender: '', phone: '', abhaId: '' }, chiefComplaint: '', symptoms: [], documents: [],
      bodyArea: '', bodyAreaHindi: '', duration: '', onset: '', painScore: undefined, painLabel: '', tokenNumber: '', roomNumber: '', doctorAssigned: '', estimatedWait: '',
    });
  }

  function api(method, path, body, opt) {
    opt = opt || {};
    var ctl = new AbortController();
    var timer = opt.timeout ? setTimeout(function () { ctl.abort(); }, opt.timeout) : null;
    var headers = Object.assign({}, opt.headers || {});
    var isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    if (body && !isForm) headers['Content-Type'] = 'application/json';
    return fetch(BASE + path, { method: method, headers: headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined, signal: ctl.signal })
      .then(function (res) {
        return res.text().then(function (txt) {
          var data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
          if (!res.ok) {
            var err = new Error((data && data.error && data.error.message) || 'Something went wrong. Please try again, or ask a nurse for help.');
            err.status = res.status; err.code = data && data.error && data.error.code; throw err;
          }
          return data;
        });
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  // ── navigation ──────────────────────────────────────────────────────────────────────────────────────────────────
  function urlFor(key) { return '../careflow_' + FILES[key] + '/code.html'; }
  function go(key) {
    var url = urlFor(key);
    if (window.CareFlow && CareFlow.navigate) CareFlow.navigate(url, 'forward'); else location.href = url;
  }
  function kindOf(q) {
    var m = (q && q.input_modes) || [];
    if (m.indexOf('bodymap') >= 0) return 'body';
    if (m.indexOf('facescale') >= 0) return 'face';
    if (m.indexOf('duration') >= 0) return 'duration';
    if (m.indexOf('multi') >= 0) return 'multi';
    return 'single';
  }
  function routeKey() {
    if (ctx.next) return kindOf(ctx.next);
    return ctx.answered.length ? 'docs' : 'complaint';
  }
  function advance() {
    for (var i = 0; i < GATES.length; i++) if (!ctx.gates[GATES[i]]) return go(GATES[i]);
    if (ctx.redFlags.length) return go('redflag');
    return go(routeKey());
  }
  // Back = where the patient just was (the flow is server-driven, so a fixed "previous screen" would lie).
  if (window.CareFlow && CareFlow.navigate) {
    var origNav = CareFlow.navigate;
    CareFlow.navigate = function (url, dir) {
      if (dir === 'backward' && history.length > 1) return history.back();
      return origNav.call(CareFlow, url, dir);
    };
  }

  // ── session lifecycle ───────────────────────────────────────────────────────────────────────────────────────────
  function parseSlip(raw) {
    try {
      var u = new URL(String(raw).trim(), location.href);
      var m = u.pathname.match(/\/s\/([0-9a-f-]{36})\/?$/i);
      var token = u.searchParams.get('token');
      if (m && token) return { sid: m[1], token: token };
      var s = u.searchParams.get('s');
      if (s && token) return { sid: s, token: token };
    } catch (e) { /* not a URL */ }
    return null;
  }
  function adopt(slip) {
    if (ctx.sid !== slip.sid) ctx = Object.assign({}, ctx, { sid: slip.sid, next: null, answered: [], progress: 0, redFlags: [], gates: {}, editing: null, tokenNo: null, status: null, isProxy: false, docs: [] });
    ctx.token = slip.token; save();
    try { localStorage.removeItem('careflow_intake_state'); } catch (e) { /* ignore */ } // the design's sample patient must not outlive a real one
  }
  function applyView(v) {
    ctx.status = v.status;
    if (v.language) ctx.lang = v.language;
    ctx.progress = (v.progress && v.progress.percent) || 0;
    ctx.tokenNo = v.token_no || ctx.tokenNo;
    ctx.hospital = v.hospital_name || ctx.hospital;
    ctx.answered = (v.answered || []).map(function (a) {
      return { slot_id: a.slot_id, question: a.question, value: a.value, value_label: a.value_label, input_mode: a.input_mode, confidence: a.confidence, editable: a.editable };
    });
    ctx.next = v.next_question && v.next_question.slot_id ? v.next_question : null;
    // The server knows whether the language and consent were given; a part-way patient is past every gate.
    if (v.language) ctx.gates.language = true;
    if ((v.consent_scopes || []).length) ctx.gates.consent = true;
    if (ctx.answered.length) GATES.forEach(function (g) { ctx.gates[g] = true; });
    save();
  }
  function resume() {
    return api('POST', '/sessions/' + ctx.sid + '/resume', { resume_token: ctx.token }).then(function (v) { applyView(v); return v; });
  }
  function ended(reason) {
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    var msg = t(reason) || t('expired');
    var icon = { expired: 'schedule', withdrawn: 'delete', finished: 'task_alt', noSession: 'qr_code_scanner' }[reason] || 'info';
    document.body.innerHTML = '';
    var box = el('div', 'min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#FAF8FF]',
      '<span class="material-symbols-outlined text-[56px] text-[#0D6E6E]">' + icon + '</span>' +
      '<h1 class="text-2xl font-bold text-[#0F1E36]">' + esc(msg[0]) + '</h1><p class="text-base text-[#4A5B73] max-w-sm">' + esc(msg[1]) + '</p>');
    document.body.appendChild(box);
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }
  function fail(e) {
    if (e && e.status === 410) return ended('expired');
    if (e && (e.status === 401 || e.status === 404)) return ended('noSession');
    toast((e && e.message) || 'Something went wrong. Please try again.', 'error');
  }
  function requireSession() {
    if (!ctx.sid || !ctx.token) { ended('noSession'); return false; }
    if (ctx.status === 'completed' && PAGE_KEY !== 'done') { ended('finished'); return false; }
    return true;
  }

  // ── speech out ──────────────────────────────────────────────────────────────────────────────────────────────────
  function say(text) {
    try {
      if (!text || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = LANG_TAG[ctx.lang] || 'en-IN'; u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) { /* the speaker button is still there */ }
  }

  // ── speech in: MediaRecorder + voice-activity detection → gateway (Sarvam ASR) → ai /fill-slot ──────────────────
  var Voice = (function () {
    var SILENCE_MS = 1400, MAX_MS = 20000, TRANSCRIBE_MS = 5000, SPEECH_RMS = 0.035, MIN_CONF = 0.4;
    var rec = null, chunks = [], raf = 0, maxT = 0, audioCtx = null, stream = null;
    function supported() { return window.isSecureContext && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof MediaRecorder !== 'undefined'; }
    function mime() { var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']; for (var i = 0; i < c.length; i++) if (MediaRecorder.isTypeSupported(c[i])) return c[i]; return ''; }
    function cleanup() { cancelAnimationFrame(raf); clearTimeout(maxT); try { if (audioCtx) audioCtx.close(); } catch (e) { /* ignore */ } audioCtx = null; }
    function start(onAutoStop, onLevel) {
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (s) {
        stream = s; var m = mime();
        rec = new MediaRecorder(s, m ? { mimeType: m } : undefined); chunks = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        rec.start();
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var an = audioCtx.createAnalyser(); an.fftSize = 512; audioCtx.createMediaStreamSource(s).connect(an);
        var buf = new Float32Array(an.fftSize), heard = false, last = performance.now(), fired = false;
        function tick(now) {
          an.getFloatTimeDomainData(buf);
          var sum = 0; for (var i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
          var rms = Math.sqrt(sum / buf.length);
          if (rms > SPEECH_RMS) { heard = true; last = now; }
          if (onLevel) onLevel(Math.min(1, rms * 8));
          if (!fired && heard && now - last > SILENCE_MS) { fired = true; onAutoStop(); return; }
          raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        maxT = setTimeout(function () { if (!fired) { fired = true; onAutoStop(); } }, MAX_MS);
      });
    }
    function stop() {
      cleanup();
      return new Promise(function (resolve) {
        if (!rec) return resolve(null);
        var r = rec; rec = null;
        r.onstop = function () { resolve(new Blob(chunks, { type: r.mimeType || 'audio/webm' })); };
        try { if (r.state !== 'inactive') r.stop(); } catch (e) { resolve(null); }
        try { stream.getTracks().forEach(function (tr) { tr.stop(); }); } catch (e) { /* ignore */ }
      });
    }
    /** Records → transcribes (gateway; kept only with the patient's "share voice" consent) → fits it to the slot. */
    function process(blob, schema, context) {
      if (!blob || blob.size < 800) return Promise.resolve(null);
      var form = new FormData(); form.append('audio', blob, 'clip'); form.append('language', ctx.lang);
      return api('POST', '/sessions/' + ctx.sid + '/voice', form, { timeout: TRANSCRIBE_MS }).then(function (heard) {
        if (!heard || !heard.text || heard.confidence < MIN_CONF) return null;
        return fetch('/api/fill-slot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot_schema: schema, utterance: heard.text, context: context }) })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (f) {
            if (!f || f.needs_clarification || f.value == null) return { transcript: heard.text, value: null };
            return { transcript: heard.text, value: f.value, confidence: f.confidence, voiceId: heard.voice_id };
          });
      }).catch(function () { return null; });
    }
    return { supported: supported, start: start, stop: stop, process: process };
  })();

  /**
   * One voice interaction wired to a button. `schema`/`context` tell the ai service what the answer must look like,
   * `onValue(result)` selects it on screen, `paint(state)` updates the button ('idle' | 'listening' | 'thinking').
   */
  function voiceControl(button, getSchema, getContext, onResult, paint) {
    var busy = false, on = false;
    function finish() {
      if (!on) return; on = false; paint('thinking');
      Voice.stop().then(function (blob) { return Voice.process(blob, getSchema(), getContext()); }).then(function (r) {
        busy = false; paint('idle');
        if (!r || r.value == null) { toast(r && r.transcript ? t('unclear') : t('unclear'), 'mic_off'); return; }
        onResult(r);
      });
    }
    button.__cflVoice = function () {
      if (on) return finish();
      if (busy) return;
      if (!Voice.supported()) return toast(t('unavailable'), 'mic_off');
      busy = true;
      Voice.start(finish, function (lv) { paint('level', lv); }).then(function () { on = true; paint('listening'); }).catch(function () { busy = false; toast(t('unavailable'), 'mic_off'); });
    };
  }

  // ── answers ─────────────────────────────────────────────────────────────────────────────────────────────────────
  function labelOf(q, value) {
    var opts = (q && q.options) || [];
    function one(v) { for (var i = 0; i < opts.length; i++) if (opts[i].value === v) return opts[i].label; return String(v); }
    if (q && q.slot_id === 'chief_complaint') { for (var j = 0; j < COMPLAINT.options.length; j++) if (COMPLAINT.options[j].value === value) return pick(COMPLAINT.options[j]); }
    return Array.isArray(value) ? value.map(one).join(', ') : one(value);
  }
  /** An answered slot as the patient should see it: regions and durations have no option list, so the screens' own vocabularies label them. */
  function chipLabel(a) {
    var v = a.value, modes = (a.question && a.question.input_modes) || [];
    if (typeof v === 'string' && modes.indexOf('bodymap') >= 0) {
      var all = BODY_REGIONS.concat(RADIATION_EXTRAS);
      for (var i = 0; i < all.length; i++) if (all[i].id === v) return pick(all[i]);
    }
    if (typeof v === 'string' && modes.indexOf('duration') >= 0) {
      for (var j = 0; j < DURATIONS.length; j++) if (DURATIONS[j].value === v) return pick(DURATIONS[j]);
    }
    if (typeof v === 'number' && modes.indexOf('facescale') >= 0) return String(v) + '/10';
    return a.value_label || String(v);
  }
  /** The ontology's icon names are not all Material Symbols names; one that is not would print as a word. Fall back to a plain dot. */
  function fixIcons(root) {
    var run = function () {
      $$('.material-symbols-outlined', root || document).forEach(function (n) {
        var fs = parseFloat(getComputedStyle(n).fontSize) || 20;
        if (n.textContent.trim().length > 2 && n.getBoundingClientRect().width > fs * 1.8) n.textContent = 'radio_button_checked';
      });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(run, 60); }); else setTimeout(run, 400);
  }
  /** Posts one answer. `via` = { mode: 'tap'|'voice'|'bodymap', confidence, voiceId }. Moves on per the server's reply. */
  function submit(q, value, via) {
    var editing = !!ctx.editing;
    var mode = ctx.isProxy ? 'proxy' : via.mode;
    return api('POST', '/sessions/' + ctx.sid + '/answer', {
      slot_id: q.slot_id, value: value, input_mode: mode, confidence: via.confidence == null ? 1 : via.confidence, voice_id: via.voiceId || null, replaces: editing,
    }, { headers: { 'Idempotency-Key': ctx.sid + ':' + q.slot_id + ':' + Date.now() } }).then(function (res) {
      var line = { slot_id: q.slot_id, question: q, value: value, value_label: chipLabel({ value: value, value_label: labelOf(q, value), question: q }), input_mode: mode, confidence: via.confidence == null ? 1 : via.confidence, editable: q.slot_id !== 'chief_complaint' };
      var found = false;
      ctx.answered = ctx.answered.map(function (a) { if (a.slot_id === line.slot_id) { found = true; return line; } return a; });
      if (!found) ctx.answered.push(line);
      ctx.next = res.next_question && res.next_question.slot_id ? res.next_question : null;
      ctx.progress = (res.progress && res.progress.percent) || ctx.progress;
      ctx.redFlags = res.red_flags || [];
      var back = editing && ctx.returnTo; ctx.returnTo = null; ctx.editing = null; save();
      if (ctx.redFlags.length) return go('redflag');
      go(back || routeKey());
    });
  }

  // ── every-screen furniture: withdraw consent ────────────────────────────────────────────────────────────────────
  function mountWithdraw() {
    if (!ctx.sid || document.getElementById('cfl-withdraw')) return;
    var style = el('style', '', '#cfl-withdraw{position:fixed;left:0;right:0;bottom:0;z-index:100;height:26px;display:flex;align-items:center;justify-content:center;background:#FAF8FF;border-top:1px solid #E2E8F0}' +
      '#cfl-withdraw button{font:600 11px "Plus Jakarta Sans",sans-serif;color:#4A5B73;text-decoration:underline;background:none;border:0;cursor:pointer;padding:4px 10px}' +
      'body{padding-bottom:26px}footer.sticky,footer.fixed,div.fixed.bottom-0{bottom:26px!important}');
    document.head.appendChild(style);
    var bar = el('div'); bar.id = 'cfl-withdraw';
    var btn = el('button'); btn.type = 'button'; btn.textContent = t('withdraw'); bar.appendChild(btn);
    document.body.appendChild(bar);
    btn.addEventListener('click', function () {
      var sheet = el('div', 'fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-900/60 p-4');
      sheet.innerHTML = '<div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-3" role="alertdialog" aria-modal="true">' +
        '<h2 class="text-lg font-bold text-[#0F1E36]">' + esc(t('withdrawTitle')) + '</h2><p class="text-sm text-[#4A5B73]">' + esc(t('withdrawBody')) + '</p>' +
        '<div class="flex gap-2 pt-1"><button type="button" data-no class="flex-1 h-12 rounded-xl border border-[#E2E8F0] font-semibold text-[#0F1E36]">' + esc(t('withdrawNo')) + '</button>' +
        '<button type="button" data-yes class="flex-1 h-12 rounded-xl bg-[#BA1A1A] font-semibold text-white">' + esc(t('withdrawYes')) + '</button></div></div>';
      document.body.appendChild(sheet);
      sheet.querySelector('[data-no]').onclick = function () { sheet.remove(); };
      sheet.querySelector('[data-yes]').onclick = function () {
        api('DELETE', '/sessions/' + ctx.sid).then(function () { ended('withdrawn'); }).catch(fail);
      };
    });
  }

  // ── question-page furniture shared by the five question kinds ───────────────────────────────────────────────────
  function fillHeader(q, kindHint) {
    var h1 = $('main h1'); if (h1) h1.textContent = q.text;
    var sub = $('main header p.text-primary-container') || $('main header p.font-semibold');
    if (sub) { sub.textContent = q.module_label || ''; sub.style.display = q.module_label ? '' : 'none'; }
    var hint = $$('main header p').filter(function (p) { return p !== sub; })[0];
    if (hint) hint.style.display = 'none';
    var n = ctx.answered.filter(function (a) { return a.slot_id !== q.slot_id; }).length + 1;
    $$('main span').forEach(function (s) {
      var tx = (s.textContent || '').trim();
      if (/^Question \d+ of \d+/i.test(tx)) s.textContent = t('question') + ' ' + n;
      else if (/^Step \d of \d$/i.test(tx)) s.textContent = t('question') + ' ' + n;
      else if (/·\s*\d+%$/.test(tx)) s.textContent = ctx.progress + '% ' + t('done');
    });
    var segs = $$('main section[aria-label="Intake Progress"] .grid > div');
    var lit = Math.max(1, Math.min(segs.length, Math.round((ctx.progress / 100) * segs.length) + 1));
    segs.forEach(function (d, i) { d.className = 'h-1.5 rounded-full ' + (i < lit ? 'bg-primary-container' : 'bg-surface-container-high'); });
    var lbl = $$('button').filter(function (b) { return /Listen|Hear/i.test(b.textContent || '') && b.querySelector('.material-symbols-outlined'); })[0];
    var hearBtns = $$('#hear-btn, #hear-question-btn, button[aria-label="Listen to Question"]');
    if (lbl && hearBtns.indexOf(lbl) < 0) hearBtns.push(lbl);
    hearBtns.forEach(function (b) { b.__cflSay = q.text; });
    return q;
  }
  function mountAnswered(q) {
    var old = document.getElementById('cfl-answered'); if (old) old.remove();
    var host = $('main header'); if (!host) return;
    if (ctx.editing) {
      var bar = el('div', 'mt-2 flex items-center justify-between gap-2 rounded-xl bg-secondary-container/30 px-3 py-2 text-xs font-semibold text-primary-container');
      bar.id = 'cfl-answered'; bar.innerHTML = '<span>' + esc(t('edit')) + '</span><button type="button" class="underline">' + esc(t('cancelEdit')) + '</button>';
      bar.querySelector('button').onclick = function () { var back = ctx.returnTo; ctx.returnTo = null; ctx.editing = null; save(); go(back || routeKey()); };
      host.appendChild(bar); return;
    }
    var mine = ctx.answered.filter(function (a) { return a.slot_id !== q.slot_id; });
    if (!mine.length) return;
    var wrap = el('div', 'mt-3'); wrap.id = 'cfl-answered';
    wrap.appendChild(el('p', 'text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5', esc(t('answers'))));
    var row = el('div', 'flex flex-wrap gap-1.5');
    var CAP = 5, expanded = false;
    function draw() {
      row.innerHTML = '';
      var shown = expanded ? mine : mine.slice(-CAP);
      if (!expanded && mine.length > CAP) {
        var more = el('button', 'inline-flex items-center rounded-full bg-surface-container px-2.5 py-1 text-xs font-bold text-primary-container'); more.type = 'button'; more.textContent = '+' + (mine.length - CAP);
        more.onclick = function () { expanded = true; draw(); }; row.appendChild(more);
      }
      shown.forEach(chipFor);
    }
    function chipFor(a) {
      var chip = el('button', 'inline-flex items-center gap-1 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-2.5 py-1 text-xs font-semibold text-on-surface');
      chip.type = 'button';
      var faint = a.confidence != null && a.confidence < 0.7 ? ' opacity-70' : '';
      chip.className += faint;
      chip.innerHTML = '<span>' + esc(chipLabel(a)) + '</span>' + (a.editable && a.question ? '<span class="material-symbols-outlined text-[13px] text-primary-container">edit</span>' : '');
      if (a.editable && a.question) chip.onclick = function () { ctx.editing = a; save(); go(kindOf(a.question)); };
      row.appendChild(chip);
    }
    draw();
    wrap.appendChild(row); host.appendChild(wrap);
  }
  function voicePill() {
    return $$('button').filter(function (b) { return /graphic_eq/.test(b.innerHTML) && /Speak/.test(b.textContent || ''); })[0] || null;
  }
  function paintPill(btn) {
    var idle = btn.innerHTML;
    return function (state) {
      if (state === 'listening') { btn.innerHTML = '<span class="material-symbols-outlined text-[15px]">mic</span><span>' + esc(t('listening')) + '</span>'; btn.classList.add('animate-pulse'); }
      else if (state === 'thinking') { btn.innerHTML = '<span class="material-symbols-outlined text-[15px]">hourglass_top</span><span>' + esc(t('thinking')) + '</span>'; btn.classList.remove('animate-pulse'); }
      else if (state === 'idle') { btn.innerHTML = idle; btn.classList.remove('animate-pulse'); }
    };
  }
  function transcriptNote(text) {
    var n = document.getElementById('cfl-heard'); if (n) n.remove();
    if (!text) return;
    var box = el('p', 'rounded-xl bg-secondary-container/25 px-3 py-2 text-sm font-semibold text-on-surface', esc(t('heard')) + ': “' + esc(text) + '”'); box.id = 'cfl-heard';
    var anchor = $('main .space-y-5') || $('main'); anchor.appendChild(box);
  }

  // ── the five question screens ───────────────────────────────────────────────────────────────────────────────────
  function questionForPage(kind) {
    var q = ctx.editing ? ctx.editing.question : ctx.next;
    if (!q) { go(routeKey()); return null; }
    if (kindOf(q) !== kind) { go(kindOf(q)); return null; }
    return q;
  }
  function optionIcon(o) { return o.icon || 'radio_button_checked'; }

  function bindSingle() {
    var q = questionForPage('single'); if (!q) return;
    fillHeader(q); mountAnswered(q);
    var group = $('#single-choice-group'); group.innerHTML = '';
    var state = { value: null, via: { mode: 'tap', confidence: 1, voiceId: null } };
    function paintSel() {
      $$('.option-card', group).forEach(function (c) {
        var on = c.dataset.value === String(state.value);
        c.setAttribute('aria-checked', on ? 'true' : 'false');
        c.className = 'option-card cursor-pointer group rounded-2xl p-4 shadow-xs flex items-center justify-between transition-all active:scale-[0.99] ' + (on ? 'bg-secondary-container/20 border-2 border-primary-container' : 'bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container/50');
        var box = $('.icon-box', c); box.className = 'icon-box w-10 h-10 rounded-xl flex items-center justify-center transition-colors ' + (on ? 'bg-primary-container text-white' : 'bg-surface-container text-primary-container');
        var r = $('.radio-indicator', c);
        r.className = 'radio-indicator w-5 h-5 rounded-full flex items-center justify-center transition-all ' + (on ? 'bg-primary-container text-white shadow-xs' : 'border-2 border-outline-variant/60');
        r.innerHTML = on ? '<span class="material-symbols-outlined text-[14px]">check</span>' : '<div class="inner-dot w-2 h-2 rounded-full bg-transparent"></div>';
      });
    }
    q.options.forEach(function (o) {
      var c = el('div', 'option-card', '<div class="flex items-center gap-3 min-w-0"><div class="icon-box"><span class="material-symbols-outlined text-[22px]">' + esc(optionIcon(o)) + '</span></div><div class="min-w-0"><span class="font-bold text-sm text-on-surface block"></span></div></div><div class="radio-indicator"></div>');
      c.dataset.value = o.value; c.setAttribute('role', 'radio'); c.tabIndex = 0;
      $('span.font-bold', c).textContent = o.label;
      var pickIt = function () { state.value = o.value; state.via = { mode: 'tap', confidence: 1, voiceId: null }; transcriptNote(null); paintSel(); };
      c.addEventListener('click', pickIt);
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickIt(); } });
      group.appendChild(c);
    });
    paintSel(); fixIcons(group);
    wireContinue('#continue-btn', function () { return state.value == null ? null : { q: q, value: state.value, via: state.via }; });
    wireVoice(q, function () { return { type: 'string', enum: q.options.map(function (o) { return o.value; }) }; }, function (r) {
      state.value = r.value; state.via = { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId }; transcriptNote(r.transcript); paintSel();
    });
    autoRead(q);
  }

  function bindMulti() {
    var q = questionForPage('multi'); if (!q) return;
    fillHeader(q); mountAnswered(q);
    var group = $('#symptoms-group');
    var template = $('.symptom-card[data-selected="false"]:not(#none-card)', group);
    var none = $('#none-card', group);
    var tpl = template.cloneNode(true);
    $$('.symptom-card:not(#none-card)', group).forEach(function (c) { c.remove(); });
    var chosen = {}, noneOn = false, touched = false, via = { mode: 'tap', confidence: 1, voiceId: null };
    function paint() {
      $$('.symptom-card', group).forEach(function (c) {
        var isNone = c.id === 'none-card';
        var on = isNone ? noneOn : !!chosen[c.dataset.value];
        c.setAttribute('data-selected', on ? 'true' : 'false');
        c.className = 'symptom-card cursor-pointer rounded-2xl p-3.5 flex items-center justify-between transition-all active:scale-[0.99] shadow-xs ' + (isNone ? 'sm:col-span-2 ' : '') + (on ? 'border-2 border-primary-container bg-secondary-container/15' : 'border border-outline-variant/60 bg-surface-container-lowest hover:border-primary-container/40');
        var ind = $('.indicator', c);
        ind.className = 'indicator w-5 h-5 rounded-full flex items-center justify-center shrink-0 ' + (on ? 'bg-primary-container text-white shadow-xs' : 'border-2 border-outline-variant bg-surface-container-lowest');
        ind.innerHTML = on ? '<span class="material-symbols-outlined text-[14px] font-bold">check</span>' : '';
        var title = $('.font-bold', c); if (title) title.className = 'font-bold text-sm ' + (on ? 'text-primary-container' : 'text-on-surface');
      });
      var count = Object.keys(chosen).length;
      var lab = $('#btn-label'); if (lab) lab.textContent = noneOn ? t('none') : (count ? String(count) + ' ✓' : (ctx.lang === 'hi' ? 'आगे बढ़ें' : 'Continue'));
    }
    q.options.forEach(function (o) {
      var c = tpl.cloneNode(true); c.removeAttribute('onclick'); c.dataset.value = o.value;
      var icon = c.querySelector('.w-10'); if (icon) icon.innerHTML = '<span class="material-symbols-outlined text-[24px] text-primary-container">' + esc(o.icon || 'check_circle') + '</span>';
      var title = $('.font-bold', c); title.textContent = o.label;
      $$('.text-xs, .text-\\[10px\\]', c).forEach(function (n) { if (n !== title && n.tagName === 'SPAN' && !n.classList.contains('font-bold')) n.remove(); });
      c.addEventListener('click', function () { touched = true; noneOn = false; if (chosen[o.value]) delete chosen[o.value]; else chosen[o.value] = true; via = { mode: 'tap', confidence: 1, voiceId: null }; transcriptNote(null); paint(); });
      group.insertBefore(c, none);
    });
    none.removeAttribute('onclick');
    var hasNone = q.options.some(function (o) { return o.value === 'none'; });
    if (hasNone) none.style.display = 'none'; // the question already carries its own "none" answer
    var nt = $('.font-bold', none); if (nt) nt.textContent = t('none');
    $$('.text-xs', none).forEach(function (n) { n.style.display = 'none'; });
    none.addEventListener('click', function () { touched = true; noneOn = !noneOn; if (noneOn) chosen = {}; via = { mode: 'tap', confidence: 1, voiceId: null }; transcriptNote(null); paint(); });
    paint(); fixIcons(group);
    wireContinue('#continue-btn', function () { if (!touched) return null; return { q: q, value: noneOn ? [] : Object.keys(chosen), via: via }; });
    wireVoice(q, function () { return { type: 'array', enum: q.options.map(function (o) { return o.value; }) }; }, function (r) {
      var vals = Array.isArray(r.value) ? r.value : [r.value];
      touched = true; noneOn = vals.length === 0; chosen = {}; vals.forEach(function (v) { chosen[v] = true; });
      via = { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId }; transcriptNote(r.transcript); paint();
    });
    autoRead(q);
  }

  function nearestRegion(xPct, yPct) {
    var best = BODY_REGIONS[0], bd = 1e9;
    BODY_REGIONS.forEach(function (r) { var d = Math.pow((r.x - xPct) * 1.4, 2) + Math.pow(r.y - yPct, 2); if (d < bd) { bd = d; best = r; } });
    return best;
  }
  function bindBody() {
    var q = questionForPage('body'); if (!q) return;
    fillHeader(q); mountAnswered(q);
    var state = { id: null, via: { mode: 'bodymap', confidence: 1, voiceId: null } };
    var regions = BODY_REGIONS.concat(q.slot_id === 'radiation' ? RADIATION_EXTRAS : []);
    var marker = $('#pain-target-marker'), label = $('#selected-area-label'), figure = $('[data-purpose="human-body-vector"]');
    var scale = $('#pain-scale-group'); if (scale) { var box = scale.closest('div.space-y-2, section, div.rounded-2xl') || scale.parentElement; (box || scale).style.display = 'none'; }
    marker.style.display = 'none'; label.textContent = t('tapBody');
    var goText = $('#body-map-btn-text'); if (goText) goText.textContent = ctx.lang === 'hi' ? 'आगे बढ़ें' : 'Continue';
    var adj = $('#adjust-area-btn'); if (adj) adj.textContent = ctx.lang === 'hi' ? 'हटाएँ' : 'Clear';
    var chipsWrap = el('div', 'flex flex-wrap gap-1.5 mt-3'); chipsWrap.id = 'cfl-regions';
    function select(region, via, x, y) {
      state.id = region.id; state.via = via;
      label.textContent = pick(region);
      if (x != null) { marker.style.left = x + '%'; marker.style.top = y + '%'; marker.style.display = ''; }
      else if (region.x != null) { marker.style.left = region.x + '%'; marker.style.top = region.y + '%'; marker.style.display = ''; }
      else marker.style.display = 'none';
      $$('button', chipsWrap).forEach(function (b) { var on = b.dataset.id === region.id; b.className = 'rounded-full px-3 py-2 text-xs font-semibold min-h-[40px] ' + (on ? 'bg-primary-container text-white' : 'bg-surface-container-lowest border border-outline-variant/50 text-on-surface'); });
    }
    regions.forEach(function (r) {
      var b = el('button', 'rounded-full px-3 py-2 text-xs font-semibold min-h-[40px] bg-surface-container-lowest border border-outline-variant/50 text-on-surface'); b.type = 'button'; b.dataset.id = r.id; b.textContent = pick(r);
      b.onclick = function () { transcriptNote(null); select(r, { mode: 'bodymap', confidence: 1, voiceId: null }); };
      chipsWrap.appendChild(b);
    });
    figure.closest('[data-purpose="body-map-container"]').appendChild(chipsWrap);
    figure.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      var rect = figure.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100, y = ((e.clientY - rect.top) / rect.height) * 100;
      transcriptNote(null); select(nearestRegion(x, y), { mode: 'bodymap', confidence: 1, voiceId: null }, x, y);
    }, true);
    var adjust = $('#adjust-area-btn'); if (adjust) { delegate('click', '#adjust-area-btn', function () { state.id = null; marker.style.display = 'none'; label.textContent = t('tapBody'); $$('button', chipsWrap).forEach(function (b) { b.className = 'rounded-full px-3 py-2 text-xs font-semibold min-h-[40px] bg-surface-container-lowest border border-outline-variant/50 text-on-surface'; }); }); }
    wireContinue('#body-map-continue-btn', function () { return state.id ? { q: q, value: state.id, via: state.via } : null; });
    wireVoice(q, function () { return { type: 'string', enum: regions.map(function (r) { return r.id; }) }; }, function (r) {
      var region = regions.filter(function (x) { return x.id === r.value; })[0]; if (!region) return toast(t('unclear'), 'mic_off');
      transcriptNote(r.transcript); select(region, { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId });
    });
    autoRead(q);
  }

  function bindFace() {
    var q = questionForPage('face'); if (!q) return;
    fillHeader(q); mountAnswered(q);
    var state = { level: null, via: { mode: 'tap', confidence: 1, voiceId: null } };
    var lab = $('#active-level-label');
    function unpaint() {
      $$('.pain-card').forEach(function (c) { c.className = 'pain-card flex flex-col items-center justify-center p-2.5 rounded-xl border border-outline-variant/60 bg-surface hover:border-primary-container/40 transition-all cursor-pointer'; var b = $('.check-badge', c); if (b) b.remove(); });
      if (lab) lab.textContent = t('tapFace');
      $$('#slider-ticks span').forEach(function (s) { s.classList.remove('font-bold', 'text-primary-container'); });
    }
    unpaint();
    var sumBox = $('#summary-score-badge') && $('#summary-score-badge').parentElement, thumb = $('#slider-thumb');
    if (sumBox) sumBox.style.display = 'none'; if (thumb) thumb.style.visibility = 'hidden'; // no level is "selected" until the patient picks one
    function reveal() { if (sumBox) sumBox.style.display = ''; if (thumb) thumb.style.visibility = ''; }
    var cl = $('#continue-label'); if (cl) cl.textContent = ctx.lang === 'hi' ? 'आगे बढ़ें' : 'Continue';
    function noteChosen() { var m = lab && lab.textContent.match(/(\d+)/); state.level = m ? parseInt(m[1], 10) : null; }
    // The screen's own handlers paint the face/slider; we read the level it settles on, and mark it as tapped.
    document.addEventListener('click', function (e) {
      if (e.target.closest('.pain-card, #slider-track-container, #slider-ticks')) setTimeout(function () { noteChosen(); reveal(); state.via = { mode: 'tap', confidence: 1, voiceId: null }; transcriptNote(null); }, 0);
    });
    wireContinue('#q12-continue-btn', function () { return state.level == null ? null : { q: q, value: state.level, via: state.via }; });
    wireVoice(q, function () { return { type: 'integer', minimum: 0, maximum: 10 }; }, function (r) {
      var n = Math.max(0, Math.min(10, parseInt(r.value, 10)));
      if (window.selectPainLevel) window.selectPainLevel(n);
      reveal(); state.level = n; state.via = { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId }; transcriptNote(r.transcript);
    });
    autoRead(q);
  }

  function bindDuration() {
    var q = questionForPage('duration'); if (!q) return;
    fillHeader(q); mountAnswered(q);
    var group = $('#durationGroup');
    var tpl = $('.duration-card', group).cloneNode(true);
    group.innerHTML = '';
    var state = { value: null, via: { mode: 'tap', confidence: 1, voiceId: null } };
    function paint() {
      $$('.duration-card', group).forEach(function (c) {
        var on = c.dataset.value === state.value;
        c.setAttribute('aria-checked', on ? 'true' : 'false');
        c.className = 'duration-card text-left w-full p-4 rounded-2xl shadow-xs transition-all flex items-center justify-between group active:scale-[0.99] ' + (on ? 'bg-secondary-container/20 border-2 border-primary-container' : 'bg-surface-container-lowest border border-outline-variant/40 hover:border-primary-container/40');
        var r = $('.radio-indicator', c);
        if (r) { r.className = 'radio-indicator w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ' + (on ? 'bg-primary-container text-white shadow-xs' : 'border-2 border-outline-variant/60'); r.innerHTML = on ? '<span class="material-symbols-outlined text-[14px]">check</span>' : '<div class="dot w-2 h-2 rounded-full bg-transparent"></div>'; }
      });
    }
    DURATIONS.forEach(function (d) {
      var c = tpl.cloneNode(true); c.removeAttribute('onclick'); c.dataset.value = d.value;
      var spans = $$('span', c);
      var ic = $('.material-symbols-outlined', c); if (ic) ic.textContent = d.icon;
      var names = $$('.font-bold, .text-xs', c).filter(function (s) { return !s.classList.contains('material-symbols-outlined'); });
      if (names[0]) names[0].textContent = d.en; if (names[1]) names[1].textContent = d.hi; if (names[2]) names[2].style.display = 'none';
      spans.forEach(function () { /* structure kept as designed */ });
      c.addEventListener('click', function () { state.value = d.value; state.via = { mode: 'tap', confidence: 1, voiceId: null }; transcriptNote(null); paint(); });
      group.appendChild(c);
    });
    paint();
    var bt = $('#btnText'); if (bt) bt.textContent = ctx.lang === 'hi' ? 'आगे बढ़ें' : 'Continue';
    wireContinue('#submitBtn', function () { return state.value ? { q: q, value: state.value, via: state.via } : null; });
    wireVoice(q, function () { return { type: 'string', enum: DURATIONS.map(function (d) { return d.value; }) }; }, function (r) {
      state.value = r.value; state.via = { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId }; transcriptNote(r.transcript); paint();
    });
    autoRead(q);
  }

  function wireContinue(selector, read) {
    var busy = false;
    delegate('click', selector, function () {
      if (busy) return;
      var got = read();
      if (!got) return toast(t('choose'), 'touch_app');
      busy = true;
      submit(got.q, got.value, got.via).catch(function (e) { busy = false; fail(e); });
    });
  }
  function wireVoice(q, getSchema, onResult) {
    var pill = voicePill(); if (!pill) return;
    pill.removeAttribute('onclick');
    pill.id = pill.id || 'cfl-voice-pill';
    voiceControl(pill, getSchema, function () { return { slot_id: q.slot_id }; }, onResult, paintPill(pill));
    delegate('click', '#' + pill.id, function (b) { b.__cflVoice(); });
  }
  function autoRead(q) {
    ready(function () { setTimeout(function () { say(q.text); }, 350); });
    delegate('click', '#hear-btn, #hear-question-btn, button[aria-label="Listen to Question"]', function (b) { say(b.__cflSay || q.text); });
  }

  // ── chief complaint ─────────────────────────────────────────────────────────────────────────────────────────────
  function bindComplaint() {
    if (ctx.answered.length && ctx.next) return go(routeKey());
    var text = pick(COMPLAINT.text);
    var h1 = $('main h1'); if (h1) h1.textContent = text;
    var sub = $('main header p.text-primary-container'); if (sub) sub.style.display = 'none';
    var q = { slot_id: 'chief_complaint', text: text, options: COMPLAINT.options.map(function (o) { return { value: o.value, label: pick(o), icon: o.icon }; }), input_modes: ['voice', 'chips'] };
    var state = { value: null, via: { mode: 'tap', confidence: 1, voiceId: null } };
    var section = el('section', 'space-y-2'); section.id = 'cfl-complaint-chips';
    section.appendChild(el('p', 'text-xs font-bold uppercase tracking-wider text-on-surface-variant', esc(t('tapWhat'))));
    var grid = el('div', 'grid grid-cols-2 gap-2.5'); section.appendChild(grid);
    function paint() {
      $$('button', grid).forEach(function (b) {
        var on = b.dataset.value === state.value;
        b.className = 'min-h-[56px] rounded-2xl px-3 py-3 flex items-center gap-2 text-left text-sm font-bold transition-all active:scale-[0.99] ' + (on ? 'bg-secondary-container/20 border-2 border-primary-container text-primary-container' : 'bg-surface-container-lowest border border-outline-variant/50 text-on-surface');
      });
    }
    q.options.forEach(function (o) {
      var b = el('button', '', '<span class="material-symbols-outlined text-[22px] text-primary-container">' + esc(o.icon) + '</span><span></span>');
      b.type = 'button'; b.dataset.value = o.value; $('span:last-child', b).textContent = o.label;
      b.onclick = function () { state.value = o.value; state.via = { mode: 'tap', confidence: 1, voiceId: null }; var card = $('#answerDetectedCard'); if (card) card.classList.add('hidden'); paint(); };
      grid.appendChild(b);
    });
    var voiceSection = $('#voiceSection'); voiceSection.parentElement.insertBefore(section, voiceSection);
    paint(); fixIcons(section);
    if (window.updateUIState) window.updateUIState('idle');
    var recognized = $('#recognizedText'); if (recognized) recognized.textContent = '';

    var mic = $('#micBtn'), waves = $$('#waveformContainer .wave-bar');
    var schema = { type: 'string', enum: COMPLAINT.options.map(function (o) { return o.value; }) };
    function apply(r) {
      state.value = r.value; state.via = { mode: 'voice', confidence: r.confidence, voiceId: r.voiceId }; paint();
      if (recognized) recognized.textContent = '“' + r.transcript + '”';
      if (window.updateUIState) window.updateUIState('detected');
    }
    voiceControl(mic, function () { return schema; }, function () { return { slot_id: 'chief_complaint' }; }, apply, function (s, level) {
      if (s === 'level') { waves.forEach(function (w) { w.style.transform = 'scaleY(' + (0.3 + level * 1.4) + ')'; }); return; }
      if (s === 'listening' && window.updateUIState) window.updateUIState('listening');
      if (s === 'thinking' && window.updateUIState) window.updateUIState('processing');
      if (s === 'idle' && window.updateUIState && state.value == null) window.updateUIState('idle');
    });
    delegate('click', '#micBtn', function (b) { b.__cflVoice(); });
    // Typed text is optional — it is fitted to the same options, and never submitted silently either.
    var typed = $('#typedComplaint');
    $('#submitTypingBtn').addEventListener('click', function () {
      var v = (typed.value || '').trim(); if (!v) return;
      fetch('/api/fill-slot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot_schema: schema, utterance: v, context: { slot_id: 'chief_complaint' } }) })
        .then(function (r) { return r.ok ? r.json() : null; }).then(function (f) {
          if (!f || f.needs_clarification || f.value == null) return toast(t('unclear'), 'edit');
          state.value = f.value; state.via = { mode: 'tap', confidence: f.confidence, voiceId: null }; paint();
        }).catch(function () { toast(t('unclear'), 'edit'); });
    });
    var confirmBusy = false;
    function confirm() {
      if (confirmBusy) return;
      if (state.value == null) return toast(t('choose'), 'touch_app');
      confirmBusy = true;
      submit(q, state.value, state.via).catch(function (e) { confirmBusy = false; fail(e); });
    }
    delegate('click', '#confirmAnswerBtn, #primaryContinueBtn', confirm);
    delegate('click', '#voiceFallbackLink', function () { toast(t('unavailable'), 'mic_off'); });
    window.speakQuestion = function () { say(text); };
    ready(function () { setTimeout(function () { say(text); }, 350); });
  }

  // ── red flag (deterministic rule fired server-side; this only shows and reads it) ───────────────────────────────
  function bindRedFlag() {
    var flag = ctx.redFlags[0];
    if (!flag) return go(routeKey());
    var quoteEl = $('#noticed-symptom-name'), durEl = $('#noticed-duration'), sevEl = $('#noticed-severity');
    if (quoteEl) quoteEl.textContent = flag.quote;
    [durEl, sevEl].forEach(function (n) { var row = n && n.closest('.flex.items-center.justify-between'); if (row) row.style.display = 'none'; });
    $$('main span, main div').forEach(function (n) { if (n.children.length === 0 && /^[ऀ-ॿ ]*छाती में तेज/.test((n.textContent || '').trim())) n.style.display = 'none'; });
    var calm = flag.speak || '';
    var lead = $$('main p').filter(function (p) { return /Based on your answers/.test(p.textContent || ''); })[0];
    if (lead && calm) lead.textContent = calm;
    var audioText = $('#audioText');
    function read() { say(calm || flag.quote); if (audioText) audioText.textContent = ctx.lang === 'hi' ? 'फिर से सुनें' : 'Hear it again'; }
    delegate('click', '#audioBtn', read);
    delegate('click', '#continueBtn', function () { ctx.redFlags = []; save(); go(routeKey()); });
    ready(function () { setTimeout(read, 300); });
  }

  // ── landing: the slip QR opens straight to the language screen; without one, the scanner stays as designed ──────
  function takeSlipFromUrl() {
    var q = new URLSearchParams(location.search), s = q.get('s'), tk = q.get('token');
    if (s && tk) { adopt({ sid: s, token: tk }); history.replaceState(null, '', location.pathname); return true; }
    return false;
  }
  function openSlip(raw) {
    var slip = parseSlip(raw);
    if (!slip) { toast(t('notSlip'), 'qr_code_scanner'); return Promise.resolve(false); }
    adopt(slip);
    return resume().then(function () {
      if (ctx.status === 'completed') return ended('finished');
      if (ctx.status === 'withdrawn') return ended('withdrawn');
      toast(ctx.tokenNo ? ((ctx.lang === 'hi' ? 'टोकन ' : 'Token ') + ctx.tokenNo) : 'OK', 'check_circle');
      advance(); return true;
    }).catch(function (e) { fail(e); return false; });
  }
  // Installed before the screen's own script runs: the camera / uploaded image decode goes to openSlip, never to a fake session.
  if (PAGE_KEY === 'landing' && window.CareFlow && CareFlow.qrScanner) {
    var qs = CareFlow.qrScanner, origStart = qs.startScanner, origImg = qs.scanImageFile;
    qs.startScanner = function (opts) { opts = Object.assign({}, opts, { onDecode: function (raw) { return openSlip(raw); } }); return origStart.call(qs, opts); };
    qs.scanImageFile = function (file, ok, bad) { return origImg.call(qs, file, function (raw) { openSlip(raw); }, bad); };
  }
  function bindLanding() {
    // No mock session, no sample scan, no typed token (a token number alone must not open a visit).
    var sim = $('#test-qr-btn'); if (sim) sim.style.display = 'none';
    var manual = $('#toggle-manual-token-btn'); if (manual) { var mb = manual.closest('div.flex.flex-col, div.rounded-2xl') || manual.parentElement; mb.style.display = 'none'; }
    var divider = $$('span').filter(function (s) { return /OR \/ या/.test(s.textContent || ''); })[0]; if (divider) divider.parentElement.style.display = 'none';
    if (ctx.sid && ctx.token) {
      resume().then(function () {
        if (ctx.status === 'completed') return ended('finished');
        if (ctx.status === 'withdrawn') return ended('withdrawn');
        advance();
      }).catch(fail);
    }
  }

  // ── language ────────────────────────────────────────────────────────────────────────────────────────────────────
  function bindLanguage() {
    delegate('click', '#continue-cta', function () {
      var chosen = $('.lang-option[aria-checked="true"]'); var lang = chosen ? chosen.getAttribute('data-lang') : 'hi';
      api('POST', '/sessions/' + ctx.sid + '/language', { language: lang }).then(function () { ctx.lang = lang; ctx.gates.language = true; save(); advance(); }).catch(fail);
    });
  }

  // ── consent ─────────────────────────────────────────────────────────────────────────────────────────────────────
  function bindConsent() {
    var voice = $('#toggle-voice-consent'), abha = $('#toggle-abha-consent');
    var voiceCard = voice.closest('label');
    var share = voiceCard.cloneNode(true);
    share.setAttribute('for', 'toggle-voice-share');
    var input = $('input', share); input.id = 'toggle-voice-share'; input.checked = false; input.removeAttribute('checked');
    $$('span.material-symbols-outlined', share).forEach(function (s) { if (/^mic$/.test(s.textContent)) s.textContent = 'record_voice_over'; if (/^graphic_eq$/.test(s.textContent)) s.textContent = 'hearing'; });
    var tag = $$('span', share).filter(function (s) { return /Faster interview/.test(s.textContent); })[0]; if (tag) tag.textContent = t('voiceShareTag');
    var badge = $$('span', share).filter(function (s) { return /Voice Care/.test(s.textContent); })[0]; if (badge) badge.textContent = ctx.lang === 'hi' ? 'आपकी आवाज़ • डॉक्टर के लिए' : 'Your voice • for the doctor';
    var h = $('h2', share); if (h) h.textContent = t('voiceShare');
    var ps = $$('p', share); if (ps[0]) ps[0].textContent = t('voiceShareBody'); if (ps[1]) ps[1].style.display = 'none';
    voiceCard.parentElement.insertBefore(share, voiceCard.nextSibling);
    function sync() { input.disabled = !voice.checked; if (!voice.checked) input.checked = false; share.style.opacity = voice.checked ? '1' : '0.5'; }
    voice.addEventListener('change', sync); sync();
    delegate('click', '#consent-continue-btn', function () {
      var scopes = ['history', 'documents'];
      if (voice.checked) scopes.push('audio_recording');
      if (voice.checked && input.checked) scopes.push('voice_note_share');
      if (abha.checked) scopes.push('abha_lookup');
      api('POST', '/sessions/' + ctx.sid + '/consent', { scopes: scopes }).then(function () {
        ctx.gates.consent = true; if (!abha.checked) ctx.gates.abha = true; ctx.voiceShare = input.checked; save(); advance();
      }).catch(fail);
    });
  }

  // ── ABHA (mock ABDM gateway — said plainly on screen) ───────────────────────────────────────────────────────────
  function bindAbha() {
    var pre = $('#scan-toast'); if (pre) { pre.classList.remove('flex'); pre.classList.add('hidden'); } // the design shows "verified" before anything is scanned
    var note = el('p', 'mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-900', esc(t('mockAbha')));
    var anchor = $('main .space-y-5') || $('main'); anchor.insertBefore(note, anchor.firstChild);
    var skip = el('button', 'w-full min-h-[48px] text-sm font-bold text-primary-container underline'); skip.type = 'button'; skip.id = 'cfl-skip-abha'; skip.textContent = t('skipAbha');
    var cont = $('#continue-action'); if (cont) cont.parentElement.appendChild(skip);
    delegate('click', '#cfl-skip-abha', function () { ctx.gates.abha = true; save(); advance(); });
    delegate('click', '#continue-action', function () {
      var ok = $('#scanner-view-success') && !$('#scanner-view-success').classList.contains('hidden');
      ctx.gates.abha = true; save(); if (ok) toast('ABHA ✓', 'verified_user'); advance();
    });
    delegate('click', '#create-new-profile-link', function () { ctx.gates.abha = true; save(); advance(); });
    delegate('click', '#trigger-scan-btn', function () { toast(t('notSlip').replace(/CareFlow token slip/, 'ABHA card'), 'qr_code_scanner'); });
  }
  function bindAbhaOtp() {
    delegate('click', '#switch-qr-btn', function () { go('abha'); });
    delegate('click', '#submit-verify', function () { ctx.gates.abha = true; save(); advance(); });
  }

  // ── who is answering ────────────────────────────────────────────────────────────────────────────────────────────
  function bindAttendant() {
    delegate('click', '#continue-btn', function () {
      var attendant = $('#mode-attendant-card').getAttribute('aria-checked') === 'true';
      ctx.isProxy = attendant; ctx.relation = attendant ? ($('#attendant-role') || {}).value || null : null;
      ctx.gates.attendant = true; save(); advance();
    });
  }

  // ── documents: live camera in the design's scan frame, file fallback, page preview (crop + retake), upload ─────────
  function humanField(f) { return String(f || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function docHint() {
    var sel = $('.doc-type-btn.border-2') || $('.doc-type-btn[data-type="Prescription"]');
    var label = sel ? sel.getAttribute('data-type') : 'Prescription';
    return { label: label, hint: label === 'Prescription' ? 'prescription' : (label === 'Lab Report' ? 'lab_report' : 'other') };
  }
  function toBlob(canvas, type, q) { return new Promise(function (r) { canvas.toBlob(r, type, q); }); }
  function thumbOf(blob) {
    return createImageBitmap(blob).then(function (bm) {
      var w = 220, h = Math.round((bm.height / bm.width) * w), c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(bm, 0, 0, w, h); return c.toDataURL('image/jpeg', 0.6);
    }).catch(function () { return null; });
  }
  function preview(blob, onUse, onRetake) {
    var url = URL.createObjectURL(blob);
    var ov = el('div', 'fixed inset-0 z-[300] bg-black/90 flex flex-col p-4 gap-3');
    ov.innerHTML = '<img alt="" class="flex-1 min-h-0 object-contain rounded-xl bg-black"><div class="flex gap-2 pb-2">' +
      '<button type="button" data-retake class="flex-1 h-14 rounded-xl border border-white/40 text-white font-bold">' + esc(ctx.lang === 'hi' ? 'दोबारा लें' : 'Retake') + '</button>' +
      '<button type="button" data-use class="flex-1 h-14 rounded-xl bg-white text-[#0D6E6E] font-bold">' + esc(ctx.lang === 'hi' ? 'यह पेज इस्तेमाल करें' : 'Use this page') + '</button></div>';
    $('img', ov).src = url; document.body.appendChild(ov);
    $('[data-retake]', ov).onclick = function () { ov.remove(); URL.revokeObjectURL(url); if (onRetake) onRetake(); };
    $('[data-use]', ov).onclick = function () { $('[data-use]', ov).disabled = true; onUse().catch(function (e) { ov.remove(); fail(e); }); };
  }
  function uploadPage(blob, name) {
    var hint = docHint();
    var form = new FormData(); form.append('file', blob, name); form.append('doc_type_hint', hint.hint);
    return Promise.all([api('POST', '/sessions/' + ctx.sid + '/documents', form, { timeout: 30000 }), thumbOf(blob)]).then(function (r) {
      ctx.docs.push({ id: r[0].document_id, type: hint.label, name: name, thumb: r[1] }); save(); go('tray');
    });
  }
  function bindDocs() {
    var scanBox = $('.scan-beam') && $('.scan-beam').parentElement, dashed = scanBox && $('.border-dashed', scanBox);
    var video = null, stream = null;
    function stopCam() { try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* ignore */ } stream = null; }
    window.addEventListener('pagehide', stopCam);
    if (scanBox && !/[?&]cam=0\b/.test(location.search) && window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } }, audio: false }).then(function (s) {
        stream = s; video = el('video', 'absolute inset-0 w-full h-full object-cover'); video.setAttribute('playsinline', ''); video.muted = true; video.autoplay = true; video.srcObject = s;
        scanBox.insertBefore(video, scanBox.firstChild);
        var beam = $('.scan-beam', scanBox); if (beam) beam.style.display = 'none';
        if (dashed) { dashed.classList.remove('bg-surface-container-lowest/80', 'backdrop-blur-xs'); $$('.material-symbols-outlined, span', dashed).forEach(function (n) { if (n.parentElement === dashed || n.parentElement.parentElement === dashed) n.style.visibility = 'hidden'; }); }
      }).catch(function () { /* no camera: the file button does the job */ });
    }
    function fromVideo() {
      var box = scanBox.getBoundingClientRect(), vw = video.videoWidth, vh = video.videoHeight; if (!vw) return null;
      // object-cover: the visible part of the video is a centred crop with the container's aspect ratio.
      var ar = box.width / box.height, cw = vw, ch = vw / ar; if (ch > vh) { ch = vh; cw = vh * ar; }
      var scale = Math.min(1, 1600 / cw), c = document.createElement('canvas'); c.width = Math.round(cw * scale); c.height = Math.round(ch * scale);
      c.getContext('2d').drawImage(video, (vw - cw) / 2, (vh - ch) / 2, cw, ch, 0, 0, c.width, c.height);
      return toBlob(c, 'image/jpeg', 0.86);
    }
    delegate('click', '#doc-capture-cta', function () {
      if (video) { Promise.resolve(fromVideo()).then(function (blob) { if (blob) preview(blob, function () { return uploadPage(blob, 'page-' + (ctx.docs.length + 1) + '.jpg'); }); }); }
      else $('#doc-file-input').click();
    });
    delegate('change', '#doc-file-input', function (input) {
      var f = input.files && input.files[0]; if (!f) return; input.value = '';
      if (/^image\//.test(f.type)) preview(f, function () { return uploadPage(f, f.name || 'page.jpg'); });
      else uploadPage(f, f.name || 'document.pdf').catch(fail);
    });
    delegate('click', '#doc-skip-btn', function () { stopCam(); go('readback'); });
    delegate('click', '#doc-capture-back-btn', function () { history.back(); });
  }

  function pollDoc(doc, onUpdate) {
    var tries = 0;
    (function tick() {
      api('GET', '/documents/' + doc.id).then(function (d) {
        doc.status = d.status; doc.findings = (d.extractions || []).map(function (e) { return { field: e.field, value: e.value, confidence: e.confidence }; }); save(); onUpdate(doc);
        if ((d.status === 'queued' || d.status === 'processing') && ++tries < 45) setTimeout(tick, 1500);
      }).catch(function () { if (++tries < 45) setTimeout(tick, 2500); });
    })();
  }
  var DOC_STATE = {
    en: { queued: 'Waiting to be read…', processing: 'Reading your page…', done: 'Read — the doctor will confirm it', failed: 'We could not read this page — the doctor will see the photo' },
    hi: { queued: 'पढ़े जाने का इंतज़ार…', processing: 'आपका पेज पढ़ा जा रहा है…', done: 'पढ़ लिया — डॉक्टर पुष्टि करेंगे', failed: 'यह पेज पढ़ नहीं पाए — डॉक्टर तस्वीर देखेंगे' },
  };
  function docStateText(s) { return (DOC_STATE[ctx.lang === 'hi' ? 'hi' : 'en'] || DOC_STATE.en)[s] || ''; }

  function bindTray() {
    var doc = ctx.docs[ctx.docs.length - 1];
    if (!doc) return go('docs');
    // The design's own script writes a sample file name on DOMContentLoaded; ours goes in after it.
    window.addEventListener('load', function () {
      $('#tray-doc-name').textContent = (ctx.lang === 'hi' ? 'पेज ' : 'Page ') + ctx.docs.length;
      $('#tray-doc-type').textContent = doc.type;
    });
    var rx = $$('main i, main span, main div').filter(function (n) { return n.children.length === 0 && n.textContent.trim() === 'Rx'; })[0];
    var thumbBox = rx && rx.closest('.relative');
    if (thumbBox && doc.thumb) thumbBox.innerHTML = '<img alt="" class="w-full h-full object-cover rounded-lg" src="' + doc.thumb + '">';
    var pages = $$('span').filter(function (s) { return /^\d+ of \d+$/.test((s.textContent || '').trim()); })[0]; if (pages) pages.textContent = ctx.docs.length + ' / ' + ctx.docs.length;
    var ext = $$('span').filter(function (s) { return /% Complete$/.test((s.textContent || '').trim()); })[0];
    var line = $$('main p').filter(function (p) { return /Reading document/.test(p.textContent || ''); })[0];
    function paint(d) { if (ext) ext.textContent = docStateText(d.status || 'queued'); if (line) line.textContent = docStateText(d.status || 'queued'); }
    paint(doc); pollDoc(doc, paint);
    var again = $('#retake-doc-btn'); if (again) again.innerHTML = '<span class="material-symbols-outlined text-[14px]">add_a_photo</span><span>' + esc(ctx.lang === 'hi' ? 'एक और पेज' : 'Add another page') + '</span>';
    delegate('click', '#retake-doc-btn', function () { go('docs'); });
    delegate('click', '#continue-btn', function () { go('review'); });
    delegate('click', '#audio-btn', function () { say(docStateText(doc.status || 'queued')); });
  }

  function bindReview() {
    if (!ctx.docs.length) return go('readback');
    var editBtn = $('button[data-field="doctor"]'), row = editBtn && editBtn.parentElement, host = row && row.parentElement;
    var tpl = row.cloneNode(true); host.innerHTML = '';
    var fn = $('#doc-filename-display'); if (fn) fn.textContent = (ctx.lang === 'hi' ? 'पेज: ' : 'Pages: ') + ctx.docs.length;
    $$('span').forEach(function (s) { if (/Verified OCR/.test(s.textContent || '') && s.children.length <= 1) s.lastChild.textContent = ctx.lang === 'hi' ? ' पढ़ा गया — पुष्टि बाकी' : ' Read by CareFlow — to be confirmed'; });
    var viewOrig = $('#view-orig-btn'); if (viewOrig) viewOrig.style.display = 'none';
    var retake = $('#retake-btn'); if (retake) retake.innerHTML = '<span class="material-symbols-outlined text-[14px]">add_a_photo</span><span>' + esc(ctx.lang === 'hi' ? 'एक और पेज' : 'Add another page') + '</span>';
    delegate('click', '#retake-btn', function () { go('docs'); });
    var count = $$('span').filter(function (s) { return /fields extracted/.test(s.textContent || ''); })[0];
    var thumb = ctx.docs[0].thumb; var rx = $$('main i, main span').filter(function (n) { return n.children.length === 0 && n.textContent.trim() === 'Rx'; })[0];
    var tb = rx && rx.closest('.relative'); if (tb && thumb) tb.innerHTML = '<img alt="" class="w-full h-full object-cover rounded-lg" src="' + thumb + '">';
    var h4 = $$('h4').filter(function (h) { return /verify the details/i.test(h.textContent); })[0];
    if (h4) { var ps = $$('p', h4.parentElement); if (ps[0]) ps[0].textContent = ctx.lang === 'hi' ? 'यह जानकारी आपके दस्तावेज़ से पढ़ी गई है। डॉक्टर इसे उपयोग करने से पहले पुष्टि करेंगे।' : 'CareFlow read this from your pages. The doctor will confirm each item before it is used.'; if (ps[1]) ps[1].style.display = 'none'; }
    var lead = $$('main p').filter(function (p) { return /We extracted key information/.test(p.textContent || ''); })[0]; if (lead) lead.textContent = ctx.lang === 'hi' ? 'हमें आपके दस्तावेज़ों में ये बातें मिलीं।' : 'This is what we found in your pages.';
    function render() {
      host.innerHTML = ''; var n = 0, waiting = false;
      ctx.docs.forEach(function (d, di) {
        if (d.status !== 'done' && d.status !== 'failed') waiting = true;
        (d.findings || []).forEach(function (f) {
          n++; var r = tpl.cloneNode(true); var eb = $('button', r); if (eb) eb.remove();
          var spans = $$('span', r).filter(function (s) { return s.children.length === 0 && !s.classList.contains('material-symbols-outlined'); });
          if (spans[0]) spans[0].textContent = humanField(f.field) + (ctx.docs.length > 1 ? ' · ' + (ctx.lang === 'hi' ? 'पेज ' : 'page ') + (di + 1) : '');
          if (spans[1]) { spans[1].removeAttribute('id'); spans[1].textContent = f.value; }
          var low = f.confidence != null && f.confidence < 0.7;
          if (spans[2]) { spans[2].removeAttribute('id'); spans[2].textContent = (ctx.lang === 'hi' ? 'डॉक्टर पुष्टि करेंगे' : 'Doctor will confirm') + (low ? (ctx.lang === 'hi' ? ' · कम भरोसा' : ' · low confidence') : ''); }
          var ic = $('.material-symbols-outlined', r); if (ic) ic.textContent = /doctor|physician/i.test(f.field) ? 'person' : /date/i.test(f.field) ? 'calendar_today' : /diagnos|complaint|condition/i.test(f.field) ? 'stethoscope' : /drug|dose|dosage|medic|frequency|duration|route/i.test(f.field) ? 'medication' : 'description';
          if (low) r.style.opacity = '0.7'; host.appendChild(r);
        });
        if (d.status === 'failed' || (d.status === 'done' && !(d.findings || []).length)) {
          var r2 = tpl.cloneNode(true); var eb2 = $('button', r2); if (eb2) eb2.remove();
          var sp = $$('span', r2).filter(function (s) { return s.children.length === 0 && !s.classList.contains('material-symbols-outlined'); });
          if (sp[0]) sp[0].textContent = (ctx.lang === 'hi' ? 'पेज ' : 'Page ') + (di + 1); if (sp[1]) { sp[1].removeAttribute('id'); sp[1].textContent = ctx.lang === 'hi' ? 'कुछ पढ़ नहीं पाए' : 'Nothing could be read'; } if (sp[2]) { sp[2].removeAttribute('id'); sp[2].textContent = ctx.lang === 'hi' ? 'डॉक्टर तस्वीर देखेंगे' : 'The doctor will look at the photo'; }
          host.appendChild(r2);
        }
      });
      if (waiting && !n) { var w = el('p', 'p-4 text-sm font-semibold text-on-surface-variant', esc(docStateText('processing'))); host.appendChild(w); }
      if (count) count.textContent = n + (ctx.lang === 'hi' ? ' बातें मिलीं' : ' found');
      fixIcons(host);
    }
    render(); ctx.docs.forEach(function (d) { if (d.status !== 'done' && d.status !== 'failed') pollDoc(d, render); else if (!d.findings) pollDoc(d, render); });
    delegate('click', '#doc-review-continue-btn', function () { go('readback'); });
    delegate('click', '#doc-listen-btn', function () { var parts = []; ctx.docs.forEach(function (d) { (d.findings || []).forEach(function (f) { parts.push(humanField(f.field) + ': ' + f.value); }); }); say((ctx.lang === 'hi' ? 'हमें ये मिला। डॉक्टर पुष्टि करेंगे। ' : 'We found: ') + parts.join('. ')); });
  }

  // ── read-back: everything the patient said, in their words; tap one to change it ────────────────────────────────
  function summaryLine() {
    var parts = ctx.answered.map(function (a) { return chipLabel(a); });
    return (ctx.lang === 'hi' ? 'आपने बताया: ' : 'You told us: ') + parts.join(', ');
  }
  function bindReadback() {
    var reason = $('#summary-reason-en'), grid = reason && reason.closest('.grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!ctx.answered.length) grid.appendChild(el('p', 'text-sm text-on-surface-variant', esc(ctx.lang === 'hi' ? 'अभी कोई उत्तर नहीं है।' : 'No answers yet.')));
    ctx.answered.forEach(function (a) {
      var card = el('button', 'text-left p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3'); card.type = 'button';
      var faint = a.confidence != null && a.confidence < 0.7 ? ' opacity-70' : ''; card.className += faint;
      card.innerHTML = '<div class="min-w-0 flex-1"><span class="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block"></span><p class="text-sm font-bold text-on-surface mt-0.5"></p></div>' +
        (a.editable && a.question ? '<span class="material-symbols-outlined text-[16px] text-primary-container">edit</span>' : '');
      $('span', card).textContent = (a.question && (a.question.module_label || a.question.text)) || a.slot_id;
      $('p', card).textContent = chipLabel(a);
      if (a.editable && a.question) card.onclick = function () { ctx.editing = a; ctx.returnTo = 'readback'; save(); go(kindOf(a.question)); };
      grid.appendChild(card);
    });
    var docs = $('#summary-docs-section'); if (docs) { var sub = $$('span', docs).filter(function (s) { return /Uploaded for doctor/.test(s.textContent); })[0]; if (sub) sub.textContent = ctx.docs.length ? (ctx.docs.length + (ctx.lang === 'hi' ? ' पेज जुड़े' : ' page(s) attached')) : (ctx.lang === 'hi' ? 'कोई दस्तावेज़ नहीं' : 'None attached'); }
    var editAll = $('#edit-answers-btn'); if (editAll) editAll.style.display = 'none';
    var chk = $('#summaryConfirmCheck'); if (chk) { chk.checked = false; chk.dispatchEvent(new Event('change', { bubbles: true })); }
    delegate('click', '#submitSummaryBtn', function (btn) {
      if (!chk.checked) return toast(ctx.lang === 'hi' ? 'कृपया पुष्टि करें कि सारांश सही है।' : 'Please tick the box to confirm this is right.', 'check_box');
      btn.disabled = true;
      api('POST', '/sessions/' + ctx.sid + '/complete').then(function () { ctx.status = 'completed'; save(); go('done'); }).catch(function (e) { btn.disabled = false; fail(e); });
    });
    delegate('click', '#quickAudioBtn, #listenToggleBtn', function () { say(summaryLine()); });
    delegate('click', 'button[onclick*="document_capture"]', function () { go('docs'); });
  }

  // ── done ────────────────────────────────────────────────────────────────────────────────────────────────────────
  function bindDone() {
    var tokenEl = $('#queueTokenDisplay'); if (tokenEl) tokenEl.textContent = ctx.tokenNo || '—';
    var nameEl = $('#patientNameDisplay'); if (nameEl) nameEl.textContent = ctx.hospital || '';
    var room = $('#queueRoomDisplay'); if (room) room.textContent = ctx.lang === 'hi' ? 'आपका नंबर पुकारे जाने पर कमरे में जाएँ' : 'Go to the room when your number is called';
    var wait = $('#queueWaitDisplay'); if (wait) wait.style.display = 'none';
    var line = (ctx.lang === 'hi' ? 'सब तैयार है। आपकी टोकन संख्या ' : 'You are all set. Your token is ') + (ctx.tokenNo || '') + (ctx.lang === 'hi' ? '। कृपया बुलाए जाने का इंतज़ार करें।' : '. Please wait to be called.');
    delegate('click', '#voiceListenBtn', function () { say(line); });
    delegate('click', '#finishCareFlowBtn, #newSessionBtn', function () { try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.href = '../careflow_qr_welcome_landing/code.html'; });
    ready(function () { setTimeout(function () { say(line); }, 400); });
  }

  // ── boot ────────────────────────────────────────────────────────────────────────────────────────────────────────
  function kindPage(k) { return ({ single: bindSingle, multi: bindMulti, body: bindBody, face: bindFace, duration: bindDuration })[k]; }
  var BINDERS = { docs: bindDocs, tray: bindTray, review: bindReview, readback: bindReadback, done: bindDone, landing: bindLanding, language: bindLanguage, consent: bindConsent, abha: bindAbha, abhaOtp: bindAbhaOtp, attendant: bindAttendant, complaint: bindComplaint, redflag: bindRedFlag,
    single: bindSingle, multi: bindMulti, body: bindBody, face: bindFace, duration: bindDuration };
  window.CFL = { ctx: function () { return ctx; }, api: api, go: go, say: say, advance: advance, t: t, toast: toast, esc: esc, el: el, $: $, $$: $$, delegate: delegate, ready: ready, ended: ended, fail: fail, resume: resume, save: save, PAGE_KEY: PAGE_KEY, FILES: FILES, BINDERS: BINDERS, submit: submit, pick: pick, LANG_TAG: LANG_TAG };

  ready(function () {
    if (!PAGE_KEY) return;
    if (PAGE_KEY === 'landing') { takeSlipFromUrl(); mountWithdraw(); return BINDERS.landing(); }
    takeSlipFromUrl();
    if (!requireSession()) return;
    mountWithdraw();
    var bind = BINDERS[PAGE_KEY];
    if (bind) bind();
    if (window.CFL_EXTRA && window.CFL_EXTRA[PAGE_KEY]) window.CFL_EXTRA[PAGE_KEY]();
  });
})();
