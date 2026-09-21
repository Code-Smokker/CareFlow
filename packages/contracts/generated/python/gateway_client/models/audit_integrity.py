from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.audit_integrity_triggers_item import AuditIntegrityTriggersItem


T = TypeVar("T", bound="AuditIntegrity")


@_attrs_define
class AuditIntegrity:
    """Live pg_trigger lookup against audit_log at request time — not a stored flag, so it cannot silently go stale if a
    migration ever removed the trigger.

        Attributes:
            enforced (bool): True only if both audit_log_no_update and audit_log_no_delete exist and are enabled.
            triggers (list[AuditIntegrityTriggersItem]):
    """

    enforced: bool
    triggers: list[AuditIntegrityTriggersItem]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        enforced = self.enforced

        triggers = []
        for triggers_item_data in self.triggers:
            triggers_item = triggers_item_data.to_dict()
            triggers.append(triggers_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "enforced": enforced,
                "triggers": triggers,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.audit_integrity_triggers_item import (
            AuditIntegrityTriggersItem,  # noqa: PLC0415
        )

        d = dict(src_dict)
        enforced = d.pop("enforced")

        triggers = []
        _triggers = d.pop("triggers")
        for triggers_item_data in _triggers:
            triggers_item = AuditIntegrityTriggersItem.from_dict(triggers_item_data)

            triggers.append(triggers_item)

        audit_integrity = cls(
            enforced=enforced,
            triggers=triggers,
        )

        audit_integrity.additional_properties = d
        return audit_integrity

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
