from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.red_flag_severity import RedFlagSeverity

T = TypeVar("T", bound="RedFlag")


@_attrs_define
class RedFlag:
    """
    Attributes:
        rule_id (str):
        severity (RedFlagSeverity):
        quote (str):
        token_no (str):
    """

    rule_id: str
    severity: RedFlagSeverity
    quote: str
    token_no: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        rule_id = self.rule_id

        severity = self.severity.value

        quote = self.quote

        token_no = self.token_no

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "rule_id": rule_id,
                "severity": severity,
                "quote": quote,
                "token_no": token_no,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        rule_id = d.pop("rule_id")

        severity = RedFlagSeverity(d.pop("severity"))

        quote = d.pop("quote")

        token_no = d.pop("token_no")

        red_flag = cls(
            rule_id=rule_id,
            severity=severity,
            quote=quote,
            token_no=token_no,
        )

        red_flag.additional_properties = d
        return red_flag

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
