from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.input_mode import InputMode
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.answer_value_type_4 import AnswerValueType4


T = TypeVar("T", bound="AnswerSubmission")


@_attrs_define
class AnswerSubmission:
    """
    Attributes:
        slot_id (str):
        value (AnswerValueType4 | bool | float | list[str] | str): Typed per the slot schema declared in
            packages/ontology.
        input_mode (InputMode): How the patient supplied this answer. Maps to answer.source (CLAUDE.md rule 4).
        confidence (float | None | Unset):
        audio_uri (None | str | Unset):
    """

    slot_id: str
    value: AnswerValueType4 | bool | float | list[str] | str
    input_mode: InputMode
    confidence: float | None | Unset = UNSET
    audio_uri: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.answer_value_type_4 import AnswerValueType4  # noqa: PLC0415

        slot_id = self.slot_id

        value: bool | dict[str, Any] | float | list[str] | str
        if isinstance(self.value, list):
            value = self.value

        elif isinstance(self.value, AnswerValueType4):
            value = self.value.to_dict()
        else:
            value = self.value

        input_mode = self.input_mode.value

        confidence: float | None | Unset
        if isinstance(self.confidence, Unset):
            confidence = UNSET
        else:
            confidence = self.confidence

        audio_uri: None | str | Unset
        if isinstance(self.audio_uri, Unset):
            audio_uri = UNSET
        else:
            audio_uri = self.audio_uri

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "slot_id": slot_id,
                "value": value,
                "input_mode": input_mode,
            }
        )
        if confidence is not UNSET:
            field_dict["confidence"] = confidence
        if audio_uri is not UNSET:
            field_dict["audio_uri"] = audio_uri

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.answer_value_type_4 import AnswerValueType4  # noqa: PLC0415

        d = dict(src_dict)
        slot_id = d.pop("slot_id")

        def _parse_value(
            data: object,
        ) -> AnswerValueType4 | bool | float | list[str] | str:
            try:
                if not isinstance(data, list):
                    raise TypeError()
                componentsschemas_answer_value_type_3 = cast(list[str], data)

                return componentsschemas_answer_value_type_3
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                componentsschemas_answer_value_type_4 = AnswerValueType4.from_dict(data)

                return componentsschemas_answer_value_type_4
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(AnswerValueType4 | bool | float | list[str] | str, data)

        value = _parse_value(d.pop("value"))

        input_mode = InputMode(d.pop("input_mode"))

        def _parse_confidence(data: object) -> float | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(float | None | Unset, data)

        confidence = _parse_confidence(d.pop("confidence", UNSET))

        def _parse_audio_uri(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        audio_uri = _parse_audio_uri(d.pop("audio_uri", UNSET))

        answer_submission = cls(
            slot_id=slot_id,
            value=value,
            input_mode=input_mode,
            confidence=confidence,
            audio_uri=audio_uri,
        )

        answer_submission.additional_properties = d
        return answer_submission

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
