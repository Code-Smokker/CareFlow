from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="VisitDiffChangedFieldsItem")


@_attrs_define
class VisitDiffChangedFieldsItem:
    """
    Attributes:
        field_path (str):
        previous_value (Any):
        current_value (Any):
    """

    field_path: str
    previous_value: Any
    current_value: Any
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        field_path = self.field_path

        previous_value = self.previous_value

        current_value = self.current_value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "field_path": field_path,
                "previous_value": previous_value,
                "current_value": current_value,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        field_path = d.pop("field_path")

        previous_value = d.pop("previous_value")

        current_value = d.pop("current_value")

        visit_diff_changed_fields_item = cls(
            field_path=field_path,
            previous_value=previous_value,
            current_value=current_value,
        )

        visit_diff_changed_fields_item.additional_properties = d
        return visit_diff_changed_fields_item

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
