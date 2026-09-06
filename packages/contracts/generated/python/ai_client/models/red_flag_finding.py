from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.red_flag_finding_severity import RedFlagFindingSeverity

T = TypeVar("T", bound="RedFlagFinding")


@_attrs_define
class RedFlagFinding:
    """No token_no here (unlike gateway.yaml's RedFlag) — this service evaluates rules over slots with no visit/queue
    context. The caller (gateway) attaches token_no when it relays a finding onward as a RedFlag.

        Attributes:
            rule_id (str):
            severity (RedFlagFindingSeverity):
            quote (str):
    """

    rule_id: str
    severity: RedFlagFindingSeverity
    quote: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        rule_id = self.rule_id

        severity = self.severity.value

        quote = self.quote

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "rule_id": rule_id,
                "severity": severity,
                "quote": quote,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        rule_id = d.pop("rule_id")

        severity = RedFlagFindingSeverity(d.pop("severity"))

        quote = d.pop("quote")

        red_flag_finding = cls(
            rule_id=rule_id,
            severity=severity,
            quote=quote,
        )

        red_flag_finding.additional_properties = d
        return red_flag_finding

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
