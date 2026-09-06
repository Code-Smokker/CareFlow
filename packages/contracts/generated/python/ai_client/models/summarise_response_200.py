from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.summarise_response_200_structured import (
        SummariseResponse200Structured,
    )


T = TypeVar("T", bound="SummariseResponse200")


@_attrs_define
class SummariseResponse200:
    """
    Attributes:
        structured (SummariseResponse200Structured): Keys: chief_complaint, history_of_present_illness, past_history,
            drugs_and_allergy, family_history, personal_history, review_of_systems, prior_investigations
            (docs/14-features.md's standard clinical order). Sections with no data yet (nothing upstream of HPI is built)
            are null/[], never fabricated. Every leaf value is a SummaryField-shaped object: { value, source, confidence,
            ref, low_confidence } — ref is the audio offset in ms (voice answers) or the slot_id (everything else); low
            confidence is marked via the flag, the value is never dropped.
        rendered_en (str):
        rendered_local (str):
    """

    structured: SummariseResponse200Structured
    rendered_en: str
    rendered_local: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        structured = self.structured.to_dict()

        rendered_en = self.rendered_en

        rendered_local = self.rendered_local

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "structured": structured,
                "rendered_en": rendered_en,
                "rendered_local": rendered_local,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.summarise_response_200_structured import (
            SummariseResponse200Structured,  # noqa: PLC0415
        )

        d = dict(src_dict)
        structured = SummariseResponse200Structured.from_dict(d.pop("structured"))

        rendered_en = d.pop("rendered_en")

        rendered_local = d.pop("rendered_local")

        summarise_response_200 = cls(
            structured=structured,
            rendered_en=rendered_en,
            rendered_local=rendered_local,
        )

        summarise_response_200.additional_properties = d
        return summarise_response_200

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
