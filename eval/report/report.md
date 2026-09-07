# CareFlow eval report

```
CareFlow eval — 165 slot checks, 30 scripts
========================================================================================
Metric                                         Result  Detail
----------------------------------------------------------------------------------------
Red-flag sensitivity (24 red_flag cases)        24/24  target 100%
Red-flag specificity (6 messy cases)              6/6  non-flag cases correctly not escalated
Slot accuracy — messy/extraction cases          11/12  via /fill-slot, 10/12 calls answered by a live LLM provider
----------------------------------------------------------------------------------------
Per-script detail:
  [PASS] abdominal_gi_bleed               expected=['gi_bleed'] fired=['gi_bleed']
  [PASS] abdominal_jaundice_flag          expected=['jaundice_flag'] fired=['jaundice_flag']
  [PASS] abdominal_peritonitis_suspected  expected=['peritonitis_suspected'] fired=['peritonitis_suspected']
  [PASS] abdominal_persistent_vomiting    expected=['persistent_vomiting'] fired=['persistent_vomiting']
  [PASS] chest_pain_acs_radiation         expected=['acs_radiation'] fired=['acs_radiation']
  [PASS] chest_pain_acs_suspected         expected=['acs_suspected'] fired=['acs_suspected']
  [PASS] chest_pain_cardiac_dyspnoea      expected=['cardiac_with_dyspnoea'] fired=['cardiac_with_dyspnoea']
  [PASS] chest_pain_exertional_angina     expected=['exertional_angina'] fired=['exertional_angina']
  [PASS] cough_breathless_at_rest         expected=['breathless_at_rest'] fired=['breathless_at_rest']
  [PASS] cough_cardiac_pattern            expected=['cardiac_pattern'] fired=['cardiac_pattern']
  [PASS] cough_constitutional_symptoms    expected=['constitutional_symptoms'] fired=['constitutional_symptoms']
  [PASS] cough_hemoptysis                 expected=['hemoptysis'] fired=['hemoptysis']
  [PASS] cough_possible_tb                expected=['possible_tb'] fired=['possible_tb']
  [PASS] fever_altered_sensorium          expected=['altered_sensorium'] fired=['altered_sensorium']
  [PASS] fever_dengue_warning             expected=['dengue_warning'] fired=['dengue_warning']
  [PASS] fever_meningism                  expected=['meningism'] fired=['meningism']
  [PASS] fever_prolonged                  expected=['prolonged_fever'] fired=['prolonged_fever']
  [PASS] fever_respiratory_distress       expected=['respiratory_distress'] fired=['respiratory_distress']
  [PASS] generic_severe_at_rest           expected=['severe_at_rest'] fired=['severe_at_rest']
  [PASS] generic_sudden_severe_onset      expected=['sudden_severe_onset'] fired=['sudden_severe_onset']
  [PASS] joint_constitutional_symptoms    expected=['constitutional_symptoms'] fired=['constitutional_symptoms']
  [PASS] joint_inflammatory_pattern       expected=['inflammatory_pattern'] fired=['inflammatory_pattern']
  [PASS] joint_septic_arthritis           expected=['septic_arthritis_suspected'] fired=['septic_arthritis_suspected']
  [PASS] joint_trauma_severe              expected=['trauma_severe'] fired=['trauma_severe']
  [PASS] messy_codeswitch_cough           expected=[] fired=[]
  [PASS] messy_codeswitch_fever           expected=[] fired=[]
  [PASS] messy_codeswitch_joint           expected=[] fired=[]
  [PASS] messy_contradiction_chest_pain   expected=[] fired=[]
  [PASS] messy_mumbling_abdominal         expected=['gi_bleed'] fired=['gi_bleed']
  [PASS] messy_mumbling_fever             expected=[] fired=[]
  [PASS] messy_codeswitch_cough.sputum_color         expected='yellow_green' actual='yellow_green'
  [PASS] messy_codeswitch_cough.breathlessness_trigger expected='walking' actual='walking'
  [PASS] messy_codeswitch_fever.pattern              expected='continuous' actual='continuous'
  [PASS] messy_codeswitch_fever.measured             expected='yes_high' actual='yes_high'
  [PASS] messy_codeswitch_joint.pattern              expected='single_joint' actual='single_joint'
  [PASS] messy_codeswitch_joint.morning_stiffness_duration expected='over_1hr' actual='over_1hr'
  [PASS] messy_contradiction_chest_pain.severity             expected=7 actual=7
  [FAIL] messy_contradiction_chest_pain.onset                expected='sudden' actual=None (needs_clarification)
  [PASS] messy_mumbling_abdominal.duration             expected='3_days' actual='3_days' (needs_clarification)
  [PASS] messy_mumbling_abdominal.associated           expected=['black_stool'] actual=['black_stool']
  [PASS] messy_mumbling_fever.duration             expected='3_days' actual='3_days'
  [PASS] messy_mumbling_fever.associated           expected=['headache'] actual=['headache']
```
