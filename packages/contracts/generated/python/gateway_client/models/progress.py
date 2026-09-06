from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="Progress")


@_attrs_define
class Progress:
    """
    Attributes:
        module_id (str):
        completed_slots (int):
        total_slots (int):
        percent (float):
    """

    module_id: str
    completed_slots: int
    total_slots: int
    percent: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        module_id = self.module_id

        completed_slots = self.completed_slots

        total_slots = self.total_slots

        percent = self.percent

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "module_id": module_id,
                "completed_slots": completed_slots,
                "total_slots": total_slots,
                "percent": percent,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        module_id = d.pop("module_id")

        completed_slots = d.pop("completed_slots")

        total_slots = d.pop("total_slots")

        percent = d.pop("percent")

        progress = cls(
            module_id=module_id,
            completed_slots=completed_slots,
            total_slots=total_slots,
            percent=percent,
        )

        progress.additional_properties = d
        return progress

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
