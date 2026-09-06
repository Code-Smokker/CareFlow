from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="TranscribeBody")


@_attrs_define
class TranscribeBody:
    """
    Attributes:
        audio_ref (str):
        language (str): BCP-47 language tag
        streaming (bool):
    """

    audio_ref: str
    language: str
    streaming: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        audio_ref = self.audio_ref

        language = self.language

        streaming = self.streaming

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "audio_ref": audio_ref,
                "language": language,
                "streaming": streaming,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        audio_ref = d.pop("audio_ref")

        language = d.pop("language")

        streaming = d.pop("streaming")

        transcribe_body = cls(
            audio_ref=audio_ref,
            language=language,
            streaming=streaming,
        )

        transcribe_body.additional_properties = d
        return transcribe_body

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
