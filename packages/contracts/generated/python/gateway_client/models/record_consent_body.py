from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.consent_scope import ConsentScope
from ..types import UNSET, Unset

T = TypeVar("T", bound="RecordConsentBody")


@_attrs_define
class RecordConsentBody:
    """
    Attributes:
        scopes (list[ConsentScope]):
        audio_uri (None | str | Unset): Recorded verbal consent, when voice consent was used
    """

    scopes: list[ConsentScope]
    audio_uri: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        scopes = []
        for scopes_item_data in self.scopes:
            scopes_item = scopes_item_data.value
            scopes.append(scopes_item)

        audio_uri: None | str | Unset
        if isinstance(self.audio_uri, Unset):
            audio_uri = UNSET
        else:
            audio_uri = self.audio_uri

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "scopes": scopes,
            }
        )
        if audio_uri is not UNSET:
            field_dict["audio_uri"] = audio_uri

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        scopes = []
        _scopes = d.pop("scopes")
        for scopes_item_data in _scopes:
            scopes_item = ConsentScope(scopes_item_data)

            scopes.append(scopes_item)

        def _parse_audio_uri(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        audio_uri = _parse_audio_uri(d.pop("audio_uri", UNSET))

        record_consent_body = cls(
            scopes=scopes,
            audio_uri=audio_uri,
        )

        record_consent_body.additional_properties = d
        return record_consent_body

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
