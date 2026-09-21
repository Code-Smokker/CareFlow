from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.exam_field import ExamField


T = TypeVar("T", bound="ExamSection")


@_attrs_define
class ExamSection:
    """
    Attributes:
        id (str):
        label (str):
        gloss (str):
        fields (list[ExamField]):
        link_to_step (str | Unset): This section is a pointer to another step, not a form.
        show_prakriti_score (bool | Unset): Show the patient's Prakriti questionnaire score beside this section, as
            reference only.
    """

    id: str
    label: str
    gloss: str
    fields: list[ExamField]
    link_to_step: str | Unset = UNSET
    show_prakriti_score: bool | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        label = self.label

        gloss = self.gloss

        fields = []
        for fields_item_data in self.fields:
            fields_item = fields_item_data.to_dict()
            fields.append(fields_item)

        link_to_step = self.link_to_step

        show_prakriti_score = self.show_prakriti_score

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "label": label,
                "gloss": gloss,
                "fields": fields,
            }
        )
        if link_to_step is not UNSET:
            field_dict["link_to_step"] = link_to_step
        if show_prakriti_score is not UNSET:
            field_dict["show_prakriti_score"] = show_prakriti_score

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.exam_field import ExamField  # noqa: PLC0415

        d = dict(src_dict)
        id = d.pop("id")

        label = d.pop("label")

        gloss = d.pop("gloss")

        fields = []
        _fields = d.pop("fields")
        for fields_item_data in _fields:
            fields_item = ExamField.from_dict(fields_item_data)

            fields.append(fields_item)

        link_to_step = d.pop("link_to_step", UNSET)

        show_prakriti_score = d.pop("show_prakriti_score", UNSET)

        exam_section = cls(
            id=id,
            label=label,
            gloss=gloss,
            fields=fields,
            link_to_step=link_to_step,
            show_prakriti_score=show_prakriti_score,
        )

        exam_section.additional_properties = d
        return exam_section

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
