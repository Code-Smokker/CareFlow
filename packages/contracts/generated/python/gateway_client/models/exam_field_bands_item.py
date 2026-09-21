from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ExamFieldBandsItem")


@_attrs_define
class ExamFieldBandsItem:
    """
    Attributes:
        value (str):
        label (str):
        gloss (str):
        below_age_years (float | None): Exclusive upper bound; null = no upper bound.
    """

    value: str
    label: str
    gloss: str
    below_age_years: float | None
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        value = self.value

        label = self.label

        gloss = self.gloss

        below_age_years: float | None
        below_age_years = self.below_age_years

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "value": value,
                "label": label,
                "gloss": gloss,
                "below_age_years": below_age_years,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        value = d.pop("value")

        label = d.pop("label")

        gloss = d.pop("gloss")

        def _parse_below_age_years(data: object) -> float | None:
            if data is None:
                return data
            return cast(float | None, data)

        below_age_years = _parse_below_age_years(d.pop("below_age_years"))

        exam_field_bands_item = cls(
            value=value,
            label=label,
            gloss=gloss,
            below_age_years=below_age_years,
        )

        exam_field_bands_item.additional_properties = d
        return exam_field_bands_item

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
