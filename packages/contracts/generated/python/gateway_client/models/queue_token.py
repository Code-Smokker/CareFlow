from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.queue_token_priority import QueueTokenPriority

if TYPE_CHECKING:
    from ..models.red_flag import RedFlag


T = TypeVar("T", bound="QueueToken")


@_attrs_define
class QueueToken:
    """
    Attributes:
        token_no (str):
        patient_id (str):
        department (str):
        priority (QueueTokenPriority):
        red_flags (list[RedFlag]):
    """

    token_no: str
    patient_id: str
    department: str
    priority: QueueTokenPriority
    red_flags: list[RedFlag]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        token_no = self.token_no

        patient_id = self.patient_id

        department = self.department

        priority = self.priority.value

        red_flags = []
        for red_flags_item_data in self.red_flags:
            red_flags_item = red_flags_item_data.to_dict()
            red_flags.append(red_flags_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "token_no": token_no,
                "patient_id": patient_id,
                "department": department,
                "priority": priority,
                "red_flags": red_flags,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.red_flag import RedFlag  # noqa: PLC0415

        d = dict(src_dict)
        token_no = d.pop("token_no")

        patient_id = d.pop("patient_id")

        department = d.pop("department")

        priority = QueueTokenPriority(d.pop("priority"))

        red_flags = []
        _red_flags = d.pop("red_flags")
        for red_flags_item_data in _red_flags:
            red_flags_item = RedFlag.from_dict(red_flags_item_data)

            red_flags.append(red_flags_item)

        queue_token = cls(
            token_no=token_no,
            patient_id=patient_id,
            department=department,
            priority=priority,
            red_flags=red_flags,
        )

        queue_token.additional_properties = d
        return queue_token

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
