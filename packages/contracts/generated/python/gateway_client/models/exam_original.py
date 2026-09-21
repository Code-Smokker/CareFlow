from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.exam_original_source import ExamOriginalSource

T = TypeVar("T", bound="ExamOriginal")


@_attrs_define
class ExamOriginal:
    """
    Attributes:
        value (Any):
        value_label (str):
        source (ExamOriginalSource):
        confidence (float):
    """

    value: Any
    value_label: str
    source: ExamOriginalSource
    confidence: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        value = self.value

        value_label = self.value_label

        source = self.source.value

        confidence = self.confidence

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "value": value,
                "value_label": value_label,
                "source": source,
                "confidence": confidence,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        value = d.pop("value")

        value_label = d.pop("value_label")

        source = ExamOriginalSource(d.pop("source"))

        confidence = d.pop("confidence")

        exam_original = cls(
            value=value,
            value_label=value_label,
            source=source,
            confidence=confidence,
        )

        exam_original.additional_properties = d
        return exam_original

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
