# 07 — AYUSH capture and dual coding

The sponsor is the All India Institute of Ayurveda. Most teams will bolt an "Ayurveda tab"
onto an allopathic form. Making the AYUSH path first-class separates us from the field in one
screen.

## Dashavidha Pariksha as ten typed axes

Captured as structured fields with tap alternatives, never as free text:

| Axis | Assesses |
|---|---|
| **Prakriti** | Constitution |
| **Vikriti** | Current imbalance |
| **Sara** | Tissue excellence |
| **Samhanana** | Build / compactness |
| **Pramana** | Body measurements |
| **Satmya** | Adaptability / suitability |
| **Sattva** | Mental strength |
| **Ahara Shakti** | Digestive and food-intake capacity |
| **Vyayama Shakti** | Exercise tolerance |
| **Vaya** | Age category |

Layered above the Trividha and Ashtavidha Pariksha sets, plus **Agni** (digestive fire),
**Koshtha** (bowel nature), **Nidana** (causative factors) and an **Ahara–Vihara** diet and
lifestyle block.

Modelled the same way as complaint modules — YAML in `packages/ontology/modules/ayush/` — so
the same engine, the same validation, the same provenance.

## Two rules for the Ayurvedic path

**Do not invent the questionnaire.** CCRAS has published work on a standardized Prakriti
assessment tool, and validated Prakriti instruments exist in the peer-reviewed literature.
Implement a published instrument, cite it in the doc and on the slide, and say: *"we did not
design these questions, Ayurvedic researchers did."* That sentence converts a clinician judge.

**Report, never diagnose.** CareFlow presents the Prakriti response profile and the computed
dominant-dosha *tendency*, with every item-level answer visible, as an assessment aid for the
vaidya to confirm. It does not assert a constitution. Only the physician's confirmation is
stored as clinical fact.

## Dual coding — the differentiator with a policy behind it

India's ICD-11 Traditional Medicine Module 2 roadmap pushes AYUSH institutions toward recording
morbidity in **both** the national AYUSH terminology (NAMASTE) and ICD-11 TM2, so Ayurveda,
Siddha and Unani diagnoses become globally comparable. CareFlow emits both from the start.

```jsonc
// FHIR R4 Condition — one clinical concept, three vocabularies
{
  "resourceType": "Condition",
  "code": {
    "coding": [
      { "system": "http://terminology.ayush.gov.in/namaste",
        "code": "PLACEHOLDER", "display": "Amavata" },
      { "system": "http://id.who.int/icd/release/11/mms",
        "code": "PLACEHOLDER", "display": "TM2 pattern/disorder" },
      { "system": "http://id.who.int/icd/release/11/mms",
        "code": "PLACEHOLDER", "display": "Biomedicine equivalent" }
    ],
    "text": "Amavata — patient-reported joint pain with morning stiffness"
  },
  "verificationStatus": { "coding": [{ "code": "provisional" }] },
  "extension": [
    { "url": "https://careflow.dev/fhir/provenance", "valueString": "voice@04:12" }
  ]
}
```

> **Every code above is a PLACEHOLDER.** Replace with real codes from the NAMASTE export and
> the WHO ICD-11 browser on Day 3, and record the source URL beside each one. An Ayurveda
> faculty judge will recognise a wrong code, and it will cost more than it saves.

## Terminology service

1. Load the **NAMASTE** terminology export into a FHIR `CodeSystem`.
2. Pull **ICD-11 TM2 and MMS** entities from the WHO ICD-API — free, OAuth2 client-credentials,
   with an official FHIR-facing surface.
3. Store the crosswalk as a FHIR `ConceptMap`, exposed through `$translate`.
4. Search with `pg_trgm` **and** embeddings so *amavata*, *āmavāta* and *aam vaat* all resolve
   to the same concept.
5. Cache the ICD snapshot in Postgres so the demo works offline.

Endpoints in doc 03. Every mapping carries an `equivalence` value and, where a human checked
it, a `reviewed_by` — do not present an unreviewed automatic mapping as authoritative.

## Physician-facing display

Show both codes side by side in the console, labelled, with the mapping equivalence visible.
The physician can override the suggested code. Their choice, not the suggestion, is what goes
into the signed bundle.

## Verification checklist before presenting

- [ ] Every NAMASTE code checked against the official export, source URL recorded
- [ ] Every ICD-11 TM2 code checked in the WHO browser, URI recorded
- [ ] Prakriti instrument cited with its publication
- [ ] Someone with Ayurvedic training has read the AYUSH question set out loud
- [ ] The word "diagnosis" appears nowhere in the AYUSH UI
