from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.red_flag_severity import RedFlagSeverity
from ..types import UNSET, Unset

T = TypeVar("T", bound="RedFlag")


@_attrs_define
class RedFlag:
    """
    Attributes:
        id (str): The fired red_flag row's id — acknowledge it via POST /v1/redflags/{id}/acknowledge.
        rule_id (str):
        severity (RedFlagSeverity):
        quote (str):
        token_no (str):
        acknowledged_by (None | str | Unset):
        acknowledged_at (datetime.datetime | None | Unset):
    """

    id: str
    rule_id: str
    severity: RedFlagSeverity
    quote: str
    token_no: str
    acknowledged_by: None | str | Unset = UNSET
    acknowledged_at: datetime.datetime | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        rule_id = self.rule_id

        severity = self.severity.value

        quote = self.quote

        token_no = self.token_no

        acknowledged_by: None | str | Unset
        if isinstance(self.acknowledged_by, Unset):
            acknowledged_by = UNSET
        else:
            acknowledged_by = self.acknowledged_by

        acknowledged_at: None | str | Unset
        if isinstance(self.acknowledged_at, Unset):
            acknowledged_at = UNSET
        elif isinstance(self.acknowledged_at, datetime.datetime):
            acknowledged_at = self.acknowledged_at.isoformat()
        else:
            acknowledged_at = self.acknowledged_at

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "rule_id": rule_id,
                "severity": severity,
                "quote": quote,
                "token_no": token_no,
            }
        )
        if acknowledged_by is not UNSET:
            field_dict["acknowledged_by"] = acknowledged_by
        if acknowledged_at is not UNSET:
            field_dict["acknowledged_at"] = acknowledged_at

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        id = d.pop("id")

        rule_id = d.pop("rule_id")

        severity = RedFlagSeverity(d.pop("severity"))

        quote = d.pop("quote")

        token_no = d.pop("token_no")

        def _parse_acknowledged_by(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        acknowledged_by = _parse_acknowledged_by(d.pop("acknowledged_by", UNSET))

        def _parse_acknowledged_at(data: object) -> datetime.datetime | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                acknowledged_at_type_0 = datetime.datetime.fromisoformat(data)

                return acknowledged_at_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(datetime.datetime | None | Unset, data)

        acknowledged_at = _parse_acknowledged_at(d.pop("acknowledged_at", UNSET))

        red_flag = cls(
            id=id,
            rule_id=rule_id,
            severity=severity,
            quote=quote,
            token_no=token_no,
            acknowledged_by=acknowledged_by,
            acknowledged_at=acknowledged_at,
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
