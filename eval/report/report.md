# CareFlow eval report

```
CareFlow eval — 130 slot checks, 21 scripts
========================================================================================
Metric                                         Result  Detail
----------------------------------------------------------------------------------------
Red-flag sensitivity (18 red_flag cases)        18/18  target 100%
Red-flag specificity (3 messy cases)              3/3  non-flag cases correctly not escalated
Slot accuracy — messy/extraction cases            0/6  via /fill-slot, no LLM credentials configured in this run
----------------------------------------------------------------------------------------
Per-script detail:
  [PASS] abdominal_gi_bleed               expected=['gi_bleed'] fired=['gi_bleed']
  [PASS] abdominal_jaundice_flag          expected=['jaundice_flag'] fired=['jaundice_flag']
  [PASS] abdominal_peritonitis_suspected  expected=['peritonitis_suspected'] fired=['peritonitis_suspected']
  [PASS] abdominal_persistent_vomiting    expected=['persistent_vomiting'] fired=['persistent_vomiting']
  [PASS] chest_pain_acs_radiation         expected=['acs_radiation'] fired=['acs_radiation']
  [PASS] chest_pain_acs_suspected         expected=['acs_suspected'] fired=['acs_suspected']
  [PASS] chest_pain_exertional_angina     expected=['exertional_angina'] fired=['exertional_angina']
  [PASS] cough_breathless_at_rest         expected=['breathless_at_rest'] fired=['breathless_at_rest']
  [PASS] cough_cardiac_pattern            expected=['cardiac_pattern'] fired=['cardiac_pattern']
  [PASS] cough_constitutional_symptoms    expected=['constitutional_symptoms'] fired=['constitutional_symptoms']
  [PASS] cough_hemoptysis                 expected=['hemoptysis'] fired=['hemoptysis']
  [PASS] cough_possible_tb                expected=['possible_tb'] fired=['possible_tb']
  [PASS] fever_dengue_warning             expected=['dengue_warning'] fired=['dengue_warning']
  [PASS] fever_meningism                  expected=['meningism'] fired=['meningism']
  [PASS] joint_constitutional_symptoms    expected=['constitutional_symptoms'] fired=['constitutional_symptoms']
  [PASS] joint_inflammatory_pattern       expected=['inflammatory_pattern'] fired=['inflammatory_pattern']
  [PASS] joint_septic_arthritis           expected=['septic_arthritis_suspected'] fired=['septic_arthritis_suspected']
  [PASS] joint_trauma_severe              expected=['trauma_severe'] fired=['trauma_severe']
  [PASS] messy_codeswitch_fever           expected=[] fired=[]
  [PASS] messy_contradiction_chest_pain   expected=[] fired=[]
  [PASS] messy_mumbling_fever             expected=[] fired=[]
  [FAIL] messy_codeswitch_fever.pattern              expected='continuous' actual=None (needs_clarification)
  [FAIL] messy_codeswitch_fever.measured             expected='yes_high' actual=None (needs_clarification)
  [FAIL] messy_contradiction_chest_pain.severity             expected=7 actual=None (needs_clarification)
  [FAIL] messy_contradiction_chest_pain.onset                expected='sudden' actual=None (needs_clarification)
  [FAIL] messy_mumbling_fever.duration             expected='3_days' actual=None (needs_clarification)
  [FAIL] messy_mumbling_fever.associated           expected=['headache'] actual=None (needs_clarification)
```
