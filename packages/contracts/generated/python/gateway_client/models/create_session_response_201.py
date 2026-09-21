from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="CreateSessionResponse201")


@_attrs_define
class CreateSessionResponse201:
    """
    Attributes:
        session_id (str): Opaque session identifier.
        resume_token (str):
        qr_url (str):
        department (str):
        ayush_mode (bool):
    """

    session_id: str
    resume_token: str
    qr_url: str
    department: str
    ayush_mode: bool
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        session_id = self.session_id

        resume_token = self.resume_token

        qr_url = self.qr_url

        department = self.department

        ayush_mode = self.ayush_mode

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "session_id": session_id,
                "resume_token": resume_token,
                "qr_url": qr_url,
                "department": department,
                "ayush_mode": ayush_mode,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        session_id = d.pop("session_id")

        resume_token = d.pop("resume_token")

        qr_url = d.pop("qr_url")

        department = d.pop("department")

        ayush_mode = d.pop("ayush_mode")

        create_session_response_201 = cls(
            session_id=session_id,
            resume_token=resume_token,
            qr_url=qr_url,
            department=department,
            ayush_mode=ayush_mode,
        )

        create_session_response_201.additional_properties = d
        return create_session_response_201

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
