from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.prashna_item_source import PrashnaItemSource

T = TypeVar("T", bound="PrashnaItem")


@_attrs_define
class PrashnaItem:
    """
    Attributes:
        slot_id (str):
        question (str):
        value (Any):
        value_label (str): Human-readable label(s) of the answer
        source (PrashnaItemSource):
        confidence (float):
        audio_offset_ms (int | None):
        suggested_value (None | str): The exam-field value the vocabulary maps this answer to (a pre-fill offer); null
            when reference only.
    """

    slot_id: str
    question: str
    value: Any
    value_label: str
    source: PrashnaItemSource
    confidence: float
    audio_offset_ms: int | None
    suggested_value: None | str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        slot_id = self.slot_id

        question = self.question

        value = self.value

        value_label = self.value_label

        source = self.source.value

        confidence = self.confidence

        audio_offset_ms: int | None
        audio_offset_ms = self.audio_offset_ms

        suggested_value: None | str
        suggested_value = self.suggested_value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "slot_id": slot_id,
                "question": question,
                "value": value,
                "value_label": value_label,
                "source": source,
                "confidence": confidence,
                "audio_offset_ms": audio_offset_ms,
                "suggested_value": suggested_value,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        slot_id = d.pop("slot_id")

        question = d.pop("question")

        value = d.pop("value")

        value_label = d.pop("value_label")

        source = PrashnaItemSource(d.pop("source"))

        confidence = d.pop("confidence")

        def _parse_audio_offset_ms(data: object) -> int | None:
            if data is None:
                return data
            return cast(int | None, data)

        audio_offset_ms = _parse_audio_offset_ms(d.pop("audio_offset_ms"))

        def _parse_suggested_value(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        suggested_value = _parse_suggested_value(d.pop("suggested_value"))

        prashna_item = cls(
            slot_id=slot_id,
            question=question,
            value=value,
            value_label=value_label,
            source=source,
            confidence=confidence,
            audio_offset_ms=audio_offset_ms,
            suggested_value=suggested_value,
        )

        prashna_item.additional_properties = d
        return prashna_item

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
