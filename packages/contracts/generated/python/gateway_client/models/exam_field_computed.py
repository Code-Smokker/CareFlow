from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.exam_field_computed_kind import ExamFieldComputedKind
from ..types import UNSET, Unset

T = TypeVar("T", bound="ExamFieldComputed")


@_attrs_define
class ExamFieldComputed:
    """
    Attributes:
        kind (ExamFieldComputedKind):
        height_field (str | Unset):
        weight_field (str | Unset):
        age_field (str | Unset):
    """

    kind: ExamFieldComputedKind
    height_field: str | Unset = UNSET
    weight_field: str | Unset = UNSET
    age_field: str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        kind = self.kind.value

        height_field = self.height_field

        weight_field = self.weight_field

        age_field = self.age_field

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "kind": kind,
            }
        )
        if height_field is not UNSET:
            field_dict["height_field"] = height_field
        if weight_field is not UNSET:
            field_dict["weight_field"] = weight_field
        if age_field is not UNSET:
            field_dict["age_field"] = age_field

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        kind = ExamFieldComputedKind(d.pop("kind"))

        height_field = d.pop("height_field", UNSET)

        weight_field = d.pop("weight_field", UNSET)

        age_field = d.pop("age_field", UNSET)

        exam_field_computed = cls(
            kind=kind,
            height_field=height_field,
            weight_field=weight_field,
            age_field=age_field,
        )

        exam_field_computed.additional_properties = d
        return exam_field_computed

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
