from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.answer_input_mode import AnswerInputMode
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.slot_value_type_4 import SlotValueType4


T = TypeVar("T", bound="Answer")


@_attrs_define
class Answer:
    """
    Attributes:
        slot_id (str):
        value (bool | float | list[str] | None | SlotValueType4 | str): Typed per the slot schema declared in
            packages/ontology.
        input_mode (AnswerInputMode):
        confidence (float):
        audio_uri (None | str | Unset):
        audio_offset_ms (int | None | Unset):
    """

    slot_id: str
    value: bool | float | list[str] | None | SlotValueType4 | str
    input_mode: AnswerInputMode
    confidence: float
    audio_uri: None | str | Unset = UNSET
    audio_offset_ms: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.slot_value_type_4 import SlotValueType4  # noqa: PLC0415

        slot_id = self.slot_id

        value: bool | dict[str, Any] | float | list[str] | None | str
        if isinstance(self.value, list):
            value = self.value

        elif isinstance(self.value, SlotValueType4):
            value = self.value.to_dict()
        else:
            value = self.value

        input_mode = self.input_mode.value

        confidence = self.confidence

        audio_uri: None | str | Unset
        if isinstance(self.audio_uri, Unset):
            audio_uri = UNSET
        else:
            audio_uri = self.audio_uri

        audio_offset_ms: int | None | Unset
        if isinstance(self.audio_offset_ms, Unset):
            audio_offset_ms = UNSET
        else:
            audio_offset_ms = self.audio_offset_ms

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "slot_id": slot_id,
                "value": value,
                "input_mode": input_mode,
                "confidence": confidence,
            }
        )
        if audio_uri is not UNSET:
            field_dict["audio_uri"] = audio_uri
        if audio_offset_ms is not UNSET:
            field_dict["audio_offset_ms"] = audio_offset_ms

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.slot_value_type_4 import SlotValueType4  # noqa: PLC0415

        d = dict(src_dict)
        slot_id = d.pop("slot_id")

        def _parse_value(
            data: object,
        ) -> bool | float | list[str] | None | SlotValueType4 | str:
            if data is None:
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                componentsschemas_slot_value_type_3 = cast(list[str], data)

                return componentsschemas_slot_value_type_3
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                componentsschemas_slot_value_type_4 = SlotValueType4.from_dict(data)

                return componentsschemas_slot_value_type_4
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(bool | float | list[str] | None | SlotValueType4 | str, data)

        value = _parse_value(d.pop("value"))

        input_mode = AnswerInputMode(d.pop("input_mode"))

        confidence = d.pop("confidence")

        def _parse_audio_uri(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        audio_uri = _parse_audio_uri(d.pop("audio_uri", UNSET))

        def _parse_audio_offset_ms(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        audio_offset_ms = _parse_audio_offset_ms(d.pop("audio_offset_ms", UNSET))

        answer = cls(
            slot_id=slot_id,
            value=value,
            input_mode=input_mode,
            confidence=confidence,
            audio_uri=audio_uri,
            audio_offset_ms=audio_offset_ms,
        )

        answer.additional_properties = d
        return answer

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
