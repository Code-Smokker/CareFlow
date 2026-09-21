/**
 * CareFlow live layer — binds the static doctorwebapp pages to the real gateway.
 *
 * The design and markup of every page are unchanged: this file only fills existing elements with
 * data, re-uses the pages' own row/card markup as templates, and renames labels to the
 * Ayurvedic terms. It is loaded by careflow-nav.js, so no page needs editing beyond that.
 *
 * Blocks with no backend behind them yet keep their sample content and get a "Demo data"
 * pill, the same convention as the console's DemoDataBadge — never silently presented as live.
 *
 *   API base:  http://localhost:4000 (override: localStorage.cfApi = 'https://…')
 *   Visit:     ?visit=<id> on the URL (kept across navigation), else the first token in the queue.
 */
(function () {
  'use strict';
  const CFN = window.CareFlow;
  if (!CFN) return;
  const API = (function () { try { return localStorage.getItem('cfApi'); } catch (e) { return null; } })() || 'http://localhost:4000';
  const ACTOR = 'doctorwebapp-user'; // no RBAC until Day 4 — same convention as signed_by elsewhere
  const PAGE = CFN.currentPage.key;

  // ---------------------------------------------------------------- helpers
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const human = (v) => (Array.isArray(v) ? v.map(human).join(', ') : typeof v === 'object' && v ? JSON.stringify(v) : String(v == null ? '' : v).replace(/_/g, ' '));
  const short = (id) => String(id || '').slice(0, 8);
  const leafSpans = (root) => $$('span', root).filter((s) => !s.classList.contains('material-symbols-outlined') && !s.querySelector('span') && s.textContent.trim());
  const byText = (sel, re, root) => $$(sel, root).find((el) => re.test(el.textContent.trim()) && !el.querySelector(sel));
  const setText = (el, text) => { if (el) el.textContent = text; };
  /** Replaces the first non-empty text node, so nested icon spans survive. */
  function setPill(pill, text) {
    if (!pill) return;
    const node = Array.from(pill.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
    if (node) node.textContent = ' ' + text + ' '; else pill.appendChild(document.createTextNode(' ' + text + ' '));
  }
  function hide(el) { if (el) el.style.display = 'none'; }

  async function api(path, opts) {
    let res;
    try {
      res = await fetch(API + path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts));
    } catch (e) {
      throw new Error('The gateway could not be reached at ' + API + '. Check that it is running.');
    }
    const body = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) throw new Error((body && body.error && body.error.message) || 'Request failed (' + res.status + ')');
    return body;
  }

  function banner(message) {
    let el = $('#cf-live-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cf-live-banner';
      el.setAttribute('role', 'alert');
      el.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[60] max-w-xl px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-md';
      document.body.appendChild(el);
    }
    el.textContent = message;
  }

  /** "Demo data" pill on a card whose content has no backend yet. */
  function markDemo(headingRegex) {
    const h = $$('h2, h3, h4').find((x) => headingRegex.test(x.textContent));
    if (!h || h.querySelector('[data-cf-demo]')) return;
    const pill = document.createElement('span');
    pill.setAttribute('data-cf-demo', '');
    pill.title = 'Not connected to a backend yet — sample content';
    pill.className = 'ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold align-middle';
    pill.textContent = 'Demo data';
    h.appendChild(pill);
  }

  // ---------------------------------------------------------------- visit context
  let queueCache = null;
  const queue = async () => (queueCache = queueCache || (await api('/v1/visits/queue')));
  async function visitId() {
    const fromUrl = new URLSearchParams(location.search).get('visit');
    try {
      if (fromUrl) { sessionStorage.setItem('cfVisit', fromUrl); return fromUrl; }
      const saved = sessionStorage.getItem('cfVisit');
      if (saved) return saved;
    } catch (e) { /* storage blocked — fall through */ }
    const q = await queue();
    return q.length ? q[0].visit_id : null;
  }
  let ctxVisit = null;
  const pageUrl = (key) => '../' + CFN.pages.find((p) => p.key === key).folder + '/code.html';
  function goto(key, id) { location.href = pageUrl(key) + (id ? '?visit=' + encodeURIComponent(id) : ''); }

  // Every existing CareFlow.navigate(n) and sidebar link keeps the visit you are looking at.
  const origNavigate = CFN.navigate.bind(CFN);
  CFN.navigate = function (target) {
    const page = typeof target === 'number' ? CFN.pages.find((p) => p.id === target) : CFN.pages.find((p) => p.key === target || p.folder.includes(target));
    if (!page || !ctxVisit) return origNavigate(target);
    goto(page.key, ctxVisit);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="careflow_website_"]');
    if (!a || !ctxVisit || a.href.indexOf('visit=') !== -1) return;
    e.preventDefault();
    location.href = a.href + (a.href.indexOf('?') === -1 ? '?' : '&') + 'visit=' + encodeURIComponent(ctxVisit);
  }, true);

  /** Sidebar: add the Ayurvedic case record beside Care Summaries, cloned so styling is identical.
   * On the case-record page itself the new link takes the active state from Care Summaries. */
  function addSidebarLink() {
    $$('aside nav').forEach((nav) => {
      if ($('[data-path="ayurvedic-case-record"]', nav)) return;
      const anchor = $('[data-path="care-summaries"]', nav) || $$('a', nav).find((a) => /Care Summaries/.test(a.textContent));
      if (!anchor) return;
      const inactive = $$('a', nav).find((a) => a !== anchor && /text-slate-600|text-on-surface-variant/.test(a.className) && !/bg-\[#E6F7F2\]|bg-surface-mint-subtle text-primary/.test(a.className));
      const link = anchor.cloneNode(true);
      link.setAttribute('data-path', 'ayurvedic-case-record');
      link.setAttribute('href', pageUrl('a01'));
      const relabel = (a, text, icon) => {
        const label = $$('span', a).find((x) => /Care Summaries/.test(x.textContent) && !x.querySelector('span'));
        if (label) setText(label, text);
        const ic = $('.material-symbols-outlined', a); if (ic && icon) setText(ic, icon);
      };
      const deactivate = (a) => {
        a.removeAttribute('aria-current');
        if (inactive) a.className = inactive.className;
        $$('span', a).filter((x) => !x.textContent.trim() && x.classList.contains('rounded-full')).forEach((x) => x.remove());
        const ic = $('.material-symbols-outlined', a); if (ic) { ic.classList.remove('fill', 'text-[#0D6E6E]'); ic.classList.add('text-slate-400'); ic.style.fontVariationSettings = ''; }
      };
      relabel(link, 'Ayurvedic Case Record', 'spa');
      if (PAGE === 'a01') { deactivate(anchor); } else { deactivate(link); }
      anchor.after(link);
    });
  }

  // ---------------------------------------------------------------- data shaping
  const fieldMap = (summary) => Object.fromEntries((summary.fields || []).map((f) => [f.field_path, f]));
  const hpi = (summary) => (summary.fields || []).filter((f) => f.field_path.indexOf('history_of_present_illness.') === 0);
  const hpiLabel = (f) => human(f.field_path.replace('history_of_present_illness.', ''));
  const chip = (source, confidence, extra) => {
    const low = confidence != null && confidence < 0.6;
    const cls = source === 'clinician' ? 'bg-[#E6F7F2] text-[#0D6E6E]' : low ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600';
    const label = source === 'clinician' ? 'Vaidya' + (extra ? ' · ' + extra : '') : source === 'computed' ? 'Calculated' : source + (confidence == null ? '' : ' · ' + Math.round(confidence * 100) + '%');
    return '<span class="shrink-0 px-1.5 py-0.5 rounded ' + cls + ' text-[10px] font-semibold capitalize" title="' + esc(label) + '">' + esc(label) + '</span>';
  };
  const statusOf = (t, sm) => (
    sm && sm.signed
      ? 'Signed'
      : t && t.red_flags && t.red_flags.some((f) => !f.acknowledged_by)
      ? 'Important'
      : t && t.priority === 'urgent'
      ? 'Urgent'
      : sm && sm.fields && sm.fields.length > 0
      ? 'Ready for review'
      : 'Waiting'
  );

  // ---------------------------------------------------------------- w03 dashboard
  async function bindW03(q) {
    const flags = q.flatMap((t) => t.red_flags.filter((f) => !f.acknowledged_by).map((f) => Object.assign({ visit: t }, f)));
    const pills = $$('main [onclick^="CareFlow.navigate"]').filter((el) => /Patients today|Needs attention/.test(el.textContent));
    pills.forEach((p) => {
      const n = /Patients today/.test(p.textContent) ? q.length : flags.length;
      setText(leafSpans(p)[0], String(n).padStart(2, '0'));
    });
    const card = (label) => { const l = byText('span', new RegExp('^' + label + '$'), $('main section:nth-of-type(2)') || document); return l && l.parentElement.parentElement; };
    const setCard = (label, value, note) => {
      const c = card(label); if (!c) return;
      const valueBox = c.children[c.children.length - 1]; if (!valueBox || valueBox === c.children[0]) return;
      setText(leafSpans(valueBox)[0], value);
      const trend = valueBox.children[1];
      if (trend) { const t = leafSpans(trend); if (t.length) setText(t[t.length - 1], note); $$('.material-symbols-outlined', trend).forEach(hide); }
    };
    setCard("Today's patients", String(q.length), 'In the OPD queue now');
    setCard('New intakes', String(q.filter((t) => t.red_flags.length === 0).length).padStart(2, '0'), 'Without a red flag');
    setCard('Important alerts', String(flags.length).padStart(2, '0'), 'Needs attention');
    setCard('Documents', '—', 'See Documents');

    // Today's patients: the page's own rows are the templates (normal + priority styling).
    const first = byText('span', /^Aarav Sharma$/);
    const rowNormal0 = first && first.closest('[onclick]');
    if (rowNormal0) {
      const container = rowNormal0.parentElement;
      const rows = Array.from(container.children);
      const tplNormal = rows[0].cloneNode(true), tplPriority = (rows[2] || rows[0]).cloneNode(true);
      container.innerHTML = '';
      if (q.length === 0) container.innerHTML = '<p class="p-5 text-xs text-slate-500">No patients in the queue. Start an intake from the patient app to see one here.</p>';
      q.forEach((t) => {
        const urgent = t.red_flags.some((f) => !f.acknowledged_by);
        const row = (urgent ? tplPriority : tplNormal).cloneNode(true);
        const s = leafSpans(row);
        setText(row.children[0] && row.children[0].children[0], t.token_no.slice(-2));
        setText(s[0], t.token_no); setText(s[1], '#' + short(t.visit_id));
        setText(s[2], t.department + ' • ' + t.priority);
        setText(s[3], 'Waiting ' + t.waiting_minutes + ' min'); setText(s[4], t.department);
        setPill(s[5] && s[5].parentElement.tagName === 'DIV' ? s[5] : s[5], statusOf(t));
        row.removeAttribute('onclick'); row.onclick = () => goto(urgent ? 'w13' : 'w05', t.visit_id);
        const b = $('button', row); if (b) { b.removeAttribute('onclick'); b.onclick = (e) => { e.stopPropagation(); goto(urgent ? 'w13' : 'w05', t.visit_id); }; }
        container.appendChild(row);
      });
      const foot = byText('span', /^Showing \d+ of/);
      setText(foot, 'Showing ' + q.length + ' of ' + q.length + ' patients in the queue');
    }
    // Needs attention list
    const btn13 = $$('main button[onclick*="navigate(13)"]').find((b) => /Review/.test(b.textContent));
    if (btn13) {
      const container = btn13.parentElement.parentElement;
      const tpl = btn13.parentElement.cloneNode(true);
      container.innerHTML = '';
      flags.slice(0, 5).forEach((f) => {
        const row = tpl.cloneNode(true); const s = leafSpans(row);
        setText(s[0], f.visit.token_no); setText(s[1], '“' + f.quote + '”');
        const b = $('button', row); b.removeAttribute('onclick'); b.onclick = () => goto('w13', f.visit.visit_id);
        container.appendChild(row);
      });
      if (flags.length === 0) container.innerHTML = '<p class="text-xs text-slate-500">No unresolved red flags.</p>';
      const sub = byText('p', /patient records may need prompt review/); setText(sub, flags.length + ' red flag' + (flags.length === 1 ? '' : 's') + ' need review.');
    }
    ['Recent intake activity', 'Documents to review', 'Upcoming appointments', 'Care team status'].forEach((h) => markDemo(new RegExp(h)));
  }

  // ---------------------------------------------------------------- w04 patient list
  async function bindW04(q) {
    const summaries = await Promise.all(q.slice(0, 30).map((t) => api('/v1/visits/' + t.visit_id + '/summary').catch(() => null)));
    const tbody = $('main table tbody');
    if (tbody) {
      const trs = Array.from(tbody.children);
      const tplNormal = trs[0].cloneNode(true), tplAttn = (trs[2] || trs[0]).cloneNode(true);
      tbody.innerHTML = '';
      q.forEach((t, i) => {
        const sm = summaries[i]; const urgent = t.red_flags.some((f) => !f.acknowledged_by);
        const tr = (urgent ? tplAttn : tplNormal).cloneNode(true);
        const tds = $$(':scope > td', tr);
        const s0 = leafSpans(tds[0]); setText($('div > div', tds[0]), t.token_no.slice(-2));
        setText(s0[0], t.token_no); setText(s0[1], '#' + short(t.visit_id)); setText(s0[s0.length - 1], 'Age and sex not recorded');
        const complaint = sm && fieldMap(sm).chief_complaint; const s1 = leafSpans(tds[1]);
        setText(s1[0], complaint ? human(complaint.value) : 'Intake in progress'); setText(s1[1], sm ? hpi(sm).length + ' answers recorded' : 'No summary yet');
        const s2 = leafSpans(tds[2]); setText(s2[0], 'Waiting ' + t.waiting_minutes + ' min'); setText(s2[1], t.priority);
        setPill($('span', tds[3]), statusOf(t, sm));
        const s4 = leafSpans(tds[4]); setText(s4[0], t.department); setText(s4[1], sm && sm.signed ? 'Signed' : 'Awaiting review');
        tr.removeAttribute('onclick'); tr.onclick = () => goto(urgent ? 'w13' : 'w05', t.visit_id);
        const b = $('button', tr); if (b) { b.removeAttribute('onclick'); b.onclick = (e) => { e.stopPropagation(); goto(urgent ? 'w13' : 'w05', t.visit_id); }; }
        tbody.appendChild(tr);
      });
      if (q.length === 0) tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-sm text-slate-500">No patients in the queue yet.</td></tr>';
    }
    const stat = (re, value, note) => {
      const l = byText('span', re); if (!l) return; const c = l.parentElement.parentElement;
      const spans = leafSpans(c); setText(spans[1], value); if (note) setText(spans[spans.length - 1], note);
    };
    const flags = q.filter((t) => t.red_flags.some((f) => !f.acknowledged_by)).length;
    stat(/^Total patients/, String(q.length), 'In the OPD queue');
    stat(/^Today's intake/, String(q.length), 'Started today');
    stat(/^Needs attention/, String(flags).padStart(2, '0'), 'Unresolved red flags');
    stat(/^Completed/, String(summaries.filter((s) => s && s.signed).length), 'Signed by a physician');
    setText(byText('span', /^Showing \d+ patients today/), 'Showing ' + q.length + ' patients');
    setText(byText('span', /^\s*Showing/), 'Showing ' + q.length + ' of ' + q.length + ' patients');
    const pager = byText('button', /^Next/); if (pager) hide(pager.parentElement);
  }

  // ---------------------------------------------------------------- w05 profile
  async function bindW05(summary, token) {
    const f = fieldMap(summary); const complaint = f.chief_complaint ? human(f.chief_complaint.value) : 'Not recorded yet';
    const name = token ? token.token_no : 'Visit ' + short(summary.visit_id);
    const h1 = $('main h1'); setText(h1, name); if (h1 && h1.nextElementSibling) setText(h1.nextElementSibling, '');
    setText(byText('span', /^\s*#CF-\d+/), '#' + short(summary.visit_id));
    setText(byText('span', /^Male • \d+ years/), 'Age and sex not recorded');
    setText(byText('span', /^Last intake:/), (summary && summary.fields && summary.fields.length > 0 ? 'Intake complete' : 'Intake in progress') + (token ? ' • Waiting ' + token.waiting_minutes + ' min' : ''));
    setText(byText('span', /^Aarav Sharma$/), name); setText(byText('span', /^मरीज \/ आरव/), '');
    $$('main span').filter((s) => /^ABHA Sync/.test(s.textContent)).forEach((s) => setText(s, 'ABHA: not linked'));
    $$('main span').filter((s) => /^ABHA ID:/.test(s.textContent)).forEach((s) => setText(s, 'Link is not stored on the visit yet'));
    const status = statusOf(token, summary);
    setPill(byText('span', /Ready for review/), status);
    const value = (label) => { const l = byText('span', new RegExp('^' + label + '$')); return l && l.nextElementSibling; };
    [['Full Name', name], ['Patient ID', short(summary.visit_id)], ['Date of Birth', 'Not recorded'], ['Gender', 'Not recorded'], ['Preferred Language', 'Not recorded']].forEach(([l, v]) => { const el = value(l); if (el) setText(el, v); });
    const phone = value('Phone Number'); if (phone) { setText($('span', phone), 'Not recorded'); $$('.material-symbols-outlined', phone).forEach(hide); }
    const em = value('Emergency Contact'); if (em) { const s = leafSpans(em); setText(s[0], 'Not recorded'); s.slice(1).forEach(hide); }
    // Current concern
    setText(byText('span', /^Fever & cough \(3 days\)$/), complaint);
    setText(byText('span', /^Acute episode$/), 'Structured intake');
    setText(byText('p', /^\s*Reported during today's mobile/), 'Recorded during the patient’s own intake session. Values below are the patient’s answers with provenance; a physician confirms them.');
    const chipValue = (label, v) => { const l = byText('span', new RegExp('^' + label + '$')); if (l && l.nextElementSibling) setText(l.nextElementSibling, v); };
    const get = (slot) => { const x = f['history_of_present_illness.' + slot]; return x ? human(x.value) : 'Not recorded'; };
    chipValue('Severity', get('severity')); chipValue('Duration', get('duration')); chipValue('Onset', get('onset')); chipValue('Associated symptoms', get('associated'));
    const banner = byText('h3', /^Important information/); const flagList = summary.red_flags || [];
    if (banner) { const sec = banner.closest('section'); if (flagList.length) setText(byText('p', /persistent fever for 3 days/, sec), flagList.map((x) => '“' + x.quote + '”').join('  ')); else hide(sec); }
    // Recent intake
    ['Chief Complaint', 'Duration', 'Pain / Severity', 'Documents'].forEach((l) => chipValue(l, l === 'Chief Complaint' ? complaint : l === 'Duration' ? get('duration') : l === 'Documents' ? '—' : get('severity')));
    hide($('#playVoiceBtn') && $('#playVoiceBtn').closest('div.flex')); hide($('#playVoiceBtn') && $('#playVoiceBtn').parentElement.parentElement.parentElement);
    setText(byText('span', /^Ref: IN-/), 'Visit ' + short(summary.visit_id));
    // Care summary paragraph — plain listing of what was recorded, no generated prose
    const para = byText('p', /28-year-old male presenting/);
    setText(para, hpi(summary).length ? 'Chief complaint: ' + complaint + '. ' + hpi(summary).slice(0, 6).map((x) => hpiLabel(x) + ': ' + human(x.value)).join('; ') + '.' : 'No structured history recorded yet.');
    setText(byText('span', /^AI Generated Draft$/), 'Structured draft — physician signs');
    // Ayurveda entry point: rename + re-point the primary action
    $$('button').filter((b) => /Start review|View intake/.test(b.textContent) && /navigate\(6\)/.test(b.getAttribute('onclick') || '')).forEach((b) => {
      const s = leafSpans(b);
      if (/Start review/.test(b.textContent)) { setText(s[0], 'Ayurvedic case record'); setText(s[1], '(आयुर्वेदिक रुग्ण परीक्षा)'); b.removeAttribute('onclick'); b.onclick = () => goto('a01', summary.visit_id); }
    });
    ['Intake status', 'Documents', 'Recent activity', 'Care team'].forEach((h) => markDemo(new RegExp('^' + h)));
  }

  // ---------------------------------------------------------------- w11 care summary
  function caseSheetHtml(sections, status) {
    const review = status && status !== 'VERIFIED' ? '<p class="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">Vocabulary status: <b>' + esc(status) + '</b> — terms and option lists are not yet verified by an Ayurveda practitioner.</p>' : '';
    return review + sections.map((sec) => {
      let last = null;
      const rows = sec.rows.map((r) => {
        const head = r.group && r.group !== last ? '<div class="pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">' + esc(r.group) + '</div>' : '';
        last = r.group;
        const orig = r.original ? '<div class="text-[11px] text-slate-500">' + (r.disposition === 'confirmed' ? 'Confirms' : 'Overrides') + ' patient-reported: <b>' + esc(r.original.value_label) + '</b> ' + chip(r.original.source, r.original.confidence) + '</div>' : '';
        return head + '<div class="flex items-start justify-between gap-3 py-1"><div class="text-xs text-[#0c1b33]"><span class="font-bold">' + esc(r.label) + ':</span> ' + esc(r.value_label) + orig + '</div>' + chip(r.source, r.confidence, r.disposition !== 'entered' ? r.disposition : '') + '</div>';
      }).join('');
      return '<div class="space-y-1"><div class="border-b border-slate-100 pb-1"><span class="text-sm font-bold text-[#0F1E36]">' + esc(sec.label) + '</span> <span class="text-[11px] text-slate-500">' + esc(sec.gloss) + '</span></div>' + (rows || '<p class="text-xs text-slate-400">Not recorded.</p>') + '</div>';
    }).join('<div class="h-3"></div>');
  }

  async function bindW11(summary, token) {
    const f = fieldMap(summary); const complaint = f.chief_complaint ? human(f.chief_complaint.value) : 'Not recorded yet';
    const name = token ? token.token_no : 'Visit ' + short(summary.visit_id); const h = hpi(summary);
    $$('main').forEach((m) => $$('span, h2', m).filter((s) => !s.children.length && /^(Aarav Sharma|UHID: CF-1024)$/.test(s.textContent.trim())).forEach((s) => setText(s, /UHID/.test(s.textContent) ? 'Visit #' + short(summary.visit_id) : name)));
    $$('main span').filter((s) => /^(28 Y \/ M|Intake: Today|ABHA: 91-|ABHA ID: 91-|ABHA Sync: Active)/.test(s.textContent.trim()) && !s.querySelector('span')).forEach((s) => setText(s, /^ABHA/.test(s.textContent.trim()) ? 'ABHA: not linked' : /^28/.test(s.textContent.trim()) ? 'Age and sex not recorded' : 'Intake: ' + (summary && summary.fields && summary.fields.length > 0 ? 'complete' : 'in progress') + (token ? ' • waiting ' + token.waiting_minutes + ' min' : '')));
    setText(byText('span', /^Intake ID: #INK/), 'Visit #' + short(summary.visit_id));
    const glance = (label, v, note) => { const l = byText('span', new RegExp('^' + label + '$')); if (!l) return; const c = l.parentElement.parentElement; const ps = $$('p', c); setText(ps[0], v); if (ps[1]) setText(ps[1], note); };
    glance('Chief Complaint', complaint, 'Patient-reported');
    glance('Duration', f['history_of_present_illness.duration'] ? human(f['history_of_present_illness.duration'].value) : 'Not recorded', 'From intake');
    glance('Severity', f['history_of_present_illness.severity'] ? human(f['history_of_present_illness.severity'].value) : 'Not recorded', 'From intake');
    glance('Questions', h.length + ' answered', 'Complaint module');
    glance('Documents', '—', 'See Documents');
    glance('Voice Note', h.some((x) => x.source === 'voice') ? 'Available' : 'None', h.some((x) => x.source === 'voice') ? 'Voice answers recorded' : 'Tap answers only');
    // Chief complaint card
    setText(byText('span', /^\s*Fever & cough \(3 days\)/), complaint);
    setText(byText('p', /High body temperature accompanied/), 'Recorded during the patient’s own intake session; every value carries how it was given and how confident the system is.');
    const assoc = f['history_of_present_illness.associated'];
    const chips = byText('span', /^Associated symptoms$/); if (chips) { const box = chips.nextElementSibling; if (box) box.innerHTML = (assoc ? [].concat(assoc.value) : []).map((v) => '<span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">' + esc(human(v)) + '</span>').join('') || '<span class="text-xs text-slate-400">None reported</span>'; }
    // Key information + questionnaire
    const ul = byText('h3', /^Key information/); if (ul) { const list = ul.closest('div.p-5').querySelector('ul'); const tpl = list.children[0].cloneNode(true); list.innerHTML = ''; h.slice(0, 8).forEach((x) => { const li = tpl.cloneNode(true); setText($$('span', li)[1], hpiLabel(x) + ': ' + human(x.value)); list.appendChild(li); }); if (!h.length) list.innerHTML = '<li class="text-xs text-slate-500">No structured history recorded yet.</li>'; setText(byText('span', /^Validated by Intake triage/), 'Patient-reported'); }
    const qh = byText('h3', /^Health questionnaire/); if (qh) {
      const card = qh.closest('div.p-5'); setText($('p', card), h.length + ' questions answered'); setText(byText('span', /^\s*100%\s*$/, card), h.length ? '100%' : '0%');
      const grid = $('div.grid', card); const tpl = grid.children[0].cloneNode(true); grid.innerHTML = '';
      h.slice(0, 8).forEach((x) => { const cell = tpl.cloneNode(true); const s = leafSpans(cell); setText(s[0], hpiLabel(x) + ':'); s[1].outerHTML = '<span class="flex items-center gap-1.5"><span class="text-xs font-bold text-[#0c1b33]">' + esc(human(x.value)) + '</span>' + chip(x.source, x.confidence) + '</span>'; grid.appendChild(cell); });
    }
    // Needs attention → red flags
    const nh = byText('h4', /^\s*Needs attention/); if (nh) {
      const card = nh.closest('div.rounded-2xl'); const flags = summary.red_flags || [];
      setText(byText('span', /Items\s*$/, card), flags.length + ' Item' + (flags.length === 1 ? '' : 's'));
      const list = card.querySelector('div.space-y-2'); const tpl = list.children[0].cloneNode(true); list.innerHTML = '';
      flags.forEach((x) => { const row = tpl.cloneNode(true); setText($('p', row), '“' + x.quote + '” — ' + x.severity); list.appendChild(row); });
      if (!flags.length) list.innerHTML = '<div class="p-3 rounded-xl bg-white/80 border border-amber-200/70 text-xs text-amber-950">No unresolved red flags for this visit.</div>';
      setText(byText('span', /Triggered via/, card), 'Deterministic rules over the patient’s answers — never model judgement');
    }
    setText(byText('span', /^5\/5 Validated$/), h.length + ' answers recorded');
    // The Ayurvedic case sheet — a new card in the page's own card style, after the questionnaire
    const ay = summary.ayurveda_sections || [];
    const anchor = qh && qh.closest('div.p-5');
    if (anchor && ay.length) {
      const vocab = await api('/v1/ayurveda/vocabulary').catch(() => null);
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5';
      card.innerHTML = '<div class="flex items-center justify-between border-b border-slate-200 pb-3"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px] text-[#0D6E6E]">spa</span><div><h3 class="text-sm font-bold text-[#0c1b33]">Ayurvediya Rugna Pariksha • आयुर्वेदिक रुग्ण परीक्षा</h3><p class="text-[11px] text-slate-500">Ayurvedic Case Record — Prashna to Vyadhi Vinishchaya</p></div></div><a href="javascript:void(0)" data-cf-open-a01 class="text-xs font-semibold text-[#0D6E6E] underline">Open case record</a></div><div class="space-y-1">' + caseSheetHtml(ay, vocab && vocab.status) + '</div>';
      anchor.after(card);
      $('[data-cf-open-a01]', card).onclick = () => goto('a01', summary.visit_id);
    }
    ['Patient notes', 'Intake activity', 'Documents', 'Medications & Allergies', 'Voice responses'].forEach((t) => markDemo(new RegExp('^' + t)));
    const cta = $('button[onclick="proceedToReview()"]'); if (cta) { cta.removeAttribute('onclick'); cta.onclick = () => goto('a01', summary.visit_id); const s = leafSpans(cta)[0]; setText(s, 'Ayurvedic case record → (आयुर्वेदिक रुग्ण परीक्षा)'); }
  }

  // ---------------------------------------------------------------- w13 red flags
  async function bindW13(summary, token) {
    const name = token ? token.token_no : 'Visit ' + short(summary.visit_id);
    $$('main span, main h2').filter((s) => !s.children.length && /^(Aarav Sharma|UHID: CF-1024|28 Y \/ M|ABHA: 91-|ABHA ID: 91-|ABHA Sync: Active|Intake completed:)/.test(s.textContent.trim())).forEach((s) => { const t = s.textContent.trim(); setText(s, /^UHID/.test(t) ? 'Visit #' + short(summary.visit_id) : /^ABHA/.test(t) ? 'ABHA: not linked' : /^28/.test(t) ? 'Age and sex not recorded' : /^Intake/.test(t) ? 'Intake completed' : name); });
    const all = token ? token.red_flags : []; const open = all.filter((x) => !x.acknowledged_by); const done = all.filter((x) => x.acknowledged_by);
    const a1 = $('article[data-purpose="alert-card-01"]'), a2 = $('article[data-purpose="alert-card-02"]');
    if (a1) {
      const holder = a1.parentElement; const tpl = a1.cloneNode(true); hide(a2); a1.remove(); if (a2) a2.remove();
      open.forEach((fl) => {
        const card = tpl.cloneNode(true);
        setText($('h4', card), fl.rule_id.replace(/_/g, ' ') + ' • ' + fl.severity);
        setText(byText('p', /Clinical triage severity indicator/, card), 'Deterministic rule: ' + fl.rule_id);
        setText($$('span', card).find((s) => /Needs review/.test(s.textContent)), fl.severity.toUpperCase());
        const finding = byText('p', /^\s*Finding:/, card); if (finding) finding.innerHTML = 'Finding: <span class="font-semibold">' + esc(fl.quote) + '</span>';
        const src = byText('span', /^Source:$/, card); if (src && src.parentElement) src.parentElement.innerHTML = '<span class="font-semibold">Source:</span> patient answers at intake • <span class="font-semibold">Token:</span> ' + esc(fl.token_no);
        const verbatim = $$('div', card).find((d) => /^\s*[“"]Fever for about/.test(d.textContent) && !d.children.length); hide(verbatim);
        const buttons = $$('button', card); const reviewBtn = buttons.find((b) => /Mark as reviewed/.test(b.textContent));
        buttons.filter((b) => b !== reviewBtn).forEach(hide); $$('a', card).forEach(hide);
        if (reviewBtn) reviewBtn.onclick = async () => {
          reviewBtn.disabled = true; setText(reviewBtn, 'Saving…');
          try { await api('/v1/redflags/' + fl.id + '/acknowledge', { method: 'POST', body: JSON.stringify({ actor_id: ACTOR, actor_role: 'clinician' }) }); CFN.showToast('Marked as reviewed and logged in the audit trail', 'success'); queueCache = null; setTimeout(() => location.reload(), 500); }
          catch (e) { reviewBtn.disabled = false; setText(reviewBtn, 'Mark as reviewed'); banner(e.message); }
        };
        holder.insertBefore(card, $('section[data-purpose="reviewed-items-section"]', holder));
      });
      if (!open.length) { const empty = document.createElement('div'); empty.className = 'p-5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-600'; empty.textContent = 'No unresolved red flags for this visit. Red flags come from deterministic rules over the patient’s answers.'; holder.insertBefore(empty, $('section[data-purpose="reviewed-items-section"]', holder)); }
    }
    // Reviewed items → acknowledged flags
    const reviewed = $('section[data-purpose="reviewed-items-section"]');
    if (reviewed) {
      setText(byText('span', /Cleared/, reviewed), done.length + ' Cleared');
      const list = $$('div', reviewed).find((d) => d.children.length && /Reviewed & verified|Heart rate/.test(d.textContent) && $$(':scope > div', d).length >= 2 && !$('h4', d));
      if (list) { const tpl = list.children[0].cloneNode(true); list.innerHTML = ''; done.forEach((x) => { const row = tpl.cloneNode(true); const s = leafSpans(row); setText(s[1] || s[0], x.rule_id.replace(/_/g, ' ')); setText(s[s.length - 1], 'Reviewed by ' + x.acknowledged_by); list.appendChild(row); }); if (!done.length) list.innerHTML = '<p class="text-xs text-slate-500 p-2">Nothing reviewed yet.</p>'; }
    }
    hide($('section[data-purpose="alert-activity-timeline"]'));
    const banner2 = $('[data-purpose="top-alert-banner"]'); if (banner2) { setText($$('h3', banner2)[0], open.length + ' item' + (open.length === 1 ? '' : 's') + ' need review'); setText($$('span', banner2).pop(), open.length + ' Items requiring review'); if (!open.length) hide(banner2); }
    setText(byText('span', /items to review/), open.length + ' item' + (open.length === 1 ? '' : 's') + ' to review');
    const counters = $$('div', $('[data-purpose="review-statistics-counter"]') || document).filter((d) => /^\d+$/.test(d.textContent.trim()) && !d.children.length); if (counters[0]) setText(counters[0], String(open.length)); if (counters[1]) setText(counters[1], String(done.length));
    ['Review assigned to', 'Review note'].forEach((t) => markDemo(new RegExp(t)));
  }

  // ---------------------------------------------------------------- boot
  async function boot() {
    addSidebarLink();
    try {
      if (PAGE === 'w03' || PAGE === 'w04') { const q = await queue(); ctxVisit = await visitId(); return PAGE === 'w03' ? bindW03(q) : bindW04(q); }
      if (PAGE === 'w05' || PAGE === 'w11' || PAGE === 'w13') {
        ctxVisit = await visitId();
        if (!ctxVisit) { banner('No visit to show yet — start an intake from the patient app first.'); return; }
        const [summary, q] = await Promise.all([api('/v1/visits/' + ctxVisit + '/summary'), queue()]);
        const token = q.find((t) => t.visit_id === ctxVisit) || null;
        return PAGE === 'w05' ? bindW05(summary, token) : PAGE === 'w11' ? bindW11(summary, token) : bindW13(summary, token);
      }
      ctxVisit = await visitId().catch(() => null);
      if (PAGE === 'a01') return window.CareFlowAyurveda && window.CareFlowAyurveda.mount({ api, API, ACTOR, visit: ctxVisit, esc, human, chip, banner, goto });
    } catch (e) { banner(e.message); }
  }
  window.CareFlowLive = { api, goto, chip, esc, human, caseSheetHtml };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
