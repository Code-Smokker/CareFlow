from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.ayurveda_vocabulary_prakriti_scoring_doshas_item import (
        AyurvedaVocabularyPrakritiScoringDoshasItem,
    )
    from ..models.ayurveda_vocabulary_prakriti_scoring_slots import (
        AyurvedaVocabularyPrakritiScoringSlots,
    )


T = TypeVar("T", bound="AyurvedaVocabularyPrakritiScoring")


@_attrs_define
class AyurvedaVocabularyPrakritiScoring:
    """
    Attributes:
        label (str):
        gloss (str):
        caveat (str):
        doshas (list[AyurvedaVocabularyPrakritiScoringDoshasItem]):
        slots (AyurvedaVocabularyPrakritiScoringSlots): slot id → (option value → dosha value)
    """

    label: str
    gloss: str
    caveat: str
    doshas: list[AyurvedaVocabularyPrakritiScoringDoshasItem]
    slots: AyurvedaVocabularyPrakritiScoringSlots
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        label = self.label

        gloss = self.gloss

        caveat = self.caveat

        doshas = []
        for doshas_item_data in self.doshas:
            doshas_item = doshas_item_data.to_dict()
            doshas.append(doshas_item)

        slots = self.slots.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "label": label,
                "gloss": gloss,
                "caveat": caveat,
                "doshas": doshas,
                "slots": slots,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurveda_vocabulary_prakriti_scoring_doshas_item import (
            AyurvedaVocabularyPrakritiScoringDoshasItem,  # noqa: PLC0415
        )
        from ..models.ayurveda_vocabulary_prakriti_scoring_slots import (
            AyurvedaVocabularyPrakritiScoringSlots,  # noqa: PLC0415
        )

        d = dict(src_dict)
        label = d.pop("label")

        gloss = d.pop("gloss")

        caveat = d.pop("caveat")

        doshas = []
        _doshas = d.pop("doshas")
        for doshas_item_data in _doshas:
            doshas_item = AyurvedaVocabularyPrakritiScoringDoshasItem.from_dict(
                doshas_item_data
            )

            doshas.append(doshas_item)

        slots = AyurvedaVocabularyPrakritiScoringSlots.from_dict(d.pop("slots"))

        ayurveda_vocabulary_prakriti_scoring = cls(
            label=label,
            gloss=gloss,
            caveat=caveat,
            doshas=doshas,
            slots=slots,
        )

        ayurveda_vocabulary_prakriti_scoring.additional_properties = d
        return ayurveda_vocabulary_prakriti_scoring

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
