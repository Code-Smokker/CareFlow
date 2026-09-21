from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.ayurveda_vocabulary_prashna_groups_item import (
        AyurvedaVocabularyPrashnaGroupsItem,
    )


T = TypeVar("T", bound="AyurvedaVocabularyPrashna")


@_attrs_define
class AyurvedaVocabularyPrashna:
    """
    Attributes:
        label (str):
        gloss (str):
        groups (list[AyurvedaVocabularyPrashnaGroupsItem]):
    """

    label: str
    gloss: str
    groups: list[AyurvedaVocabularyPrashnaGroupsItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        label = self.label

        gloss = self.gloss

        groups = []
        for groups_item_data in self.groups:
            groups_item = groups_item_data.to_dict()
            groups.append(groups_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "label": label,
                "gloss": gloss,
                "groups": groups,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurveda_vocabulary_prashna_groups_item import (
            AyurvedaVocabularyPrashnaGroupsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        label = d.pop("label")

        gloss = d.pop("gloss")

        groups = []
        _groups = d.pop("groups")
        for groups_item_data in _groups:
            groups_item = AyurvedaVocabularyPrashnaGroupsItem.from_dict(
                groups_item_data
            )

            groups.append(groups_item)

        ayurveda_vocabulary_prashna = cls(
            label=label,
            gloss=gloss,
            groups=groups,
        )

        ayurveda_vocabulary_prashna.additional_properties = d
        return ayurveda_vocabulary_prashna

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
