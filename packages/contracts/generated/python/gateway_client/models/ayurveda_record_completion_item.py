from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.ayurveda_record_completion_item_status import (
    AyurvedaRecordCompletionItemStatus,
)

T = TypeVar("T", bound="AyurvedaRecordCompletionItem")


@_attrs_define
class AyurvedaRecordCompletionItem:
    """
    Attributes:
        step_id (str):
        filled (int):
        required_total (int):
        status (AyurvedaRecordCompletionItemStatus):
    """

    step_id: str
    filled: int
    required_total: int
    status: AyurvedaRecordCompletionItemStatus
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        step_id = self.step_id

        filled = self.filled

        required_total = self.required_total

        status = self.status.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "step_id": step_id,
                "filled": filled,
                "required_total": required_total,
                "status": status,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        step_id = d.pop("step_id")

        filled = d.pop("filled")

        required_total = d.pop("required_total")

        status = AyurvedaRecordCompletionItemStatus(d.pop("status"))

        ayurveda_record_completion_item = cls(
            step_id=step_id,
            filled=filled,
            required_total=required_total,
            status=status,
        )

        ayurveda_record_completion_item.additional_properties = d
        return ayurveda_record_completion_item

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
