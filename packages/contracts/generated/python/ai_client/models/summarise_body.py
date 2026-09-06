from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.answer import Answer
    from ..models.summarise_body_extractions_item import SummariseBodyExtractionsItem


T = TypeVar("T", bound="SummariseBody")


@_attrs_define
class SummariseBody:
    """
    Attributes:
        answers (list[Answer]):
        extractions (list[SummariseBodyExtractionsItem]):
    """

    answers: list[Answer]
    extractions: list[SummariseBodyExtractionsItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        answers = []
        for answers_item_data in self.answers:
            answers_item = answers_item_data.to_dict()
            answers.append(answers_item)

        extractions = []
        for extractions_item_data in self.extractions:
            extractions_item = extractions_item_data.to_dict()
            extractions.append(extractions_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "answers": answers,
                "extractions": extractions,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.answer import Answer  # noqa: PLC0415
        from ..models.summarise_body_extractions_item import (
            SummariseBodyExtractionsItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        answers = []
        _answers = d.pop("answers")
        for answers_item_data in _answers:
            answers_item = Answer.from_dict(answers_item_data)

            answers.append(answers_item)

        extractions = []
        _extractions = d.pop("extractions")
        for extractions_item_data in _extractions:
            extractions_item = SummariseBodyExtractionsItem.from_dict(
                extractions_item_data
            )

            extractions.append(extractions_item)

        summarise_body = cls(
            answers=answers,
            extractions=extractions,
        )

        summarise_body.additional_properties = d
        return summarise_body

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
