from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="RequestAbhaOtpBody")


@_attrs_define
class RequestAbhaOtpBody:
    """Exactly one of abha_number or mobile must be set.

    Attributes:
        abha_number (None | str | Unset):
        mobile (None | str | Unset):
    """

    abha_number: None | str | Unset = UNSET
    mobile: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        abha_number: None | str | Unset
        if isinstance(self.abha_number, Unset):
            abha_number = UNSET
        else:
            abha_number = self.abha_number

        mobile: None | str | Unset
        if isinstance(self.mobile, Unset):
            mobile = UNSET
        else:
            mobile = self.mobile

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if abha_number is not UNSET:
            field_dict["abha_number"] = abha_number
        if mobile is not UNSET:
            field_dict["mobile"] = mobile

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_abha_number(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        abha_number = _parse_abha_number(d.pop("abha_number", UNSET))

        def _parse_mobile(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        mobile = _parse_mobile(d.pop("mobile", UNSET))

        request_abha_otp_body = cls(
            abha_number=abha_number,
            mobile=mobile,
        )

        request_abha_otp_body.additional_properties = d
        return request_abha_otp_body

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
