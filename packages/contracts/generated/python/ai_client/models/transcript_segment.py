from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="TranscriptSegment")


@_attrs_define
class TranscriptSegment:
    """
    Attributes:
        text (str):
        start_ms (int):
        end_ms (int):
        confidence (float):
    """

    text: str
    start_ms: int
    end_ms: int
    confidence: float
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        text = self.text

        start_ms = self.start_ms

        end_ms = self.end_ms

        confidence = self.confidence

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "text": text,
                "start_ms": start_ms,
                "end_ms": end_ms,
                "confidence": confidence,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        text = d.pop("text")

        start_ms = d.pop("start_ms")

        end_ms = d.pop("end_ms")

        confidence = d.pop("confidence")

        transcript_segment = cls(
            text=text,
            start_ms=start_ms,
            end_ms=end_ms,
            confidence=confidence,
        )

        transcript_segment.additional_properties = d
        return transcript_segment

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
