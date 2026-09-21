from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="AyurvedaVocabularyReview")


@_attrs_define
class AyurvedaVocabularyReview:
    """
    Attributes:
        status (str):
        note (str):
        verified_by (None | str | Unset):
    """

    status: str
    note: str
    verified_by: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        status = self.status

        note = self.note

        verified_by: None | str | Unset
        if isinstance(self.verified_by, Unset):
            verified_by = UNSET
        else:
            verified_by = self.verified_by

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "status": status,
                "note": note,
            }
        )
        if verified_by is not UNSET:
            field_dict["verified_by"] = verified_by

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        status = d.pop("status")

        note = d.pop("note")

        def _parse_verified_by(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        verified_by = _parse_verified_by(d.pop("verified_by", UNSET))

        ayurveda_vocabulary_review = cls(
            status=status,
            note=note,
            verified_by=verified_by,
        )

        ayurveda_vocabulary_review.additional_properties = d
        return ayurveda_vocabulary_review

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
