from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="AuditLogEntry")


@_attrs_define
class AuditLogEntry:
    """
    Attributes:
        id (str):
        action (str): e.g. "redflag.acknowledge", "session.withdraw"
        resource (str): e.g. "red_flag", "intake_session"
        at (datetime.datetime):
        actor_id (None | str | Unset):
        actor_role (None | str | Unset):
        resource_id (None | str | Unset):
        reason (None | str | Unset):
    """

    id: str
    action: str
    resource: str
    at: datetime.datetime
    actor_id: None | str | Unset = UNSET
    actor_role: None | str | Unset = UNSET
    resource_id: None | str | Unset = UNSET
    reason: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        id = self.id

        action = self.action

        resource = self.resource

        at = self.at.isoformat()

        actor_id: None | str | Unset
        if isinstance(self.actor_id, Unset):
            actor_id = UNSET
        else:
            actor_id = self.actor_id

        actor_role: None | str | Unset
        if isinstance(self.actor_role, Unset):
            actor_role = UNSET
        else:
            actor_role = self.actor_role

        resource_id: None | str | Unset
        if isinstance(self.resource_id, Unset):
            resource_id = UNSET
        else:
            resource_id = self.resource_id

        reason: None | str | Unset
        if isinstance(self.reason, Unset):
            reason = UNSET
        else:
            reason = self.reason

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "id": id,
                "action": action,
                "resource": resource,
                "at": at,
            }
        )
        if actor_id is not UNSET:
            field_dict["actor_id"] = actor_id
        if actor_role is not UNSET:
            field_dict["actor_role"] = actor_role
        if resource_id is not UNSET:
            field_dict["resource_id"] = resource_id
        if reason is not UNSET:
            field_dict["reason"] = reason

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        id = d.pop("id")

        action = d.pop("action")

        resource = d.pop("resource")

        at = datetime.datetime.fromisoformat(d.pop("at"))

        def _parse_actor_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        actor_id = _parse_actor_id(d.pop("actor_id", UNSET))

        def _parse_actor_role(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        actor_role = _parse_actor_role(d.pop("actor_role", UNSET))

        def _parse_resource_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        resource_id = _parse_resource_id(d.pop("resource_id", UNSET))

        def _parse_reason(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        reason = _parse_reason(d.pop("reason", UNSET))

        audit_log_entry = cls(
            id=id,
            action=action,
            resource=resource,
            at=at,
            actor_id=actor_id,
            actor_role=actor_role,
            resource_id=resource_id,
            reason=reason,
        )

        audit_log_entry.additional_properties = d
        return audit_log_entry

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
