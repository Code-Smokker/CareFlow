"""The ai service and the gateway load the same packages/ontology/modules tree independently.
`*-vocabulary.yaml` (the clinician-side Pariksha vocabulary) is not an interview module and must
never be parsed as one; the AYUSH Prashna modules beside it must load."""

from app.ontology.loader import get_module, list_modules

AYUSH_PRASHNA_MODULES = {
    "prakriti", "agni", "koshtha", "mutra", "mala", "ahara", "vihara",
    "nidana", "satmya", "ahara_shakti", "vyayama_shakti",
}


def test_vocabulary_file_is_not_loaded_as_a_module() -> None:
    ids = {m.id for m in list_modules()}
    assert "pariksha_vocabulary" not in ids
    assert "pariksha-vocabulary" not in ids


def test_every_ayush_prashna_module_loads_with_a_tap_path_on_every_slot() -> None:
    ids = {m.id for m in list_modules()}
    assert AYUSH_PRASHNA_MODULES <= ids
    for module_id in AYUSH_PRASHNA_MODULES:
        for slot in get_module(module_id).slots:
            assert set(slot.input) & {"chips", "multi"}, f"{slot.id} has no tap path"
            assert "voice" in slot.input, f"{slot.id} has no voice path"
