# 14 — Feature checklist

Everything CareFlow does, as a tickable list. This is the build backlog and the demo-readiness
check. Priority markers:

**P0** — the demo path. Never cut. · **P1** — expected by the problem statement. ·
**P2** — differentiator, cut only if the clock forces it. · **P3** — nice to have.

Cut order if time runs out: admin analytics → Ask the history → follow-up diff → AYUSH depth →
document scanning.

---

## 1. Getting in

- [ ] **P0** QR on the token slip starts a session — scan with any phone, web app opens, no install, no login
- [ ] **P0** Any screen can join the same session: own phone, shared kiosk, volunteer tablet, registration desk
- [ ] **P0** Switch device mid-interview and continue from the exact question
- [ ] **P0** Resume after interruption — battery dies, patient wanders off, kiosk reboots
- [ ] **P0** Language picker in native scripts with an audio sample on each
- [ ] **P2** Auto-detect language from the first utterance (as a shortcut, never the only path)
- [ ] **P1** Identity: scan ABHA card QR (two seconds, no typing)
- [ ] **P1** Identity: ABHA number + OTP
- [ ] **P1** Identity: register fresh for patients with neither
- [ ] **P0** Consent spoken aloud in their language before anything records
- [ ] **P0** Four independent toggles: capture history / read old records / share with hospital / link to ABHA
- [ ] **P1** Spoken assent recorded as audio alongside a FHIR Consent resource
- [ ] **P1** Consent revocable later from the same QR
- [ ] **P1** Refusing a toggle degrades gracefully — never all-or-nothing
- [ ] **P2** Attendant mode: records who is answering and their relationship, switches to third person, marks second-hand answers
- [ ] **P2** Assisted mode for a volunteer or ANM on a tablet in the queue
- [ ] **P3** Elderly mode: larger text, higher contrast, slower speech

## 2. The interview

- [ ] **P0** Open chief-complaint question → classifier → routes to the right module
- [ ] **P0** Adaptive follow-ups from the ontology (site, onset, character, radiation, associated, timing, aggravating, severity)
- [ ] **P0** Five complaint modules: chest pain, fever, cough & breathlessness, abdominal pain, joint pain
- [ ] **P0** Generic fallback module for anything unmatched
- [ ] **P0** Voice answer — streaming ASR with browser-side VAD
- [ ] **P0** Tap answer — icon chips on every question
- [ ] **P1** Multi-select for associated symptoms
- [ ] **P1** Body map: tap where it hurts and where it spreads
- [ ] **P1** Face scale for severity
- [ ] **P1** Duration chips — today / 2 days / a week / a month / longer. Never a date picker
- [ ] **P0** Never blocks: three failed voice attempts silently switches that slot to tap-only, no error shown
- [ ] **P0** Never guesses: low confidence triggers one clarifying re-ask, then stores "unclear"
- [ ] **P1** Code-switched Hinglish handled natively (Saaras `codemix` mode — see doc 15)
- [ ] **P1** Past medical and surgical history
- [ ] **P1** Drug and allergy history, pre-filled from scanned prescriptions
- [ ] **P1** Family history
- [ ] **P1** Personal history: diet, sleep, tobacco, alcohol, occupation, obstetric where relevant
- [ ] **P1** Review of systems targeted by complaint, not the full checklist
- [ ] **P0** TTS reads every question aloud, from cache
- [ ] **P1** Final read-back of the whole summary; tap any line to correct it
- [ ] **P1** Progress shown as a filling human figure, readable without literacy
- [ ] **P2** Follow-up mode: confirm prior history in ~20 seconds, then ask only the delta

## 3. The Ayurveda path

- [ ] **P2** Dashavidha Pariksha as ten structured fields (Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Sattva, Ahara Shakti, Vyayama Shakti, Vaya)
- [ ] **P2** Prakriti assessment implementing a **published, cited** instrument — do not invent questions
- [ ] **P2** Agni, Koshtha, Nidana
- [ ] **P2** Ahara–Vihara diet and lifestyle block
- [ ] **P3** Trividha and Ashtavidha Pariksha sets
- [ ] **P2** Reports the response profile and dominant-dosha tendency with every item visible — **never asserts a constitution**; the vaidya confirms
- [ ] **P2** The word "diagnosis" appears nowhere in the AYUSH UI

## 4. Documents

- [ ] **P1** Guided camera with live edge detection, auto-crop, deskew (jscanify)
- [ ] **P1** On-device quality gate: blur, glare, coverage — tells the patient what's wrong in words, asks for a retake
- [ ] **P1** Multi-page capture
- [ ] **P1** Document type classifier: prescription / lab / discharge / imaging / unknown
- [ ] **P1** Printed multilingual OCR
- [ ] **P1** Handwritten OCR
- [ ] **P1** Extract diagnoses, drugs with dose + frequency + duration, lab analytes with values + units + reference ranges, procedures, dates
- [ ] **P0** **Handwritten drug names never auto-accepted** — shortlist of dictionary matches to confirm with one tap
- [ ] **P1** Date normalisation into a chronological timeline
- [ ] **P1** Missing dates marked approximate — never fabricated
- [ ] **P1** Out-of-range lab flagging, saying which reference range was used
- [ ] **P2** Duplicate therapy detection across documents
- [ ] **P2** Known major interaction pairs flagged for physician attention (see doc 15 — the NLM interaction API is discontinued)
- [ ] **P1** Runs async — the patient keeps answering; failure never blocks the summary
- [ ] **P1** Bounding boxes preserved through every stage, for provenance

## 5. The summary

- [ ] **P0** Standard clinical order: CC → HPI → past → drugs & allergy → family → personal → ROS → prior investigations
- [ ] **P0** Structured object generated first; prose rendered from it, never the reverse
- [ ] **P0** Provenance tag on every line (`voice 04:12`, `lab report p.2`, `tapped`, `attendant`)
- [ ] **P1** Tap a tag to hear the patient say that line, or see the region of the scan
- [ ] **P0** Low-confidence lines visually demoted, never hidden
- [ ] **P1** Bilingual: patient audio in local language, physician text in English/Hindi
- [ ] **P0** Every field editable in place; nothing saved until signed
- [ ] **P0** Physician accepts, amends or rejects — the summary is always a draft
- [ ] **P2** "Ask the history" — grounded Q&A over this patient's record only, citing the field
- [ ] **P2** Follow-up visits open on the diff, not the full history
- [ ] **P2** Printable summary with a QR for hospitals that cannot integrate

## 6. Red flags and triage

- [ ] **P0** Deterministic rules evaluated after every slot fill — **no model call**
- [ ] **P0** Chest pain + diaphoresis + radiation; fever + neck stiffness; altered sensorium; bleeding; breathlessness
- [ ] **P0** Token actually re-prioritises in the queue — not a badge
- [ ] **P0** Live push to the nurse tablet and wall display
- [ ] **P0** The patient's exact words quoted on the alert
- [ ] **P1** Calm spoken instruction to the patient, not an alarm
- [ ] **P1** One-tap acknowledge, logged with who and when
- [ ] **P2** Waiting-time heat so nobody is forgotten mid-list
- [ ] **P1** Tuned for recall — report the false-positive rate honestly rather than hiding it
- [ ] **P1** Every rule ships with a case in `eval/`

## 7. Plumbing

- [ ] **P1** FHIR R4 OPConsultRecord bundle per the NRCES ABDM IG
- [ ] **P2** HealthDocumentRecord for unstructured uploads
- [ ] **P2** DiagnosticReportRecord for extracted labs
- [ ] **P1** Every bundle validated against local HAPI in CI
- [ ] **P1** ABHA care-context linking so it appears in the patient's PHR app
- [ ] **P2** HIS push adapter (REST / HL7 v2)
- [ ] **P2** Printable fallback for non-integrated hospitals
- [ ] **P2** NAMASTE ↔ ICD-11 TM2 dual coding on every Ayurvedic finding
- [ ] **P2** Terminology search resolving *amavata* / *āmavāta* / *aam vaat* to one concept
- [ ] **P2** Physician can override the suggested code; their choice enters the bundle
- [ ] **P0** ⚠️ Replace every `PLACEHOLDER` code with a verified one, source URL recorded

## 8. Privacy

- [ ] **P1** FHIR Consent resource plus recorded audio assent
- [ ] **P1** Raw audio deleted after transcription unless opted in
- [ ] **P1** Visible countdown to session wipe on the kiosk
- [ ] **P1** Patient-initiated purge
- [ ] **P2** De-identification proxy strips identifiers before any hosted model call, restores after
- [ ] **P2** Debug view showing the proxy's before/after — demos in five seconds
- [ ] **P1** `LLM_PROVIDER=local` runs the whole pipeline on-premise, nothing leaves
- [ ] **P1** Field-level encryption on identifier columns
- [ ] **P1** RBAC: patient / kiosk / nurse / physician / admin
- [ ] **P0** Append-only audit log recording every **read** with actor and reason, enforced by a database trigger ✅ *done in gateway*
- [ ] **P2** Kiosk lockdown mode
- [ ] **P1** Idempotency keys on mutating endpoints ✅ *done for /answer*
- [ ] **P1** Rate limiting, stricter on OTP endpoints

## 9. Working when nothing else does

- [ ] **P0** Service worker + IndexedDB offline queue
- [ ] **P0** Replay on reconnect
- [ ] **P0** Local ASR fallback (IndicConformer)
- [ ] **P1** Local LLM fallback (Sarvam open weights)
- [ ] **P0** Cached TTS clips
- [ ] **P1** Cached NAMASTE / ICD snapshot in Postgres
- [ ] **P0** **Full demo rehearsed once with the network physically off**

## 10. Proving it worked

- [ ] **P1** Doctor-minutes saved, against a baseline you time yourselves
- [ ] **P1** History completeness — required slots filled ÷ required
- [ ] **P1** Slot accuracy against clinician-marked expected values
- [ ] **P0** Red-flag sensitivity — target 100% on the eval set
- [ ] **P1** Turn latency p95 under 1.2 s
- [ ] **P1** Extraction precision, **printed and handwritten reported separately**
- [ ] **P2** Language mix, phone vs kiosk split, ASR fallback rate
- [ ] **P2** Admin dashboard surfacing all of the above
- [ ] **P1** 30 synthetic patient scripts with clinician-marked answers, scored by `make eval`
- [ ] **P2** k6 load test at 200 concurrent sessions
- [ ] **P1** Reviewer named and credentialed on the slide

## 11. Ship checklist

- [ ] **P0** README with one-command setup, architecture diagram, screenshots
- [ ] **P0** CI green: lint, typecheck, tests, ontology validation, FHIR bundle validation
- [ ] **P1** ADRs for every decision that constrains someone else
- [ ] **P1** `SECURITY.md` mapping features to DPDP 2023 obligations
- [ ] **P0** Seed data so a fresh clone demos in under two minutes
- [ ] **P0** Backup demo video recorded and stored locally on two laptops
- [ ] **P0** Demo rehearsed five times without a failure
- [ ] **P1** Answers prepared for the ten questions judges will ask (doc 00, CLAUDE.md)
