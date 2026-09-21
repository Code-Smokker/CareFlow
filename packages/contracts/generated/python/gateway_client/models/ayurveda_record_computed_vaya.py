from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.ayurveda_record_computed_vaya_age_source_type_1 import (
    AyurvedaRecordComputedVayaAgeSourceType1,
)
from ..models.ayurveda_record_computed_vaya_age_source_type_2_type_1 import (
    AyurvedaRecordComputedVayaAgeSourceType2Type1,
)
from ..models.ayurveda_record_computed_vaya_age_source_type_3_type_1 import (
    AyurvedaRecordComputedVayaAgeSourceType3Type1,
)

T = TypeVar("T", bound="AyurvedaRecordComputedVaya")


@_attrs_define
class AyurvedaRecordComputedVaya:
    """
    Attributes:
        age_years (int | None):
        age_source (AyurvedaRecordComputedVayaAgeSourceType1 | AyurvedaRecordComputedVayaAgeSourceType2Type1 |
            AyurvedaRecordComputedVayaAgeSourceType3Type1 | None):
        band (None | str):
    """

    age_years: int | None
    age_source: (
        AyurvedaRecordComputedVayaAgeSourceType1
        | AyurvedaRecordComputedVayaAgeSourceType2Type1
        | AyurvedaRecordComputedVayaAgeSourceType3Type1
        | None
    )
    band: None | str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        age_years: int | None
        age_years = self.age_years

        age_source: None | str
        if isinstance(self.age_source, AyurvedaRecordComputedVayaAgeSourceType1):
            age_source = self.age_source.value
        elif isinstance(self.age_source, AyurvedaRecordComputedVayaAgeSourceType2Type1):
            age_source = self.age_source.value
        elif isinstance(self.age_source, AyurvedaRecordComputedVayaAgeSourceType3Type1):
            age_source = self.age_source.value
        else:
            age_source = self.age_source

        band: None | str
        band = self.band

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "age_years": age_years,
                "age_source": age_source,
                "band": band,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_age_years(data: object) -> int | None:
            if data is None:
                return data
            return cast(int | None, data)

        age_years = _parse_age_years(d.pop("age_years"))

        def _parse_age_source(
            data: object,
        ) -> (
            AyurvedaRecordComputedVayaAgeSourceType1
            | AyurvedaRecordComputedVayaAgeSourceType2Type1
            | AyurvedaRecordComputedVayaAgeSourceType3Type1
            | None
        ):
            if data is None:
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                age_source_type_1 = AyurvedaRecordComputedVayaAgeSourceType1(data)

                return age_source_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                age_source_type_2_type_1 = (
                    AyurvedaRecordComputedVayaAgeSourceType2Type1(data)
                )

                return age_source_type_2_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                age_source_type_3_type_1 = (
                    AyurvedaRecordComputedVayaAgeSourceType3Type1(data)
                )

                return age_source_type_3_type_1
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(
                AyurvedaRecordComputedVayaAgeSourceType1
                | AyurvedaRecordComputedVayaAgeSourceType2Type1
                | AyurvedaRecordComputedVayaAgeSourceType3Type1
                | None,
                data,
            )

        age_source = _parse_age_source(d.pop("age_source"))

        def _parse_band(data: object) -> None | str:
            if data is None:
                return data
            return cast(None | str, data)

        band = _parse_band(d.pop("band"))

        ayurveda_record_computed_vaya = cls(
            age_years=age_years,
            age_source=age_source,
            band=band,
        )

        ayurveda_record_computed_vaya.additional_properties = d
        return ayurveda_record_computed_vaya

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
