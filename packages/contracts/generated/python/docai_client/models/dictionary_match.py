from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.dictionary_match_system import DictionaryMatchSystem
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.dictionary_match_metadata_type_0 import DictionaryMatchMetadataType0


T = TypeVar("T", bound="DictionaryMatch")


@_attrs_define
class DictionaryMatch:
    """
    Attributes:
        id (str):
        system (DictionaryMatchSystem):
        canonical_name (str):
        synonyms (list[str]):
        score (float):
        metadata (DictionaryMatchMetadataType0 | None | Unset):
    """

    id: str
    system: DictionaryMatchSystem
    canonical_name: str
    synonyms: list[str]
    score: float
    metadata: DictionaryMatchMetadataType0 | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.dictionary_match_metadata_type_0 import (
            DictionaryMatchMetadataType0,  # noqa: PLC0415
        )

        id = self.id

        system = self.system.value

        canonical_name = self.canonical_name

        synonyms = self.synonyms

        score = self.score

        metadata: dict[str, Any] | None | Unset
        if isinstance(self.metadata, Unset):
            metadata = UNSET
        elif isinstance(self.metadata, DictionaryMatchMetadataType0):
            metadata = self.metadata.to_dict()
        else:
            metadata = self.metadata

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "system": system,
                "canonical_name": canonical_name,
                "synonyms": synonyms,
                "score": score,
            }
        )
        if metadata is not UNSET:
            field_dict["metadata"] = metadata

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.dictionary_match_metadata_type_0 import (
            DictionaryMatchMetadataType0,  # noqa: PLC0415
        )

        d = dict(src_dict)
        id = d.pop("id")

        system = DictionaryMatchSystem(d.pop("system"))

        canonical_name = d.pop("canonical_name")

        synonyms = cast(list[str], d.pop("synonyms"))

        score = d.pop("score")

        def _parse_metadata(
            data: object,
        ) -> DictionaryMatchMetadataType0 | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                metadata_type_0 = DictionaryMatchMetadataType0.from_dict(data)

                return metadata_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(DictionaryMatchMetadataType0 | None | Unset, data)

        metadata = _parse_metadata(d.pop("metadata", UNSET))

        dictionary_match = cls(
            id=id,
            system=system,
            canonical_name=canonical_name,
            synonyms=synonyms,
            score=score,
            metadata=metadata,
        )

        dictionary_match.additional_properties = d
        return dictionary_match

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
