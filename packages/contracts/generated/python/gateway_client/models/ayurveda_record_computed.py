from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.ayurveda_record_computed_vaya import AyurvedaRecordComputedVaya


T = TypeVar("T", bound="AyurvedaRecordComputed")


@_attrs_define
class AyurvedaRecordComputed:
    """
    Attributes:
        bmi (float | None):
        vaya (AyurvedaRecordComputedVaya):
    """

    bmi: float | None
    vaya: AyurvedaRecordComputedVaya
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        bmi: float | None
        bmi = self.bmi

        vaya = self.vaya.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "bmi": bmi,
                "vaya": vaya,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.ayurveda_record_computed_vaya import (
            AyurvedaRecordComputedVaya,  # noqa: PLC0415
        )

        d = dict(src_dict)

        def _parse_bmi(data: object) -> float | None:
            if data is None:
                return data
            return cast(float | None, data)

        bmi = _parse_bmi(d.pop("bmi"))

        vaya = AyurvedaRecordComputedVaya.from_dict(d.pop("vaya"))

        ayurveda_record_computed = cls(
            bmi=bmi,
            vaya=vaya,
        )

        ayurveda_record_computed.additional_properties = d
        return ayurveda_record_computed

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
