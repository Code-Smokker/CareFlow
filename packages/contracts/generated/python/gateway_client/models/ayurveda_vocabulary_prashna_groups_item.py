from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="AyurvedaVocabularyPrashnaGroupsItem")


@_attrs_define
class AyurvedaVocabularyPrashnaGroupsItem:
    """
    Attributes:
        id (str):
        label (str):
        gloss (str):
        module (None | str): Interview module id; null = the chief-complaint module the patient picked.
    """

    id: str
    label: str
    gloss: str
    module: None | str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        label = self.label

        gloss = self.gloss

        module: None | str
        module = self.module

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "label": label,
                "gloss": gloss,
                "module": module,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        id = d.pop("id")

        label = d.pop("label")

        gloss = d.pop("gloss")

        def _parse_module(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        module = _parse_module(d.pop("module"))

        ayurveda_vocabulary_prashna_groups_item = cls(
            id=id,
            label=label,
            gloss=gloss,
            module=module,
        )

        ayurveda_vocabulary_prashna_groups_item.additional_properties = d
        return ayurveda_vocabulary_prashna_groups_item

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
