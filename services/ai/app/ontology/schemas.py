"""Mirrors packages/ontology/schema/module.schema.json — see
services/gateway/src/ontology/ontology.types.ts for the TS-side twin of this file. The JSON
schema (validated in CI via packages/ontology/scripts/validate.py) is authoritative; this is
the Python-side load-time check so a malformed module fails loudly here too."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator

SlotType = Literal["string", "number", "boolean", "enum", "enum_multi", "duration", "region"]
OntologyInputMode = Literal["voice", "chips", "multi", "bodymap", "facescale", "duration"]


class SlotOption(BaseModel):
    value: str
    label: dict[str, str]
    icon: str | None = None


class SlotRange(BaseModel):
    min: float | None = None
    max: float | None = None


class Slot(BaseModel):
    id: str
    type: SlotType
    required: bool
    input: list[OntologyInputMode] = Field(min_length=2)
    options: list[SlotOption] | None = None
    range: SlotRange | None = None
    prompt: dict[str, str]
    hint: dict[str, str] | None = None
    ask_if: str | None = None

    @model_validator(mode="after")
    def _prompt_has_en(self) -> "Slot":
        if "en" not in self.prompt:
            raise ValueError(f"slot '{self.id}': prompt.en is required")
        return self


class RedFlagRule(BaseModel):
    id: str
    when: str
    action: Literal["escalate", "flag"]
    severity: Literal[1, 2, 3]
    rationale: str | None = None
    speak: dict[str, str] | None = None


class Followup(BaseModel):
    if_: str = Field(alias="if")
    load_module: str


class OntologyModule(BaseModel):
    id: str
    label: str
    framework: Literal["SOCRATES", "OLDCARTS", "DASHAVIDHA", "custom"]
    description: str | None = None
    source: str | None = None
    triggers: list[str] = Field(min_length=1)
    slots: list[Slot] = Field(min_length=1)
    red_flags: list[RedFlagRule] | None = None
    followups: list[Followup] | None = None


class FiredRedFlag(BaseModel):
    rule_id: str
    severity: Literal[1, 2, 3]
    quote: str
