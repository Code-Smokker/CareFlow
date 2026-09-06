from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.visit_diff_changed_fields_item import VisitDiffChangedFieldsItem


T = TypeVar("T", bound="VisitDiff")


@_attrs_define
class VisitDiff:
    """
    Attributes:
        previous_visit_id (None | str):
        changed_fields (list[VisitDiffChangedFieldsItem]):
    """

    previous_visit_id: None | str
    changed_fields: list[VisitDiffChangedFieldsItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        previous_visit_id: None | str
        previous_visit_id = self.previous_visit_id

        changed_fields = []
        for changed_fields_item_data in self.changed_fields:
            changed_fields_item = changed_fields_item_data.to_dict()
            changed_fields.append(changed_fields_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "previous_visit_id": previous_visit_id,
                "changed_fields": changed_fields,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.visit_diff_changed_fields_item import (
            VisitDiffChangedFieldsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)

        def _parse_previous_visit_id(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        previous_visit_id = _parse_previous_visit_id(d.pop("previous_visit_id"))

        changed_fields = []
        _changed_fields = d.pop("changed_fields")
        for changed_fields_item_data in _changed_fields:
            changed_fields_item = VisitDiffChangedFieldsItem.from_dict(
                changed_fields_item_data
            )

            changed_fields.append(changed_fields_item)

        visit_diff = cls(
            previous_visit_id=previous_visit_id,
            changed_fields=changed_fields,
        )

        visit_diff.additional_properties = d
        return visit_diff

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
