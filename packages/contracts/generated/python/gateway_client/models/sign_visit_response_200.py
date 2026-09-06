from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.abdm_status import AbdmStatus

T = TypeVar("T", bound="SignVisitResponse200")


@_attrs_define
class SignVisitResponse200:
    """
    Attributes:
        fhir_bundle_id (str):
        abdm_status (AbdmStatus):
        care_context_status (str): Verbatim UI-facing string — under ABDM_MODE=mock this is always "linked (mock)",
            never a fake "linked" success (docs/08-abdm-fhir.md).
    """

    fhir_bundle_id: str
    abdm_status: AbdmStatus
    care_context_status: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        fhir_bundle_id = self.fhir_bundle_id

        abdm_status = self.abdm_status.value

        care_context_status = self.care_context_status

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "fhir_bundle_id": fhir_bundle_id,
                "abdm_status": abdm_status,
                "care_context_status": care_context_status,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        fhir_bundle_id = d.pop("fhir_bundle_id")

        abdm_status = AbdmStatus(d.pop("abdm_status"))

        care_context_status = d.pop("care_context_status")

        sign_visit_response_200 = cls(
            fhir_bundle_id=fhir_bundle_id,
            abdm_status=abdm_status,
            care_context_status=care_context_status,
        )

        sign_visit_response_200.additional_properties = d
        return sign_visit_response_200

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
