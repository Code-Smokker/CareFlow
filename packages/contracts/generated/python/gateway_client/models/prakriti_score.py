from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.prakriti_score_counts_item import PrakritiScoreCountsItem


T = TypeVar("T", bound="PrakritiScore")


@_attrs_define
class PrakritiScore:
    """A count per dosha of the patient's questionnaire answers, REFERENCE only. There is deliberately no "dominant dosha"
    field — CareFlow never asserts a constitution.

        Attributes:
            label (str):
            gloss (str):
            caveat (str):
            counts (list[PrakritiScoreCountsItem]):
            answered (int):
            total (int):
    """

    label: str
    gloss: str
    caveat: str
    counts: list[PrakritiScoreCountsItem]
    answered: int
    total: int
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        label = self.label

        gloss = self.gloss

        caveat = self.caveat

        counts = []
        for counts_item_data in self.counts:
            counts_item = counts_item_data.to_dict()
            counts.append(counts_item)

        answered = self.answered

        total = self.total

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "label": label,
                "gloss": gloss,
                "caveat": caveat,
                "counts": counts,
                "answered": answered,
                "total": total,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.prakriti_score_counts_item import (
            PrakritiScoreCountsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        label = d.pop("label")

        gloss = d.pop("gloss")

        caveat = d.pop("caveat")

        counts = []
        _counts = d.pop("counts")
        for counts_item_data in _counts:
            counts_item = PrakritiScoreCountsItem.from_dict(counts_item_data)

            counts.append(counts_item)

        answered = d.pop("answered")

        total = d.pop("total")

        prakriti_score = cls(
            label=label,
            gloss=gloss,
            caveat=caveat,
            counts=counts,
            answered=answered,
            total=total,
        )

        prakriti_score.additional_properties = d
        return prakriti_score

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
