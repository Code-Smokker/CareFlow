# CareFlow eval report

```
CareFlow eval — 45 slot checks, 8 scripts
========================================================================================
Metric                                     Result  Detail
----------------------------------------------------------------------------------------
Red-flag sensitivity (5 red_flag cases)       5/5  target 100%
Red-flag specificity (3 messy cases)          3/3  non-flag cases correctly not escalated
Slot accuracy — messy/extraction cases        0/6  via /fill-slot, no LLM credentials configured in this run
----------------------------------------------------------------------------------------
Per-script detail:
  [PASS] chest_pain_acs_radiation         expected=['acs_radiation'] fired=['acs_radiation']
  [PASS] chest_pain_acs_suspected         expected=['acs_suspected'] fired=['acs_suspected']
  [PASS] chest_pain_exertional_angina     expected=['exertional_angina'] fired=['exertional_angina']
  [PASS] fever_dengue_warning             expected=['dengue_warning'] fired=['dengue_warning']
  [PASS] fever_meningism                  expected=['meningism'] fired=['meningism']
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
