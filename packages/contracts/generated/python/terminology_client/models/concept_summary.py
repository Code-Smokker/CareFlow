from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.terminology_system import TerminologySystem

T = TypeVar("T", bound="ConceptSummary")


@_attrs_define
class ConceptSummary:
    """
    Attributes:
        system (TerminologySystem):
        code (str):
        display (str):
        score (float):
    """

    system: TerminologySystem
    code: str
    display: str
    score: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        system = self.system.value

        code = self.code

        display = self.display

        score = self.score

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "system": system,
                "code": code,
                "display": display,
                "score": score,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        system = TerminologySystem(d.pop("system"))

        code = d.pop("code")

        display = d.pop("display")

        score = d.pop("score")

        concept_summary = cls(
            system=system,
            code=code,
            display=display,
            score=score,
        )

        concept_summary.additional_properties = d
        return concept_summary

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
