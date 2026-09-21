"""Loads packages/ontology/modules/*.yaml once and keeps them in memory. Mirrors
services/gateway/src/ontology/ontology.service.ts's loadModules — same source YAML, two
independent loaders, one per service."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import yaml
from pydantic import ValidationError

from app.config import settings
from app.ontology.schemas import OntologyModule


class UnknownModuleError(Exception):
    def __init__(self, module_id: str):
        super().__init__(f"Unknown ontology module: {module_id}")
        self.module_id = module_id


@lru_cache(maxsize=1)
def _load_all() -> dict[str, OntologyModule]:
    modules: dict[str, OntologyModule] = {}
    directory: Path = settings.ontology_modules_path
    # **/*.yaml (recursive) so modules/ayush/*.yaml is picked up too, matching
    # packages/ontology/scripts/validate.py's own glob.
    for path in sorted(directory.glob("**/*.yaml")) + sorted(directory.glob("**/*.yml")):
        # `*-vocabulary.yaml` (modules/ayush/pariksha-vocabulary.yaml) is the clinician-side
        # examination vocabulary served by the gateway, not an interview module.
        if path.stem.endswith("-vocabulary"):
            continue
        raw = yaml.safe_load(path.read_text(encoding="utf-8"))
        try:
            module = OntologyModule.model_validate(raw)
        except ValidationError as exc:
            raise ValueError(f"Ontology module {path.name} failed validation: {exc}") from exc
        modules[module.id] = module
    return modules


def list_modules() -> list[OntologyModule]:
    return list(_load_all().values())


def get_module(module_id: str) -> OntologyModule:
    modules = _load_all()
    module = modules.get(module_id)
    if module is None:
        raise UnknownModuleError(module_id)
    return module
