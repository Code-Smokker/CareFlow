from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.exam_section import ExamSection


T = TypeVar("T", bound="ExamStep")


@_attrs_define
class ExamStep:
    """
    Attributes:
        id (str):
        label (str):
        gloss (str):
        sections (list[ExamSection]):
    """

    id: str
    label: str
    gloss: str
    sections: list[ExamSection]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        label = self.label

        gloss = self.gloss

        sections = []
        for sections_item_data in self.sections:
            sections_item = sections_item_data.to_dict()
            sections.append(sections_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "label": label,
                "gloss": gloss,
                "sections": sections,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.exam_section import ExamSection  # noqa: PLC0415

        d = dict(src_dict)
        id = d.pop("id")

        label = d.pop("label")

        gloss = d.pop("gloss")

        sections = []
        _sections = d.pop("sections")
        for sections_item_data in _sections:
            sections_item = ExamSection.from_dict(sections_item_data)

            sections.append(sections_item)

        exam_step = cls(
            id=id,
            label=label,
            gloss=gloss,
            sections=sections,
        )

        exam_step.additional_properties = d
        return exam_step

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
