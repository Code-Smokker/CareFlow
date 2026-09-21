from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.save_ayurveda_exam_body_fields_item import (
        SaveAyurvedaExamBodyFieldsItem,
    )


T = TypeVar("T", bound="SaveAyurvedaExamBody")


@_attrs_define
class SaveAyurvedaExamBody:
    """
    Attributes:
        recorded_by (str): Same identifier convention as `signed_by` — no RBAC until Day 4.
        fields (list[SaveAyurvedaExamBodyFieldsItem]):
    """

    recorded_by: str
    fields: list[SaveAyurvedaExamBodyFieldsItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        recorded_by = self.recorded_by

        fields = []
        for fields_item_data in self.fields:
            fields_item = fields_item_data.to_dict()
            fields.append(fields_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "recorded_by": recorded_by,
                "fields": fields,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.save_ayurveda_exam_body_fields_item import (
            SaveAyurvedaExamBodyFieldsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        recorded_by = d.pop("recorded_by")

        fields = []
        _fields = d.pop("fields")
        for fields_item_data in _fields:
            fields_item = SaveAyurvedaExamBodyFieldsItem.from_dict(fields_item_data)

            fields.append(fields_item)

        save_ayurveda_exam_body = cls(
            recorded_by=recorded_by,
            fields=fields,
        )

        save_ayurveda_exam_body.additional_properties = d
        return save_ayurveda_exam_body

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
