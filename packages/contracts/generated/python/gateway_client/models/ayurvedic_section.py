from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.ayurvedic_row import AyurvedicRow


T = TypeVar("T", bound="AyurvedicSection")


@_attrs_define
class AyurvedicSection:
    """
    Attributes:
        id (str):
        label (str):
        gloss (str):
        rows (list[AyurvedicRow]):
    """

    id: str
    label: str
    gloss: str
    rows: list[AyurvedicRow]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        label = self.label

        gloss = self.gloss

        rows = []
        for rows_item_data in self.rows:
            rows_item = rows_item_data.to_dict()
            rows.append(rows_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "label": label,
                "gloss": gloss,
                "rows": rows,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurvedic_row import AyurvedicRow  # noqa: PLC0415

        d = dict(src_dict)
        id = d.pop("id")

        label = d.pop("label")

        gloss = d.pop("gloss")

        rows = []
        _rows = d.pop("rows")
        for rows_item_data in _rows:
            rows_item = AyurvedicRow.from_dict(rows_item_data)

            rows.append(rows_item)

        ayurvedic_section = cls(
            id=id,
            label=label,
            gloss=gloss,
            rows=rows,
        )

        ayurvedic_section.additional_properties = d
        return ayurvedic_section

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
