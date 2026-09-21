from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.ayurvedic_section import AyurvedicSection
    from ..models.red_flag import RedFlag
    from ..models.summary_field import SummaryField


T = TypeVar("T", bound="VisitSummary")


@_attrs_define
class VisitSummary:
    """
    Attributes:
        visit_id (str):
        session_id (str): Opaque session identifier.
        fields (list[SummaryField]):
        signed (bool):
        red_flags (list[RedFlag]): Unacknowledged red flags for this visit — a non-empty array is what the clinician
            console reads as "open this on the red banner" (docs/05-interview-engine.md); this is derived live from the
            red_flag table on every request, not a separate stamped flag that could drift out of sync with it.
        ayurveda_sections (list[AyurvedicSection] | Unset): The Ayurvedic case sheet in PS 26047 order — Prashna,
            Trividha, Ashtavidha, Dashavidha, Vyadhi Vinishchaya — composed live from the patient's answers and the Vaidya's
            examination record. Empty for a visit with no Ayurvedic data.
    """

    visit_id: str
    session_id: str
    fields: list[SummaryField]
    signed: bool
    red_flags: list[RedFlag]
    ayurveda_sections: list[AyurvedicSection] | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        visit_id = self.visit_id

        session_id = self.session_id

        fields = []
        for fields_item_data in self.fields:
            fields_item = fields_item_data.to_dict()
            fields.append(fields_item)

        signed = self.signed

        red_flags = []
        for red_flags_item_data in self.red_flags:
            red_flags_item = red_flags_item_data.to_dict()
            red_flags.append(red_flags_item)

        ayurveda_sections: list[dict[str, Any]] | Unset = UNSET
        if not isinstance(self.ayurveda_sections, Unset):
            ayurveda_sections = []
            for ayurveda_sections_item_data in self.ayurveda_sections:
                ayurveda_sections_item = ayurveda_sections_item_data.to_dict()
                ayurveda_sections.append(ayurveda_sections_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "visit_id": visit_id,
                "session_id": session_id,
                "fields": fields,
                "signed": signed,
                "red_flags": red_flags,
            }
        )
        if ayurveda_sections is not UNSET:
            field_dict["ayurveda_sections"] = ayurveda_sections

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurvedic_section import AyurvedicSection  # noqa: PLC0415
        from ..models.red_flag import RedFlag  # noqa: PLC0415
        from ..models.summary_field import SummaryField  # noqa: PLC0415

        d = dict(src_dict)
        visit_id = d.pop("visit_id")

        session_id = d.pop("session_id")

        fields = []
        _fields = d.pop("fields")
        for fields_item_data in _fields:
            fields_item = SummaryField.from_dict(fields_item_data)

            fields.append(fields_item)

        signed = d.pop("signed")

        red_flags = []
        _red_flags = d.pop("red_flags")
        for red_flags_item_data in _red_flags:
            red_flags_item = RedFlag.from_dict(red_flags_item_data)

            red_flags.append(red_flags_item)

        _ayurveda_sections = d.pop("ayurveda_sections", UNSET)
        ayurveda_sections: list[AyurvedicSection] | Unset = UNSET
        if _ayurveda_sections is not UNSET:
            ayurveda_sections = []
            for ayurveda_sections_item_data in _ayurveda_sections:
                ayurveda_sections_item = AyurvedicSection.from_dict(
                    ayurveda_sections_item_data
                )

                ayurveda_sections.append(ayurveda_sections_item)

        visit_summary = cls(
            visit_id=visit_id,
            session_id=session_id,
            fields=fields,
            signed=signed,
            red_flags=red_flags,
            ayurveda_sections=ayurveda_sections,
        )

        visit_summary.additional_properties = d
        return visit_summary

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
