from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.transcript_segment import TranscriptSegment


T = TypeVar("T", bound="TranscribeResponse200")


@_attrs_define
class TranscribeResponse200:
    """
    Attributes:
        text (str):
        confidence (float):
        segments (list[TranscriptSegment]):
    """

    text: str
    confidence: float
    segments: list[TranscriptSegment]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        text = self.text

        confidence = self.confidence

        segments = []
        for segments_item_data in self.segments:
            segments_item = segments_item_data.to_dict()
            segments.append(segments_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "text": text,
                "confidence": confidence,
                "segments": segments,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.transcript_segment import TranscriptSegment  # noqa: PLC0415

        d = dict(src_dict)
        text = d.pop("text")

        confidence = d.pop("confidence")

        segments = []
        _segments = d.pop("segments")
        for segments_item_data in _segments:
            segments_item = TranscriptSegment.from_dict(segments_item_data)

            segments.append(segments_item)

        transcribe_response_200 = cls(
            text=text,
            confidence=confidence,
            segments=segments,
        )

        transcribe_response_200.additional_properties = d
        return transcribe_response_200

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
