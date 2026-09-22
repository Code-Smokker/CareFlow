/**
 * Ayurvediya Rugna Pariksha — the Ayurvedic case record page (careflow_website_a01_…).
 *
 * Everything on this page is rendered from what the gateway serves: the vocabulary
 * (GET /v1/ayurveda/vocabulary — no term, option or gloss is written here) and the record
 * (GET/PUT /v1/visits/{id}/ayurveda). Step 1 is read-only; Steps 2–5 are what the Vaidya records;
 * Step 6 is the merged case sheet and the existing sign flow.
 *
 * Mounted by careflow-live.js, which passes in the shared helpers.
 */
(function () {
  'use strict';

  const CARD = 'p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs';
  const BTN = 'h-10 px-5 rounded-full bg-[#0D6E6E] text-white font-bold text-sm shadow-sm hover:bg-[#005454] transition-all disabled:opacity-50';
  const RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E6E] focus-visible:ring-offset-2';
  const STATUS = {
    complete: ['check_circle', 'Complete', 'text-[#0D6E6E]'],
    in_progress: ['timelapse', 'In progress', 'text-amber-700'],
    not_started: ['radio_button_unchecked', 'Not started', 'text-slate-500'],
  };

  function mount(ctx) {
    const { api, esc, human, chip, banner, goto } = ctx;
    const live = window.CareFlowLive;
    const playBtn = live.u.playBtn;
    const $ = (s, r) => (r || document).querySelector(s);
    const navEl = $('#cf-a01-nav');
    const contentEl = $('#cf-a01-content');
    if (!ctx.visit) { contentEl.innerHTML = '<div class="' + CARD + ' text-sm text-slate-600">No visit selected. Open a patient from the dashboard, or start an intake in the patient app first.</div>'; $('#cf-a01-status').textContent = 'No visit'; return; }

    const S = { vocab: null, record: null, summary: null, step: new URLSearchParams(location.search).get('step') || 'prashna', draft: {}, saving: null, dx: { results: null, busy: null, msg: null }, signed: null };

    // ------------------------------------------------------------------ data
    async function load() {
      const [vocab, record] = await Promise.all([api('/v1/ayurveda/vocabulary'), api('/v1/visits/' + ctx.visit + '/ayurveda'), live.u.loadVoiceNotes(ctx.visit)]);
      S.vocab = vocab; S.record = record;
    }
    const fields = (step) => step.sections.flatMap((s) => s.fields);
    const allFields = () => S.vocab.steps.flatMap(fields);
    const stored = (id) => S.record.exam.find((e) => e.field_id === id);
    const val = (id) => (id in S.draft ? S.draft[id] : (stored(id) ? stored(id).value : null));
    const optLabel = (f, v) => { const o = (f.options || []).find((x) => x.value === v); return o ? o.label : String(v); };
    const dirty = () => Object.keys(S.draft).length;
    const locked = () => S.record.signed;

    // ------------------------------------------------------------------ nav
    function renderNav() {
      const v = S.vocab;
      const steps = [{ id: 'prashna', label: v.prashna.label, gloss: v.prashna.gloss }]
        .concat(v.steps.map((s) => ({ id: s.id, label: s.label, gloss: s.gloss })))
        .concat([{ id: v.summary_step.id, label: v.summary_step.label, gloss: v.summary_step.gloss }]);
      const comp = Object.fromEntries(S.record.completion.map((c) => [c.step_id, c]));
      navEl.innerHTML = steps.map((st, i) => {
        const c = comp[st.id]; const [icon, text, tone] = STATUS[(c && c.status) || 'not_started'];
        const count = c && c.required_total > 0 && st.id !== 'summary' ? ' · ' + c.filled + '/' + c.required_total : '';
        const active = st.id === S.step;
        return '<button type="button" data-act="step" data-step="' + st.id + '" ' + (active ? 'aria-current="step" ' : '') +
          'class="w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl border ' + RING + ' ' + (active ? 'bg-[#E6F7F2] border-[#0D6E6E]/40' : 'bg-white border-slate-200/80 hover:bg-slate-50') + '">' +
          '<span class="text-xs font-mono text-slate-500 pt-0.5">' + (i + 1) + '</span><span class="flex-1 min-w-0">' +
          '<span class="block text-sm font-bold text-[#0F1E36]">' + esc(st.label) + '</span>' +
          '<span class="block text-[11px] text-slate-500">' + esc(st.gloss) + '</span>' +
          '<span class="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ' + tone + '"><span class="material-symbols-outlined text-[14px]" aria-hidden="true">' + icon + '</span>' + text + count + '</span></span></button>';
      }).join('');
      $('#cf-a01-status').innerHTML = S.record.signed
        ? '<span class="material-symbols-outlined text-[16px]">verified</span><span class="font-bold">Signed by a physician</span>'
        : '<span class="font-bold text-[#0D6E6E]">Draft</span><span class="text-slate-300">•</span><span>' + esc(S.record.department || 'no department') + (S.record.ayush_mode ? ' (AYUSH intake)' : '') + '</span>';
      const rev = $('#cf-a01-review');
      if (S.vocab.status !== 'VERIFIED') { rev.textContent = 'Vocabulary ' + S.vocab.status; rev.classList.remove('hidden'); rev.title = S.vocab.review.note; }
    }

    // ------------------------------------------------------------------ step 1: Prashna (read-only)
    function renderPrashna() {
      const p = S.record.prashna; const v = S.vocab.prashna;
      let html = '<div><h2 class="text-lg font-bold text-[#0F1E36]">Step 1 · ' + esc(v.label) + '</h2><p class="text-xs text-slate-500">' + esc(v.gloss) + ' — read-only. ' + p.answered + ' of ' + p.total + ' questions answered. Chips show how each answer was given: <b>voice</b>, <b>tap</b> or <b>proxy</b> (answered by an attendant), with confidence.</p></div>';
      html += p.groups.map((g) => '<div class="' + CARD + ' space-y-2"><div class="border-b border-slate-200 pb-2"><h3 class="text-sm font-bold text-[#0c1b33]">' + esc(g.label) + '</h3><p class="text-[11px] text-slate-500">' + esc(g.gloss) + '</p></div>' +
        (g.items.length ? g.items.map((i) => '<div class="flex items-start justify-between gap-3 py-1 rounded-lg ' + (i.confidence < 0.6 ? 'bg-amber-50 px-2' : '') + '"><div><div class="text-[11px] text-slate-500">' + esc(i.question) + '</div><div class="text-xs font-semibold text-[#0c1b33]">' + esc(i.value_label) + '</div></div>' + '<div class="flex items-center gap-1.5">' + chip(i.source, i.confidence) + (i.source === 'voice' ? playBtn(i.slot_id) : '') + '</div></div>').join('') : '<p class="text-xs text-slate-400">Not answered by the patient.</p>') + '</div>').join('');
      html += p.prakriti_score ? prakritiPanel(p.prakriti_score) : '<p class="text-xs text-slate-500">No Prakriti questionnaire answers to score.</p>';
      contentEl.innerHTML = html;
    }
    function prakritiPanel(sc, compact) {
      return '<div class="rounded-xl border border-slate-200 bg-slate-50 p-3"><div class="text-sm font-bold text-[#0c1b33]">' + esc(sc.label) + '</div><div class="text-[11px] text-slate-500">' + esc(sc.gloss) + '</div>' +
        sc.counts.map((c) => '<div class="flex items-center gap-3 mt-1.5 text-xs"><span class="w-12">' + esc(c.label) + '</span><span class="flex-1 h-2 rounded-full bg-slate-200" aria-hidden="true"><span class="block h-2 rounded-full bg-[#0D6E6E]" style="width:' + (sc.total ? (c.count / sc.total) * 100 : 0) + '%"></span></span><span class="w-10 text-right font-mono">' + c.count + '/' + sc.total + '</span></div>').join('') +
        '<p class="mt-2 text-[11px] text-slate-500">' + sc.answered + ' of ' + sc.total + ' answered. Reference only — the Vaidya decides Prakriti.</p>' + (compact ? '' : '<p class="text-[11px] text-amber-800 mt-1">' + esc(sc.caveat) + '</p>') + '</div>';
    }

    // ------------------------------------------------------------------ steps 2–5: what the Vaidya records
    function refHtml(f) {
      const items = S.record.patient_reference[f.id] || [];
      return items.map((i) => '<div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-1"><span class="material-symbols-outlined text-[14px]" aria-hidden="true">person</span>Patient reported — ' + esc(i.question) + ': <b class="text-[#0c1b33]">' + esc(i.value_label) + '</b>' + chip(i.source, i.confidence) + '</div>').join('');
    }
    function metaHtml(f) {
      const s = stored(f.id); if (!s || f.id in S.draft) return '';
      const o = s.original;
      return '<div class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">' + chip('clinician', null, s.disposition !== 'entered' ? s.disposition : '') + '<span>' + esc(s.recorded_by) + ' · ' + esc(new Date(s.recorded_at).toLocaleString()) + '</span>' +
        (o ? '<span class="flex items-center gap-1.5">· ' + (s.disposition === 'confirmed' ? 'confirms' : 'overrides') + ' patient-reported <b class="text-[#0c1b33]">' + esc(o.value_label) + '</b>' + chip(o.source, o.confidence) + '</span>' : '') + '</div>';
    }
    function chipBtn(f, o, selected, suggested, multi) {
      const cls = selected ? 'border-[#0D6E6E] bg-[#E6F7F2] text-[#0D6E6E]' : suggested ? 'border-dashed border-[#0D6E6E] bg-white text-[#0c1b33]' : 'border-slate-300 bg-white text-[#0c1b33] hover:bg-slate-50';
      return '<button type="button" ' + (locked() ? 'disabled ' : '') + 'role="' + (multi ? 'checkbox' : 'radio') + '" aria-checked="' + selected + '" data-act="' + (multi ? 'toggle' : 'pick') + '" data-field="' + f.id + '" data-value="' + esc(o.value) + '" class="px-3 py-1.5 rounded-lg border text-left disabled:opacity-60 ' + RING + ' ' + cls + '"><span class="block text-xs font-bold">' + esc(o.label) + '</span><span class="block text-[11px] opacity-80">' + esc(o.gloss) + '</span>' + (suggested ? '<span class="block text-[11px] font-semibold text-[#0D6E6E]">Patient reported</span>' : '') + '</button>';
    }
    function control(f) {
      const v = val(f.id); const dis = locked() ? 'disabled' : '';
      if (f.type === 'text') return '<textarea id="f-' + f.id + '" data-act="text" data-field="' + f.id + '" rows="4" ' + dis + ' class="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-[#0c1b33] ' + RING + '">' + esc(typeof v === 'string' ? v : '') + '</textarea>';
      if (f.type === 'number') {
        const dobAge = f.id === vayaAgeId() && S.record.computed.vaya.age_source === 'dob' ? S.record.computed.vaya.age_years : null;
        return '<div class="flex items-center gap-2"><input id="f-' + f.id + '" type="number" inputmode="decimal" data-act="num" data-field="' + f.id + '" min="' + (f.min == null ? '' : f.min) + '" max="' + (f.max == null ? '' : f.max) + '" ' + dis + ' value="' + (typeof v === 'number' ? v : '') + '" placeholder="' + (dobAge != null ? dobAge : '') + '" class="h-10 w-32 rounded-xl border border-slate-300 bg-white px-3 text-sm ' + RING + '"><span class="text-xs text-slate-500">' + esc(f.unit || '') + '</span>' + (dobAge != null && v == null ? '<span class="text-[11px] text-slate-500">From date of birth: ' + dobAge + '</span>' : '') + '</div>';
      }
      if (f.type === 'enum' || f.type === 'enum_multi') {
        const multi = f.type === 'enum_multi'; const sel = multi ? (Array.isArray(v) ? v : []) : v == null ? [] : [String(v)];
        const ref = (S.record.patient_reference[f.id] || []).find((r) => r.suggested_value); const suggested = !multi && ref && v == null ? ref.suggested_value : null;
        return '<div role="' + (multi ? 'group' : 'radiogroup') + '" aria-labelledby="l-' + f.id + '" class="flex flex-wrap gap-2">' + f.options.map((o) => chipBtn(f, o, sel.indexOf(o.value) !== -1, suggested === o.value, multi)).join('') +
          (suggested && !locked() ? '<button type="button" data-act="pick" data-field="' + f.id + '" data-value="' + esc(suggested) + '" class="self-center px-3 py-1.5 rounded-full bg-[#0D6E6E] text-white text-xs font-bold ' + RING + '">Confirm “' + esc(optLabel(f, suggested)) + '”</button>' : '') + '</div>';
      }
      if (f.type === 'computed') return '<div data-computed="' + f.computed.kind + '" data-field="' + f.id + '" class="text-sm text-[#0c1b33]" aria-live="polite"></div>' + (f.source ? '<p class="text-[11px] text-slate-500 mt-1">Cut-offs: ' + esc(f.source) + '</p>' : '');
      if (f.type === 'namaste_codes') return diagnosisPicker(f);
      return '';
    }
    const vayaAgeId = () => { const f = allFields().find((x) => x.computed && x.computed.kind === 'vaya_band'); return f && f.computed.age_field; };
    function renderExam(step, index) {
      let html = '<div><h2 class="text-lg font-bold text-[#0F1E36]">Step ' + (index + 2) + ' · ' + esc(step.label) + '</h2><p class="text-xs text-slate-500">' + esc(step.gloss) + '</p></div>';
      if (locked()) html += '<div class="rounded-xl border border-[#0D6E6E]/30 bg-[#E6F7F2] px-3 py-2 text-xs text-[#0D6E6E] font-semibold">This visit is signed — the case record is read-only.</div>';
      html += step.sections.map((sec) => '<div class="' + CARD + ' space-y-4"><div class="border-b border-slate-200 pb-2"><h3 class="text-sm font-bold text-[#0c1b33]">' + esc(sec.label) + '</h3><p class="text-[11px] text-slate-500">' + esc(sec.gloss) + '</p></div>' +
        (sec.link_to_step ? '<button type="button" data-act="step" data-step="' + sec.link_to_step + '" class="text-xs font-semibold text-[#0D6E6E] underline">Open ' + esc(sec.label) + ' — patient-reported history (recorded at intake, not re-entered here)</button>' : '') +
        (sec.show_prakriti_score && S.record.prashna.prakriti_score ? prakritiPanel(S.record.prashna.prakriti_score, true) : '') +
        sec.fields.map((f) => '<div><label id="l-' + f.id + '" for="f-' + f.id + '" class="block"><span class="text-sm font-bold text-[#0c1b33]">' + esc(f.label) + '</span><span class="block text-[11px] text-slate-500">' + esc(f.gloss) + '</span></label><div class="mt-2">' + refHtml(f) + control(f) + metaHtml(f) + '</div></div>').join('') + '</div>').join('');
      if (!locked()) html += '<div class="sticky bottom-4 z-10 flex items-center gap-3 rounded-2xl bg-white/95 border border-slate-200 shadow-md px-4 py-3"><button type="button" id="cf-save" data-act="save" class="' + BTN + '">Save ' + esc(step.label) + '</button><span id="cf-save-note" class="text-xs text-slate-500" aria-live="polite"></span></div>';
      contentEl.innerHTML = html; updateComputed(); updateSaveBar();
    }
    function updateComputed() {
      contentEl.querySelectorAll('[data-computed]').forEach((el) => {
        const f = allFields().find((x) => x.id === el.getAttribute('data-field')); let text = null;
        if (f.computed.kind === 'bmi') {
          const h = val(f.computed.height_field), w = val(f.computed.weight_field);
          if (typeof h === 'number' && typeof w === 'number' && h > 0 && w > 0) text = Math.round((w / Math.pow(h / 100, 2)) * 10) / 10 + ' ' + (f.unit || '');
        } else {
          const entered = val(f.computed.age_field); const age = typeof entered === 'number' ? Math.floor(entered) : S.record.computed.vaya.age_years;
          const band = age == null ? null : (f.bands.find((b) => b.below_age_years === null || age < b.below_age_years) || null);
          if (band) text = band.label + ' — ' + band.gloss + ' (age ' + age + ')';
        }
        el.innerHTML = text ? '<span class="font-semibold">' + esc(text) + '</span> <span class="text-[11px] text-slate-500">calculated</span>' : '<span class="text-slate-400 text-xs">Calculated once the inputs above are entered.</span>';
      });
    }
    function updateSaveBar() {
      const btn = $('#cf-save'); if (!btn) return;
      btn.disabled = dirty() === 0 || !!S.saving;
      const note = $('#cf-save-note');
      if (note && !S.saving) note.textContent = dirty() ? dirty() + ' unsaved change' + (dirty() === 1 ? '' : 's') : (S.savedMsg || 'No unsaved changes');
    }

    // ------------------------------------------------------------------ diagnosis (Vyadhi Vinishchaya)
    function diagnosisPicker(f) {
      const picked = Array.isArray(val(f.id)) ? val(f.id) : []; const dis = locked();
      let html = '<div class="flex flex-col gap-2">';
      html += picked.map((d) => '<div class="flex items-start justify-between gap-3 rounded-xl border border-[#0D6E6E] bg-[#E6F7F2]/60 px-3 py-2"><div><div class="text-sm font-bold text-[#0c1b33]">' + esc(d.display) + '</div><div class="text-[11px] font-mono text-slate-600">NAMASTE ' + esc(d.code) + '</div><div class="text-[11px] text-slate-600">' + (d.icd11 ? 'ICD-11 TM2 ' + esc(d.icd11.code) + (d.icd11.display ? ' — ' + esc(d.icd11.display) : '') + (d.mapping_reviewed ? '' : ' <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Mapping not yet reviewed</span>') : '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">No ICD-11 TM2 link</span>') + '</div></div>' + (dis ? '' : '<button type="button" data-act="dx-remove" data-code="' + esc(d.code) + '" aria-label="Remove ' + esc(d.display) + '" class="text-xs px-2 py-1 rounded-lg border border-slate-300 hover:bg-white ' + RING + '">Remove</button>') + '</div>').join('');
      if (!dis) {
        html += '<div class="flex items-center gap-2"><label class="sr-only" for="dx-q">Search NAMASTE diagnoses</label><input id="dx-q" type="text" placeholder="Search NAMASTE — e.g. amavata, jwara…" class="flex-1 h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm ' + RING + '"><button type="button" data-act="dx-search" class="' + BTN + '">' + (S.dx.busy === 'search' ? 'Searching…' : 'Search') + '</button></div><p class="text-[11px] text-slate-500">Results are listed alphabetically. CareFlow does not suggest or rank a diagnosis — you pick.</p>';
        if (S.dx.msg) html += '<p role="alert" class="text-xs text-amber-800">' + esc(S.dx.msg) + '</p>';
        if (S.dx.results) html += '<ul aria-label="NAMASTE search results" class="flex flex-col gap-1.5 max-h-72 overflow-auto">' + (S.dx.results.length ? S.dx.results.map((c) => '<li class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"><span class="text-xs"><span class="text-[#0c1b33]">' + esc(c.display) + '</span> <span class="font-mono text-slate-500">' + esc(c.code) + '</span></span><button type="button" data-act="dx-pick" data-code="' + esc(c.code) + '" ' + (picked.some((d) => d.code === c.code) ? 'disabled' : '') + ' aria-label="Pick ' + esc(c.display) + '" class="text-xs font-bold px-3 py-1 rounded-full border border-[#0D6E6E] text-[#0D6E6E] hover:bg-[#E6F7F2] disabled:opacity-50 ' + RING + '">' + (picked.some((d) => d.code === c.code) ? 'Picked' : S.dx.busy === c.code ? 'Picking…' : 'Pick') + '</button></li>').join('') : '<li class="text-xs text-slate-500">No NAMASTE concepts match.</li>') + '</ul>';
      }
      return html + '</div>';
    }
    async function dxSearch() {
      const q = ($('#dx-q') || {}).value; if (!q || !q.trim()) return;
      S.dx.busy = 'search'; S.dx.msg = null; render();
      try { const r = await api('/v1/terminology/search?q=' + encodeURIComponent(q.trim()) + '&system=namaste'); S.dx.results = r.slice().sort((a, b) => a.display.localeCompare(b.display)); }
      catch (e) { S.dx.results = []; S.dx.msg = e.message; }
      S.dx.busy = null; render(); const box = $('#dx-q'); if (box) box.value = q;
    }
    async function dxPick(code) {
      const c = (S.dx.results || []).find((x) => x.code === code); if (!c) return;
      const id = 'vyadhi_vinishchaya.diagnosis.codes'; const cur = Array.isArray(val(id)) ? val(id) : [];
      if (cur.some((d) => d.code === code)) return;
      S.dx.busy = code; render();
      let icd11 = null, reviewed = false;
      try { const t = await api('/v1/terminology/translate', { method: 'POST', body: JSON.stringify({ system: 'namaste', code, target: 'icd11-tm2' }) }); if (t.matched && t.target_code) { icd11 = { code: t.target_code, display: t.target_display || null }; reviewed = !!t.reviewed_by; } }
      catch (e) { S.dx.msg = 'Picked, but the ICD-11 TM2 link could not be fetched — recorded as unlinked.'; }
      S.draft[id] = cur.concat([{ code: c.code, display: c.display, icd11, mapping_reviewed: reviewed }]); S.dx.busy = null; render();
    }

    // ------------------------------------------------------------------ step 6: summary + sign
    async function renderSummary() {
      const step = S.vocab.summary_step;
      contentEl.innerHTML = '<div><h2 class="text-lg font-bold text-[#0F1E36]">Step 6 · ' + esc(step.label) + '</h2><p class="text-xs text-slate-500">' + esc(step.gloss) + '</p></div><div class="' + CARD + ' text-xs text-slate-500">Loading the case sheet…</div>';
      try { S.summary = await api('/v1/visits/' + ctx.visit + '/summary'); } catch (e) { banner(e.message); return; }
      const sections = S.summary.ayurveda_sections || []; const open = S.summary.red_flags.filter((f) => !f.acknowledged_by);
      const incomplete = S.record.completion.filter((c) => c.step_id !== 'summary' && c.status !== 'complete').map((c) => c.step_id.replace(/_/g, ' '));
      let html = '<div><h2 class="text-lg font-bold text-[#0F1E36]">Step 6 · ' + esc(step.label) + '</h2><p class="text-xs text-slate-500">' + esc(step.gloss) + '. The same rows print on the A4 view.</p></div>';
      html += '<div class="' + CARD + ' space-y-3">' + (sections.length ? live.caseSheetHtml(sections, S.vocab.status) : '<p class="text-xs text-slate-500">No Ayurvedic findings recorded yet — complete Steps 2–5 first.</p>') + '</div>';
      html += '<div class="' + CARD + ' space-y-3"><h3 class="text-sm font-bold text-[#0c1b33]">Sign • हस्ताक्षर</h3>';
      if (open.length) html += '<p class="text-xs text-red-700">' + open.length + ' unacknowledged red flag(s) — acknowledge them from the alerts page before signing.</p>';
      if (incomplete.length && !S.record.signed) html += '<p class="text-xs text-amber-700">Case record not complete: ' + esc(incomplete.join(', ')) + '. Signing includes only what is recorded.</p>';
      if (S.record.signed || S.signed) {
        const r = S.signed;
        html += '<p class="text-xs font-semibold text-[#0D6E6E]">Signed.' + (r ? ' Bundle ' + esc(r.fhir_bundle_id) + ' · ABDM ' + esc(r.abdm_status) + ' · care context ' + esc(r.care_context_status) : '') + '</p><a class="text-xs font-semibold text-[#0D6E6E] underline" target="_blank" rel="noopener" href="' + esc(ctx.API) + '/v1/visits/' + esc(ctx.visit) + '/printable-summary">Open the A4 print view</a>';
      } else {
        html += '<p class="text-xs text-slate-500">Signing assembles the FHIR bundle, validates it against the local HAPI server (it fails on any error) and attempts the ABDM care-context link (mocked unless a sandbox key is configured). The physician signs; until then this is a draft.</p><div class="flex items-center gap-3"><button type="button" id="cf-sign" data-act="sign" class="' + BTN + '">Sign this visit</button><span id="cf-sign-note" class="text-xs text-slate-500" aria-live="polite"></span></div>';
      }
      contentEl.innerHTML = html + '</div>';
    }
    async function sign() {
      const btn = $('#cf-sign'), note = $('#cf-sign-note'); btn.disabled = true; note.textContent = 'Signing…';
      try { S.signed = await api('/v1/visits/' + ctx.visit + '/sign', { method: 'POST', body: JSON.stringify({ signed_by: ctx.ACTOR }) }); await load(); render(); }
      catch (e) { btn.disabled = false; note.textContent = ''; banner(e.message); }
    }

    // ------------------------------------------------------------------ save
    async function save() {
      if (!dirty() || S.saving) return;
      S.saving = true; const note = $('#cf-save-note'); const btn = $('#cf-save'); btn.disabled = true; if (note) note.textContent = 'Saving…';
      const n = dirty();
      try {
        S.record = await api('/v1/visits/' + ctx.visit + '/ayurveda', { method: 'PUT', body: JSON.stringify({ recorded_by: ctx.ACTOR, fields: Object.keys(S.draft).map((id) => ({ field_id: id, value: S.draft[id] })) }) });
        S.draft = {}; S.savedMsg = 'Saved ' + n + ' field' + (n === 1 ? '' : 's') + '.';
      } catch (e) { banner(e.message); }
      S.saving = false; render();
    }

    // ------------------------------------------------------------------ render + events
    function render() {
      renderNav();
      if (S.step === 'prashna') return renderPrashna();
      if (S.step === S.vocab.summary_step.id) return renderSummary();
      const i = S.vocab.steps.findIndex((s) => s.id === S.step);
      if (i === -1) { S.step = 'prashna'; return renderPrashna(); }
      renderExam(S.vocab.steps[i], i);
    }
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]'); if (!el || !contentEl.contains(el) && !navEl.contains(el)) return;
      const act = el.getAttribute('data-act'), field = el.getAttribute('data-field'), value = el.getAttribute('data-value');
      if (act === 'step') { S.step = el.getAttribute('data-step'); S.savedMsg = null; S.dx.results = null; history.replaceState(null, '', location.pathname + '?visit=' + encodeURIComponent(ctx.visit) + '&step=' + S.step); render(); window.scrollTo({ top: 0 }); }
      else if (act === 'pick') { const cur = stored(field); if (cur && cur.value === value) delete S.draft[field]; else S.draft[field] = value; S.savedMsg = null; render(); }
      else if (act === 'toggle') { const cur = Array.isArray(val(field)) ? val(field) : []; S.draft[field] = cur.indexOf(value) !== -1 ? cur.filter((x) => x !== value) : cur.concat([value]); S.savedMsg = null; render(); }
      else if (act === 'save') save();
      else if (act === 'sign') sign();
      else if (act === 'dx-search') dxSearch();
      else if (act === 'dx-pick') dxPick(el.getAttribute('data-code'));
      else if (act === 'dx-remove') { const id = 'vyadhi_vinishchaya.diagnosis.codes'; S.draft[id] = (val(id) || []).filter((d) => d.code !== el.getAttribute('data-code')); S.savedMsg = null; render(); }
    });
    document.addEventListener('input', (e) => {
      const el = e.target; const act = el.getAttribute && el.getAttribute('data-act'); if (act !== 'text' && act !== 'num') return;
      const id = el.getAttribute('data-field');
      S.draft[id] = act === 'text' ? el.value : el.value === '' ? null : Number(el.value); S.savedMsg = null;
      updateComputed(); updateSaveBar();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target && e.target.id === 'dx-q') { e.preventDefault(); dxSearch(); } });

    load().then(() => {
      const t = ctx.visit ? ctx.visit.slice(0, 8) : '';
      $('#cf-a01-patient').textContent = 'Visit #' + t;
      // Names for a walk-in visit come from the queue token, when it is still there.
      api('/v1/visits/queue').then((q) => { const tok = q.find((x) => x.visit_id === ctx.visit); if (tok) $('#cf-a01-patient').textContent = tok.token_no; }).catch(() => {});
      render();
    }).catch((e) => { banner(e.message); contentEl.innerHTML = '<div class="' + CARD + ' text-sm text-slate-600">The case record could not be loaded: ' + esc(e.message) + '</div>'; });
  }

  window.CareFlowAyurveda = { mount: mount };
})();
