from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.bounding_box import BoundingBox


T = TypeVar("T", bound="ExtractedField")


@_attrs_define
class ExtractedField:
    """
    Attributes:
        field (str):
        value (str):
        confidence (float):
        bounding_box (BoundingBox):
        needs_confirmation (bool): True for handwritten regions — never auto-accepted (CLAUDE.md rule 5).
        dictionary_matches (list[str]): Dictionary-matched shortlist for the human to confirm against.
    """

    field: str
    value: str
    confidence: float
    bounding_box: BoundingBox
    needs_confirmation: bool
    dictionary_matches: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        field = self.field

        value = self.value

        confidence = self.confidence

        bounding_box = self.bounding_box.to_dict()

        needs_confirmation = self.needs_confirmation

        dictionary_matches = self.dictionary_matches

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "field": field,
                "value": value,
                "confidence": confidence,
                "bounding_box": bounding_box,
                "needs_confirmation": needs_confirmation,
                "dictionary_matches": dictionary_matches,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.bounding_box import BoundingBox  # noqa: PLC0415

        d = dict(src_dict)
        field = d.pop("field")

        value = d.pop("value")

        confidence = d.pop("confidence")

        bounding_box = BoundingBox.from_dict(d.pop("bounding_box"))

        needs_confirmation = d.pop("needs_confirmation")

        dictionary_matches = cast(list[str], d.pop("dictionary_matches"))

        extracted_field = cls(
            field=field,
            value=value,
            confidence=confidence,
            bounding_box=bounding_box,
            needs_confirmation=needs_confirmation,
            dictionary_matches=dictionary_matches,
        )

        extracted_field.additional_properties = d
        return extracted_field

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
