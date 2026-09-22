/**
 * CareFlow live pages — replaces the sample content of the remaining doctor pages with real data.
 *
 * Each page keeps its own chrome (sidebar, top bar, breadcrumb, header, styling); everything
 * below the header is removed and rendered from the gateway with the pages' own utility classes.
 * Where no backend exists (appointments, login), the page says so — it does not invent content.
 *
 * Loaded on demand by careflow-live.js, which passes the shared helpers in.
 */
(function () {
  'use strict';
  const L = () => window.CareFlowLive;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // ------------------------------------------------------------------ markup helpers
  const CARD = 'p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs';
  const card = (title, sub, body, right) =>
    '<div class="' + CARD + ' space-y-3.5"><div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"><div><h3 class="text-sm font-bold text-[#0c1b33]">' + title + '</h3>' + (sub ? '<p class="text-[11px] text-slate-500">' + sub + '</p>' : '') + '</div>' + (right || '') + '</div>' + body + '</div>';
  const btn = (label, attrs, primary) => '<button type="button" ' + (attrs || '') + ' class="' + (primary ? 'h-10 px-5 rounded-full bg-[#0D6E6E] hover:bg-[#005454] text-white font-bold text-xs shadow-sm' : 'h-9 px-4 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs') + ' disabled:opacity-50">' + label + '</button>';
  const empty = (msg) => '<p class="text-xs text-slate-500 py-2">' + msg + '</p>';
  const stat = (label, value, note) => '<div class="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs"><div class="text-[11px] font-medium text-slate-500">' + label + '</div><div class="text-2xl font-bold text-[#0c1b33] mt-1">' + value + '</div>' + (note ? '<div class="text-[11px] text-slate-500 mt-0.5">' + note + '</div>' : '') + '</div>';

  /** Keep the page chrome up to and including the header; drop everything after it, then append our body. */
  function mountBody(html) {
    const main = $('main'); if (!main) return null;
    let holder = main;
    // Some pages wrap the whole layout in single-child divs; descend to the level that actually has siblings.
    while (holder.children.length === 1 && holder.children[0].tagName === 'DIV') holder = holder.children[0];
    const kids = Array.from(holder.children);
    // The header is the first block with a page heading (h1, else the first h2/h3); keep it, drop the rest.
    let headerIdx = kids.findIndex((k) => k.querySelector('h1'));
    if (headerIdx < 0) headerIdx = kids.findIndex((k) => k.querySelector('h2, h3'));
    if (headerIdx < 0) headerIdx = 0;
    kids.slice(headerIdx + 1).forEach((k) => k.remove());
    const body = document.createElement('div');
    body.id = 'cf-live-body'; body.className = 'flex flex-col gap-5 mt-5'; body.innerHTML = html;
    holder.appendChild(body);
    return body;
  }

  function textSwap(re, rep) {
    const w = document.createTreeWalker($('main') || document.body, NodeFilter.SHOW_TEXT); const ns = []; while (w.nextNode()) ns.push(w.currentNode);
    ns.forEach((n) => { if (n.parentElement && !n.parentElement.closest('#cf-live-body') && re.test(n.nodeValue)) { re.lastIndex = 0; n.nodeValue = n.nodeValue.replace(re, rep); } re.lastIndex = 0; });
  }

  /** For pages whose sample content is spread through the whole main area: rebuild it, keeping only the chrome around it. */
  function mountFull(title, sub, html) {
    const main = $('main'); if (!main) return null;
    main.innerHTML = '<div class="p-8 max-w-7xl w-full mx-auto"><div class="mb-5"><h1 class="text-2xl lg:text-3xl font-bold text-[#0c1b33] tracking-tight">' + title + '</h1><p class="text-sm text-slate-500 mt-1">' + sub + '</p></div><div id="cf-live-body" class="flex flex-col gap-5">' + html + '</div></div>';
    return $('#cf-live-body');
  }

  /** Static identity strings from the design → the real patient. Applied to text nodes only. */
  function bindIdentity(token, summary, sidebarOnly) {
    const u = L().u; const w = token ? u.who(token) : { name: 'Visit ' + u.short(summary && summary.visit_id), initials: '?', demo: 'Age and sex not recorded' };
    const map = [
      [/Aarav Sharma['’]s/g, w.name + '’s'], [/Aarav Sharma/g, w.name], [/आरव शर्मा/g, ''], [/CF-1024/g, token ? token.token_no : 'no token'],
      [/28 Y \/ M/g, w.demo], [/28 years/g, w.demo], [/91-\d{4}-\d{4}-\d{2,4}/g, 'not linked'], [/ABHA Sync: Active/g, 'ABHA: not linked'],
      [/ABDM Verified Vault/g, 'Documents for this visit'], [/Dr\. Ananya Iyer/g, 'Clinician'], [/Ananya Iyer/g, 'Clinician'], [/\bAnanya\b/g, 'Clinician'], [/Desk 4 • OPD Session/g, 'OPD session'], [/Desk \d\b/g, 'OPD'], [/Dr\. Priya Sharma/g, 'Clinician'],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    if (sidebarOnly) map.splice(0, 8);
    nodes.forEach((n) => { if (!n.parentElement || /SCRIPT|STYLE/.test(n.parentElement.tagName) || n.parentElement.closest('#cf-live-body')) return; let t = n.nodeValue; map.forEach(([re, rep]) => (t = t.replace(re, rep))); if (t !== n.nodeValue) n.nodeValue = t; });
    $$('footer').forEach((f) => { f.innerHTML = '<div class="flex items-center gap-2 text-xs text-slate-500"><span class="material-symbols-outlined text-[18px] text-[#0D6E6E]">lock</span><span class="font-bold text-[#0F1E36]">Every read and write of this record is written to the append-only audit log.</span><span>CareFlow structures history; it does not diagnose. The physician signs.</span></div>'; });
    return w;
  }

  // ------------------------------------------------------------------ shared data
  async function load(ctx) {
    const u = L().u; const q = await u.queue(); const visit = ctx.visit;
    const token = q.find((t) => t.visit_id === visit) || null;
    let summary;
    try { summary = await u.api('/v1/visits/' + visit + '/summary'); }
    catch (e) { if (e.status !== 404) throw e; summary = { visit_id: visit, fields: [], red_flags: token ? token.red_flags.filter((f) => !f.acknowledged_by) : [], signed: false, ayurveda_sections: [], session_id: null, pending: true }; }
    const docs = await u.api('/v1/visits/' + visit + '/documents').catch(() => []);
    return { token, summary, docs, q };
  }
  const fieldRows = (fields, u) => fields.length ? fields.map((f) => '<div class="flex items-start justify-between gap-3 py-1.5 border-b border-slate-50 last:border-0"><div><div class="text-[11px] text-slate-500">' + u.esc(u.hpiLabel(f)) + '</div><div class="text-xs font-semibold text-[#0c1b33]">' + u.esc(u.human(f.value)) + '</div></div><div class="flex items-center gap-1.5">' + u.chip(f.source, f.confidence) + (f.source === 'voice' ? u.playBtn(f.field_path.split('.').pop()) : '') + '</div></div>').join('') : empty('Nothing recorded yet.');
  const pendingNote = (d) => d.summary.pending ? '<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 font-semibold">Intake is in progress — the patient has not finished answering, so there is no summary yet. This page fills in as they answer.</div>' : '';

  // ------------------------------------------------------------------ w06 / w07 / w08 / w12: the patient's own answers
  async function answers(ctx, kind) {
    const u = L().u; const d = await load(ctx); await u.loadVoiceNotes(ctx.visit); const h = u.hpi(d.summary); const f = u.fieldMap(d.summary);
    const complaint = f.chief_complaint ? u.human(f.chief_complaint.value) : 'Not recorded yet';
    const ay = await u.api('/v1/visits/' + ctx.visit + '/ayurveda').catch(() => null);
    const prashna = ay ? ay.prashna.groups.filter((g) => g.id !== 'pradhana_vedana' && g.items.length) : [];
    bindIdentity(d.token, d.summary);
    let html = pendingNote(d);
    html += card('Chief complaint • मुख्य समस्या', 'Patient-reported', '<div class="text-sm font-bold text-[#0c1b33]">' + u.esc(complaint) + '</div>', f.chief_complaint ? u.chip(f.chief_complaint.source, f.chief_complaint.confidence) : '');
    html += card('History of present illness • वर्तमान बीमारी', h.length + ' answers, each with how it was given and how confident the system is', fieldRows(h, u));
    if (kind !== 'w07') {
      html += prashna.length ? prashna.map((g) => card(u.esc(g.label) + ' • ' + u.esc(g.gloss), 'Ayurvedic Prashna — patient-reported', g.items.map((i) => '<div class="flex items-start justify-between gap-3 py-1.5 border-b border-slate-50 last:border-0"><div><div class="text-[11px] text-slate-500">' + u.esc(i.question) + '</div><div class="text-xs font-semibold text-[#0c1b33]">' + u.esc(i.value_label) + '</div></div><div class="flex items-center gap-1.5">' + u.chip(i.source, i.confidence) + (i.source === 'voice' ? u.playBtn(i.slot_id) : '') + '</div></div>').join(''))).join('') : '';
      if (ay && ay.prashna.prakriti_score) { const sc = ay.prashna.prakriti_score; html += card(u.esc(sc.label), 'Reference only — the Vaidya decides Prakriti', sc.counts.map((c) => '<div class="flex items-center gap-3 text-xs"><span class="w-12">' + u.esc(c.label) + '</span><span class="flex-1 h-2 rounded-full bg-slate-200"><span class="block h-2 rounded-full bg-[#0D6E6E]" style="width:' + (sc.total ? (c.count / sc.total) * 100 : 0) + '%"></span></span><span class="w-10 text-right font-mono">' + c.count + '/' + sc.total + '</span></div>').join('') + '<p class="text-[11px] text-amber-800">' + u.esc(sc.caveat) + '</p>'); }
    }
    if (kind === 'w12') {
      const say = [complaint].concat(h.map((x) => u.hpiLabel(x) + ': ' + u.human(x.value))).join('. ');
      html += card('Read back to patient • मरीज को पढ़कर सुनाएँ', 'Plays the structured summary aloud in the browser voice — the patient confirms or corrects', '<p class="text-xs text-slate-600 leading-relaxed">' + u.esc(say) + '</p><div class="flex gap-2">' + btn('Read aloud', 'id="cf-say"', true) + btn('Stop', 'id="cf-stop"') + '</div>');
      html += '<div class="flex justify-end gap-2">' + btn('Continue to alerts →', 'id="cf-next"', true) + '</div>';
    }
    mountBody(html);
    if (kind === 'w08') textSwap(/\b12 [Aa]nswered\b/g, h.length + ' answered');
    if (kind === 'w12') {
      const say = [complaint].concat(h.map((x) => u.hpiLabel(x) + ': ' + u.human(x.value))).join('. ');
      $('#cf-say').onclick = () => { if (!('speechSynthesis' in window)) { u.banner('This browser has no speech synthesis.'); return; } window.speechSynthesis.cancel(); const t = new SpeechSynthesisUtterance(say); t.lang = 'en-IN'; window.speechSynthesis.speak(t); };
      $('#cf-stop').onclick = () => window.speechSynthesis && window.speechSynthesis.cancel();
      $('#cf-next').onclick = () => u.goto('w13', ctx.visit);
    }
  }

  // ------------------------------------------------------------------ w09 documents (list + upload)
  const TYPE_LABEL = { prescription: 'Prescription', lab: 'Lab report', discharge: 'Discharge summary', imaging: 'Imaging', unknown: 'Document' };
  const STATUS_PILL = { queued: ['Queued', 'bg-slate-100 text-slate-600'], processing: ['Processing', 'bg-amber-100 text-amber-800'], done: ['Processed', 'bg-[#E6F7F2] text-[#0D6E6E]'], failed: ['Failed', 'bg-red-100 text-red-700'] };

  function docCard(d, u, ctx) {
    const [st, cls] = STATUS_PILL[d.ocr_status] || STATUS_PILL.queued;
    const ex = d.extractions.slice(0, 6);
    const unconfirmed = d.extractions.filter((e) => !e.confirmed_by).length;
    return '<div class="' + CARD + ' space-y-3" data-doc="' + u.esc(d.document_id) + '"><div class="flex items-start justify-between gap-3"><div><div class="flex items-center gap-2"><h4 class="text-sm font-bold text-[#0c1b33]">' + TYPE_LABEL[d.type] + '</h4><span class="px-2 py-0.5 rounded-full text-[11px] font-bold ' + cls + '">' + st + '</span>' + (unconfirmed && d.ocr_status === 'done' ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">' + unconfirmed + ' to confirm</span>' : '') + '</div><p class="text-[11px] text-slate-500 mt-0.5">' + (d.page_count ? d.page_count + ' page' + (d.page_count === 1 ? '' : 's') + ' • ' : '') + 'Uploaded ' + u.esc(new Date(d.created_at).toLocaleString()) + (d.quality_score != null ? ' • scan quality ' + Math.round(d.quality_score * 100) + '%' : '') + '</p></div><div class="flex gap-2">' + '<a href="' + u.esc(u.API) + '/v1/documents/' + u.esc(d.document_id) + '/file" target="_blank" rel="noopener" class="h-9 px-4 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs inline-flex items-center">View original</a>' + btn('Review extraction →', 'data-review="' + u.esc(d.document_id) + '"', true) + '</div></div>' +
      (ex.length ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">' + ex.map((e) => '<div class="flex items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200/70 px-3 py-1.5"><span class="text-xs"><span class="text-slate-500">' + u.esc(e.field) + ':</span> <span class="font-semibold text-[#0c1b33]">' + u.esc(e.value) + '</span></span>' + (e.confidence != null ? u.chip('ocr', e.confidence) : '') + '</div>').join('') + '</div>' : (d.ocr_status === 'done' ? empty('No values were extracted from this document.') : d.ocr_status === 'failed' ? empty('Reading this document failed. Upload a clearer photo.') : empty('Reading the document… values appear here when it finishes.'))) + '</div>';
  }

  async function documents(ctx) {
    const u = L().u; let d = await load(ctx); let filter = 'all'; let busy = false;
    bindIdentity(d.token, d.summary);
    const sessionId = d.token && d.token.session_id;
    const draw = () => {
      const docs = d.docs.filter((x) => filter === 'all' || x.type === filter);
      const pages = d.docs.reduce((n, x) => n + (x.page_count || 0), 0);
      $('#cf-live-body').innerHTML =
        '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">' + stat('Total documents', d.docs.length) + stat('Processed', d.docs.filter((x) => x.ocr_status === 'done').length) + stat('Values to confirm', d.docs.reduce((n, x) => n + x.extractions.filter((e) => !e.confirmed_by).length, 0), 'Handwriting is never auto-accepted') + stat('Pages', pages || '—') + '</div>' +
        card('Add a document • दस्तावेज़ जोड़ें', 'Prescriptions, lab reports, discharge summaries — read by OCR, confirmed by a person', '<div id="cf-drop" class="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center"><p class="text-xs text-slate-600 mb-3">Drop a photo or PDF here, or choose one.</p><div class="flex flex-wrap items-center justify-center gap-2"><label class="sr-only" for="cf-type">Document type</label><select id="cf-type" class="h-9 px-3 rounded-full border border-slate-300 text-xs"><option value="prescription">Prescription</option><option value="lab_report">Lab report</option><option value="discharge_summary">Discharge summary</option><option value="other">Other</option></select>' + btn('Take photo', 'id="cf-photo"') + btn(busy ? 'Uploading…' : 'Browse files', 'id="cf-browse" ' + (busy || !sessionId ? 'disabled' : ''), true) + '</div>' + (sessionId ? '' : '<p class="text-[11px] text-red-700 mt-2">This visit has no intake session to attach a document to.</p>') + '<input id="cf-file" type="file" accept="image/*,application/pdf" class="hidden"><input id="cf-cam" type="file" accept="image/*" capture="environment" class="hidden"></div>') +
        '<div class="flex flex-wrap items-center gap-2">' + [['all', 'All'], ['lab', 'Lab reports'], ['prescription', 'Prescriptions'], ['discharge', 'Discharge'], ['imaging', 'Imaging']].map(([k, l]) => '<button type="button" data-filter="' + k + '" class="h-8 px-3 rounded-full border text-xs font-semibold ' + (filter === k ? 'bg-[#E6F7F2] border-[#0D6E6E]/40 text-[#0D6E6E]' : 'bg-white border-slate-300 text-slate-600') + '">' + l + (k !== 'all' ? ' (' + d.docs.filter((x) => x.type === k).length + ')' : '') + '</button>').join('') + '</div>' +
        (docs.length ? docs.map((x) => docCard(x, u, ctx)).join('') : card('Patient documents • मरीज के दस्तावेज़', '', empty(d.docs.length ? 'No documents of this type.' : 'No documents uploaded for this visit yet. The patient can photograph them during intake, or you can add one above.')));
      $$('[data-filter]').forEach((b) => (b.onclick = () => { filter = b.getAttribute('data-filter'); draw(); }));
      $$('[data-review]').forEach((b) => (b.onclick = () => (location.href = '../careflow_website_w10_document_review/code.html?visit=' + encodeURIComponent(ctx.visit) + '&doc=' + encodeURIComponent(b.getAttribute('data-review')))));
      const upload = async (file) => {
        if (!file || !sessionId) return; busy = true; draw();
        const fd = new FormData(); fd.append('file', file); fd.append('doc_type_hint', ($('#cf-type') || {}).value || 'other');
        try { const res = await fetch(u.API + '/v1/sessions/' + sessionId + '/documents', { method: 'POST', body: fd }); const body = await res.json().catch(() => null); if (!res.ok) throw new Error((body && body.error && body.error.message) || 'Upload failed (' + res.status + ')'); window.CareFlow.showToast('Uploaded — reading the document…', 'success'); poll(); }
        catch (e) { u.banner(e.message); }
        busy = false; d.docs = await u.api('/v1/visits/' + ctx.visit + '/documents').catch(() => d.docs); draw();
      };
      const wire = (id) => { const el = $(id); if (el) el.onchange = () => upload(el.files[0]); };
      wire('#cf-file'); wire('#cf-cam');
      const browse = $('#cf-browse'); if (browse) browse.onclick = () => $('#cf-file').click();
      const photo = $('#cf-photo'); if (photo) photo.onclick = () => $('#cf-cam').click();
      const drop = $('#cf-drop'); if (drop) { drop.ondragover = (e) => { e.preventDefault(); }; drop.ondrop = (e) => { e.preventDefault(); upload(e.dataTransfer.files[0]); }; }
    };
    let polls = 0;
    const poll = () => { const t = setInterval(async () => { polls += 1; d.docs = await u.api('/v1/visits/' + ctx.visit + '/documents').catch(() => d.docs); draw(); if (polls > 40 || d.docs.every((x) => x.ocr_status === 'done' || x.ocr_status === 'failed')) clearInterval(t); }, 3000); };
    mountBody(''); draw();
    $$('button').filter((b) => /Upload document/.test(b.textContent) && !b.closest('#cf-live-body')).forEach((b) => { b.onclick = () => { const f = document.getElementById('cf-file'); if (f && !f.disabled) f.click(); else u.banner('This visit has no intake session to attach a document to.'); }; });
    if (d.docs.some((x) => x.ocr_status === 'queued' || x.ocr_status === 'processing')) poll();
  }

  // ------------------------------------------------------------------ w10 document review (preview + confirm)
  async function review(ctx) {
    const u = L().u; const d = await load(ctx); bindIdentity(d.token, d.summary);
    const wanted = new URLSearchParams(location.search).get('doc');
    let doc = d.docs.find((x) => x.document_id === wanted) || d.docs[0];
    if (!doc) { mountBody(card('Review document • दस्तावेज़ की समीक्षा', '', empty('This visit has no documents yet. Upload one from the Documents page.') + btn('Go to documents', 'id="cf-go"', true))); $('#cf-go').onclick = () => u.goto('w09', ctx.visit); return; }
    const draw = () => {
      const pending = doc.extractions.filter((e) => !e.confirmed_by);
      const [st, cls] = STATUS_PILL[doc.ocr_status] || STATUS_PILL.queued;
      $('#cf-live-body').innerHTML =
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">' +
        card('Original document', TYPE_LABEL[doc.type] + ' • uploaded ' + u.esc(new Date(doc.created_at).toLocaleString()), '<div class="rounded-xl border border-slate-200 bg-slate-50 min-h-[320px] flex items-center justify-center overflow-hidden"><img id="cf-img" alt="Uploaded ' + u.esc(TYPE_LABEL[doc.type]) + '" class="max-h-[640px] w-full object-contain" src="' + u.esc(u.API) + '/v1/documents/' + u.esc(doc.document_id) + '/file"></div>', '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold ' + cls + '">' + st + '</span>') +
        '<div class="flex flex-col gap-5">' +
        card('Extracted information • निकाली गई जानकारी', pending.length + ' of ' + doc.extractions.length + ' values still need a person to confirm. Handwritten text is never auto-accepted.',
          doc.extractions.length ? doc.extractions.map((e) => '<div class="flex items-center justify-between gap-3 rounded-xl border ' + (e.confirmed_by ? 'border-[#0D6E6E]/30 bg-[#E6F7F2]/40' : 'border-slate-200 bg-white') + ' px-3 py-2"><div><div class="text-[11px] text-slate-500">' + u.esc(e.field) + '</div><div class="text-sm font-semibold text-[#0c1b33]">' + u.esc(e.value) + '</div><div class="flex items-center gap-1.5 mt-0.5">' + (e.confidence != null ? u.chip('ocr', e.confidence) : '') + (e.confirmed_by ? '<span class="text-[11px] text-[#0D6E6E] font-semibold">Confirmed by ' + u.esc(e.confirmed_by) + '</span>' : '') + '</div></div>' + (e.confirmed_by ? '' : btn('Confirm', 'data-confirm="' + u.esc(e.id) + '"', true)) + '</div>').join('') : empty(doc.ocr_status === 'done' ? 'No values were extracted from this document.' : doc.ocr_status === 'failed' ? 'Reading failed. Upload a clearer photo.' : 'Still reading the document…')) +
        '<div class="flex justify-between">' + btn('← All documents', 'id="cf-back"') + btn('Continue to alerts →', 'id="cf-next"', true) + '</div></div></div>';
      const img = $('#cf-img'); if (img) img.onerror = () => { img.replaceWith(Object.assign(document.createElement('iframe'), { src: u.API + '/v1/documents/' + doc.document_id + '/file', title: 'Uploaded document', className: 'w-full h-[640px]' })); };
      $$('[data-confirm]').forEach((b) => (b.onclick = async () => { b.disabled = true; b.textContent = 'Saving…'; try { await u.api('/v1/extractions/' + b.getAttribute('data-confirm') + '/confirm', { method: 'POST', body: JSON.stringify({ actor_id: u.ACTOR, actor_role: 'clinician' }) }); const docs = await u.api('/v1/visits/' + ctx.visit + '/documents'); doc = docs.find((x) => x.document_id === doc.document_id) || doc; window.CareFlow.showToast('Confirmed and logged in the audit trail', 'success'); draw(); } catch (e) { b.disabled = false; b.textContent = 'Confirm'; u.banner(e.message); } }));
      $('#cf-back').onclick = () => u.goto('w09', ctx.visit); $('#cf-next').onclick = () => u.goto('w13', ctx.visit);
    };
    mountBody(''); draw();
  }

  // ------------------------------------------------------------------ w14 handoff / w15 complete: sign
  async function sign(ctx, kind) {
    const u = L().u; const d = await load(ctx); bindIdentity(d.token, d.summary); const w = d.token ? u.who(d.token) : { name: 'Visit', demo: '' };
    const open = d.summary.red_flags.filter((f) => !f.acknowledged_by); const h = u.hpi(d.summary);
    const ay = await u.api('/v1/visits/' + ctx.visit + '/ayurveda').catch(() => null);
    const incomplete = ay ? ay.completion.filter((c) => c.step_id !== 'summary' && c.status !== 'complete' && (d.summary.ayurveda_sections || []).length).map((c) => c.step_id.replace(/_/g, ' ')) : [];
    let result = null;
    const draw = () => {
      let html = pendingNote(d);
      html += card(kind === 'w15' ? 'Session complete • सत्र पूरा हुआ' : 'Handoff summary • हैंडऑफ सारांश', u.esc(w.name) + ' • ' + u.esc(w.demo) + (d.token ? ' • ' + u.esc(d.token.department) + ' • ' + u.esc(d.token.token_no) : ''),
        '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">' + stat('Answers', h.length, 'Patient-reported') + stat('Documents', d.docs.length) + stat('Red flags', open.length, open.length ? 'Unacknowledged' : 'None open') + stat('Status', d.summary.signed ? 'Signed' : 'Draft', d.summary.signed ? 'Physician-signed' : 'Awaiting signature') + '</div>');
      if (open.length) html += card('Important to review • समीक्षा के लिए महत्वपूर्ण', 'Deterministic rules over the patient’s answers', open.map((f) => '<div class="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-950">“' + u.esc(f.quote) + '” — ' + u.esc(f.severity) + '</div>').join('') + btn('Acknowledge in alerts →', 'id="cf-alerts"'));
      if (incomplete.length && !d.summary.signed) html += '<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 font-semibold">Ayurvedic case record not complete: ' + u.esc(incomplete.join(', ')) + '. Signing includes only what is recorded.</div>';
      html += card('Sign • हस्ताक्षर', 'Signing assembles the FHIR bundle, validates it against the local HAPI server (any error blocks it) and attempts the ABDM care-context link — mocked unless a sandbox key is configured.',
        (d.summary.signed || result) ? '<p class="text-xs font-semibold text-[#0D6E6E]">Signed.' + (result ? ' Bundle ' + u.esc(result.fhir_bundle_id) + ' • ABDM ' + u.esc(result.abdm_status) + ' • care context ' + u.esc(result.care_context_status) : '') + '</p><a class="text-xs font-semibold text-[#0D6E6E] underline" target="_blank" rel="noopener" href="' + u.esc(u.API) + '/v1/visits/' + u.esc(ctx.visit) + '/printable-summary">Open the A4 print view</a>' : (d.summary.pending ? empty('Nothing to sign until the patient finishes intake.') : '<div class="flex flex-wrap gap-2">' + btn('Sign this visit', 'id="cf-sign"', true) + btn('Ayurvedic case record', 'id="cf-a01"') + '</div><p id="cf-sign-note" class="text-xs text-slate-500" aria-live="polite"></p>'));
      $('#cf-live-body').innerHTML = html;
      const a = $('#cf-alerts'); if (a) a.onclick = () => u.goto('w13', ctx.visit);
      const a01 = $('#cf-a01'); if (a01) a01.onclick = () => u.goto('a01', ctx.visit);
      const s = $('#cf-sign'); if (s) s.onclick = async () => { s.disabled = true; $('#cf-sign-note').textContent = 'Signing…'; try { result = await u.api('/v1/visits/' + ctx.visit + '/sign', { method: 'POST', body: JSON.stringify({ signed_by: u.ACTOR }) }); d.summary.signed = true; draw(); } catch (e) { s.disabled = false; $('#cf-sign-note').textContent = ''; u.banner(e.message); } };
    };
    mountBody(''); draw();
  }

  // ------------------------------------------------------------------ w17 analytics, w18 system status
  async function analytics(ctx) {
    const u = L().u; const a = await u.api('/v1/analytics/summary?since=' + encodeURIComponent(new Date(Date.now() - 30 * 864e5).toISOString()));
    const max = Math.max(1, ...a.top_complaints.map((c) => c.count));
    mountBody('<div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">' + stat('OPD throughput', a.opd_throughput, 'Visits in the last 30 days') + stat('Red-flag rate', Math.round(a.red_flag_rate * 100) + '%', 'Visits with a red flag') + stat('Average intake time', a.average_intake_seconds == null ? '—' : Math.round(a.average_intake_seconds / 60 * 10) / 10 + ' min', 'Start to completion') + stat('Window', new Date(a.window_start).toLocaleDateString() + ' →', new Date(a.window_end).toLocaleDateString()) + '</div>' +
      card('Top complaints • शीर्ष शिकायतें', 'Chief complaint chosen by the patient', a.top_complaints.length ? a.top_complaints.map((c) => '<div class="flex items-center gap-3 text-xs"><span class="w-40 truncate">' + u.esc(c.complaint) + '</span><span class="flex-1 h-2 rounded-full bg-slate-200"><span class="block h-2 rounded-full bg-[#0D6E6E]" style="width:' + (c.count / max) * 100 + '%"></span></span><span class="w-8 text-right font-mono">' + c.count + '</span></div>').join('') : empty('No completed intakes in this window yet.')));
    bindIdentity(null, { visit_id: '' });
  }
  async function status(ctx) {
    const u = L().u;
    const [health, integ, audit, vocab] = await Promise.all([u.api('/health').catch(() => null), u.api('/v1/integration-events?limit=8').catch(() => null), u.api('/v1/audit-log?limit=5').catch(() => null), u.api('/v1/ayurveda/vocabulary').catch(() => null)]);
    mountFull('System status • सिस्टम स्थिति', 'What the gateway reports right now — nothing here is sample data.', '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">' + stat('Gateway', health ? health.status : 'unreachable', health ? 'Database: ' + health.database : '') + stat('Audit log', audit ? (audit.integrity.enforced ? 'Append-only' : 'NOT ENFORCED') : '—', audit ? 'DB triggers checked live' : '') + stat('Ayurveda vocabulary', vocab ? vocab.status.replace(/_/g, ' ') : '—', 'Verify with a practitioner before clinical use') + stat('ABDM', 'Mock gateway', 'Pending sandbox credentials') + '</div>' +
      card('Recent AI provider calls • हाल की कॉल', 'Every tier attempt, success or failure (hosted → local fallback)', integ && integ.entries.length ? integ.entries.map((e) => '<div class="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"><span>' + u.esc(e.service + ' • ' + e.capability + ' • ' + e.provider) + '</span><span class="' + (e.outcome === 'success' ? 'text-[#0D6E6E]' : 'text-red-700') + ' font-semibold">' + u.esc(e.outcome) + ' • ' + e.latency_ms + 'ms</span></div>').join('') : empty('No provider calls recorded.')) +
      card('Recent audit entries', 'Append-only; a database trigger rejects edits and deletes', audit && audit.entries.length ? audit.entries.map((e) => '<div class="text-xs py-1 border-b border-slate-50 last:border-0"><span class="font-semibold">' + u.esc(e.action) + '</span> • ' + u.esc(e.resource) + ' • ' + u.esc(e.actor_id || 'system') + ' • ' + u.esc(new Date(e.at).toLocaleString()) + '</div>').join('') : empty('No audit entries.')) +
      card('Sign-in and preferences', '', empty('There is no clinician login or per-user settings yet: actions are recorded under a shared identifier until authentication is connected.')));
    bindIdentity(null, { visit_id: '' });
  }
  function noBackend(what, why) { mountFull(what, 'Not connected', card('Status', '', empty(why))); bindIdentity(null, { visit_id: '' }); }

  // ------------------------------------------------------------------ cards on w03 / w05 / w11 that used to be samples
  async function finish(page, ctx) {
    const u = L().u;
    bindIdentity(ctx.token || null, ctx.summary || { visit_id: ctx.visit }, page === 'w03' || page === 'w04');
    const docs = ctx.visit ? await u.api('/v1/visits/' + ctx.visit + '/documents').catch(() => []) : [];
    const docRows = (list) => list.length ? list.map((x) => '<div class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-xs"><span class="font-semibold text-[#0c1b33]">' + TYPE_LABEL[x.type] + '</span><span class="text-slate-500">' + (STATUS_PILL[x.ocr_status] || STATUS_PILL.queued)[0] + ' • ' + x.extractions.length + ' values</span></div>').join('') : empty('No documents uploaded for this visit.');
    const replaceCard = (headingRe, html) => { const h = $$('h2, h3, h4').find((x) => headingRe.test(x.textContent.trim())); const c = h && (h.closest('section') || h.closest('div.p-5') || h.closest('div.rounded-2xl')); if (!c) return; const box = document.createElement('div'); box.className = c.className; box.innerHTML = html; c.replaceWith(box); };
    const removeCard = (headingRe) => { const h = $$('h2, h3, h4').find((x) => headingRe.test(x.textContent.trim())); const c = h && (h.closest('section') || h.closest('div.p-5') || h.closest('div.rounded-2xl')); if (c) c.remove(); };
    if (page === 'w03') {
      const q = ctx.q || await u.queue();
      const withDocs = (await Promise.all(q.slice(0, 15).map((t) => u.api('/v1/visits/' + t.visit_id + '/documents').catch(() => []).then((ds) => ds.map((x) => Object.assign({ t }, x)))))).flat();
      replaceCard(/^Documents to review/, '<div class="flex items-center justify-between border-b border-slate-100 pb-3"><h3 class="text-sm font-bold text-[#0c1b33]">Documents • दस्तावेज़</h3><span class="text-xs text-slate-500">' + withDocs.length + '</span></div><div class="space-y-2 mt-3">' + (withDocs.slice(0, 5).map((x) => '<div class="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-xs"><span><b>' + TYPE_LABEL[x.type] + '</b> • ' + u.esc(u.who(x.t).name) + '</span><span class="text-slate-500">' + (STATUS_PILL[x.ocr_status] || STATUS_PILL.queued)[0] + '</span></div>').join('') || empty('No documents uploaded yet.')) + '</div>');
      replaceCard(/^Recent intake activity/, '<div class="border-b border-slate-100 pb-3"><h3 class="text-sm font-bold text-[#0c1b33]">Intake status • इनटेक स्थिति</h3></div><div class="space-y-2 mt-3">' + (q.slice(0, 6).map((t) => '<div class="flex items-center justify-between text-xs"><span><b>' + u.esc(u.who(t).name) + '</b> • ' + u.esc(t.token_no) + '</span><span class="text-slate-500">' + u.esc(u.statusOf(t)) + ' • ' + t.waiting_minutes + ' min</span></div>').join('') || empty('No patients in the queue.')) + '</div>');
      removeCard(/^Upcoming appointments/); removeCard(/^Care team status/);
      const docsStat = $$('span').find((s) => s.textContent.trim() === 'Documents' && s.parentElement && s.parentElement.parentElement && s.parentElement.parentElement.querySelector('.text-3xl,.text-2xl')); void docsStat;
    }
    if (page === 'w05') {
      replaceCard(/^Documents$/, '<div class="flex items-center justify-between border-b border-slate-100 pb-3"><h2 class="text-sm font-bold text-[#0c1b33]">Documents • दस्तावेज़</h2><span class="text-xs text-slate-500">' + docs.length + '</span></div><div class="space-y-2 mt-3">' + docRows(docs) + '</div>');
      const s = ctx.summary; const h = u.hpi(s);
      replaceCard(/^Intake status/, '<div class="flex items-center justify-between border-b border-slate-100 pb-3"><h2 class="text-sm font-bold text-[#0c1b33]">Intake status • इनटेक स्थिति</h2></div><div class="space-y-2 mt-3 text-xs">' + [['Registered', ctx.token ? 'Yes' : '—'], ['Questions answered', h.length], ['Documents', docs.length], ['Review', s.signed ? 'Signed' : s.pending ? 'Waiting for the patient' : 'Ready for review']].map(([k, v]) => '<div class="flex items-center justify-between"><span class="text-slate-500">' + k + '</span><span class="font-semibold text-[#0c1b33]">' + v + '</span></div>').join('') + '</div>');
      removeCard(/^Recent activity/); removeCard(/^Care team/);
    }
    if (page === 'w11') {
      replaceCard(/^Documents/, '<div class="flex items-center justify-between border-b border-slate-100 pb-3"><h3 class="text-sm font-bold text-[#0c1b33]">Documents • दस्तावेज़</h3><span class="text-xs text-slate-500">' + docs.length + '</span></div><div class="space-y-2 mt-3">' + docRows(docs) + '</div>');
      const meds = docs.flatMap((x) => x.extractions.filter((e) => e.entity_type === 'medication'));
      replaceCard(/^Medications & Allergies/, '<div class="border-b border-slate-100 pb-3"><h3 class="text-sm font-bold text-[#0c1b33]">Medications from documents • दवाएँ</h3><p class="text-[11px] text-slate-500">Read from uploaded documents — a person confirms each value. Allergies are not captured in this version.</p></div><div class="space-y-2 mt-3">' + (meds.length ? meds.map((m) => '<div class="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-xs"><span class="font-semibold text-[#0c1b33]">' + u.esc(m.value) + '</span><span class="' + (m.confirmed_by ? 'text-[#0D6E6E]' : 'text-amber-800') + ' font-semibold">' + (m.confirmed_by ? 'Confirmed' : 'Needs confirmation') + '</span></div>').join('') : empty('No medications extracted from documents.')) + '</div>');
      removeCard(/^Patient notes/); removeCard(/^Intake activity/); removeCard(/^Voice responses/);
    }
    $$('[data-cf-demo]').forEach((x) => x.remove());
  }

  window.CareFlowPages = {
    w06: (c) => answers(c, 'w06'), w07: (c) => answers(c, 'w07'), w08: (c) => answers(c, 'w08'), w12: (c) => answers(c, 'w12'),
    w09: documents, w10: review, w14: (c) => sign(c, 'w14'), w15: (c) => sign(c, 'w15'), w17: analytics, w18: status,
    w16: () => noBackend('Appointments • अपॉइंटमेंट', 'Appointment scheduling is not part of this build: patients are seen in token order from the queue, with red-flag patients moved up automatically. Nothing on this page is stored or shown as sample data.'),
    finish,
  };
})();
