from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.demographics import Demographics


T = TypeVar("T", bound="IdentifyByAbhaQrResponse200")


@_attrs_define
class IdentifyByAbhaQrResponse200:
    """
    Attributes:
        patient_id (str):
        demographics (Demographics):
    """

    patient_id: str
    demographics: Demographics
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        patient_id = self.patient_id

        demographics = self.demographics.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "patient_id": patient_id,
                "demographics": demographics,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.demographics import Demographics  # noqa: PLC0415

        d = dict(src_dict)
        patient_id = d.pop("patient_id")

        demographics = Demographics.from_dict(d.pop("demographics"))

        identify_by_abha_qr_response_200 = cls(
            patient_id=patient_id,
            demographics=demographics,
        )

        identify_by_abha_qr_response_200.additional_properties = d
        return identify_by_abha_qr_response_200

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
