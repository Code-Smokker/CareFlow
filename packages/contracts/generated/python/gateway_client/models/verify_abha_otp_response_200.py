from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="VerifyAbhaOtpResponse200")


@_attrs_define
class VerifyAbhaOtpResponse200:
    """
    Attributes:
        patient_id (str):
        token (str):
    """

    patient_id: str
    token: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        patient_id = self.patient_id

        token = self.token

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "patient_id": patient_id,
                "token": token,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        patient_id = d.pop("patient_id")

        token = d.pop("token")

        verify_abha_otp_response_200 = cls(
            patient_id=patient_id,
            token=token,
        )

        verify_abha_otp_response_200.additional_properties = d
        return verify_abha_otp_response_200

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
